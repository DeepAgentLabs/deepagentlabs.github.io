"""Regenerate static, progressively enhanced demos in sibling product checkouts.

Run from any directory. Shared assets are served by the organization website;
product pages retain a complete first frame when JavaScript is unavailable.
"""
import json
from html import escape
from html.parser import HTMLParser
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parents[1]
ROOT = REPO_ROOT.parent
ASSETS = 'https://deepagentlabs.github.io/assets'
# Every number is illustrative, never a benchmark or a live service measurement.
DEMOS = [
    dict(path='agenticlens/index.html', key='lens', title='Follow every agent, model, and tool call.',
         description='Watch a distributed trace unfold, from delegation to retrieval and generation, with token usage and latency for the same example run.',
         label='Distributed trace · support-agent', metrics=['Tokens consumed', 'Run latency', 'Completed spans'],
         names=['supervisor → research', 'research → search_docs', 'research → llm.generate', 'supervisor → respond'], waterfall=True,
         frames=[
             dict(metrics=['0', '0.12 s', '1 / 4'], rows=[['complete','120 ms','ok',0,8],['running','retrieving','warn',8,24],['queued','—','muted',32,0],['queued','—','muted',94,0]], event='trace: demo-7f2 · Parent span propagated to research agent; search_docs started.'),
             dict(metrics=['1,840', '1.41 s', '2 / 4'], rows=[['complete','120 ms','ok',0,8],['complete','380 ms','ok',8,24],['streaming','1,840 tokens','warn',32,50],['queued','—','muted',94,0]], event='search_docs returned 6 documents. llm.generate is streaming; input 1,600 + output 240 tokens.'),
             dict(metrics=['2,160', '1.88 s', '4 / 4'], rows=[['complete','120 ms','ok',0,8],['complete','380 ms','ok',8,24],['complete','1,280 ms','ok',32,62],['complete','100 ms','ok',94,6]], event='Trace complete · 1,600 input + 560 output tokens. Generation accounts for 68% of run latency.')]),
    dict(path='agentic-evals/docs/index.html', key='evals', title='See what passes. See what blocks a release.',
         description='An example evaluation suite scores answers, checks tool use, and applies a 95% minimum pass rate.',
         label='Evaluation suite · support_answers', metrics=['Cases passed', 'Pass rate', 'Release gate'],
         names=['refund-status · contains', 'order-lookup · tool recall', 'json-contract · valid JSON', 'escalation · latency'], frames=[
             dict(metrics=['1 / 4','25%','Pending'],rows=[['PASS','1.00','ok'],['running','—','warn'],['queued','—','muted'],['queued','—','muted']],event='refund-status passed contains check. Evaluating the remaining cases; gate waits for the complete suite.'),
             dict(metrics=['3 / 4','75%','Blocked'],rows=[['PASS','1.00','ok'],['PASS','1.00','ok'],['PASS','1.00','ok'],['FAIL','2.4s > 2.0s','bad']],event='Suite complete · 75% < required 95%. The latency failure blocks this example release.'),
             dict(metrics=['4 / 4','100%','Passed'],rows=[['PASS','1.00','ok'],['PASS','1.00','ok'],['PASS','1.00','ok'],['PASS','1.8s ≤ 2.0s','ok']],event='Separate example rerun after a latency fix · 100% ≥ 95%. Release gate passed.')]),
    dict(path='agentic-sidecar/website/index.html',key='sidecar',title='Inspect decisions before actions execute.',
         description='Follow a sample agent plan through policy, intent, and budget checks, including a blocked action and human escalation.',
         label='Decision supervision · support-agent',metrics=['Allowed','Blocked','Escalated'],
         names=['order_lookup', 'check_refund_policy', 'issue_refund', 'draft_response'],frames=[
             dict(metrics=['1','0','0'],rows=[['ALLOW','read scope','ok'],['pending','policy check','muted'],['pending','authority check','muted'],['pending','intent check','muted']],event='Order lookup allowed: read access is within the task’s permitted scope.'),
             dict(metrics=['2','0','1'],rows=[['ALLOW','read scope','ok'],['ALLOW','policy checked','ok'],['ESCALATE','approval needed','warn'],['pending','intent check','muted']],event='Order and policy checked. Refund escalated for human approval; it has not executed.'),
             dict(metrics=['3','0','1'],rows=[['ALLOW','read scope','ok'],['ALLOW','policy checked','ok'],['ESCALATE','awaiting human','warn'],['ALLOW','intent aligned','ok']],event='Safe response draft allowed. The refund remains pending human approval; no real action is performed.')]),
    dict(path='agentic-chaos/index.html',key='chaos',title='Watch an agent recover from a fault.',
         description='A simulated resilience experiment injects a tool timeout and shows retries, fallback, and recovery contract checks.',
         label='Resilience experiment · tool timeout',metrics=['Injected faults','Retry attempts','Contract checks'],
         names=['search_docs', 'retry · search_docs', 'fallback · cached_docs', 'recovery contract'],frames=[
             dict(metrics=['0','0','Pending'],rows=[['running','baseline','ok'],['standby','—','muted'],['standby','—','muted'],['pending','≤ 3 attempts','muted']],event='Baseline started. Example scope: search_docs only; other tools remain outside the experiment.'),
             dict(metrics=['1','1','Pending'],rows=[['TIMEOUT','fault injected','bad'],['TIMEOUT','attempt 2','warn'],['running','cached lookup','warn'],['pending','checking recovery','muted']],event='One injected timeout triggered a retry. The retry also timed out; the agent switches to cached documents.'),
             dict(metrics=['1','1','Passed'],rows=[['TIMEOUT','fault injected','bad'],['TIMEOUT','attempt 2','warn'],['recovered','cache returned','ok'],['PASS','bounded recovery','ok']],event='Recovery completed via fallback. The bounded-attempt contract passed: 3 total attempts, including fallback.')]),
    dict(path='mcp-server/index.html',key='mcp',title='Follow a tool request from client to result.',
         description='See an example MCP client discover tools, check server health, and request workflow analysis through the unified interface.',
         label='MCP tool activity · example client',metrics=['Requests completed','Tools called','Session'],
         names=['tools/list', 'core.health', 'lens.analyze_workflow', 'lens.report_summary'],frames=[
             dict(metrics=['1 / 4','0','Connected'],rows=[['complete','catalog received','ok'],['pending','—','muted'],['pending','—','muted'],['pending','—','muted']],event='Example client discovered the tool catalog. This browser demo does not connect to an MCP server.'),
             dict(metrics=['2 / 4','1','Connected'],rows=[['complete','catalog received','ok'],['complete','healthy','ok'],['running','sample workflow','warn'],['pending','—','muted']],event='core.health returned successfully. lens.analyze_workflow is processing the example workflow artifact.'),
             dict(metrics=['4 / 4','3','Connected'],rows=[['complete','catalog received','ok'],['complete','healthy','ok'],['complete','analysis ready','ok'],['complete','summary ready','ok']],event='Analysis and summary returned to the client. Tool results remain separate from server health.')]),
]


class HeroEnd(HTMLParser):
    def __init__(self, source):
        super().__init__()
        self.source = source
        self.depth = 0
        self.tag = None
        self.end = None

    def handle_starttag(self, tag, attrs):
        if self.tag is None and {'hero', 'pp-hero'}.intersection(dict(attrs).get('class', '').split()):
            self.tag = tag
            self.depth = 1
        elif tag == self.tag and self.end is None:
            self.depth += 1

    def handle_endtag(self, tag):
        if tag == self.tag and self.end is None:
            self.depth -= 1
            if self.depth == 0:
                line, column = self.getpos()
                self.end = sum(len(s) for s in self.source.splitlines(keepends=True)[:line - 1]) + column + len(tag) + 3


def render(demo):
    first = demo['frames'][0]
    metrics = ''.join(f'<div><strong data-sim-metric>{escape(value)}</strong><span>{escape(label)}</span></div>' for label, value in zip(demo['metrics'], first['metrics']))
    rows = ''
    for name, row in zip(demo['names'], first['rows']):
        bar = '<span class="dal-demo-waterfall" aria-hidden="true"><i></i></span>' if demo.get('waterfall') else ''
        rows += f'<li class="dal-demo-row" data-sim-row data-tone="{row[2]}" style="--span-start:{row[3] if len(row) > 3 else 0}%;--span-width:{row[4] if len(row) > 4 else 100}%"><span>{escape(name)}</span><span class="dal-demo-result" data-sim-result>{escape(row[0])}</span><span class="dal-demo-detail" data-sim-detail>{escape(row[1])}</span>{bar}</li>'
    frames = json.dumps(demo['frames']).replace('<', '\\u003c')
    return f'''<!-- product-simulation:start -->
    <section class="dal-demo-section" id="simulation" aria-labelledby="simulation-{demo['key']}">
      <div class="dal-demo-intro"><small>Interactive example</small><h2 id="simulation-{demo['key']}">{escape(demo['title'])}</h2><p>{escape(demo['description'])}</p></div>
      <div class="dal-demo" data-product-simulation="{demo['key']}">
        <div class="dal-demo-top"><span>{escape(demo['label'])}</span><span class="dal-demo-badge">Simulated</span></div>
        <div class="dal-demo-metrics">{metrics}</div>
        <ul class="dal-demo-rows">{rows}</ul>
        <div class="dal-demo-event"><small>RECENT ACTIVITY</small><p data-sim-event>{escape(first['event'])}</p></div>
        <div class="dal-demo-controls" data-sim-controls hidden><div><button type="button" data-sim-toggle aria-pressed="false">Play demo</button><button type="button" data-sim-next>Next step →</button></div><small>Step <span data-sim-step>1 / {len(demo['frames'])}</span></small></div>
        <p class="dal-demo-note">Example data, simulated in your browser. No live telemetry or real actions.</p>
        <script type="application/json" data-sim-frames>{frames}</script>
      </div>
    </section>
    <!-- product-simulation:end -->'''


def main():
    for demo in DEMOS:
        path = ROOT / demo['path']
        source = path.read_text()
        start_marker = '<!-- product-simulation:start -->'
        end_marker = '<!-- product-simulation:end -->'
        if start_marker in source:
            start = source.index(start_marker)
            end = source.index(end_marker) + len(end_marker)
            source = source[:start] + render(demo) + source[end:]
        else:
            parser = HeroEnd(source)
            parser.feed(source)
            if parser.end is None:
                raise ValueError(f'No hero found in {path}')
            source = source[:parser.end] + '\n\n    ' + render(demo) + source[parser.end:]
        css = f'<link rel="stylesheet" href="{ASSETS}/css/simulations.css">'
        js = f'<script src="{ASSETS}/js/simulations.js" defer></script>'
        if css not in source:
            source = source.replace('</head>', f'  {css}\n  {js}\n</head>')
        path.write_text(source)
        print(path.relative_to(ROOT))


if __name__ == '__main__':
    main()
