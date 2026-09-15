# Deep Agentic Core MCP server

Repository: `mcp-server` · Package: `deep-agentic-core-mcp` · Current version: 0.2.0

## What it is

The MCP server is the ecosystem's control surface. It uses the official MCP
Python SDK over standard input/output and exposes selected AgenticLens,
Agentic Chaos, Agentic Sidecar, and AIOS capabilities to an MCP-compatible host.

It is intentionally a thin orchestration layer. Domain logic remains in the
four underlying repositories and is reached through adapters.

## Request architecture

```mermaid
sequenceDiagram
  participant User
  participant Host as MCP-compatible AI host
  participant Server as Deep Agentic Core MCP
  participant Registry as Tool registry and dispatcher
  participant Adapter as Domain adapter
  participant Domain as Lens, Chaos, Sidecar, or AIOS
  participant State as In-memory session

  User->>Host: ask for analysis or experiment
  Host->>Server: tools/list or tools/call
  Server->>Registry: resolve tool and metadata
  Registry->>Adapter: validate and translate arguments
  Adapter->>Domain: invoke domain capability
  Domain-->>Adapter: structured result
  Adapter->>State: store reusable artifact when applicable
  Adapter-->>Server: JSON-safe response
  Server-->>Host: MCP content result
  Host-->>User: explanation or next action
```

Known handler failures are returned as structured results; the server boundary
also catches unexpected exceptions so they do not escape as raw protocol
failures.

## Current tool surface

```mermaid
flowchart TD
  MCP["Deep Agentic Core MCP<br/>14 tools"]
  MCP --> Core["Core"]
  MCP --> Lens["AgenticLens"]
  MCP --> Chaos["Agentic Chaos"]
  MCP --> Sidecar["Agentic Sidecar"]
  MCP --> Spec["AIOS"]

  Core --> Health["health"]
  Core --> Version["version"]
  Core --> Verify["verify integrations"]
  Core --> Session["session state"]

  Lens --> Analyze["analyze workflow"]
  Lens --> Summary["report summary"]
  Lens --> Compare["compare runs"]
  Lens --> SLO["SLO summary"]
  Lens --> Audit["audit report"]

  Chaos --> Faults["list faults"]
  Chaos --> Run["run experiment"]

  Sidecar --> Status["status"]
  Sidecar --> Inventory["module inventory"]

  Spec --> Validate["validate artifact"]
```

Sidecar's two tools are registered and callable, but `status` currently
reports a hardcoded `runtime_ready=False`/`package_status=scaffold` even when
a real Sidecar 0.2.0 runtime is installed — a known readiness bug, not a
missing feature. See the [ecosystem audit](ECOSYSTEM_AUDIT.md#mcp-server).

The server also advertises two JSON resources and three prompt templates.
Tool metadata tells a host about prerequisites, likely duration, session
mutation, read-only behavior, and open-world side effects.

## Session continuity

The in-memory session store lets sequential tool calls reuse evidence without
requiring the host to resend every artifact.

```mermaid
flowchart LR
  Analyze["lens.analyze_workflow"] --> Workflow["stored workflow"]
  Analyze --> Analysis["stored analysis"]
  Compare["lens.compare_runs"] --> Baseline["baseline runs"]
  Compare --> Candidate["candidate runs"]
  Compare --> Comparison["stored comparison"]
  Chaos["chaos.run_experiment"] --> ChaosReport["stored chaos report"]

  Workflow --> Next["later report call"]
  Analysis --> Next
  Baseline --> LaterCompare["later comparison"]
  Candidate --> LaterCompare
  ChaosReport --> State["core.session_state"]
  Comparison --> State
```

State is scoped by `session_id`, capped to a recent call history, and lasts
only for the life of the stdio server process. It is not a database or durable
evidence store.

## Adapter boundary

```mermaid
flowchart LR
  Handlers["MCP handlers"] --> LensAdapter["AgenticLens adapter"]
  Handlers --> ChaosAdapter["Agentic Chaos adapter"]
  Handlers --> SpecAdapter["AIOS adapter"]
  LensAdapter --> LensPkg["agenticlens package"]
  ChaosAdapter --> ChaosPkg["agentic-chaos package"]
  SpecAdapter --> SpecPkg["ai-operations-spec package"]
```

This boundary keeps protocol concerns out of domain code and allows the server
to report a missing optional package as an integration-readiness problem.

## Safety boundary for experiments

`chaos.run_experiment` is marked as slow, mutating, destructive/open-world in
MCP annotations because it executes a target script. The adapter constrains the
script path to the configured workspace and applies a timeout. The remaining
tools primarily read or derive from arguments and session state.

```mermaid
flowchart TD
  Request["run experiment request"] --> Resolve["resolve script path"]
  Resolve --> Check{"inside workspace?"}
  Check -->|"no"| Reject["reject request"]
  Check -->|"yes"| Execute["run with selected faults and timeout"]
  Execute --> Capture["capture structured report"]
  Capture --> Session["store last chaos report"]
```

## Relationship to AIOS

The MCP server currently provides `spec.validate_artifact`, which validates a
supplied Workflow or Run against the AIOS v0.4 draft. It does not itself merge
AgenticLens and Chaos results into a new AIOS Run.

```mermaid
flowchart LR
  Supplied["Supplied AIOS artifact"] --> MCPValidate["spec.validate_artifact"]
  MCPValidate --> AIOSValidator["AIOS schema and semantic validator"]

  LensResult["Lens result"] -.-> Unified["planned unified workflow"]
  ChaosResult["Chaos result"] -.-> Unified
  Unified -.-> AIOSArtifact["planned AIOS Run artifact"]
  AIOSArtifact -.-> MCPValidate
```

## Demo explanation

> The MCP server turns the ecosystem into an agent-accessible control plane.
> An AI client can discover tools, analyze a workflow, compare runs, launch a
> sandboxed chaos experiment, inspect session state, and validate an AIOS draft
> artifact. It orchestrates existing capabilities; unified AIOS artifact
> production remains planned work.

Previous: [Agentic Chaos](03-agentic-chaos.md) · Next: [Organization website](05-organization-website.md)

