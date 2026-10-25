/* The ecosystem demos, shared by product-page links. */
(() => {
  const demos = [
    { id: 'mcp', number: '01', title: 'Operate your agents through MCP', summary: 'Explore the ecosystem through a simulated AI conversation.', href: '/usecases/1/' },
    { id: 'agentic-chaos', number: '02', title: 'Replay, stress-test, optimize', summary: 'Replay a captured run, inject faults and validate improvements.', href: '/usecases/2/' },
    { id: 'agentic-evals', number: '03', title: 'Evaluate and compare releases', summary: 'Score recorded behavior and compare a candidate execution.', href: '/usecases/3/' },
    { id: 'agenticlens', number: '04', title: 'See inside every agent run', summary: 'Follow distributed calls, tokens, costs and trace evidence.', href: '/usecases/4/' },
    { id: 'agentic-sidecar', number: '05', title: 'A checkpoint before every call', summary: 'Watch guardrails, context, critique and critical-action approval.', href: '/usecases/5/' },
    { id: 'control-tower', number: '06', title: 'An AI-native operations command center', summary: 'Diagnose failures, approve runbooks and control the fleet.', href: '/usecases/6/' }
  ];
  const names = { mcp: 'MCP Server', 'agentic-chaos': 'Agentic Chaos', 'agentic-evals': 'Agentic Evals', agenticlens: 'AgenticLens', 'agentic-sidecar': 'Agentic Sidecar', 'control-tower': 'Control Tower' };
  window.DAL_USECASES = {
    demos,
    // Product pages consume these links; no placeholder use cases remain.
    packages: demos.map(demo => ({ id: demo.id, name: names[demo.id], summary: demo.summary, href: demo.href, useCases: [{ title: demo.title, slug: demo.id, href: demo.href }] }))
  };
})();
