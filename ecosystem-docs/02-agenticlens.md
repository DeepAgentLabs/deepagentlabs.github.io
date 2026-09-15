# AgenticLens

Repository: `agenticlens` · Current version: 0.4.0

## What it is

AgenticLens is the observation and evaluation layer. It captures what an agent
workflow did, measures operational behavior, finds optimization opportunities,
evaluates results, compares runs, and exports human- or machine-readable
reports.

## Two complementary data paths

The repository supports a lightweight Workflow profiler and a richer Run/Span
trace model. They solve related but distinct jobs.

```mermaid
flowchart TD
  App["Agentic application"]

  subgraph ProfilePath["Workflow profiling path"]
    Profile["profile context"] --> Steps["step contexts"]
    Steps --> Provider["provider and model extraction"]
    Provider --> Metrics["tokens, cost, latency, metadata"]
    Metrics --> Workflow["Workflow model"]
  end

  subgraph TracePath["Trace and evaluation path"]
    Trace["trace context"] --> Spans["nested typed spans"]
    Spans --> Run["Run model"]
    Run --> Diagnostics["trace diagnostics"]
    Run --> Eval["evaluation suites and gates"]
    Run --> Compare["baseline versus candidate"]
  end

  App --> Profile
  App --> Trace
  Workflow --> Recommend["recommendation engine"]
  Recommend --> Reports["JSON, CSV, Markdown, Jira"]
  Diagnostics --> Reports
  Eval --> Reports
  Compare --> Reports
  Spans -.-> OTLP["OTLP export"]
```

### Workflow model

A Workflow contains top-level timing, a list of Steps, aggregate cost/token
properties, and an additive `chaos_events` list. Each Step can record its type,
agent, provider, model, handoff context, tokens, latency, cost, and metadata.

```mermaid
flowchart LR
  Workflow["Workflow"] --> S1["Step: retrieve"]
  Workflow --> S2["Step: reason"]
  Workflow --> S3["Step: tool call"]
  Workflow --> Chaos["chaos_events"]
  S1 --> M1["metrics and metadata"]
  S2 --> M2["metrics and metadata"]
  S3 --> M3["metrics and metadata"]
```

### Run and Span model

A Run has a `run_id`, `trace_id`, application and experiment metadata, status,
and a set of Spans. Spans have stable identities and optional parent IDs, which
form a validated acyclic execution tree.

```mermaid
flowchart TD
  Run["Run"] --> Root["planning span"]
  Root --> Retrieval["retrieval span"]
  Root --> Delegation["delegation span"]
  Delegation --> Tool["tool-call span"]
  Delegation --> Model["model-call span"]
  Model --> Retry["retry span"]
  Root --> Final["final-response span"]
```

Supported span categories include model calls, planning, memory reads and
writes, retrieval, tool calls, validation, retries, delegation, final response,
and custom work.

## From evidence to recommendations

```mermaid
flowchart LR
  Workflow["Profiled workflow"] --> Engine["RecommendationEngine"]
  Engine --> Prompt["repeated system prompt"]
  Engine --> RAG["excessive or low-utility chunks"]
  Engine --> History["long context history"]
  Engine --> Tools["duplicate tool calls"]
  Engine --> Handoff["handoff bloat"]
  Engine --> Chaos["chaos impact"]
  Engine --> Model["model swap opportunity"]

  Prompt --> Ranked["ranked recommendations"]
  RAG --> Ranked
  History --> Ranked
  Tools --> Ranked
  Handoff --> Ranked
  Chaos --> Ranked
  Model --> Ranked
  Ranked --> Savings["token, run, and cost impact"]
```

Each recommender examines recorded evidence. The engine enriches findings with
estimated token and dollar impact, evidence references, and severity, then
sorts the results by likely value.

## Evaluation and release gates

```mermaid
flowchart TD
  Suite["TestSuite"] --> Cases["TestCases and samples"]
  Cases --> Runner["offline or live evaluator"]
  Runner --> Scores["scores and evidence"]
  Scores --> Report["evaluation report"]
  Report --> Gate["SLO or release gate"]
  Gate -->|"thresholds pass"| Promote["candidate is ready"]
  Gate -->|"thresholds fail"| Investigate["inspect case-level evidence"]
```

This is deliberately separate from profiling. Runtime completion does not
prove answer quality; an evaluation discloses the criterion, method, score,
and evidence used to judge the result.

## CLI and library surfaces

The CLI exposes profiling, reporting, analysis, inspection, validation,
conformance checking, run comparison, offline/live evaluation, and gates. The
same core models and services can be called as a Python library. Exporters
cover JSON, CSV, Markdown, Jira-oriented output, and OTLP traces.

## Relationship to AIOS

```mermaid
flowchart LR
  Native["AgenticLens native models<br/>Workflow, Run, Span, Evidence"]
  Validator["AgenticLens AIOS validator<br/>schema plus semantics"]
  Draft["AIOS v0.4 draft schemas"]
  Exporter["Native AIOS exporter<br/>not implemented"]
  AIOSRun["AIOS Run artifact"]

  Draft --> Validator
  Native -->|"current reports and exports"| NativeOutput["AgenticLens JSON and reports"]
  AIOSRun -->|"can be validated"| Validator
  Native -.-> Exporter -.-> AIOSRun
```

Current reality:

- AgenticLens has its own documented and useful object models.
- It includes AIOS schema and semantic validation commands.
- Its Workflow can accept Chaos events through an additive integration field.
- It does **not** currently map its native Workflow/Run/Span objects into a
  complete AIOS v0.4 Run artifact.

Therefore the correct statement is “AgenticLens contains AIOS draft validation
support,” not “AgenticLens is already an AIOS producer.”

## Demo explanation

> AgenticLens is the microscope. It observes the workflow, connects steps and
> spans to cost, latency, tokens, evidence, and quality, then converts that
> evidence into recommendations and release decisions. It already understands
> how to validate an AIOS draft artifact, while the native AIOS exporter is
> still on the integration roadmap.

Previous: [AIOS](01-ai-operations-spec.md) · Next: [Agentic Chaos](03-agentic-chaos.md)

