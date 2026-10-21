"""Check rendered documentation links, navigation, search, and theme assets."""

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

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        for key in ("href", "src"):
            if attrs.get(key):
                self.links.append(attrs[key])
        if "docs-products" in attrs.get("class", "").split():
            self.products += 1
        if attrs.get("id"):
            self.ids.add(attrs["id"])


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
        for html in docs.rglob("*.html"):
            count += 1
            page = Page()
            page.feed(html.read_text())
            if page.products != 1:
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
