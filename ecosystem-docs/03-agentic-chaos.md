# Agentic Chaos

Repository: `agentic-chaos` · Current version: 0.3.0

## What it is

Agentic Chaos is the resilience-testing layer. It applies selected failures at
controlled call sites, observes the result, scores the outcome, and records a
typed chaos event. Outside an active chaos session, the wrapper is transparent
and calls the original function normally.

## Execution model

```mermaid
sequenceDiagram
  participant Test as Test or application
  participant Session as chaos_session
  participant Call as chaos_call
  participant Fault as Selected fault
  participant Target as Target function
  participant Judge as Outcome judge
  participant Report as ChaosSession

  Test->>Session: activate configured faults
  Test->>Call: invoke target at a known call site
  Call->>Session: get active session
  Session-->>Call: configured fault selection
  Call->>Fault: trigger wrapped invocation
  Fault->>Target: call, delay, alter, repeat, or fail
  Target-->>Fault: result or exception
  Fault-->>Call: outcome and ChaosEvent
  Call->>Judge: compare baseline and observed behavior
  Judge-->>Call: fidelity score
  Call->>Report: append event
  Call-->>Test: return result or raise injected error
```

If multiple faults are configured, a call site selects which apply. This avoids
silently choosing a fault and makes experiments easier to reproduce.

## Fault families

```mermaid
flowchart TD
  Faults["Fault catalog"]
  Faults --> LLM["LLM and provider faults"]
  Faults --> Agent["Agent and orchestration faults"]

  LLM --> Timeout["token timeout"]
  LLM --> Rate["rate-limit storm"]
  LLM --> Silent["silent degradation"]

  Agent --> Tool["tool-call failure"]
  Agent --> Memory["memory corruption"]
  Agent --> Handoff["handoff corruption"]
  Agent --> Loop["infinite loop"]
```

The fault is only half the experiment. Each resulting `ChaosEvent` records the
fault type, affected step, timestamp, outcome, explanation, optional topology
edge, detailed evidence, and optional fidelity score.

## Agent topology integration

Topology-aware wrappers can retain which node or edge was affected. The
LangGraph helpers wrap nodes and tools, while the topology tracker captures the
agent structure relevant to an experiment.

```mermaid
flowchart LR
  User["User node"] --> Router["Router agent"]
  Router --> Research["Research agent"]
  Router --> Action["Action agent"]
  Research --> Search["Search tool"]
  Action --> API["External API tool"]
  Fault["handoff or tool fault"] -.->|"edge_id, from_node, to_node"| Action
  Fault -.-> API
```

That context makes a report more useful than “something failed”: it tells the
reader where the fault entered the agent graph.

## Standalone and AgenticLens modes

Agentic Chaos intentionally works without AgenticLens. Its standalone
`ChaosReport` shares selected top-level field names with the AgenticLens
Workflow model, enabling simple JSON interoperability without a runtime code
dependency.

```mermaid
flowchart TD
  Experiment["Chaos experiment"] --> Session["ChaosSession events"]
  Session --> Standalone["ChaosReport JSON"]

  Session --> Adapter["optional attach_events adapter"]
  LensWorkflow["AgenticLens Workflow"] --> Adapter
  Adapter --> Combined["AgenticLens Workflow<br/>with chaos_events"]
  Combined --> LensAnalysis["AgenticLens chaos-impact analysis"]

  Standalone --> LensLoad["AgenticLens can load shared JSON shape"]
  LensLoad --> LensAnalysis
```

The adapter is duck typed: Chaos does not import AgenticLens at runtime. It
appends serialized events to the Workflow's `chaos_events` array, and a helper
can copy step identifiers from an AgenticLens step handle into a chaos call.

## Relationship to AIOS

Chaos events are conceptually close to AIOS Reliability Events, but the current
`ChaosEvent` and `ChaosReport` models are not native AIOS artifacts.

```mermaid
flowchart LR
  Event["ChaosEvent"] --> Report["ChaosReport"]
  Report --> Current["Current standalone or Lens-compatible JSON"]

  Event -.-> Mapping["planned AIOS mapping"]
  Mapping -.-> Reliability["AIOS reliability occurrence or event"]
  Reliability -.-> Unified["AIOS Run artifact with relationships"]
```

A complete mapping must do more than rename fields. It must create valid AIOS
object identities, connect each occurrence to exactly one Step, target events
correctly, preserve measurement semantics, and use a namespaced extension for
Chaos-specific details.

## Current implementation status

Implemented:

- session-scoped fault activation;
- transparent call-through when chaos is disabled;
- LLM/provider and agent/orchestration fault catalogs;
- topology and LangGraph helpers;
- heuristic and optional evaluator-backed outcome judges;
- standalone ChaosReport output;
- optional AgenticLens event attachment.

Not yet implemented:

- a native AIOS Reliability Event or Run exporter;
- a combined AIOS artifact containing both Lens and Chaos evidence;
- a formal cross-tool AIOS interoperability test.

## Demo explanation

> Agentic Chaos is the wind tunnel. We deliberately introduce realistic
> failures—timeouts, rate limits, degraded responses, broken tools, corrupted
> memory, bad handoffs, or loops—and record how the agent behaves. We can feed
> those events into AgenticLens today; mapping them into the shared AIOS
> artifact is the next contract-level integration.

Previous: [AgenticLens](02-agenticlens.md) · Next: [MCP server](04-mcp-server.md)

