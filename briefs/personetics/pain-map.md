# Personetics — Pain map (visual spec)

Section 04 (Mind the gap / Discovery & Problem Definition), between body paragraphs 1 and 2.
Scope doc: `briefs/personetics/personetics-build-scope.md`. This file holds every value for this visual, static and motion. The scope doc only links here.

Status (28 Oct 2026): phase 1 (static + tab toggle) locked with Hadar, ready to build once this file is committed. Phase 2 (motion) not specced; open items in §3.

> **Conflict rule.** If any number in this spec conflicts with the existing layout or code, the existing source wins. STOP and report. Do not redesign, flatten or substitute your own markup.

---

## 0. Definition of done

### Phase 1 — static + tab toggle
- **What Hadar looks at:** `/case-studies/personetics/`, section 04: the pain map, overlaid against Figma `closed` (node `2003:51642`) and `open` (node `2004:51829`). All 3 tabs, every row opened.
- **Motion included:** only the tab toggle's existing movement, duplicated from the Bill Pay cockpit widget. Tab content swaps instantly. Rows open and close instantly.
- **Numbers that matter:** block 800 × 654; right column 540 × 526 in every state; closed rows equal height; no scrollbar anywhere, inside or outside the block.
- **Out of scope:** illustrations (grey placeholder boxes only), all other motion, row hover state, commit.

### Phase 2 — motion (not specced yet)
Row open/close transition, illustration animations, tab-content transition, row hover state. See §3.

---

## 1. Static

Build type: **new structure, with one duplicated part** (the tab toggle, §1.3). Everything else is built new from this spec. Pattern: a macro `painMap(data)` in `_includes/personetics/pain-map.njk`, CSS in `css/widgets/personetics/pain-map/pain-map.css`, JS in `js/personetics/pain-map.js`.

### Sources
| Element | Source |
|---|---|
| Whole block | Figma file `3XG9JnADI2psNR3B7TwQdx`, frames `closed` `2003:51642` and `open` `2004:51829` (page "Perso illustration new"). 800 × 654. |
| Tab toggle | **Duplicate** the Bill Pay cockpit widget toggle (its markup, JS and existing movement). Change only what §1.3 lists. Pre-flight names the exact source file. |
| Text | Text sync from the Pain Map Workbench (§2). Never typed by hand. Figma copy is placeholder only. |
| Illustrations | Not in this build. Grey placeholder box (§1.4). |
| + button | Figma node `2004:52189` (32 × 32), downloaded through the Figma MCP as SVG into `assets/personetics/pain-map/`. |
| Behaviour | Hadar, 28 Oct. |

### Unresolved — do not build
- (none)

### 1.1 Block layout (top to bottom)
Vertical stack, gap **25px** between each item, width 800:
1. **Headline** — Literata Medium 500, 18px, line-height 1.3, letter-spacing −0.396px (Figma style `desktop/widgets/cockpit/header`), `--primitive-black`. One line. Text from the sync.
2. **Rule** — full 800 width, 1px, `--primitive-grey-dark`.
3. **Tab toggle** — §1.3.
4. **Main** — 800 × 526: left column 260 + right column 540. §1.5–1.6.

Resulting positions (from Figma): rule at y 48, toggle at y 73, main at y 128, block height 654.

### 1.2 Rules (lines)
All rules 1px, `--primitive-grey-dark`.
- Under the headline: 800 wide. Never moves.
- Top of main (under the tabs): 800 wide, rendered as **one continuous line**. (Figma splits it into a 260 piece and a 540 piece; how it's built is free, it must look like one line.) Never moves.
- Bottom of main: 800 wide, one continuous line. Never moves.
- Vertical divider between left and right column: full 526 height.
- Row dividers: right column only, 540 wide, between rows.

### 1.3 Tab toggle (duplicate, change only these)
- 3 tabs instead of 2, in order **Spend, Plan, Save**. On load: **Spend** selected.
- Track: white (`--primitive-white`), height 30, radius 14.087, each tab 110 wide → track 330 wide. Left-aligned to the block.
- Selected pill: 110 × 32, radius 14.087, horizontal padding 18.783, fill **`--primitive-red-dark`** (Hadar, 28 Oct; Figma's #880000 is unlinked and replaced by the token), text `--primitive-white`.
- Unselected text: `--primitive-grey-dark`.
- Tab text: Literata SemiBold 600, 12px, line-height 1.3 (Figma style `desktop/hero/note`), centred.
- Keep the cockpit toggle's existing movement as it is. Any value in this list that differs from the cockpit source: this list wins (it's Figma). Any value not in this list: copy from the source.

### 1.4 Illustration placeholder
- 228 × 188 box, plain light grey fill, no text, no border. Use the existing grey-light primitive token (pre-flight names it).
- Same box in every tab.

### 1.5 Left column (260 wide)
- Content: placeholder box → 32px gap → number → 16px gap → label. Right padding 32 (content 228 wide).
- **Top is fixed:** content starts **79.5px** below the top of main, in every tab. (79.5 = Figma's centred position with a 2-line label.) Image, number and label start at the same position in every tab. Content is top-aligned, never centred.
- Number: Literata Bold 700, 58px, line-height 1.16, letter-spacing 2.32px, `--primitive-black`. One line.
- Label: Literata Light 300, 26px, line-height 1.22, `--primitive-black`. Meant to be up to 2 lines. A 3rd line is allowed and grows downward only. Anything past the bottom of main is clipped and reported (§1.8).
- Number and label follow the **tab only**; opening rows never changes them.

### 1.6 Right column (540 × 526, fixed in every state)
- **2 or 3 rows per tab**, from the sync. Rows separated by row dividers (§1.2).
- **Closed state** (no row open): rows share the height equally; each row's content is vertically centred.
- **Open state:** at most one row open.
  - Open row: top and bottom padding **21px**, fixed. Its height = its content + 42.
  - Closed rows: share the remaining height equally, content vertically centred.
  - **Max open content height = 282px** (the Figma `open` frame, 5 quotes: 526 − 2 × 101 closed rows − 42 padding). More than that is clipped and reported (§1.8). The same 282px limit applies to tabs with 2 rows.
- Row width 540 always; a row never changes the column's size.

**Closed row**
- Text block: horizontal padding 32 (text width 396), then 48px gap, then the + button (32 × 32) flush to the right edge, vertically centred.
- Number: Literata Bold 700, 27px, line-height 1 (27px tall), `--primitive-black`.
- 12px gap.
- Title: Literata Regular 400, 14px, line-height 20px, `--primitive-black`. **One line only.**
- The whole row is clickable. Cursor: pointer. No other hover change (open item, §3).

**Open row**
- No + button. Horizontal padding 32 (content width 476).
- Number: Literata Bold 700, **40px**, line-height 1, `--primitive-black`.
- 8px gap.
- Title: Literata Regular 400, **16px**, line-height 1.46, `--primitive-black`. One line only.
- 19px gap.
- Quotes: one paragraph per quote, Literata Light Italic 300, 11px, line-height 16px, `--primitive-black`, 8px between paragraphs. Text exactly as synced.

### 1.7 Behaviour
- Clicking a closed row opens it and closes any other open row. Instant.
- An open row has no close control. It closes only when another row opens or the tab changes.
- Switching tabs resets to the zero state: all rows closed. Coming back to a tab also shows it all closed.
- Load state: Spend selected, all rows closed.
- Accessibility (Claude's call): the toggle is a `tablist`; each closed row is a `button` with `aria-expanded`; keyboard Enter/Space opens a row; visible focus ring using the project's existing focus style.

### 1.8 Overflow — clip and report, never scroll
- The block never scrolls, inside or outside. Every part clips at its box (`overflow: hidden`).
- Nothing about overflow is ever shown on the page.
- Overflow is reported in Claude Code's report, in the build prompt and in every pain map text sync. Checks, per tab:
  - headline wraps or is cut;
  - left number wraps; left label runs past the bottom of main;
  - any row number or title wraps (closed or open state);
  - any open row's content is taller than 282px (open each row to check).
- `pain-map.js` exports one function that runs these checks on the rendered page and returns a list of findings. Claude Code runs it on the rendered page. If it cannot render the page, the report says so; it never reports "no overflow" without having measured.

### 1.9 Fonts and tokens
- Literata weights used: 300 roman, 300 italic, 400, 500, 600, 700. Pre-flight checks `tokens.css`; any missing weight gets its own `@import` line, following the file's one-weight-per-import rule.
- Text tokens for each style above go in `tokens.css` with the other `--text-*` tokens. Colours and spacing only from existing tokens.
- Case study pages are desktop-only (`CLAUDE.md`). No mobile layout.

### 1.10 Placement
- At the `[[VISUAL:painmap]]` marker in section 04, between body paragraphs 1 and 2 (in the article workbench since 28 Oct). Gap above and below = the content column's existing `gap: var(--spacing-64)`. No extra margin.
- Pre-flight confirms the marker is in `briefs/personetics/article-text.md` at that position. If not: STOP and report.

---

## 2. Text — from the Pain Map Workbench

Contract: text sync v2 (scope doc §1). Summary of what this visual needs:

**Source:** artifact "Pain Map Workbench", `https://claude.ai/code/artifact/f696ee9c-3532-4d3b-8fb5-7f3f7f893081`. Read by Portfolio only, never by Claude Code. Rule (Hadar, 28 Oct): **the website takes exactly what the workbench's design frame shows.**

Per tab (`spend`, `plan`, `save`), from the database:
- **Left number and label:** the `headlines` doc for that tab with `inDesign: true` (else the first not set to `false`). Number = `size`. Label = `mine` if filled, else `text`.
- **Rows:** `clusters` for that tab, ordered by `order`, excluding `inDesign: false`. Title = `title`. Number = `size` of the item named by the cluster's `leadId` (ignore the cluster's own `size`, which is stale). No lead → STOP and ask Hadar.
- **Quotes:** `items` with `cluster` = that row, `kind: "quote"`, excluding `inDesign: false`, ordered by `order`. Text = `mine` if filled, else `raw`.
- **Ignored:** sources, base, calculation, flags, other numbers and notes, merged items, the "Behaviors" count.
- **Block headline** (above the tabs): the workbench has none. Until Hadar supplies it, the sync writes `headline headline` (Figma placeholder).
- A tab with fewer than 2 or more than 3 rows: STOP and ask Hadar.

**Written into** `briefs/personetics/article-text.md`, inside `# 04`, as its own block after the section's `## visual:` blocks:
```
## pain-map
headline: <block headline>

### tab: spend
number: <left number>
label: <left label>

#### row
number: <row number>
title: <row title>
quote: <quote text, one per line>
quote: <…>

#### row
…

### tab: plan
…
```
- `## pain-map` runs to the next `## visual:` or `# NN` or end of file.
- One `quote:` line per quote. Text copied exactly; no typography changes.
- `_data/personeticsText.js` parses it into the section's `painMap: { headline, tabs: [{ id, number, label, rows: [{ number, title, quotes: [...] }] }] }`, HTML-escapes as it does for the rest, and fails the build on anything it can't parse.
- **Order matters:** today's parser fails on a `## pain-map` block. The first pain-map block is written in the same build prompt that adds its parser, never by a sync before it.

---

## 3. Open — phase 2 (motion), do not build now
- Row open/close transition (Hadar, 28 Oct: to be filled in the animation and transition spec).
- Tab-content transition (the toggle's own movement already ships in phase 1).
- Illustration animations — Hadar designs them with another agent; each tab's illustration replaces its grey box at 228 × 188.
- **Row hover state** — Hadar wants one, not designed yet. **Raise before motion is closed.**
- Reduced-motion behaviour for each of the above.

## 4. Open — content, decide later (Hadar, 28 Oct)
- **Source caption.** The article workbench's note on this visual: the caption must say the numbers come from public studies, not the partner banks' own research. Not in Figma. Not built in phase 1.
- **Block headline** (above the tabs): placeholder until Hadar supplies it (§2).
