# COMPONENT-MAP.md — Figma → CSS File Mapping

Single source of truth for how Figma layer/component names map to CSS files in `css/components/`.
CLAUDE.md points here — do not duplicate this table anywhere else.

When a new component is needed, add a row here first. Do not create a CSS file without a corresponding entry.

## Confirmed mappings

| Figma name | CSS file |
|---|---|
| `section/header` | `header.css` |
| `section/sub-header` | `subheader.css` |
| `text/body` | `body.css` |
| `Visual/video` | `video.css` |
| `section` (platfrom=desktop/mobile, placement=Hero) | `hero.css` |
| `section` (platfrom=desktop/mobile, placement=*) | `section.css` |
| layout-master (Cockpit Widget, node 466:14209) | css/widgets/cockpit/ — split by sub-component (see BP-COCKPIT.md for the full breakdown: members-rail.css, steps-rail.css, toggle.css, tag.css, center-stage.css) |

Note: "platfrom" is a typo in Figma — preserve it in code comments exactly as it appears. Do not correct it.

## Flagged — needs mapping before use

| Figma name | Seen in | Status |
|---|---|---|
| Table/data component (`header row`, `Table row new`, `Component 25-28`) | Bill Pay, "Pay bills - post signup" section | Not yet mapped to a CSS file. Do not build until resolved. |
| `Info` component | Bill Pay | Not yet mapped to a CSS file. Do not build until resolved. |

## How to add a new row

1. Confirm the component's real Figma name (exact, including any typos — preserve them)
2. Confirm which CSS file it belongs to — reuse an existing file if the component is a variant of something already mapped; only create a new file if it's genuinely new
3. Add the row here before any code is written against it