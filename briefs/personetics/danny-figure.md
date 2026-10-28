# Personetics — Danny figure + speech bubble (visual spec)

Section 02 (Growing pains / Measuring Success), last element.
Scope doc: `briefs/personetics/personetics-build-scope.md`. This file holds every value for this visual, static and motion. The scope doc only links here.

Status (28 Oct 2026): static spec complete. The head mesh is reused with its committed motion. Leg motion not specced yet (§2).

---

## 1. Static — ready to build

Build type: **new structure, build new** for the bubble, quote, figure and asterisk. The head mesh is **duplicated** from the cognitive banking diagram (see "Head mesh"). Pattern: a macro, `dannyFigure(lines)` in `_includes/personetics/danny-figure.njk`, its own CSS and JS, same layout as the problem statement and the diagram.

### Sources
| Element | Source |
|---|---|
| Visual frame | Figma file `3XG9JnADI2psNR3B7TwQdx`, node `I1979:49066;39:123;1979:49131` ("Frame 2", inside section 02's Slot 4). 800 × 350, no auto layout (absolute positions). |
| Speech bubble | Boolean "Union" `I1979:49066;39:123;1979:49151` (bubble + tail in one shape). 501.0 × 328.99. |
| Quote text | Text node `I1979:49066;39:123;1979:49201`. |
| Danny group | Node `1979:49152` ("Group 1"), on the page outside the section artboard (Figma limitation). Same page coordinate space as the sections. |
| Figure | Rectangle `1979:49107` ("danny-figure"), image fill. 272 × 305. File: `assets/personetics/danny-figure/danny.png` (Hadar's export, 544 × 610, transparent). |
| Asterisk | Boolean "Union" `1979:49564`. 110.76 × 110.76. Fill bound to primitive red. |
| Head mesh | Instance `2005:52629` of the `mesh` component `2005:52577`. |
| Copy | Text sync: the LOCKED `## visual: quote` lines of `briefs/personetics/article-text.md` (section 02). Never typed by hand. |
| Placement | `[[VISUAL:quote]]` marker, after section 02's last body paragraph. Gap above = the column's existing `gap: var(--spacing-64)`. No extra margin. |
| Viewport | Desktop only (`CLAUDE.md`). |

### Unresolved — do not build
- (none)

### Ignore in Figma
- `Vector 475` `I1979:49066;39:123;1979:49142` (2px black stroke under the bubble): covered, renders nothing. Not built.
- Any hidden or loose image layer left by background removal, and any empty frame.

### Layout — all positions relative to the visual frame's top-left, in px
Converted from Figma absolute positions: frame at (320, 2356).

| Layer (back to front) | Box (x, y, w, h) | Notes |
|---|---|---|
| Bubble | 267, 21, 501, 329 | SVG, fill `--primitive-white` (Figma `#FEFEFE`, unbound: treated as white) |
| Quote text | 361, 89, 361 wide | Height from content |
| Figure | 62, 318, 272, 305 | `<img>`, `alt=""` (decorative; the quote carries the meaning) |
| Asterisk | 144, 267, 110.76, 110.76 | SVG, `--primitive-red` |
| Head mesh | origin (77, 230), see transform below | In front of figure and asterisk |

- Frame is 800 × 350 and **does not clip**: the figure runs 273px below it and the mesh 59px. (Figma's frame clips; that is a Figma artboard setting, not intended.)
- Check: Danny group top (asterisk top, y 267) = 211px above section 02's bottom edge, because section 02's bottom padding is 128 (`section__content`). Feet = 145px below that edge, inside section 03. If either section's padding changes, these move together.
- Section 03 gets **58px extra top padding** (Hadar, 28 Oct: the legs sat too close to the 03 badge). Figma: section 03 moved from y 2835 to y 2893, Danny unchanged. So 03's `section__content` padding-top = `calc(var(--spacing-128) + 58px)`. Bottom padding unchanged. Danny's position does not change: feet stay 145px below 02's bottom edge, now 41px above 03's content top (the badge row).
  - Mechanism: modifier class `section--after-danny` on the section that follows the one holding the `quote` visual, set in `index.njk` from the synced data (never by hard-coded section number). Rule lives in `danny-figure.css` (Personetics only), with the 58px as a custom property `--danny-section-overhang` and a comment saying where it comes from. Pattern: Bill Pay's `.section--bp-mock-overhang` in `section.css` (read it; do not reuse or edit it).

### Paint order
Static (animation-planning-standard §7a): back to front as in the table above, and the whole Danny group (figure, asterisk, mesh) in front of section 03. The figure, asterisk and mesh are positioned elements with `z-index: 1`, so section 03's background paints under them. The order never changes during motion.

### Quote
- Token (add to `tokens.css` with the other `--text-*`):
  `--text-danny-quote: italic 300 24.8px/39.7px "Literata", Georgia, serif;` (Figma: Literata Light Italic, 24.8015 / 39.7, letter-spacing 0). Italic 300 is already loaded.
- Colour `--primitive-black` (Figma bound variable, `#393A3D`).
- Render the synced lines as one `<p>`, lines joined with `<br>` (Figma has a forced line break between the two sentences, no paragraph gap). Text copied exactly.
- Wraps naturally in 361px. Expected result, 5 lines:
  Counting clicks won't tell you / how well the experience you've / built delivers. / Knowing whether customers / acted on it will.

### SVG assets (Claude Code downloads through its Figma MCP)
| Node | Save as |
|---|---|
| `I1979:49066;39:123;1979:49151` (bubble) | `_includes/personetics/danny-figure-bubble.svg` |
| `1979:49564` (asterisk) | `_includes/personetics/danny-figure-asterisk.svg` |

Edit each file in two ways only: every `fill` → `currentColor`; add `aria-hidden="true" focusable="false"` to the root. Keep root `width`, `height`, `viewBox` as exported. Colour set in CSS.
Also remove every `id` attribute from both files (they are included inline, and Figma's `id="Union"` duplicates on the page).

### Head mesh
**Duplicate** the mesh markup and motion from the committed cognitive banking diagram (`_includes/personetics/cognitive-banking-diagram.njk`, `js/personetics/cognitive-banking-diagram.js`). Same BASE, same EDGES, same `offset` / `dotPositions`. Do not import or refactor the diagram's files; they are the reference and stay untouched.

What differs from the diagram:

| Item | Diagram | Danny head |
|---|---|---|
| Transform | per mesh, scale 1 | `matrix(0.99965 -0.02644 0.02644 0.99965 77 230) scale(1.3908)` (Figma instance `relativeTransform`, offset into frame space; scale = instance resized from 136 × 125 to 193.68 × 178.79, measured from dot spacing) |
| Pin | one dot | `null`: all six dots drift |
| Phase / rate | per mesh | phase 0, rate 1.00 (single mesh) |
| Amplitude | 8px | 8 in component space, so ~11px on screen after the 1.3908 scale. The motion scales with the mesh, as a scaled Figma instance would. |
| Dot fill | `--primitive-grey-dark` | `--primitive-black` (Figma instance override, `#393A3D`, bound variable) |
| Line | 0.3, grey-dark | 0.3px on screen, `--primitive-black`. Line width does **not** scale (Hadar, 28 Oct): `vector-effect: non-scaling-stroke` on every edge. |
| Dot size | r 3 | r 3 in component space (renders 4.17; Figma 4.28, accepted) |

Loop, curve, seekability, viewport gating and reduced motion: exactly as `cognitive-banking-diagram.md` §2 (reduced motion = render at `t = 0`, no animation).

### Files
- `_includes/personetics/danny-figure.njk` — macro `dannyFigure(lines)`
- `_includes/personetics/danny-figure-bubble.svg`, `_includes/personetics/danny-figure-asterisk.svg`
- `css/widgets/personetics/danny-figure/danny-figure.css`, linked from the Personetics page like the diagram's CSS
- `js/personetics/danny-figure.js`, listed in the page's `scripts` like the diagram's JS
- `case-studies/personetics/index.njk`: add `{% elif block.name == "quote" %}{{ dannyFigure(s.visuals.quote) }}`

### Check before reporting (Claude Code)
- Measured inside the page: frame 800 × 350; bubble 501 × 329 at (267, 21); figure 272 × 305 at (62, 318); asterisk 110.76 at (144, 267); Danny's feet 145px below section 02's bottom edge.
- Quote breaks into the 5 lines above.
- Figure, asterisk and mesh paint over section 03's background.
- Head mesh: all six dots drift; lines stay 0.3px.
- Cognitive banking diagram unchanged.

---

## 2. Motion — placeholder (later, own chat)

Leg motion is coming; nothing specced yet. Captured intent (26 Oct):
- Relaxed swing, like sitting on a fence. NOT anxious: an informal CTO who sits on tables. Slow, pendular, easing at each end; a fast, small, even jiggle reads as anxiety.
- Perspective: swinging forward, the shin foreshortens and the shoe tilts toward the camera (more sole/toe); swinging back, the shin lengthens and the heel shows.
- Cut at mid-thigh (the static thigh hides the seam); pivot at the knee. The figure export will be split for this; today's `danny.png` is the static whole.
- Speed and amplitude picked by eye from a playable comparison. Technique open (scope doc §3).

When motion is specced, it is written here, and any static value it changes is changed in §1 — never in a second place.
