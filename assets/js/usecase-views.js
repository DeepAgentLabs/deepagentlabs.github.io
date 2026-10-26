/* Public page-load counters; previews never increment production totals. */
(() => {
  const paths = ["/usecases/1/", "/usecases/2/", "/usecases/3/", "/usecases/4/", "/usecases/5/", "/usecases/6/", "/agentic-sidecar/usecases/prevent-unauthorized-refunds/", "/agentic-sidecar/usecases/governed-customer-support-agent/", "/agentic-sidecar/usecases/govern-langgraph-agent-workflows/", "/control-tower/usecases/fleet-health-snapshot/", "/control-tower/usecases/lens-failure-to-incident/", "/control-tower/usecases/ecosystem-evidence-posture/", "/control-tower/usecases/fleet-change-with-approval/", "/agentic-evals/usecases/block-an-unsafe-release/", "/agentic-evals/usecases/right-reply-wrong-trajectory/", "/agentic-evals/usecases/gate-on-judge-reliability/"];
  const normalize = path => path.replace(/index\.html$/, '').replace(/\/?$/, '/');
  const path = normalize(location.pathname);
  if (['deepagentlabs.io', 'www.deepagentlabs.io'].includes(location.hostname) && paths.includes(path)) {
    const pixel = new Image();
    pixel.referrerPolicy = 'no-referrer';
    pixel.src = 'https://hits.sh/deepagentlabs.io' + path.slice(0, -1) + '.svg';
  }
  const badges = document.querySelectorAll('[data-usecase-views]');
  if (!badges.length) return;
  // Shields reads the public statistics server-side and permits browser CORS.
  // This endpoint never requests a Hits badge, so index impressions cannot add views.
  async function refresh(badge) {
    const path = badge.dataset.usecaseViews;
    if (!paths.includes(path)) return;
    const url = new URL('https://img.shields.io/badge/dynamic/json');
    url.search = new URLSearchParams({
      url: 'https://hits.sh/api/urns/deepagentlabs.io' + path.slice(0, -1),
      query: '$.total', label: 'views', cacheSeconds: '300'
    });
    try {
      const response = await fetch(url, { credentials: 'omit', referrerPolicy: 'no-referrer', signal: AbortSignal.timeout(8000) });
      if (!response.ok) return;
      const svg = new DOMParser().parseFromString(await response.text(), 'image/svg+xml');
      const match = svg.documentElement.getAttribute('aria-label')?.match(/^views: (\d+)$/);
      if (!match) return;
      const count = Number(match[1]);
      if (!Number.isSafeInteger(count)) return;
      badge.textContent = new Intl.NumberFormat('en').format(count) + (count === 1 ? ' view' : ' views');
      badge.title = 'Production page loads. Counts may take about five minutes to update. Local previews are excluded.';
    } catch (_) { /* Keep the last available snapshot. */ }
  }
  fetch('/assets/data/usecase-views.json', { cache: 'no-cache', signal: AbortSignal.timeout(3000) })
    .then(response => { if (!response.ok) throw new Error('Unavailable'); return response.json(); })
    .then(data => badges.forEach(badge => {
      const count = data.views[badge.dataset.usecaseViews];
      if (!Number.isSafeInteger(count) || count < 0) return;
      badge.textContent = new Intl.NumberFormat('en').format(count) + (count === 1 ? ' view' : ' views');
      badge.title = 'Page loads since counters were added. Updated ' + new Date(data.updatedAt).toLocaleString() + '. Totals refresh hourly.';
    }))
    .catch(() => {})
    .finally(() => badges.forEach(refresh));
})();
