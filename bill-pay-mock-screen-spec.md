# Bill Pay — Reusable SaaS Mock Screen — Build Spec

Build a fully-interactive Bill Pay mock screen as a **standalone iframe HTML file**. It will be embedded by multiple portfolio scenes at different container sizes and must scale proportionally. Do NOT plug it into any case study page — that's a separate step later.

**Success criterion is pixel-perfect against Figma.** Not "close." Not "consistent." Every color, spacing, font attribute, radius, shadow — exact match. Verified via computed styles + CDP, not screenshots. See §14.

---

## 1. Sources of truth

Figma file key: `qfIgkJTuD0k956262uOUSp` (`Batch-and-bulk`)

Pull all pixel-level values directly via Figma MCP. **Do not trust any measurement, color, font, radius, shadow, or spacing relayed in this spec** — every one of those values must come from Figma. Use `get_design_context` with `forceCode: true, clientLanguages: html,css` and `get_variable_defs` for tokens.

**Four templates** (each is a complete assembled screen — pull `get_metadata` first to see the structure, then `get_design_context` on relevant sub-nodes):
- Batch — full: `2964:601336`
- Batch — narrow: `2967:603443` (with drawer open)
- Bulk — full: `2204:168028`
- Bulk — narrow: `2926:18517` (with drawer open)

**Drawer variant** (opens when Edit is clicked on bank details inside the drawer):
- Bank details drawer: `2926:28446`

**Components frame** (all BP-prefixed cell / header / row / footer / icon components live here):
- Components: `2943:20738`

---

## 2. Naming rules — non-negotiable

- All components and styles referenced by this build must be `BP-` prefixed.
- If Claude Code encounters ANY non-`BP-`-prefixed component or style being used inside these templates (Dropdown, Button, Switch, radio, tabs, alert, helper text, calendar, etc.), **STOP** and report:
  - Which component/style
  - Which template + node ID it appears in
  - Hadar will convert it to `BP-` in Figma before you continue.
- **Hidden layers** (visibility toggled off in Figma) are leftovers from the source library. **Skip them entirely** — do not render, do not measure, do not reference.
- Case matters: reproduce exact Figma casing.

---

## 3. Deliverable

One iframe HTML file. Fully self-contained EXCEPT for a single stylesheet link at the top:

```html
<link rel="stylesheet" href="{RELATIVE_PATH_TO}/css/tokens.css">
```

Everything else — all mock-screen-specific CSS — lives inline in a `<style>` block in the same file. **Nothing new is added to `css/widgets/` or any other CSS folder.**

File placement: follow the existing walkthrough-gallery / accordion-gallery scene convention. Check where those scene HTMLs live in the repo and match. Report the path you chose.

Also create a **standalone demo/test-harness page at the repo root** (mirror `walkthrough-gallery.html` / `accordion-gallery.html` naming), that loads this mock-screen iframe in an unscaled 1440px viewport so Hadar can QA it directly.

---

## 4. Scale-to-fit — required

Native build width: **1440px** (matches Figma frame width).

The iframe must scale proportionally to fit whatever container it lands in, with no reflow:

- Wrap all content in a `.scaler` div with fixed `width: 1440px`.
- On load AND on window resize: iframe reads its own container width (`document.documentElement.clientWidth`), computes `scale = containerWidth / 1440`, applies `transform: scale({scale})` with `transform-origin: top left` to `.scaler`.
- Set the iframe body's height accordingly so scaled content doesn't overflow: `body.height = scalerHeight * scale`.
- Everything scales together as a single object — every element preserves its position, size, and centering relative to the 1440 base.

Success test: iframe embedded at 700px wide should render as an exact half-size version of the 1440 native, no reflow, no text wrap changes.

---

## 5. Screen layout (top → bottom)

Structure per the four templates. Pull each layer's exact position, size, gaps, padding, background, and shadow from Figma. Do not eyeball, do not round.

1. **`bp-Header`** — page header
   - "Schedule bill payment" title
   - "Pay from" dropdown (Chase checking …1234) — static, no interaction
   - "Combine multiple bills" section header + toggle: "Make one payment per vendor" — INTERACTIVE (§6.1)
   - "Total payment amount" (aggregated $) + "Total processing fees" (aggregated) — recompute on mode change / row change
   - `bp-close` X icon (top right)
2. **Gray section** — extends downward from the header. Contains the table body frame.
3. **`bp-table body`** (or similarly-named frame — pull exact name from Figma) — the white shadowed container that holds the actual table
   - Column header row (uses one of the header row variants — `header-narrow` variants Default / narrow depending on mode)
   - Body rows (uses `BP-Table row` variants: bulk-full / batch-full / bulk-narrow / batch-narrow depending on mode + drawer state)
   - Custom scrollbar on the right (see §7)
4. **`bp-footer`** — sticky to the bottom of the mock screen
   - Bills count + Vendors count + Payments count (each with a small icon + "primary" label)
   - Cancel button + Continue button
5. **Side drawer** — appears at right when Manage is clicked (§6.3)

Row area, column headers, footer, drawer — all pulled from templates. Do NOT reverse-engineer geometry from screenshots.

---

## 6. Behavior — fully interactive

### 6.1 Mode toggle: batch ↔ bulk

Toggle labeled "Make one payment per vendor" in `bp-Header`.

**Batch mode (default):**
- Every bill is one row using `BP-Table row / type=batch, size=full` (or `size=narrow` if drawer open).
- Footer: Bills = N, Vendors = M (unique vendors), Payments = N (= Bills).

**Bulk mode:**
- Bills grouped by vendor.
- Each vendor is one white "vendor summary" row using the `vendor bulk` cell + `Bulk Amount paid` cell (that shows the sum of that vendor's bill amounts).
- The vendor summary row is expandable (§6.2). When expanded, its individual bill rows show as gray sub-rows.
- Footer: Bills = N (unchanged), Vendors = M, **Payments = M (= Vendors)**.

**Aggregations on mode swap:**
- "Total payment amount" and "Total processing fees" in the header: recompute from the current mode's row set.

### 6.2 Bulk vendor row expand / collapse

- Small chevron sits left of the vendor name on each vendor summary row.
- **Collapsed (default):** chevron points DOWN. Sub-rows hidden.
- **Expanded:** chevron points UP. Sub-rows visible.
- **Figma spec is wrong here** — the Figma template shows the collapsed state with the chevron pointing UP. Do NOT follow Figma for this. Chevron rotates 180° between states; collapsed = down, expanded = up.
- Motion: §7.2.

### 6.3 Manage → drawer opens

- Every batch row has a "Manage" or "Review" link cell in the Action column. In bulk mode, only the vendor summary rows have Manage/Review — the individual bill sub-rows underneath do NOT have a Manage/Review link.
- Some rows show "Review" instead of "Manage" — pull this from Figma's row data. Both behave identically for this build (both open the drawer).
- **On Manage/Review click:**
  1. Table columns shift from full to narrow — swap all row/header instances to their `size=narrow` variants.
  2. Side drawer appears at right, populated with the clicked row's data.
  3. Motion: §7.3.
- **Drawer close:** X in the drawer's top-right — visible in Figma at node `2926:18560`. On click, reverse the open animation (see §7.3), remove drawer, restore full columns (with reverse column transition — see §7.3).

### 6.4 Bank details Edit → drawer content swap

- Inside the drawer, there is an "Edit" button attached to the bank details section.
- On click: the drawer's content swaps to the `bp-bank-details` template layout (node `2926:28446`). Same drawer container, different inner content.
- No close/reopen — inline content swap.
- No animation spec provided for this content swap — use a simple 200ms opacity crossfade of the inner content only.

### 6.5 Aggregation rules

Compute at render time; recompute whenever mode changes or a row's amount changes:

- **Total payment amount** (header, top right): sum of all rows' amount values in the current mode.
- **Total processing fees** (header, below total):
  - Batch mode: sum of all bill fees. With 13 bills × $1 = $13.
  - Bulk mode: sum of all PAYMENT fees. Bulk aggregates bills-per-vendor into ONE payment, and each payment has a $1 fee. So total = number of vendors × $1. With 5 vendors = $5.
- **Footer Bills count:** total number of bills (constant across modes).
- **Footer Vendors count:** number of unique vendors.
- **Footer Payments count:** in batch = Bills; in bulk = Vendors.
- **Batch row Processing Fee cell:** the bill's own fee ($1 in current data).
- **Bulk vendor row Processing Fee cell:** ALWAYS $1 (one payment = one fee, regardless of how many bills are aggregated under it). Do NOT sum the vendor's individual bill fees.
- **Vendor summary row `Bulk Amount paid`:** sum of that vendor's bill amounts.

### 6.6 Custom payment delivery flow (calendar)

**Naming alignment (radios and Custom tabs share names):**
The 4 radios in the drawer are Standard / Fast / Instant / Custom. The 3 Custom tabs are Standard / Fast / Instant. The first three names are the same across both — radios are the preset picks, Custom tabs let the user tweak within the same speed tier.

**Entry & exit:**
- Drawer opens with 4 radio options. Standard is selected by default.
- User clicks Custom radio → all 4 radios dissolve → calendar UI appears in their place, AND a "Show more" button appears to the right of the "Payment delivery options" section header.
- Click "Show more" → calendar dissolves → 4 radios reappear → Standard is selected (NOT Custom).
- "Show more" is ONLY visible while Custom view is active. Not visible in the default radio view.

**Radio option dates (Standard / Fast / Instant radios):**
Each of the three speed radios shows "Withdraw MM/DD → Arrives MM/DD" computed from the drawer's bill data using the business-buffer logic:
- Arrival = bill's due date − 1 day (safety buffer), then rolled BACK to the previous business day if that lands on a weekend. This normalized value is the anchor every radio's withdraw date counts back from — without it, the backward (radio) and forward (Custom tab) computations stop agreeing whenever due date − 1 falls on a weekend.
- Withdraw = normalized arrival − N business days (Standard = 5, Fast = 2, Instant = 0)
- Business day = weekday (Sat/Sun excluded)
- The old placeholder dates (02/07, 02/12) are wrong — replace with computed real dates.

**Calendar UI structure (Custom view):**
- Top: 3 tabs — Standard $0.50 / Fast $10.00 / Instant $15.00 (each showing its fee). Default active tab: Standard.
- Body: 2 calendars side by side (August 2025 + September 2025, matching the mock data date range). Vertical divider between them.
- Bottom: legend — 2 rows, each a colored dot + dynamic text:
  - "Withdraw [selected date]"
  - "Est. arrival [computed date]"

**Calendar composition (each of the 2 calendars):**
Stacked vertically:
1. **Month header** (`bp-calander-months-header`, 34px): shows month + year (e.g. "August 2025"), with `<` and `>` navigation arrows on either side. Arrows RENDER but are NON-FUNCTIONAL for this mock (all bills fall in Aug/Sept, no navigation needed).
2. **Days-of-week header** (`bp-calander-days-header`, 26px): S M T W T F S row.
3. **Divider** (1px).
4. **Date grid** (`bp-calander-frame`, 164px).

**Calendar components (Figma):**
- `bp-calander` (node `3014:150949`): days-of-week header + divider + date grid (172×197). Does NOT include the month header — that's a separate component composed above it in the drawer template.
- `bp-calander-months-header`: month name + arrows.
- `bp-calander-days` (node `2198:158509`): 8 date cell variants — Normal, Past Month, Range start (withdrawal), Range, Range end (arrival), Mid-right, Mid-left, Due date.
- `bp-tool-tip` (node `3013:121336`): 3 variants (left / middle / right needle position). See tooltip section below.

**Real dates required:**
- August 2025 + September 2025 with correct days of week. The current Figma mock shows "28" on every cell — that's placeholder. Use real calendar dates.

**Marks (per drawer's scope — batch = 1 bill, bulk = N bills for the vendor):**
- 1 Range start mark = withdrawal date (user-picked or default-computed)
- 1 Range end mark = arrival date (computed)
- Range cells (gray) fill weekdays between withdrawal and arrival
- N Due date marks (orange), one per bill in the drawer's scope
- **Collision rule:** if two bills share the same due date, they collapse to ONE mark on that cell (not stacked).

**Default dates when entering Custom (business buffer logic):**
- **Batch drawer (1 bill):** arrival = bill's due date − 1 day, rolled BACK to the previous business day if that lands on a weekend; withdrawal = normalized arrival − 5 business days (Standard tab default).
- **Bulk drawer (N bills):** arrival = **earliest** bill's due date − 1 day, rolled BACK to the previous business day if that lands on a weekend; withdrawal = normalized arrival − 5 business days. Payment must arrive before every bill's due date.
- Rationale: business wants money in account as long as possible while still paying every bill before its due date.
- Business day = weekday (Saturday and Sunday excluded). Roll back, never forward — arriving after the due date would be late.

**Tab logic (business days between withdrawal and arrival):**
- Standard → 5 business days
- Fast → 2 business days
- Instant → 0 business days (same day — arrival lands on the withdraw date)

**User interactions:**
- Click a valid calendar date → sets that as withdrawal date. Arrival auto-updates.
- Switch tabs → arrival recomputes with new N. Withdrawal persists across tab switches.
- Only the withdrawal date is user-controlled. Arrival and due date marks are display-only.

**Non-clickable cells (rendered in Past Month style — grayed out):**
- Weekend cells (Saturday, Sunday) — not valid withdrawal dates.
- Dates from adjacent months showing at grid edges (visual overflow of prior/next month) — already what "Past Month" style is for.
- Both use the same visual treatment; both are non-clickable.

**Tooltip component (structure only — do NOT wire up hover behavior yet):**
- `bp-tool-tip` has 3 variants distinguished by needle position: `left`, `middle`, `right`.
- Positioning rule (when eventually wired): date cell in the LEFT column of a calendar → use `left` variant; date cell in the RIGHT column → use `right` variant; middle columns → `middle` variant. Prevents tooltip from overflowing the calendar's edges.
- Build the component STRUCTURE so it's ready to wire; do NOT add hover triggers, content, or display logic in this pass.

**Deferred / do NOT build in this pass:**
- Tooltip hover behavior + content.
- Calendar month navigation (arrows render as visual-only, no click handler).

**Calendar rendering conventions — non-negotiable:**

These are standard calendar rules, not project-specific inventions. Any deviation is a bug, not a design choice.

- **Grid alignment:** the date grid is a strict 7-column × N-row grid. Every cell has the exact same width. Every row has the exact same height. No cells are wider, narrower, taller, or shorter than any other. The full grid fits the calendar container width exactly — no overflow, no unused whitespace at the edges.
- **Days-of-week header alignment:** the S / M / T / W / T / F / S column headers are positioned directly above the date columns they label. The "S" header sits above the Sunday column. The "M" above Monday. Etc. Column widths of the header row must match column widths of the date grid exactly.
- **Column order:** week starts Sunday (S M T W T F S), per Figma.
- **Vertical column alignment:** the date `28` in row 1 sits directly above the date `28` in row 2 (same column = same day of week). All dates in the same column line up vertically to the pixel.
- **Circular date marks are circles:** the withdrawal / arrival / due date marks are perfect circles — equal width and height. Do NOT stretch them into ovals to fit non-square date cells. The mark's diameter comes from Figma; the mark is centered inside its cell.
- **Gray range is continuous:** the gray fill between withdrawal date and arrival date is a single visual band, not a stack of separate rectangles per cell. No visible gaps between cells within the range. If the range spans multiple rows (a week boundary), each row's segment must abut the row above/below cleanly with no dead gap; the range visually reads as one contiguous highlight.
- **Adjacent-month cells:** dates from the previous month (shown at the top-left of the grid before the 1st of the current month) and from the next month (shown at the bottom-right after the last of the current month) must be rendered in the "Past Month" style (grayed out) — NOT blank, NOT omitted, NOT the same style as current-month dates.
- **Weekend cells:** rendered in Past Month style (same treatment as adjacent-month cells) — non-clickable, visually distinct from clickable weekdays.
- **No invented visuals:** if any visual detail isn't spelled out here or in Figma, STOP and ask. Do not invent styling, spacing, or behavior.

---

## 7. Motion specs

One consistent principle: **timings and easings below are the only source of truth. Anything not listed here uses no transition (state change is instant).**

### 7.1 Toggle (Make one payment per vendor)

- **Duration:** 300ms — both the container (background-color) and knob (transform).
- **Easing:** `cubic-bezier(0.4, 0, 0.2, 1)`.
- **Container:** background-color transitions between the off color and on color (both pulled from the BP-Switch component variants in Figma).
- **Knob:** `transform: translateX(0)` (off) ↔ `transform: translateX(D)` (on).
  - `D` = calculated from the BP-Switch dimensions: `switchWidth - knobWidth - (leftPadding + rightPadding)`. Do NOT hardcode `D`.
- **Hover:** while hovered, knob `transform: scale(0.95)` (composed with the translate). 300ms same easing.
- No bounce, no overshoot.

### 7.2 Bulk row expand / collapse

- **Mechanism:** container `height` transitions from `0` to natural content height and back. Content mounts BEFORE expand starts, unmounts AFTER collapse completes (not hidden, actually removed/inserted).
- **Duration:** auto-computed from content height:
  - `duration = max(225, min(15 * heightPx, 375))` ms
  - i.e. approximately 15ms per pixel of content, clamped to [225ms, 375ms].
- **Easing on expand:** `cubic-bezier(0.0, 0, 0.2, 1)`.
- **Easing on collapse:** `cubic-bezier(0.4, 0, 1, 1)`.
- **Chevron rotation:** synced with expand/collapse, same duration, same easing (respectively). 180° rotation.

### 7.3 Drawer open / close + table column collapse (one unified motion)

Drawer and column-collapse must feel like ONE motion, not two — same durations, same easings, running in parallel.

**Drawer container** — MUI Slide transition (right-anchored):
- Mechanism: `transform: translate3d()` on the drawer container.
  - Open state: `translate3d(0, 0, 0)`
  - Closed state: `translate3d(100%, 0, 0)` (fully off-screen right)
  - No opacity, no scale — pure translate.
- Open (enter): 225ms, `cubic-bezier(0.0, 0, 0.2, 1)` (decelerating).
- Close (exit): 195ms, `cubic-bezier(0.4, 0, 0.6, 1)` (sharp).
- Mount/unmount: drawer content mounts BEFORE the enter animation starts, unmounts AFTER the exit animation completes — not just hidden.

**Table columns collapsing (on drawer open) — 225ms, `cubic-bezier(0.0, 0, 0.2, 1)`, in parallel with drawer slide-in:**
- Each column that hides in narrow mode:
  - Content (cell inner element) `opacity: 1 → 0` over 150ms, starting at 0ms — fades out first.
  - Column `width` (and horizontal padding) `→ 0` over the full 225ms, starting at 0ms.
  - Content is fully gone by t=150ms; the last 75ms shrinks empty column width — no visible content-squish.
- All hidden columns animate in parallel (no stagger — single unified beat).
- Row heights stay unchanged.
- Table container total width auto-follows (if columns are flex/grid children) or animates in parallel to the sum of new widths (if fixed).

**Table columns re-expanding (on drawer close) — 195ms, `cubic-bezier(0.4, 0, 0.6, 1)`, in parallel with drawer slide-out:**
- Each column being restored:
  - `width` and padding `→ full` over 195ms, starting at 0ms.
  - Content `opacity: 0 → 1` over 195ms, starting at 0ms — fades in as column grows.
- Row heights stay unchanged.

**Column determination:** which columns hide in narrow mode is derived by comparing the batch-full row width (1247) vs batch-narrow row width (880) — same for bulk. Claude Code pulls both templates and identifies which columns disappear. Do not hardcode a column list.

### 7.4 Bank details content swap (§6.4)

- 200ms opacity crossfade of drawer inner content only.
- `cubic-bezier(0.4, 0, 0.2, 1)`.

---

## 8. Interactive-state rules

- Do NOT invent visual hover / active / focus / pressed states.
- For every interactive element (toggle, Manage/Review link, vendor expand chevron, drawer close X, drawer Edit button, footer buttons, radio buttons, tabs):
  - If a matching state variant exists in Figma (`property1=hover`, etc.) → use it exactly.
  - If no state variant exists in Figma → apply ONLY `cursor: pointer` on hover. No color change, no border, no scale. Nothing visual.
- If Hadar decides during QA that a visual state is needed, she'll add it in Figma and we'll rebuild that element.

---

## 9. Table scroll behavior

- Table body scrolls internally (all 13 batch rows exist; only a subset fits at any time).
- `overflow-y: auto` on the table body container.
- **No visible scrollbar.** Hide via:
  - `scrollbar-width: none;` (Firefox)
  - `-ms-overflow-style: none;` (legacy Edge/IE)
  - `::-webkit-scrollbar { display: none; }` (Chrome/Safari)
- Scroll behavior is preserved — user can still scroll through rows, just no visible scrollbar chrome.

---

## 10. Row data — pull from batch-full template

The batch-full template (`2964:601336`) is the **source of truth for all row content**. It contains 13 rows.

For each row, extract from Figma:
- Vendor name
- Bank payment / Check indicator (from `bp-bank-check` variants) + last-4 digits where shown
- Bill number
- Status (currently all "Approved")
- Due date
- Payment speed (currently all "Standard")
- On-time / off-time label (currently all "ON TIME")
- Fee ($)
- Balance ($)
- Amount ($) — this is the editable-looking value in the last content column (**treat as display-only for this build; not editable**)
- Action link: "Manage" or "Review" — pull the exact label per row from Figma

For bulk mode: group these 13 rows by vendor name. For each vendor:
- Build a summary row (using `vendor bulk` + `Bulk Amount paid` cells).
- Sum of that vendor's bill amounts populates `Bulk Amount paid`.
- The vendor's bills become sub-rows shown when the vendor row is expanded (§6.2).

For narrow templates (batch-narrow, bulk-narrow): the content is identical to the full templates — only the column set changes (some columns hide to make room for the drawer). Pull which columns are hidden by comparing the narrow row width (880) vs full row width (1247) — the missing columns are what disappear in narrow.

**Do NOT invent row content.** If any row's data is illegible or missing from Figma, STOP and report which row.

---

## 11. Drawer + radio button — build inline (no mother component)

Neither the drawer nor the radio button have a mother component in Figma. Both need to be reverse-engineered from where they appear:

- **Drawer:** appears in the batch-narrow, bulk-narrow, and bp-bank-details templates. Build its container (width, background, shadow, radius, padding) + all its inner elements by pulling `get_design_context` on the drawer frame from those templates. Pull the exact same styling for both `batch-narrow` (default drawer content) and `bp-bank-details` (Edit view content) variants. Drawer close X is visible in Figma at node `2926:18560` — use that.
- **Radio button:** appears in the drawer. Component contains its own state variants (default active, unchecked, hover). Pull the component and its variants directly from Figma — do not build states inline. The first radio option in the drawer is pre-selected (default active state) per Hadar's earlier instruction.

Deferred / do NOT build:
- Radio "Custom" option's click-to-open behavior (Hadar will spec later).
- Additional variant states for Payment speed, On-time label, Status (beyond what's shown in the current templates).

---

## 12. Tokens (two-source architecture)

The mock screen is a visual reproduction of a QB-style SaaS app — a different design system from the portfolio. Two sources:

**1. Portfolio primitives from `css/tokens.css`** — link at the top of the iframe. Use ONLY where values naturally overlap:
- `--primitive-black` (#393a3d)
- `--primitive-white` (#ffffff)
- `--primitive-green` (#108000) — "ON TIME" badge only
- `--primitive-grey-dark` (#6b6c72)
- `--primitive-grey-light` (#f8f9fc) — page background

**2. BP tokens defined inline in the iframe** — at the top of the iframe's `<style>` block, define a `:root { --bp-* }` set for everything the mock screen needs that isn't in portfolio tokens. Includes (Claude Code identifies the full list by pulling all 4 templates + drawer + radio):
- `--bp-font-body: 'Avenir Next', system-ui, sans-serif`
- `--bp-color-action-green: #2ca01c` (Switch-on, Manage link)
- `--bp-color-border-input: #8d9096`
- `--bp-color-divider: #d4d7dc`
- `--bp-radius-input: 4px`
- `--bp-radius-switch-pill: 20px`
- `--bp-radius-switch-thumb: 18px`
- `--bp-shadow-switch: 0px 5px 10px rgba(0,0,0,.1), 0px 2px 2px rgba(0,0,0,.3)`
- `--bp-space-*` — mock-screen-specific spacing values that don't map to the portfolio 4/8/12/16/24/32/64/128 scale

**Rules:**
- NO hardcoded values anywhere. Every color, spacing, font attribute, radius, shadow references either a portfolio primitive or a `--bp-*` token.
- NO additions to `css/tokens.css`. All BP tokens stay inline in the iframe.
- `--bp-*` names follow the portfolio convention (kebab-case, semantic naming).
- Every text element still has an explicit `font-weight` in CSS — no browser default inheritance.

## 12a. Fonts — Avenir Next (self-hosted)

Font: **Avenir Next** (free Avenir variant, NOT the licensed Intuit Avenir). Two weights only:
- Regular (font-weight: 400) — for Figma "Roman"
- Heavy (font-weight: 800) — for Figma "Heavy" AND "Black" (substitute; Avenir Next has no true Black)

Font files (Hadar will provide to Claude Code):
- `Avenir_Next_Regular.otf`
- `Avenir_Next_Heavy.otf`

**Repo placement:** `assets/fonts/avenir-next/`. Create the folder if it doesn't exist. Confirm the exact path against any existing self-hosted font convention in the repo before finalizing.

**@font-face declarations** — inline in the iframe's `<style>` block, at the top (before `:root {}`):

```css
@font-face {
  font-family: 'Avenir Next';
  src: url('{RELATIVE_PATH}/assets/fonts/avenir-next/Avenir_Next_Regular.otf') format('opentype');
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: 'Avenir Next';
  src: url('{RELATIVE_PATH}/assets/fonts/avenir-next/Avenir_Next_Heavy.otf') format('opentype');
  font-weight: 800;
  font-style: normal;
  font-display: swap;
}
```

**Figma weight → CSS mapping:**
- Figma "Roman" → `font-weight: 400`
- Figma "Heavy" → `font-weight: 800`
- Figma "Black" → `font-weight: 800` (Heavy as substitute — no true Black exists in Avenir Next)

---

## 13. What NOT to build

- No section wrapper, page header, headline, or background outside the mock screen itself.
- No edits to `case-studies/bill-pay/index.njk` or any other case study page.
- No new files in `css/widgets/`, `css/components/`, or `js/` (except the iframe's own JS file — see §16).
- No responsive breakpoints beyond the scale-to-fit mechanism.
- No invented visual states.
- No Payment speed / On-time / Status additional states.
- No radio "Custom" click behavior.

---

## 14. Verification loop — cap 5 iterations

After the build is functionally complete, run up to **5 verification loops**. If pixel-perfect isn't achieved by loop 5, STOP and report remaining mismatches — do not keep looping.

### Each loop:

1. **Enumerate every visible text and layout element** in each of the 4 templates (batch-full, batch-narrow, bulk-full, bulk-narrow) plus the bp-bank-details drawer variant.
2. **For each text element**, read the browser's computed style via CDP (`getComputedStyle`) and compare to the Figma value pulled via `get_design_context` on the corresponding node:
   - `font-family`
   - `font-weight` (explicit — flag if inherited from browser default)
   - `font-size`
   - `line-height`
   - `letter-spacing`
   - `color`
   - `text-align`
3. **For each container / layout element**, compare computed vs Figma:
   - `width`, `height`
   - `padding` (all four sides)
   - `margin` (all four sides)
   - `background-color` / `background-image`
   - `border` (each side)
   - `border-radius`
   - `box-shadow`
   - `gap` (for flex/grid)
   - `position` + `top`/`left`/`right`/`bottom` (for absolute positioning)
4. **For each interactive element**, verify:
   - `cursor: pointer` applied on hover
   - No visual state applied on hover UNLESS the corresponding Figma variant defines one
5. **For each motion element**, verify duration and easing via CSS transition inspection:
   - Toggle: 300ms, `cubic-bezier(0.4, 0, 0.2, 1)`
   - Bulk expand/collapse: computed duration in [225, 375]ms, correct easing per direction
   - Drawer open: 225ms `cubic-bezier(0.0, 0, 0.2, 1)`; close: 195ms `cubic-bezier(0.4, 0, 0.6, 1)`
6. **Collect all mismatches** into a structured list: `{element, property, expected, actual}`.
7. **If zero mismatches → PASS.** Report and stop.
8. **If mismatches exist → fix all of them**, then rerun the loop.

### If loop 5 completes and mismatches remain:

- STOP. Do not continue.
- Report each remaining mismatch with element path + expected value (from Figma) + actual value (from computed).
- Hadar decides whether to accept the deviation or send back for another round.

### Verification is deterministic, not visual

Do NOT use screenshot diff. Do NOT eyeball. Compare structured values only. This is faster, cheaper, and unambiguous.

---

## 15. Stop conditions (report and wait)

Claude Code must STOP and report BEFORE any autonomous fix if it encounters:

- Any non-`BP-`-prefixed component being used inside the templates.
- Any state (hover / active / focus / pressed) needed but not defined in Figma.
- Any row data missing or illegible in the batch-full template.
- Any Figma value that doesn't cleanly belong to either the portfolio primitives OR a `--bp-*` token (either because it's genuinely unique-per-instance, or because Claude Code can't decide which bucket it belongs to).
- Any content mismatch between templates (batch-full is truth; flag differences elsewhere).
- Ambiguity about column narrowing rules that pulling `get_design_context` can't resolve.
- Blocker 5 loops didn't resolve.

---

## 16. File deliverables

Report back the exact file paths for:

- Iframe HTML file (self-contained mock screen).
- Standalone demo/test-harness HTML at repo root.
- Any new JS file the iframe needs (if not inline — inline preferred for a single-file deliverable).

Do NOT commit. Wait for Hadar's visual QA.

---

## 17. Report back

- Files created / modified (paths).
- Figma values that didn't match assumptions in this spec — I want to know if my relay was wrong.
- Any deviations from checklist and why.
- Verification loop count (which loop passed, or "stopped at loop 5 with N mismatches").
- Any non-BP components or missing states encountered.
- Do NOT commit.
