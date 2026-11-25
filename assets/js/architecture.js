(function () {
  var mount = document.getElementById("arch-artwork");
  if (!mount) return;

  var DATA = {
    nodes: {
      users: {
        title: "Users",
        subtitle: "Developers  |  AI Agents  |  Enterprise Applications",
        role: "PEOPLE",
        description:
          "The developers, AI agents, and enterprise applications using the ecosystem.",
      },
      tower: {
        title: "DeepAgent Control Tower",
        package: "agenticops-control-tower",
        version: "v1.0.4",
        subtitle: "Manage  |  Monitor  |  Evaluate  |  Govern  |  Scale",
        role: "OPERATE",
        description:
          "A fleet operations control plane with a persistent registry, authenticated HTTP API and CLI, read-only console, shared evidence posture, alerts, and incident views. Configuration and recovery actions use approval controls; production runtime adapters remain limited.",
      },
      spec: {
        title: "AI Operations Specification",
        package: "ai-operations-spec",
        version: "package v0.5.1  ·  specification through v0.6 exploratory drafts",
        subtitle: "shared runtime model, semantic events, artifacts, schemas",
        role: "STANDARDIZE",
        description:
          "A pre-release draft vocabulary and artifact specification for runs, steps, model and tool calls, evaluations, incidents, events, and relationships. Vendor neutrality is the design goal; external review and independent validation remain open, so stable conformance is not claimed.",
      },
    },
    towerCapabilities: [
      {
        id: "tower-console",
        label: "Read-only AgenticOps Console",
        detail:
          "The console shows inventory, fleet health, capability coverage, evidence posture, alerts, and incident views. Writes are handled through authenticated API or CLI workflows.",
      },
      {
        id: "tower-registry",
        label: "Persistent Agent Registry",
        detail:
          "Agent registration and inventory can persist to SQLite; offline snapshots are also supported.",
      },
      {
        id: "tower-discovery",
        label: "Capability and Version Inventory",
        detail:
          "The API and console report installed capabilities, versions, environment coverage, and fleet health.",
      },
      {
        id: "tower-configuration",
        label: "Approved Configuration",
        detail:
          "Tower-owned configuration supports preview, independent approval, execution, expiry, revision checks, and audit records.",
      },
      {
        id: "tower-security",
        label: "Bearer Authorization",
        detail:
          "HTTP and CLI operations support reader and writer bearer authorization, with a separate approval token. RBAC is not claimed.",
      },
      {
        id: "tower-api",
        label: "HTTP API and CLI",
        detail:
          "The authenticated HTTP API and CLI expose registry, inventory, configuration, evidence, alerts, and incident workflows. Runtime adapters remain bounded.",
      },
    ],
    packages: [
      {
        id: "lens",
        title: "AgenticLens",
        package: "agenticlens",
        version: "v1.0.4",
        role: "OBSERVE",
        tagline: "Make agents observable",
        color: "lens",
        icon: "lens",
        description:
          "Local-first, OpenTelemetry-native observation and evaluation for AI workflows: ingest traces, track cost and latency, compare runs, and produce evidence-backed findings.",
        capabilities: [
          "Observe",
          "Evaluate traces",
          "Explain",
          "Recommend",
          "Export",
          "Compare",
          "Audit evidence",
        ],
        outputNote:
          "Export JSON, CSV, Markdown, Jira-oriented output, and OTLP traces; generate HTML evaluation and experiment reports. A Semantica exporter is not verified in the current implementation.",
      },
      {
        id: "evals",
        title: "Agentic Evals",
        package: "agentic-evals",
        version: "v1.0.4",
        role: "EVALUATE",
        tagline: "Measure what matters",
        color: "evals",
        icon: "evals",
        description:
          "A standalone, framework-agnostic scoring engine with deterministic checks, LLM-as-judge evaluators, live targets, reusable suites, and CI release gates. MCP release checks and Control Tower evidence workflows can consume native Evals reports.",
        capabilities: [
          "Score",
          "Live target evaluation",
          "LLM-as-Judge",
          "Trajectory Evals",
          "Eval Suites",
          "Release Gates",
          "Regression suites",
          "CI integration",
        ],
        outputNote:
          "Agentic Evals remains independently usable. MCP release checks and Control Tower evidence ingestion support its native reports; exact compatibility depends on installed versions.",
      },
      {
        id: "sidecar",
        title: "Agentic Sidecar",
        package: "agentic-sidecar",
        version: "v1.0.4",
        role: "SUPERVISE",
        tagline: "Keep agents safe and aligned",
        color: "sidecar",
        icon: "sidecar",
        description:
          "Runtime supervision checks plans and actions against intent, constraints, policy, and risk. Supported integrations include LangGraph, AutoGen, CrewAI, OpenAI Agents, Google ADK, and MCP, with evidence and adapter coverage varying by integration.",
        capabilities: [
          "Supervise",
          "Govern",
          "Align intent",
          "Context (generic and specific)",
          "Guardrails (generic and specific)",
          "Judge / Critic",
          "Escalate",
          "Human approval",
          "Live agent status",
          "Pause / Approve / Reject",
        ],
        outputNote:
          "The current runtime includes intent/context injection, guardrail checks, critique and judge stages, human escalation, runtime status/control, audit events, and Lens/Chaos integrations. Stable shared schemas and broader adapter evidence remain in progress.",
      },
      {
        id: "chaos",
        title: "Agentic Chaos",
        package: "agentic-chaos",
        version: "v1.0.4",
        role: "TEST / BREAK",
        tagline: "Build resilient agents",
        color: "chaos",
        icon: "chaos",
        description:
          "A standalone resilience-testing toolkit for LLM and agent workflows. It injects controlled faults, runs declarative experiments, records outcomes, and supports AIOS artifact export.",
        capabilities: [
          "Fault injection",
          "Declarative experiments",
          "Workflow fault scenarios",
          "Safety controls",
          "Recovery checks",
          "Resilience probes",
          "Resilience scoring",
          "Experiment reports",
        ],
        outputNote:
          "Chaos emits native experiment reports and AIOS Run artifacts, supports pre/during/post probes and evidence-based resilience scoring, and includes offline recipes with opt-in recipe exchange.",
      },
      {
        id: "mcp",
        title: "MCP Server",
        package: "deep-agentic-core-mcp",
        version: "v1.1.0",
        role: "CONNECT",
        tagline: "Integrate with your ecosystem",
        color: "mcp",
        icon: "mcp",
        description:
          "Access DeepAgentLabs from MCP-capable CLI clients, discover AI-readable documentation for all seven products, and invoke supported product operations, including Control Tower workflows. Available controls depend on transport, installed integrations, permissions, and approvals.",
        capabilities: [
          "CLI / MCP client access",
          "All-product access",
          "Supported product controls",
          "AI-readable documentation",
          "Unified MCP interface",
          "Access tools & data sources",
          "Connect to enterprise systems (planned)",
          "Share context across agents (planned)",
          "Secure access layer",
          "Extend with custom tools (planned)",
          "Run comparisons",
          "Combined release checks",
          "Hosted access controls",
          "AIOS artifact validation",
        ],
        outputNote:
          "Hosted and local transports expose selected Lens analysis, Evals release checks, Sidecar discovery, Control Tower posture/investigation, and AIOS validation. Chaos code execution is limited to trusted local stdio; hosted HTTP accepts locally generated Chaos reports.",
      },
    ],
    frameworks: [
      "LangGraph",
      "CrewAI",
      "OpenAI Agents SDK",
      "AutoGen",
      "LlamaIndex",
      "custom apps",
    ],
    outputs: [
      {
        id: "out-json",
        label: "JSON",
        icon: "{ }",
        owner: "lens",
        status: "current",
        detail: "AgenticLens JSON output is documented.",
      },
      {
        id: "out-csv",
        label: "CSV",
        icon: "▦",
        owner: "lens",
        status: "current",
        detail: "AgenticLens CSV output is documented.",
      },
      {
        id: "out-markdown",
        label: "Markdown",
        icon: "M↓",
        owner: "lens",
        status: "current",
        detail: "AgenticLens Markdown output is documented.",
      },
      {
        id: "out-html",
        label: "HTML",
        icon: "</>",
        owner: "lens",
        status: "reference",
        detail:
          "HTML appears in the original reference map; available local AgenticLens documentation does not verify this exporter.",
      },
      {
        id: "out-jira",
        label: "Jira",
        icon: "◆",
        owner: "lens",
        status: "current",
        detail: "Jira-oriented AgenticLens output is documented.",
      },
      {
        id: "out-otel",
        label: "OpenTelemetry",
        icon: "◉",
        owner: "lens",
        status: "current",
        detail:
          "AgenticLens documents OpenTelemetry Protocol (OTLP) trace export.",
      },
      {
        id: "out-semantica",
        label: "Semantica",
        icon: "∴",
        owner: "lens",
        status: "reference",
        detail:
          "Semantica appears in the original reference map; available local documentation does not establish a current AgenticLens exporter.",
      },
      {
        id: "out-evals",
        label:
          "Evaluation reports · scores · pass/fail · release-gate decisions",
        icon: "✓",
        owner: "evals",
        status: "current",
        detail:
          "These evaluation result types are listed in the requested architecture reference; Agentic Evals is currently standalone.",
      },
      {
        id: "out-sidecar",
        label:
          "Decision records · approval/escalation history · governance export",
        icon: "◇",
        owner: "sidecar",
        status: "planned",
        detail:
          "The local audit lists the remaining Sidecar outcome, escalation, and export workflow as incomplete.",
      },
      {
        id: "out-chaos",
        label: "Resilience evidence · experiment reports",
        icon: "ϟ",
        owner: "chaos",
        status: "current",
        detail:
          "Agentic Chaos records typed events and produces standalone ChaosReport JSON.",
      },
      {
        id: "out-mcp",
        label: "Selected shared workflows through MCP",
        icon: "↗",
        owner: "mcp",
        status: "current",
        detail:
          "MCP exposes selected Lens, Evals, Chaos, Sidecar, Control Tower, and AIOS workflows, with availability varying by transport and version.",
      },
    ],
    principles: [
      {
        title: "Runtime Agnostic",
        subtitle: "Works with any agent framework",
        icon: "cube",
      },
      {
        title: "Framework Agnostic",
        subtitle: "Use what you love",
        icon: "plug",
      },
      {
        title: "Modular · Open Source",
        subtitle: "MIT Licensed",
        icon: "lock",
      },
      {
        title: "Human + AI Operable",
        subtitle: "Designed for real-world teams",
        icon: "team",
      },
    ],
    relationships: [
      {
        id: "users-tower",
        from: "users",
        to: "tower",
        status: "context",
        label: "People access Control Tower and its MCP interface",
      },
      {
        id: "tower-spec",
        from: "tower",
        to: "spec",
        status: "context",
        label: "Tower evidence follows shared draft semantics; no stable conformance claim",
      },
      {
        id: "spec-lens",
        from: "spec",
        to: "lens",
        status: "current",
        label: "validates supplied AIOS draft artifacts",
      },
      {
        id: "spec-evals",
        from: "spec",
        to: "evals",
        status: "planned",
        label: "shared contract; no direct wiring",
      },
      {
        id: "spec-sidecar",
        from: "spec",
        to: "sidecar",
        status: "planned",
        label: "intent schema integration planned",
      },
      {
        id: "spec-chaos",
        from: "spec",
        to: "chaos",
        status: "current",
        label: "Chaos exports experiment evidence as AIOS Run artifacts",
      },
      {
        id: "spec-mcp",
        from: "spec",
        to: "mcp",
        status: "current",
        label: "validates supplied draft artifacts through MCP",
      },
      {
        id: "chaos-lens",
        from: "chaos",
        to: "lens",
        status: "current",
        label: "optional Chaos events attach to Lens workflow reports",
      },
      {
        id: "mcp-lens",
        from: "mcp",
        to: "lens",
        status: "current",
        label: "MCP exposes Lens analysis",
      },
      {
        id: "mcp-evals",
        from: "mcp",
        to: "evals",
        status: "current",
        label: "MCP release checks use native Evals reports and gates",
      },
      {
        id: "mcp-sidecar",
        from: "mcp",
        to: "sidecar",
        status: "current",
        label: "MCP exposes Sidecar status and inventory",
      },
      {
        id: "mcp-chaos",
        from: "mcp",
        to: "chaos",
        status: "current",
        label: "MCP exposes Chaos tools",
      },
      {
        id: "sidecar-lens",
        from: "sidecar",
        to: "lens",
        status: "current",
        label: "Sidecar decisions can be correlated with Lens evidence",
      },
      {
        id: "sidecar-chaos",
        from: "sidecar",
        to: "chaos",
        status: "current",
        label: "Sidecar supervision evidence is tested with Chaos fixtures",
      },
      {
        id: "tower-mcp",
        from: "mcp",
        to: "tower",
        status: "current",
        label: "Tower MCP connector supports investigation and posture workflows",
      },
      {
        id: "tower-lens",
        from: "tower",
        to: "lens",
        status: "current",
        label: "Push-based Lens evidence ingestion; remote pull collection is not included",
      },
      {
        id: "tower-evals",
        from: "tower",
        to: "evals",
        status: "current",
        label: "Push-based Evals report and gate evidence ingestion",
      },
      {
        id: "tower-chaos",
        from: "tower",
        to: "chaos",
        status: "current",
        label: "Push-based Chaos report ingestion; Tower does not run experiments",
      },
      {
        id: "tower-sidecar",
        from: "tower",
        to: "sidecar",
        status: "current",
        label: "Push-based Sidecar decision and journal evidence ingestion",
      },
      {
        id: "frameworks-spec",
        from: "frameworks",
        to: "spec",
        status: "context",
        label: "Instrument & Integrate",
      },
    ],
  };

  var SVG_NS = "http://www.w3.org/2000/svg";
  var traceTimer = null;
  var traceIndex = -1;
  var selectedPackage = "lens";
  var artwork = null;
  var panel = document.querySelector(".arch-panel");
  var traceStatus = document.getElementById("arch-trace-status");
  var traceButton = document.getElementById("arch-trace");

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, function (char) {
      return {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      }[char];
    });
  }

  function icon(name) {
    var paths = {
      lens: '<circle cx="10.5" cy="10.5" r="6.5"/><path d="m15.5 15.5 5 5"/>',
      evals: '<path d="M4 19h3V12H4zM10 19h3V8h-3zM16 19h3V4h-3z"/>',
      sidecar:
        '<path d="M12 3 20 6v5c0 5-3.5 8.2-8 10-4.5-1.8-8-5-8-10V6z"/><path d="m9 12 2 2 4-4"/>',
      chaos: '<path d="M13 2 5 13h6l-1 9 9-12h-6z"/>',
      mcp: '<circle cx="12" cy="5" r="2"/><circle cx="6" cy="18" r="2"/><circle cx="18" cy="18" r="2"/><path d="M12 7v5m0 0H6v4m6-4h6v4"/>',
      spec: '<path d="M6 3h8l5 5v13H6zM14 3v6h5M9 13h7m-7 4h7"/>',
      tower:
        '<path d="M5 21h14M7 21V8h10v13M9 8V4h6v4M4 8h16M10 12h1m2 0h1m-4 4h1m2 0h1"/>',
      console:
        '<rect x="3" y="4" width="18" height="13" rx="1"/><path d="M8 21h8m-4-4v4M7 8l3 2-3 2m5 0h4"/>',
      registry:
        '<circle cx="9" cy="8" r="3"/><path d="M3 20c0-3 2.5-5 6-5s6 2 6 5m2-9 2 2 3-4"/>',
      discovery:
        '<circle cx="10" cy="10" r="6"/><path d="m14.5 14.5 5 5M8 10h4m-2-2v4"/>',
      configuration:
        '<circle cx="12" cy="12" r="3"/><path d="M19 13.5a7 7 0 0 0 0-3l2-1.5-2-3.5-2.4 1a7 7 0 0 0-2.6-1.5L13.5 2h-4L9 5a7 7 0 0 0-2.5 1.5l-2.5-1L2 9l2 1.5a7 7 0 0 0 0 3L2 15l2 3.5 2.5-1A7 7 0 0 0 9 19l.5 3h4l.5-3a7 7 0 0 0 2.6-1.5l2.4 1 2-3.5z"/>',
      security:
        '<path d="M12 3 20 6v5c0 5-3.5 8.2-8 10-4.5-1.8-8-5-8-10V6z"/><path d="m9 12 2 2 4-4"/>',
      api: '<circle cx="5" cy="12" r="2"/><circle cx="19" cy="6" r="2"/><circle cx="19" cy="18" r="2"/><path d="m7 11 10-4M7 13l10 4"/>',
      framework:
        '<rect x="4" y="4" width="16" height="16" rx="2"/><path d="M9 1v3m6-3v3M9 20v3m6-3v3M1 9h3m16 0h3M1 15h3m16 0h3M9 9h6v6H9z"/>',
      cube: '<path d="m12 2 9 5v10l-9 5-9-5V7zM3 7l9 5 9-5m-9 5v10"/>',
      plug: '<path d="M9 7V3m6 4V3M7 7h10v4a5 5 0 0 1-10 0zm5 9v5"/>',
      lock: '<rect x="5" y="10" width="14" height="11" rx="1"/><path d="M8 10V7a4 4 0 0 1 8 0v3m-4 4v3"/>',
      team: '<circle cx="9" cy="8" r="3"/><path d="M3 20v-2a6 6 0 0 1 12 0v2m2-9a3 3 0 1 0 0-6m1 8a5 5 0 0 1 4 5v1"/>',
    };
    return (
      '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">' +
      (paths[name] || paths.spec) +
      "</svg>"
    );
  }

  function capabilityDescription(packageId, label) {
    var descriptions = {
      Observe:
        "OTLP trace ingestion and workflow observation are documented AgenticLens capabilities.",
      "Evaluate traces":
        "Evaluate recorded traces and live-target results through Agentic Evals adapters, with Lens trace-aware evaluators and evidence analysis. Pre-action supervision belongs to Sidecar.",
      Explain:
        "AgenticLens surfaces evidence-backed findings and explanations from workflow analysis.",
      Recommend:
        "AgenticLens produces recommendations from recorded workflow evidence.",
      Export:
        "Export JSON, CSV, Markdown, Jira-oriented output, and OTLP traces; generate HTML evaluation and experiment reports.",
      Compare: "AgenticLens compares saved runs and reports their differences.",
      "Audit evidence":
        "Audit evaluation reports for evaluator identity and versions, failed-case trace links, and cost coverage and provenance.",
      Score:
        "Agentic Evals scores outputs using deterministic and evaluator-backed checks.",
      "Live target evaluation":
        "Run a supplied test suite against Python callables or HTTP endpoints and capture outputs, traces, latency, errors, and available cost data.",
      "LLM-as-Judge":
        "Agentic Evals supports provider-neutral LLM judges, rubric-based verdicts, retries, usage reporting, and repeated-judgment agreement checks.",
      "Trajectory Evals":
        "Score recorded execution paths for tool selection, required-tool coverage, redundant calls, and efficiency against supplied latency or cost baselines.",
      "Eval Suites":
        "Agentic Evals documents declarative TestSuite and TestCase APIs.",
      "Release Gates":
        "Compute pass/fail decisions from suite, tag, metric, cost, latency, judge, and live-target thresholds. Your pipeline controls deployment enforcement.",
      "Regression suites":
        "Re-run fixed suites and apply explicit score and gate thresholds to catch regressions. Statistical comparison of repeated runs is provided by Lens.",
      "CI integration":
        "The agentic-evals CLI discovers evaluation files and returns a nonzero exit code on failure. Configure your CI pipeline to enforce that result.",
      Supervise:
        "Sidecar watches the agent's next action against declared intent.",
      Govern:
        "Sidecar can allow, warn, or block through an attached wrapper; enforcement is scoped to that wrapper.",
      "Align intent":
        "Sidecar checks actions against numeric, enum, and allow-list intent constraints.",
      "Context (generic and specific)":
        "Provide shared context across a system or task and exclusive context for a specific agent, with explicit delivery, reader access, expiry, and revocation.",
      "Guardrails (generic and specific)":
        "Apply shared system or task guardrails alongside agent-specific rules. Shared guardrails remain mandatory when exclusive rules are added; enforcement depends on the attached adapter.",
      "Judge / Critic":
        "Planner and Critic apply bounded checks to plans and available evidence; Judge supports a mock provider and optional live OpenAI/Anthropic providers.",
      Escalate:
        "Human escalation supports local and HTTP approval handlers, CLI prompts, and correlated audit events.",
      "Human approval":
        "Human approval is available through Sidecar's local and HTTP handlers and CLI control flow.",
      "Live agent status":
        "Runtime-connected status, follow mode, narration, and control/approval commands are available; coverage varies by adapter.",
      "Pause / Approve / Reject":
        "Pause or suspend governed actions and resolve approval requests by approving or rejecting them. Runtime control depends on the attached adapter.",
      "Fault injection":
        "Inject controlled timeouts, rate limits, malformed responses, tool failures, and other configured faults at instrumented call sites.",
      "Declarative experiments":
        "Load JSON, TOML, or optional YAML experiments with configured faults, targets, contracts, and safety limits.",
      "Workflow fault scenarios":
        "Run multi-step chaos workflows with step-specific faults, contracts, and recorded outcomes.",
      "Safety controls":
        "Dry runs, injection and duration limits, recorded-cost limits, and circuit breakers bound instrumented experiments. In-flight calls are not guaranteed to be cancelled.",
      "Recovery checks":
        "Check explicit retry, fallback, and recovery contracts against recorded calls and injected failures.",
      "Resilience probes":
        "Run health, latency, response-quality, or custom probes before, during, and after fault injection.",
      "Resilience scoring":
        "Compute a 0-100 score from experiment evidence when sufficient evidence is available; inconclusive runs have no numeric score.",
      "Experiment reports":
        "Save native reports with faults, calls, contract outcomes, probes, and resilience evidence; export AIOS Run artifacts when needed.",
      "CLI / MCP client access":
        "Use an MCP-capable command-line client to call server tools over local stdio or hosted HTTP. The server launch command starts MCP; each product also retains its own CLI.",
      "Unified MCP interface":
        "Connect once through MCP to discover and invoke selected DeepAgentLabs tools over trusted local stdio or authenticated hosted HTTP.",
      "Access tools & data sources":
        "Access exposed ecosystem tools, supplied workflow artifacts, authorized saved reports, documentation, and configured Tower evidence. Available sources depend on installed integrations and permissions.",
      "Connect to enterprise systems (planned)":
        "Enterprise-system connectors are an architecture goal. Dedicated connectors to external enterprise applications have not been verified in the current implementation.",
      "Share context across agents (planned)":
        "General cross-agent context sharing is an architecture goal. Current authorized session state and saved reports do not establish automatic context synchronization between agents.",
      "Secure access layer":
        "Hosted access uses authentication, tool allow/deny policies, expiry, task scope, revocation, and access audit records. Local stdio is intended for a trusted environment; Tower retains its own authorization and approval controls.",
      "Extend with custom tools (planned)":
        "A supported custom-tool extension interface is an architecture goal. The current source registry can be developed further, but a public plug-in API for arbitrary custom tools has not been verified.",
      "All-product access":
        "Discover bundled references for all seven products: Lens, Evals, Sidecar, Chaos, Control Tower, AI Operations Specification, and MCP. Runtime tool coverage varies by product, transport, and installed integrations.",
      "Supported product controls":
        "Invoke exposed product operations, including Lens analysis, Evals release checks, trusted local Chaos experiments, Sidecar discovery, AIOS validation, and supported Control Tower actions. Tower writes retain authentication and approval requirements; full feature control stays with each product's API or CLI.",
      "Run comparisons":
        "Compose Lens baseline-versus-candidate trace comparisons through core.compare_runs and retain results for release checks.",
      "Combined release checks":
        "Combine producer-owned Lens, Evals, and Chaos evidence through core.release_check; missing required evidence or malformed reports block readiness.",
      "Hosted access controls":
        "Hosted keys support tool allow/deny policies, expiry, task scope, dispatch-time authorization, revocation, and access audit records.",
      "AIOS artifact validation":
        "Validate supported AIOS draft artifacts using the specification adapter. Validation does not certify production readiness.",
      "AI-readable documentation":
        "Discover, search, and read bundled references for all seven projects through core.docs_catalog, core.docs_search, and core.docs_read, without installing sibling packages.",
    };
    return (
      descriptions[label] ||
      packageId + " capability listed in the original architecture reference."
    );
  }

  function packageCard(item, index) {
    var caps = item.capabilities
      .map(function (capability, capIndex) {
        return (
          '<button type="button" class="arch-capability" data-select-type="capability" data-package="' +
          item.id +
          '" data-capability="' +
          capIndex +
          '" aria-label="' +
          escapeHtml(
            capability + ". " + capabilityDescription(item.id, capability),
          ) +
          '"><span class="arch-cap-icon" aria-hidden="true">' +
          icon(item.icon) +
          "</span><span>" +
          escapeHtml(capability) +
          "</span></button>"
        );
      })
      .join("");
    return (
      '<article class="arch-package arch-color-' +
      item.color +
      ' arch-anchor" data-anchor-id="' +
      item.id +
      '" data-package-card="' +
      item.id +
      '" style="--card-order:' +
      index +
      '">' +
      '<button type="button" class="arch-package-head arch-major-node" data-select-type="package" data-id="' +
      item.id +
      '" data-arch-node="' +
      item.id +
      '" aria-label="Select ' +
      escapeHtml(item.title + ", " + item.package + ", " + item.version) +
      '"><span class="arch-package-glyph" aria-hidden="true">' +
      icon(item.icon) +
      '</span><span class="arch-package-heading"><span class="arch-category">' +
      escapeHtml(item.role) +
      "</span><strong>" +
      escapeHtml(item.title) +
      '</strong><span class="arch-package-name">(' +
      escapeHtml(item.package) +
      ')</span><span class="arch-package-version">' +
      escapeHtml(item.version) +
      "</span></span></button>" +
      '<div class="arch-capabilities" aria-label="' +
      escapeHtml(item.title) +
      ' capabilities">' +
      caps +
      "</div>" +
      '<div class="arch-package-footer"><strong>' +
      escapeHtml(item.role) +
      "</strong><span>" +
      escapeHtml(item.tagline) +
      "</span></div></article>"
    );
  }

  function outputButton(output) {
    var statusLabel =
      output.status === "planned"
        ? "planned"
        : output.status === "reference"
          ? "not verified in local package docs"
          : "documented";
    return (
      '<button type="button" class="arch-output arch-output-' +
      output.status +
      '" data-select-type="output" data-id="' +
      output.id +
      '" data-owner="' +
      output.owner +
      '" aria-label="' +
      escapeHtml(output.label + ", " + statusLabel) +
      '"><span class="arch-output-icon" aria-hidden="true">' +
      escapeHtml(output.icon) +
      "</span><span>" +
      escapeHtml(output.label) +
      "</span><small>" +
      escapeHtml(statusLabel) +
      "</small></button>"
    );
  }

  function packageOutputGroups() {
    return DATA.packages.map(function (pack) {
      var outputs = DATA.outputs.filter(function (output) {
        return output.owner === pack.id;
      });
      var status = outputs.some(function (output) {
        return output.status === "current";
      })
        ? "current"
        : outputs.some(function (output) {
              return output.status === "planned";
            })
          ? "planned"
          : "reference";
      return {
        id: "outputs-" + pack.id,
        owner: pack.id,
        title: pack.title,
        color: pack.color,
        outputs: outputs,
        status: status,
      };
    });
  }

  function render() {
    var towerFeatures = DATA.towerCapabilities
      .map(function (capability, index) {
        return (
          '<button type="button" class="arch-tower-cap" data-select-type="tower-capability" data-id="' +
          capability.id +
          '" data-capability="' +
          index +
          '"><span class="arch-tower-icon" aria-hidden="true">' +
          icon(
            [
              "console",
              "registry",
              "discovery",
              "configuration",
              "security",
              "api",
            ][index],
          ) +
          "</span><span>" +
          escapeHtml(capability.label) +
          "</span></button>"
        );
      })
      .join("");
    var frameworks = DATA.frameworks
      .map(function (name, index) {
        return (
          '<button type="button" class="arch-framework-chip" data-select-type="framework" data-id="framework-' +
          index +
          '">' +
          escapeHtml(name) +
          "</button>"
        );
      })
      .join("");
    var packages = DATA.packages.filter(function (item) {
      return item.id !== "mcp";
    }).map(packageCard).join("");
    var mcp = packageCard(packageById("mcp"), 4);
    var outputGroups = packageOutputGroups()
      .map(function (group) {
        return (
          '<div class="arch-output-group arch-color-' +
          group.color +
          ' arch-anchor" data-anchor-id="' +
          group.id +
          '"><h5>' +
          group.title +
          '</h5><div class="arch-output-list">' +
          group.outputs
            .map(function (output) {
              return outputButton(output);
            })
            .join("") +
          "</div></div>"
        );
      })
      .join("");
    var principles = DATA.principles
      .map(function (principle, index) {
        return (
          '<div class="arch-principle"><span class="arch-principle-icon" aria-hidden="true">' +
          icon(principle.icon) +
          "</span><span><strong>" +
          escapeHtml(principle.title) +
          "</strong><small>" +
          escapeHtml(principle.subtitle) +
          "</small></span></div>"
        );
      })
      .join("");

    mount.innerHTML =
      '<svg class="arch-connection-overlay" aria-hidden="true" focusable="false"><defs><marker id="arch-arrow-current" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0 10 5 0 10z"/></marker><marker id="arch-arrow-planned" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0 10 5 0 10z"/></marker><marker id="arch-arrow-context" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0 10 5 0 10z"/></marker></defs><g id="arch-connection-paths"></g></svg>' +
      '<div class="arch-top-layout"><div class="arch-spine">' +
      '<button type="button" class="arch-flow-node arch-users arch-anchor arch-major-node" data-anchor-id="users" data-select-type="node" data-id="users" data-arch-node="users"><span class="arch-flow-icon" aria-hidden="true">' +
      icon("team") +
      "</span><span><strong>USERS</strong><small>Developers　|　AI Agents　|　Enterprise Applications</small></span></button>" +
      '<section class="arch-tower arch-tower-with-mcp arch-anchor" data-anchor-id="tower"><div class="arch-tower-main"><button type="button" class="arch-tower-title arch-major-node" data-select-type="node" data-id="tower" data-arch-node="tower"><span class="arch-tower-glyph" aria-hidden="true">' +
      icon("tower") +
      '</span><span><strong>DeepAgent Control Tower</strong><small>Manage　|　Monitor　|　Evaluate　|　Govern　|　Scale</small></span></button><div class="arch-tower-capabilities">' +
      towerFeatures +
      '</div></div><span class="arch-mcp-tower-link" aria-hidden="true"><svg width="28" height="24" viewBox="0 0 32 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M30 8H13V2L2 12l11 10v-6h17z"/></svg></span>' +
      mcp + '</section>' +
      '<button type="button" class="arch-spec arch-anchor arch-major-node" data-anchor-id="spec" data-select-type="node" data-id="spec" data-arch-node="spec"><span class="arch-spec-glyph" aria-hidden="true">' +
      icon("spec") +
      "</span><span><strong>AI Operations Specification</strong><small>shared runtime model, semantic events, artifacts, schemas</small></span><b>STANDARDIZE</b></button>" +
      '</div><aside class="arch-frameworks arch-anchor" data-anchor-id="frameworks"><button type="button" class="arch-framework-title" data-select-type="frameworks" data-id="frameworks"><span aria-hidden="true">' +
      icon("framework") +
      '</span><strong>AI Frameworks &amp; Runtimes</strong></button><div class="arch-framework-list">' +
      frameworks +
      '</div><button type="button" class="arch-instrument" data-select-type="frameworks" data-id="frameworks"><span class="arch-rel-mark" aria-hidden="true">↔</span>Instrument &amp; Integrate</button></aside></div>' +
      '<section class="arch-package-layer" aria-label="Ecosystem package capabilities"><div class="arch-layer-heading"><span>THE TOOLING LAYER</span><span>Select any card or capability</span></div><div class="arch-package-grid">' +
      packages +
      "</div></section>" +
      '<section class="arch-exports arch-anchor" data-anchor-id="exports" aria-label="Exports and outputs"><div class="arch-export-title"><span>OUTPUTS / EXPORTS</span><span>Formats and evidence across the ecosystem</span></div><div class="arch-output-groups">' +
      outputGroups +
      "</div></section>" +
      '<section class="arch-principles" aria-label="Architecture principles">' +
      principles +
      "</section>" +
      '<p class="arch-source-note">Solid green = current integration　·　Dotted gray = planned integration　·　Fine dark line = architecture context. Draft AIOS alignment is not stable conformance.</p>';
    artwork = mount;
    drawConnections();
  }

  function createSvg(tag, attrs) {
    var element = document.createElementNS(SVG_NS, tag);
    Object.keys(attrs).forEach(function (key) {
      element.setAttribute(key, attrs[key]);
    });
    return element;
  }

  function connectionPath(fromId, toId, relationship) {
    var fromElement = artwork.querySelector(
      '[data-anchor-id="' + fromId + '"]',
    );
    var toElement = artwork.querySelector('[data-anchor-id="' + toId + '"]');
    if (!fromElement || !toElement) return null;
    // skip anchors that are hidden (e.g. collapsed exports in the compact view)
    if (!fromElement.getClientRects().length || !toElement.getClientRects().length) return null;
    var root = artwork.getBoundingClientRect();
    var fromRect = fromElement.getBoundingClientRect();
    var toRect = toElement.getBoundingClientRect();
    var fromAbove = fromRect.bottom <= toRect.top + 4;
    var toBelow = toRect.bottom <= fromRect.top + 4;
    var start, end;
    if (fromAbove) {
      start = {
        x: fromRect.left + fromRect.width / 2 - root.left,
        y: fromRect.bottom - root.top,
      };
      end = {
        x: toRect.left + toRect.width / 2 - root.left,
        y: toRect.top - root.top,
      };
    } else if (toBelow) {
      start = {
        x: fromRect.left + fromRect.width / 2 - root.left,
        y: fromRect.top - root.top,
      };
      end = {
        x: toRect.left + toRect.width / 2 - root.left,
        y: toRect.bottom - root.top,
      };
    } else {
      var fromLeft =
        fromRect.left + fromRect.width / 2 < toRect.left + toRect.width / 2;
      start = {
        x: (fromLeft ? fromRect.right : fromRect.left) - root.left,
        y: fromRect.top + fromRect.height / 2 - root.top,
      };
      end = {
        x: (fromLeft ? toRect.left : toRect.right) - root.left,
        y: toRect.top + toRect.height / 2 - root.top,
      };
    }
    // Tower -> tooling connectors: all four share one line from the Tower
    // that runs behind the spec box, then diverge from the box's bottom
    // centre to each card using the same curve as the other connectors.
    var towerFan = ["lens", "evals", "sidecar", "chaos"];
    if (fromId === "tower" && towerFan.indexOf(toId) !== -1) {
      // When the cards wrap (narrow screens) the fan would cut through the
      // first row, so leave it out of the overview there.
      var firstCard = artwork.querySelector('[data-anchor-id="lens"]');
      if (!fromAbove || (firstCard && toRect.top > firstCard.getBoundingClientRect().top + 4))
        return null;
      var specElement = artwork.querySelector('[data-anchor-id="spec"]');
      if (specElement && specElement.getClientRects().length) {
        var spec = specElement.getBoundingClientRect();
        // Small left-to-right offset so the four lines leave the box a
        // little apart rather than from a single pixel.
        var spread = 14 * (towerFan.indexOf(toId) - (towerFan.length - 1) / 2);
        var split = {
          x:
            Math.min(Math.max(start.x, spec.left - root.left + 24), spec.right - root.left - 24) +
            spread,
          y: spec.bottom - root.top,
        };
        // Rounded "metro" route below the box: down, round corner, across,
        // round corner, down into the card. Outer lines turn higher than
        // inner ones so the routes nest without crossing.
        var fanIndex = towerFan.indexOf(toId);
        var outer = fanIndex === 0 || fanIndex === towerFan.length - 1;
        var gap = end.y - split.y;
        var level = split.y + gap * (outer ? 0.32 : 0.6);
        var dir = end.x < split.x ? -1 : 1;
        // Corners are stretched horizontally (elliptical) for a softer bend.
        var rV1 = Math.max(0, Math.min(24, level - split.y));
        var rV2 = Math.max(0, Math.min(24, end.y - level - 8));
        var rH = Math.max(0, Math.min(48, Math.abs(end.x - split.x) / 2));
        var route =
          " L " + split.x + " " + (level - rV1) +
          " C " + split.x + " " + level + " " + split.x + " " + level +
          " " + (split.x + dir * rH) + " " + level +
          " L " + (end.x - dir * rH) + " " + level +
          " C " + end.x + " " + level + " " + end.x + " " + level +
          " " + end.x + " " + (level + rV2) +
          " L " + end.x + " " + end.y;
        var fanPath = createSvg("path", {
          d:
            // Parallel drop from the Tower, slightly apart, behind the box.
            "M" + (start.x + spread) + " " + start.y +
            " L " + split.x + " " + split.y +
            route,
          class: "arch-connection arch-" + relationship.status,
          "data-relationship": relationship.id,
          "data-from": relationship.from,
          "data-to": relationship.to,
          "marker-end": "url(#arch-arrow-" + relationship.status + ")",
        });
        fanPath.dataset.label = relationship.label;
        return fanPath;
      }
    }
    var control = Math.max(22, Math.abs(end.y - start.y) * 0.42);
    var d;
    if (!fromAbove && !toBelow) {
      // Side-by-side boxes: horizontal handles so the line leaves and
      // enters level, and the arrowhead points straight into the box.
      var hControl = Math.max(22, Math.abs(end.x - start.x) * 0.45);
      var hDir = end.x > start.x ? 1 : -1;
      d =
        "M" + start.x + " " + start.y +
        " C " + (start.x + hDir * hControl) + " " + start.y +
        " " + (end.x - hDir * hControl) + " " + end.y +
        " " + end.x + " " + end.y;
    } else {
      d =
        "M" + start.x + " " + start.y +
        " C " + start.x + " " + (start.y + (fromAbove ? control : -control)) +
        " " + end.x + " " + (end.y + (fromAbove ? -control : control)) +
        " " + end.x + " " + end.y;
    }
    var path = createSvg("path", {
      d: d,
      class: "arch-connection arch-" + relationship.status,
      "data-relationship": relationship.id,
      "data-from": relationship.from,
      "data-to": relationship.to,
      "marker-end":
        "url(#arch-arrow-" +
        (relationship.status === "reference"
          ? "context"
          : relationship.status) +
        ")",
    });
    path.dataset.label = relationship.label;
    return path;
  }

  function drawConnections() {
    if (!artwork) return;
    var svg = artwork.querySelector(".arch-connection-overlay");
    var paths = artwork.querySelector("#arch-connection-paths");
    var rect = artwork.getBoundingClientRect();
    svg.setAttribute("width", rect.width);
    svg.setAttribute("height", rect.height);
    svg.setAttribute("viewBox", "0 0 " + rect.width + " " + rect.height);
    paths.replaceChildren();
    // Keep the overview to one connector per product. Other integrations
    // remain available in each component's connected-components details.
    var overviewConnections = [
      "users-tower",
      "frameworks-spec",
      // Tower evidence ingestion, drawn under the spec box (see connectionPath).
      "tower-lens",
      "tower-evals",
      "tower-sidecar",
      "tower-chaos",
    ];
    DATA.relationships
      .filter(function (relationship) {
        return overviewConnections.indexOf(relationship.id) !== -1;
      })
      .forEach(function (relationship) {
        var path = connectionPath(
          relationship.from,
          relationship.to,
          relationship,
        );
        if (path) paths.appendChild(path);
      });
  }

  function statusText(status) {
    if (status === "planned") return "Planned integration";
    if (status === "reference")
      return "Shown in original reference; not verified locally";
    if (status === "context") return "Architecture context";
    return "Current integration";
  }

  function relatedRelationships(id) {
    return DATA.relationships.filter(function (relationship) {
      return relationship.from === id || relationship.to === id;
    });
  }

  function select(target) {
    stopTrace(true);
    if (
      target.type === "package" ||
      target.type === "capability" ||
      target.type === "output"
    )
      selectedPackage = target.packageId || target.owner || target.id;
    clearTraceClasses();
    var focusIds = [target.id];
    if (target.packageId) focusIds.push(target.packageId);
    if (target.owner) focusIds.push(target.owner);
    if (target.type === "capability" || target.type === "output")
      focusIds = [target.packageId || target.owner];
    if (target.type === "framework" || target.type === "frameworks")
      focusIds = ["frameworks", "spec"];
    if (target.type === "tower-capability") focusIds = ["tower"];

    artwork.querySelectorAll("[data-arch-node]").forEach(function (element) {
      var nodeId = element.getAttribute("data-arch-node");
      element.classList.toggle(
        "arch-selected",
        focusIds.indexOf(nodeId) !== -1,
      );
      element.classList.toggle("arch-dim", focusIds.indexOf(nodeId) === -1);
    });
    artwork.querySelectorAll(".arch-package").forEach(function (element) {
      var selectedPackageCard =
        element.getAttribute("data-package-card") ===
        (target.packageId || target.owner || target.id);
      element.classList.toggle("arch-selected", selectedPackageCard);
      element.classList.toggle(
        "arch-dim",
        !selectedPackageCard &&
          ["package", "capability", "output"].indexOf(target.type) !== -1,
      );
    });
    artwork.querySelectorAll(".arch-frameworks").forEach(function (element) {
      element.classList.toggle(
        "arch-selected",
        focusIds.indexOf("frameworks") !== -1,
      );
      element.classList.toggle(
        "arch-dim",
        ["framework", "frameworks"].indexOf(target.type) === -1 &&
          ["package", "capability", "output"].indexOf(target.type) !== -1,
      );
    });
    artwork.querySelectorAll("[data-select-type]").forEach(function (element) {
      var selected = false;
      if (target.type === "capability") {
        selected =
          element.dataset.selectType === "capability" &&
          element.dataset.package === target.packageId &&
          Number(element.dataset.capability) === target.index;
      } else if (target.type === "tower-capability") {
        selected =
          element.dataset.selectType === "tower-capability" &&
          element.dataset.id === DATA.towerCapabilities[target.index].id;
      } else if (target.type === "output") {
        selected =
          element.dataset.selectType === "output" &&
          element.dataset.id === target.id;
      } else if (target.type === "framework") {
        selected =
          element.dataset.selectType === "framework" &&
          element.dataset.id === target.id;
      } else if (target.type === "frameworks") {
        selected = element.dataset.selectType === "frameworks";
      } else if (target.type === "package" || target.type === "node") {
        selected =
          element.dataset.selectType === target.type &&
          element.dataset.id === target.id;
      }
      element.classList.toggle("arch-selected", selected);
      element.setAttribute("aria-pressed", selected ? "true" : "false");
    });
    artwork.querySelectorAll(".arch-tower-cap").forEach(function (element) {
      element.classList.toggle(
        "arch-group-highlight",
        target.type === "node" && target.id === "tower",
      );
    });
    artwork.querySelectorAll(".arch-output-group").forEach(function (element) {
      var selectedOwner = target.packageId || target.owner || null;
      element.classList.toggle(
        "arch-dim",
        Boolean(selectedOwner) &&
          element.dataset.anchorId !== "outputs-" + selectedOwner,
      );
    });
    artwork.querySelectorAll(".arch-connection").forEach(function (path) {
      var touches =
        focusIds.indexOf(path.dataset.from) !== -1 ||
        focusIds.indexOf(path.dataset.to) !== -1;
      path.classList.toggle("arch-dim", !touches);
      path.classList.toggle("arch-active", touches);
    });
    renderDetails(target);
  }

  function clearTraceClasses() {
    artwork
      .querySelectorAll(".arch-trace-active, .arch-trace-dim")
      .forEach(function (element) {
        element.classList.remove("arch-trace-active", "arch-trace-dim");
      });
    artwork.querySelectorAll(".arch-connection").forEach(function (element) {
      element.classList.remove("arch-active", "arch-dim");
    });
  }

  function renderDetails(target) {
    var name = target.name || target.label || target.title;
    var version = target.version || "Architecture context";
    var description = target.description || target.detail || "";
    var role = target.role || target.kind || "ARCHITECTURE";
    if (target.type === "package") {
      var pack = packageById(target.id);
      name = pack.title;
      version = pack.version + "  ·  " + pack.package;
      description = pack.description;
      role = pack.role;
    } else if (target.type === "capability") {
      var owner = packageById(target.packageId);
      var capability = owner.capabilities[target.index];
      name = capability;
      version = owner.title + "  ·  " + owner.version;
      description = capabilityDescription(owner.id, capability);
      role = owner.role + " CAPABILITY";
    } else if (target.type === "tower-capability") {
      var towerCapability = DATA.towerCapabilities[target.index];
      name = towerCapability.label;
      version = "DeepAgent Control Tower  ·  " + DATA.nodes.tower.version;
      description = towerCapability.detail;
      role = "CONTROL TOWER CAPABILITY";
    } else if (target.type === "framework") {
      name = target.name;
      version = "AI Frameworks & Runtimes";
      description = target.description;
      role = "FRAMEWORK EXAMPLE";
    } else if (target.type === "frameworks") {
      name = "AI Frameworks & Runtimes";
      version = "Instrument & Integrate";
      description =
        "The ecosystem targets framework-neutral operation. AgenticLens and Evals accept portable workflow data; Sidecar and Chaos provide framework integrations with coverage that varies by adapter.";
      role = "ARCHITECTURE CONTEXT";
    } else if (target.type === "output") {
      var output = outputById(target.id);
      name = output.label;
      version =
        statusText(output.status) + "  ·  " + packageById(output.owner).title;
      description = output.detail;
      role = "EXPORT / RESULT";
    }
    document.getElementById("arch-panel-empty").hidden = true;
    document.getElementById("arch-panel-detail").hidden = false;
    document.getElementById("arch-pd-kind").textContent = role;
    document.getElementById("arch-pd-name").textContent = name;
    document.getElementById("arch-pd-version").textContent = version;
    document.getElementById("arch-pd-desc").textContent = description;
    var list = document.getElementById("arch-pd-edges");
    list.replaceChildren();
    var packageId =
      target.type === "package" ? target.id : target.packageId || target.owner;
    var relationships = packageId
      ? relatedRelationships(packageId)
      : relatedRelationships(target.id);
    if (target.type === "framework" || target.type === "frameworks")
      relationships = relatedRelationships("frameworks");
    if (target.type === "tower-capability")
      relationships = relatedRelationships("tower");
    relationships.forEach(function (relationship) {
      var otherId =
        relationship.from === (packageId || target.id)
          ? relationship.to
          : relationship.from;
      var other =
        DATA.nodes[otherId] ||
        packageById(otherId) ||
        (otherId === "frameworks"
          ? { title: "AI Frameworks & Runtimes" }
          : null);
      if (!other) return;
      var row = document.createElement("div");
      row.className = "arch-edge-row arch-row-" + relationship.status;
      var marker = document.createElement("span");
      marker.className = "arch-edge-dot arch-dot-" + relationship.status;
      marker.setAttribute("aria-hidden", "true");
      var text = document.createElement("div");
      var title = document.createElement("b");
      title.textContent =
        (relationship.from === (packageId || target.id) ? "→ " : "← ") +
        (other.title || other.name);
      var detail = document.createElement("span");
      detail.textContent =
        statusText(relationship.status) + " · " + relationship.label;
      text.appendChild(title);
      text.appendChild(detail);
      row.appendChild(marker);
      row.appendChild(text);
      list.appendChild(row);
    });
    if (target.type === "package") {
      var packData = packageById(target.id);
      if (packData.outputNote) {
        var p = document.createElement("p");
        p.className = "arch-panel-note";
        p.textContent = packData.outputNote;
        list.appendChild(p);
      }
    }
    if (target.type === "output") {
      var outputData = outputById(target.id);
      var ownerCard = packageById(outputData.owner);
      var p = document.createElement("p");
      p.className = "arch-panel-note";
      p.textContent =
        "Related package: " + ownerCard.title + " (" + ownerCard.version + ").";
      list.appendChild(p);
    }
  }

  function packageById(id) {
    return (
      DATA.packages.filter(function (item) {
        return item.id === id;
      })[0] || {
        id: id,
        title: DATA.nodes[id] ? DATA.nodes[id].title : id,
        version: DATA.nodes[id] ? DATA.nodes[id].version : "",
        package: DATA.nodes[id] ? DATA.nodes[id].package : "",
      }
    );
  }

  function outputById(id) {
    return DATA.outputs.filter(function (item) {
      return item.id === id;
    })[0];
  }

  function selectFromElement(element) {
    var type = element.dataset.selectType;
    var id = element.dataset.id;
    var target;
    if (type === "package")
      target = Object.assign({ type: type, id: id }, packageById(id));
    else if (type === "node")
      target = Object.assign(
        { type: type, id: id, kind: DATA.nodes[id].role },
        DATA.nodes[id],
      );
    else if (type === "capability")
      target = {
        type: type,
        id: element.dataset.package,
        packageId: element.dataset.package,
        index: Number(element.dataset.capability),
      };
    else if (type === "tower-capability")
      target = {
        type: type,
        id: "tower",
        index: Number(element.dataset.capability),
      };
    else if (type === "output")
      target = { type: type, id: id, owner: element.dataset.owner };
    else if (type === "frameworks") target = { type: type, id: "frameworks" };
    else if (type === "framework") {
      var index = Number(id.slice("framework-".length));
      target = {
        type: type,
        id: "frameworks",
        name: DATA.frameworks[index],
        description:
          DATA.frameworks[index] === "LangGraph"
            ? "LangGraph is listed in the architecture reference; the ecosystem guide documents LangGraph adapters for Agentic Chaos and Agentic Sidecar."
            : "Listed as an AI framework/runtime example in the original architecture reference. Local documentation does not establish a specific adapter for this framework.",
      };
    }
    if (target) select(target);
  }

  function traceSteps() {
    var pack = packageById(selectedPackage);
    var result = DATA.outputs.filter(function (output) {
      return output.owner === pack.id;
    })[0];
    var edgeForPackage = DATA.relationships.filter(function (relationship) {
      return relationship.from === "spec" && relationship.to === pack.id;
    })[0];
    if (!edgeForPackage)
      edgeForPackage = DATA.relationships.filter(function (relationship) {
        return (
          (relationship.from === "mcp" && relationship.to === pack.id) ||
          (relationship.to === "mcp" && relationship.from === pack.id)
        );
      })[0];
    return [
      {
        id: "users",
        edge: "users-tower",
        title: "USER",
        explanation:
          "A request begins with a developer, AI agent, or enterprise application.",
      },
      {
        id: "tower",
        edge: "tower-spec",
        title: "CONTROL TOWER",
        explanation:
          "The Control Tower operates fleet inventory, health, evidence posture, alerts, and incident views; sibling evidence is pushed in rather than remotely collected.",
      },
      {
        id: "spec",
        edge: edgeForPackage ? edgeForPackage.id : null,
        title: "AI OPERATIONS SPECIFICATION",
        explanation:
          "The shared draft model standardizes evidence and relationships. This connection is " +
          (edgeForPackage
            ? statusText(edgeForPackage.status).toLowerCase()
            : "architecture context") +
          ".",
      },
      {
        id: pack.id,
        edge: null,
        title: pack.title.toUpperCase(),
        explanation: pack.description,
      },
      {
        id: result.id,
        edge: "output-" + pack.id,
        title: "EXPORT / RESULT · " + result.label,
        explanation: result.detail,
      },
    ];
  }

  function clearTraceClasses() {
    if (!artwork) return;
    artwork
      .querySelectorAll(".arch-trace-active, .arch-trace-dim")
      .forEach(function (element) {
        element.classList.remove("arch-trace-active", "arch-trace-dim");
      });
    artwork.querySelectorAll(".arch-connection").forEach(function (element) {
      element.classList.remove("arch-active", "arch-dim");
    });
  }

  function applyTraceStep(step) {
    clearTraceClasses();
    artwork.querySelectorAll("[data-arch-node]").forEach(function (element) {
      var same = element.dataset.archNode === step.id;
      element.classList.toggle("arch-trace-active", same);
      element.classList.toggle("arch-trace-dim", !same);
    });
    artwork.querySelectorAll(".arch-package").forEach(function (element) {
      var same = element.dataset.packageCard === step.id;
      element.classList.toggle("arch-trace-active", same);
      element.classList.toggle(
        "arch-trace-dim",
        !same && step.id !== "exports",
      );
    });
    artwork.querySelectorAll(".arch-output").forEach(function (element) {
      var same = element.dataset.id === step.id;
      element.classList.toggle("arch-trace-active", same);
      element.classList.toggle(
        "arch-trace-dim",
        !same && step.id.indexOf("out-") === 0,
      );
    });
    artwork.querySelectorAll(".arch-connection").forEach(function (path) {
      var active = path.dataset.relationship === step.edge;
      path.classList.toggle("arch-active", active);
      path.classList.toggle("arch-dim", !active);
    });
    traceStatus.hidden = false;
    traceStatus.innerHTML =
      "<strong>STEP " +
      (traceIndex + 1) +
      " / " + traceSteps().length + " · " +
      escapeHtml(step.title) +
      "</strong><span>" +
      escapeHtml(step.explanation) +
      "</span>";
    renderDetails({
      type: step.id.indexOf("out-") === 0 ? "output" : "node",
      id: step.id,
      owner:
        step.id.indexOf("out-") === 0
          ? packageById(selectedPackage).id
          : undefined,
      description: step.explanation,
      name: step.title,
      role: "TRACE REQUEST",
    });
    document.getElementById("arch-pd-kind").textContent =
      "TRACE REQUEST · STEP " + (traceIndex + 1) + " / " + traceSteps().length;
  }

  function stopTrace(reset) {
    if (traceTimer) window.clearInterval(traceTimer);
    traceTimer = null;
    traceButton.setAttribute("aria-pressed", "false");
    traceButton.innerHTML = '<span aria-hidden="true">▶</span> Trace request';
    if (reset) {
      traceIndex = -1;
      clearTraceClasses();
      traceStatus.hidden = true;
    }
  }

  function startTrace() {
    stopTrace(true);
    var steps = traceSteps();
    traceButton.setAttribute("aria-pressed", "true");
    traceButton.innerHTML = '<span aria-hidden="true">■</span> Stop trace';
    traceIndex = 0;
    applyTraceStep(steps[traceIndex]);
    traceTimer = window.setInterval(function () {
      traceIndex += 1;
      if (traceIndex >= steps.length) {
        stopTrace(false);
        traceStatus.innerHTML =
          "<strong>TRACE COMPLETE</strong><span>The full architecture remains visible. Select another package or reset to explore a different route.</span>";
        return;
      }
      applyTraceStep(steps[traceIndex]);
    }, 1350);
  }

  mount.addEventListener("click", function (event) {
    var control = event.target.closest("[data-select-type]");
    if (control) {
      selectFromElement(control);
      return;
    }
    var packageCard = event.target.closest("[data-package-card]");
    if (packageCard)
      selectFromElement({
        dataset: { selectType: "package", id: packageCard.dataset.packageCard },
      });
  });

  mount.addEventListener("keydown", function (event) {
    var control = event.target.closest("[data-select-type]");
    if (control && (event.key === "Enter" || event.key === " ")) {
      event.preventDefault();
      selectFromElement(control);
      return;
    }
    if (
      ![
        "ArrowDown",
        "ArrowRight",
        "ArrowUp",
        "ArrowLeft",
        "Home",
        "End",
      ].includes(event.key)
    )
      return;
    var major = Array.prototype.slice.call(
      mount.querySelectorAll("[data-arch-node]"),
    );
    var focusedNode = event.target.closest("[data-arch-node]");
    var current = major.indexOf(focusedNode);
    if (current < 0) return;
    var next = current;
    if (event.key === "ArrowDown" || event.key === "ArrowRight")
      next = (current + 1) % major.length;
    else if (event.key === "ArrowUp" || event.key === "ArrowLeft")
      next = (current - 1 + major.length) % major.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = major.length - 1;
    event.preventDefault();
    major[next].focus();
  });

  document.getElementById("arch-reset").addEventListener("click", function () {
    stopTrace(true);
    artwork
      .querySelectorAll(".arch-selected, .arch-dim")
      .forEach(function (element) {
        element.classList.remove("arch-selected", "arch-dim");
      });
    artwork.querySelectorAll("[data-select-type]").forEach(function (element) {
      element.setAttribute("aria-pressed", "false");
    });
    artwork.querySelectorAll(".arch-connection").forEach(function (element) {
      element.classList.remove("arch-active", "arch-dim");
    });
    document.getElementById("arch-panel-empty").hidden = false;
    document.getElementById("arch-panel-detail").hidden = true;
  });

  traceButton.addEventListener("click", function () {
    if (traceTimer) stopTrace(true);
    else startTrace();
  });

  render();
  if ("ResizeObserver" in window) {
    new ResizeObserver(drawConnections).observe(mount);
  } else {
    window.addEventListener("resize", drawConnections);
  }
})();
