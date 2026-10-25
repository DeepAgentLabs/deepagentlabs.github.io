"""Apply the Control Tower website shell to sibling product landing pages.

Retains each product's existing content sections, code examples and local scripts.
Shared assets and shell come from the organization website; no product build changes.
"""
import re
from html import escape
from html.parser import HTMLParser
from pathlib import Path

from sync_product_simulations import ASSETS, DEMOS, ROOT, render

PRODUCTS = {
    'lens': dict(name='AgenticLens', role='Observe', headline='Every step,<br><span class="hl">in focus.</span>',
                 lede='Trace multi-agent execution, understand token and cost usage, evaluate behavior, and turn operational evidence into better decisions. Run locally, with no mandatory hosted backend.',
                 package='agenticlens', repo='agenticlens', facts=['Open source', 'Local-first evidence', 'OpenTelemetry-native'],
                 preview='WORKFLOW TRACE · EXAMPLE', title='One run. Every handoff.',
                 stats=[('4','spans'),('2,160','tokens'),('1.88 s','latency')],
                 lines=[('plan → research','120 ms'),('retrieve → search_docs','380 ms'),('generate → model call','1,280 ms'),('respond → complete','100 ms')],
                 caption='Inspect steps, token usage and advisory findings in the simulation.'),
    'evals': dict(name='Agentic Evals', role='Evaluate',headline='Test your agent.<br><span class="hl">Trust the release.</span>',
                  lede='Score agent outputs and execution paths with deterministic checks, provider-neutral judges, and trace-aware scorers. Turn the results into a clear release gate for CI.',
                  package='agentic-evals',repo='agentic-evals',facts=['Open source','Provider-neutral judges','CI release gates'],
                  preview='EVALUATION SUITE · EXAMPLE',title='Evidence before release.',stats=[('4','cases'),('75%','pass rate'),('Blocked','gate')],
                  lines=[('refund-status','PASS'),('order-lookup','PASS'),('json-contract','PASS'),('escalation · latency','FAIL')],
                  caption='Run a sample suite, inspect a failure, and adjust the gate threshold.'),
    'sidecar': dict(name='Agentic Sidecar',role='Supervise',headline='Before the action,<br><span class="hl">check the intent.</span>',
                    lede='Evaluate proposed agent actions against policy, risk, intent, and budget before they execute. Observe decisions or govern them with explicit intervention and approval boundaries.',
                    package='agentic-sidecar',repo='agentic-sidecar',facts=['Open source','Observe and Govern modes','Explicit approval boundaries'],
                    preview='DECISION SUPERVISION · EXAMPLE',title='Keep the user in control.',stats=[('2','allowed'),('1','approval needed'),('0','real actions')],
                    lines=[('order_lookup','ALLOW'),('check_refund_policy','ALLOW'),('issue_refund · $120','PAUSE'),('draft_response','PENDING')],
                    caption='Review original intent, switch modes, and approve or reject a sample action.'),
    'chaos': dict(name='Agentic Chaos',role='Stress-test',headline='Find the failure.<br><span class="hl">Prove the recovery.</span>',
                  lede='Inject controlled faults into LLM and agent workflows. Test timeouts, rate limits, corrupted output, and recovery behavior before those failures reach your users.',
                  package='agentic-chaos',repo='agentic-chaos',facts=['Open source','Controlled fault injection','Reproducible experiments'],
                  preview='RESILIENCE EXPERIMENT · EXAMPLE',title='A fault is only the start.',stats=[('1','injected fault'),('1','retry'),('Passed','recovery')],
                  lines=[('search_docs','TIMEOUT'),('retry · search_docs','TIMEOUT'),('fallback · cached_docs','RECOVERED'),('bounded recovery','PASS')],
                  caption='Choose a fault and follow the retry, fallback, or safe failure.'),
    'mcp': dict(name='MCP Server',role='Connect',headline='One interface.<br><span class="hl">Your agent toolkit.</span>',
                lede='Bring DeepAgentLabs workflow analysis, diagnostics, and resilience capabilities into your MCP client. Use local stdio or authenticated hosted HTTP, with explicit tool availability for each transport.',
                package='deep-agentic-core-mcp',repo='mcp-server',facts=['Open source','Local stdio + hosted HTTP','Structured tool results'],
                preview='MCP TOOL ACTIVITY · EXAMPLE',title='From request to evidence.',stats=[('2','demo tools'),('JSON','results'),('0','live calls')],
                lines=[('tools/list','DISCOVER'),('core.health','AVAILABLE'),('lens.analyze_workflow','AVAILABLE'),('chaos.run_experiment','LOCAL ONLY')],
                caption='Run illustrative calls and inspect structured results in the browser.'),
}


class Sections(HTMLParser):
    """Capture outer sections with exact original markup, including code samples."""
    def __init__(self, source):
        super().__init__()
        self.source = source
        self.lines = source.splitlines(keepends=True)
        self.depth = 0
        self.items = []

    def current_offset(self):
        line, col = self.getpos()
        return sum(map(len, self.lines[:line - 1])) + col

    def handle_starttag(self, tag, attrs):
        if tag != 'section':
            return
        if self.depth == 0:
            self.start = self.current_offset()
            self.attrs = dict(attrs)
        self.depth += 1

    def handle_endtag(self, tag):
        if tag == 'section':
            self.depth -= 1
            if self.depth == 0:
                self.items.append((self.attrs, self.source[self.start:self.current_offset()+len('</section>')]))


def shell():
    source = (ROOT / 'deepagentlabs.github.io/control-tower/index.html').read_text()
    header = re.search(r'<header class="site-header">.*?</header>', source, re.S).group()
    footer = re.search(r'<footer class="site-footer">.*?</footer>', source, re.S).group()
    # Shell links must work from project Pages sites as well as the custom domain.
    header = header.replace(' aria-current="page"', '')
    return tuple(re.sub(r'(href|src)="/(?!/)', r'\1="https://deepagentlabs.io/', value) for value in (header, footer))


def hero(product):
    p = product
    stats = ''.join(f'<div><strong>{escape(value)}</strong><span>{escape(label)}</span></div>' for value, label in p['stats'])
    lines = ''.join(f'<li><span>{escape(name)}</span><b class="{"is-alert" if status in ("FAIL", "TIMEOUT", "PAUSE") else ""}">{escape(status)}</b></li>' for name, status in p['lines'])
    facts = ''.join(f'<li>{escape(fact)}</li>' for fact in p['facts'])
    return f'''<section class="pp-hero pp-enter" id="top">
      <div class="pp-hero-copy">
        <p class="pp-crumbs"><a href="https://deepagentlabs.io/">Home</a><span aria-hidden="true">/</span><span>Products</span><span aria-hidden="true">/</span><b>{p['name']}</b></p>
        <p class="section-label">{p['name']} · {p['role']}</p>
        <h1>{p['headline']}</h1>
        <p class="pp-lede">{p['lede']}</p>
        <div class="hero-actions"><a class="button button-primary" href="#simulation">Try the simulation <span aria-hidden="true">↘</span></a><a class="button button-secondary" href="docs/">Read the docs <span aria-hidden="true">→</span></a></div>
        <code class="tl-pip pp-pip">pip install {p['package']}</code>
        <ul class="pp-facts" aria-label="Key facts">{facts}</ul>
      </div>
      <aside class="product-preview" aria-label="{p['name']} example preview">
        <p class="product-preview-label">{p['preview']} <span>● Simulated</span></p>
        <h2>{p['title']}</h2>
        <div class="product-preview-stats">{stats}</div>
        <ul class="product-preview-rows">{lines}</ul>
        <p class="product-preview-caption">{p['caption']}</p>
        <a href="#simulation">Explore this example <span aria-hidden="true">→</span></a>
      </aside>
    </section>'''


def main():
    header, footer = shell()
    for demo in DEMOS:
        path = ROOT / demo['path']
        source = path.read_text()
        p = PRODUCTS[demo['key']]
        legacy_ecosystem = re.search(r'<footer id="ecosystem">\s*<div class="shell">(.*?)<div class="footer-grid">', source, re.S)
        if legacy_ecosystem:
            source += '<section id="ecosystem">' + legacy_ecosystem[1] + '</section>'
        parser = Sections(source)
        parser.feed(source)
        sections = []
        for attrs, content in parser.items:
            classes = attrs.get('class', '').split()
            if 'hero' in classes or 'pp-hero' in classes or 'dal-demo-section' in classes or 'product-end' in classes:
                continue
            # Retain content and functional inline properties, while removing old color palettes.
            content = re.sub(r'\sstyle="([^"]*)"', lambda m: ' style="' + ';'.join(rule for rule in m[1].split(';') if not re.match(r'\s*(?:background(?:-\w+)?|color|border(?:-\w+)?(?:-color)?|box-shadow|font-family)\s*:',rule)) + '"',content)
            sections.append(content)
        title = f'{p["name"]} — DeepAgentLabs'
        description = escape(p['lede'], quote=True)
        css = ['styles','enhance','nav','theme','background','copy','polish','product','footer','beam','product-uniform','simulations']
        js = ['site','usecases-data','usecases','nav','background','copy','product','beam','simulations']
        assets = '\n'.join(f'  <link rel="stylesheet" href="{ASSETS}/css/{name}.css">' for name in css)
        assets += '\n' + '\n'.join(f'  <script src="{ASSETS}/js/{name}.js" defer></script>' for name in js)
        scripts = []
        for script in re.findall(r'<script\b[^>]*>.*?</script>', source, re.S):
            if 'application/json' in script or 'deepagentlabs.github.io' in script or 'document.documentElement' in script:
                continue
            if 'src=' in script and not re.search(r'src="site.js"',script):
                continue
            scripts.append(script)
        if demo['key']=='mcp' and not scripts:
            scripts=['<script src="site.js"></script>']
        # The retained lower sections keep their original anchors and scripts.
        body = '\n'.join(sections)
        legacy = '\n'.join(scripts)
        path.write_text(f'''<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="description" content="{description}">
  <meta name="theme-color" content="#07110e">
  <meta property="og:title" content="{title}">
  <meta property="og:description" content="{description}">
  <meta property="og:type" content="website">
  <link rel="canonical" href="https://deepagentlabs.io/{'mcp' if demo['key'] == 'mcp' else p['package']}/">
  <meta property="og:image" content="https://deepagentlabs.io/assets/img/ecosystem.png">
  <meta name="twitter:card" content="summary_large_image">
  <title>{title}</title>
  <link rel="icon" href="https://deepagentlabs.io/assets/img/dal-logo.png">
{assets}
</head>
<body class="product-page uniform-product" data-product="{demo['key']}">
  <a class="skip-link" href="#main">Skip to content</a>
  {header}
  <main id="main">
    {hero(p)}
    {render(demo)}
    <div class="product-content">
{body}
    </div>
    <section class="cta section-shell pp-cta product-end">
      <div><p class="section-label">Start building</p><h2>Put {p['name']} to work.</h2><p>Start with the documentation, explore the examples, or contribute on GitHub.</p></div>
      <div class="hero-actions"><a class="button button-primary" href="docs/">Read the docs →</a><a class="button button-secondary" href="https://github.com/DeepAgentLabs/{p['repo']}">View on GitHub ↗</a></div>
    </section>
  </main>
  {footer}
  {legacy}
</body>
</html>
''')
        print(f'{demo["path"]}: retained {len(sections)} content sections')


if __name__ == '__main__':
    main()
