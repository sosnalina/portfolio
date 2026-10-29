# Personetics — Pain map (visual spec)

Section 04 (Mind the gap / Discovery & Problem Definition), between body paragraphs 1 and 2.
Scope doc: `briefs/personetics/personetics-build-scope.md`. This file holds every value for this visual, static and motion. The scope doc only links here.

Status (29 Oct 2026): phase 1 built and QA'd by Hadar (commit d63dc6d). Phase 2 (drawer motion + close control) specced and approved in a playable reference, below (§3). Phase 2 build not started. Phase 2b (illustration transition on tab switch) specced and approved in a playable reference: §6. Still open: §4.

> **Conflict rule.** If any number in this spec conflicts with the existing layout or code, the existing source wins. STOP and report. Do not redesign, flatten or substitute your own markup.
>
> **One exception:** where §1.6, §1.7, §1.11 and §3 replace something phase 1 built (the circle button, the fixed 21px padding, instant open/close, no close control), this spec wins over the built phase-1 code. That is the point of phase 2.

---

## 0. Definition of done

### Phase 1 — static + tab toggle (done)
- **What Hadar looks at:** `/case-studies/personetics/`, section 04: the pain map, overlaid against Figma. All 3 tabs, every row opened.
- **Motion included:** only the tab toggle's existing movement, duplicated from the Bill Pay cockpit widget. Tab content swaps instantly.
- **Numbers that matter:** block 800 × 654; right column 540 × 526 in every state; no scrollbar anywhere, inside or outside the block.
- **Out of scope:** illustrations (the three inline SVGs, static; their motion is phase 2), row hover state, commit.

### Phase 2 — row open/close motion
- **What Hadar looks at:** `/case-studies/personetics/`, section 04, side by side with the approved reference (artifact "Pain Map Drawer", `https://claude.ai/artifact/8pD6yYdLc6H3cbZaKUqJ4L`, version 7) and overlaid against Figma frame `open` (node `2004:51829`) and the open row (node `2004:51870`). Every tab; every row opened and closed; the 5-quote row in the third tab; tab switching with a row open.
- **Behaviour she checks:**
  - Opening a row: the drawer grows from the header downward, the number and title scale up while moving into place, the quotes appear one after another, the plus turns into a minus. Other rows shrink at the same time. One continuous motion.
  - Clicking anywhere in the open row (header or quotes) closes it, by the reverse motion; the quotes are gone before the drawer shuts on them.
  - Opening another row while one is open: the open one closes and the new one opens at the same time.
  - Switching tabs: all rows closed, nothing animates inside the block (the toggle's pill still moves).
- **Numbers that matter:** drawer 200 ms, `cubic-bezier(0, 0, 0.58, 1)`; plus/minus turn 110 ms; quotes 300 ms fade + 8px rise, first quote starts 60 ms in, 60 ms between quotes; closing quotes fade 150 ms, no stagger. Row paddings per §3.4. Right column stays 540 × 526 in every frame of the motion.
- **Out of scope:** illustrations and their animation, tab-content transition, row hover state, commit (Hadar QAs first).

### Phase 2b — illustration transition on tab switch
See §6.0.

---

## 1. Static

Build type: **new structure, with one duplicated part** (the tab toggle, §1.3). Everything else is built new from this spec. Pattern: a macro `painMap(data)` in `_includes/personetics/pain-map.njk`, CSS in `css/widgets/personetics/pain-map/pain-map.css`, JS in `js/personetics/pain-map.js`.

### Sources
| Element | Source |
|---|---|
| Whole block | Figma file `3XG9JnADI2psNR3B7TwQdx`, page "Perso illustration new", 800 × 654. **Use frame `open` (`2004:51829`) and the open row (`2004:51870`).** Frame `closed` (`2003:51642`) is stale: it still shows the old circle button. Do not use it. |
| Tab toggle | **Duplicate** the Bill Pay cockpit widget toggle (its markup, JS and existing movement). Change only what §1.3 lists. Pre-flight names the exact source file. |
| Text | Text sync from the Pain Map Workbench (§2). Never typed by hand. Figma copy is placeholder only. |
| Illustrations | The grey placeholder is replaced by three inline SVGs, `_includes/personetics/pain-map-illustration-spend.svg`, `-plan.svg`, `-save.svg` (228 × 188; photos from `assets/personetics/pain-map/`). Motion still phase 2 (§4). |
| Plus / minus toggle | Hadar's two SVGs (28–29 Oct), paths unchanged, inlined, `fill="currentColor"`, colour `--primitive-red-dark`. The paths are in the reference code (§3.8), in `toggleIcon()`. They replace `_includes/personetics/pain-map-plus.svg` (the old 32 × 32 circle, Figma node `2004:52189`, which is deleted). |
| Behaviour | Hadar, 28–29 Oct. |

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
- Row dividers: right column only, 540 wide, between rows. They move with the rows during the motion.

### 1.3 Tab toggle (duplicate, change only these)
- 3 tabs instead of 2, in order **Spend, Plan, Save**. On load: **Spend** selected.
- Track: white (`--primitive-white`), height 30, radius 14.087, each tab 110 wide → track 330 wide. Left-aligned to the block.
- Selected pill: 110 × 32, radius 14.087, horizontal padding 18.783, fill **`--primitive-red-dark`** (Hadar, 28 Oct; Figma's #880000 is unlinked and replaced by the token), text `--primitive-white`.
- Unselected text: `--primitive-grey-dark`.
- Tab text: Literata SemiBold 600, 12px, line-height 1.3 (Figma style `desktop/hero/note`), centred.
- Keep the cockpit toggle's existing movement as it is. Any value in this list that differs from the cockpit source: this list wins (it's Figma). Any value not in this list: copy from the source. **Phase 2 does not touch the toggle.**

### 1.4 Illustration
- The grey placeholder is replaced by the three inline SVGs, one per tab: `_includes/personetics/pain-map-illustration-spend.svg`, `-plan.svg`, `-save.svg`, included in each left panel by tab id. Inline (not `<img>`) because the colours are CSS variables.
- Each SVG is 228 × 188, `display: block`, in the unchanged 228 × 188 box. The `<image>` hrefs point at `/assets/personetics/pain-map/*.png`.
- Same box in every tab. Motion: §6.

### 1.5 Left column (260 wide)
- Content: placeholder box → 32px gap → number → 16px gap → label. Right padding 32 (content 228 wide).
- **Top is fixed:** content starts **79.5px** below the top of main, in every tab. (79.5 = Figma's centred position with a 2-line label.) Image, number and label start at the same position in every tab. Content is top-aligned, never centred.
- Number: Literata Bold 700, 58px, line-height 1.16, letter-spacing 2.32px, `--primitive-black`. One line.
- Label: Literata Light 300, 26px, line-height 1.22, `--primitive-black`. Meant to be up to 2 lines. A 3rd line is allowed and grows downward only. Anything past the bottom of main is clipped and reported (§1.8).
- Number and label follow the **tab only**; opening rows never changes them.

### 1.6 Right column (540 × 526, fixed in every state) — replaced in phase 2
- **2 or 3 rows per tab**, from the sync. Rows separated by row dividers (§1.2).
- Row width 540 always; a row never changes the column's size.
- At most one row open.
- **Padding rule (replaces the phase-1 "21px fixed / closed rows share the rest").** Every row, open or closed, has the same top and bottom padding `p`. `p` is whatever is left of the 526px after the contents are placed: `p = (526 − Σ contents) / (2 × n)`, `n` = number of rows. Contents: a closed row's content is **59.44px** (number 27 + 12 gap + title 20.44, as drawn in Figma); the open row's content is its header **71.36px** (40 number + 8 gap + 23.36 title) plus its quotes block. Row height = content + 2p. So `p` shrinks as the open row's text grows. Figma check values for a 3-row tab: all closed ≈ 58 (Figma 58.17), four quotes open 25.67, five quotes open ≈ 21. A difference above 0.5px from Figma is reported.
- **Max open content = 282px** (header + quotes; the Figma `open` frame with 5 quotes). The quotes block is shortened to `282 − header` if its natural height is larger; the rest is clipped and reported (§1.8), never scrolled. Same 282 limit for 2-row tabs.
- The mechanism for all of this is in §3.4 and the reference code.

**Row, both states** (one heading, two sizes)
- One heading made of number + title, laid out once at the **open size** (number Literata Bold 700 40px / line-height 1; 8px gap; title Literata Regular 400 16px / line-height 1.46, one line). When the row is closed they are drawn scaled down from their top-left corner: number × 0.675 (= 27px), title × 0.875 (= 14px) and lifted 9px so the closed gap is 12px. They are never re-laid-out at the small size. This is what makes the scale-up smooth (§3.2).
- Text frame: fills the width left by the toggle icon (475.96px = 540 − 16.04 − 48 gap). Horizontal padding 32 on both sides when closed; 32 on the left only when open (title room is therefore 411.96 closed, 443.96 open, measured at the open size).
- Toggle icon: 16.04 wide, flush to the right edge, 48px gap from the text frame. Colour `--primitive-red-dark`.
- The whole closed row is clickable (cursor pointer). An open row is clickable anywhere (header and quotes), cursor pointer over the whole row (Hadar, 29 Oct).
- No other hover change (open item, §4).

**Quotes** (inside the drawer)
- 19px below the header (the drawer's top padding), horizontal padding 32 (content 476 wide).
- One paragraph per quote, Literata Light Italic 300, **12px, line-height 17.5px** (Hadar, 28 Oct, for readability; Figma has 11/16), `--primitive-black`, **12px between paragraphs** (Figma; Hadar, 29 Oct), exactly as synced. *The reference artifact uses 11/16; the build uses 12/17.5.*

### 1.7 Behaviour — replaced in phase 2
- Clicking a closed row opens it and closes any other open row, in one motion (§3).
- Clicking anywhere in the open row (header, quotes, padding) closes it. The minus is the visible cue.
- Switching tabs resets to the zero state: all rows closed, **instantly with no animation** (the toggle's pill still moves). Coming back to a tab also shows it all closed.
- Load state: Spend selected, all rows closed, no animation.
- Accessibility (Claude's call): the toggle is a `tablist`; each row's header is a `button` with `aria-expanded`; keyboard Enter/Space opens or closes a row; visible focus ring using the project's existing focus style. The plus/minus icons are `aria-hidden`.

### 1.8 Overflow — clip and report, never scroll
- The block never scrolls, inside or outside. Every part clips at its box (`overflow: hidden`).
- Nothing about overflow is ever shown on the page.
- Overflow is reported in Claude Code's report, in the build prompt and in every pain map text sync. Checks, per tab:
  - headline wraps or is cut;
  - left number wraps; left label runs past the bottom of main;
  - any row number or title is wider than its room (title room 411.96 closed / 443.96 open, measured at the open size, as in the reference);
  - any open row's natural content (header + quotes) is taller than 282px (open each row to check).
- `pain-map.js` exports one function (`PainMap.checkOverflow`) that runs these checks on the rendered page and returns a list of findings. It opens each row to measure, and leaves the page closed afterwards. Claude Code runs it on the rendered page. If it cannot render the page, the report says so; it never reports "no overflow" without having measured.

### 1.9 Fonts and tokens
- Literata weights used: 300 roman, 300 italic, 400, 500, 600, 700. Pre-flight checks `tokens.css`; any missing weight gets its own `@import` line, following the file's one-weight-per-import rule.
- Text tokens for each style above go in `tokens.css` with the other `--text-*` tokens (the existing `--text-pain-map-*` set stays; the open-size number and title tokens are now used for both states). Colours and spacing only from existing tokens.
- The pain map uses its own font family, "Literata Optical": self-hosted variable Literata (opsz + wght) in `assets/fonts/literata-optical/`, with `font-optical-sizing: auto` and antialiased smoothing on `.pain-map`. Reason: Figma renders Literata with automatic optical size; the site's static files don't, and looked heavier (Hadar confirmed by side-by-side, 28 Oct). Pain map only (Hadar, 28 Oct). Headline uses `--text-pain-map-headline`, not the shared `--text-widget-header`. The font files are ~400 KB each: trim before launch.
- Case study pages are desktop-only (`CLAUDE.md`). No mobile layout.

### 1.10 Placement
- At the `[[VISUAL:painmap]]` marker in section 04, between body paragraphs 1 and 2 (in the article workbench since 28 Oct). Gap above and below = the content column's existing `gap: var(--spacing-64)`. No extra margin.
- Pre-flight confirms the marker is in `briefs/personetics/article-text.md` at that position. If not: STOP and report.

### 1.11 What phase 2 changes in the built phase-1 code
1. **Markup** (`pain-map.njk`): each row becomes one `button` header (number + title in a text frame, plus the toggle icon) followed by the quotes drawer. The separate "closed" and "open" blocks, and the second copy of number and title, go away. `pain-map-plus.svg` is deleted; the toggle icon is two inline SVGs (§3.8, `toggleIcon()`), in the macro, no JS-built markup.
2. **CSS** (`pain-map.css`): the row section is rewritten per §3.8. `flex: 1 1 0` rows and `max-height: calc(282px + 42px)` go; row heights are set by JS. Everything outside the rows (block, headline, tab toggle, left column, rules, font-face) is untouched.
3. **JS** (`pain-map.js`): `layout()` (§3.8) replaces the instant open/close; the click handler gets the close rule; `checkOverflow` is updated for the new structure (one number, one title, the drawer).
4. **Tokens**: no new colour or spacing tokens expected. Motion values are CSS custom properties at the top of `pain-map.css` (or existing motion tokens if `tokens.css` already has the identical values; pre-flight says which).

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

## 3. Motion — phase 2 (row open/close)

### 3.1 Purpose and feel
Opening a row should read as one drawer sliding open under its header, with the row's number and title growing into the open size as they settle, the evidence (quotes) arriving after the space exists, and the plus turning into the minus that closes it. Quiet, quick, no bounce. The drawer's direction and curve come from the 21st.dev reference `text-reveal-faqs` (ruixen.ui, Radix accordion: height 0 → content height, 0.2s ease-out, top-anchored, no fade). Only the drawer motion is taken from that reference; its layout and its blur text reveal are not used.

### 3.2 Beats
All beats start on the same click. Times in ms from the click (open), 5-quote row.

| Beat | What moves | Start | Duration | Curve |
|---|---|---|---|---|
| Drawer | open row's height, quotes drawer height, every row's top padding, closed rows' height | 0 | 200 | `cubic-bezier(0, 0, 0.58, 1)` (reference CSS `ease-out`) |
| Number | scale 0.675 → 1 (origin top-left) | 0 | 200 | same |
| Title | scale 0.875 → 1, translateY −9px → 0 (origin top-left) | 0 | 200 | same |
| Toggle icon ride | icon container down 5.96px (centres it on the taller header) | 0 | 200 | same |
| Plus → minus | plus rotates 0 → 90° and fades out; minus rotates −90° → 0 and fades in; each about its own centre | 0 | **110** | rotation: drawer curve; fade: linear |
| Quotes in | per quote: opacity 0 → 1 and rise 8px → 0 | 60 + i × 60 (i = quote index from 0) | 300 | `cubic-bezier(0.23, 1, 0.32, 1)` |
| Quotes out (close) | opacity 1 → 0 and fall 0 → 8px | 0, all together | 150 | opacity linear, movement `cubic-bezier(0.23, 1, 0.32, 1)` |
| Close, the rest | everything above in reverse on the drawer curve | 0 | 200 (icon 110) | same |

- **Derived total:** a 5-quote open ends at 60 + 4 × 60 + 300 = **600 ms**; a 1-quote open at 360 ms. The drawer itself is done at 200 ms, so the last quotes land after the space has finished opening.
- **Cascade:** the quotes in an opening drawer arrive in sequence (one after another, document order, 60 ms apart). That is the only cascade. Everything else is simultaneous.
- **Switching rows:** the open row closes and the new one opens on the same click; both run their own beats at once, on the same curve, so the total height never changes.
- **Paint order:** geometric. Nothing is raised above its neighbours; rows clip their own contents.
- **Tab switch:** all rows closed with no animation. The pill's own movement is unchanged.

### 3.3 Reduced motion
`prefers-reduced-motion: reduce`: movement is removed, the crossfades stay. Height, padding, scale, translate, rotation and rise are instant (duration 0, delays 0, no stagger). Opacity changes stay: plus/minus crossfade 110 ms linear, quotes fade 150 ms linear (open and close, no delay). The reduced-motion rules must win over the open-state rules (check specificity). *This differs from the reference code's reduced-motion block, which zeroes everything; use this section's rule, not the reference's.*

### 3.4 How the layout works (so nothing re-flows during the motion)
- JS computes target pixel heights in one function, `layout(openIdx)` (`-1` = all closed), and writes them as inline styles: each row's `height`, each row inner's `padding-top`, the quotes drawer's `height`. CSS transitions do all the motion; JS runs no per-frame code.
- Measurements for the open row: `headOpen` = the header's `offsetHeight` (with the row already marked open, so the 71.36px open size), `natural` = the quotes block's inner height, `qh = min(natural, max(0, 282 − headOpen))`.
- `p = (526 − contents) / (2n)` as in §1.6. Row height = content + 2p. `padding-top = p`; the bottom padding is the remainder inside the fixed row height.
- Initial render and tab switch add a `no-anim` class (`transition: none` on everything), build and lay out the rows, force a reflow (`void el.offsetWidth`), then remove the class.
- The number/title scale values live in CSS custom properties on the row (`--ns`, `--ts`, `--ty`, `--iy`), flipped by the open modifier; the scale itself is a plain CSS transform transition.

### 3.5 Exceptions to the animation standard, stated
- **Layout properties are animated** (height, padding-top). Normally banned; accepted here because the effect is the drawer itself, the column is a fixed 540 × 526 with `overflow: hidden`, and the reference does the same.
- **Plain CSS transitions on a user click**, not a scripted pure-function-of-time animation. The standard's scripted-timeline rules do not apply; the beats table is the spec.

### 3.6 Not in this phase
Illustrations and their animation (§6); tab-content transition; row hover state; the headline and left column (they never move).

### 3.7 Approved values still carrying an assumption
- Quote rise **8px** is Claude's default, not drawn in Figma. Hadar saw it in the reference and did not change it. Confirm in browser.
- Scaled number/title are 0.44px different from a true 27px / 14px layout in places (sub-pixel; accepted).

### 3.8 Reference code — port this, do not re-derive
Source: artifact "Pain Map Drawer", version 7, approved by Hadar 29 Oct. **Port this. Code wins over any prose above; if the two disagree, STOP and report.** Only the pain map is pasted (not the test strip, the placeholder data, the page chrome, or the tab toggle).

**What changes in the port (and nothing else):**
- Class names: reference → built BEM, `pain-map-row` family. `.row` → `.pain-map-row`; `.row__inner` → `.pain-map-row__inner`; `.row__head` → `.pain-map-row__head`; `.row__text` → `.pain-map-row__text`; `.row__num` → `.pain-map-row__number`; `.row__title` → `.pain-map-row__title`; `.tg` → `.pain-map-row__toggle`, its svgs `.pain-map-row__toggle-plus` / `-minus`; `.quotes` → `.pain-map-row__quotes`, `.quotes__in` → `.pain-map-row__quotes-inner`, its `p` → `.pain-map-row__quote`; `.is-open` → the existing open modifier `.pain-map-row--open` (pre-flight confirms its name). Pre-flight confirms the other existing names.
- Tokens: reference colour and font variables (`--primitive-*`, `--serif`) → the built tokens (`--primitive-red-dark`, `--primitive-grey-dark`, `--primitive-black`, the `--text-pain-map-*` set, "Literata Optical"). Spacing numbers that match an existing spacing token use the token (32 → `--spacing-32`, 8 → `--spacing-8`, 48 → `--spacing-48` if it exists); the rest (19, 21.24, 16.04, 5.96, 59.44 …) are Figma-derived values and stay literal with a comment saying where they come from.
- Quote font: **12px / 17.5px** (the reference has 11 / 16). Quote gap: **12px** (the reference has 8px, `margin: 0 0 8px`). The quote margins must actually show on the page: the first build had them overridden by another rule; verify in the browser that three quotes are 12px apart.
- Click: the row listener closes an open row on a click anywhere in it (reference only closes from `.row__head`). The open row's cursor is pointer over the whole row (reference has `cursor: default` there).
- Reduced-motion block: replaced by §3.3.
- `--idur` is **110ms** (reference file now says 110; this note exists because earlier versions said 120).
- Motion variables (`--dur`, `--ease`, `--ease-out`, `--idur`, `--rise`, `--k`) live on `.pain-map` instead of `:root`, and `--k` (the test strip's slow-motion multiplier) is removed: replace `calc(X * var(--k))` with `X`.
- Markup: written in Nunjucks in the macro; the plus/minus SVGs are inline in the template (paths exactly as in `toggleIcon()`), not JS-built. The quotes' `--i` index is written inline per quote (`style="--i: 0"`, etc.) by the macro.
- Not ported: the `instant-size` / `instant-text` test classes, the `.lab` strip, the `applyMotion` function, the placeholder `TABS` data (real data comes from the macro), the page `body`/`.page`/`.note` styles, `PRESETS`.
- `render()` becomes the tab-switch handler's reset (rows are rendered by the macro; on tab switch: add `no-anim`, close all, `layout(-1)`, reflow, remove `no-anim`).
- Constants: `MAIN_H = 526` and `MAX_OPEN = 282` (the existing `OPEN_CONTENT_MAX`); `CLOSED_VISUAL` stays derived (27 + 12 + 16 × 1.46 × 14/16).
- `PainMap.checkOverflow` is updated per §1.8 for the new structure.

**CSS (reference, pain-map rows):**

```css
:root {  /* motion values, as in the reference */
  --dur: 200ms;
  --ease: cubic-bezier(0, 0, 0.58, 1);
  --ease-out: cubic-bezier(0.23, 1, 0.32, 1);
  --k: 1;
  --rise: 8px;
  --idur: 110ms;
}

/* Rows: height, top padding and the quotes drawer animate together on one curve. */
.row { box-sizing: border-box; overflow: hidden; cursor: pointer; transition: height var(--dur) var(--ease); }
.row + .row { border-top: 1px solid var(--primitive-grey-dark); }
.row.is-open { cursor: default; }
.row__inner { box-sizing: border-box; padding: 21px 0; transition: padding-top var(--dur) var(--ease); }
.row__head {
  display: flex; align-items: center; gap: 48px; width: 100%; margin: 0; padding: 0; border: 0; background: none;
  font: inherit; color: inherit; text-align: left; cursor: inherit;
}
.row__head:focus-visible { outline: 2px solid var(--primitive-red-dark); outline-offset: -2px; }
/* Figma 2004:51870: the text frame fills what the icon leaves (540 - 16.04 - 48 gap = 475.96);
   closed it keeps 32 on both sides, open only 32 on the left. */
.row__text { box-sizing: border-box; flex: 1 1 auto; min-width: 0; padding: 0 32px; }
.row.is-open .row__text { padding-right: 0; }
/* Number and title are always laid out at their open size (40px / 16px) and scaled down
   when closed: 27/40 = 0.675, 14/16 = 0.875. Both scale from the top-left, and the title also
   rides 9px up (closed gap 12 vs open gap 8, minus the shrunk number: 48 - 39). Opening
   transitions all three to identity on the drawer's curve, so nothing re-flows. */
.row { --ns: 0.675; --ts: 0.875; --ty: -9px; --iy: 0px; }
.row.is-open { --ns: 1; --ts: 1; --ty: 0px; --iy: 5.96px; }
.row__num {
  display: block; font: 700 40px/1 var(--serif);
  transform-origin: 0 0; transform: scale(var(--ns));
  transition: transform var(--dur) var(--ease);
}
.row__title {
  display: block; margin-top: 8px; font: 400 16px/1.46 var(--serif); white-space: nowrap; overflow: hidden;
  transform-origin: 0 0; transform: translateY(var(--ty)) scale(var(--ts));
  transition: transform var(--dur) var(--ease);
}
/* Plus / minus toggle, flush right. Closed it is centred on the 59.44px visual text block
   (21.24 + 8.485 = 29.72); open it is centred on the 71.36px header, so it rides down 5.96px.
   Two stacked icons (Hadar's SVGs, unchanged): the plus turns 90 degrees and fades out while the
   minus turns in from -90 degrees. Each rotates about its own centre. */
.tg {
  position: relative; flex: none; align-self: flex-start; width: 16.04px; height: 16.97px; margin-top: 21.24px;
  color: var(--primitive-red-dark);
  transform: translateY(var(--iy));
  transition: transform var(--dur) var(--ease);
}
/* The turn and crossfade have their own, shorter duration (--idur); the icon's ride down with the row stays on the drawer's. */
.tg svg { position: absolute; left: 0; overflow: visible; transition: transform calc(var(--idur) * var(--k)) var(--ease), opacity calc(var(--idur) * var(--k)) linear; }
.tg__plus { top: 0; transform-origin: 8.02px 8.485px; }
.tg__minus { top: 7.04px; transform-origin: 8.02px 1.446px; opacity: 0; transform: rotate(-90deg); }
.row.is-open .tg__plus { opacity: 0; transform: rotate(90deg); }
.row.is-open .tg__minus { opacity: 1; transform: none; }
.row.is-open .row__head { cursor: pointer; }
.pm.instant-size .row__num, .pm.instant-size .row__title { transition: none; }

.quotes { height: 0; overflow: hidden; transition: height var(--dur) var(--ease); }
.quotes__in { padding: 19px 32px 0; }
/* Quotes arrive one after another once the drawer is opening: fade + rise, strong ease-out,
   60 ms head start and 60 ms between quotes (--i is the quote's index). Closing is a quick
   fade with no stagger so the text is gone before the drawer shuts on it. */
.quotes__in p {
  margin: 0 0 8px; font: italic 300 11px/16px var(--serif);
  opacity: 0; transform: translateY(var(--rise));
  transition: opacity calc(150ms * var(--k)) linear, transform calc(150ms * var(--k)) var(--ease-out);
}
.quotes__in p:last-child { margin-bottom: 0; }
.row.is-open .quotes__in p {
  opacity: 1; transform: none;
  transition:
    opacity calc(300ms * var(--k)) var(--ease-out) calc((60ms + var(--i) * 60ms) * var(--k)),
    transform calc(300ms * var(--k)) var(--ease-out) calc((60ms + var(--i) * 60ms) * var(--k));
}
.pm.instant-text .quotes__in p { opacity: 1; transform: none; transition: none; }

.pm.no-anim *, .pm.no-anim *::before, .pm.no-anim *::after { transition: none !important; }

@media (prefers-reduced-motion: reduce) {
  .pm *, .pm *::before, .pm *::after { transition-duration: 0s !important; transition-delay: 0s !important; }
}
```

**Markup produced per row (reference `buildRow`, DOM shape to match):**

```
.row
  .row__inner
    button.row__head [aria-expanded]
      span.row__text
        span.row__num
        span.row__title
      span.tg [aria-hidden]
        svg.tg__plus
        svg.tg__minus
    .quotes
      .quotes__in
        p [--i]  (one per quote)
```

**JS (reference):**

```js
  var MAIN_H = 526, MAX_OPEN = 282;
  var CLOSED_VISUAL = 27 + 12 + 16 * 1.46 * (14 / 16); // closed text block as drawn: 59.44px

  // Hadar's two SVGs, paths unchanged; fill follows the token through currentColor.
  function toggleIcon() {
    return '<span class="tg" aria-hidden="true">' +
      '<svg class="tg__plus" width="17" height="17" viewBox="0 0 17 17" fill="none" focusable="false">' +
      '<path d="M7.9048 16.9664C7.07425 16.9664 6.40096 16.2931 6.40096 15.4626V11.7171C6.40096 10.6126 5.50553 9.71712 4.40096 9.71712H1.446C0.647397 9.71712 0 9.06972 0 8.27112C0 7.47252 0.647396 6.82512 1.446 6.82512H4.40096C5.50553 6.82512 6.40096 5.92969 6.40096 4.82512V1.50384C6.40096 0.673293 7.07425 0 7.9048 0C8.73535 0 9.40864 0.673293 9.40864 1.50384V4.82512C9.40864 5.92969 10.3041 6.82512 11.4086 6.82512H14.595C15.3936 6.82512 16.041 7.47252 16.041 8.27112C16.041 9.06972 15.3936 9.71712 14.595 9.71712H11.4086C10.3041 9.71712 9.40864 10.6126 9.40864 11.7171V15.4626C9.40864 16.2931 8.73535 16.9664 7.9048 16.9664Z" fill="currentColor"/></svg>' +
      '<svg class="tg__minus" width="17" height="3" viewBox="0 0 17 3" fill="none" focusable="false">' +
      '<path d="M6.40096 2.892H1.446C0.647397 2.892 0 2.2446 0 1.446C0 0.647396 0.647396 0 1.446 0H6.40096H9.40864H14.595C15.3936 0 16.041 0.647396 16.041 1.446C16.041 2.2446 15.3936 2.892 14.595 2.892H9.40864H6.40096Z" fill="currentColor"/></svg>' +
      '</span>';
  }

  function buildRow(data, i) {
    var row = document.createElement("div");
    row.className = "row";
    var inner = document.createElement("div");
    inner.className = "row__inner";
    var head = document.createElement("button");
    head.type = "button";
    head.className = "row__head";
    head.setAttribute("aria-expanded", "false");
    var text = document.createElement("span");
    text.className = "row__text";
    var num = document.createElement("span");
    num.className = "row__num";
    num.textContent = data.num;
    var title = document.createElement("span");
    title.className = "row__title";
    title.textContent = data.title;
    text.appendChild(num);
    text.appendChild(title);
    head.appendChild(text);
    head.insertAdjacentHTML("beforeend", toggleIcon());
    var quotes = document.createElement("div");
    quotes.className = "quotes";
    var qin = document.createElement("div");
    qin.className = "quotes__in";
    data.quotes.forEach(function (q, qi) {
      var p = document.createElement("p");
      p.style.setProperty("--i", qi);
      p.textContent = q;
      qin.appendChild(p);
    });
    quotes.appendChild(qin);
    inner.appendChild(head);
    inner.appendChild(quotes);
    row.appendChild(inner);
    // Closed row: anywhere opens it. Open row: only the header (number, title, minus) closes it.
    row.addEventListener("click", function (e) {
      if (!row.classList.contains("is-open")) layout(i);
      else if (e.target.closest(".row__head")) layout(-1);
    });
    return row;
  }

  // Sets every row's target height, top padding and drawer height. CSS transitions do the motion.
  function layout(openIdx) {
    rows.forEach(function (r, i) {
      var open = i === openIdx;
      r.classList.toggle("is-open", open);
      r.querySelector(".row__head").setAttribute("aria-expanded", open ? "true" : "false");
    });
    var n = rows.length, qh = 0, co = 0;
    if (openIdx >= 0) {
      var r0 = rows[openIdx];
      var headOpen = r0.querySelector(".row__head").offsetHeight;
      var natural = r0.querySelector(".quotes__in").offsetHeight;
      qh = Math.min(natural, Math.max(0, MAX_OPEN - headOpen)); // clipped past 282, never scrolls
      co = headOpen + qh;
    }
    // Every row gets the same top and bottom padding; it is whatever is left of the 526px once the
    // contents are placed, so it shrinks as the open row's text grows (all closed: 58.17, four
    // quotes: 25.67, five quotes: 21).
    var contents = openIdx >= 0 ? co + (n - 1) * CLOSED_VISUAL : n * CLOSED_VISUAL;
    var pad = (MAIN_H - contents) / (2 * n);
    rows.forEach(function (r, i) {
      var open = i === openIdx;
      r.style.height = ((open ? co : CLOSED_VISUAL) + 2 * pad) + "px";
      r.querySelector(".row__inner").style.paddingTop = pad + "px";
      r.querySelector(".quotes").style.height = (open ? qh : 0) + "px";
    });
  }

  function render() {
    var t = TABS[tabIdx];
    pm.classList.add("no-anim");
    document.getElementById("leftNum").textContent = t.num;
    document.getElementById("leftLabel").textContent = t.label;
    right.textContent = "";
    rows = t.rows.map(buildRow);
    rows.forEach(function (r) { right.appendChild(r); });
    layout(-1);
    void pm.offsetWidth; // commit the no-transition state before re-enabling
    pm.classList.remove("no-anim");
  }
```

### 3.10 Decisions from the build pre-flight (29 Oct)
- **Row divider:** keep the built `box-shadow: inset 0 1px` (no layout cost). Do not switch to the reference's `border-top`; the padding maths in §1.6 assumes the divider takes no height.
- **Tab panels:** the page has one panel per tab and a hidden panel measures 0. Keep a current-panel `rows` list; on tab switch unhide the new panel, then run the reset (`no-anim`, `layout(-1)`, reflow, remove `no-anim`). Measure only in a visible panel.
- **Click handler:** on the row element, as in the reference (the whole closed row is clickable). Remove the old per-button handler.
- **Focus:** remove the old "move focus to the open block" handling; the header button stays in place, so focus stays on it.
- **`checkOverflow`:** title and number are `nowrap`, so compare `scrollWidth` to the room (title 411.96 closed / 443.96 open; number to its text frame), not line counts.
- **Motion values:** six local custom properties at the top of `pain-map.css` (`--dur`, `--ease`, `--ease-out`, `--idur`, `--rise`, plus stagger step/head start). No reuse of `--ease-section-header-entrance`; `tokens.css` has no duration tokens.
- **48px header gap:** literal with a Figma comment; no new token. Unused `--text-pain-map-row-number` / `-row-title` stay in `tokens.css` for now.
- **Names:** `__head`, `__toggle`, `__toggle-plus`, `__toggle-minus`, `__quotes-inner`; `OPEN_CONTENT_MAX` renamed `MAX_OPEN`. Keep `aria-controls` from the header to the drawer id.
- All-closed padding computes to 57.95 vs Figma 58.17 (0.22px): within the 0.5px limit.

### 3.11 Quote gap and the 282px limit (29 Oct)
Quotes block room = 282 − 71.36 header − 19 top gap = 191.64px. At 12px / 17.5px a quote of up to ~160 characters wraps to 2 lines. With the 12px gap, a 5-quote row fits if its quotes total 8 lines or fewer (4 × 12 + 8 × 17.5 = 188); beyond that the last quote clips. A clip is a safety net, never an accepted outcome: `checkOverflow` reports it and the text is trimmed.

### 3.9 Checklist for the build (Claude Code reports each as pass / fail / not measured)
- [ ] Right column is exactly 540 × 526 in every frame: all closed, each row open, mid-motion. No scrollbar anywhere.
- [ ] Row padding values within 0.5px of §1.6's check values (all closed, four quotes, five quotes).
- [ ] Number 40px / title 16px when open; scaled to 27px / 14px visual when closed.
- [ ] Beats table matches: 200 / 110 / 300, stagger 60 + 60, close 150 (read from the computed styles).
- [ ] Closed row: click anywhere opens. Open row: a click anywhere in it closes it.
- [ ] Tab switch resets with no animation; load state all closed.
- [ ] Reduced motion per §3.3.
- [ ] `PainMap.checkOverflow()` run on the rendered page, findings reported.
- [ ] No hardcoded colours or spacing outside the Figma-derived literals, which are commented.

---

## 4. Open — do not build now
- **Row hover state** — Hadar wants one, not designed yet. **Raise before motion is closed.**
- Tab-content transition (the toggle's own movement already ships in phase 1).
- Illustration animation: the tab-switch transition is specced in §6. Any other motion inside a settled illustration: none designed.
- Figma frame `closed` (`2003:51642`) still shows the old circle button; update it to the plus or delete it so it cannot mislead.

## 5. Open — content, decide later (Hadar, 28 Oct)
- **Source caption.** The article workbench's note on this visual: the caption must say the numbers come from public studies, not the partner banks' own research. Not in Figma. Not built.
- **Block headline** (above the tabs): placeholder until Hadar supplies it (§2).

---

## 6. Illustration transition on tab switch (phase 2b, 29 Oct 2026)

Status: specced and approved by Hadar in a playable reference. Build not started. Commit this spec before building.

> **Conflict rule.** Same as the top of this file: if any number here conflicts with the existing layout or code, the existing source wins. STOP and report.

### 6.0 Definition of done
- **What Hadar looks at:** `/case-studies/personetics/`, section 04, next to the approved reference: artifact "Pain Map Transition", `https://claude.ai/artifact/XeYZJSEUBGKMkVWsf3AmQj`, version 9, speed slider at 1.20. She switches between every pair of tabs in both directions, switches again in the middle of a move, and clicks the tab that is already selected.
- **The numbers that matter** (playback speed 1.2×, derived from the beats below): arriving takes Plan 646 ms, Save 763 ms, Spend 812 ms; leaving takes 1 / 1.4 of that. A build more than 15% off is a defect: report it, do not tune it. The settled illustration equals the static one in §1.4 (same look as the static partial), and every position in the block is unchanged.
- **Out of scope:** the number, label and rows still swap instantly on click, exactly as in phase 1 (their transition is a separate open item); row motion; hover; commit (Hadar QAs first).

### 6.1 Purpose (animation-planning-standard §1)
State indication and delight. The illustration shows which tab is active. Every illustration is born from and returns to the same seed, so any tab can hand over to any other.

### 6.2 What happens
Times below are at 1.0×, the reference's own clock. The page plays everything 1.2× faster (§6.9, item 6).

**The seed:** a black circle, radius 5, at the illustration's centre (114, 94). Every illustration starts from it and ends in it.

**Leaving a tab** plays the arrival of that tab backwards from the current moment, 1.4× faster, down to the seed. **Arriving** plays forwards from the seed. Switching again mid-move reverses from wherever the motion is.

| Tab | Beats (ms, 1.0×) | Total (1.0×) |
|---|---|---|
| Plan | 0–300 the black ellipse (layer 4) grows from the seed circle to its own width, 0–200 to its own height. 180–600 it travels down to its place at the bottom. The other rings leave the seed's shape one after another (start 190 + 35 × n, n = order by distance from the centre, 380 each) and open to their own shape and place, fading in over the first 30%. When the dotted ring is 75% in place, the red ellipse (layer 2) appears on it and rises to the top (340). Items pop on their rings from scale 0, each at its own seeded time, with a spin. | 775 |
| Save | 0–240 the seed splits in two (liquid), 130–380 each splits again, giving four dots. Each dot stretches into its line like liquid: it gets thinner as it gets longer, no shrink step (starts 380, 405, 430, 455; 300 each). Items pop on their lines at seeded times. | 915 |
| Spend | 0–240 the seed splits and the halves fly apart: one to the left end of the lower line, one to the right end of the upper line. 200 and 230 (360 each) each draws its line back across the artboard as a pen, shrinking to hairline thickness and vanishing at the far end. When both lines have crossed the middle of the artboard, the scalloped ring (layer 4) spins in (300). 160 ms later the other objects pop in between the lines, the boat first. | 974 |

At 1.2×: 646, 763 and 812 ms. Totals are derived, not fixed.

### 6.3 Behaviour
- Load state: Spend selected, its illustration settled. No entrance at load, nothing waits on `ViewportGate`.
- The transition starts only from a click on a tab button. `setTab` and `checkOverflow` run without starting it.
- Clicking the selected tab does nothing.
- The animation loop runs only while something moves and stops once the target scene is settled.
- Everything outside the illustration behaves as in phase 1 (§1.7, phase 2 row motion).

### 6.4 Reduced motion (standard §8)
The illustration tells which tab is active, so it still changes. No splits, drawing, travel, spin or pop. On a tab click: the illustration fades out over 75 ms, swaps to the target's settled state, fades in over 75 ms, linear.

### 6.5 Exceptions to the animation standard, stated
- **Elements pop from scale 0.** Hadar's call. The standard says never scale(0) on an entrance.
- **Not transform/opacity only:** the dots and pens are SVG attributes, Spend's lines are revealed by `stroke-dashoffset`, and the splits use an SVG filter (metaball, the same technique as the problem statement). All of it sits on small elements and runs under 1 s. The filter is removed once its blur reaches 0.
- **Duration is above the UI ceiling** (standard §0, 300 ms). Hadar set the speed by eye on the reference.
- **Leaving is the arrival played backwards**, so exits ease in. Accepted.
- **User-triggered, not a scripted narrative scene**, but every frame is still a pure function of `(scene, t)`: no accumulated state.

### 6.6 Paint order (standard §7a)
Static, fixed DOM order, valid because it never changes during the motion: Plan keeps the partial's own order. Save: the four dots (which become the lines) first, then all items, so the lines are always behind the objects. Spend: the two lines, then the two pens, then the items.

### 6.7 Markup and CSS (Claude's call; layout positions do not change)
- One illustration stage replaces the three per-panel illustrations. `.pain-map__left` becomes `display: flex; flex-direction: column; gap: var(--spacing-32); box-sizing: border-box; padding: 79.5px var(--spacing-32) 0 0` (the values `.pain-map__left-panel` has today). `.pain-map__left-panel` keeps only `.pain-map__left-text` and loses its height, padding and gap.
- `.pain-map__illustration` (228 × 188, `position: relative`) contains three `.pain-map__scene` boxes, one per tab (`data-tab`), each `position: absolute; inset: 0` and holding that tab's existing SVG partial. Without JS only the Spend scene is visible.
- A zero-size, absolutely positioned `<svg>` inside `.pain-map__illustration` holds the one metaball filter (`filterUnits="userSpaceOnUse" x="0" y="0" width="228" height="188"`). It is not `display: none`, because a filter inside a `display: none` SVG does not apply.
- The three partials stay plain static SVG, unchanged. The script prepares them at init (§6.9).
- New file `js/personetics/pain-map-illustration.js`, loaded from the Personetics page the way `pain-map.js` is. It listens to the tab buttons' clicks itself.

### 6.8 Reference code (approved, version 9): port this, do not re-derive
Where the prose and the code disagree, the code wins. This is the engine from the playable page. The page's own controls (speed, shrink, rapid switching, scrub, readout) are not ported.

```js
// ---------- Easing: project tokens (animation-planning-standard §2) ----------
function bezier(x1, y1, x2, y2) {
  const f = (a, b, t) => 3 * a * (1 - t) * (1 - t) * t + 3 * b * (1 - t) * t * t + t * t * t;
  return function (x) {
    if (x <= 0) return 0; if (x >= 1) return 1;
    let lo = 0, hi = 1, t = x;
    for (let i = 0; i < 28; i++) { t = (lo + hi) / 2; if (f(x1, x2, t) < x) lo = t; else hi = t; }
    return f(y1, y2, t);
  };
}
const EASE_OUT = bezier(0.23, 1, 0.32, 1);          // entering / exiting
const EASE_IO = bezier(0.77, 0, 0.175, 1);          // moving / morphing on screen
const POP = bezier(0.175, 0.885, 0.32, 1.275);      // entrance overshoot
const clamp = v => v < 0 ? 0 : v > 1 ? 1 : v;
const seg = (t, start, dur, ease) => ease(clamp((t - start) / dur));
const lerp = (a, b, k) => a + (b - a) * k;
const $ = id => document.getElementById(id);

const CX = 114, CY = 94, SEED_R = 5;
let shrinkR = 5;                 // dot radius just before it stretches into a line
const EXIT_FACTOR = 1.4;           // exits play 1.4x faster than entrances
// Seeded, never Math.random(): a scrub must reproduce the same frame.
const JITTER = [0, 70, 25, 100, 45, 85, 10, 60, 110, 35, 90, 15, 55, 95, 30, 75, 5, 65];

const root = $("stage");
const sceneEls = { plan: $("scene-plan"), save: $("scene-save"), spend: $("scene-spend") };
function bboxOf(g) { const b = g.getBBox(); return { cx: b.x + b.width / 2, cy: b.y + b.height / 2, w: b.width, h: b.height }; }
const pe = scene => Array.prototype.slice.call(sceneEls[scene].querySelectorAll(".pe")).map(g => Object.assign({ g, i: +g.dataset.i }, bboxOf(g)));

// Non-scaling strokes are measured in screen pixels, so their weight follows the stage's display scale (2x here, 1x on the page).
const strokeEls = Array.prototype.slice.call(document.querySelectorAll("[vector-effect]")).map(el => ({
  el, w: parseFloat((el.getAttribute("style").match(/stroke-width:([\d.]+)/) || [0, 1])[1]),
  dash: (el.getAttribute("stroke-dasharray") || "").split(/[\s,]+/).filter(Boolean).map(Number)
}));
function applyStrokeScale() {
  const k = root.getBoundingClientRect().width / 228;
  strokeEls.forEach(s => {
    s.el.style.strokeWidth = (s.w * k).toFixed(3);
    if (s.dash.length) s.el.style.strokeDasharray = s.dash.map(v => (v * k).toFixed(3)).join(" ");
  });
}
applyStrokeScale(); window.addEventListener("resize", applyStrokeScale);

// ---------- PLAN: the black bottom ellipse is the seed. It starts as the small circle, grows to its own shape,
// then travels down to the bottom of the stack while the other five rings peel off the same spot. ----------
const PLAN_BLACK = 4, PLAN_RED = 2, PLAN_DOTTED = 9;                                             // layer 4 = the black ellipse at the bottom
const PLAN_RING_LINES = [2, 3, 4, 5, 7, 9];
const PLAN_ITEM_PARENT = { 6: 3, 8: 5, 10: 9, 11: 7, 12: 3, 13: 9 };   // item layer -> the ring it sits on
const PLAN_ROT = { 6: -40, 8: 25, 10: 90, 11: 30, 12: 0, 13: -30 };

function makePlan() {
  const all = pe("plan");
  const rings = all.filter(e => PLAN_RING_LINES.includes(e.i));
  const items = all.filter(e => PLAN_ITEM_PARENT[e.i]);
  const black = rings.find(r => r.i === PLAN_BLACK);
  const red = rings.find(r => r.i === PLAN_RED), dotted = rings.find(r => r.i === PLAN_DOTTED);
  const others = rings.filter(r => r !== black && r !== red).sort((a, b) => Math.abs(a.cy - CY) - Math.abs(b.cy - CY));
  black.start = 180; black.dur = 420;
  others.forEach((r, n) => { r.start = 190 + 35 * n; r.dur = 380; });
  // The red ellipse is born on the dotted ring (same colour, same shape) once that ring is nearly in place, then rises to the top.
  let tRed = 0;
  while (seg(tRed, dotted.start, dotted.dur, EASE_OUT) < 0.75) tRed++;
  red.start = tRed + 40; red.dur = 340; red.fadeStart = tRed;
  items.forEach((it, n) => {
    it.ring = rings.find(r => r.i === PLAN_ITEM_PARENT[it.i]);
    it.start = it.ring.start + 170 + JITTER[n];
    it.dur = 260;
  });
  const T = Math.max.apply(null, rings.map(r => r.start + r.dur).concat(items.map(i => i.start + i.dur)));
  const bRx = black.w / 2, bRy = black.h / 2;
  function render(t) {
    // The black ellipse's current shape: circle r5 -> its own width, then its own height.
    const sxB = lerp(SEED_R / bRx, 1, seg(t, 0, 300, EASE_IO)), syB = lerp(SEED_R / bRy, 1, seg(t, 0, 200, EASE_OUT));
    black.k = seg(t, black.start, black.dur, EASE_OUT);
    black.g.setAttribute("transform", `translate(${black.cx} ${lerp(CY, black.cy, black.k)}) scale(${sxB} ${syB}) translate(${-black.cx} ${-black.cy})`);
    others.forEach(r => {
      r.k = seg(t, r.start, r.dur, EASE_OUT);
      // Each ring leaves the seed's own shape, then opens to its own.
      const Y = lerp(CY, r.cy, r.k), sx = lerp(sxB, 1, r.k), sy = lerp(syB * bRy / (r.h / 2), 1, r.k);
      r.g.setAttribute("transform", `translate(${r.cx} ${Y}) scale(${sx} ${sy}) translate(${-r.cx} ${-r.cy})`);
      r.g.style.opacity = clamp(r.k / 0.3);
    });
    red.k = seg(t, red.start, red.dur, EASE_OUT);
    red.g.setAttribute("transform", `translate(${red.cx} ${lerp(dotted.cy, red.cy, red.k)}) scale(1 ${lerp((dotted.h / 2) / (red.h / 2), 1, red.k)}) translate(${-red.cx} ${-red.cy})`);
    red.g.style.opacity = seg(t, red.fadeStart, 80, x => x);
    items.forEach(it => {
      const s = seg(t, it.start, it.dur, POP), rot = PLAN_ROT[it.i] * (1 - seg(t, it.start, it.dur, EASE_OUT));
      const dy = (1 - it.ring.k) * (CY - it.ring.cy);
      it.g.setAttribute("transform", `translate(0 ${dy}) translate(${it.cx} ${it.cy}) rotate(${rot}) scale(${Math.max(s, 0.0001)}) translate(${-it.cx} ${-it.cy})`);
      it.g.style.opacity = s > 0.001 ? 1 : 0;
    });
  }
  return { T, render };
}

// ---------- SAVE: seed circle splits 1 -> 2 -> 4 (liquid), each dot stretches into its line, items pop ----------
const SAVE_LINES = [68.75, 119.75, 18.75, 170.75];     // centre of each hairline; first two are the inner pair
function makeSave() {
  const items = pe("save");
  const dots = Array.prototype.slice.call(document.querySelectorAll(".sd"));
  const lineStart = [380, 405, 430, 455];
  items.forEach((it, n) => {
    let best = 0;
    SAVE_LINES.forEach((y, li) => { if (Math.abs(y - it.cy) < Math.abs(SAVE_LINES[best] - it.cy)) best = li; });
    it.line = best;
    it.start = lineStart[best] + 120 + JITTER[n % JITTER.length];
    it.dur = 240;
    it.rot = it.g.querySelector("image") ? (n % 2 ? 25 : -25) : it.g.querySelector("circle") ? 0 : (n % 2 ? 90 : -90);
  });
  const T = Math.max.apply(null, items.map(i => i.start + i.dur).concat(lineStart.map(s => s + 300)));
  const goo = $("gooBlur"), dotsG = $("save-dots");
  function render(t) {
    const s1 = seg(t, 0, 240, EASE_IO), s2 = seg(t, 130, 250, EASE_IO);
    const yA = lerp(CY, SAVE_LINES[0], s1), yB = lerp(CY, SAVE_LINES[1], s1);
    const ys = [yA, yB, lerp(yA, SAVE_LINES[2], s2), lerp(yB, SAVE_LINES[3], s2)];   // inner A, inner B, outer A, outer B
    const gooK = 1 - seg(t, 240, 90, x => x);
    const r = lerp(SEED_R, shrinkR, seg(t, 300, 140, EASE_IO));   // dots get smaller first
    dots.forEach((d, i) => {
      const hk = seg(t, lineStart[i], 300, EASE_OUT);
      const w = lerp(2 * r, 228, hk);
      const h = Math.max(0.5, (4 * r * r) / w);   // stretches like liquid: the thinner, the longer, no pause
      d.setAttribute("x", CX - w / 2); d.setAttribute("y", ys[i] - h / 2);
      d.setAttribute("width", w); d.setAttribute("height", h); d.setAttribute("rx", h / 2);
      d.style.fill = `color-mix(in srgb, #6b6c72 ${(hk * 100).toFixed(1)}%, #393a3d)`;
    });
    if (gooK > 0.02) { goo.setAttribute("stdDeviation", (SEED_R * 0.5 * gooK).toFixed(2)); dotsG.setAttribute("filter", "url(#goo)"); }
    else dotsG.removeAttribute("filter");
    items.forEach(it => {
      const s = seg(t, it.start, it.dur, POP), rot = it.rot * (1 - seg(t, it.start, it.dur, EASE_OUT));
      it.g.setAttribute("transform", `translate(${it.cx} ${it.cy}) rotate(${rot}) scale(${Math.max(s, 0.0001)}) translate(${-it.cx} ${-it.cy})`);
      it.g.style.opacity = s > 0.001 ? 1 : 0;
    });
  }
  return { T, render };
}

// ---------- SPEND: the seed splits in two and the halves fly apart, one to the left end of the lower line and one to the
// right end of the upper line. Each draws its line back across the artboard as a pen (as in the problem-statement entrance),
// shrinking to hairline as it goes. When both lines have crossed the middle, the scalloped ring pops in; once it is nearly
// in place the rest of the objects pop in between the lines. ----------
const SPEND_LINES = [   // origin = where the pen starts, (ux, uy) = unit direction it draws in, from the Figma line transforms
  { i: 2, ox: 5, oy: 94.6499023, ux: 0.9874613285, uy: 0.1578612030, len: 218.134369, rev: false },   // lower line: drawn left to right
  { i: 3, ox: 225.9348, oy: 41.2487, ux: -0.9963000417, uy: 0.0859434158, len: 221.729202, rev: true }  // upper line: drawn right to left
];
const SPEND_RING = 4;                                                       // layer 4 = the scalloped ring
const SPEND_DELAY = [60, 0, 110, 80, 40, 100, 70, 30, 90, 50, 20, 120];     // seeded
function makeSpend() {
  const all = pe("spend");
  const lines = SPEND_LINES.map(L => Object.assign({ el: all.find(e => e.i === L.i).g.querySelector("line") }, L));
  lines.forEach(L => L.el.setAttribute("stroke-dasharray", `${L.len} ${L.len}`));
  const penStart = [200, 230], penDur = 360;
  const penX = (t, n) => {
    const L = SPEND_LINES[n];
    return lerp(CX, L.ox, seg(t, 0, 240, EASE_IO)) + L.ux * L.len * seg(t, penStart[n], penDur, EASE_IO);
  };
  // The ring starts when both pens have crossed x = 114 (the middle of the artboard).
  let crossed = [null, null];
  for (let ms = 0; ms <= 1000 && (crossed[0] === null || crossed[1] === null); ms++) {
    if (crossed[0] === null && ms >= penStart[0] && penX(ms, 0) >= CX) crossed[0] = ms;
    if (crossed[1] === null && ms >= penStart[1] && penX(ms, 1) <= CX) crossed[1] = ms;
  }
  const ringStart = Math.max(crossed[0], crossed[1]), ringDur = 300, restBase = ringStart + 160;   // the rest start as the ring nears its place
  const items = all.filter(e => e.i > 3);
  items.forEach((it, n) => {
    const boat = it.i === 9, ring = it.i === SPEND_RING;
    it.start = ring ? ringStart : restBase + (boat ? 0 : 40 + SPEND_DELAY[n % SPEND_DELAY.length]);
    it.dur = ring ? ringDur : boat ? 320 : 260;
    const hasImg = !!it.g.querySelector("image"), hasCircle = !!it.g.querySelector("circle");
    it.rot = ring ? -100 : boat ? -8 : hasImg ? (n % 2 ? 22 : -22) : hasCircle ? 0 : (n % 2 ? 100 : -100);
  });
  const pens = Array.prototype.slice.call(document.querySelectorAll(".sp"));
  const T = Math.max.apply(null, items.map(i => i.start + i.dur).concat(penStart.map(s => s + penDur)));
  const goo = $("gooBlur"), pensG = $("spend-pens");
  function render(t) {
    const s = seg(t, 0, 240, EASE_IO);
    lines.forEach((L, n) => {
      const k = seg(t, penStart[n], penDur, EASE_IO);
      L.el.setAttribute("stroke-dashoffset", ((L.rev ? -1 : 1) * L.len * (1 - k)).toFixed(2));
      L.el.parentNode.style.opacity = k > 0 ? 1 : 0;
      pens[n].setAttribute("cx", lerp(CX, L.ox, s) + L.ux * L.len * k);
      pens[n].setAttribute("cy", lerp(CY, L.oy, s) + L.uy * L.len * k);
      pens[n].setAttribute("r", lerp(SEED_R, 0.3, k));
      pens[n].style.opacity = k >= 0.999 ? 0 : 1;
    });
    const gooK = 1 - seg(t, 100, 130, x => x);
    if (gooK > 0.02) { goo.setAttribute("stdDeviation", (SEED_R * 0.5 * gooK).toFixed(2)); pensG.setAttribute("filter", "url(#goo)"); }
    else pensG.removeAttribute("filter");
    items.forEach(it => {
      const p = seg(t, it.start, it.dur, POP), rot = it.rot * (1 - seg(t, it.start, it.dur, EASE_OUT));
      it.g.setAttribute("transform", `translate(${it.cx} ${it.cy}) rotate(${rot}) scale(${Math.max(p, 0.0001)}) translate(${-it.cx} ${-it.cy})`);
      it.g.style.opacity = p > 0.001 ? 1 : 0;
    });
  }
  return { T, render, ringStart };
}

// All scenes are measured while visible, then one is shown at a time.
const SCENES = { plan: makePlan(), save: makeSave(), spend: makeSpend() };
function show(scene) { for (const k in sceneEls) sceneEls[k].style.display = k === scene ? "" : "none"; }

// ---------- Driver: any tab to any tab ----------
// State is (scene, t). Not on the target tab: run t back to 0 (the seed, identical in every scene), swap, run forward.
// Switching again mid-move just reverses t from wherever it is, so interruptions are continuous.
let scene = "plan", t = SCENES.plan.T, target = "plan", speed = 1, scrubbing = false, last = performance.now();
function draw() { show(scene); SCENES[scene].render(t); }
function frame(now) {
  const dt = Math.min(64, now - last) * speed; last = now;
  if (!scrubbing) {
    if (scene !== target) { t -= dt * EXIT_FACTOR; if (t <= 0) { scene = target; t = 0; } }
    else t = Math.min(SCENES[scene].T, t + dt);
    draw();
  }
  readout();
  requestAnimationFrame(frame);
}
```

### 6.9 What changes in the port (everything else is copied)
1. **Layers.** At init, wrap each element child of each partial's `<svg>` in `<g class="pe" data-i="N">`, with N = 2 + the child's position (0-based) among the SVG's element children. This reproduces the layer numbers used above: Plan 2–13, Save 2–… , Spend 2–14. Do this before measuring.
2. **Scenes.** `sceneEls.plan/save/spend` = the three `.pain-map__scene` boxes; `root` = `.pain-map__illustration`. All three are visible while the engine measures bounding boxes (once, at init, with no transforms applied); then only the active one is shown.
3. **Plan strokes.** Set `vector-effect="non-scaling-stroke"` on the shapes inside layers 3, 5, 7 and 9 (the stroked rings). Keep `applyStrokeScale`; on the page the display scale is 1.
4. **Save lines.** Remove the partial's four hairline layers (2–5). Insert a `<g class="pe-free">` of four `<rect>` dots *before* the remaining layers; the reference's `.sd` becomes `.pain-map-save-dot`, `#save-dots` becomes an element with a class, not an id. In the port, the layer numbers used by Save's items are unaffected because items are located by position, not number.
5. **Spend lines and pens.** Layers 2 and 3 get their dash reveal from the engine. Insert two `<circle>` pens in a group after layer 3 and before layer 4; `.sp` becomes `.pain-map-spend-pen`.
6. **Playback speed.** `speed = 1.2` as a named constant `PLAYBACK`. Remove `scrubbing`, `readout`, the shrink slider (`shrinkR` becomes the constant 5) and the demo's `scene = "plan"` start: the start scene is `spend`, settled (`t = T`).
7. **Loop.** `frame` is started by a click and cancels itself when `scene === target` and `t >= T`.
8. **Tokens.** No hex values: the dot and pen fill is `var(--primitive-black)`; the stretch colour is `color-mix(in srgb, var(--primitive-grey-dark) X%, var(--primitive-black))`. Ids and classes carry the `pain-map-` prefix (for example `pain-map-goo`, `pain-map-goo-blur`).
9. **Tab clicks.** `setTarget(id)` is called from the tab buttons' click listener only. Reduced motion follows §6.4.
10. **Seekable and seeded.** Keep every position a pure function of `(scene, t)`, and the `JITTER`, `SPEND_DELAY`, `PLAN_ROT` arrays as given. No `Math.random()`.

### 6.10 Checklist for the build (Claude Code reports each as pass / fail / not measured)
- Settled Plan, Save and Spend look the same as the static partials (compare each at 1× in the browser, not across a screenshot).
- Measured in the page: each scene's arrival total at 1.2× (§6.0) and the 15% rule.
- Every pair of tabs, both directions, plays through the seed; no frame shows a hard cut.
- Switching mid-move reverses smoothly; the same tab does nothing.
- Save's lines are behind the objects in every frame; Spend's ring starts after both lines cross the middle.
- No hex value in any file touched; no `Math.random()`; ids and classes prefixed.
- Reduced motion: fade 75 + 75 ms, no other motion.
- `PainMap.checkOverflow()` still returns the same findings as before (it must not start a transition).
- Phase 1 and the row motion behave exactly as before.
