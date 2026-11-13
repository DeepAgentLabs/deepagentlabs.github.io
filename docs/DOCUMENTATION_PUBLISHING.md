# Documentation publishing

The homepage's Docs menu links to repository-owned documentation. Keep the
source in the product repositories; do not maintain a second copy here.

| URL | Source | Publisher |
|---|---|---|
| `/agenticlens/docs/` | `agenticlens/docs` | AgenticLens Pages workflow |
| `/agentic-sidecar/docs/` | `agentic-sidecar/website/docs` | Sidecar Pages workflow |
| `/agentic-chaos/docs/` | `agentic-chaos/docs` | Chaos Pages workflow |
| `/agentic-evals/docs/` | `agentic-evals/docs/*.md` | Evals Pages workflow |
| `/mcp/docs/` | `mcp-server/docs` and its MkDocs config | This website's Pages workflow |
| `/control-tower/` | `agenticops-control-tower/index.html`, styles, scripts and images | This website's Pages workflow |
| `/control-tower/docs/` | `agenticops-control-tower/docs` | This website's Pages workflow |
| `/control-tower/usecases/` | `agenticops-control-tower/usecases` | This website's Pages workflow |

The MCP and Tower paths differ from their repository names, so this website
builds them into its deployment artifact. The Tower product page and assets are staged from its repository when present;
other product pages and website assets are preserved. The workflow fetches both repositories' `main` branches
on website pushes, hourly, or when manually dispatched. Pull requests build an
artifact without deploying. Documentation source is never executed as Python;
only the MkDocs configuration is loaded. Source repositories are trusted inputs.

Local preview (run from this repository, with sibling repositories available):

```sh
uv run --no-project --with-requirements scripts/docs-requirements.txt \
  python -X utf8 scripts/build_docs.py --sources .. --all --output ../documentation-preview
python -X utf8 scripts/check_docs_site.py ../documentation-preview
python -m http.server 8000 --directory ../documentation-preview
```

Open `/mcp/docs/` and `/control-tower/docs/`. The script writes generated output
and Tower staging files outside the source repositories.

## Where to edit

Each product owns the following files inside its documentation source directory
listed above:

- `index.md`: high-level overview, capabilities, concepts, and workflow.
- `developer-guide.md`: entry point for developers.
- `guide/quickstart.md`: complete first-run tutorial and expected results.
- `guide/*.md`: individual tasks, troubleshooting, and reference entry points.
- `guide/examples/`: downloadable files used in the tutorials.
- `navigation.json`: ordered, product-specific navigation entries. Paths are
  relative to that product's documentation directory.

The public documentation has two entry points: a short `index.md` overview and
a complete `developer-guide.md` with procedural sections. `navigation.json`
is an explicit allowlist; the builder does not add other Markdown files.
Existing technical reference files remain editable at their original paths
and can be linked from the detailed guide. Unlisted pages stay accessible by
URL but are omitted from navigation and public search. Do not edit
generated HTML or copy product documentation into this website repository.

For presentation changes, edit `docs-theme/docs.css` and
`docs-theme/overrides/main.html` here. Navigation grouping belongs in
`scripts/build_docs.py`. The product selector navigates to another product's
documentation site; each site has its own sidebar and search index.

Use task names in navigation and headings, without package release numbers.
Keep schema identifiers and protocol fields intact in examples; these are data
contracts. Historical compatibility and release pages retain their existing
URLs but are omitted from the sidebar and generated overview guide lists.

## Update the public website

1. Review and merge the documentation changes in each affected product repository.
2. Review and merge the shared theme and builder changes in this website repository.
3. Run the product Docs workflows for Lens, Evals, Chaos, and Sidecar after the
   shared theme is merged, or wait for their scheduled rebuilds.
4. Run this repository's **Website and repository docs** workflow to refresh
   MCP and Control Tower immediately, or wait for its hourly rebuild.
5. Check the published overview, developer guide, product selector, search,
   and example downloads for each changed product.

A local edit or preview does not update the public site. The existing Pages
workflows publish from merged source; there is no separate manual HTML copy step.

For the first website deployment, select **GitHub Actions** under the website
repository's Settings → Pages → Build and deployment → Source. Merge the
workflow and builder, then run **Website and repository docs**. This replaces
the website's branch-only deployment with one artifact containing the website
and both generated documentation trees.

Sidecar and Chaos also require **GitHub Actions** as their Pages source;
serving their Markdown source folders directly does not expose the workflows'
`site/docs` output. Their Pages settings were corrected and docs workflows
redispatched during the 2026-10-21 audit.

All six sites use the shared [documentation theme](../docs-theme/README.md).
Evals now builds its Markdown guides with MkDocs; the former HTML guide remains
in source for migration history, and old section bookmarks redirect to the new
pages. Its product landing page remains at `/agentic-evals/`.

Lens, Sidecar, Chaos and Evals workflows fetch the shared theme from this
repository on every docs build and daily. The main website workflow builds MCP
and Tower with the same builder. Product source pushes remain the trigger for
immediate documentation updates.

Navigation and presentation are standardized; existing technical guides remain
owned by their original repositories. The shared [tutorial template](../docs-theme/tutorial-template.md)
defines prerequisites, installation, a runnable example, expected results and
next steps for new and revised tutorials.

The Tower repository Docs workflow validates product previews and the same shared
docs/use-case builds without deploying a separate project Pages site. Old
`/control-tower/docs/docs/...` and `/control-tower/docs/quickstart/` bookmarks
redirect to the current guide paths. Build staging uses temporary directories
outside the published artifact.
