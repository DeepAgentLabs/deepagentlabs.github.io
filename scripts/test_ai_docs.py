"""Check provenance, freshness, and source-code preservation in AI packs."""

import hashlib
import json
import tempfile
import unittest
from pathlib import Path

from build_ai_docs import build


class AIDocsTests(unittest.TestCase):
    def fixture(self, root):
        repo = root / "example-product"
        docs = repo / "docs"
        docs.mkdir(parents=True)
        (repo / "pyproject.toml").write_text('[project]\nname="example-product"\nrequires-python=">=3.10"\n', encoding="utf-8")
        (docs / "reference.md").write_text('# Reference\n\n[Guide](guide.md)\n\n```python\nprint("[data](missing.md)")\n```\n', encoding="utf-8")
        (docs / "guide.md").write_text("# Guide\n", encoding="utf-8")
        (repo / "api.py").write_text('raise RuntimeError("Do not import")\nclass Record:\n    ALLOWED = "allow"\n    count: int = 3\n    @staticmethod\n    def read(limit: int = 2) -> int:\n        return limit\n', encoding="utf-8")
        (docs / "ai-docs.json").write_text(json.dumps({
            "name": "Example", "scope": "Example only.",
            "references": [{"title": "Reference", "path": "docs/reference.md"}],
            "contracts": ["api.py"],
        }), encoding="utf-8")
        return repo

    def test_snapshot_preserves_code_and_checks_freshness(self):
        with tempfile.TemporaryDirectory() as directory:
            repo = self.fixture(Path(directory))
            build(repo)
            build(repo, check=True)
            content = (repo / "docs/llms-full.md").read_bytes()
            manifest = json.loads((repo / "docs/ai-docs-manifest.json").read_text())
            self.assertEqual(manifest["sha256"], hashlib.sha256(content).hexdigest())
            text = content.decode("utf-8")
            self.assertIn('print("[data](missing.md)")', text)
            self.assertIn("https://github.com/DeepAgentLabs/example-product/blob/main/docs/guide.md", text)
            self.assertIn("@staticmethod", text)
            self.assertIn("count: int = 3", text)
            self.assertIn("ALLOWED = 'allow'", text)
            (repo / "docs/reference.md").write_text("# Changed\n", encoding="utf-8")
            with self.assertRaisesRegex(ValueError, "Stale AI documentation"):
                build(repo, check=True)

    def test_includes_catalogs_and_exact_fixture_formatting_once(self):
        with tempfile.TemporaryDirectory() as directory:
            repo = self.fixture(Path(directory))
            catalog = repo / "catalog.json"
            catalog.write_text('{"rules": ["AIOS-0.5-V03"]}\n', encoding="utf-8")
            schema = repo / "example.schema.json"
            schema.write_text('{"$schema":"https://json-schema.org/draft/2020-12/schema","type":"object"}\n', encoding="utf-8")
            config_path = repo / "docs/ai-docs.json"
            config = json.loads(config_path.read_text())
            config.update({"schemas": ["*.schema.json"], "data": ["*.json"]})
            config_path.write_text(json.dumps(config), encoding="utf-8")
            build(repo)
            build(repo, check=True)
            reference = (repo / "docs/llms-full.md").read_text()
            self.assertIn('## Reference data: catalog.json', reference)
            self.assertIn(catalog.read_text(), reference)
            self.assertEqual(reference.count('## Data contract: example.schema.json'), 1)
            self.assertNotIn('## Reference data: example.schema.json', reference)
            manifest = json.loads((repo / "docs/ai-docs-manifest.json").read_text())
            entry = next(item for item in manifest["sources"] if item["path"] == "catalog.json")
            self.assertEqual(entry["kind"], "reference-data")
            catalog.write_text('{"rules": []}\n', encoding="utf-8")
            with self.assertRaisesRegex(ValueError, "Stale AI documentation"):
                build(repo, check=True)

    def test_specification_pack_omits_package_sections(self):
        with tempfile.TemporaryDirectory() as directory:
            repo = self.fixture(Path(directory))
            config_path = repo / "docs/ai-docs.json"
            config = json.loads(config_path.read_text())
            build(repo)
            package = (repo / "docs/llms-full.md").read_text()
            self.assertIn("## Package entry points", package)
            self.assertIn("Python requirement:", package)
            config["kind"] = "specification"
            config_path.write_text(json.dumps(config), encoding="utf-8")
            build(repo)
            build(repo, check=True)
            reference = (repo / "docs/llms-full.md").read_text()
            self.assertTrue(reference.startswith("# Example — comprehensive AI-readable reference\n\nSpecification: Example\n"))
            for removed in ("## Package entry points", "## Installation dependencies", "Python requirement:", "Distribution:"):
                self.assertNotIn(removed, reference)
            self.assertIn("Runtimes, SDKs and exporters implement it", reference)
            config["kind"] = "sdk"
            config_path.write_text(json.dumps(config), encoding="utf-8")
            with self.assertRaisesRegex(ValueError, "Unknown documentation kind"):
                build(repo)

    def test_rejects_sources_outside_product(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            repo = self.fixture(root)
            (root / "outside.md").write_text("Unrelated", encoding="utf-8")
            config_path = repo / "docs/ai-docs.json"
            config = json.loads(config_path.read_text())
            config["references"][0]["path"] = "../outside.md"
            config_path.write_text(json.dumps(config), encoding="utf-8")
            with self.assertRaisesRegex(ValueError, "Invalid source"):
                build(repo)


if __name__ == "__main__":
    unittest.main()
