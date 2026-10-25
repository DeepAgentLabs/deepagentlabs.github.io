/* The dark Use cases card links only to the six real demos. */
(() => {
  const data = window.DAL_USECASES;
  const chips = document.querySelector('[data-uc-most-asked]');
  if (!chips || !Array.isArray(data?.demos)) return;
  const labels = ['MCP walkthrough', 'Replay & optimize', 'Evaluation demo', 'Tracing dashboard', 'Sidecar simulation', 'Control Tower'];
  const links = data.demos.map((demo, i) => {
    const link = document.createElement('a');
    link.href = demo.href;
    link.textContent = labels[i] + ' ';
    const arrow = document.createElement('span');
    arrow.textContent = '→';
    arrow.setAttribute('aria-hidden', 'true');
    link.append(arrow);
    return link;
  });
  chips.replaceChildren(...links);
})();
