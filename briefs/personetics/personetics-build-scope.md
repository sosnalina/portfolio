# Personetics article — build scope (living doc)

Status: scoping, not sent to Claude Code. Next session (fresh token limit) goes deep into each visual with Figma specs, then splits into Claude Code tasks — parallel agents where files don't collide (see §2).

Last updated: 28 Oct 2026

---

## 1. Locked decisions

### Spec placement rule (Hadar, 28 Oct)
- A visual that stays **static forever** (a PNG, plain text) is specced in this doc.
- A visual that will **ever have motion or interaction** gets its own spec file in `briefs/personetics/` from the start, holding both its static and motion spec. This doc only links to it. No value for that visual lives in two places.
- A chat that changes a spec ends with a Claude Code prompt that writes it to the repo. The repo copy is the source of truth; the Claude.ai project copy is a draft. A chat updating this doc changes only its own lines.

### Colors (26 Oct — replaces the 22 Oct pink decision; no pink anywhere in this article)
| Token | Hex | Use |
|---|---|---|
| `--primitive-red` | #E5071A | Section-header badge on beige sections; problem-statement braces (`problem-statement.md`) |
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
- Hero: standalone, empty for now, **beige** background. Not part of the alternation (may join it later — undecided). Reuses `.section--hero` as-is (fixed 1000px, Hadar 28 Oct).
- Paragraphs around each visual are split into separate body blocks, so each gap marks the visual's spot.
- Text comes from the workbench through the text sync (below). "Lorem ipsum" headings are temporary placeholders.
- `#` = section heading, `##` = subheading (Bill Pay pattern).

### Section order and backgrounds (26 Oct)
Alternation starts at section 01 with white.

| # | Workbench id | Heading / subheading | Background | Badge | Visuals |
|---|---|---|---|---|---|
| Hero | — | (empty) | beige | — | — |
| 01 | s1 | Sleeping giants / Context | white | dark red | Cognitive banking diagram (§1b); Engage first generation (not discussed yet) |
| 02 | s2 | Growing pains / Measuring Success | beige | red | Danny figure + speech bubble (§1b) |
| 03 | s4 | How useful was this insight? / Inflection Point | white | dark red | — |
| 04 | s5 | Mind the gap / Discovery & Problem Definition | beige | red | Pain map (§1b); Problem statement (`problem-statement.md` — static spec complete, ships with the foundation build) |
| 05 | s6 | The yet to come / Product Strategy | white | dark red | Financial journey with the engine (not discussed yet) |
| 06 | s6b | Lorem ipsum (temp) / Principles & Execution | beige | red | Design principles; Condensed dashboard (not discussed yet) |
| 07 | s7 | Impact & Postmortem | — | — | Not written yet. Not built. |

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

### Text sync — contract v2 (Hadar, 28 Oct)
How Personetics text gets from the workbench to the site. This section is the only copy of the contract; the Personetics project holds only the paste block below.

**Source (read by Portfolio, never by Claude Code):**
- Artifact "Engage Skeleton Workbench", `https://claude.ai/code/artifact/26d81199-f92c-460f-8f8a-29cb932a4829`
- Database collection `skeleton`, doc `current`
- `sections[]` in order = website sections 01–07 (ids in the section table above; ids skip s3, that is expected)
- Per section: `header` = `#`, `title` = `##`, `drafts.<id>.text` = body, used only when `locked: true`. Paragraphs split by blank lines; single line breaks inside a paragraph are intentional.
- `[[VISUAL:name]]` alone in a paragraph = a visual's position. Text inside a visual (quote, persona, diagram tiers) is in the section's `visual` field, marked LOCKED. Only those locked lines sync; the rest of the field is working notes.
- Ignore: `bullets`, `spine`, `meta`, `must`, and everything else in the project.

**Scope:** sections 01–05. 06 (s6b) and 07 stay out until Hadar says so.

**Second source (v2, 28 Oct): Pain Map Workbench.** `https://claude.ai/code/artifact/f696ee9c-3532-4d3b-8fb5-7f3f7f893081`, pain map text only (section 04, `[[VISUAL:painmap]]`). The website takes exactly what that workbench's design frame shows. Read rules and the written format: `pain-map.md` §2. Written into the same `article-text.md`, inside `# 04`. Handoff from its project: "Sync pain map text. Changed: <tabs>." Its paste block is below the article one. The article workbench's paste block is unchanged.

**Target:** `briefs/personetics/article-text.md` in the repo. Portfolio writes it; the page reads its text from it (format and mechanism: §2). Replaced in full on every sync.

**Flow:**
1. Hadar edits and locks text in the workbench.
2. The workbench asks "Sync this to the website?" On yes, it gives a one-line handoff naming what changed.
3. Hadar pastes the handoff here. Portfolio reads the workbench and writes one Claude Code prompt: replace the file, report, STOP.
4. Hadar checks the page in the browser, then the commit (that file only).

**Ownership:**
- Text and visual positions (`[[VISUAL]]` lines) belong to the workbench. If Hadar asks here to add, move or remove a visual, Portfolio sends her to the workbench first.
- Moving a visual or changing text = text only, no build.
- Adding or removing a visual, a section or a heading = structure change: the sync prompt is followed by a build prompt.

**Change control:** any change to the source location, the field layout, the scope or the flow bumps the version. The chat that makes it ends with the repo prompt and a new paste block for the Personetics project. A change to the repo path needs no paste block (the workbench never sees it).

**Paste block given to the Personetics project (v1):**
```
## Website text sync (contract v1)

The portfolio website is built in a separate project, "Portfolio". It reads
this project's article text directly from the Engage Skeleton Workbench. This
project never writes Claude Code prompts and never touches the repo.

### Your one job
After Hadar locks a change to article text, a heading, or a visual's position
([[VISUAL:...]] line), ask once: "Sync this to the website?"
If yes, give her this to paste in Portfolio:

    Sync Personetics text. Changed: <sections, by number and header>.
    Structure: <none | added/removed visual X | added/removed section/heading Y>.

Section numbers = reading order in the sections list, never the id
(3 = s4, 4 = s5, 5 = s6, 6 = s6b, 7 = s7).
Moving a [[VISUAL]] line counts as Structure: none.

### Keep it readable
- Keep article text only in drafts.<id>.text, with locked set correctly.
- Keep [[VISUAL:name]] alone in its own paragraph.
- Text that appears inside a visual goes in the section's visual field, after
  its [[VISUAL:name]] line, marked LOCKED.
- Don't rename section ids or move the article to another artifact without
  telling Hadar it breaks the website sync.

### Push back
Claude Code reports, build questions, CSS, layout, or anything about the repo:
don't act on it. Say in one line: "This belongs in the Portfolio project."
If Hadar pastes a newer "Website text sync" contract, replace this section
with it entirely.
```

**Paste block given to the pain map project (v2):**
```
## Website text sync (pain map)

The portfolio website is built in a separate project, "Portfolio". It reads
the pain map text directly from the Pain Map Workbench. This project never
writes Claude Code prompts and never touches the repo.

### Your one job
After Hadar changes what the workbench's design frame shows (a headline,
a row, a row number, a quote, or "Mine" wording), ask once:
"Sync this to the website?"
If yes, give her this to paste in Portfolio:

    Sync pain map text. Changed: <Spend / Plan / Save>.

### Keep it readable
- The website takes exactly what the design frame shows. "In design" off
  removes something; "Mine" replaces raw wording.
- Each tab must have 2 or 3 rows in design. Tell Hadar if a change breaks that.
- Don't rename tabs, row ids or database fields, or move the workbench to
  another artifact, without telling Hadar it breaks the website sync.

### Push back
Claude Code reports, build questions, CSS, layout, or anything about the
repo: don't act on it. Say in one line: "This belongs in the Portfolio project."
```

### Definition of done for the first build (foundation page) — updated 28 Oct
- **What you'll look at:**
  - `/case-studies/personetics/` — beige hero plus 5 sections (01–05), right background and badge on each.
  - `/case-studies/personetics/` — problem statement as the last element of section 04, overlaid against Figma node `2004:52157`.
  - `/case-studies/bill-pay/` — looks exactly as today (safety check for the shared CSS change).
  - `/` — two links that open each article; browser back returns here.
- **The numbers that matter:**
  - Badges 01–05: three dark red (01, 03, 05) and two red (02, 04), white numbers on all.
  - Problem statement block: 800 × 302px.
- **Out of scope:** sections 06 and 07 (Hadar, 28 Oct: this build stops after 05); every visual except the problem statement; problem-statement motion; Impact & Postmortem; hero content; landing page design; commit.

Decision (Hadar, 28 Oct): the problem statement's static layout ships inside the foundation build, so it appears as soon as the article exists. It is the only visual in that build.

---

## 1b. Visuals — captured 26 Oct (high level; drill-down next session)

Phase rule applies to every visual: static first, motion second, gate inside the prompt. Every visual below except the problem statement still lives here; each moves to its own file (spec placement rule, §1) when its drill-down starts.

### 01 — Cognitive banking diagram
- Full spec (static values and locked motion): **`briefs/personetics/cognitive-banking-diagram.md`**.

### 02 — Danny figure + speech bubble
- Full spec (static values and locked leg motion): **`briefs/personetics/danny-figure.md`**. Quote text comes from the text sync (`[[VISUAL:quote]]` in s2).

### 04 — Pain map
- Full spec (static now, motion later): **`briefs/personetics/pain-map.md`**. Its text comes from the Pain Map Workbench through the text sync (§1, v2).

### 04 — Problem statement
- Full spec (static now, motion later): **`briefs/personetics/problem-statement.md`**. Its text comes from the text sync (`[[VISUAL:persona]]` in s5).

---

## 2. Technical approach (Claude's call) — updated 28 Oct

- New primitives in `tokens.css`: `--primitive-red`, `--primitive-red-dark`, `--primitive-beige`.
- Page theme class `.theme-red` on Personetics' `<main>` sets `--theme-badge-bg: var(--primitive-red-dark)` and `--theme-badge-text` (white token).
- `header.css` badge reads `background: var(--theme-badge-bg, var(--primitive-green-light))` and `color: var(--theme-badge-text, var(--primitive-black))`. No theme → Bill Pay unchanged.
- New `.section--beige` modifier sets the beige background and overrides `--theme-badge-bg` to `var(--primitive-red)` locally. No body-text rule needed (grey-light has none). Placed after `.section--hero` (order matters: hero carries both classes).
- No pink modifier any more.
- New page `case-studies/personetics/index.njk` composed from `section()` + `sectionHeader()` + `sectionBody()`, with its text read from `briefs/personetics/article-text.md` (§1 Text sync).
- Hero: `section("section--hero section--beige")` called directly, with an empty slot. The `hero()` macro isn't used: it hardcodes `section--green-light` and requires a headline.
- `.theme-red` lives in `header.css`, next to the badge rule (today it only sets badge variables).
- Section backgrounds follow reading order: odd sections white, even sections beige.
- The page renders its sections in a loop from `briefs/personetics/article-text.md`, read through the data file `_data/personeticsText.js`. `.eleventy.js` adds the text file as a watch target, so the dev server reloads after a sync.
- At a `[[VISUAL:name]]` marker the page renders that visual if it is built (today: `persona` only). Otherwise it renders nothing and the body continues in a new block, so the slot gap marks the spot.

#### `article-text.md` format (written by the text sync, read by `_data/personeticsText.js`)
```
<!-- header comment -->

# 01
header: <section heading>
title: <subheading>

<paragraph>

[[VISUAL:name]]

<paragraph, single line breaks kept>

## visual: name
<locked line>
<locked line>

# 02
...
```
- `# NN` starts a section: two digits, reading order. `header:` and `title:` follow on the next two lines.
- Body: paragraphs separated by one blank line. A single line break inside a paragraph is intentional and renders as `<br>`. `[[VISUAL:name]]` alone as a paragraph marks a visual's position.
- `## visual: name` starts that visual's LOCKED lines, one per line, up to the next `## visual:` or `# NN`. Present only for visuals that have locked text.
- Text is copied exactly from the workbench. No typography changes.
- The data file HTML-escapes `&`, `<` and `>`, turns single line breaks into `<br>`, and fails the build on anything it can't parse. It returns `[{ number, header, title, blocks: [{ type: "text", paragraphs: [...] } | { type: "visual", name }], visuals: { name: [line, ...] } }]`.
- New `index.njk` at repo root for the landing page.
- The problem statement (`problem-statement.md` §1) is part of the foundation build, written after the tokens.

### Parallel agents (next session)
- **Foundation first, single agent:** shared CSS + tokens + page with text + problem statement. Everything touches shared files, so parallel agents would collide.
- **Then the other visuals in parallel**, each in its own files (partial + CSS + JS): cognitive banking diagram, Danny figure, pain map. Integration into `index.njk` done by one agent afterwards, sequentially.
- Each agent still stops at its own phase 1 (static) gate. Hadar's browser QA is the bottleneck, not code generation.

Repo facts checked on 28 Oct (re-check on split day):
- Branch `feature/build-step-partials`, head `f95cfc5`. Repo restructure finished (commits `e2518a4`, `c16a7ae`, `2514765`, all pushed).
- No root `index.njk` exists.
- Structure is case-study-first inside each type folder: `assets/{case-study}/`, `briefs/{case-study}/`, `_includes/shared/` + `_includes/{case-study}/`, `css/widgets/{case-study}/`, `js/{case-study}/`. Shared CSS stays in `css/components/`. Personetics folders are created by the first prompt that puts a file in them.
- Hero redesign changed `section.css` `.section--hero` (overflow-x clip, justify-content flex-start). Take line positions from the current file.

---

## 3. Open / to add

### Blocking specific visuals
- **Leg technique** (02): decided 29 Oct 2026 (whole-figure frame strip, 7 frames, stop motion). Full spec in `briefs/personetics/danny-figure.md` §2. No longer blocking.
- **Problem statement entrance:** see `problem-statement.md` §2.
- **Exports from Hadar:** red shape SVG; lighthouse, compass, reel cut-outs; Danny figure; Figma artboard nodes for each visual.

### Workbench text sync
- Done 28 Oct: Hadar aligned headings and text in the workbench; solid through section 05. From now on, text changes go through §1 Text sync.

### Not yet discussed
- Engage first generation visual (01), Financial journey (05), Design principles + Condensed dashboard (06)
- Hero design and content; TL;DR block under hero
- Impact & Postmortem content; final headings for 06 and 07
- Landing page design
- Docs to update when this ships: `SITE-ARCHITECTURE.md` (Personetics "not started"); `COMPONENT-MAP.md` (beige modifier, theme, problem-statement component)

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

Done 28 Oct 2026: assets, root pages and specs moved (`c16a7ae`, icons flattened to `assets/bill-pay/icons/`); `_includes/` split into `shared/` and `bill-pay/` (`2514765`). Follow-up, not done: `css/components/ap-manager-orbit.css` is Bill Pay-only inside shared components.

## 3b. Local machine — iCloud (recommended 22 Oct)

Numbered files in `_site/` are iCloud sync-conflict copies. A git repo inside iCloud Drive (`~/Documents/portfolio`) risks the same inside `.git`. Recommendation: move the repo to e.g. `~/Developer/portfolio`, then delete `_site/` and rebuild.

Done 28 Oct 2026: fresh clone at `~/Developer/portfolio`, verified. Old `~/Documents/portfolio` kept untouched for a week, then deleted.

## 3c. Process improvements — approved 22 Oct, written into working-with-hadar.md §21 (+ §17, §18, §19)

## 3d. Other portfolio work to scope (not started)
- Landing page (replaces the temporary two-link page)
- Password gate (not real auth)
- CP case study research — schedule at the start of a week
- Resume and LinkedIn

---

## 4. Draft build prompt — SUPERSEDED (22 Oct, pink version)

Written before the 26 Oct colour change. Colours, badge rules, theme class and section backgrounds in it are now wrong. Rewrite on split day against §1, §2 and `problem-statement.md`; Part A (CLAUDE.md task types) and Part E (landing page) are still the intended content. Article text no longer comes from Part D: it comes from the text sync (§1). Add the problem statement as its own part, after the tokens. The 22 Oct version is in this doc's history and in the 22 Oct chat.

## Rework log
- 28 Oct, problem-statement motion: a copy of the braces stayed at the drawing position during the drift. The approved reference relied on its page's base `[hidden]` rule, and the spec didn't carry it. §17 "Artifact" should have caught it: carry any page-level CSS the reference code depends on.
- 28 Oct, pain map phase 1: spec closed-row widths summed to 508, not 540. §17 Self-consistency should have caught it: arithmetic not re-added.
- 28 Oct, pain map phase 1: number→text gaps were 0 (`p { margin: 0 }` overrode them); the build check measured block sizes only. §17 Done is defined: the check list didn't name internal gaps.
- 29 Oct, pain map pill slide: fix prompt written from Hadar's description without checking `pain-map.md` §1.3 or git history. The slide already existed (commit d63dc6d); the real cause was the `.no-anim` rule switching off the pill's transition. §17 "Prior attempts" should have caught it.
