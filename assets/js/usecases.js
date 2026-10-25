/* Builds the Use cases dropdown from usecases-data.js: one item per demo (icon, name, summary),
   in the same layout as the Products and Docs menus. Edit the data file, not this one. */
(() => {
  const data = window.DAL_USECASES;
  if (!Array.isArray(data?.demos)) return;

  // same icons as the Products menu
  const ICONS = {
    'agenticlens': '<circle cx="11" cy="11" r="6"/><path d="m20 20-4.5-4.5"/><circle cx="11" cy="11" r="2"/>',
    'agentic-chaos': '<path d="M13 2 5 13h6l-1 9 8-11h-6l1-9z"/>',
    'agentic-sidecar': '<path d="M12 3 4 6v6c0 4.5 3.4 8 8 9 4.6-1 8-4.5 8-9V6l-8-3z"/><path d="m9 12 2 2 4-4"/>',
    'agentic-evals': '<path d="M4 19V9M10 19V5M16 19v-7M22 19H2"/>',
    'mcp': '<path d="M9 7V3M15 7V3M7 7h10v4a5 5 0 0 1-10 0V7zM12 16v5"/>',
    'control-tower': '<rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>'
  };
  const LABELS = {
    'mcp': 'MCP walkthrough', 'agentic-chaos': 'Replay & optimize', 'agentic-evals': 'Evaluation demo',
    'agenticlens': 'Tracing dashboard', 'agentic-sidecar': 'Sidecar simulation', 'control-tower': 'Control Tower'
  };
  const el = (tag, cls, text) => {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text) n.textContent = text;
    return n;
  };
  const arrow = () => { const i = el('i', '', '→'); i.setAttribute('aria-hidden', 'true'); return i; };

  // grid: [data-uc-list]
  const list = document.querySelector('[data-uc-list]');
  if (list) {
    list.replaceChildren(...data.demos.map((demo) => {
      const li = el('li');
      const a = el('a', 'mega-link');
      a.href = demo.href;
      const icon = el('span', 'mega-icon');
      icon.innerHTML = `<svg viewBox="0 0 24 24" aria-hidden="true">${ICONS[demo.id] || ''}</svg>`;
      const text = el('span', 'mega-text');
      const title = el('strong', '', `${LABELS[demo.id] || demo.title} `);
      title.append(arrow());
      const tool = (data.packages || []).find((p) => p.id === demo.id)?.name || '';
      text.append(title, el('small', '', tool ? `${tool} — ${demo.summary}` : demo.summary));
      a.append(icon, text);
      li.append(a);
      return li;
    }));
  }

  // optional chips: [data-uc-most-asked] (older markup)
  const chips = document.querySelector('[data-uc-most-asked]');
  if (chips) {
    chips.replaceChildren(...data.demos.map((demo) => {
      const a = el('a', '', `${LABELS[demo.id] || demo.title} `);
      a.href = demo.href;
      const s = el('span', '', '→'); s.setAttribute('aria-hidden', 'true'); a.append(s);
      return a;
    }));
  }
})();
