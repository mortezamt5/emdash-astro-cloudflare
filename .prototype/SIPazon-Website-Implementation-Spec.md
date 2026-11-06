# MORazon Website: Implementation Spec for Agents

**Version 1.0 · 4 November 2026**
**Built from:** `MORazon-prototype.html` (structure, CSS, fonts, components, behaviour), `colour-roles-palette.png` (approved colours), `Archive.zip` (final logo set MORazon2027MN)

This document tells an implementing agent (Codex, Claude Code or a developer) **how the new MORazon website is built**: page structure, CSS architecture, fonts, colours, components, motion, responsive rules, JavaScript behaviour and logo usage. Everything is extracted from the prototype source. Where the prototype conflicts with the approved brand, this spec says which one wins.

---

## 0. Read this first

### 0.1 Package contents

| File | Role |
|---|---|
| `MORazon-Website-Implementation-Spec.md` | This spec |
| `MORazon-prototype.html` | **Visual and structural reference.** One self-contained file (inline CSS, JS and SVG icon sprite). Open it in a browser next to this spec |
| `colour-roles-palette.png` | **Approved colour palette** (8 colour roles). Authoritative for every colour |
| `Archive.zip` | **Final logo set** `MORazon2027MN`: Illustrator master, 6-page PDF, 6 SVGs |
| `logo-web/` | **Ready-to-use web logos** derived from Archive.zip: `MORazon-wordmark-navy.svg`, `MORazon-wordmark-white.svg`, `MORazon-symbol-navy.svg` (§12.2) |

### 0.2 Source hierarchy (when sources disagree)

| Topic | Wins | Never take it from |
|---|---|---|
| Colours | `colour-roles-palette.png` (§4) | The prototype's own HEX values |
| Logo | `Archive.zip` → MORazon2027MN (§12) | The base64 PNG logo inside the prototype |
| Layout, spacing, typography, components, motion, responsive behaviour | `MORazon-prototype.html` (§2–§11) | — |
| **Text / product content** | The approved CS3 marketing documents (CS3-MKT-01…09), supplied separately | **The prototype's text.** It is copied from the old MORazon.com and describes features that are not current for CS3 |

### 0.3 Hard rules

1. **Build the structure and look of the prototype; do not copy its text.** All headings, claims, product names, model numbers, integrations and links in the prototype are placeholders (§14).
2. **Only palette colours** (plus white, and transparent tints of palette colours for hairlines, glows and textures). The prototype's **orange `#E0690A` is rejected**.
3. **Logo only from Archive.zip.** Never recolour, redraw, rasterise or CSS-filter it.
4. **Light theme only** until a dark theme is approved (§4.6).
5. **No framework is required.** The prototype is plain HTML, CSS and vanilla JS. Use the target CMS or framework if the project has one, but keep the class structure and tokens.

---

## 1. Technical overview of the prototype

**No CSS or JS framework is used.** The prototype is hand-written CSS with custom properties, plus vanilla JavaScript. There is no Tailwind, shadcn/ui, Radix, Bootstrap, React, Vue or jQuery, no build step, and no external script. The only external resource is Google Fonts. Class names (`.pcard`, `.dd-grid`, `.sec-head`, …) are the prototype's own, not utility classes from a framework.

If the production stack uses a framework (e.g. a React/Next.js app with Tailwind, or shadcn/ui components), keep this spec as the source of truth and translate it:
- **Tailwind:** put the Appendix A tokens into `theme.extend` (colors, fontFamily, borderRadius, boxShadow, maxWidth `wrap`) or reference the CSS variables directly (`bg-[var(--surface)]`). Don't use Tailwind's default palette.
- **shadcn/ui:** map its theme variables to these tokens: `--background`→`--bg`, `--foreground`→`--ink`, `--primary`→`--primary`, `--primary-foreground`→`--primary-ink`, `--muted-foreground`→`--muted`, `--border`/`--input`→`--border`, `--ring`→`--sz-signal-blue`, `--radius`→`10px`. Restyle components to match §7 (button height 44px, card radius 18px, mono uppercase labels).
- **Any stack:** the visual result must match the prototype screenshots at 1440 / 1024 / 768 / 390px.

| Item | Value |
|---|---|
| File | Single HTML file, 177,903 bytes, 1,665 lines |
| `<head>` | `charset utf-8`; `viewport width=device-width, initial-scale=1, viewport-fit=cover`; title "MORazon Prototype"; meta description |
| External dependencies | **Only Google Fonts** (Geist, Geist Mono). No JS libraries, no images except the inline logo PNG |
| CSS | One inline `<style>` block (lines 7–703), ~266 class selectors, custom properties on `:root` and `:root.dark` |
| Icons | Inline SVG sprite of **42 `<symbol>`s** (`#i-*`), used via `<svg class="ic"><use href="#i-…"/></svg>` |
| JS | One inline IIFE at the end of `<body>` (lines 1504–1664), plus a one-line theme pre-loader at the start of `<body>` |
| Storage | `localStorage` key `MORazon-theme` (`dark` / `light`), wrapped in `try/catch` |
| Without network | Works; fonts fall back to the system sans/mono stack |

**Recommended production structure:**

```
/assets/css/tokens.css        ← §4 and Appendix A
/assets/css/base.css          ← reset, typography, layout helpers (§3, §5)
/assets/css/components.css    ← §7
/assets/css/sections.css      ← section-specific rules (§2)
/assets/js/site.js            ← §10
/assets/icons/sprite.svg      ← the 42 symbols (§8), or keep inline
/assets/logo/                 ← SVGs from Archive.zip (§12)
```

---

## 2. Page structure

### 2.1 Document skeleton

```html
<body>
  <script>/* theme pre-loader: add .dark to <html> if localStorage says so */</script>
  <svg width="0" height="0" style="position:absolute" aria-hidden="true">…42 <symbol>s…</svg>
  <header class="nav" id="nav">…</header>           <!-- sticky top bar -->
  <div class="mnav" id="mnav" aria-hidden="true">…</div>  <!-- full-screen mobile menu -->
  <main id="top">
    <section class="hero">…</section>
    <section class="strip" aria-label="Technology ecosystem">…</section>
    <section class="sec" id="products">…</section>
    <section class="band sec" id="ams">…</section>
    <section class="sec" id="platform">…</section>
    <section class="sec" id="landscape">…</section>
    <section class="sec" id="solutions">…</section>
    <section class="sec">…EN81 / feature split…</section>
    <section class="sec" id="hardware">…</section>
    <section class="sec" id="integrations">…</section>
    <section class="band sec" id="critical">…</section>
    <section class="sec" id="enterprise">…</section>
    <section>…CTA…</section>
  </main>
  <footer>…</footer>
  <script>/* behaviour, §10 */</script>
</body>
```

Every section's inner content sits in `<div class="wrap">` (max 1200 px, fluid side gutter).

### 2.2 Sections in order

| # | Element / id | Purpose (pattern, not content) | Layout | Key classes |
|---|---|---|---|---|
| 1 | `header.nav#nav` | Sticky, blurred top bar: logo, 5 dropdown menus, search pill, secondary + primary CTA, burger (mobile) | Flex row, 68 px tall | `.nav`, `.nav-in`, `.brand`, `.menu`, `.m-btn`, `.dd`, `.nav-cta`, `.search-pill`, `.kbd`, `.icon-btn`, `.burger` |
| 2 | `.mnav#mnav` | Mobile menu overlay: `<details>` accordions per menu, CTA buttons at the bottom | Fixed full-screen | `.mnav`, `.mnav-top`, `.sub`, `.mnav-cta` |
| 3 | `.hero` | Announcement pill → eyebrow → large centred H1 with one accent word → lead → 2 CTAs → chips → "stage" panel with an animated SVG ecosystem diagram (a 2-column list replaces it on mobile) | Centred, max H1 15ch | `.announce`, `.pill`, `.eyebrow`, `h1 .q`, `.lead`, `.hero-ctas`, `.hero-tags`, `.chip`, `.stage`, `.stage-frame`, `.stage-bar`, `.eco`, `.eco-m` |
| 4 | `.strip` | Label + endlessly scrolling marquee of tokens (standards, partners) | Flex; label 200 px + marquee | `.strip-in`, `.strip-lbl`, `.marquee`, `.track`, `.tok`, `.tok.m` (mono), `.tok.hl` (highlighted) |
| 5 | `#products` | Section head + **4 product-family cards** with an illustration well and model chips | 2-column grid | `.sec-head`, `.pgrid`, `.pcard`, `.viz`, `.body`, `.top`, `.kicker`, `.go`, `.models` |
| 6 | `#ams` (`.band`) | Rounded tinted band: two-column intro + 2×2 point grid, then a **mock product console** (sidebar, tabs, KPI tiles, table, chart, live log, calls with audio meters, PA zones) labelled "Example data" | Band inset from page edges | `.band`, `.glow`, `.ams-top`, `.ams-points`, `.app`, `.app-bar`, `.app-url`, `.sample`, `.side`, `.tabs`, `.view`, `.kpis`, `.kpi`, `.split`, `.card-d`, `table.t`, `.st`, `.log`, `.chart`, `.calls`, `.call`, `.meter`, `.zones`, `.zone`, `.vol`, `.ann` |
| 7 | `#platform` | Module switcher: vertical tab list (left, 320 px) + panel with a mini visual and text/bullets (right). Auto-rotates every 6 s when visible | 320 px + fluid | `.plat`, `.plat-list`, `.pi`, `.plat-panel`, `.plat-viz`, `.plat-txt` (+ mini visuals `.pv-*`) |
| 8 | `#landscape` | Text column + 3 stacked "layer" cards (Cloud / Fog / Edge) joined by animated vertical pipes; small quote | 0.8fr / 1.2fr | `.layers-wrap`, `.layers`, `.layer.cloud/.fog/.edge`, `.nodes`, `.pipes`, `.quote-sm` |
| 9 | `#solutions` | Full-width tinted strip with **6 solution cards**, each with a mini UI "scene" and a big background icon | 3-column grid | `.sgrid`, `.scard`, `.scene`, `.big`, `.ui`, `.acts`, `.sdot` |
| 10 | (feature split) | Two columns: text + 2-column feature list; animated diagram (lift shaft) | 1fr / 1fr | `.en81`, `.en81-feats`, `.shaft`, `.car`, `.vl`, `.codes` |
| 11 | `#hardware` | Hardware hero (3D-tilted CSS device with callouts) + side column with attributes and a **product line-up list** | 1.05fr / 0.95fr | `.hw`, `.hw-hero`, `.jnode`, `.callout`, `.hw-side`, `.attrs`, `.lineup`, `.row`, `.badge` |
| 12 | `#integrations` | Two vendor columns around a central hub with animated wires, protocol chips, and a highlighted feature row | 1fr / 220 px / 1fr | `.intg`, `.icol`, `.vendor`, `.lg`, `.sm`, `.hub`, `.wires`, `.core`, `.proto`, `.feature-xp` |
| 13 | `#critical` (`.band`) | Bento grid: one large hero box with a code sample, plus feature boxes in mixed widths | 6-column grid | `.bento`, `.bx`, `.bx.w2/.w3/.w4`, `.hero-bx`, `.sipline` |
| 14 | `#enterprise` | 3×2 feature grid with 1 px dividers inside one rounded frame | 3 columns | `.ent` |
| 15 | CTA | Eyebrow, large centred H2, lead, buttons; expanding ring animation behind | Centred | `.cta`, `.rings` |
| 16 | `footer` | Brand column (logo, blurb, social icons) + 5 link columns; bottom row with copyright, meta and theme toggle | 1.4fr + 5 × 1fr | `.f-top`, `.f-brand`, `.social`, `.f-col`, `.f-bot`, `.f-meta`, `.theme-toggle` |

**Content-free reuse:** the patterns in sections 5, 9, 11 (`.lineup`), 12 (`.icol`/`.vendor`) and 14 (`.ent`) are the building blocks for **catalog / product pages**.

### 2.3 Navigation structure (pattern)

| Menu | Dropdown type | Items |
|---|---|---|
| Products | `.dd-split`: 2-column item grid (`.dd-grid.dd-2`) + a 240 px **feature card** (`.dd-feature`) on the right | 5 |
| Platform | `.dd-grid.dd-3`, 3 columns, 720 px wide | 7 |
| Solutions | `.dd-grid.dd-2`, 600 px | 6 |
| Services | `.dd-grid.dd-1`, 300 px | 3 |
| Company | `.dd-grid.dd-1`, title only (no description) | 4 |

Each dropdown item (`.dd-item`) = 36 px icon tile (`.dd-ico`) + title (`.dd-t`, 14.5 px/600) + one-line description (`.dd-d`, 13 px muted). The labels, items and URLs in the prototype (links to the old MORazon.com) are **placeholders**: take the real information architecture from the project.

Right side of the bar: search pill (`.search-pill`, visual only, shows a `/` shortcut hint), "Portal" ghost button, "Contact us" primary button. ≤1024 px: menu and ghost button hidden, burger shown.

---

## 3. Typography

### 3.1 Fonts

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700&family=Geist+Mono:wght@400;500;600&display=swap">
```

| Token | Stack | Used for |
|---|---|---|
| `--f-display` | `"Geist", ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif` | Headings |
| `--f-body` | same as display | All running text, buttons, nav |
| `--f-mono` | `"Geist Mono", ui-monospace, SFMono-Regular, Menlo, Consolas, monospace` | Eyebrows, kickers, chips, model codes, table headers, labels, timestamps, code samples, `.kbd` |

Both fonts are open source (SIL OFL). For production you may self-host them (e.g. the `@fontsource-variable/geist` and `@fontsource-variable/geist-mono` npm packages) to avoid the Google dependency. **Barlow Condensed** (the logo's typeface) is **never** used for website text.

Body: `-webkit-font-smoothing: antialiased`; `text-wrap: balance` on h1–h4.

### 3.2 Type scale

| Role | Size | Line height | Tracking | Weight | Font |
|---|---|---|---|---|---|
| Hero H1 (`.hero h1`) | `clamp(2.55rem, 7vw, 5.6rem)` | .98 | −.045em | 600 | Geist |
| CTA H2 (`.cta h2`) | `clamp(2.3rem, 5.4vw, 4.4rem)` | 1 | −.035em | 600 | Geist |
| Section H2 (`h2`) | `clamp(2rem, 4.2vw, 3.35rem)` | 1.05 | −.035em | 600 | Geist |
| Hardware H2 (`.hw-side h2`) | `clamp(1.9rem, 3.4vw, 2.8rem)` | 1.05 | −.035em | 600 | Geist |
| Platform panel H3 | 1.6rem | 1.25 | −.025em | 600 | Geist |
| Card H3 (`h3`) | 1.25rem | 1.25 | −.015em | 600 | Geist |
| Lead (`.lead`) | `clamp(1.02rem, 1.4vw, 1.15rem)`, max 62ch, muted | 1.6 | — | 400 | Geist |
| Body | 16px | 1.6 | — | 400 | Geist |
| Card text | 14.5–15px, muted | 1.45–1.6 | — | 400 | Geist |
| Nav link (`.m-btn`) | 14.5px | — | — | 500 | Geist |
| Button | 15px (small: 14px) | — | — | 500 | Geist |
| Eyebrow (`.eyebrow`) | 12px, UPPERCASE | — | .09em | 400 | Mono |
| Kicker (`.kicker`) | 11.5px, UPPERCASE | — | .06em | 400 | Mono |
| Chip / model chip | 12px / 11.5px | — | — | 400–500 | Mono |
| Table header (`.t th`) | 10.5px, UPPERCASE | — | .06em | 500 | Mono |
| Footer column title (`.f-col h5`) | 12px, UPPERCASE | — | .08em | 500 | Mono |
| Small print | 13px | — | — | 400 | Geist |

**Signature details:**
- **Accent word in a headline:** `<span class="q">` coloured with the primary colour (`.hero h1 .q`). One per headline at most. `.dim` gives a muted word.
- **Eyebrow marker:** `.eyebrow::before` draws a 6×6 px, 2 px-radius square before the label. Prototype colour: orange `--signal` → **implement with Signal Blue** (§4).
- **Numbers:** `font-variant-numeric: tabular-nums` in KPIs, timers and tables.

---

## 4. Colour

### 4.1 Approved palette (from `colour-roles-palette.png`)

| Name | HEX | RGB | Role in palette | Contrast on white |
|---|---|---|---|---|
| Deep Navy | `#041C2B` | 4 28 43 | Anchor | 17.41:1 |
| Electric Blue | `#1F3FE6` | 31 63 230 | Primary | 7.21:1 |
| Comm. Cyan | `#00A8F4` | 0 168 244 | Secondary | **2.66:1**: never text on light |
| Signal Blue | `#1476FF` | 20 118 255 | Accent | **4.15:1**: text only ≥ 24 px |
| Slate Navy | `#0A3348` | 10 51 72 | Body text | 13.29:1 |
| Graphite | `#676767` | 103 103 103 | Muted text | 5.66:1 |
| Silver | `#D8D8D8` | 216 216 216 | Borders | decorative only |
| Ice Blue | `#EAF7FF` | 234 247 255 | Highlight | background only |

White `#FFFFFF` is the page and surface colour. **Transparent tints of palette colours** (e.g. `rgba(4,28,43,.06)` for grid lines, `color-mix(in srgb, #1F3FE6 16%, transparent)` for glows) are allowed. No other hues.

### 4.2 Prototype tokens → implementation values (light theme)

The prototype uses the token names below. **Keep the names** (all component CSS references them) and **set the values from the right-hand column.**

| Token | Prototype value | Used for | **Implement as** | Note |
|---|---|---|---|---|
| `--bg` | `#FFFFFF` | page | `#FFFFFF` | — |
| `--surface` | `#FFFFFF` | cards, panels | `#FFFFFF` | — |
| `--surface-2` | `#F6F7F9` | card image wells, Solutions strip, hovers | `#EAF7FF` Ice Blue | No neutral grey in palette (see 4.5) |
| `--ink` | `#0D1C2A` | headings, primary button fill | `#041C2B` Deep Navy | visually identical (ΔE 2.4) |
| `--ink-2` | `#2A3847` | nav text, secondary copy | `#0A3348` Slate Navy | |
| `--muted` | `#5E6978` | lead, captions, labels | `#676767` Graphite | |
| `--border` | `#E6E9EE` | hairlines | `#D8D8D8` Silver | heavier lines than the prototype (see 4.5) |
| `--border-2` | `#D5DAE2` | stronger borders | `#D8D8D8` Silver | |
| `--primary` | `#2350F0` | accent words, links, icons, flows | `#1F3FE6` Electric Blue | |
| `--primary-ink` | `#FFFFFF` | text on primary | `#FFFFFF` | 7.21:1 |
| `--primary-soft` | `#EAEFFF` | soft badge fills, highlighted tokens | `#EAF7FF` Ice Blue | |
| `--signal` | `#E0690A` (orange) | eyebrow marker, "New" pill, live/alarm states, Edge layer, dashed flow lines, callout dots | **`#1476FF` Signal Blue** for markers, dots and lines. **`#1F3FE6` Electric Blue** wherever `--signal` colours small text (`.announce .pill`, `.dd-feature .tag`, `.sample`) | Orange rejected |
| `--signal-soft` | `#FFF1E4` | "New" pill background | `#EAF7FF` Ice Blue | |
| `--on-signal` | `#FFFFFF` | text on signal fills | `#FFFFFF` | |
| `--success` / `--warning` / `--error` | `#12924A` / `#B87000` / `#D02A2A` | status dots and pills (mock UI only) | **Not approved.** See 4.4 | |
| `--grid` | `rgba(13,28,42,.06)` | hero grid, dot grids | `rgba(4,28,43,.06)` | Deep Navy tint |
| `--shadow` | `0 1px 2px rgba(13,28,42,.05), 0 8px 24px -10px rgba(13,28,42,.10)` | cards, pills | same geometry, `rgba(4,28,43,…)` | |
| `--shadow-lg` | `0 2px 4px rgba(13,28,42,.04), 0 30px 60px -24px rgba(13,28,42,.20)` | hover, dropdowns, stage | same geometry, `rgba(4,28,43,…)` | |
| `--band` | `#F6F7F9` | `.band` sections | `#EAF7FF` Ice Blue | |
| `--panel` | `#FAFBFC` | mock UI background | `#FFFFFF` | |
| `--panel-2` | `#FFFFFF` | mock UI cards | `#FFFFFF` | |
| `--panel-3` | `#EEF1F6` | active rows, avatars | `#EAF7FF` Ice Blue | |
| `--panel-line` / `--panel-line-2` | `#E4E8EE` / `#D3D9E2` | mock UI borders | `#D8D8D8` Silver | |
| `--panel-ink` | `#1E2B3A` | mock UI text | `#0A3348` Slate Navy | |
| `--panel-mute` / `--panel-dim` | `#606B7C` / `#8B94A5` | mock UI secondary text | `#676767` Graphite | `#8B94A5` fails contrast |
| `--panel-strong` | `#0D1C2A` | mock UI headings | `#041C2B` Deep Navy | |
| `--panel-grid` / `--panel-dot` / `--panel-sunk` | navy at 5 % / 9 % / `#F3F5F8` | textures | `rgba(4,28,43,.05)` / `rgba(4,28,43,.09)` / `#EAF7FF` | |
| `--panel-shadow` | `0 1px 2px rgba(13,28,42,.04), 0 40px 70px -34px rgba(13,28,42,.28)` | console mock | `rgba(4,28,43,…)` | |
| `--hub-a` / `--hub-b` | `#FFFFFF` / `#EEF2FF` | hub gradient | `#FFFFFF` / `#EAF7FF` | |
| `--hub-line` | `#B8C5F5` | hub, rings | `color-mix(in srgb, #1F3FE6 30%, #FFFFFF)` | tint of Electric Blue |
| `--hub-glow` / `--glow` | `rgba(35,80,240,.22)` / `.10` | glows | `rgba(31,63,230,.22)` / `.10` | |
| `--glow-2` | `rgba(224,105,10,.08)` (orange) | secondary glow | `rgba(0,168,244,.10)` Comm. Cyan | |
| `--wire` | `#D6DCE6` | diagram wires | `#D8D8D8` Silver | |
| `--p-primary` | `#2350F0` | mock UI accent | `#1F3FE6` | |
| `--p-signal` | `#E0690A` | mock UI "live" accent | `#00A8F4` Comm. Cyan (graphics) / `#1F3FE6` (text) | |
| `--p-ok` / `--p-warn` / `--p-err` | green / amber / red | mock UI status | see 4.4 | |
| `--logo-filter` | `none` (dark: `brightness(0) invert(1)`) | logo | **remove**: use the correct SVG (§12) | |

### 4.3 Colour usage rules

- **Headings** Deep Navy · **Body** Slate Navy · **Muted** Graphite · **Borders** Silver · **Links / accent word / icons** Electric Blue · **Markers, focus ring, data lines** Signal Blue · **Decorative graphics on dark** Comm. Cyan · **Tinted fills** Ice Blue.
- Primary button (`.btn-primary`): Deep Navy fill, white text. Accent button (`.btn-accent`): Electric Blue fill, white text, **one per section**.
- Never Comm. Cyan text on white or Ice Blue. Never Signal Blue text under 24 px.
- Focus ring: `outline: 2px solid` Signal Blue (prototype: `--primary`), `outline-offset: 3px`.

### 4.4 Status colours (not approved)

The prototype's green / amber / red appear **only in the product UI mock-up** (`#ams` console, vendor "Compatible" labels, hero diagram dots). The palette has no status or alarm colours.
- **Default:** don't use status colours on marketing pages. Show state with an icon plus a word.
- If the mock console is kept, keep the prototype values in clearly named tokens (`--candidate-ok/-warn/-err`) and mark them for brand approval. Real product screenshots keep their own UI colours.

### 4.5 Decisions still open (implement the default, keep it a single token change)

| Topic | Default in this spec | Alternative if the brand owner approves |
|---|---|---|
| Subtle surface (`--surface-2`, `--band`) | Ice Blue `#EAF7FF` | a neutral tint such as `#F6F7F9` |
| Hairline border (`--border`) | Silver `#D8D8D8` | a lighter tint such as `#E6E9EE` |
| Alarm / emergency colour | none (icon + word) | a dedicated alarm colour |

### 4.6 Dark theme

The prototype ships a full dark theme (`:root.dark` with values such as background `#06080D` and primary `#5D7EFF`), toggled from the footer and saved in `localStorage`. **None of these values are in the palette.** Ship **light only** for now: keep the `:root.dark` block structure in the CSS so it can be added later, but do not render the theme toggle until dark-theme colours are approved.

---

## 5. Layout, spacing and grid

| Token / rule | Value |
|---|---|
| `--wrap` (content width) | `1200px` |
| `--gutter` (side padding) | `clamp(16px, 4vw, 32px)` |
| Section padding (`.sec`) | `padding-block: clamp(72px, 10vw, 132px)` |
| Adjacent sections | the second one sets `padding-top: 0` (e.g. `#landscape`), or a reduced `clamp(40px, 6vw, 72px)` |
| Section head (`.sec-head`) | grid, gap 18px, max-width 760px, margin-bottom `clamp(40px, 5vw, 64px)`; `.center` variant centres it |
| Hero padding | `clamp(56px, 8vw, 104px)` top, 0 bottom; stage margin-top `clamp(48px, 6vw, 72px)` |
| Band (`.band`) | inset `margin-inline: clamp(0px, 1.5vw, 20px)`, `border-radius: clamp(0px, 2.5vw, 32px)`, `overflow: hidden` |
| Footer | `padding-block: 64px 36px`, top border, `margin-top: clamp(40px, 6vw, 80px)` |
| Body | `overflow-x: hidden` (no horizontal scroll at any width) |

**Grids**

| Grid | Columns (desktop) | Gap |
|---|---|---|
| `.pgrid` products | `repeat(2, minmax(0,1fr))` | 16px |
| `.sgrid` solutions | `repeat(3, …)` | 16px |
| `.ent` enterprise | `repeat(3, …)`, 1 px gap on a border-coloured background (draws dividers) | 1px |
| `.bento` | `repeat(6, …)`; boxes span 2 / 3 / 4 | 14px |
| `.ams-top` | `1.1fr / .9fr` | 48px |
| `.plat` | `320px / 1fr` | 20px |
| `.layers-wrap` | `.8fr / 1.2fr` | 56px |
| `.en81` | `1fr / 1fr` | 56px |
| `.hw` | `1.05fr / .95fr` | 24px |
| `.intg` | `1fr / 220px / 1fr` | 0 |
| `.f-top` footer | `1.4fr + repeat(5, 1fr)` | 28px |
| `.kpis` / `.zones` (mock UI) | `repeat(4, …)` | 10px |

Always use `minmax(0, 1fr)` (not `1fr`) so long words never force overflow.

---

## 6. Shape, borders, elevation and textures

| Token | Value | Used for |
|---|---|---|
| `--r-sm` | 8px | small elements, nav buttons |
| `--r` | 12px | panels, attribute tiles |
| `--r-lg` | 18px | **cards** (`.pcard`, `.scard`, `.icol`, `.feature-xp`) |
| `--r-xl` | 24px | large panels (stage, platform panel, hardware hero, enterprise grid) |
| Buttons | 10px (small 9px) | `.btn` |
| Pills / chips | 999px | `.announce`, `.chip`, `.badge`, `.theme-toggle` |
| Icon tiles | 9–10px | `.dd-ico`, `.pi` |

- **Borders:** always 1px solid `--border` / `--border-2`. Hairlines separate content; no heavy boxes.
- **Shadows:** only `--shadow` (rest) and `--shadow-lg` (hover, dropdowns, hero stage). Both two-layer, navy-tinted, never black.
- **Hero texture:** `.hero::before`, a 64px square line grid in `--grid`, masked with `radial-gradient(ellipse 70% 60% at 50% 30%, #000 30%, transparent 75%)`. `.hero::after`: a 1100×700 px radial glow of the primary colour at 16 %.
- **Card image well texture:** `.pcard .viz::before`, an 18px dot grid (`radial-gradient(var(--grid) 1.2px, transparent 1.2px)`).
- **Band texture:** 56px line grid fading out top to bottom.
- **Stage frame:** 40px grid behind the diagram.

---

## 7. Components

| Component | Spec |
|---|---|
| **Button** `.btn` | inline-flex, gap 8px, **height 44px**, padding-inline 18px, radius 10px, 15px/500. Icon 16px slides `translateX(3px)` on hover. Variants: `.btn-primary` (ink fill, bg-colour text; hover lift −1px + shadow), `.btn-accent` (primary fill, white), `.btn-ghost` (1px border-2, surface fill, ink text; hover border ink-2), `.btn-sm` (36px, 14px, radius 9px) |
| **Link with arrow** `.link-arrow` | 14px/500, 15px arrow that slides 3px on hover |
| **Eyebrow** `.eyebrow` | Mono 12px, uppercase, .09em, muted, 6px square marker (Signal Blue) |
| **Announcement pill** `.announce` | Pill with border + shadow, 13.5px; inner `.pill` (mono 11px uppercase, soft fill) + truncating text + arrow |
| **Chip** `.chip` | Mono 12px, padding 4×10px, pill, border, small 6px status dot |
| **Token** `.tok` | 36px tall, radius 9px, border; `.m` mono variant; `.hl` highlighted variant (primary text, soft fill) |
| **Product card** `.pcard` | Flex column, border, radius 18px, overflow hidden. **Image well** `.viz` 230px (200px ≤640px), surface-2 fill, dot grid, bottom border. **Body** 24px padding, gap 12px: `.top` row (kicker + H3 left, 36px round "go" arrow button right, arrow rotated −45° → 0° on hover), muted 15px text, `.models` chip row at the bottom. **Hover:** lift −3px, `--shadow-lg`, border-2 |
| **Model chip** `.models span` | Mono 11.5px, padding 3×8px, radius 6px, surface-2 fill, border |
| **Solution card** `.scard` | Border, radius 18px. `.scene` 190px with gradient, a floating mini-UI card (`.ui`) and a 170px background line icon (`.big`) that scales and turns primary-tinted on hover. Body 22px padding |
| **Benefit grid** `.ent` | 3 columns, cells padded 28px, 1px dividers via grid gap on a border-coloured background, radius 24px outer; cell = icon 22px → H3 1.08rem → 14.5px muted text → optional mono note |
| **Bento box** `.bx` | Border, radius 18px, padding 22px, column flex; `.hero-bx` gradient variant with large H3; `.sipline` mono code block |
| **Layer card** `.layer` | Grid `150px / 1fr`, radius 18px, shadow; node pills inside; hover slides 6px right |
| **Line-up list** `.lineup .row` | Grid `40px / 1fr / auto`, 14×16px padding, row dividers, hover fill; `.badge` (mono 11px pill, soft primary) |
| **Attribute tiles** `.attrs` | 3 columns of bordered 12px-radius tiles: icon → bold label |
| **Vendor column** `.icol` + `.vendor` | Mono uppercase column title; vendor rows: 28px logo tile (2-letter mono), name, right-aligned status label with dot; hover border primary |
| **Feature row** `.feature-xp` | Bordered row: 48px dark icon tile + title + small text, CTA on the right |
| **Platform switcher** | `.plat-list button` (icon tile 40px + title + subtitle; selected = surface + border + shadow, icon tile inverts to ink); `.plat-panel` = 280px visual + text with 2-column check list |
| **Mock console** `.app` | Browser-style bar with URL pill and "Example data" badge; 210px sidebar; tabs (`role=tab`, `aria-selected`); KPI tiles; data table (`table.t`, mono uppercase headers, `min-width:520px` inside `.tbl-wrap` scroll container); status pills `.st`; live log; call rows with audio meters; PA zone tiles |
| **Tabs** `.tabs` | Segmented control: bordered container, buttons 6×12px, selected = white fill + small shadow |
| **Table** `table.t` | 12px; header mono 10.5px uppercase; cell padding 9×12px; row dividers; hover row tint |
| **Dropdown** `.dd` | Absolute, radius 16px, border, `--shadow-lg`, padding 10px; opens with fade + `translateY(-6px → 0)` in .18s; an invisible 12px bridge (`::before`) keeps hover alive |
| **Mobile menu** `.mnav` | Fixed full-screen, `<details>` accordions (20px/600 summaries, chevron rotates), sub-links with icons, 50px full-width CTA buttons, body scroll locked while open |
| **Footer** | Brand column (logo 28px, blurb max 34ch, social icon buttons); 5 link columns (mono uppercase titles, 14px links turning primary on hover); bottom bar 13px muted |
| **Theme toggle** `.theme-toggle` | Pill button with moon/sun icon (not shipped, see §4.6) |

---

## 8. Icons

- **Style:** 24×24 viewBox line icons; `fill:none; stroke:currentColor; stroke-width:1.6; stroke-linecap:round; stroke-linejoin:round`. Default size 20px (`.ic`); 14–22px in context.
- **Usage:** `<svg class="ic"><use href="#i-intercom"/></svg>`. Colour comes from `color`.
- **Symbols (42):** `i-arrow, i-chev, i-search, i-menu, i-close, i-intercom, i-speaker, i-server, i-spark, i-camera, i-elevator, i-phone, i-shield, i-building, i-plug, i-wave, i-cloud, i-fog, i-chip, i-car, i-lock, i-home, i-brief, i-siren, i-rec, i-cross, i-monitor, i-ha, i-check, i-code, i-layers, i-grid, i-bell, i-users, i-info, i-mail, i-scale, i-fire, i-moon, i-sun, i-in, i-play`
- Copy the `<symbol>` definitions verbatim from the prototype (top of `<body>`). Do not mix in filled or third-party icon sets.

---

## 9. Motion

| Kind | Spec |
|---|---|
| Hover transitions | `.15–.25s ease` on background, border, colour, transform, shadow |
| Card hover | `translateY(-3px)` + `--shadow-lg` |
| Arrow nudge | `translateX(3px)` |
| Scroll reveal | `.rv` elements below the first screen start as `.pre` (`opacity:0; translateY(22px)`) and animate in over `.8s cubic-bezier(.2,.7,.2,1)` when they intersect; stagger classes `.d1/.d2/.d3` = 80/160/240 ms delays |
| Theme switch | `html.theming *` transitions colours for .35s (not shipped) |
| **Keyframes (15)** | `pulse` (live dot ring), `flow` (dashed SVG line movement), `vflow` (vertical dashed line), `marq` (marquee, 48s linear, pauses on hover), `vin` (view fade-in), `lin` (new log row), `wave` (speaker waves), `sync` (HA bar), `hbeat` (heartbeat line), `ride` (lift car), `up` / `down` (layer pipes), `slide` (hub wires), `blink` (LED), `ring` (CTA rings, 6s) |
| Reduced motion | `@media (prefers-reduced-motion: reduce)`: all animation and transition durations → .001ms, reveal disabled, marquee stopped. JS also checks `matchMedia('(prefers-reduced-motion: reduce)')` and skips timers |

---

## 10. JavaScript behaviour (vanilla, one IIFE)

| Feature | Behaviour |
|---|---|
| Nav border | Adds `.scrolled` to `#nav` when `scrollY > 8` (passive scroll listener) |
| Desktop dropdowns | Click toggles on any device; on fine pointers (`(hover:hover) and (pointer:fine)`) also opens on `mouseenter` and closes 140 ms after `mouseleave`. Only one open. Click outside or **Escape** closes. Keeps `aria-expanded` in sync |
| Mobile menu | `#burger` opens `#mnav` (`.open`, `aria-hidden=false`, body `overflow:hidden`); `#mclose`, any link, or Escape closes it |
| Marquee | Duplicates the track's children for a seamless loop; duplicates get `aria-hidden="true"` |
| Console tabs | `[role=tab]` buttons switch `.view.on` by `data-view` |
| Audio meters, call timers, live log | Demo animations for the mock console (skipped under reduced motion) |
| Platform switcher | Builds tab buttons from a data array; renders the panel; auto-advances every 6 s once 40 % visible (IntersectionObserver); stops on hover or manual click; on <1024px scrolls the selected tab into view |
| Scroll reveal | IntersectionObserver with `rootMargin` bottom offset; only elements initially below 92 % of the viewport are hidden |
| Theme toggle | Toggles `html.dark`, saves to `localStorage` (try/catch), updates label and `aria-pressed` (not shipped, §4.6) |
| "/" shortcut | Focuses the search pill (visual only; real search to be implemented) |

Mock-console scripts (meters, timers, log, platform data) are **demo only**. Replace them with real product screenshots, or keep them clearly labelled "Example data".

---

## 11. Responsive behaviour

| Breakpoint | Changes |
|---|---|
| ≤ 1180px | Search pill collapses to icon; Platform dropdown 620px |
| ≤ 1024px | Desktop menu + ghost CTA + search hidden, **burger shown**; two-column blocks stack (`.ams-top`, `.en81`, `.layers-wrap`, `.hw`, `.plat`); platform list becomes a horizontal scroller (subtitles hidden); solutions 3→2; console sidebar hidden, KPIs 4→2; footer 6→3 columns (brand full width); integrations stack with a vertical dashed connector; bento boxes span 3 |
| ≤ 768px | Products 2→1; console split → 1; zones 4→2; hero SVG diagram replaced by the 2-column list (`.eco-m`); strip label above marquee; platform bullets 1 column; layers 1 column, pipes hidden; enterprise 3→1; bento 1 column; band radius 20px, margin 8px |
| ≤ 640px | **Logo 26px**; footer bottom row stacks; solutions 1 column; footer 2 columns; hero buttons full width; product image well 200px; callouts hidden; attributes 1 column |
| ≤ 480px | KPIs tighter (18px numbers); zones 1 column; mobile ecosystem list 1 column |

Test at **1440, 1024, 768, 390px**. No horizontal page scroll at any width; wide tables scroll inside `.tbl-wrap`.

---

## 12. Logo (Archive.zip)

### 12.1 Contents of `Archive.zip`

| File | Content | Use |
|---|---|---|
| `MORazon2027MN-01.svg` | Deep Navy wordmark + Graphite tagline, transparent | Default lock-up on light |
| `MORazon2027MN-02.svg` | White wordmark + Comm. Cyan tagline on Deep Navy | Dark hero / banner |
| `MORazon2027MN-03.svg` | White wordmark + Ice Blue tagline on Slate Navy | Dark sections |
| `MORazon2027MN-04.svg` | White wordmark + Ice Blue tagline on Electric Blue | Brand-moment backgrounds |
| `MORazon2027MN-05.svg` | Ice Blue wordmark + Comm. Cyan tagline on Graphite | Large sizes only (tagline contrast 2.1:1) |
| `MORazon2027MN-06.svg` | Symbol only, Deep Navy | Favicon, app icon, small sizes |
| `MORazon2027MN.pdf` / `.ai` | All artboards / Illustrator master | Print / designer |

Ignore the `__MACOSX/` folder in the ZIP (macOS metadata).

### 12.2 Two things the agent must handle

1. **The lock-up SVGs (01–05) have background panels and live-text taglines.** Each file has a full artboard (viewBox `0 0 4980.23 2461.37`) with lots of empty space; 02–05 include a background `<rect>`; the tagline "OPEN CRITICAL COMMUNICATION" is a `<text>` element in Geist Mono (it falls back to another font if Geist Mono is not loaded).
2. **There is no wordmark without tagline.** The header and footer need one.

**Ready-made files in `logo-web/` (use these):**

| File | From | Use |
|---|---|---|
| `MORazon-wordmark-navy.svg` | `MORazon2027MN-01.svg` | Header and footer on light backgrounds |
| `MORazon-wordmark-white.svg` | `MORazon2027MN-02.svg` | Header and footer on dark backgrounds |
| `MORazon-symbol-navy.svg` | `MORazon2027MN-06.svg` | Favicon, app icon, small sizes |

They were produced exactly as described below and checked by rendering them against the originals. When the designer delivers official exports from `MORazon2027MN.ai`, those replace these files.

**How they were made** (repeat this for other colour variants):

- Take `MORazon2027MN-01.svg` (navy) or `-02.svg` (white).
- Remove the `<text>` element (tagline), the background `<rect>` and the unused font style class.
- **Do not change any `<path>`.**
- Set the `viewBox` to the bounding box of the remaining paths (measured: `920.57 667.10 3124.71 709.00`, ratio ≈ 4.41:1).
- Add `role="img" aria-label="MORazon"`.
- For the symbol, crop `MORazon2027MN-06.svg` the same way (measured viewBox `2093.62 880.19 792.97 701.01`).
- Each file carries a comment stating its origin.

### 12.3 Logo rules

| Rule | Value |
|---|---|
| Header height | **26px** desktop, 24px tablet, **22px** mobile (the prototype uses 30/26px: don't copy that) |
| Footer | 22–28px |
| Minimum | 16px tall; below that use the symbol |
| Clear space | ½ of the cap height on every side |
| Dark backgrounds | use the **white** SVG, never `filter: invert()` (remove the prototype's `--logo-filter`) |
| Lock-up with tagline | only when the wordmark is ≥ 72px tall |
| Markup | `<a class="brand" href="/" aria-label="MORazon home"><img src="/assets/logo/MORazon-wordmark-navy.svg" alt="MORazon" height="26"></a>` |
| Favicon | from the symbol (SVG favicon + PNG fallbacks) |

The prototype's embedded logo (a 623×136 px base64 PNG reading "S │ MORazon", used three times) is **obsolete**. Remove it.

---

## 13. Accessibility (keep and extend)

**Already present in the prototype:**
- `:focus-visible` outline
- `aria-expanded` on menu buttons and burger, `aria-hidden` on the mobile menu, `role=tab` / `aria-selected` on tabs, `aria-pressed` on the theme toggle
- `aria-label`s on the logo link, search, social links and the strip section
- Duplicated marquee items hidden from assistive technology
- Reduced-motion support

**Add:**
- Real `<nav>` landmark with `aria-label`; skip-to-content link
- `alt` text on every image
- Keyboard arrow navigation in dropdowns and tabs (Escape already works)
- Contrast ≥ 4.5:1 for all text (§4.1)
- Visible labels for icon-only buttons
- `lang` per page

---

## 14. Do not copy from the prototype

| Item | Why |
|---|---|
| All visible text: headings, descriptions, product and model names (J-762C-1, UC800, jNode…), integration names, "First AMS" claims, menu items, footer links | Placeholder content from the old MORazon.com; partly incorrect for CS3. Use the approved CS3 marketing documents |
| Links to `https://MORazon.com/...` | Old site URLs; build the new IA |
| Base64 logo PNG and `--logo-filter` | Obsolete logo (§12) |
| Orange `--signal` and all other off-palette values | Replaced by §4.2 |
| Dark theme and toggle | Not approved (§4.6) |
| Mock console data ("Example data"), fake timers and logs | Demo only; replace with real, sanitized product screenshots, or keep labelled |
| Search pill and "/" shortcut | Visual only; needs a real search or removal |
| CSS-drawn hardware (`.dev-intercom`, `.rack`, `.jnode`, `.horn`) | Placeholders for real product photography |

---

## 15. Implementation checklist

- [ ] Fonts Geist + Geist Mono loaded (or self-hosted); fallbacks set
- [ ] `tokens.css` uses the values from Appendix A; no HEX values in component CSS
- [ ] No orange, no status colours on marketing pages; contrast rules respected
- [ ] Logo from `logo-web/` (§12.2), correct heights, no filters; old PNG removed
- [ ] Section patterns and class names follow §2 and §7
- [ ] Icon sprite copied verbatim (§8)
- [ ] Motion and reduced-motion handling as §9; JS behaviours as §10 (minus demo scripts)
- [ ] Breakpoints as §11; no horizontal scroll at 390px
- [ ] Accessibility items of §13
- [ ] No prototype text, product names or old URLs (§14)
- [ ] Checked at 1440 / 1024 / 768 / 390px in at least Chromium and one other browser

---

## Appendix A: `tokens.css` (palette-mapped, light theme)

```css
:root{
  /* Approved palette */
  --sz-deep-navy:#041C2B; --sz-electric-blue:#1F3FE6; --sz-comm-cyan:#00A8F4; --sz-signal-blue:#1476FF;
  --sz-slate-navy:#0A3348; --sz-graphite:#676767; --sz-silver:#D8D8D8; --sz-ice-blue:#EAF7FF; --sz-white:#FFFFFF;

  /* Prototype token names, mapped to the palette */
  --bg:var(--sz-white); --surface:var(--sz-white); --surface-2:var(--sz-ice-blue);
  --ink:var(--sz-deep-navy); --ink-2:var(--sz-slate-navy); --muted:var(--sz-graphite);
  --border:var(--sz-silver); --border-2:var(--sz-silver);
  --primary:var(--sz-electric-blue); --primary-ink:var(--sz-white); --primary-soft:var(--sz-ice-blue);
  --signal:var(--sz-signal-blue); --signal-text:var(--sz-electric-blue); --signal-soft:var(--sz-ice-blue); --on-signal:var(--sz-white);
  --grid:rgba(4,28,43,.06);
  --shadow:0 1px 2px rgba(4,28,43,.05),0 8px 24px -10px rgba(4,28,43,.10);
  --shadow-lg:0 2px 4px rgba(4,28,43,.04),0 30px 60px -24px rgba(4,28,43,.20);

  --band:var(--sz-ice-blue); --panel:var(--sz-white); --panel-2:var(--sz-white); --panel-3:var(--sz-ice-blue);
  --panel-line:var(--sz-silver); --panel-line-2:var(--sz-silver);
  --panel-ink:var(--sz-slate-navy); --panel-mute:var(--sz-graphite); --panel-strong:var(--sz-deep-navy); --panel-dim:var(--sz-graphite);
  --panel-grid:rgba(4,28,43,.05); --panel-dot:rgba(4,28,43,.09); --panel-sunk:var(--sz-ice-blue);
  --panel-shadow:0 1px 2px rgba(4,28,43,.04),0 40px 70px -34px rgba(4,28,43,.28);
  --hub-a:var(--sz-white); --hub-b:var(--sz-ice-blue); --hub-line:color-mix(in srgb,var(--sz-electric-blue) 30%,var(--sz-white));
  --hub-glow:rgba(31,63,230,.22); --glow:rgba(31,63,230,.10); --glow-2:rgba(0,168,244,.10);
  --wire:var(--sz-silver);
  --p-primary:var(--sz-electric-blue); --p-signal:var(--sz-comm-cyan);

  /* NOT APPROVED: only for a labelled product-UI mock-up (see §4.4) */
  --candidate-ok:#12924A; --candidate-warn:#B87000; --candidate-err:#D02A2A;

  /* Type */
  --f-display:"Geist",ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;
  --f-body:var(--f-display);
  --f-mono:"Geist Mono",ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;

  /* Shape and layout */
  --r-sm:8px; --r:12px; --r-lg:18px; --r-xl:24px;
  --wrap:1200px; --gutter:clamp(16px,4vw,32px);
  color-scheme:light;
}
```

In component CSS, replace every place where `--signal` colours **small text** (`.announce .pill`, `.dd-feature .tag`, `.sample`) with `--signal-text`.

## Appendix B: base rules to copy from the prototype

```css
*,*::before,*::after{box-sizing:border-box}
[hidden]{display:none!important}
html{scroll-behavior:smooth;-webkit-text-size-adjust:100%}
body{margin:0;background:var(--bg);color:var(--ink);font-family:var(--f-body);font-size:16px;line-height:1.6;-webkit-font-smoothing:antialiased;overflow-x:hidden}
a{color:inherit;text-decoration:none}
button{font:inherit;color:inherit;background:none;border:0;cursor:pointer;padding:0}
svg{display:block}
.ic{width:20px;height:20px;fill:none;stroke:currentColor;stroke-width:1.6;stroke-linecap:round;stroke-linejoin:round;flex:none}
:focus-visible{outline:2px solid var(--sz-signal-blue);outline-offset:3px;border-radius:6px}
.wrap{max-width:var(--wrap);margin-inline:auto;padding-inline:var(--gutter)}
.mono{font-family:var(--f-mono)}
.eyebrow{font-family:var(--f-mono);font-size:12px;letter-spacing:.09em;text-transform:uppercase;color:var(--muted);display:inline-flex;align-items:center;gap:10px}
.eyebrow::before{content:"";width:6px;height:6px;border-radius:2px;background:var(--signal)}
h1,h2,h3,h4{font-family:var(--f-display);margin:0;text-wrap:balance;color:var(--ink)}
h2{font-size:clamp(2rem,4.2vw,3.35rem);line-height:1.05;letter-spacing:-.035em;font-weight:600}
h3{font-size:1.25rem;line-height:1.25;letter-spacing:-.015em;font-weight:600}
p{margin:0}
.lead{font-size:clamp(1.02rem,1.4vw,1.15rem);color:var(--muted);max-width:62ch}
.sec{padding-block:clamp(72px,10vw,132px);position:relative}
.sec-head{display:grid;gap:18px;max-width:760px;margin-bottom:clamp(40px,5vw,64px)}
.sec-head.center{margin-inline:auto;text-align:center;justify-items:center}
```

Almost every other component rule can be copied from the prototype's `<style>` block **unchanged**, because it only references tokens. The token values above do the re-branding. Exceptions, which contain hard-coded colours:
- **CSS product drawings:** `.dev-intercom*`, `.ru*`, `.horn .spk*`, `.jnode *`, `.cam`, `.phone*`, `.qr*`. They are placeholders; replace them with real product images (§14).
- **`.wavebar i`:** gradient end `#3a54c4`. Use `var(--primary)`.
- **`.btn-accent`:** `color:#fff`. Use `var(--primary-ink)`.
- **Mask gradients** (`.hero::before`, `.marquee`, `.band::before`, `.hw-hero::before`): `#000` inside `mask-image` only controls opacity, not visible colour, so it can stay.
