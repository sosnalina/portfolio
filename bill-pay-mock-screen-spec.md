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
- Bottom: legend — 3 rows, top to bottom, each a colored dot + label + dynamic date, long form `Mon DD, YYYY` (e.g. "Sep 9, 2025") — a different format from the radios' and table's short `MM/DD`, intentional:
  1. "Due Date [bill's due date]" — dot solid orange (`--bp-color-calendar-due`). For a bulk drawer (multiple due dates in scope), this row shows the **earliest** due date — the same one used as the range/orange split boundary (see Marks below).
  2. "Withdraw [selected date]" — dot solid `--primitive-black`
  3. "Est. arrival [computed date]" — dot outlined `--primitive-black`; carries the on-time/overdue badge as a trailing element on the same row
  Same label weight/date weight/spacing across all three rows; the gap between any two adjacent rows is identical (all three share the legend's own flex `gap`, so this holds automatically regardless of order).

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
- 1 Range start mark = withdrawal date (user-picked or default-computed) — solid, `--primitive-black`.
- 1 Range end mark = arrival date (computed) — outlined, `--primitive-black`.
- Range cells fill every day (not just weekdays — the range includes weekends it spans) between withdrawal and arrival, colored per the range-color rules below.
- N Due date marks — solid fill, orange (`--bp-color-calendar-due`) — one per bill in the drawer's scope. Marks are opaque and always render on top of whatever range-band color sits behind them, including when a due date lands strictly inside the range (see below — previously this couldn't happen because arrival was always on/before every due date by construction; a user-picked withdrawal or a faster tier can now push arrival past a due date, and the mark must still render correctly there).
- **Collision rule:** if two bills share the same due date, they collapse to ONE mark on that cell (not stacked).

**Range colors — orange is the only verdict signal:**
On-time and overdue-before-the-due-date read as the same grey. Orange (`#FFD5B0`) is the sole color signal, appearing only for the overdue portion of a range — from the due date to arrival. A green on-time band was tried and reverted; `#DDF0DB` does not appear anywhere in the codebase.
- **On-time** (arrival on/before every due date in scope): the whole range, withdrawal through arrival, is solid grey (`--bp-color-calendar-range-bg`). The due-date mark inside an on-time range carries no gradient — it's either outside the range entirely, or sitting inside the uniformly grey span.
- **Overdue** (arrival falls after the earliest due date in scope — the same due date always drives this, since due dates are deduped/sorted ascending and the earliest one is always the first to be exceeded): the range is grey from withdrawal up to that due date, then `#FFD5B0` (orange) from the due date to arrival.
- **Due-date cell, overdue only:** a hard-stop gradient, not a blend — grey on the left half, `#FFD5B0` on the right half, split at the cell's horizontal center (aligned with the due mark sitting on top of it).
- **Arrival (est. arrival) cell:** always a hard-stop half gradient, left half only — `#FFD5B0` fading to transparent when overdue, grey fading to transparent when on-time. The right half is never filled; arrival is the edge of the range, not its middle.
- **Row-edge cells** (range spans a week boundary — see "Range fill is continuous" below): take the color of whichever side of the split they fall on (grey throughout if on-time; grey before the due date, orange from the due date on, if overdue). If the due date itself lands on a row edge (Sunday = first column, or Saturday = last column), that cell gets both the gradient split above AND the row's rounded end cap on the matching side (grey→left cap on a Sunday due date, orange→right cap on a Saturday due date) — arrival can never do this since it's always a business day and can't land in the first/last column.

**Hover preview:**
Hovering a valid (clickable) calendar date previews the range that date would produce if picked — nothing commits until click:
- The range recolors for the hovered date per the rules above, and the legend's Withdraw/Est. arrival dates update to the previewed values.
- The on-time/overdue badge disappears entirely during hover (no verdict text while the range is mid-preview — showing the *committed* verdict next to a *previewed* range would put two contradictory answers on screen at once). The Due Date legend row is unaffected — the due date itself doesn't change.
- Hovering out with no click reverts everything, badge included. Clicking commits the previewed state and the badge returns showing the committed verdict.

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
- Hover a valid calendar date → previews the range that date would produce, without committing. See "Hover preview" above. This includes dates that currently sit inside the committed range — being part of the active range does not make a date invalid to re-pick; there is no exception for it (see Fix, below).
- Click a valid calendar date → sets that as withdrawal date. Arrival auto-updates.
- Switch tabs → arrival recomputes with new N. Withdrawal persists across tab switches.
- Only the withdrawal date is user-controlled. Arrival and due date marks are display-only.
- **Fix (in-range weekdays were unreachable):** every business day in the grid is hoverable/clickable regardless of whether it currently sits inside the range — this was previously bugged (`classifyCell`'s in-range branch hardcoded `clickable: false` for every cell strictly between withdrawal and arrival, weekday or weekend, so a weekday already inside the range had no way to be re-picked). Fixed by keying `clickable` off weekday/weekend for in-range cells the same way it already was for out-of-range cells, instead of off range membership.

**Non-clickable cells (rendered in Past Month style — grayed out, or, if inside the current range, in the range's own band color):**
- Weekend cells (Saturday, Sunday) — not valid withdrawal dates, in range or not.
- Dates from adjacent months showing at grid edges (visual overflow of prior/next month) — already what "Past Month" style is for.
- Both use the same visual treatment when outside the range; both are non-clickable regardless of range membership.

**Weekend tooltip (`bp-tool-tip`, wired):**
- Fires on hover over any weekend cell (Saturday or Sunday) in the date grid, in-range or not — no other cell type shows a tooltip. Copy: "Bank transfers only move on business days." Weekend cells stay exactly as non-clickable as ever — no `cursor: pointer`, no other affordance; the tooltip is the only thing that changes.
- Why: the colored range answers "would this arrive late," not "why didn't moving back two days help" — that happens because an intervening weekend doesn't count as business days. That's a rule, not a state, and needs words. Weekends are 2 of 7 columns and only trigger on hover, so this fires rarely, which is deliberate.
- `bp-tool-tip` has 3 variants distinguished by needle position: `left`, `middle`, `right`.
- Positioning rule: date cell in the LEFT column of a calendar (Sunday) → `left` variant; RIGHT column (Saturday) → `right` variant; middle columns → `middle` variant. Prevents the tooltip from overflowing the calendar's edges. Weekend cells only ever occupy the first and last columns, so in practice only `left`/`right` fire — `middle` exists because the component is shared, not because a weekend can land there. Positional (grid column), not day-name-based — a column's variant doesn't depend on which date happens to land there.
- Bubble sits 6px above the cell; needle stays centered on the date number in every variant; the bubble itself shifts left/right of the needle to stay inside the calendar's edges. Sizing (`max-width: 123px`, sizes to content, 5px/4px padding, 14px line-height) and positioning were already correct in the CSS before this pass — only the hover wiring (`showTooltip`/`hideTooltip`, already-defined but previously uncalled, plus the column→variant helpers) was missing.
**Deferred / do NOT build in this pass:**
- Calendar month navigation (arrows render as visual-only, no click handler).

**Calendar rendering conventions — non-negotiable:**

These are standard calendar rules, not project-specific inventions. Any deviation is a bug, not a design choice.

- **Grid alignment:** the date grid is a strict 7-column × N-row grid. Every cell has the exact same width. Every row has the exact same height. No cells are wider, narrower, taller, or shorter than any other. The full grid fits the calendar container width exactly — no overflow, no unused whitespace at the edges.
- **Days-of-week header alignment:** the S / M / T / W / T / F / S column headers are positioned directly above the date columns they label. The "S" header sits above the Sunday column. The "M" above Monday. Etc. Column widths of the header row must match column widths of the date grid exactly.
- **Column order:** week starts Sunday (S M T W T F S), per Figma.
- **Vertical column alignment:** the date `28` in row 1 sits directly above the date `28` in row 2 (same column = same day of week). All dates in the same column line up vertically to the pixel.
- **Circular date marks are circles:** the withdrawal / arrival / due date marks are perfect circles — equal width and height. Do NOT stretch them into ovals to fit non-square date cells. The mark's diameter comes from Figma; the mark is centered inside its cell.
- **Range fill is continuous:** the colored fill between withdrawal date and arrival date (grey on-time, or grey-then-orange overdue — see "Range colors" above) is a single visual band, not a stack of separate rectangles per cell. No visible gaps between cells within the range. If the range spans multiple rows (a week boundary), each row's segment must abut the row above/below cleanly with no dead gap; the range visually reads as one contiguous highlight, in whichever color(s) that segment falls under.
- **Adjacent-month cells:** dates from the previous month (shown at the top-left of the grid before the 1st of the current month) and from the next month (shown at the bottom-right after the last of the current month) must be rendered in the "Past Month" style (grayed out) — NOT blank, NOT omitted, NOT the same style as current-month dates.
- **Weekend cells:** rendered in Past Month style when outside the current range (same treatment as adjacent-month cells), or in the range's own band color when inside it — non-clickable either way, visually distinct from clickable weekdays. Hovering a weekend cell shows the weekend tooltip regardless of range membership (see "Weekend tooltip" above); it never becomes clickable.
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
- No bulk-mode narrow row variant for the Activity drawer.
- No overlay, Escape handler or click-outside close on either drawer.

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
- Activity drawer close button collides with the header text (§18.5).
- `money()` or `fmtLong()` return anything other than `$47,300.00` /
  `Sep 12, 2025` for the §18.10 test values.

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

---

## 18. Bill Activity drawer — second side drawer

A **second, separate** side drawer showing one bill's full history. Added after
the original build. It is **not** a third content view inside the existing
drawer (§6.3 / §6.4) — it has its own element, its own state, and no footer.

Everything in this section is an addition. **Nothing in §1–§17 changes** except
the two edits noted at the end.

### 18.1 Precedence of sources — read before resolving any value

This section reverses §1's rule in one specific case, deliberately.

1. **Where this section names an existing class, that class wins.** This drawer
   was specified by Hadar as reusing the existing drawer's styles. Where she
   said "same as X," X's code in `schedule-payment.html` is the source, not
   Figma.
2. **Where no existing class applies, Figma node `3162:19071` wins**
   (file `qfIgkJTuD0k956262uOUSp`).
3. **Never author a value with no source in either.** STOP and report.

**Conflict clause.** If any number here conflicts with the source's own layout,
**the source wins. STOP and report.** Do not redesign, do not flatten, do not
substitute your own markup.

**Tokenization.** Per §12, the mock is exempt from the portfolio's
no-hardcoded-values rule. Where the mock already has a `--bp-*` token or a class
for a value, reuse it rather than retyping the literal.

### 18.2 Definition of done

**What Hadar looks at:** the new drawer open in batch mode, overlaid against
Figma node `3162:19071`, plus the status-cell hover state in the table.

**The one number that matters:** the timeline rail. Every dot's centre must sit
on the vertical centre of its item's first line, and the rail line must run
first-dot-centre to last-dot-centre. Visible misalignment is a defect.

**Out of scope:**
- The bulk-mode narrow row variant (§18.12 is batch only)
- Any change to the existing payment drawer's content or behaviour
- Any new motion — the open/close transition is §7.3's, reused verbatim
- Propagating into the scene-gallery documents. Per `COMPONENT-MAP.md:28` the
  mock is duplicated, not shared; nothing here propagates and no gallery is
  touched.

### 18.3 Sources

| Element | Source |
|---|---|
| Drawer shell, radius, shadow, slide, easings | `schedule-payment.html:1136-1150`, tokens `:59-64, 134-135` — **duplicate, do not author** |
| Scroll padding, scrollbar hiding, right-edge mask | `.bp-drawer__scroll`, `:1159-1197` |
| Close button | `.bp-drawer__close`, `:1270-1286`, markup `:2082-2084` |
| Divider | `.bp-drawer__divider`, `:1319-1323` |
| Vendor-name type | `.bp-drawer__meta`, `:1291-1295` |
| Bill-number type | `.bp-drawer__title`, `:1265-1269` |
| `Approved` type | `.bp-status-text`, `:926-931` |
| Section-label type | `.bp-drawer__section-title`, `:1331-1337` |
| Large money/date type | `.bp-drawer__total-amount`, `:1325-1330` |
| Label→value gap (6px), group gap (30px) | `.bp-field`, `:1902-1910, 1936-1939` |
| Narrow-mode class, row-card lift | `openDrawer()` `schedule-payment.js:661`, `updateSelectedRowCard()` `:450`, CSS `:659, 678-687` |
| Currency formatting | `money()` `schedule-payment.js:42-44` |
| Long date formatting | `fmtLong()` `:147-149`, `parseMMDDYY()` `:108` |
| Open-balance value expression | `renderBatchRow` `schedule-payment.js:298` |
| Bill data | `ROWS`, `schedule-payment.js:48-62` |
| Rail geometry, dot sizes and colours, timeline type sizes | Figma node `3162:19071` |
| Timeline content (11 entries) | Hadar — fixed placeholder, identical for every bill |

**Unresolved — do not build:** *(none)*

### 18.4 Trigger and exclusivity

- Opens on click of `.bp-cell--status`, **batch mode only**.
- In bulk mode the status cell does nothing — no handler, no hover, no cursor.
- The two drawers are **mutually exclusive**. Opening either closes the other.
- Both are independently closable via their own X.

### 18.5 Shell

Duplicate `.bp-drawer` (`schedule-payment.html:1136-1150`) for a new
`<aside id="bp-activity-drawer" class="bp-drawer bp-drawer--activity">`.

Reuse, do not retype: `--bp-drawer-width` (435px), `--bp-radius-drawer-top`
(30px, top-right only), `--bp-shadow-drawer`, `position: absolute; top: 0;
right: 0`, `height: 1000px`, `display: none` → `flex` gating, and §7.3's
`translate3d(100%,0,0)` → `translate3d(0,0,0)` slide with its 225ms
`--bp-ease-drawer-open` in / 195ms `--bp-ease-drawer-close` out.

**No footer.** `.bp-drawer__footer` is not duplicated.

#### Structure — this differs from the existing drawer

In the existing drawer `.bp-drawer__scroll` owns `overflow-y` and scrolls
**everything**, head included. Here the head is fixed and only the timeline
scrolls. Deliberate divergence — record it in `COMPONENT-MAP.md`.

```
aside#bp-activity-drawer.bp-drawer.bp-drawer--activity   flex column
 ├─ div.bp-activity__head        flex: 0 0 auto;  position: relative;
 │                               padding: 48px 30px 0;
 │    ├─ button.bp-drawer__close
 │    ├─ header block            (18.6)
 │    ├─ divider                 (18.6)
 │    ├─ balance + due block     (18.6)
 │    ├─ divider                 (18.6)
 │    └─ "Bill activity" heading (18.6)
 └─ div.bp-activity__scroll      flex: 1; overflow-y: auto;
                                 padding: 0 30px;  position: relative;
      ├─ div.bp-activity__fade   (18.8)
      ├─ timeline                (18.7)
      └─ div  height: 32px       bottom spacer
```

The 32px bottom spacer duplicates the existing convention
(`schedule-payment.js:1078`), which uses a spacer element rather than bottom
padding.

**Scrollbar.** Per §9, no visible scrollbar. Duplicate the existing hiding
treatment onto `.bp-activity__scroll`: `scrollbar-width: none`,
`-ms-overflow-style: none`, `::-webkit-scrollbar { width: 0 }`, and the
`::after` 16px white right-edge mask (`schedule-payment.html:1164-1197`). The
mask sits inside the 30px right padding, so no content is covered.

**Close button.** Duplicate `.bp-drawer__close` verbatim — 36 × 36,
`padding: 6px`, `border-radius: 4px`, `position: absolute; top: 0; right: 0`,
the same `narrow-action.svg` glyph at 14 × 14 via `.bp-action-icon`. Positioned
against `.bp-activity__head`, putting its centre at **x = 387, y = 66** from the
drawer's top-left — identical to the existing drawer.

*Figma node `3162:19071` contains no close button. Its position is taken from
the existing drawer, not invented. If it collides with the header text, **STOP
and report** — do not move it.*

**Close behaviour.** Bind the X to this drawer's close function. The existing
drawer has no overlay, no Escape handler and no click-outside. **Do not add any
of those here.**

**Row lift.** Call `updateSelectedRowCard()` (`schedule-payment.js:450`) for the
clicked row, exactly as `openDrawer()` does, so `#bp-row-selected-card`
positions over it. Reuse the function; do not duplicate its logic.

**State.** The new drawer needs its own slot in the `state` object. Do not reuse
or overwrite `state.drawer` — both drawers must be independently closable.

### 18.6 Head content

Content column is 375px inside the head's `48px 30px 0` padding.

All type below is **an existing class**. Apply the class; do not restate its
declarations. The weights shown are what those classes actually compute to in
this codebase — see the §12a correction at the end of this section.

**Header block** — wrapper `padding: 9px 0`, column, `gap: 14px`.

Text group — `padding: 1px 0`, column, `gap: 6px`:

| Line | Content | Class | Computes to |
|---|---|---|---|
| 1 | vendor name | `.bp-drawer__meta` | 400 / 14 / 21.65 / `#6B6C72` |
| 2 | `Bill No.` + bill number | `.bp-drawer__title` | 600 / 24 / 28 / `#393A3D` |

Line 1 sits in a 24px-tall row, vertically centred.

`Bill No.` takes **no space after the period** — `Bill No.7894`.

**The order is inverted relative to the existing drawer** — there the large
title is first and the small grey line second. Here the grey vendor name is on
top. Intentional and confirmed.

Status row — `gap: 9px`, `align-items: center`:
- Check icon 10 × 10, `#2CA01C`. Reuse `GLYPH.statusCheck` and the
  `.bp-status__check` wrapper from the table.
- `Approved` — class `.bp-status-text` → 600 / 15 / 26.965 / `#393A3D`.

Status is **always `Approved`**, hardcoded. Per §10 all rows are Approved and
`ROWS` carries no status field; none is to be added.

**Dividers** — class `.bp-drawer__divider` (`:1319-1323`). It already carries
24px top and bottom margins — **do not add gap around it.** Figma agrees at 24px.

**Balance and due block** — column, **`gap: 30px`** between the two groups. Each
group is a column with `gap: 6px`.

Both from `.bp-field`'s existing rhythm (30px between stacked pairs, 6px label →
value). Figma shows 24px for the group gap; **Hadar's call is 30px, matching the
existing drawer.**

| Element | Class | Computes to |
|---|---|---|
| `Open balance:` | `.bp-drawer__section-title` | 600 / 18 / 36 / `#393A3D` |
| amount value | `.bp-drawer__total-amount` | 600 / 32 / 36 / `#393A3D` |
| `Due date:` | `.bp-drawer__section-title` | 600 / 18 / 36 / `#393A3D` |
| date value | `.bp-drawer__total-amount` | 600 / 32 / 36 / `#393A3D` |

`.bp-drawer__total-amount` carries `margin: 24px 0 0`. **Zero it in this drawer**
— the 6px group gap governs. `.bp-drawer__section-title` carries
`padding-top: 6px`; zero it on these two labels. Do both with
`.bp-drawer--activity` scoped overrides. **Do not edit the base classes.**

**Section heading** — `Bill activity`, class `.bp-drawer__section-title`, **with**
its `padding-top: 6px` intact. Combined with the divider's 24px bottom margin
this gives 30px, matching both the existing drawer and Figma.

### 18.7 Timeline

A two-column row: a 36px rail column, then the content column filling the rest.

#### Rail — the part Figma does not carry

Figma could not express this as auto layout. Its rail is hand-placed and its dot
positions are 1px off on items 1 and 3. **Do not copy Figma's rail coordinates.
Build to the rules below.**

- Rail column 36px wide.
- Dot 12px diameter, **horizontal centre at x = 9** within the column (left edge
  at x = 3).
- Rail line 1px wide, `#DBD9D2`, also centred on **x = 9**.
- Gap from dot right edge (x = 15) to content column left edge (x = 36) is
  therefore **21px**. Add no further padding.

**Vertical alignment — the acceptance criterion.** Each dot's vertical centre
sits on the **vertical centre of its item's first line**. That line has a 20px
line-height, so the dot centre is **10px below the top of the item block**.
Compute from the item's own position. Do not hardcode y values and do not derive
from the rail column's height.

**Rail line extent.** From the **centre of the first dot** to the **centre of the
last dot**. Not above the first, not below the last. It paints **behind** the
dots, which are opaque and cover it. Paint order is **static** — line authored
before dots in DOM order. Valid because the correct order never changes.

| Dot state | Fill | Stroke |
|---|---|---|
| Complete | `#2CA01C` | none |
| Warning | `#FF8D28` | none |
| Upcoming | `#FFFFFF` | 2px inside, `#DBD9D2` |

Build dots as CSS circles (`border-radius: 50%`), not SVG. Nothing rotates, so
there is no reason to take on SVG transform-origin behaviour.

#### Content column

Column, **`gap: 28px` between every child** — items and duration lines alike. No
exception: two consecutive upcoming items with no duration between them are
still 28px apart.

**These four styles have no existing class. Build new**, using the mock's real
weights:

| Element | Weight / size / line-height / colour |
|---|---|
| Stage | 600 / 15 / 20 / `#393A3D` |
| Detail | 400 / 15 / 20 / `#393A3D` |
| Actor line | 400 / 14 / 14 / `#6B6C72` |
| Duration line | 400 / 12 / 14 / `#393A3D` |

**Item block** — column, `gap: 10px`:
- Headline group — column, `gap: 0`: stage, then detail
- Actor line

Durations are **`#393A3D`, not grey.** They read grey in one reference render;
that render is not a source. Confirmed by Hadar: everything reading as black in
this drawer is `#393A3D`.

**Upcoming item** — whole block at `opacity: 0.5`. Headline line only: no detail,
no actor line. Figma gives it a fixed 220px width; ignore that, let it hug.

**Separator character.** Every separator in this drawer is the bullet **`•`**
(U+2022), never the middle dot `·`. Applies to actor lines *and* body copy —
`Approved • 1 of 2`, `GL 6100 Contract labor • Platform`. Vertically centre it on
the line's optical centre; do not let it sit on the baseline.

### 18.8 Top fade

At the top of `.bp-activity__scroll`, a white → transparent gradient mask, **24px
tall**, so items pass under the `Bill activity` heading without touching it.

24px is the drawer's own divider rhythm, used so the value is traceable rather
than invented.

`position: sticky` or absolute at the top of the scroll region, above the
content, `pointer-events: none`, spanning the full inner width. No bottom fade.
No scroll-affordance button.

### 18.9 Timeline content

Identical for every bill. Fixed placeholder copy — **do not bind any of it to
`ROWS`**, including the `$47,300.00` figures, which stay literal even when the
row's own amount differs.

| # | Dot | Stage | Detail | Actor line | Duration after |
|---|---|---|---|---|---|
| 1 | Complete | Received | Email from vendor | Invoice capture (system) • Aug 26, 2025 | 3h 12m |
| 2 | Complete | Coded | GL 6100 Contract labor • Engineering | Marcus Webb, AP clerk • Aug 26, 2025 | 21h 5m |
| 3 | Complete | Matched | PO 4418 • receipt GRN-2207 • within tolerance | Matching engine (system) • Aug 27, 2025 | 4h 20m |
| 4 | Complete | Sent for approval | Two approvers required • bills over $25,000 | Marcus Webb, AP clerk • Aug 27, 2025 | 1d 2h |
| 5 | **Warning** | Returned for correction | Cost center should be Platform, not Engineering | Dana Kim, controller • Aug 28, 2025 | 19h 44m |
| 6 | Complete | Recoded | GL 6100 Contract labor • Platform | Marcus Webb, AP clerk • Aug 29, 2025 | 42m |
| 7 | Complete | Sent for approval | Second attempt | Marcus Webb, AP clerk • Aug 29, 2025 | 3d 4h |
| 8 | Complete | Approved • 1 of 2 | Reviewed amount $47,300.00 | Priya Raman, department head • Sep 1, 2025 | 2d 22h |
| 9 | Complete | Approved • 2 of 2 | Reviewed amount $47,300.00 | Dana Kim, controller • Sep 4, 2025 | Ready to pay • 3d 2h |
| 10 | Upcoming | Scheduled for payment | — | — | — |
| 11 | Upcoming | Paid | — | — | — |

- Entry 9's duration carries a label prefix — `Ready to pay • 3d 2h` — but is
  otherwise an ordinary duration line in the ordinary slot and style.
- There is **no** duration between entries 10 and 11. The 28px gap still applies.
- The rail line ends at entry 11's dot centre.

### 18.10 Data binding

From the clicked row's `ROWS` record only:

| Field | Source | Formatting |
|---|---|---|
| vendor name | `row.vendor` | as-is |
| bill number | `row.bill` | prefixed with the literal `Bill No.` |
| open balance | `row.amount` | `money(row.amount)` |
| due date | `row.due` | `parseMMDDYY(row.due)` → `fmtLong()` |
| status | — | hardcoded `Approved` |

**Open balance uses the identical expression as the table's Open balance
column** — `money(row.amount)`, `schedule-payment.js:298`. `ROWS` has no separate
balance field; the balance and amount cells both render `money(row.amount)`. The
drawer shows whatever that row's Open balance cell shows.

**Do not author a new currency or date formatter.** If `money()` or `fmtLong()`
produce anything other than `$47,300.00` and `Sep 12, 2025` for
`amount = 47300` / `due = "09/12/25"`, **STOP and report.**

Open the drawer by reading the clicked cell's `closest('.bp-row')` and looking
the record up fresh from `ROWS` — the same pattern `onActionClick()` uses at
`schedule-payment.js:585`. Do not pass a copy or a subset.

### 18.11 Status cell — trigger and hover

`.bp-cell--status` currently has no hover, cursor, pointer-events or handler
(`schedule-payment.html:735-738`). Add, **batch mode only**:

- `cursor: pointer`
- Hover: **underline** on the status text. The file already has a
  `.bp-hover-underline` pattern — reuse it rather than authoring a new rule.
- Click: opens this drawer for that row.

In bulk mode: none of the above.

This is an exception to §8's "no invented visual states" rule. The underline is
Hadar's explicit instruction, not an invention, and no Figma variant exists for
it.

### 18.12 Narrow row variant — batch only

*(Separate build phase. Listed here so the section is complete.)*

§6.3 collapses the same columns for every drawer. That is no longer true — the
column set now depends on **which** drawer is open.

| Cell | Payment drawer (§6.3) | Activity drawer (new) |
|---|---|---|
| vendor | visible | visible |
| bill | visible | **hidden** |
| status | visible | **hidden** |
| due | visible | **hidden** |
| speed | **hidden** | visible |
| fee | **hidden** | visible |
| balance | visible | visible |
| amount | visible | visible |
| action | visible | visible |

All hides use the **same collapse treatment** as the existing two
(`schedule-payment.html:709-716`, and §7.3's column motion) — width to 0, padding
to 0, children faded — not `display: none`.

**Mechanism.** Replace the boolean `data-narrow-hide` attribute with a named
mode, so each cell declares *which* drawer hides it and each drawer declares
*which* mode it is.

1. On `#bp-screen`, alongside the existing `.bp-screen--narrow` class, set
   `data-narrow-mode="payment"` when the payment drawer opens and
   `data-narrow-mode="activity"` when this drawer opens. Clear it on close.
   `.bp-screen--narrow` keeps its current job — the 882px `.bp-rows-scroll`
   width and anything else scoped to it — unchanged.

2. Change the two existing bare `data-narrow-hide` attributes on
   `.bp-cell--speed` and `.bp-cell--fee` (and their header cells) to
   `data-narrow-hide="payment"`.

3. Add `data-narrow-hide="activity"` to `.bp-cell--bill`, `.bp-cell--status`,
   `.bp-cell--due` and their header cells.

4. Replace the selector `.bp-screen--narrow .bp-cell[data-narrow-hide]` with two
   rules sharing the same declarations, copied verbatim:

   ```css
   [data-narrow-mode="payment"]  .bp-cell[data-narrow-hide~="payment"],
   [data-narrow-mode="activity"] .bp-cell[data-narrow-hide~="activity"] { … }
   ```

   Same for the header-cell selector. `~=` is used so a cell can later be hidden
   in more than one mode by listing both values, with no selector change.

A third drawer is then one new attribute value and one new selector line.
Nothing existing is edited again.

Do not add `!important`. Do not change any declared cell width, and do not change
`.bp-row`'s gap. The row's fit is governed by its flex behaviour, not by the sum
of declared widths — the current narrow row already exceeds that sum and renders
correctly. **Leave the widths alone.**

The row-card lift (`#bp-row-selected-card`) and the `.bp-rows-scroll` narrowing
to `calc(1317px - var(--bp-drawer-width))` are reused unchanged.

Bulk mode narrow variant: **out of scope.**

### 18.13 Motion

**No new motion.** The only movement is §7.3's drawer slide, duplicated verbatim
with its existing durations and easings, and the existing row-card fade.

`prefers-reduced-motion`: inherits whatever the existing drawer does. Do not add
a new media query and do not change the existing one.

### 18.14 Build phases

**Phase 1.** §18.4–18.6, §18.10, §18.11. The drawer renders, opens from the
status cell, closes, and is mutually exclusive with the payment drawer.
`.bp-activity__scroll` stays empty apart from the top fade and the bottom spacer.
The row uses the **existing** narrow column set for now. **Stop. Report and wait.**

**Phase 2.** §18.7–18.9, the timeline and the rail. **Stop. Report and wait.**

**Phase 3.** §18.12, including the `data-narrow-hide` → named-mode rename. That
rename touches the existing payment drawer's narrow behaviour, so after Phase 3
**both** drawers' narrow states need QA, not just the new one.

### 18.15 Verification

§14's 5-loop computed-style comparison applies, with one change: for any element
whose source is an **existing class** (per 18.1), compare against that class's
computed style, **not** against Figma. Figma is the comparison target only for
the rail, the dots, and the four timeline text styles.

Additionally, verify and report each separately — do not reconcile into one
statement:

- Every dot's centre is on the vertical centre of its item's first line. Measure
  three separate dots and report all three deltas.
- The rail line starts at the first dot's centre and ends at the last dot's
  centre. Report both coordinates.
- Gap from dot right edge to text left edge is 21px.
- All eleven entries render, entry 5's dot orange, entries 10–11 hollow.
- No `·` anywhere in the drawer. Grep for U+00B7.
- No Figma weight name (`Book`, `Medium`, `Roman`, `Heavy`, `Black`) appears in
  any CSS added by this build.
- Opening the payment drawer closes this one, and vice versa. Both independently
  closable via their own X.
- The head does not scroll; only the timeline does. Scroll to the bottom and
  confirm the header block has not moved.
- `money(47300)` and `fmtLong(parseMMDDYY("09/12/25"))` return `$47,300.00` and
  `Sep 12, 2025`.
- The existing payment drawer is unchanged. Open it and confirm its head,
  spacing and narrow row behave exactly as before.

Your report is a claim, not verification. Hadar checks it in the browser.
