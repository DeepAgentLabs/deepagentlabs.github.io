# DeepAgentLabs ecosystem implementation audit

Date: 2026-09-11. Scope: all eight workspace project/documentation directories.
This is a local source, roadmap, test, and integration-boundary review, not a
production certification or an AAIF acceptance determination.

## Result

The ecosystem has working individual components, but the full
Sidecar -> Chaos -> Lens -> AIOS -> MCP -> Control Tower workflow is not yet
implemented and verified as one system. The immediate priorities are correcting
readiness reporting and preserving evidence across serialization, then completing
the existing roadmap milestones.

Status: **Implemented** means usable code exists within the stated scope;
**Partial** means only some deliverables work; **Missing** means no implementation
was found locally; **Unverified** means acceptance needs evidence beyond this
review. A source file, placeholder function, passing unit test, or version string
alone does not establish a completed product milestone.

## Test results and scope

| Repository | Local result | What this establishes |
| --- | --- | --- |
| ai-operations-spec | 25 passed | Local schema/document/fixture tests; not independent review |
| agenticlens | 183 passed in preceding correctness follow-up | Local evaluation, tracing, comparison, recommendation tests; see its audit |
| agentic-chaos | 129 passed | Includes optional integration tests against local Lens |
| agentic-sidecar | 125 passed | Deterministic policy/risk/intent and callable-adapter behavior |
| mcp-server | 50 passed, 1 environment-blocked subprocess test | Parent-process tests run after initializing installed Windows dependency paths; degraded-boot child cannot import mcp under embedded interpreter |
| agenticops-control-tower | 2 passed | Small registry/discovery smoke tests, not control-plane acceptance |
| Website / ecosystem docs | Source inspection | No deployed-site, browser, or external-link verification |

Runtime: workspace-local CPython 3.14.0, existing per-repository dependencies and
local sibling source paths. Tests were run separately with
`pytest -q --override-ini=addopts= -p no:cacheprovider`; dependency isolation,
published-wheel compatibility, every supported Python version, hosted CI, and
production integrations were not verified. Test counts are not maturity scores.

MCP initially failed collection because embedded Python did not initialize
pywin32 paths; initializing its installed site-packages allowed 50 tests to pass.
The remaining child-process import failure is an environment limitation, not
evidence that the normal packaged server cannot boot.

Reviewed Git baselines (plus local changes):
- AIOS: `b7fe3803f97e2e80810140b47e5f00935bb9e2ce`
- Chaos: `856ebbc2e613185321e7e0109967b071beb95075`
- Sidecar: `3ea6047c21f0f73309fdcaaa958161d493b094d5`
- MCP: `dec8e8f6b49122ca9a3c81feebbfd93533f9d2b8`
- Control Tower: `664905b8b019e3f220795a98ca83c184165fc9e1`
- Lens: see [its audit](https://github.com/DeepAgentLabs/agenticlens/blob/main/ROADMAP_AUDIT.md), including subsequent fixes.

## AI Operations Specification

Evidence: [roadmap](https://github.com/DeepAgentLabs/ai-operations-spec/blob/main/ROADMAP.md),
[specification layers](https://github.com/DeepAgentLabs/ai-operations-spec/tree/main/specification),
[tests](https://github.com/DeepAgentLabs/ai-operations-spec/tree/main/tests),
[review evidence](https://github.com/DeepAgentLabs/ai-operations-spec/blob/main/reviews/evidence-matrix.md).

| Milestone | Status | Evidence and remaining acceptance |
| --- | --- | --- |
| v0.1 Core concepts | Partial / in review | Definitions and review scenarios exist; independent classification/review gate remains unchecked |
| v0.2 Relationships | Partial / draft | Graph vocabulary and examples exist; independent framework validation and earlier freeze gate open |
| v0.3 Semantic conventions | Partial / draft | Event catalog exists; OTel design-principle review and two-reference-implementation coverage remain open |
| v0.4 Schemas | Partial / draft | Schemas, valid/invalid fixtures and tests exist; two independent producer artifacts and prerequisite review gates remain open |
| v0.5 Compatibility | Missing as completed policy | No accepted compatibility/deprecation/version-transition contract |
| v0.6 Examples/extensions | Partial | Draft examples/conformance guidance exist; stable extension and canonical example acceptance not established |
| v0.6.x Evidence/conformance/naming | Partial | Draft evidence fields, fixtures and conformance text are real; independent conformance, finalized naming and provenance contracts remain open |
| v0.6.x Migration/site/OTel binding/verification/audit schemas | Planned / not accepted | No completed deliverables established for these follow-ups; generic signal/evidence fields are not finalized verification or audit contracts |
| v1.0 Stable spec | Missing | Earlier review/freeze gates prevent stable conformance claims |

The v0.1-v0.4 labels are cumulative layers, not four interchangeable schema
versions. MCP's suggestion that versions need schemas under each earlier layer
should be replaced by a compatibility plan for actual artifact versions.
Internal Lens/Chaos mappings are useful but do not satisfy independent review.

## AgenticLens

Use the [detailed roadmap audit](https://github.com/DeepAgentLabs/agenticlens/blob/main/ROADMAP_AUDIT.md) and
[correctness tests](https://github.com/DeepAgentLabs/agenticlens/blob/main/tests/test_evaluation_correctness.py).
Implemented foundations include tracing, cost analysis, saved-run comparison,
evaluation, gates, draft validation, and OTLP export. Calibration is local and
unreleased. The four verified correctness issues were fixed after the initial audit.

Remaining priorities: evaluator/model/prompt provenance, immutable datasets,
async/batched execution, per-case experiments, and broader calibration.
Multi-variant ModelFit, routing, full enterprise controls, and post-adoption
optimization tracking are not complete.

Cross-repository finding: [Workflow](https://github.com/DeepAgentLabs/agenticlens/blob/main/src/agenticlens/models/workflow.py)
does not declare drift_report. An in-memory attribute attached by Chaos is
dropped by model_dump()/JSON output. No DriftRecommender or fidelity-weighted
ChaosImpactRecommender was found in [recommendation code](https://github.com/DeepAgentLabs/agenticlens/tree/main/src/agenticlens/recommenders).

## Agentic Chaos

Evidence: [roadmap](https://github.com/DeepAgentLabs/agentic-chaos/blob/main/ROADMAP.md),
[source](https://github.com/DeepAgentLabs/agentic-chaos/tree/main/src/agentic_chaos),
[tests](https://github.com/DeepAgentLabs/agentic-chaos/tree/main/tests),
[integration tests](https://github.com/DeepAgentLabs/agentic-chaos/blob/main/tests/test_integrations_agenticlens.py).

| Milestone | Status | Actual scope / remaining work |
| --- | --- | --- |
| v0.1 LLM chaos | Implemented core | Timeout/rate-limit/degradation faults, session, CLI, Lens event adapter; demo GIF still unchecked |
| v0.2 Agent faults | Implemented core, partial acceptance | Tool/memory/loop faults, topology, callable LangGraph wrapper; AgentResilienceRecommender/score deferred |
| v0.2.x Structured experiments | Missing | ExperimentReport provenance model, AIOS-native report, 4+ synthetic fixtures, --report remain unchecked despite later releases |
| v0.3 Fidelity/handoff | Implemented core, partial integration | Judge adapters/session, fidelity fields, handoff corrupt/drop/delay, memory decay; Lens fidelity weighting remains missing |
| v0.4 Drift | Implemented detector, partial integration | Snapshot/distance comparison, JSON storage, cooldown alert-state logic and CLI; drift attachment is not durable in Lens |
| v0.5 Streaming/patching/profiles | Missing | Streaming faults, provider patches, chaos.toml, universal probability, auth/context faults |
| v0.5.x Safety rails | Missing | Circuit breaker, cost/failure-rate abort, dry-run and abort report fields |
| v0.6 Pytest contracts | Missing | Dedicated plugin, contract classes and --chaos activation |
| v0.7 Cascades/intensity/poisoning | Missing | cascade scheduler, breaking-point search, poisoned response strategies, estimate CLI |
| v0.8 Workflows/scope | Missing | Workflow runner, parallel/suspend/templates, YAML experiment validation, Scope, topology fuzzing and continuous chaos scheduler |
| v0.9 Resilience probes/score | Missing | Probe lifecycle, scoring/trends/retention, terminal breakdown and min-score gate |
| v1.0 ChaosHub | Missing | Recipe registry/client, plugin discovery, bundled recipes and hub CLI |

Drift checks compare snapshots; a detected text/model-identity change is not
proof of semantic quality degradation. Optional judge adapters were exercised
by repository tests, not verified with paid live provider calls.

[ChaosReport](https://github.com/DeepAgentLabs/agentic-chaos/blob/main/src/agentic_chaos/models/report.py) is readable
as a Lens Workflow with empty steps, but has no native AIOS artifact_type or
spec_version. Do not equate that compatibility with AIOS conformance.

## Agentic Sidecar

Evidence: [roadmap](https://github.com/DeepAgentLabs/agentic-sidecar/blob/main/ROADMAP.md),
[core](https://github.com/DeepAgentLabs/agentic-sidecar/blob/main/src/agentic_sidecar/core/sidecar.py),
[adapter](https://github.com/DeepAgentLabs/agentic-sidecar/blob/main/src/agentic_sidecar/adapters/langgraph.py),
[intent](https://github.com/DeepAgentLabs/agentic-sidecar/blob/main/src/agentic_sidecar/intent/alignment.py),
[tests](https://github.com/DeepAgentLabs/agentic-sidecar/tree/main/tests).

| Milestone | Status | Actual scope / remaining work |
| --- | --- | --- |
| v0.1 Runtime | Implemented | Required fail-open/closed choice, deterministic policy/risk, Observe mode and callable wrappers |
| v0.2 Intent/Govern | Implemented narrow scope | Numeric/enum/allow-list constraints, context/history, ALLOW/WARN/BLOCK; wrapped tool blocked in Govern mode |
| v0.2.x Validation benchmark | Missing | 3-5 paired Guardian-off/on scenarios, measured catch/false-positive rates and published table |
| v0.3 Planner/Critic/Judge | Missing | Modules are docstring placeholders; no optional model risk classifier or measured overhead |
| v0.4 Full outcomes/budget/escalation | Partial building blocks | WARN already exists; budget module and remaining outcomes/escalation/export workflow not implemented |
| v0.5 Status/narration | Missing | status/narrate.py and cli/main.py placeholders; no installed CLI entry point |
| v0.6 Multi-framework | Missing | CrewAI/AutoGen/OpenAI Agents/Google ADK placeholders; no cross-adapter conformance or Semantica correlation contract |
| v0.7 Control Room | Missing | No dashboard wired to approvals |
| v0.8 Broad benchmarks | Missing | Depends on narrow benchmark and later evaluators |
| v1.0 Interoperability schemas | Missing | Local Pydantic shapes are not accepted AIOS intent/decision schemas or cross-instance protocol |

Boundaries that matter:
- Core computes decisions; enforcement occurs at an attached wrapper. Direct
  calls to the underlying tool bypass that wrapper.
- Observe mode and WARN permit execution. Expired intent currently warns.
- Missing bound constraints/arguments do not match; authority metadata is not
  enforced. This is constrained rule checking, not general semantic authorization.
- Lens/Chaos integrations are docstring-only modules.
- SECURITY.md still calls the package an unreleased scaffold, contradicting the
  implemented 0.2.0 runtime. Supported-version documentation needs reconciliation.

## MCP server

Evidence: [roadmap](https://github.com/DeepAgentLabs/mcp-server/blob/main/ROADMAP.md),
[dispatch](https://github.com/DeepAgentLabs/mcp-server/blob/main/src/deep_agentic_core_mcp/server.py),
[tool registry](https://github.com/DeepAgentLabs/mcp-server/blob/main/src/deep_agentic_core_mcp/tools/registry.py),
[adapters](https://github.com/DeepAgentLabs/mcp-server/tree/main/src/deep_agentic_core_mcp/adapters),
[tests](https://github.com/DeepAgentLabs/mcp-server/tree/main/tests).

| Phase | Status | Actual scope / remaining work |
| --- | --- | --- |
| 0 Foundation | Implemented locally | Packaging, source, metadata and docs exist; hosted publication not reverified |
| 1 Stdio server | Implemented code | Handlers and tests exist; local subprocess environment limitation noted above |
| 2 Sessions/diagnostics | Implemented core | In-memory sessions, health/verify, tool metadata, resource/prompt handlers |
| 3a Lens | Partial | Analyze, report, compare, SLO/gate and audit report adapters; provenance completeness and AIOS identity remain open |
| 3b Chaos | Partial acceptance | Fault listing and threaded script execution work; AIOS export/validation and script allow/deny policy open |
| 3c AIOS | Partial | v0.4 validation/resources; no multi-version support; conformance documentation exists upstream despite stale blocker wording |
| 3d Sidecar discovery | Partial / incorrect readiness | Two tools exist, but hardcoded scaffold state contradicts real Sidecar 0.2.0 runtime |
| 4 Unified workflows | Partial building blocks | Sessions/prompts exist; no complete native AIOS end-to-end workflow or Control Tower connector |
| 5 Publishing/adoption | Partial / externally unverified | Build/release workflow and server.json exist; registry publication and adoption not checked |
| 6 Operational intelligence | Partial building blocks | Session history exists; onboarding wizard, saved-artifact browsing and investigation workflow remain planned |

Direct probes counted **14 tools**, rather than the 12 in ecosystem-docs.
The [Sidecar adapter](https://github.com/DeepAgentLabs/mcp-server/blob/main/src/deep_agentic_core_mcp/adapters/agentic_sidecar.py)
hardcodes runtime_ready=False and package_status=scaffold even when version
0.2.0 is imported; tests currently assert that stale state.

[Chaos execution](https://github.com/DeepAgentLabs/mcp-server/blob/main/src/deep_agentic_core_mcp/adapters/agentic_chaos.py)
confines the script path to the workspace but executes Python in-process.
That is path confinement, not an OS sandbox. Timeout returns without killing
the worker thread. Synchronous handlers also run inside async dispatch.
These existing limitations must be resolved before remote/multi-client expansion.

## Control Tower

Evidence: [roadmap](https://github.com/DeepAgentLabs/agenticops-control-tower/blob/main/ROADMAP.md),
[registry](https://github.com/DeepAgentLabs/agenticops-control-tower/blob/main/src/agenticops_control_tower/registry/service.py),
[API facade](https://github.com/DeepAgentLabs/agenticops-control-tower/blob/main/src/agenticops_control_tower/api/surface.py),
[tests](https://github.com/DeepAgentLabs/agenticops-control-tower/tree/main/tests).

| Phase | Status | Actual scope / remaining work |
| --- | --- | --- |
| 0 Concept/boundaries | Implemented scaffold | Concept, docs and layout exist |
| 1 Registry/discovery | Partial | In-memory registration/heartbeat, sorted reported capabilities and Python read facade; no HTTP endpoints, persistence or mature health semantics |
| 2 CLI/status | Missing | main() returns a scaffold string; no published deepagent commands, filters or rollups |
| 3 Console | Missing | console_status() returns a scaffold string |
| 4 Configuration/writes | Partial shapes | ConfigScope/ConfigPatch only; no safe write, audit, authority or reconciliation implementation |
| 5 Sibling integration | Missing | Adapter catalog names packages but does not query them |
| 6 MCP connector | Missing | No live Control Tower tools in MCP registry |
| 7 Fleet operations | Missing | No deterministic target/preview/bulk/rollback workflow |
| 8 Alerts/audit/incidents | Missing | No operational audit/incident subsystem |
| 9 Stable contract / v1.0 | Missing | No two-runtime acceptance or stable control-plane contract |

The API returns underlying mutable AgentRecord objects. "Read-only API" describes
available methods, not enforced immutability. Capability versions and last_seen
fields do not establish version compatibility or stale-heartbeat health logic.
Two smoke tests cannot establish deployment readiness.

## Website and ecosystem documentation

Evidence: [website source](https://github.com/DeepAgentLabs/deepagentlabs.github.io/blob/main/index.html),
[website README](https://github.com/DeepAgentLabs/deepagentlabs.github.io/blob/main/README.md), [guide](README.md).

- Website is implemented static HTML/CSS/JS with no required build pipeline.
  Public hosting, links, rendering and accessibility were not tested here.
- Website shows v0.3/v0.4 specification layers as planned, though draft artifacts
  exist. "Stable AI-native event meanings" overstates the still-open review gates.
- Sidecar and Control Tower are absent from its project cards. MCP is labelled
  control plane, blurring the distinction from Control Tower.
- The guide describes five repositories, omits Sidecar/Control Tower, lists Chaos
  0.3.0 instead of local 0.4.0, and shows 12 instead of 14 MCP tools.
- The guide correctly warns that native AIOS exporters are target work.
  Preserve that distinction while updating the ecosystem inventory.

## Cross-repository integration matrix

| Boundary | Evidence | Status / next acceptance test |
| --- | --- | --- |
| Chaos -> Lens Workflow | Chaos integration tests and direct model-load probe | Works for shared fields; empty steps are allowed |
| Chaos drift -> Lens JSON -> consumer | attach_drift_report probe | Broken round trip: attribute exists in memory but serialization drops it |
| Chaos fidelity -> Lens findings | Source inspection | fidelity_score stored by Chaos; Lens weighting not implemented |
| Lens/Chaos -> native AIOS | Report/model and marker inspection | No common native export path verified; add explicit adapters and spec-owned fixtures |
| MCP -> Lens/Chaos | Adapter/server tests | Existing composition; published-package compatibility still unverified |
| MCP -> Sidecar readiness | Direct status_summary probe | Incorrect hardcoded readiness; no runtime control tools |
| Sidecar -> Lens/Chaos | Placeholder inspection | Missing adapters and shared decision/trace correlation |
| MCP -> AIOS | Validator/resource source and tests | Draft 0.4 only; independent implementation evidence remains open |
| Control Tower -> siblings/MCP | Catalog/facade inspection | Planned, no live connectors |

Chaos already has a Lens integration CI job. Extend existing coverage into
version-matrix and serialization-contract tests rather than describing all
cross-repository CI as absent.

## Open-source foundation work

Local root-file inspection found no LICENSE in AIOS or MCP and no GOVERNANCE.md
in the six technical repositories. CONTRIBUTING.md exists in all six; security
policies exist in five (AIOS lacks one). Lens also has CODE_OF_CONDUCT.md.
Org-inherited GitHub community files, legal ownership, license compatibility,
branch protection, and private reporting settings were not verified.

Clarify licensing and maintainer decision processes before a foundation proposal.
This audit neither adopts governance on maintainers' behalf nor claims AAIF readiness.

## Prioritized existing-roadmap backlog

| Priority | Work | Owner | Reviewable acceptance |
| --- | --- | --- | --- |
| P0 | Correct Sidecar discovery/readiness | MCP + Sidecar | Tests cover supported runtime capability and unavailable package; no filename-based capability inference |
| P0 | Preserve drift evidence through JSON | Chaos + Lens | Attach -> serialize -> reload -> inspect regression retains drift fields; decide schema ownership explicitly |
| P1 | Structured experiment evidence | Chaos + AIOS | Close v0.2.x provenance/report fixtures; distinguish local ChaosReport from native AIOS export |
| P1 | Narrow intent benchmark | Sidecar | 3-5 off/on fixtures, catch and false-positive rates, explicit behavior for missing bindings and expired intent |
| P1 | Dataset/provenance foundation | Lens | Immutable inputs and judge identity before broader experiments |
| P1 | Compatibility and conformance | AIOS + implementers | Independent review plus valid/invalid producer-consumer fixtures; no stable claims before freeze |
| P2 | End-to-end offline workflow | All runtime repos | One correlated allowed/blocked/faulted workflow, documented outputs and failure expectations |
| P2 | Registry/read-only API | Control Tower | Registration/heartbeat persistence/health semantics and real API before UI or fleet writes |
| P2 | Version matrix CI | MCP + Chaos + Lens + Sidecar | Test supported released dependency combinations and local changes, including artifact round trips |
| P2 | Synchronize public story | Website/docs | Current inventory, 14-tool scope, draft vs implemented vs stable labels and bounded integration claims |

This audit makes no product behavior changes. The full end-to-end workflow is
the next deliverable after the P0 integration gaps, not something this report
claims to have built.
