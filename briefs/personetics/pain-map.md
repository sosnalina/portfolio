# Personetics — Pain map (visual spec)

Section 04 (Mind the gap / Discovery & Problem Definition), between body paragraphs 1 and 2.
Scope doc: `briefs/personetics/personetics-build-scope.md`. This file holds every value for this visual, static and motion. The scope doc only links here.

Status (29 Oct 2026): phase 1 built and QA'd by Hadar (commit d63dc6d). Phase 2 (drawer motion + close control) specced and approved in a playable reference, below (§3). Phase 2 build not started. Still open: §4.

> **Conflict rule.** If any number in this spec conflicts with the existing layout or code, the existing source wins. STOP and report. Do not redesign, flatten or substitute your own markup.
>
> **One exception:** where §1.6, §1.7, §1.11 and §3 replace something phase 1 built (the circle button, the fixed 21px padding, instant open/close, no close control), this spec wins over the built phase-1 code. That is the point of phase 2.

---

## 0. Definition of done

### Phase 1 — static + tab toggle (done)
- **What Hadar looks at:** `/case-studies/personetics/`, section 04: the pain map, overlaid against Figma. All 3 tabs, every row opened.
- **Motion included:** only the tab toggle's existing movement, duplicated from the Bill Pay cockpit widget. Tab content swaps instantly.
- **Numbers that matter:** block 800 × 654; right column 540 × 526 in every state; no scrollbar anywhere, inside or outside the block.
- **Out of scope:** illustrations (grey placeholder boxes only), row hover state, commit.

### Phase 2 — row open/close motion
- **What Hadar looks at:** `/case-studies/personetics/`, section 04, side by side with the approved reference (artifact "Pain Map Drawer", `https://claude.ai/artifact/8pD6yYdLc6H3cbZaKUqJ4L`, version 7) and overlaid against Figma frame `open` (node `2004:51829`) and the open row (node `2004:51870`). Every tab; every row opened and closed; the 5-quote row in the third tab; tab switching with a row open.
- **Behaviour she checks:**
  - Opening a row: the drawer grows from the header downward, the number and title scale up while moving into place, the quotes appear one after another, the plus turns into a minus. Other rows shrink at the same time. One continuous motion.
  - Clicking the open row's header (number, title or minus) closes it, by the reverse motion; the quotes are gone before the drawer shuts on them.
  - Opening another row while one is open: the open one closes and the new one opens at the same time.
  - Switching tabs: all rows closed, nothing animates inside the block (the toggle's pill still moves).
- **Numbers that matter:** drawer 200 ms, `cubic-bezier(0, 0, 0.58, 1)`; plus/minus turn 110 ms; quotes 300 ms fade + 8px rise, first quote starts 60 ms in, 60 ms between quotes; closing quotes fade 150 ms, no stagger. Row paddings per §3.4. Right column stays 540 × 526 in every frame of the motion.
- **Out of scope:** illustrations and their animation, tab-content transition, row hover state, commit (Hadar QAs first).

---

## 1. Static

Build type: **new structure, with one duplicated part** (the tab toggle, §1.3). Everything else is built new from this spec. Pattern: a macro `painMap(data)` in `_includes/personetics/pain-map.njk`, CSS in `css/widgets/personetics/pain-map/pain-map.css`, JS in `js/personetics/pain-map.js`.

### Sources
| Element | Source |
|---|---|
| Whole block | Figma file `3XG9JnADI2psNR3B7TwQdx`, page "Perso illustration new", 800 × 654. **Use frame `open` (`2004:51829`) and the open row (`2004:51870`).** Frame `closed` (`2003:51642`) is stale: it still shows the old circle button. Do not use it. |
| Tab toggle | **Duplicate** the Bill Pay cockpit widget toggle (its markup, JS and existing movement). Change only what §1.3 lists. Pre-flight names the exact source file. |
| Text | Text sync from the Pain Map Workbench (§2). Never typed by hand. Figma copy is placeholder only. |
| Illustrations | Not in this build. Grey placeholder box (§1.4). |
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

### 1.4 Illustration placeholder
- 228 × 188 box, plain light grey fill, no text, no border. Use the existing grey-light primitive token (pre-flight names it).
- Same box in every tab.

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
- The whole closed row is clickable (cursor pointer). In an open row only the header (number, title, minus) is clickable, cursor pointer there; the quotes are not.
- No other hover change (open item, §4).

**Quotes** (inside the drawer)
- 19px below the header (the drawer's top padding), horizontal padding 32 (content 476 wide).
- One paragraph per quote, Literata Light Italic 300, **12px, line-height 17.5px** (Hadar, 28 Oct, for readability; Figma has 11/16), `--primitive-black`, 8px between paragraphs, exactly as synced. *The reference artifact uses 11/16; the build uses 12/17.5.*

### 1.7 Behaviour — replaced in phase 2
- Clicking a closed row opens it and closes any other open row, in one motion (§3).
- Clicking the header of the open row closes it (new close control: the minus).
- Clicking the quotes of an open row does nothing.
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
Illustrations and their animation; tab-content transition; row hover state; the headline and left column (they never move).

### 3.7 Approved values still carrying an assumption
- Quote rise **8px** is Claude's default, not drawn in Figma. Hadar saw it in the reference and did not change it. Confirm in browser.
- Scaled number/title are 0.44px different from a true 27px / 14px layout in places (sub-pixel; accepted).

### 3.8 Reference code — port this, do not re-derive
Source: artifact "Pain Map Drawer", version 7, approved by Hadar 29 Oct. **Port this. Code wins over any prose above; if the two disagree, STOP and report.** Only the pain map is pasted (not the test strip, the placeholder data, the page chrome, or the tab toggle).

**What changes in the port (and nothing else):**
- Class names: reference → built BEM, `pain-map-row` family. `.row` → `.pain-map-row`; `.row__inner` → `.pain-map-row__inner`; `.row__head` → `.pain-map-row__head`; `.row__text` → `.pain-map-row__text`; `.row__num` → `.pain-map-row__number`; `.row__title` → `.pain-map-row__title`; `.tg` → `.pain-map-row__toggle`, its svgs `.pain-map-row__toggle-plus` / `-minus`; `.quotes` → `.pain-map-row__quotes`, `.quotes__in` → `.pain-map-row__quotes-inner`, its `p` → `.pain-map-row__quote`; `.is-open` → the existing open modifier `.pain-map-row--open` (pre-flight confirms its name). Pre-flight confirms the other existing names.
- Tokens: reference colour and font variables (`--primitive-*`, `--serif`) → the built tokens (`--primitive-red-dark`, `--primitive-grey-dark`, `--primitive-black`, the `--text-pain-map-*` set, "Literata Optical"). Spacing numbers that match an existing spacing token use the token (32 → `--spacing-32`, 8 → `--spacing-8`, 48 → `--spacing-48` if it exists); the rest (19, 21.24, 16.04, 5.96, 59.44 …) are Figma-derived values and stay literal with a comment saying where they come from.
- Quote font: **12px / 17.5px** (the reference has 11 / 16).
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

### 3.9 Checklist for the build (Claude Code reports each as pass / fail / not measured)
- [ ] Right column is exactly 540 × 526 in every frame: all closed, each row open, mid-motion. No scrollbar anywhere.
- [ ] Row padding values within 0.5px of §1.6's check values (all closed, four quotes, five quotes).
- [ ] Number 40px / title 16px when open; scaled to 27px / 14px visual when closed.
- [ ] Beats table matches: 200 / 110 / 300, stagger 60 + 60, close 150 (read from the computed styles).
- [ ] Closed row: click anywhere opens. Open row: header click closes, quotes click does nothing.
- [ ] Tab switch resets with no animation; load state all closed.
- [ ] Reduced motion per §3.3.
- [ ] `PainMap.checkOverflow()` run on the rendered page, findings reported.
- [ ] No hardcoded colours or spacing outside the Figma-derived literals, which are commented.

---

## 4. Open — do not build now
- **Row hover state** — Hadar wants one, not designed yet. **Raise before motion is closed.**
- Tab-content transition (the toggle's own movement already ships in phase 1).
- Illustration animations — Hadar designs them with another agent; each tab's illustration replaces its grey box at 228 × 188.
- Figma frame `closed` (`2003:51642`) still shows the old circle button; update it to the plus or delete it so it cannot mislead.

## 5. Open — content, decide later (Hadar, 28 Oct)
- **Source caption.** The article workbench's note on this visual: the caption must say the numbers come from public studies, not the partner banks' own research. Not in Figma. Not built.
- **Block headline** (above the tabs): placeholder until Hadar supplies it (§2).
