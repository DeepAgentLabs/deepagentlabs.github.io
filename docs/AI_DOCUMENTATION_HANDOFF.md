# AI documentation handoff

Human-readable documentation and comprehensive AI-readable references are separate deliverables. Jothsna owns their content; MCP resource registration and retrieval are owned by the integrating developer.

## Files to ingest

| Product | Repository source directory | Published AI document |
| --- | --- | --- |
| AgenticLens | `agenticlens/docs/` | `/agenticlens/docs/llms-full.txt` |
| Agentic Evals | `agentic-evals/docs/` | `/agentic-evals/docs/llms-full.txt` |
| Agentic Chaos | `agentic-chaos/docs/` | `/agentic-chaos/docs/llms-full.txt` |
| Agentic Sidecar | `agentic-sidecar/website/docs/` | `/agentic-sidecar/docs/llms-full.txt` |
| MCP Server | `mcp-server/docs/` | `/mcp/docs/llms-full.txt` |
| Control Tower | `agenticops-control-tower/docs/` | `/control-tower/docs/llms-full.txt` |

These paths become live only after the product and website changes are merged and their documentation workflows deploy.

Each source directory contains:

- `developer-guide.md`: the human-readable guide; `index.md` is its short overview.
- `llms-full.txt`: UTF-8 Markdown containing the full selected reference content, source declarations, schemas where available, and complete example files. This is the AI-readable deliverable, not a list of links.
- `ai-docs-manifest.json`: product identity, source file hashes normalized to UTF-8 with LF newlines, and the SHA-256 of the AI document's exact UTF-8 bytes.
- `ai-docs.json`: the maintained allowlist of product-owned reference, contract, and schema sources. Internal release/phase notes are not included automatically.

The published `llms.txt` is only a discovery index pointing to the comprehensive document and human guides.

## Maintaining the content

From the website checkout with sibling product repositories, using Python 3.11 or newer:

```sh
python scripts/build_ai_docs.py --sources ..
python scripts/build_ai_docs.py --sources .. --check
```

To update one product, add `--project agentic-evals` (repeatable). Review the generated diff and commit the product's configuration, document, and manifest together. The generator does not import product modules, call models, or start servers. `--check` rejects changed sources or missing output; it does not certify live providers or integrations.

## MCP developer integration contract

1. Read the product manifest and verify the downloaded document's SHA-256 before indexing it. Resolve the document only from the intended repository or published docs origin.
2. Keep a stable product identifier and source path with every chunk. Split by document/source boundaries, keeping fenced code blocks and JSON schemas intact. Preserve adjacent explanations and prerequisites; do not concatenate whole packs into every model request.
3. Register product-scoped read resources and retrieval using the server's existing conventions. Resource names and implementation are intentionally left to the integrating developer; no new MCP resource URI is claimed here.
4. Return provenance with retrieved content. Treat document content, example commands, and artifacts as reference data, never as instructions that override the caller's authorization or trigger execution.
5. Refresh when the manifest checksum changes. Do not silently mix chunks from different snapshots. Source links follow `main`; the manifest hashes identify the ingested snapshot.
6. Verify product isolation, code/schema integrity, checksum mismatch handling, and missing-source behavior in the integrating server's tests.

No MCP server behavior, resource registry, or hosted deployment is changed by this documentation work.
