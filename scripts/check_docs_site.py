"""Check rendered documentation links, navigation, search, and theme assets."""

import hashlib
import json
import sys
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urlsplit


class Page(HTMLParser):
    def __init__(self):
        super().__init__()
        self.links = []
        self.products = 0
        self.ids = set()
        self.canonical = None
        self.redirect = None

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        for key in ("href", "src"):
            if attrs.get(key):
                self.links.append(attrs[key])
        if "docs-products" in attrs.get("class", "").split():
            self.products += 1
        if attrs.get("id"):
            self.ids.add(attrs["id"])
        if tag == "link" and attrs.get("rel") == "canonical":
            self.canonical = attrs.get("href")
        if tag == "meta" and attrs.get("http-equiv", "").lower() == "refresh":
            self.redirect = attrs.get("content", "").partition(";url=")[2]


def main():
    root = Path(sys.argv[1]).resolve()
    indexes = list(root.rglob("search/search_index.json"))
    assert indexes, f"No search indexes under {root}"
    errors = []
    count = 0
    for index in indexes:
        docs = index.parent.parent
        assert json.loads(index.read_text())["docs"], f"Empty search index: {index}"
        assert (docs / "llms.txt").is_file(), f"Missing llms.txt: {docs}"
        ai_manifest = docs / "ai-docs-manifest.json"
        if ai_manifest.is_file():
            metadata = json.loads(ai_manifest.read_text(encoding="utf-8"))
            reference = docs / "llms-full.txt"
            assert reference.is_file(), f"Missing comprehensive AI reference: {docs}"
            assert metadata["sha256"] == hashlib.sha256(reference.read_bytes()).hexdigest(), f"AI reference checksum mismatch: {docs}"
            assert "llms-full.txt" in (docs / "llms.txt").read_text(encoding="utf-8"), f"AI reference not discoverable: {docs}"
        home = Page()
        home.feed((docs / "index.html").read_text())
        base = urlsplit(home.canonical or "")
        for html in docs.rglob("*.html"):
            count += 1
            page = Page()
            page.feed(html.read_text())
            if page.redirect:
                destination = urlsplit(page.redirect)
                if destination.netloc != base.netloc or not destination.path.startswith(
                    base.path
                ):
                    errors.append(f"{html}: redirect leaves this documentation site")
                elif not (docs / destination.path.removeprefix(base.path)).exists():
                    errors.append(
                        f"{html}: missing redirect destination {page.redirect}"
                    )
            elif page.products != 1:
                errors.append(f"{html}: missing shared product navigation")
            for url in page.links:
                parsed = urlsplit(url)
                if (
                    parsed.scheme
                    or parsed.netloc
                    or not parsed.path
                    or parsed.path.startswith("/")
                ):
                    continue
                target = html.parent / unquote(parsed.path)
                if not target.exists():
                    errors.append(f"{html}: missing target {url}")
    if errors:
        raise SystemExit("\n".join(errors))
    print(
        f"Validated {count} HTML pages across {len(indexes)} documentation sites: links, navigation, search, llms.txt."
    )


if __name__ == "__main__":
    main()
