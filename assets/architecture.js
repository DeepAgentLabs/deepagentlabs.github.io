(function () {
  var svgEl = document.getElementById('arch-diagram');
  if (!svgEl) return;

  var NODES = {
    spec: { x: 420, y: 20, w: 360, h: 78, dark: true, kind: 'FOUNDATION',
      name: 'ai-operations-spec', version: 'v0.1.0 · spec draft v0.4',
      sub: 'shared contract',
      desc: 'A vendor-neutral schema for runs, steps, model and tool calls, and evaluations — the common vocabulary the rest of the ecosystem is built around. Core concepts through schemas (v0.1–v0.4) are drafted; a stable v1.0 is the next milestone.' },
    lens: { x: 40, y: 172, w: 250, h: 104, kind: 'OBSERVE',
      name: 'agenticlens', version: 'v0.5.0',
      sub: 'tracing · cost · evals',
      desc: 'Local-first observability for AI workflows: OTLP trace ingest, cost and latency tracking, and a built-in evaluation and release-gate engine. Runs without a hosted backend.' },
    chaos: { x: 330, y: 172, w: 250, h: 104, kind: 'STRESS',
      name: 'agentic-chaos', version: 'v0.4.0',
      sub: 'fault injection',
      desc: 'Injects timeouts, rate-limit storms, and corrupted outputs into LLM calls and agent workflows, then reports how the system responded. Works standalone, with an optional AgenticLens integration.' },
    evals: { x: 620, y: 172, w: 250, h: 104, kind: 'EVALUATE',
      name: 'agentic-evals', version: 'v0.5.0',
      sub: 'scoring · CI gate',
      desc: 'A framework-agnostic scoring engine for LLM and agent outputs — deterministic checks, LLM-as-judge rubrics, and a pass/fail release gate for CI. Published on PyPI and runs independently of the rest of the ecosystem.' },
    tower: { x: 910, y: 172, w: 250, h: 104, kind: 'IMPROVE',
      name: 'agenticops-control-tower', version: 'v0.0.1',
      sub: 'registry · console',
      desc: 'The fleet-wide registry and control plane for the ecosystem. Currently provides in-memory agent registration and capability discovery; persistence and a web console are on the roadmap.' },
    sidecar: { x: 185, y: 352, w: 250, h: 104, kind: 'GOVERN · cross-cutting',
      name: 'agentic-sidecar', version: 'v0.2.0',
      sub: 'decision supervision',
      desc: "Watches an agent's next action against its declared intent and can allow, warn, or block it in real time. Supports LangGraph today; integrations with AgenticLens and Agentic Chaos are planned." },
    mcp: { x: 620, y: 352, w: 390, h: 104, kind: 'EXPOSE · cross-cutting',
      name: 'mcp-server', version: 'v0.2.0',
      sub: '14 tools · one surface',
      desc: 'One MCP interface exposing AgenticLens, Agentic Chaos, Agentic Sidecar, and Spec validation as 14 callable tools for any MCP-compatible client. Sidecar and Chaos tool coverage continues to expand.' }
  };

  var EDGES = [
    { id: 'spec-lens', from: 'spec', to: 'lens', kind: 'warn', label: 'implements the draft contract' },
    { id: 'spec-chaos', from: 'spec', to: 'chaos', kind: 'warn', label: 'implements the draft contract' },
    { id: 'spec-evals', from: 'spec', to: 'evals', kind: 'warn', label: 'shares the same contract' },
    { id: 'spec-tower', from: 'spec', to: 'tower', kind: 'plan', label: 'contract adoption planned' },
    { id: 'spec-sidecar', from: 'spec', to: 'sidecar', kind: 'plan', label: 'intent schema planned' },
    { id: 'spec-mcp', from: 'spec', to: 'mcp', kind: 'warn', label: 'validates artifacts against the draft' },
    { id: 'chaos-lens', from: 'chaos', to: 'lens', kind: 'warn', label: 'fault events feed into workflow reports' },
    { id: 'mcp-lens', from: 'mcp', to: 'lens', kind: 'warn', label: 'exposes Lens analysis as tools' },
    { id: 'mcp-chaos', from: 'mcp', to: 'chaos', kind: 'warn', label: 'exposes fault injection as tools' },
    { id: 'mcp-sidecar', from: 'mcp', to: 'sidecar', kind: 'warn', label: 'exposes Sidecar status as tools' },
    { id: 'sidecar-lens', from: 'sidecar', to: 'lens', kind: 'plan', label: 'integration planned' },
    { id: 'sidecar-chaos', from: 'sidecar', to: 'chaos', kind: 'plan', label: 'integration planned' },
    { id: 'tower-mcp', from: 'tower', to: 'mcp', kind: 'plan', label: 'connector planned' },
    { id: 'tower-lens', from: 'tower', to: 'lens', kind: 'plan', label: 'connector planned' },
    { id: 'tower-chaos', from: 'tower', to: 'chaos', kind: 'plan', label: 'connector planned' },
    { id: 'tower-sidecar', from: 'tower', to: 'sidecar', kind: 'plan', label: 'connector planned' }
  ];

  var svgNS = 'http://www.w3.org/2000/svg';
  function el(tag, attrs) {
    var e = document.createElementNS(svgNS, tag);
    for (var k in attrs) e.setAttribute(k, attrs[k]);
    return e;
  }
  function cx(n) { return n.x + n.w / 2; }
  function top(n) { return { x: cx(n), y: n.y }; }
  function bottom(n) { return { x: cx(n), y: n.y + n.h }; }
  function side(n, other) {
    var fromCenter = cx(n) < cx(other) ? n.x + n.w : n.x;
    return { x: fromCenter, y: n.y + n.h / 2 };
  }

  var nodesG = document.getElementById('arch-nodes');
  var edgesG = document.getElementById('arch-edges');
  var nodeEls = {};
  var edgeEls = {};

  Object.keys(NODES).forEach(function (key) {
    var n = NODES[key];
    var g = el('g', { class: 'arch-node-g', 'data-node': key, tabindex: '0', role: 'button', 'aria-label': n.name + ', ' + n.version });
    var box = el('rect', { x: n.x, y: n.y, width: n.w, height: n.h, class: 'arch-node-box' + (n.dark ? ' arch-spec' : '') });
    g.appendChild(box);
    var tagCls = 'arch-node-tag' + (n.dark ? ' arch-on-dark' : '');
    var titleCls = 'arch-node-title' + (n.dark ? ' arch-on-dark' : '');
    var subCls = 'arch-node-sub' + (n.dark ? ' arch-on-dark' : '');

    var tagText = el('text', { x: n.x + 16, y: n.y + 22, class: tagCls });
    tagText.textContent = n.kind;
    g.appendChild(tagText);

    var nameText = el('text', { x: n.x + 16, y: n.y + 44, class: titleCls, 'font-size': n.dark ? '18' : '16' });
    nameText.textContent = n.name;
    g.appendChild(nameText);

    var subText = el('text', { x: n.x + 16, y: n.y + (n.dark ? 64 : 66), class: subCls });
    subText.textContent = n.sub;
    g.appendChild(subText);

    var verText = el('text', { x: n.x + 16, y: n.y + n.h - 14, class: tagCls, fill: n.dark ? '#c7d0ca' : '#5f6863' });
    verText.textContent = n.version;
    g.appendChild(verText);

    nodesG.appendChild(g);
    nodeEls[key] = { g: g, box: box };
  });

  EDGES.forEach(function (e) {
    var a = NODES[e.from], b = NODES[e.to];
    var p1, p2;
    if (a.y === b.y) { p1 = side(a, b); p2 = side(b, a); }
    else if (bottom(a).y <= b.y) { p1 = bottom(a); p2 = top(b); }
    else { p1 = top(a); p2 = bottom(b); }
    var midY = (p1.y + p2.y) / 2;
    var d = 'M' + p1.x + ',' + p1.y + ' C ' + p1.x + ',' + midY + ' ' + p2.x + ',' + midY + ' ' + p2.x + ',' + p2.y;
    var cls = 'arch-edge ' + (e.kind === 'plan' ? 'arch-planned' : '');
    var path = el('path', { d: d, class: cls, 'marker-end': 'url(#' + (e.kind === 'plan' ? 'arch-arrow-plan' : 'arch-arrow') + ')' });
    edgesG.appendChild(path);

    var lx = (p1.x + p2.x) / 2, ly = midY - 6;
    var label = el('text', { x: lx, y: ly, 'text-anchor': 'middle', class: 'arch-edge-label' });
    label.textContent = e.label;
    edgesG.appendChild(label);

    edgeEls[e.id] = { path: path, label: label, from: e.from, to: e.to };
  });

  var panelEmpty = document.getElementById('arch-panel-empty');
  var panelDetail = document.getElementById('arch-panel-detail');
  var active = null;

  function relatedEdges(key) {
    return Object.keys(edgeEls).filter(function (id) {
      var e = edgeEls[id];
      return e.from === key || e.to === key;
    });
  }

  function select(key) {
    if (active === key) { clearSelection(); return; }
    active = key;
    var related = relatedEdges(key);
    Object.keys(nodeEls).forEach(function (k) {
      nodeEls[k].box.classList.toggle('arch-active', k === key);
      var touches = related.some(function (id) { return edgeEls[id].from === k || edgeEls[id].to === k; });
      nodeEls[k].g.classList.toggle('arch-dim', k !== key && !touches);
    });
    Object.keys(edgeEls).forEach(function (id) {
      var isRel = related.indexOf(id) !== -1;
      edgeEls[id].path.classList.toggle('arch-active', isRel);
      edgeEls[id].path.classList.toggle('arch-dim', !isRel);
      edgeEls[id].label.classList.toggle('arch-show', isRel);
    });
    renderPanel(key, related);
  }

  function clearSelection() {
    active = null;
    Object.keys(nodeEls).forEach(function (k) {
      nodeEls[k].box.classList.remove('arch-active');
      nodeEls[k].g.classList.remove('arch-dim');
    });
    Object.keys(edgeEls).forEach(function (id) {
      edgeEls[id].path.classList.remove('arch-active', 'arch-dim');
      edgeEls[id].label.classList.remove('arch-show');
    });
    panelEmpty.style.display = '';
    panelDetail.style.display = 'none';
  }

  function renderPanel(key, relatedIds) {
    var n = NODES[key];
    panelEmpty.style.display = 'none';
    panelDetail.style.display = '';
    document.getElementById('arch-pd-kind').textContent = n.kind;
    document.getElementById('arch-pd-name').textContent = n.name;
    document.getElementById('arch-pd-version').textContent = n.version;
    document.getElementById('arch-pd-desc').textContent = n.desc;
    var box = document.getElementById('arch-pd-edges');
    box.innerHTML = '';
    if (!relatedIds.length) {
      var p = document.createElement('p');
      p.className = 'arch-panel-empty';
      p.textContent = 'Runs independently today — no integrations with other packages yet.';
      box.appendChild(p);
      return;
    }
    relatedIds.forEach(function (id) {
      var e = edgeEls[id];
      var edata = EDGES.filter(function (x) { return x.id === id; })[0];
      var other = e.from === key ? e.to : e.from;
      var dir = e.from === key ? '→ ' : '← ';
      var row = document.createElement('div');
      row.className = 'arch-edge-row';
      var dot = document.createElement('span');
      dot.className = 'arch-edge-dot ' + (edata.kind === 'plan' ? 'arch-plan' : 'arch-warn');
      row.appendChild(dot);
      var text = document.createElement('div');
      var b = document.createElement('b');
      b.textContent = dir + NODES[other].name;
      var span = document.createElement('span');
      span.textContent = edata.label;
      text.appendChild(b);
      text.appendChild(span);
      row.appendChild(text);
      box.appendChild(row);
    });
  }

  Object.keys(nodeEls).forEach(function (key) {
    var g = nodeEls[key].g;
    g.addEventListener('click', function () { select(key); });
    g.addEventListener('keydown', function (ev) {
      if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); select(key); }
    });
  });

  var resetBtn = document.getElementById('arch-reset');
  if (resetBtn) resetBtn.addEventListener('click', clearSelection);
})();
