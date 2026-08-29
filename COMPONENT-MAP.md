# COMPONENT-MAP.md — Figma → CSS File Mapping

Single source of truth for how Figma layer/component names map to CSS files in `css/components/`.
CLAUDE.md points here — do not duplicate this table anywhere else.

When a new component is needed, add a row here first. Do not create a CSS file without a corresponding entry.

## Confirmed mappings

| Figma name | CSS file |
|---|---|
| `section/header` | `header.css` — badge number is CSS-generated (`counter-reset: section-header` on `main`, `counter-increment` on `.section-header`, `::before` on `.section-header__badge-text`), zero-padded via `decimal-leading-zero`. Increments only on actual `.section-header` instances, in document order — sections without a header (body-only sections, unheadered continuation blocks) don't consume a number or break the sequence. Never hardcode the badge number in markup; leave `.section-header__badge-text` empty and let the counter fill it. |
| `section/sub-header` | `subheader.css` |
| `text/body` | `body.css` |
| `Visual/video` | `video.css` |
| `section` (platform=desktop/mobile, placement=Hero) | `hero.css` |
| `section` (platform=desktop/mobile, placement=*) | `section.css` |
| layout-master (Cockpit Widget, node 466:14209) | css/widgets/bill-pay/cockpit/ — split by sub-component (see briefs/bill-pay/BP-COCKPIT.md for the full breakdown: members-rail.css, steps-rail.css, toggle.css, tag.css, center-stage.css) |
| *(no Figma frame — Bill Pay's Tipping Point section isn't Figma-linked at all, see briefs/bill-pay/bill-pay-brief.md)* — full-width, natural-height stacked image(s), no crop/overlay/shadow | `image-group.css` — distinct from `Visual/video`/`video.css`, which is fixed-height, object-fit:cover, with a dark overlay treatment; wrong shape for a plain illustration. Built directly per Hadar's brief since no Figma coverage exists yet for this section; revisit this mapping if/when Figma coverage is added. |
| `Frame 1197135596` (node 943:27525) — three-column principles row: icon placeholder, caption, tag pill, per-column, with thin vertical dividers between columns, inside a rounded container | `principles.css` — article-level component (inline case-study markup, not a widget); used in Bill Pay's "Designing a cockpit" section. Figma layer name is an unrenamed auto-generated default (`Frame 1197135596`) — flagged here rather than invented, since renaming Figma layers is out of scope for this task. |
| *(no Figma frame — Gallery 2 is a hand-authored build spec, not Figma-linked, per the "Gallery 2 — Scene 1 build spec" brief)* — second, independent scene-gallery instance: grey/green two-panel composition (mock in its drawer-open state, principles-tag, caption) that panel-swaps between two scenes, green panel bleeding to the viewport edge | `css/widgets/bill-pay/scene-gallery-2/scene-gallery-2.css` — parent-page stage (viewport-bleed iframe sizing) and progress-row CSS only. The panel composition, the duplicated Bill Pay mock markup/styles, and the panel-swap transition all live self-contained inside `assets/scene-gallery/bill-pay/scenes-gallery-2.html`'s own `<style>` block — same pattern as Gallery 1's `scenes.html`. A second, independent instance of the scene-gallery pattern; does not modify or share code with Gallery 1's files. |
| *(no Figma frame — exploratory accordion variant, hand-authored for visual comparison against Gallery 2, not Figma-linked)* — third, independent scene-gallery instance: two fixed-width panels (627px active / 141px collapsed, 32px gap, 800px total) inside the article's normal, non-bled content column, that swap widths on advance instead of sliding or panel-swapping via transform. Same Gallery 2 content (single travelling tag, caption, Barnett Lawn Care drawer-open mock) duplicated in, not shared. Grey panel also carries three floating cards (phase 1, static placement only) — the drawer's own Standard/Fast/Instant payment-speed rows, cloned live (not re-authored, not images) into scaled/padded/shadowed wrappers floating beside the mock — plus a small green "Arrives on time" pill cloned from the table's own PAYMENT SPEED badge; drift motion is a later phase | `css/widgets/bill-pay/scene-accordion/scene-accordion.css` — parent-page stage (plain, non-bled 100%-width iframe sizing) and progress-row CSS only. The panel composition, the duplicated Bill Pay mock markup/styles, the floating cards, and the width-swap transition all live self-contained inside `assets/scene-gallery/bill-pay/scenes-accordion.html`'s own `<style>`/`<script>` blocks — same self-contained-iframe-document pattern as Gallery 1's `scenes.html` and Gallery 2's `scenes-gallery-2.html`. A third, independent instance of the scene-gallery pattern; does not modify or share code with Gallery 1's or Gallery 2's files. Exploratory — may be deleted after comparison. |

## Bill Pay mock duplication

The Bill Pay mock (`assets/mock-screen/bill-pay/schedule-payment.html` + `schedule-payment.js`) is duplicated, not shared, into all three scene-gallery documents below. Each is a self-contained iframe with its own `<style>`/`<script>` copy — none of the three loads or references the mock's own files. **A change to `schedule-payment.html` or `schedule-payment.js` does not propagate.** It must be applied by hand to every gallery that carries the affected part, per the breakdown below.

**`scenes.html` (Gallery 1)** carries: header, table (batch + bulk rows), drawer (default view + its own bank-details/Edit view — see divergence), radio group, footer, row-card overlay, narrow-mode column collapse. Missing: calendar (no `.bp-cal-*`, no `buildMonthGrid`/`classifyCell`/`renderCalendarCell`/`renderCalendarColumn`/`renderDeliveryCalendar`/`CALENDAR_MONTHS`/`MONTH_NAMES`/`SPEED_TABS`/`fmtLong`), tooltip. Same-named shared functions: `addBusinessDays`, `addDays`, `dateKey`, `fmtMD`, `getDrawerDueDates`, `isBusinessDay`, `layeredIcon`, `methodLabel`, `money`, `pad2`, `parseMMDDYY`, `renderActionCell`, `renderBatchRow`, `renderDrawerDefault`, `renderRadioGroup`, `renderRows`, `renderSubRow`, `renderVendorMethod`, `renderVendorRow`, `rowCellsCommon`, `setMode`, `updateAggregates`, `vendorGroups`.

**`scenes-gallery-2.html` (Gallery 2)** carries: header, table, drawer (default view only, no bank-details/Edit), radio group, footer, row-card overlay, narrow-mode column collapse. Missing: calendar, speed-tabs, bank-details fields, tooltip, batch mode (bulk-only, no `renderBatchRow`/`setMode`). Same-named shared functions: `addBusinessDays`, `addDays`, `dateKey`, `fmtMD`, `getDrawerDueDates`, `isBusinessDay`, `layeredIcon`, `methodLabel`, `money`, `pad2`, `parseMMDDYY`, `renderActionCell`, `renderDrawerDefault`, `renderRadioGroup`, `renderRows`, `renderSubRow`, `renderVendorMethod`, `renderVendorRow`, `rowCellsCommon`, `updateAggregates`, `vendorGroups`.

**`scenes-accordion.html` (accordion)** carries: header, table, drawer (default view only, no bank-details/Edit), radio group, calendar (full port — `buildMonthGrid`, `classifyCell`, `renderCalendarCell`, `renderCalendarColumn`, `renderDeliveryCalendar`, `CALENDAR_MONTHS`, `MONTH_NAMES`, `SPEED_TABS`, `fmtLong`, every `.bp-cal-*`/`.bp-speed-tab*` CSS rule, the `--bp-color-calendar-*`/`--bp-text-calendar-*` tokens), footer, row-card overlay, narrow-mode column collapse. Missing: bank-details fields, tooltip, batch mode. Same-named shared functions: Gallery 2's list plus `buildMonthGrid`, `classifyCell`, `renderCalendarCell`, `renderCalendarColumn`, `renderDeliveryCalendar`, `fmtLong`.

None of the three carries the mock's own interactive/state-management machinery (`init`, `bindRowEvents`, `openDrawer`/`closeDrawer`, `onChevronClick`/`onActionClick`, `applyScale`, `swapDrawerContent`, `updateSelectedRowCard`, `q`, `cssEscape`) — each gallery renders one or two permanently-static frames, so there's nothing to wire up.

**Divergence found (as of this writing):**
- All three strip interaction-only CSS from every shared rule they carry — `cursor: pointer`, and every `transition:` tied to hover or to the drawer/column-collapse open-close motion. Expected (static frames, not live instances) but means a shared rule can't be diffed 1:1 against the source.
- All three hardcode `.bp-switch__thumb`'s `box-shadow` (`0px 5px 10px rgba(0, 0, 0, 0.1), 0px 2px 2px rgba(0, 0, 0, 0.3)`) instead of the source's `--bp-shadow-switch-thumb` token — none of the three defines that token.
- `scenes.html` hardcodes `.bp-speed-tab`'s `font` (`400 14px/24px var(--bp-font-body)`) instead of the source's `--bp-text-speed-tab` token, which it doesn't define. `scenes-accordion.html`'s own `.bp-speed-tab` uses the token correctly.
- `scenes.html` has its own `.bp-row--lift-clone`, `.bp-dim-overlay`, `.bp-amount-field--editing`, `.bp-field__value-box--editing` classes with no counterpart in the source — scene-1-specific animation additions (row-drag clone, dim overlay, typing/edit-caret effect), not copies of anything in the mock.
- `scenes.html`'s bank-details/Edit view is not a copy of the source's `renderDrawerBankDetails` — it's a separately-named function (`renderScene3DrawerBankDetails`) that independently produces the same `.bp-field`/`.bp-field__value-box` markup pattern.
- All three add `border-radius`/`background` directly to `.bp-screen` (`scenes-accordion.html` also adds `box-shadow`, deliberately, in a later pass), which the source doesn't set on that selector — each gallery needed its own visible card shape since none has whatever outer wrapper supplies it in the mock's own test harness.
- `ROWS` (the bill data array) is byte-identical, whitespace aside, across the source and all three copies.

**Future duplicates:** any new gallery or widget that duplicates the mock must be added to this breakdown at the time it's built, with its own entry listing exactly what it copied (markup sections, CSS rule groups, JS functions/constants). Extending this list is part of building the duplicate, not a follow-up task — an incomplete list reads as authoritative and is worse than no list.

## Flagged — needs mapping before use

| Figma name | Seen in | Status |
|---|---|---|
| Table/data component (`header row`, `Table row new`, `Component 25-28`) | Bill Pay, "Pay bills - post signup" section | Not yet mapped to a CSS file. Do not build until resolved. |
| `Info` component | Bill Pay | Not yet mapped to a CSS file. Do not build until resolved. |

## How to add a new row

1. Confirm the component's real Figma name (exact, including any typos — preserve them)
2. Confirm which CSS file it belongs to — reuse an existing file if the component is a variant of something already mapped; only create a new file if it's genuinely new
3. Add the row here before any code is written against it