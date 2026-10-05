# Website changelog

What changed on the DeepAgentLabs website, newest first. For how the site is put
together, see [ARCHITECTURE.md](ARCHITECTURE.md).

## October 2026

### Synced with the live site
- The **Build with us** band now comes before the newsletter, so the newsletter sign-up sits just above the footer.
- Added the **Remote MCP** link (`https://mcp.deepagentlabs.io`) from the live site to the top menu on every page and to the footer's Explore column.
- Desktop menu items no longer wrap onto two lines; spacing tightens on narrower desktop screens.

### Footer
- A short company statement as the first footer column: "Open infrastructure for observable, efficient and resilient AI agents, built in the open", with four plain-language principles: Spec comes first, Works with any framework, Runs on your machine, Free and open source.
- New dark footer on every page: **Products** (each framework's GitHub repo), **Explore** (Specification, Roadmap, Capability map, Frameworks, FAQ) and **Community** columns.
- A bottom bar with ©, the spec status ("v0.1 in review") and **Back to top**.
- Footer links have no ↗ arrows.
- Big centred wordmark above the bottom bar: "DeepAgent" in off-white and "Labs" in lime (heading font). A lime sheen passes over "DeepAgent" every 6 seconds.

### Community
- The community links live in the lime **Build with us** band at the bottom of the homepage (one section instead of two): the call to action and one line of what the community does (Workshops, Technical sessions, Research, Open source), each with a small icon on the left, one ink row each for Discord, LinkedIn, Instagram and GitHub on the right. All four icons use the same black square with a lime icon.
- "Community" in the Platform menu jumps to that band. Footer on every page links LinkedIn, Instagram, Discord and GitHub with icons; LinkedIn now uses `/company/deepagentlabs`.

### Border beam animation
- Inspired by [Beam](https://libraries.dev/beam), rebuilt in plain CSS/JS in the site's lime and ink (the original is a React package with a rainbow glow).
- A streak of light travels around the hero ecosystem card, the framework showcase, the downloads card, the milestone that's in review (homepage and roadmap page), the spec card in the menus, and the 404 card.
- Primary buttons get a quick beam on hover; the newsletter form gets one while you're typing your email.
- Beams pause when off screen and are turned off for reduced motion.

### Loading screen removed
- The full-screen boot animation is gone. The homepage opens straight onto the hero, which still has its own short entrance animation. Its markup, styles (about 65 lines of CSS) and scripts were deleted, not just hidden.

### Phone layouts
- **What each framework actually does** is an accordion on phones: seven rows with a +/− button, one card open at a time, no sideways tab strip and no auto-advance. The card no longer repeats the framework name, and long `pip install` commands wrap.
- **Ecosystem adoption**: one compact row per package (name and number side by side) instead of a tall block each.
- **Roadmap**: milestone cards in two columns.
- **Capability map**: package cards show just their name and role until tapped (or until "Full detail" is on).
- Homepage on a phone is about 1,500px shorter. Desktop is unchanged.

### Quality pass (frontend standard)
- Header is now sticky on every page, with a full-width paper background; jump links land just below it.
- One consistent keyboard focus ring; hover animations shortened to under 0.3s and the menu pill no longer bounces.
- Phones: the Menu button sits flush right in the site colours with an icon, and changes to **Close** while open. Roadmap code samples wrap instead of widening the page.
- New `404.html`. Menu links to product and docs pages that aren't built yet now show a branded "coming soon" page with that product's GitHub and PyPI links, instead of GitHub's default 404.
- The hero card shows a "Live" badge with a pulsing green dot.

### Repository structure
- Assets split into `assets/css/`, `assets/js/` and `assets/img/`. Unused files were removed (trial colour themes, the unused second ecosystem image, saved screenshots).
- Docs moved into `docs/`: this changelog, `ARCHITECTURE.md`, and the engineering notes in `docs/ecosystem/`.
- Renamed files: `bg-flow.*` → `background.*`, `arch-theme.css` → `architecture-theme.css`, `arch-compact.js` → `architecture-compact.js`, `DAL logo.png` → `img/dal-logo.png`, `deepagentlabs-ecosystem.png` → `img/ecosystem.png`.

### Header and navigation
- Mega-menus for **Products** (six product pages), **Docs** (six `/docs` pages with install commands, a quickstart and "On PyPI" links) and **Platform** (Loop, Dashboards, Why us, Roadmap).
- Architecture, FAQ, Specification, Roadmap and GitHub are top-level links.
- A lime pill slides behind the hovered item. On phones the menus become accordions.
- The product and docs pages (`/agenticlens`, `/agenticlens/docs`, …) do not exist yet and will 404 until they are added.

### Look and feel
- Green / white / black theme. Headlines use Bricolage Grotesque, body text Inter, and highlighted key words Instrument Serif italic on a lime marker.
- Section labels have a lime underline. The operating loop is a dark band. "Why us" uses contrasting tiles.
- A quiet animated background: faint dark-green signals move slowly along the page grid.

### Capability map (`#architecture`)
- Restyled in the site theme: white cards, an ink Control Tower, and the lime Specification as the only filled accent.
- Compact by default. "Full detail" shows everything, and selecting a package shows all its capabilities.
- An "Interactive map" hint, "Details ↓" tags on hover, and a details panel that scrolls into view when you click something.
- Package-to-package lines are no longer drawn, because they crossed other cards. They are still listed under "Connected components" in the details panel.

### What each framework actually does (`#dashboards`)
- Renamed from "What each tool actually does"; the section now talks about frameworks.
- One tabbed panel instead of seven tall cards. Hover (desktop) or click a framework to switch, and it auto-advances until the visitor interacts.
- Each panel shows the framework's full card: description, capabilities, sample output, `pip install` command with a **copy button**, a **PyPI** link and a GitHub link.

### Ecosystem adoption (`#adoption`)
- One dark stat card with the total downloads and one cell per package. Numbers count up from 0 the first time the card is seen.
- Each package has **PyPI** and **Download stats** links.

### Roadmap
- The homepage section sits above the FAQ: eight milestone cards with status, a progress rail, and links to each phase.
- New `roadmap.html`: hero with progress meter, milestone ticker, four promises, a dark milestone section with one animated illustration per phase, the gates for the next release, and a call to review the spec.

## Earlier
- First-visit agent boot screen, homepage animation layer (scroll progress, hero reveal, package ticker, reveal-on-scroll), FAQ section, and section copy updates.
