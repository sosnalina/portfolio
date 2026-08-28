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
| *(no Figma frame — exploratory accordion variant, hand-authored for visual comparison against Gallery 2, not Figma-linked)* — third, independent scene-gallery instance: two fixed-width panels (627px active / 149px collapsed, 24px gap, 800px total) inside the article's normal, non-bled content column, that swap widths on advance instead of sliding or panel-swapping via transform. Same Gallery 2 content (tag, caption, Barnett Lawn Care drawer-open mock) duplicated in, not shared | `css/widgets/bill-pay/scene-accordion/scene-accordion.css` — parent-page stage (plain, non-bled 100%-width iframe sizing) and progress-row CSS only. The panel composition, the duplicated Bill Pay mock markup/styles, and the width-swap transition all live self-contained inside `assets/scene-gallery/bill-pay/scenes-accordion.html`'s own `<style>` block — same self-contained-iframe-document pattern as Gallery 1's `scenes.html` and Gallery 2's `scenes-gallery-2.html`. A third, independent instance of the scene-gallery pattern; does not modify or share code with Gallery 1's or Gallery 2's files. Exploratory — may be deleted after comparison. |

## Flagged — needs mapping before use

| Figma name | Seen in | Status |
|---|---|---|
| Table/data component (`header row`, `Table row new`, `Component 25-28`) | Bill Pay, "Pay bills - post signup" section | Not yet mapped to a CSS file. Do not build until resolved. |
| `Info` component | Bill Pay | Not yet mapped to a CSS file. Do not build until resolved. |

## How to add a new row

1. Confirm the component's real Figma name (exact, including any typos — preserve them)
2. Confirm which CSS file it belongs to — reuse an existing file if the component is a variant of something already mapped; only create a new file if it's genuinely new
3. Add the row here before any code is written against it