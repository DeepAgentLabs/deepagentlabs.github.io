# DeepAgentLabs organization website

Repository: `deepagentlabs.github.io`

## What it is

This repository is the ecosystem's public front door. It is a static GitHub
Pages site that explains the foundation, connects the projects, presents the
roadmap, and provides calls to action.

It intentionally has no application server, dependency installation, or build
step.

## Page narrative

```mermaid
flowchart TD
  Visitor["Visitor arrives"] --> Hero["Hero<br/>what DeepAgentLabs is"]
  Hero --> Ecosystem["Ecosystem<br/>how the projects connect"]
  Ecosystem --> Spec["Specification<br/>why a shared contract matters"]
  Spec --> Roadmap["Roadmap<br/>where the foundation is going"]
  Roadmap --> Newsletter["Newsletter or updates"]
  Newsletter --> CTA["Project and community calls to action"]
```

The website should communicate in outcomes and concepts. Detailed model fields,
CLI commands, and draft conformance rules belong in the repositories and this
technical guide.

## Technical shape

```mermaid
flowchart LR
  HTML["index.html<br/>content and structure"]
  CSS["assets/styles.css<br/>layout and visual system"]
  JS["assets/site.js<br/>light interaction"]
  Browser["visitor browser"]
  Pages["GitHub Pages"]

  HTML --> Browser
  CSS --> Browser
  JS --> Browser
  Pages --> HTML
  Pages --> CSS
  Pages --> JS
```

Publishing is branch based: the repository root is served by GitHub Pages, and
`index.html` becomes the organization URL. Local preview can open the file
directly or use any static file server.

## Role in the ecosystem

```mermaid
flowchart TD
  Site["Organization website"] --> Story["one ecosystem story"]
  Story --> AIOS["AIOS<br/>common contract"]
  Story --> Lens["AgenticLens<br/>observation and evaluation"]
  Story --> Chaos["Agentic Chaos<br/>resilience testing"]
  Story --> MCP["MCP server<br/>agent-facing control surface"]
  AIOS --> Reader["reader chooses a deeper repository"]
  Lens --> Reader
  Chaos --> Reader
  MCP --> Reader
```

The site should avoid making claims that the implementation cannot yet support.
In particular, it should describe AIOS as a pre-release draft and distinguish
current AIOS validation from planned native artifact production.

## Demo explanation

> The website is the narrative layer. The four technical repositories define,
> observe, stress, and orchestrate the operating loop; this repository makes
> that system understandable and discoverable without asking visitors to read
> source code or run a command.

Previous: [MCP server](04-mcp-server.md) · Next: [Current versus target](06-current-vs-target.md)

