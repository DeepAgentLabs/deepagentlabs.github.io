"""Regression checks for repository-owned, product-scoped navigation."""
import json
import shutil
import subprocess
import tempfile
import unittest
from pathlib import Path

from build_docs import category, prepare


class NavigationTests(unittest.TestCase):
    def test_curated_tasks_precede_existing_reference(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            repo = root / "product"
            docs = repo / "docs"
            (docs / "guide").mkdir(parents=True)
            for filename in ("index.md", "developer-guide.md", "guide/quickstart.md", "api-reference.md"):
                (docs / filename).write_text("# Example\n", encoding="utf-8")
            for filename in ("roadmap.md", "aios-0.8-compatibility.md", "release-notes.md"):
                (docs / filename).write_text("# Release notes 1.0.0\n", encoding="utf-8")
            internal_pages = {
                "next-steps.md": "Next steps",
                "phase6-containment.md": "MCP Phase 6 coordinated containment release",
                "public-api.md": "Public API candidate",
                "support.md": "Support and release compatibility",
            }
            for filename, heading in internal_pages.items():
                (docs / filename).write_text("# " + heading + "\n", encoding="utf-8")
            (docs / "navigation.json").write_text(json.dumps([
                {"Overview": "index.md"},
                {"Developer guide": "developer-guide.md"},
                {"Quickstart": "guide/quickstart.md"},
                {"API reference": "api-reference.md"},
            ]), encoding="utf-8")
            config = prepare("agentic-evals", repo, root / "staging")
            self.assertEqual(config.nav[0]["Getting started"], [
                {"Overview": "index.md"},
                {"Developer guide": "developer-guide.md"},
                {"Quickstart": "guide/quickstart.md"},
            ])
            self.assertTrue(config.extra["has_developer_guide"])
            self.assertEqual(config.site_url, "https://deepagentlabs.io/agentic-evals/docs/")
            self.assertIn({"How-to guides": [{"API reference": "api-reference.md"}]}, config.nav)
            self.assertNotIn("Compatibility and releases", json.dumps(config.nav))
            self.assertNotIn("release-notes.md", json.dumps(config.nav))
            overview = (root / "staging/index.md").read_text(encoding="utf-8")
            self.assertNotIn("Compatibility and releases", overview)
            self.assertNotIn("aios-0.8-compatibility.md", overview)
            self.assertTrue((root / "staging/aios-0.8-compatibility.md").is_file())
            self.assertIn("exclude: true", (root / "staging/release-notes.md").read_text())
            for filename, heading in internal_pages.items():
                self.assertNotIn(filename, json.dumps(config.nav))
                self.assertNotIn(heading, overview)
                self.assertIn("exclude: true", (root / "staging" / filename).read_text())
            targets = [target for group in config.nav for entries in group.values()
                       for entry in entries for target in entry.values()]
            self.assertEqual(len(targets), len(set(targets)))
            self.assertTrue(config.extra["has_api_reference"])

    def test_navigation_group_pins_curated_pages(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            docs = root / "product" / "docs"
            docs.mkdir(parents=True)
            for filename in ("index.md", "developer-guide.md", "api-reference.md", "ai-reference-index.md"):
                (docs / filename).write_text("# Example\n", encoding="utf-8")
            (docs / "navigation.json").write_text(json.dumps([
                {"Overview": "index.md"},
                {"Developer guide": "developer-guide.md"},
                {"API reference": "api-reference.md", "group": "Getting started"},
                {"AI readable": "ai-reference-index.md", "group": "Getting started"},
            ]), encoding="utf-8")
            config = prepare("agentic-evals", root / "product", root / "staging")
            self.assertEqual(config.nav[0]["Getting started"], [
                {"Overview": "index.md"},
                {"Developer guide": "developer-guide.md"},
                {"API reference": "api-reference.md"},
                {"AI readable": "ai-reference-index.md"},
            ])
            self.assertTrue(config.extra["has_api_reference"])
            self.assertEqual(config.extra["api_reference_url"], "api-reference/")

    def test_ai_readable_entry_links_the_raw_reference(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            docs = root / "product" / "docs"
            docs.mkdir(parents=True)
            for filename in ("index.md", "developer-guide.md", "api-reference.md", "ai-reference-index.md"):
                (docs / filename).write_text("# Example\n", encoding="utf-8")
            (docs / "llms-full.md").write_text("# Raw reference\n", encoding="utf-8")
            (docs / "navigation.json").write_text(json.dumps([
                {"Overview": "index.md"},
                {"Developer guide": "developer-guide.md"},
                {"API reference": "api-reference.md", "group": "Getting started"},
                {"AI Readable Documentation": "llms-full.md", "group": "Getting started"},
            ]), encoding="utf-8")
            config = prepare("agentic-evals", root / "product", root / "staging")
            self.assertEqual(config.nav[0]["Getting started"][-1],
                             {"AI Readable Documentation": "/agentic-evals/docs/llms-full.md"})
            # The capability index is no longer a curated page: kept out of nav and search.
            self.assertNotIn("ai-reference-index.md", json.dumps(config.nav))
            self.assertIn("exclude: true", (root / "staging/ai-reference-index.md").read_text())
            (docs / "llms-full.md").unlink()
            with self.assertRaisesRegex(ValueError, "has none"):
                prepare("agentic-evals", root / "product", root / "staging2")

    def test_unknown_navigation_group_is_rejected(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            docs = root / "product" / "docs"
            docs.mkdir(parents=True)
            for filename in ("index.md", "api-reference.md"):
                (docs / filename).write_text("# Example\n", encoding="utf-8")
            (docs / "navigation.json").write_text(json.dumps([
                {"Overview": "index.md"},
                {"API reference": "api-reference.md", "group": "Nowhere"},
            ]), encoding="utf-8")
            with self.assertRaisesRegex(ValueError, "Unknown navigation group"):
                prepare("agentic-evals", root / "product", root / "staging")

    def test_spec_layout_uses_tracked_sources_and_nested_guides(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            repo = root / "ai-operations-spec"
            (repo / "scripts").mkdir(parents=True)
            # Exercise the actual publication script against an isolated index.
            website = Path(__file__).resolve().parents[1]
            source = next((candidate for candidate in (
                website.parent / "ai-operations-spec/scripts/build_docs.py",
                website / "_sources/ai-operations-spec/scripts/build_docs.py",
            ) if candidate.is_file()), None)
            if source is None:
                # Website CI only needs its tiny source fixture; the script is supplied by the checkout.
                self.skipTest("AIOS checkout is required for its publication-boundary test")
            shutil.copy2(source, repo / "scripts/build_docs.py")
            files = {
                "README.md": "# AIOS\n",
                "docs/developer-guide.md": "# Developer guide\n\n## Quickstart\n",
                "docs/ai-reference-index.md": "# Capability index\n",
                "docs/api-reference.md": "# API Reference (detailed)\n",
                "docs/llms-full.md": "# Raw reference\n\n[Home](../README.md)\n",
                "docs/ai-docs-manifest.json": "{}",
                "docs/navigation.json": json.dumps([
                    {"Overview": "index.md"},
                    {"Developer Guide (simple)": "docs/developer-guide.md"},
                    {"API Reference (detailed)": "docs/api-reference.md", "group": "Getting started"},
                    {"AI Readable Documentation": "docs/ai-reference-index.md", "group": "Getting started"},
                ]),
                "specification/v0.8/schemas/audit_event.schema.json": '{"$id":"unchanged"}',
            }
            for relative, content in files.items():
                path = repo / relative
                path.parent.mkdir(parents=True, exist_ok=True)
                path.write_text(content, encoding="utf-8")
            subprocess.run(["git", "init", "-q", str(repo)], check=True)
            subprocess.run(["git", "add", "."], cwd=repo, check=True)
            (repo / "docs/untracked.md").write_text("private")
            config = prepare("ai-operations-spec", repo, root / "staging")
            self.assertTrue(config.extra["has_developer_guide"])
            self.assertTrue(config.extra["has_ai_reference"])
            self.assertEqual(config.extra["developer_guide_url"], "docs/developer-guide/")
            self.assertEqual(config.site_url, "https://deepagentlabs.io/ai-operations-spec/docs/")
            self.assertIn("docs/ai-reference-index.md", json.dumps(config.nav))
            # The header must reach the nested page, not a missing root api-reference/.
            self.assertTrue(config.extra["has_api_reference"])
            self.assertEqual(config.extra["api_reference_url"], "docs/api-reference/")
            self.assertEqual(config.nav[0]["Getting started"][2], {"API Reference (detailed)": "docs/api-reference.md"})
            staged = root / "staging"
            self.assertFalse((staged / "docs/untracked.md").exists())
            self.assertFalse((staged / "scripts").exists())
            self.assertEqual((staged / "llms-full.md").read_text(), files["docs/llms-full.md"])
            self.assertTrue((staged / "v0.8/audit_event.schema.json").is_file())
            # The product menu lists the shared specification after every product.
            self.assertEqual(config.extra["products"][-1]["name"], "AI Operations Specification")
            self.assertEqual(config.extra["products"][0]["name"], "AgenticLens")

    def test_release_notes_are_separate_from_task_guides(self):
        for filename in ("aios-0.8-operational-artifacts.md", "coordinated-v1-readiness.md", "v1.0.md"):
            self.assertEqual(category(Path(filename)), "Compatibility and releases")


if __name__ == "__main__":
    unittest.main()
