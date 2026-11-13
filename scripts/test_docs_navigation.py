"""Regression checks for repository-owned, product-scoped navigation."""
import json
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

    def test_release_notes_are_separate_from_task_guides(self):
        for filename in ("aios-0.8-operational-artifacts.md", "coordinated-v1-readiness.md", "v1.0.md"):
            self.assertEqual(category(Path(filename)), "Compatibility and releases")


if __name__ == "__main__":
    unittest.main()
