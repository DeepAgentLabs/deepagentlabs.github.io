# Website Changes and Features

This document explains the additions and updates made to the DeepAgentLabs static website. The site remains plain HTML, CSS, and vanilla JavaScript; there is no build step or new library dependency.

## What Visitors See

### First-visit agent boot screen

A full-screen Agent Boot Sequence introduces the site on a visitor's first page load in a browser tab session. It uses the existing DeepAgentLabs logo and brand colors, an SVG agent network, component status indicators, a progress line, and a six-stage sequence:

1. Initializing Agent Runtime
2. Establishing Observability
3. Loading Evaluation Layer
4. Initializing Governance
5. Connecting Ecosystem
6. Agent Online

The boot sequence progresses to 100%, briefly displays the online state, then fades into the existing homepage. The overlay is gated with `sessionStorage`: section navigation, browser back, and reloads in the same tab session skip the boot screen. A new tab has a separate session. A six-second failsafe removes the overlay if its normal initialization script does not run.

### Homepage animation layer

A new enhancement layer adds a fixed scroll progress line, a word-by-word hero headline reveal, and a low-contrast hero network canvas. The hero reveal waits until the boot overlay is removed, or starts immediately when there is no overlay.

A package ticker follows the hero and lists the seven project/package names in a continuous band. It pauses on hover. Headings, cards, roadmap phases, FAQ rows, and other selected content reveal as they enter the viewport. The five operating-loop steps take turns highlighting while the loop is on screen.

The page also has a subtle technical grid and a fixed, gently shifting network behind the content. The hero network and the pagewide network avoid competing: the pagewide layer fades while the hero is visible, and returns as visitors scroll down. The pagewide canvas is limited to a modest number of nodes, caps its pixel ratio at 2, redraws at a limited rate, pauses when the browser tab is hidden, and is hidden when reduced motion is preferred.

### Page copy and navigation

Three previously empty section headings now introduce the operating loop, the DeepAgentLabs differentiators, and the specification roadmap. The Specification navigation link points to the AI Operations Specification GitHub repository. The malformed CTA repository URL was corrected.

The FAQ navigation item and FAQ section provide six expandable questions about production agents, observation, evaluation, governance, pre-production testing, and how the ecosystem fits together.

## Roadmap Update

### Homepage roadmap cards

The Roadmap section shows all eight milestones (v0.1 – v1.0) as clickable cards with a version, a status and one short line. A thin progress bar above the cards fills to the current phase when it scrolls into view, and its end marker pulses. Cards lift on hover and show an arrow. Each card opens its phase on `roadmap.html`; the Roadmap nav item and "See the full roadmap" link open the page too.

### New page: `roadmap.html`

A product-style page modelled on large platform sites. It has:

- A hero with a highlighted headline, buttons and a "Step 1 of 8" progress bar.
- A scrolling ticker of all eight milestones.
- A grid of four promises: shared vocabulary, graph-native, verifiable and vendor-neutral.
- A dark milestones section. Each phase gets its own two-column block with a status pill, a lime headline, bullets, a "Done when" line, and a small animated visual: a concept chip grid, a run graph that draws itself, an event stream, a JSON artifact with validation checks, a compatibility table, extension namespaces, a lineage chain and a v1.0 seal. Visuals marked "illustrative" are examples, not normative spec content.
- "What unlocks the next step" cards and a call to review the spec.

Content is based on `ai-operations-spec/ROADMAP.md` as of October 2026; update both pages when phase statuses change.

Files: `index.html`, `roadmap.html` (new), `assets/roadmap.css` (new), `assets/roadmap.js` (new).

## Navigation Mega-Menus

The header now has three dropdown menus, modelled on large product-site navigation:

- **Products**: links to `/agenticlens`, `/agentic-chaos`, `/agentic-sidecar`, `/agentic-evals`, `/mcp` and `/control-tower`, each with an icon and a one-line description, plus a featured card for the AI Operations Specification.
- **Docs**: links to each product's `/docs` page with its `pip install` command, plus a "Start here" quickstart card.
- **Platform**: the homepage's Loop, Dashboards and Why us sections, plus a Roadmap card.

Architecture, FAQ, Specification, Roadmap and GitHub stay as top-level links. Instead of dropdown arrows, a lime pill slides with a spring motion behind whichever top-level item is hovered. A small dot under the pill marks the open menu. On desktop, menus open on hover with a short delay and a staggered entrance, and close when the pointer leaves, on Esc or on an outside click. They also open by click or keyboard. On screens of 820px and below, they become accordions inside the mobile menu.

Files: `assets/nav.css` (new), `assets/nav.js` (new); header markup updated in `index.html` and `roadmap.html`.

Note: the product and docs pages (`/agenticlens`, `/agenticlens/docs`, …) don't exist in this repo yet; those links will 404 until they are added.

## Site-wide Theme

`assets/theme.css` (new, loaded on both pages) brings the roadmap page's look to the whole site:

- Key phrases in every section headline, and "shared language" in the hero, get a lime marker highlight that sweeps in when the heading scrolls into view.
- Section labels have wider letter spacing and a lime underline bar that grows in.
- The operating loop is now a full-width dark band with a lime headline. The lit step stays lime.
- "Why us" is three contrasting tiles: white and mint "Them" cards and a dark "Us" card with a lime title. Each lifts on hover with a hard shadow.
- Typography: headlines use Bricolage Grotesque (heavy weight with tight tracking), body text uses Inter, and highlighted key words use Instrument Serif italic inside the lime marker. DM Mono is still used for labels. All fonts load from Google Fonts in `theme.css`.
- The empty Architecture label now reads "Architecture", and "The Ecosystem Is Moving." is now sentence case.

## Compact Tool Showcase

"What each tool actually does" used to be seven tall cards. It's now one tabbed panel, about 880px tall on desktop:

- On the left is a list of the seven tools (Define → Connect). The selected tab turns dark with a lime edge.
- On the right is one dark panel with the full original card for that tool: description, complete capabilities list, sample-output visual, caption, `pip install` command and GitHub link.
- Hovering a tool on desktop switches the panel straight away; clicking or tapping and the arrow keys also work. Until the visitor interacts, it auto-advances every 6 seconds while on screen, with a lime progress line under the active tab. Bars replay their grow animation on each switch.
- Under 900px the tabs become a horizontal scrolling strip above the panel.

Files: `assets/tools.css` (new), `assets/tools.js` (new), `index.html`.

## Ticker and Capability Map Theme

- **Package ticker**: it's now a lime strip with ink text, ink borders and diamond separators, so it no longer blends into the dark operating-loop band below it.
- **Capability map** (`assets/arch-theme.css`, `assets/arch-compact.js`):
  - Restyled as one dark "console" panel to match the tool showcase and the roadmap milestones. Every box is a dark card with thin borders and lime icons, the AI Operations Specification is the only solid lime block (it's the shared contract), current-integration lines are lime, and the background has a faint dot grid. Hovering or selecting a card gives it a lime outline.
  - It's shorter by default, about 1,215px instead of 1,700px on desktop: each package shows its first four capabilities with a "+N more · select to see all" hint, and the outputs/exports row and the principles row are hidden.
  - Selecting a package shows all its capabilities. A new "Full detail" button in the toolbar expands the whole map.
  - `assets/architecture.js` has two small changes: it skips connection lines whose ends are hidden, and the legend note now says "Solid green".

## Homepage Roadmap Placement and Cards

The Roadmap section now sits just above the FAQ (after Ecosystem adoption). It sits on the normal page background (with the animated grid and network) and uses separate white cards spaced 14px apart, each with an ink border and a boxed version tag. The current phase card is lime and the v1.0 card is dark. Cards lift on hover and drop a hard shadow (lime under the dark card).

## Roadmap Page Ticker

The milestone ticker on `roadmap.html` now matches the homepage package ticker: a lime strip with ink borders, dark version chips and diamond separators.

## Clickable Map Hints and Map Colour

The site stays light, and the capability map is light too. `assets/dark.css` is no longer linked from either page and can be deleted.

The map uses only white, green and black:

- It's a white panel with ink borders, a lime offset shadow and a faint dot grid.
- Users, Console and AI Frameworks are white cards. Framework chips are mint.
- The Control Tower is the one black block, with a lime top edge and lime icons. The Specification is solid lime.
- Packages have white bodies with a mint header and a lime top bar. A selected package's header turns lime.
- Lines are dark green (current), grey dotted (planned) and ink (context). The hint bar is mint. The details panel stays black for contrast.

The capability map now makes it clearer that you can click things (`arch-compact.js`, `arch-theme.css`):

- An "Interactive map" bar above the map with a pulsing lime dot.
- A lime "Details ↓" tag appears on any card you hover.
- The Control Tower pulses gently a few times until the first click.
- The empty details panel says "↑ Click any card in the map above…" with a bobbing arrow.
- Clicking a card flashes the details panel and scrolls it into view if it's below the screen.
- Current-integration dots in the panel are lime.

## Background Animation

`assets/bg-flow.js` and `assets/bg-flow.css` (new, on both pages) add a quiet moving background: 5–10 faint dark-green signals that drift slowly (about 15–25px per second) along the background grid like signals on a circuit board. They turn at random junctions and leave short fading trails. There are no glows and no pointer effects.

It sits behind all content (`pointer-events:none`), stays capped at 2× pixel density, pauses when the tab is hidden, and is off for visitors who prefer reduced motion.

## Trial Theme: Princess Blue + American Silver + Black

`assets/theme-blue.css` (new, loaded last on both pages) tries a different palette without touching the other files:

- **Page background**: American Silver `#D1D1D1`.
- **Accent**: Princess Blue `#015AA0`, used everywhere the lime was.
- **Text and dark surfaces**: black.
- **Soft surfaces**: a pale blue tint instead of mint.
- **On black surfaces** (operating loop, tool panel, Control Tower, roadmap milestones, dark cards), the accent automatically switches to a brighter blue `#6CB4EE` so it stays readable.
- **Blue backgrounds** (ticker strips, the current roadmap card, the Specification box, the CTA band, the nav pill) use white text.
- **Highlighted words** are blue with a solid blue underline instead of a marker.
- **Background signals** follow the theme through a `--flow-rgb` variable read by `bg-flow.js`.

**To go back to lime:** delete the `<link rel="stylesheet" href="assets/theme-blue.css">` line from `index.html` and `roadmap.html`.

## Trial Theme: Persian + Ghost + Black (active)

`assets/theme-persian.css` (new) uses the same approach as the blue trial:

- **Page background**: Ghost `#F7F7FF`.
- **Accent**: Persian `#27187E`.
- **Text and dark surfaces**: black.
- **Soft surfaces**: a pale violet tint.
- **On black surfaces** the accent switches to a lighter violet `#A99CFF`. Persian backgrounds use white text.

Both pages now link `theme-persian.css` instead of `theme-blue.css`. To switch back to the blue trial, change that link to `theme-blue.css`. To return to lime, remove the link.

## Bold Editorial Style (active)

`assets/editorial.css` (new, loaded after the colour theme on both pages) changes the overall look to a bold, magazine-like layout:

- **Huge uppercase headlines.** The hero and section titles are set in heavy uppercase type with tight tracking. The highlighted words stay in the italic serif and keep their normal case, so they stand out against the caps.
- **Numbered sections.**
  - Every homepage section heading starts with a heavy 3px rule, a small numbered tag (01–07) next to the label, and a large outlined section number on the right.
  - The roadmap page uses the same rule above its main headings.
- **Full-width colour blocks.**
  - The package ticker is a black strip.
  - The operating loop is a solid Persian block with white type, and its lit step is white.
  - The FAQ is a solid black block.
  - The CTA is a larger Persian block.
- **Flat, minimal cards.** Offset hard shadows and lift-on-hover are removed. Cards get a Persian outline on hover instead, and buttons are square.

To go back to the previous style, remove the `editorial.css` link from `index.html` and `roadmap.html`.

## Back to Lime + Refined Capability Map (active)

Both pages are back on the green / white / black theme. The `theme-persian.css`, `theme-blue.css` and `editorial.css` links are removed. The files are still in `assets/` if you want to try them again, but nothing loads them.

The capability map (`assets/arch-theme.css`) was rebuilt for a cleaner, more consistent look:

- **Frame**: one white panel with an ink border and the same lime offset shadow as the tool showcase. The legend and the Full detail / Trace request / Reset buttons share one top bar inside the frame: legend on the left, buttons on the right, vertically centred. Trace request is the ink button, and the others are outlined. On phones the buttons drop below the legend in one row.
- **Click hint**: a single quiet line ("Interactive map. Click any box…") instead of a coloured banner. The pulsing and bobbing animations are gone.
- **Cards**:
  - Users, Console, Frameworks and the packages are white with hairline ink borders.
  - Package icons sit in small ink tiles with lime strokes, matching the nav menu icons.
  - Capability icons are muted.
- **Colour roles**: ink only for the Control Tower hub and the details panel, and lime only for the Specification, the hover/selected edge, the "Details" tags and the trace glow. There are no mint fills.
- **Hover/selected**: a lime edge (inset) instead of lifting or offset shadows.

## Ecosystem Adoption as One Stat Card

The "The ecosystem is moving" section is now a single dark stat card (inspired by Gravitee's stats card), replacing the summary row and ranked table:

- Ink card with a lime outline and a faint dot grid.
- A small live-status line at the top.
- The total downloads in very large lime type.
- A 3 × 2 grid with one cell per package: its big lime download number, name, PyPI slug, a lime bar showing its share relative to the top package, and a ↗ link to its Pepy page.
- A footer note and a lime "Explore the ecosystem →" button.

**Count-up**: the first time the card scrolls into view, the total and every package number count up from 0 (about 1.7s, staggered), and the bars grow in. Data is fetched from Pepy badges a little before the card arrives, with the previous fallback numbers if the live lookup fails. Packages are sorted by downloads, and Control Tower shows "—" while it has no data. Reduced-motion visitors see the final numbers straight away.

Files: `assets/adoption.js` (rewritten), `assets/adoption-card.css` (new), `index.html`.

## Copy Buttons and Cleaner Map Lines

- **Copy buttons** (`assets/copy.js`, `assets/copy.css`, on both pages): every `pip install …` command has a copy icon on its right. This covers the six tool panels in "What each tool actually does" and the quickstart in the Docs menu. Clicking it copies the command, the icon turns into a lime ✓ and a "Copied" tag shows for about 2s. Browsers that block clipboard access get the command selected instead, with a "Press Ctrl+C" hint.
- **Capability map lines**: the package-to-package links (Chaos→Lens, Sidecar→Lens, MCP→Lens/Chaos/Sidecar…) ran straight through the neighbouring cards, so they are no longer drawn on the map. Only the clear top-down links remain (Users → Console → Control Tower → Specification → packages, plus Frameworks → Specification). The package-to-package relationships are still listed under "Connected components" in the details panel when you click a package.

## PyPI Links

Each package's PyPI page (`https://pypi.org/project/<package>/`) is now linked in three places, all opening in a new tab:

- **Ecosystem statistics card**: each package cell has a lime "PyPI ↗" button and a "Download stats ↗" button that goes to Pepy. The cells are no longer one big link.
- **"What each tool actually does"**: each tool's footer shows "PyPI ↗" next to its GitHub link, beside the `pip install` command.
- **Docs dropdown** (both pages): an "On PyPI" row of six small links in the dark "Start here" card.

Packages: agenticlens, agentic-chaos, agentic-evals, deep-agentic-core-mcp, agenticops-control-tower, agentic-sidecar.

## Files Changed

### `index.html`

- Loads `assets/enhance.css` and `assets/enhance.js` after the existing site and Architecture assets.
- Adds the full-screen boot overlay markup, including accessible status text, network illustration, progress indicator, and component states.
- Uses a session flag to show the boot screen only on the first visit in a tab session.
- Adds headings and supporting copy to the operating loop, differentiator, and roadmap sections.
- Adds the FAQ section and navigation link.
- Points Specification to the AI Operations Specification repository and fixes the CTA URL typo.

### `assets/styles.css`

- Adds styling for the full-screen boot screen, staged network visualization, status components, progress indicator, responsive layout, and reduced-motion behavior.
- Existing page styling and sections remain in place.

### `assets/site.js`

- Runs the six boot stages, updates progress and component states, waits briefly for the page load, and removes the overlay.
- Skips and removes the inactive overlay on repeat visits in the same tab session.
- Keeps the existing mobile navigation and FAQ behavior, with a guard for missing FAQ answer targets.

### `assets/enhance.css` (new)

- Holds the visual enhancement styles: background grid and atmosphere layers, hero network placement, ticker, reveal animations, loop highlight, chart animations, hover states, and responsive adjustments.
- Provides reduced-motion rules that disable decorative movement and keep content visible.

### `assets/enhance.js` (new)

- Adds the scroll progress indicator, accessible word-wrapped hero headline, hero network canvas, ticker, scroll reveals, and loop-step cycling.
- Draws the pagewide animated background mesh and coordinates its visibility with the hero network.
- Waits for the boot overlay to be removed before starting the hero reveal, with a seven-second fallback.
- Uses IntersectionObserver where available and includes fallback behavior so enhancement failures do not leave page content hidden.

## Accessibility and Performance

- Loading progress and state changes have accessible labels/live status; the visual canvases and ticker are hidden from assistive technology.
- The experience honors `prefers-reduced-motion`; page content stays visible, animated backgrounds are disabled, and the ticker can be scrolled horizontally.
- Canvas animation pauses when the tab is hidden; the hero canvas also pauses when the hero is offscreen.
- No external libraries, assets, APIs, or network requests were added for the animation layer.

## Validation Performed

- Checked JavaScript syntax with `node --check`.
- Checked the page at desktop, intermediate, and mobile widths for horizontal overflow.
- Exercised the FAQ accordion, mobile menu, and Architecture Trace Request interaction.
- Checked reduced-motion behavior and the boot overlay's first-visit/session behavior.
- Verified the page remains visible if the enhancement script is unavailable.

## Not Changed

The Architecture infographic's data, rendering logic, relationships, and Trace Request implementation were not rewritten. Existing package descriptions, footer, deployment setup, and static-site approach were retained.

## Product simulations

Five product pages now include a static example dashboard enhanced with automatic
three-step playback, pause/play and next-step controls. Control Tower retains its
existing fleet demo. Lens shows a distributed trace waterfall and per-run token
and latency totals; Evals shows scoring and release gates; Sidecar shows policy
and authority outcomes; Chaos shows timeout recovery; MCP shows tool activity.
All panels explicitly label the data as simulated and make no backend requests.
Playback pauses offscreen, in background tabs, and while a control has focus.
Reduced-motion visitors get manual playback. Without JavaScript the first frame
remains readable.

Canonical data and HTML generation live in `scripts/sync_product_simulations.py`.
Run `python3 scripts/sync_product_simulations.py` with the five sibling product
repositories checked out to regenerate their landing pages. Shared styles and
behavior are in `assets/css/simulations.css` and `assets/js/simulations.js`.
Product HTML references these assets at `https://deepagentlabs.github.io/assets/`;
publish the organization-site assets before or alongside the product pages.
Existing product workflows already copy the updated HTML into their Pages builds.

Validation: `python3 -m unittest discover -s scripts -p 'test_product_simulations.py'`.
Browser checks cover controls and overflow at 390px and 1280px for all five pages.

### Hands-on scenarios

Each example now has product-specific controls. Lens steps expose sample latency,
tokens, cost and findings, plus an advisory recommendation. Chaos offers timeout,
rate-limit and corrupted-output scenarios with distinct recovery outcomes.
Sidecar displays original intent and a proposed refund; Observe stays advisory,
while Govern pauses for sample approval or rejection. Evals lets visitors run
four cases, inspect latency failure evidence and change the minimum pass rate
without changing the underlying case results. MCP exposes two simulated calls
with structured illustrative results and explains hosted/local availability.
Control Tower adds sample health filters, agent details, stale heartbeats and
recovery, with fleet totals and activity updated together. Manual fleet
interaction pauses the background simulation.

Browser regression checks are in `scripts/check_product_simulations.cjs` (requires
Playwright and the local preview at localhost:8765, or set
`SIMULATION_PREVIEW_URL`). They exercise every action at mobile and desktop
widths, including repeated stale-heartbeat actions and the 75% gate boundary.

## Uniform product website theme

Control Tower is the default visual theme for AgenticLens, Agentic Evals,
Agentic Sidecar, Agentic Chaos and MCP. These pages now use its actual shared
navigation and footer, typography, dotted paper background, lime highlights,
square buttons, dark preview panels and section spacing. The common styles in
`assets/css/product-uniform.css` also cover the retained product sections,
examples, code tabs and original interactive tours. The old product-specific
landing stylesheets remain in their repositories but are no longer loaded by
these pages. Product documentation styles are unaffected.

Run `python3 -B scripts/unify_product_pages.py` to regenerate the shared shell
with sibling product checkouts present. The operation preserves content sections
and is idempotent. Sidecar's integrations and audience information now live in
a content section instead of inside its old footer. MCP's two use-case sections
that previously appeared after the document closing tags now sit within main.
The existing simulation generator also recognizes the shared `pp-hero` layout.
Publish the shared website styles before or alongside the product-page HTML.

Validation: `python3 -B -m unittest discover -s scripts -p 'test_product*.py'`
checks shared shells, single landmarks, unique IDs, working internal anchors,
retained content sections and simulation data. The browser regression script
also checks theme tokens, mobile menu operation and all six interactive demos.
Original Lens release-gate controls, Evals code tabs and Sidecar demo actions
and code tabs were checked in the local preview.


## AI Operations Specification documentation

AIOS now participates in the repository-docs build and the AI-reference generator.
Its source layout is preserved (`docs/`, `specification/`, `drafts/`, `reviews/`),
using the specification repository's tracked-source staging boundary and schema
aliases. The shared product navigation links the simple developer guide and raw
robust AI reference at `/ai-operations-spec/docs/`. Both guides have the same
capability index. The reference includes Markdown, JSON Schemas, rule catalogs,
examples and portable fixtures; negative and historical cases retain their scope.

The website workflow checks out AIOS, regenerates/checks its source manifest,
and builds its shared-theme docs alongside MCP and Tower. For a local build
with the sibling checkout present (after adding intended new docs to Git):

```bash
python scripts/build_ai_docs.py --sources .. --project ai-operations-spec
python scripts/build_ai_docs.py --sources .. --project ai-operations-spec --check
python scripts/build_docs.py --project ai-operations-spec --repo ../ai-operations-spec --output /tmp/aios-docs
python scripts/check_docs_site.py /tmp/aios-docs
```

Publication does not promote draft schemas or close independent acceptance gates.
