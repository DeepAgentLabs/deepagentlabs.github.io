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
on website pushes, daily, or when manually dispatched. Pull requests build an
artifact without deploying. Documentation source is never executed as Python;
only the MkDocs configuration is loaded. Source repositories are trusted inputs.

Local preview (run from this repository, with sibling repositories available):

```sh
uv run --no-project --with-requirements scripts/docs-requirements.txt \
  python scripts/build_docs.py --sources .. --output /tmp/dal-docs/site
python3 -m http.server 8000 --directory /tmp/dal-docs/site
```

Open `/mcp/docs/` and `/control-tower/docs/`. The script writes generated output
and Tower staging files outside the source repositories.

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
