# Shared documentation presentation

The six projects retain ownership of their documentation. `scripts/build_docs.py`
stages those sources, applies this theme, groups the navigation, and emits a
searchable MkDocs Material site. Source filenames and existing page URLs remain
stable. The Evals workflow builds its new Markdown guides and retains its product
landing page; `legacy-links.js` preserves bookmarks from the old guide.

Navigation groups are Getting started, Guides, Integrations, Examples, Reference,
Deployment and operations, and Compatibility and releases. Empty groups are
omitted. New Markdown pages are discovered automatically. Source links outside
the documentation tree point back to the corresponding GitHub files.

Use `tutorial-template.md` when writing or revising task-based guides. Existing
technical content is preserved; adopting this presentation does not imply a
rewrite or verification of every pre-existing code example.

The shared header links to every product. Search is per product. Theme switching,
code copying, local tables of contents, and responsive navigation come from
MkDocs Material. `llms.txt` exposes a per-product documentation index.

Build all six sites from this repository:

```sh
uv run --no-project --with-requirements scripts/docs-requirements.txt \
  python scripts/build_docs.py --sources .. --all --output /tmp/dal-docs/site
python3 scripts/check_docs_site.py /tmp/dal-docs/site
```

The main website builds MCP and Tower. Lens, Sidecar, Chaos and Evals check out
this repository's shared theme in their own Docs workflows. Their scheduled
builds pick up theme changes daily, while source pushes publish immediately.
