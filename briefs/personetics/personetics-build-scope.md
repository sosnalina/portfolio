# Personetics article — build scope (living doc)

Status: scoping, not sent to Claude Code. Next session (fresh token limit) goes deep into each visual with Figma specs, then splits into Claude Code tasks — parallel agents where files don't collide (see §2).

Last updated: 26 Oct 2026

---

## 1. Locked decisions

### Colors (26 Oct — replaces the 22 Oct pink decision; no pink anywhere in this article)
| Token | Hex | Use |
|---|---|---|
| `--primitive-red` | #E5071A | Section-header badge on beige sections |
| `--primitive-red-dark` | #871105 | Section-header badge on white sections |
| `--primitive-beige` | #F2F2F2 | Section background, used where Bill Pay uses grey-light. Hadar's name for it is beige — keep the name. |

Source: Hadar, 26 Oct. Bill Pay is unchanged.

### Badge rule
- Section white → badge **dark red**
- Section beige → badge **red**
- Badge number text: **white** on both. (Differs from Bill Pay → the theme sets badge text colour as well as background.)

### Article
- Same section templates, text styles and rules as Bill Pay. Only the colors differ.
- Illustrations and visuals are Hadar's assets.
- Hero: standalone, empty for now, **beige** background. Not part of the alternation (may join it later — undecided).
- Paragraphs around each visual are split into separate body blocks, so each gap marks the visual's spot.
- Text is verbatim from the Personetics project (the workbench). "Lorem ipsum" headings are temporary placeholders.
- `#` = section heading, `##` = subheading (Bill Pay pattern).

### Section order and backgrounds (26 Oct)
Alternation starts at section 01 with white.

| # | Heading / subheading | Background | Badge | Visuals |
|---|---|---|---|---|
| Hero | (empty) | beige | — | — |
| 01 | Sleeping giants / Context | white | dark red | Cognitive banking diagram (§1b); Engage first generation (not discussed yet) |
| 02 | Growing pains / Measuring success (see workbench sync) | beige | red | Danny figure + speech bubble (§1b) |
| 03 | How useful was this insight? / Inflection Point | white | dark red | — |
| 04 | Mind the gap / Discovery & Problem Definition | beige | red | Pain map; Problem statement (§1b) |
| 05 | The yet to come / Product Strategy | white | dark red | Financial journey with the engine (not discussed yet) |
| 06 | Lorem ipsum (temp) / Principles & Execution | beige | red | Design principles; Condensed dashboard (not discussed yet) |
| 07 | Impact & Postmortem | — | — | Not written yet. Not built. |

Heading 01 confirmed "Sleeping giants" (workbench), not "The sleeping giants" as in the Figma image.

### Temporary landing page
- Site root `/`, which has no page today.
- Two plain links: Bill Pay, Personetics. Unstyled; it gets designed later.
- Navigation back is the browser back button.

### CLAUDE.md change: two task types (agreed 22 Oct)
- **Composition task:** built only from existing partials, classes and tokens, plus supplied content. No Figma needed. If anything isn't covered by what exists → STOP and ask, never fill the gap.
- **New-structure task:** anything new (component, visual, chart, illustration layout, widget). Needs a Figma node or an approved reference artifact whose code is in the prompt.
- The Forbidden-behaviors line about the Figma frame gets extended to cover composition tasks.

### Two-project split
- Personetics text edits happen in the Personetics project (workbench), not here. Bill Pay text edits still happen here.

### Definition of done for the first build (foundation page) — updated 26 Oct
- **What you'll look at:**
  - `/case-studies/personetics/` — beige hero plus 6 sections, right background and badge on each.
  - `/case-studies/bill-pay/` — looks exactly as today (safety check for the shared CSS change).
  - `/` — two links that open each article; browser back returns here.
- **The number that matters:** badges 01–06, three dark red (01, 03, 05) and three red (02, 04, 06), white numbers on all.
- **Out of scope:** visuals, Impact & Postmortem, hero content, landing page design, commit.

---

## 1b. Visuals — captured 26 Oct (high level; drill-down next session)

Phase rule applies to every visual: static first, motion second, gate inside the prompt.

### 01 — Cognitive banking diagram
- **Placement:** between body paragraphs 2 and 3 of section 01.
- **Tag:** top-left dark pill, white text, placeholder "Headline headline headline". **Duplicate** the Bill Pay design-principles tag (Volume / Productivity / Quality).
- **Red shape:** stepped isometric block, red and dark-red faces. **Hadar exports as SVG.** Placement from her Figma artboard (Claude Code reads the artboard node via MCP for coordinates/spacing only).
- **Three B&W photo cut-outs:** lighthouse (top block), compass (right), cable reel/winch (lower-left block). Hadar exports.
- **Three callouts** — title, short red rule, grey body text, red keyword line with middle-dot separators:
  - Data (left): Ingest · Clean · Categorize
  - Insight (top right): Proactive · Real-time · Approachable
  - Logic (lower right): Track · Detect · Rank
- **Leader lines:** thin grey lines connecting each callout to its object/mesh.
- **Meshes:** grey dots joined by thin lines around each object. One component, reused rotated/flipped.
- **Motion:** mesh dots drift slightly (purpose: delight). Everything else static. Mechanism OPEN (see §3).

### 02 — Danny figure + speech bubble
- **Speech bubble:** white organic blob inside section 02, tail pointing down-left to the figure. Quote in italic serif ("Counting clicks won't tell you how well the experience you've built delivers. Knowing whether customers acted on it will." — final text from workbench).
- **Figure:** B&W photo cut-out of a seated man; head replaced by a red asterisk shape; mesh around the head.
- **Placement:** sits on the boundary between 02 and 03 — torso in 02, legs hang into 03, feet just above the 03 badge. In Figma he's outside the auto-layout artboard (Figma limitation).
- **Technical (Claude's call):** anchored to the bottom edge of section 02, overflows into 03, static paint order in front of 03. Position measured against 02's bottom edge.
- **Leg motion:** relaxed swing, like sitting on a fence. NOT anxious. Communicates an informal CTO who sits on tables. Slow, pendular, easing at each end; fast/small/even jiggle reads as anxiety. Perspective matters: swinging forward, the shin foreshortens and the shoe tilts toward the camera (more sole/toe); swinging back, the shin lengthens and the heel shows. Cut at mid-thigh (static thigh in every frame hides the seam); pivot at the knee. Speed and amplitude picked by eye from a playable comparison. Technique OPEN (see §3).
- **Head mesh:** same component and same motion as the 01 diagram.

### 04 — Pain map (interactive)
- **Placement:** between body paragraphs 1 and 2 of section 04.
- **Structure:** placeholder headline "headline headline" (small bold serif) + full-width rule → tabs Spend / Plan / Save → rule → two columns:
  - Left: tab illustration (Save = stacked rings with coins), large stat ("47%") + label ("Can't last three months on savings").
  - Vertical divider.
  - Right: three rows separated by rules, each with stat ("90%"), label ("Keep ending up back at zero", placeholder) and a dark-red circular + button. Bottom rule.
- **Tabs:** **duplicate** the cockpit widget toggle mechanism, resized, extended from 2 to 3 states. Selected = dark-red pill, white text, on a white track. On load: **Spend** selected.
- **Accordion:** + expands its row. Mechanism follows Hadar's Figma auto layout (two keyframes: collapsed, expanded).
- **Each tab has its own illustration.** Tab-switch and illustration motion = phase 2.
- **Starting point:** existing workbench artifact in this project (accordion movement + content; no headline, older visuals). Find it at drill-down.

### 04 — Problem statement
- **Placement:** last element of section 04, after body paragraph 3.
- Large red curly braces left and right frame six italic serif statements, each with a bold italic lead-in: I am a / I'm trying to / But / Because / Which makes me feel / In an ideal world. Text from the locked version in the project, not the image.
- **Entrance on viewport entry:** direction = braces-open family. The starting keyframe should be more creative than "braces centred, then open" (Hadar's example: starts as a circle). Claude to offer several starting-keyframe options as a playable comparison.

---

## 2. Technical approach (Claude's call) — updated 26 Oct

- New primitives in `tokens.css`: `--primitive-red`, `--primitive-red-dark`, `--primitive-beige`.
- Page theme class on Personetics' `<main>` sets `--theme-badge-bg: var(--primitive-red-dark)` and `--theme-badge-text` (white token).
- `header.css` badge reads `background: var(--theme-badge-bg, var(--primitive-green-light))` and `color: var(--theme-badge-text, <current Bill Pay value>)`. No theme → Bill Pay unchanged.
- New `.section--beige` modifier sets the beige background and overrides `--theme-badge-bg` to `var(--primitive-red)` locally. Body text on beige mirrors whatever grey-light does (check at split day). Placed after `.section--hero` (order matters: hero carries both classes).
- No pink modifier any more.
- New page `case-studies/personetics/index.njk` composed from `section()` + `sectionHeader()` + `sectionBody()`.
- New `index.njk` at repo root for the landing page.

### Parallel agents (next session)
- **Foundation first, single agent:** shared CSS + tokens + page with text. Everything touches shared files, so parallel agents would collide.
- **Then visuals in parallel**, each in its own files (partial + CSS + JS): cognitive banking diagram, Danny figure, pain map, problem statement. Integration into `index.njk` done by one agent afterwards, sequentially.
- Each agent still stops at its own phase 1 (static) gate. Hadar's browser QA is the bottleneck, not code generation.
- Repo restructure (§3a) before Personetics adds asset files.

Repo facts checked on 22 Oct (re-check on split day):
- Branch `feature/build-step-partials`, remote head `1eaa88f`.
- No root `index.njk` exists.

---

## 3. Open / to add

### Blocking specific visuals
- **Mesh motion** (01 diagram + 02 head): Hadar looks for a reference. If none, Claude builds a playable comparison in a fresh chat. Includes whether leader-line ends follow a drifting dot.
- **Leg technique** (02): test = 3 frames from Figma/Nano Banana (both swing ends + middle) → Claude builds a quick playable loop → Hadar decides. Alternative if frames flicker: image-to-video (same first/last frame), Claude Code extracts frames → background removal → sprite. Delivery: sprite (stop-motion) vs video (smooth, needs WebM + HEVC alpha) — undecided.
- **Problem statement entrance:** starting-keyframe options to offer.
- **Pain map drill-down:** find the workbench artifact; per-tab content; expanded state from Figma keyframes; per-tab illustrations and motion.
- **Exports from Hadar:** red shape SVG; lighthouse, compass, reel cut-outs; Danny figure; Figma artboard nodes for each visual.

### Workbench text sync (Hadar, in the Personetics project — remind her)
- 02 subheading: "Zero to N" → "Measuring success"
- 02 paragraph 2 reworded (star rating version)
- 02 quote moved into the speech bubble; check whether "Makes sense…" / "I believe we can." lines stay
- 04 subheading capitalisation: "Problem definition" vs "Problem Definition"

### Not yet discussed
- Engage first generation visual (01), Financial journey (05), Design principles + Condensed dashboard (06)
- Hero design and content; TL;DR block under hero
- Impact & Postmortem content; final headings for 06 and 07
- Landing page design
- Docs to update when this ships: `SITE-ARCHITECTURE.md` (Personetics "not started"); `COMPONENT-MAP.md` (beige modifier, theme)

---

## 3a. Repo restructure — do BEFORE Personetics adds files (proposed 22 Oct, Claude's call)

Base stays type-first (`css/`, `js/`, `assets/`, `_includes/`). Inside each type folder, everything goes case-study-first.

| Today | Problem | Target |
|---|---|---|
| `js/bill-pay/`, `css/widgets/bill-pay/` | ✓ already case-study-first | keep; add `personetics/` alongside |
| `assets/walkthrough/bill-pay/`, `assets/scene-gallery/bill-pay/`, `assets/accordion-gallery/bill-pay/`, `assets/mock-screen/bill-pay/`, `assets/icons/bill-pay-mock/` | widget-first, opposite of CSS/JS | `assets/bill-pay/{walkthrough, scene-gallery, …}`; `assets/personetics/…` |
| `assets/illustrations/bill-pay/` | separate tree | `assets/bill-pay/illustrations/` |
| Root: `cockpit-widget.html`, `walkthrough-gallery.html`, `accordion-gallery.html`, `bill-pay-mock-screen.html` | loose at root | under `case-studies/bill-pay/` |
| Specs in 4 places | scattered | all in `briefs/{case-study}/` |
| Shared: `assets/fonts`, shared icons, `js/shared`, `js/vendor`, `css/tokens.css`, `css/components/` | ✓ shared | keep |

- Method: Claude Code lists every reference that would break first (as in commit `15440e4`), moves, confirms zero 404s; Hadar QAs Bill Pay.
- WIP checkpoint commit before moving.

Done 28 Oct 2026 (icons flattened to assets/bill-pay/icons/). Follow-up, not done: `_includes/` mixes shared and Bill Pay-only partials; `css/components/ap-manager-orbit.css` is Bill Pay-only inside shared components.

## 3b. Local machine — iCloud (recommended 22 Oct)

Numbered files in `_site/` are iCloud sync-conflict copies. A git repo inside iCloud Drive (`~/Documents/portfolio`) risks the same inside `.git`. Recommendation: move the repo to e.g. `~/Developer/portfolio`, then delete `_site/` and rebuild.

## 3c. Process improvements — approved 22 Oct, written into working-with-hadar.md §21 (+ §17, §18, §19)

## 3d. Other portfolio work to scope (not started)
- Landing page (replaces the temporary two-link page)
- Password gate (not real auth)
- CP case study research — schedule at the start of a week
- Resume and LinkedIn

---

## 4. Draft build prompt — SUPERSEDED (22 Oct, pink version)

Written before the 26 Oct colour change. Colours, badge rules, theme class and section backgrounds in it are now wrong. Rewrite on split day against §1 and §2; Part A (CLAUDE.md task types), Part E (landing page) and the article text in Part D are still the intended content (subject to the workbench text sync in §3). The 22 Oct version is in this doc's history and in the 22 Oct chat.
