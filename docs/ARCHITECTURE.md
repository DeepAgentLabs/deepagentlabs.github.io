# Website architecture

How the DeepAgentLabs website is put together: which files exist, what each one does,
how the pages are built, and how to change things safely.

The site is **plain HTML, CSS and vanilla JavaScript**. There is no build step, no
framework and no package install. GitHub Pages serves the repository root as-is.

---

## 1. Folder structure

```
deepagentlabs.github.io/
├── index.html                  Homepage
├── roadmap.html                Roadmap page (AI Operations Specification milestones)
├── 404.html                    Not-found page; shows "coming soon" for product/docs links
├── CNAME                       Custom domain → deepagentlabs.io
├── .nojekyll                   Tells GitHub Pages to serve files as-is (no Jekyll)
├── README.md                   Publish + local preview instructions
├── .github/
│   └── CODEOWNERS
├── assets/
│   ├── css/                    Stylesheets (one file per area, see §3)
│   ├── js/                     Scripts (one file per feature, see §4)
│   └── img/
│       ├── dal-logo.png        Brand mark (header, footer)
│       └── ecosystem.png       Hero diagram + social share image (og:image)
└── docs/
    ├── ARCHITECTURE.md         This file
    ├── CHANGELOG.md            What changed on the website and why
    └── ecosystem/              Internal engineering notes about the DeepAgentLabs repos
                                (not part of the website, not linked from it)
```

Rules of thumb:

- **Pages live at the root.** A new page is a new `*.html` file next to `index.html`.
- **Everything a page loads lives in `assets/`**, sorted by type (`css/`, `js/`, `img/`).
- **Docs live in `docs/`.** Nothing in `docs/` is loaded by the website.
- File names are lowercase and use hyphens. No spaces.

---

## 2. Pages

### `index.html` — homepage

| # | Section (id)        | What it shows                                              | Main files |
|---|---------------------|------------------------------------------------------------|------------|
| – | Header / nav        | Logo, mega-menus (Products, Docs, Platform), links, GitHub | `nav.css`, `nav.js`, `site.js` |
| 1 | `#top` hero         | Headline, intro, buttons, ecosystem diagram card           | `styles.css`, `theme.css`, `enhance.*` |
| – | Package ticker      | Scrolling lime strip of package names (built by script)    | `enhance.*`, `theme.css` |
| 2 | `#loop`             | "One loop, five stages" – the operating loop               | `styles.css`, `theme.css`, `enhance.js` |
| 3 | `#architecture`     | Interactive capability map + details panel                 | `architecture.*`, `architecture-theme.css`, `architecture-compact.js` |
| 4 | `#dashboards`       | "What each framework actually does": tabbed showcase of the seven DeepAgentLabs frameworks with sample output      | `tools.*`, `copy.*` |
| 5 | `#adoption`         | Ecosystem downloads stat card with count-up                | `adoption.css`, `adoption-card.css`, `adoption.js` |
| 6 | `#roadmap`          | Eight milestone cards linking into `roadmap.html`          | `roadmap.css`, `roadmap.js` |
| 7 | `#faq`              | Accordion of common questions                              | `styles.css`, `site.js` |
| 8 | `#why`              | "One contract beats separate tools" comparison tiles       | `styles.css`, `theme.css` |
| 9 | `#newsletter`       | Buttondown sign-up form                                    | `styles.css` |
| – | `#community` CTA + footer | "Build with us" lime band with the community links (Discord, LinkedIn, Instagram, GitHub rows); dark footer with Products / Explore / Community columns, a short company statement with principles as the first column, big centred wordmark and a status bar | `styles.css`, `theme.css`, `footer.css` |

### `404.html` — not found

GitHub Pages serves this for any missing URL. It uses absolute paths (`/assets/...`)
because it can be served from any depth. If the URL starts with a product slug from the
menu (`/agenticlens`, `/mcp/docs`, …) it says the page is coming soon and links to that
product's GitHub README and PyPI package; otherwise it shows a plain not-found message.
The product list lives in the small script at the bottom of the file.

### `roadmap.html` — roadmap page

| Section            | What it shows                                                   |
|--------------------|-----------------------------------------------------------------|
| `.rp-hero`         | Headline, intro, buttons, "Step 1 of 8" progress meter           |
| `.rp-ticker`       | Lime strip of all milestones                                     |
| `.rp-why`          | Four "promise" colour tiles                                      |
| `.rp-dark` / `#milestones` | One block per milestone (`#v0-1` … `#v1-0`) with an animated illustration |
| `.rp-gates`        | "What unlocks the next step" cards                               |
| `.cta`             | "Review the spec" band                                           |

The homepage roadmap cards link to these anchors (`roadmap.html#v0-3` etc.).

---

## 3. Stylesheets (`assets/css/`)

Stylesheets are loaded **in this order**. Later files override earlier ones, so the
order matters.

| Order | File                      | Loaded on | Responsibility |
|------:|---------------------------|-----------|----------------|
| 1 | `styles.css`              | both | Base: colour tokens (`--ink`, `--paper`, `--acid`, `--mint`, …), typography, layout shell, hero, loop, FAQ, newsletter, CTA, footer |
| 2 | `architecture.css`        | home | Original capability-map layout (grid, cards, connection lines, details panel) |
| 3 | `enhance.css`             | both | Scroll progress bar, reveal-on-scroll, ticker, background grid, hover effects |
| 4 | `adoption.css`            | home | Adoption section heading and layout |
| 5 | `roadmap.css`             | both | Homepage roadmap cards **and** the whole `roadmap.html` page |
| 6 | `nav.css`                 | both | Mega-menu dropdowns, sliding lime pill, mobile menu accordion |
| 7 | `theme.css`               | both | Site-wide look: fonts (Bricolage Grotesque / Inter / Instrument Serif), lime highlight on key words, section labels, dark loop band, "Why us" tiles, ticker colours |
| 8 | `background.css`          | both | Positions the animated background canvas behind content |
| 9 | `copy.css`                | both | Copy-to-clipboard button on install commands |
| 10 | `tools.css`              | home | Tabbed framework showcase (tabs and panels) |
| 11 | `architecture-theme.css` | home | Capability map in the site theme + compact view + "click for details" hints |
| 12 | `adoption-card.css`      | home | Dark downloads stat card |
| 13 | `polish.css`             | all  | Loaded last: extra tokens (`--focus`, `--danger`, `--ease`, `--dur-hover`, `--header-h`), sticky header, one focus style, hover timing (≤ 0.3s, no bounce), 404 layout, reduced-motion overrides |
| 14 | `mobile.css`             | home | Phone layouts (≤ 680px): frameworks accordion, compact adoption rows, two-column roadmap cards, capability map shows a package's capabilities only when selected |
| 15 | `beam.css`               | all  | Border beam: a streak of light that travels around a border (`@property` + conic gradient). Variants: `glow` (lime), `quick`, `ink` (offset ink outline), `hover`, `focus` |
| 16 | `community.css`          | home | "Build with us" band combined with the community links: call to action left, ink link rows right (white on hover); one column under 900px |
| 17 | `footer.css`             | all  | Site footer (`footer.site-footer`): three columns → two on phones, centred wordmark with a slow sheen, "Back to top" |

**Design tokens** (defined in `styles.css` `:root`):

| Token     | Value     | Use |
|-----------|-----------|-----|
| `--ink`   | `#07110e` | Text, dark surfaces |
| `--paper` | `#f2f0e9` | Page background |
| `--acid`  | `#b7f343` | Lime accent (highlights, active states, CTAs) |
| `--mint`  | `#d8f7c0` | Soft lime surfaces |
| `--muted` | `#5f6863` | Secondary text |
| `--line`  | `rgba(7,17,14,.18)` | Hairline borders |

Fonts are loaded from Google Fonts (`@import` at the top of `styles.css` and `theme.css`).

---

## 4. Scripts (`assets/js/`)

Every script is loaded with `defer`, wraps itself in an IIFE, and exits quietly if
the elements it needs are not on the page. That is why the same script can be loaded
on both pages.

| File                      | Loaded on | Responsibility |
|---------------------------|-----------|----------------|
| `site.js`                 | both | Mobile menu toggle, footer year, FAQ accordion |
| `architecture.js`         | home | Builds the capability map from its data, draws connection lines, details panel, Trace request |
| `architecture-compact.js` | home | "Full detail" toggle, "+N more" hints, interactive hint bar, scrolls the details panel into view |
| `enhance.js`              | home | Scroll progress, hero word reveal, hero network canvas, package ticker, reveal-on-scroll, loop step cycling |
| `adoption.js`             | home | Fetches PyPI download counts (Pepy badges, with fallback numbers) and runs the count-up |
| `tools.js`                | home | Framework showcase: tabs on desktop (hover / click / arrow keys, auto-advance); on phones (≤ 680px) it moves each card under its name and works as an accordion |
| `roadmap.js`              | both | Progress bars on both pages; reveal animations on `roadmap.html` |
| `nav.js`                  | both | Mega-menus (hover on desktop, tap on mobile, Esc / outside click), sliding lime pill |
| `background.js`           | both | Slow animated "signals" on the background grid (canvas, paused when tab hidden) |
| `beam.js`                 | all  | Adds the border beam to a short list of elements (hero card, framework showcase, downloads card, milestone in review, menu spec card, 404 card; primary buttons on hover; newsletter form on focus). Ambient beams only run while on screen |
| `copy.js`                 | both | Adds a copy button to every `pip install …` command |

### Data that lives in scripts

- **Capability map content** (components, capabilities, relationships, outputs): `architecture.js` → `DATA`.
- **PyPI packages and fallback download numbers**: `adoption.js` → `packages`.

---

## 5. External services

| Service | Used for | Where |
|---------|----------|-------|
| Google Fonts | DM Mono, Manrope, Bricolage Grotesque, Inter, Instrument Serif | `styles.css`, `theme.css` |
| Pepy (`api.pepy.tech/badge/<package>`) | All-time PyPI download counts | `adoption.js` |
| PyPI (`pypi.org/project/<package>/`) | Package pages linked from the site | `index.html`, `roadmap.html`, `adoption.js` |
| Buttondown | Newsletter sign-up | `index.html` |
| GitHub | Repository links | `index.html`, `roadmap.html` |
| Font Awesome Free 6.5.2 (cdnjs, brand icons, CC BY 4.0) | Discord, LinkedIn, Instagram and GitHub icons | `index.html`, `roadmap.html`, `404.html` |
| Discord, LinkedIn, Instagram | Community links (community section, Platform menu, footer on every page) | `index.html`, `roadmap.html`, `404.html` |

If Pepy cannot be reached, the stat card falls back to the numbers in `adoption.js`.

---

## 6. Behaviour and accessibility rules

- **Reduced motion:** every animation checks `prefers-reduced-motion` and shows the
  final state instead (no count-up, no ticker, no background signals).
- **Keyboard:** menus open with Enter/Space and close with Esc; tool tabs support the
  arrow keys, Home and End; FAQ items are buttons with `aria-expanded`.
- **No hidden content on failure:** reveal animations have a fallback, so content is
  shown even if a script fails.
- **Mobile:** layouts collapse at 900px and 680px; the header becomes a Menu button at 820px.
  Pages must not scroll sideways at 360px.
- **Header:** sticky on every page; `scroll-padding-top` keeps anchor targets below it.
- **Focus:** one visible focus ring (`--focus`) on every link, button and input.
- **Hover:** short (≤ 0.3s), subtle lift, borders and shadows kept intact; no springy bounce.
- **Honest content:** sample output is labelled illustrative; download numbers come from Pepy and say when a snapshot is shown.

---
