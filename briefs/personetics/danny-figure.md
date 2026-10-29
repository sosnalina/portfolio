# Personetics — Danny figure + speech bubble (visual spec)

Section 02 (Growing pains / Measuring Success), last element.
Scope doc: `briefs/personetics/personetics-build-scope.md`. This file holds every value for this visual, static and motion. The scope doc only links here.

Status (29 Oct 2026): static spec complete, with the figure replaced by the leg-swing frame strip (window box and checks updated below). The head mesh is reused with its committed motion. Leg motion is specced and locked in §2, in two phases. Bubble wobble and text entrance are specced and locked in §3 (29 Oct 2026), in two phases.

---

## 1. Static — built, except the figure swap

Everything in §1 is built and committed (bubble, quote, asterisk, head mesh, section 03 padding) except the figure, whose swap to the leg-frame strip is built in §2; this section holds its window box and checks.

Build type: **new structure, build new** for the bubble, quote, figure and asterisk. The head mesh is **duplicated** from the cognitive banking diagram (see "Head mesh"). Pattern: a macro, `dannyFigure(lines)` in `_includes/personetics/danny-figure.njk`, its own CSS and JS, same layout as the problem statement and the diagram.

### Sources
| Element | Source |
|---|---|
| Visual frame | Figma file `3XG9JnADI2psNR3B7TwQdx`, node `I1979:49066;39:123;1979:49131` ("Frame 2", inside section 02's Slot 4). 800 × 350, no auto layout (absolute positions). |
| Speech bubble | Two shapes inside Boolean "Union" `I1979:49066;39:123;1979:49151`: the ellipse, Vector `I1979:49066;39:123;1979:49133` (501.0 × 328.99, stored rotated 90°), and the tail, Vector 475 `I1979:49066;39:123;1979:49144` (116.555 × 56.398 at (284, 283) in the visual frame). Built as two separate shapes so the ellipse can move while the tail stays still (§3). |
| Quote text | Text node `I1979:49066;39:123;1979:49201`. |
| Danny group | Node `1979:49152` ("Group 1"), on the page outside the section artboard (Figma limitation). Same page coordinate space as the sections. |
| Figure | Originally rectangle `1979:49107` ("danny-figure"), 272 × 305, image `assets/personetics/danny-figure/danny.png` (544 × 610, transparent). **Replaced 29 Oct 2026** by the leg-swing frame strip `assets/personetics/danny-figure/danny-leg-frames.webp` (transparent, 4606 × 821: 7 frames of 658 × 821 side by side; see §2). Whole figure, uncut. The strip's window box is registered to the old photo (see Layout), not read from Figma. `danny.png` is no longer rendered and was deleted from the repo at the start of phase 2. |
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
| Bubble | 267, 21, 501, 329 | Wrapper holding the ellipse and the tail (§3), fill `--primitive-white` (Figma `#FEFEFE`, unbound: treated as white) |
| Quote text | 361, 89, 361 wide | Height from content |
| Figure window | 95.12, 340.32, 204.35, 254.97 | A `<div>` with `overflow: hidden` holding the strip `<img>` (`alt=""`, decorative; the quote carries the meaning). Registered 29 Oct 2026 so the torso and neck sit where the old 272 × 305 photo had them: scale 1.61, upper-body overlap 98.5%, measured from the image files, good to about 1px. The whole Danny group then drops by the seat drop (below). Hadar confirms by overlay. |
| Asterisk | 144, 267, 110.76, 110.76 | SVG, `--primitive-red` |
| Head mesh | origin (77, 230), see transform below | In front of figure and asterisk |

- Frame is 800 × 350 and **does not clip**: the figure window runs 249px below it (its bottom is at y 598.69) and the mesh 59px. (Figma's frame clips; that is a Figma artboard setting, not intended.)
- **Seat drop (Hadar, 29 Oct):** a grey strip showed between his legs because the crotch sat above section 02's bottom edge, the table he sits on. The crotch apex is at frame y 475.1 in the rest pose (474.2 to 475.1 across all 7 frames); the old photo's was 478.5; the edge is at 478. So the figure window, the asterisk and the mesh all move down together by `--dfg-seat-drop: 3.4px`, defined once on `.dfg`. The bubble and quote do not move, so the tail-to-head distance changes by 3.4px. The Layout table gives the Figma values; the checks and the distances to the section edge give rendered values, which are those plus 3.4px: window top 343.72, asterisk top 270.4 (207.6px above the edge), window bottom 121px below it, mesh svg `top: var(--dfg-seat-drop)`.
- Check: Danny group top (asterisk top, y 267) = 211px above section 02's bottom edge, because section 02's bottom padding is 128 (`section__content`). The figure window's bottom edge is 121px below that edge (the old photo's was 145px; the new legs are shorter, which Hadar accepted on 29 Oct), inside section 03. If either section's padding changes, these move together.
- Section 03 gets **58px extra top padding** (Hadar, 28 Oct: the legs sat too close to the 03 badge). Figma: section 03 moved from y 2835 to y 2893, Danny unchanged. So 03's `section__content` padding-top = `calc(var(--spacing-128) + 58px)`. Bottom padding unchanged. Danny's position does not change: the figure bottom keeps its own position: for the old photo 145px below 02's bottom edge, 41px above 03's content top (the badge row); for the strip window 121px below, 65px above it. The 58px is unchanged in this build; revisit by eye.
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
| Ellipse `I1979:49066;39:123;1979:49133` | `_includes/personetics/danny-figure-bubble.svg`. Contents given in §3, not downloaded. |
| Tail `I1979:49066;39:123;1979:49144` | `_includes/personetics/danny-figure-bubble-tail.svg`. Contents given in §3, not downloaded. |
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
- `_includes/personetics/danny-figure-bubble.svg` (the ellipse only, §3), `_includes/personetics/danny-figure-bubble-tail.svg` (§3), `_includes/personetics/danny-figure-asterisk.svg`
- `css/widgets/personetics/danny-figure/danny-figure.css`, linked from the Personetics page like the diagram's CSS
- `js/personetics/danny-figure.js`, listed in the page's `scripts` like the diagram's JS
- `assets/personetics/danny-figure/danny-leg-frames.webp` — the frame strip, already in the repo. Do not regenerate or edit it. The leg motion (§2) goes into the same `js/personetics/danny-figure.js` and `danny-figure.css`.
- `case-studies/personetics/index.njk`: add `{% elif block.name == "quote" %}{{ dannyFigure(s.visuals.quote) }}`

### Check before reporting (Claude Code)
- Measured inside the page: frame 800 × 350; bubble 501 × 329 at (267, 21); figure window 204.35 × 254.97 at (95.12, 343.72), strip 4606 × 821 showing index 3 (the rest pose); asterisk 110.76 at (144, 270.4); mesh svg 3.4px lower than before; figure window bottom 121px below section 02's bottom edge.
- Quote breaks into the 5 lines above.
- Figure, asterisk and mesh paint over section 03's background.
- Head mesh: all six dots drift; lines stay 0.3px.
- Cognitive banking diagram unchanged.

---

## 2. Motion — leg swing (locked 29 Oct 2026)

### Sources
| Element | Source |
|---|---|
| Frame strip | `assets/personetics/danny-figure/danny-leg-frames.webp`, already in the repo. Checked 29 Oct: the outer 3px columns and the top and bottom rows are fully transparent in all 7 frames, so a fractional window width cannot show a neighbouring frame. |
| `frameAt`, `CYCLE`, `SINE`, frame order | The viewer below. Values set by Hadar on its sliders and recorded in the viewer chat's handoff, 29 Oct: frames 02 and 08 dropped, cycle 1.50 s, end hold 0, ease at the ends 55% sine. (The viewer page itself saves only its defaults, 1.85 s and 60%.) |
| Clock, gate, reduced-motion path | Existing `js/personetics/danny-figure.js`: `tick`, `sync`, `ViewportGate.observe`. |
| Figure window box | §1 Layout. |

### Unresolved — do not build
- (none)

### Approved reference
Playable viewer, approved by Hadar on 29 Oct: https://claude.ai/artifact/7dpnKswxM5tA9K2jhSha4X (version 8). The code below is copied from it and is the spec. **Port it. Do not re-derive the behaviour from the prose. Where the prose and the code disagree, the code wins.**

### Definition of done
- **What Hadar looks at:** `/case-studies/personetics/`, the junction of sections 02 and 03. Phase 1: overlaid on the build from before the swap, the neck, torso, asterisk and mesh have not moved. Phase 2: the loop, against the viewer.
- **The number that matters:** cycle **1.50 s**; torso and neck within 1px of the build from before the swap. A build outside either is a defect: report it, do not tune it.
- **Out of scope:** fingers, section 03's padding, any other visual's motion, mobile.

### Purpose (animation-planning-standard §1)
Delight. A relaxed, informal swing, like sitting on a table's edge. Not anxious.

### What it is
Whole-figure stop motion, uncut: no video, no cut-out legs. The two legs swing in opposite directions: when one lower leg swings toward the camera, the other swings away. Only the legs and shoes differ between frames. The upper body, asterisk, mesh and bubble are unchanged and unaffected.

### Frames
The strip `danny-leg-frames.webp`: 7 frames, index 0 to 6 = sheet frames 01, 03, 04, 05, 06, 07, 09. **Index 3 (sheet frame 05) is the rest pose.** Sheet frames 02 and 08 are dropped on purpose (they made the left leg bounce at the ends). Every frame is already aligned to frame 05 and has a transparent background: the build does no alignment, no keying and no cropping. One file, so there is no per-frame loading and no flicker.

### Phase 1 — static swap (stop here for Hadar's overlay)
- In `_includes/personetics/danny-figure.njk`, replace `<img class="dfg__figure" src=".../danny.png" ...>` with `<div class="dfg__figure"><img class="dfg__strip" src="/assets/personetics/danny-figure/danny-leg-frames.webp" alt="" width="4606" height="821" decoding="async"></div>`. No `loading` attribute (eager): the loop must never start on an unloaded image.
- In `danny-figure.css`, `.dfg__figure` keeps `position: absolute; z-index: 1` and changes to `top: calc(340.32px + var(--dfg-seat-drop)); left: 95.12px; width: 204.35px; height: 254.97px; overflow: hidden` (it was top 318, left 62, sized by the old image).
- New rule `.dfg__strip`: `display: block; width: 700%; height: 100%; max-width: none;`. **`max-width: none` is required**: `css/reset.css` sets `img { max-width: 100% }`, which would squeeze the strip to the window's width and show all seven frames at once. No `will-change`.
- The strip is shifted by `transform: translateX(calc(var(--dfg-frame) * -100% / 7))` (the percentage is of the strip's own width). `--dfg-frame` defaults to `3`, set in CSS, so the markup renders the rest pose with no script.
- DOM order and paint order unchanged: figure window, asterisk, mesh lines, all positioned with `z-index: 1`.
- No script change in phase 1. Stop and wait for Hadar's overlay against the previous build.
- The window's position carries about 1px of registration error (§1 Layout), so Hadar's overlay is the judge of the 1px. If it is off, only the window's `top` and `left` change, never the strip or the frame art.
- After she confirms phase 1, `danny.png` is deleted (no dead assets), as the first step of the phase 2 prompt.

### Phase 2 — motion
- **Mechanism:** JS sets `--dfg-frame` (an integer 0 to 6) on the strip, only when the integer changes. Nothing else animates. Property animated: `transform` only. A hard cut between frames, with no tween (stop motion).
- **One clock, one loop, one gate.** Add the legs to the existing code in `js/personetics/danny-figure.js`: a `renderLegs(t)` called from the existing `tick()` next to `render(t)`, with the same `t = performance.now() / 1000` as the head mesh. No second `requestAnimationFrame` loop and no second observer: the existing `ViewportGate.observe` controls both.
- **Trigger and exit:** as the head mesh. Nothing plays before `onEnter`. On exit the loop stops and the legs freeze on the last frame shown (no reset). On enter the legs render from the current `t`, so legs and mesh stay on one clock.
- **Reduced motion:** no new handling, per Hadar's standing rule (28 Oct 2026). The existing reduced-motion path calls only `render(0)` and never `renderLegs`, so the legs simply stay on the rest frame. Do not add anything.
- **Curve:** none between frames. The timing is the sine blend below, set by Hadar by eye on the viewer. The standard's `linear` rule (§2) is for constant-speed loops and does not apply: a pendulum eases at each end by design.
- **Total duration (standard §3):** **Fixed**, a continuous loop with a cycle of **1.50 s** (0 to 6 to 0, so ping-pong is built in). More than 15% off is a defect: report it.
- **Seekable:** the frame is a pure function of `t`. No accumulated state, no randomness.
- **Paint order (standard §7a):** geometric. The legs and shoes are inside one image, so nothing inside the figure can overlap or reorder. Against the other layers the static order never changes.
- **Not a platform feature:** there is no browser feature for stop-motion frame swaps from one strip.

### Reference code — port this
```js
const TAU = Math.PI * 2;
const CYCLE = 1.5;   // s, locked by Hadar 29 Oct
const SINE = 0.55;   // 0 = constant speed, 1 = full sine; locked by eye
const FRAMES = 7;    // strip index 0..6

// Frame index as a pure function of time t (seconds). One cycle goes 0 -> 6 -> 0.
// The sine makes the ends linger and the middle fast; blending toward a triangle
// wave (SINE < 1) keeps the legs from parking at the ends.
function frameAt(t) {
  const p = (t / CYCLE) % 1;
  const sn = 0.5 - 0.5 * Math.cos(TAU * p);
  const tri = p < 0.5 ? 2 * p : 2 - 2 * p;
  const s = tri + (sn - tri) * SINE;
  return Math.round(s * (FRAMES - 1));
}
```
Check values: `frameAt(0)` = 0, `frameAt(0.375)` = 3, `frameAt(0.75)` = 6, `frameAt(1.125)` = 3, `frameAt(1.5)` = 0.

### Checks before reporting (Claude Code)
- Phase 1: figure window 204.35 × 254.97 at (95.12, 343.72) measured inside the page; the strip is 1430.45 × 254.97 and shows index 3; the bubble is unchanged; the asterisk and mesh sit 3.4px lower (seat drop); the cognitive banking diagram is unchanged.
- Phase 2: the five `frameAt` check values above, run in the browser console; `--dfg-frame` changes only when the integer changes; with the section off screen, no loop runs.

### Checklist (animation-planning-standard §9)
- [x] Purpose named (delight)
- [x] Curves: no tween between frames; the timing is set by eye on a playable viewer
- [x] Duration: cycle 1.50 s, Hadar's call
- [x] Total stated: Fixed, 1.50 s
- [x] No magnitude hand-picked: `SINE` and `CYCLE` set by Hadar on sliders
- [x] Bumps and cascades: n/a (no bump, no cascade)
- [x] Every value a pure function of `t`
- [x] Randomness: none
- [x] `transform` only
- [x] No `scale(0)`, no rotating SVG
- [x] Paint order stated: geometric
- [x] Platform feature check: stated above
- [x] Reduced motion: n/a by Hadar's standing rule (28 Oct 2026), stated above
- [x] Conflict rule: if a value here conflicts with an existing source file, the source wins: STOP and report

---

## 3. Motion — bubble wobble and text entrance (locked 29 Oct 2026)

Two additions to the finished figure: the speech bubble's ellipse sways, and the quote text fades in once. The tail, figure, asterisk, head mesh and legs do not change.

> **Conflict rule.** If any number in this section conflicts with the existing layout or code, the existing source wins. STOP and report. Do not redesign, flatten or substitute your own markup.

### Sources
| Element | Source |
|---|---|
| Sway | Playable comparison, option A ("Bill Pay rotation"), picked by Hadar 29 Oct: https://claude.ai/artifact/5qwJLTGSZyHvj8JsLcG4hF (version 1). ±5° at 0.60 rad/s, the same values as the Bill Pay AP manager blob (`css/components/ap-manager-orbit.css`, "Quote-blob sway"). The reference below is the sine formula Hadar watched. Bill Pay's own CSS approximates it with quarter-cycle keyframes: do not copy those. |
| Text entrance | Bill Pay AP manager quote entrance (`css/components/ap-manager-orbit.css`, "Quote entrance"): 900 ms, strong ease-out, 20px rise, fade. Text only: Danny has no quote mark, so there is no 180 ms delay. Watched in the same comparison page. |
| Ellipse and tail shapes | The two child shapes of the §1 bubble Union (node IDs in §1 Sources), read through the Figma Plugin API on 29 Oct 2026: vector path data plus node transforms. Full file contents below. Nothing to download. |
| Clock, gate, reduced-motion path | Existing `js/personetics/danny-figure.js`: `tick`, `sync`, `ViewportGate.observe`. |

### Unresolved — do not build
- (none)

### Definition of done
- **What Hadar looks at:** `/case-studies/personetics/`, section 02. Phase 1: overlaid on the build from before the split: the bubble and tail must look identical. Phase 2: the sway and the text entrance, against the comparison page.
- **The numbers that matter:** sway ±5° at 0.60 rad/s (10.47 s cycle, derived); text entrance 900 ms; the tail's position never changes. A build outside any of these is a defect: report it, do not tune it.
- **Out of scope:** legs, head mesh, asterisk, sections 01 and 03, Bill Pay (its sway stays CSS keyframes, untouched), mobile, the bubble's size and position.

### Purpose (animation-planning-standard §1)
- Ellipse sway: delight. Ambient life, same as the AP manager blob in Bill Pay.
- Text entrance: state indication. The quote arrives once the figure is on screen.
- Tail stays still: spatial consistency. It points at Danny's head.

### Shape files
`_includes/personetics/danny-figure-bubble.svg` — replace its content with the ellipse only (the old file held ellipse and tail merged). Mapped into the bubble's own 501 × 329 space from the Figma vector: x' = 501.0007 − y, y' = 328.9867 − x. Colour set in CSS.
```svg
<svg aria-hidden="true" focusable="false" overflow="visible" style="display: block;" width="501" height="328.986" viewBox="0 0 501 328.986" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M 500.538 126.562 C 502.246 115.371 498.999 99.485 494.456 89.030 C 490.645 80.257 484.650 73.240 479.053 65.809 C 461.543 41.874 439.758 28.008 411.397 17.086 C 384.332 6.661 367.518 4.542 338.543 1.962 C 321.785 0.472 306.597 -0.249 289.561 0.077 C 272.196 0.406 254.685 0.150 237.302 0.786 C 212.873 2.008 188.025 4.661 163.629 6.650 L 128.569 9.558 C 111.596 10.977 99.903 11.919 84.146 18.603 C 73.656 22.566 63.778 27.759 54.174 33.263 C 29.205 47.573 20.566 76.831 13.257 101.252 C 11.209 108.101 9.320 115.467 7.300 122.312 C 5.411 128.727 5.575 141.378 3.266 146.549 C 0.958 151.719 1.172 168.701 0.563 187.641 C 0.412 192.343 1.293 197.843 1.172 202.871 C 0.945 212.012 -0.407 223.252 0.122 232.168 C 1.659 238.496 6.075 245.567 8.564 251.511 C 12.237 260.287 16.137 270.261 22.866 277.395 C 35.342 290.625 50.312 299.336 67.376 306.756 C 73.236 309.306 79.000 312.897 85.280 314.737 C 93.004 316.864 102.382 317.921 110.450 319.179 C 118.138 320.377 126.755 322.396 134.316 323.287 C 142.082 324.203 151.189 324.704 159.112 325.302 L 201.268 328.424 C 214.583 329.360 226.871 328.902 240.156 328.653 C 252.380 328.080 266.128 329.375 278.221 328.346 C 308.179 325.794 337.550 324.342 367.084 319.012 C 385.205 315.741 398.004 312.217 414.997 305.734 C 431.877 299.295 446.352 294.362 458.095 280.716 C 486.410 251.779 495.815 213.453 498.952 175.745 C 500.368 159.284 499.347 142.797 500.538 126.562 Z" fill="currentColor"/>
</svg>
```
`_includes/personetics/danny-figure-bubble-tail.svg` — new file. The Figma vector's own coordinates.
```svg
<svg aria-hidden="true" focusable="false" overflow="visible" style="display: block;" width="116.555" height="56.398" viewBox="0 0 116.555 56.398" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M0 55.5905 C39.7302 42.9226 55.7439 13.2519 58.7845 0 L116.555 8.4228 C73.0414 53.9733 20.721 58.8473 0 55.5905 Z" fill="currentColor"/>
</svg>
```

### Phase 1 — split the bubble (static; stop for Hadar's overlay)
- Before overwriting `danny-figure-bubble.svg`, read the old file. Every anchor of the new ellipse path that also appears in the old path (outside the tail region) must match within 0.01. If not, STOP and report.
- `danny-figure.njk`: replace `<div class="dfg__bubble">{% include "personetics/danny-figure-bubble.svg" %}</div>` with:
```njk
  <div class="dfg__bubble">
    <div class="dfg__bubble-body">{% include "personetics/danny-figure-bubble.svg" %}</div>
    <span class="dfg__bubble-tail">{% include "personetics/danny-figure-bubble-tail.svg" %}</span>
  </div>
```
- `danny-figure.css`: `.dfg__bubble` stays as it is (static wrapper, 501 × 329 at (267, 21)). Add after it:
```css
/* The ellipse's own box: its centre is the ellipse's centre (250.5, 164.5), the rotation origin in §3 phase 2. */
.dfg__bubble-body {
  position: absolute;
  inset: 0;
}

/* The tail never moves. Position = Figma frame (284, 283) minus the bubble origin (267, 21). Later in the DOM than the ellipse, so it paints on top; same fill, so no seam. */
.dfg__bubble-tail {
  position: absolute;
  top: 262px;
  left: 17px;
  width: 116.555px;
  height: 56.398px;
}
```
- Nothing else changes. Existing `.dfg__bubble svg { display: block }` covers both SVGs.
- Checks before reporting: measured inside the page, bubble wrapper 501 × 329 at (267, 21); tail 116.555 × 56.398 at (284, 283) in the visual frame; screenshot of `.dfg__bubble` before and after the change, report the maximum pixel difference (edge antialiasing only; anything else, STOP); the cognitive banking diagram and everything else unchanged.
- Stop here. Phase 2 starts only after Hadar confirms the overlay.

### Phase 2 — motion
- **Mechanism:** JS sets `transform` on `.dfg__bubble-body` (rotation) and `opacity` / `transform` on `.dfg__quote` (entrance). Nothing else moves. Properties animated: `transform` and `opacity` only.
- **One clock, one loop, one gate.** Add `renderBubble(t)` and `renderText(t)` to the existing `tick()` next to `render(t)` and `renderLegs(t)`, same `t = performance.now() / 1000`. No second loop, no new observer. The existing `ViewportGate.observe` controls both.
- **Sway:** the reference below. Continuous, from the first `onEnter`. On exit the loop stops and the bubble freezes at its last angle (same as the legs). Starts at whatever angle `t` gives, no reset.
- **Text entrance:** plays **once, the first time the figure enters the viewport** (the existing gate's `onEnter`). Never replays on scrolling away and back. In the first `onEnter`, record `enterT = performance.now() / 1000` if it is not set. `renderText(t)` returns early until `enterT` is set and after the entrance is done.
- **Before the trigger:** the quote is hidden only once JS has armed the block: the script adds class `dfg--armed` to `.dfg` at load (not when reduced motion is on). Without JS the quote shows. CSS:
```css
/* Hidden until the entrance plays; the script arms the block. Without JS the quote shows. */
.dfg--armed .dfg__quote {
  opacity: 0;
  transform: translateY(20px);
}
```
- **When the entrance finishes** (k reaches 1): clear the quote's inline `opacity` and `transform` and remove `dfg--armed` in the same frame, so the final state is plain CSS. Set a done flag.
- **Curves:** sway is a continuous sine (no easing, standard §2/§6). Text uses the strong ease-out token `cubic-bezier(0.23, 1, 0.32, 1)`.
- **Total duration (standard §3):** sway is a continuous loop, cycle 2π / 0.60 = **10.47 s, derived**. Text entrance **900 ms, fixed**. More than 15% off is a defect: report it.
- **Seekable:** both are pure functions of `t` (and of `enterT` for the text). No accumulated state, no randomness.
- **Paint order (standard §7a):** static. The ellipse paints first, the tail on top, both white; the order never changes. The quote does not move with the ellipse.
- **Reduced motion:** per Hadar's standing rule (28 Oct 2026), as the legs: no fade, no sway. The script never arms the block, so the quote shows. In the existing reduced-motion branch of `sync()`, also clear the quote's inline styles, remove `dfg--armed` and clear the bubble's inline `transform`, so the same holds if the setting turns on while the page is open.

### Reference code — port this
Copied from the approved comparison page (version 1), option A. Only what option A uses; the sliders, tabs and options B and C are not ported. Where the prose and the code disagree, the code wins.
```js
var CX = 250.5, CY = 164.5;           // the ellipse's own centre, bubble space
var deg = Math.sin(t * P.rate) * P.amp;   // option A: P.amp = 5, P.rate = 0.60
el.body.setAttribute("transform", "rotate(" + deg.toFixed(3) + " " + CX + " " + CY + ")");

function bezier(x1, y1, x2, y2) {
  var f = function (a, b, t) { return 3 * a * (1 - t) * (1 - t) * t + 3 * b * (1 - t) * t * t + t * t * t; };
  return function (x) {
    if (x <= 0) return 0; if (x >= 1) return 1;
    var lo = 0, hi = 1, t = x;
    for (var i = 0; i < 28; i++) { t = (lo + hi) / 2; if (f(x1, x2, t) < x) lo = t; else hi = t; }
    return f(y1, y2, t);
  };
}
var EASE_OUT = bezier(0.23, 1, 0.32, 1);

function renderText(t) {
  var k = EASE_OUT((t - textStart) / 0.9);
  el.quote.style.opacity = k.toFixed(3);
  el.quote.style.transform = "translateY(" + ((1 - k) * 20).toFixed(2) + "px)";
}
```

### What changes in the port (everything else is copied)
1. The rotation is a CSS transform on the HTML wrapper: `bubbleBody.style.transform = "rotate(" + deg.toFixed(3) + "deg)"`. The wrapper's box centre is (250.5, 164.5), so the default `transform-origin` is the reference's `CX, CY`. Constants: `BUBBLE_ANGLE = 5`, `BUBBLE_RATE = 0.60`, no `P` object.
2. `t` is the shared clock. `textStart` becomes `enterT` (seconds on that clock at the first `onEnter`); the `(t - textStart)` term becomes `(t - enterT)`.
3. Elements: `bubbleBody` = `.dfg__bubble-body`; the quote = `.dfg__quote`.
4. The reference's per-frame text writes stop at k = 1 (see "When the entrance finishes").
5. Same file: `js/personetics/danny-figure.js`. CSS additions go in the existing `danny-figure.css`. No new files besides the tail SVG.

### Checks before reporting — phase 2 (Claude Code)
- Measured inside the page: the bubble wrapper, the tail and the quote keep their boxes (the quote's box excluding its entrance offset); the tail's bounding rect is identical across 10 samples over one sway cycle.
- The ellipse's rotation angle never exceeds 5° and returns to 0 every 10.47 s (sample `getComputedStyle(...).transform`).
- At ±5° (set the transform by hand), no quote text overlaps the ellipse edge and the tail's base stays inside the ellipse. Report the smallest gap.
- Quote: opacity 0 before the first enter; ends at opacity 1 with no inline styles and no `dfg--armed`; scrolling away and back does not replay it.
- With the section off screen, no loop runs. Legs and head mesh unchanged. Cognitive banking diagram unchanged.

### Checklist (animation-planning-standard §9)
- [x] Purpose named for every element
- [x] Curves: sine for the sway; the strong ease-out token for the text
- [x] Durations: from the approved page and the Bill Pay quote
- [x] Total stated: sway derived 10.47 s per cycle; text fixed 900 ms
- [x] No magnitude hand-picked: ±5° and 0.60 are Bill Pay's, picked by Hadar on the comparison
- [x] Bumps and cascades: n/a
- [x] Pure function of `t`
- [x] Randomness: none
- [x] `transform` and `opacity` only
- [x] No `scale(0)`; the rotating shape is an HTML wrapper with its default centre origin, so `transform-box` is n/a
- [x] Paint order stated: static
- [x] Platform feature check: none applies to a sine sway on a fixed shape
- [x] Reduced motion stated
- [x] Replay: text once on first viewport entry; sway continuous while on screen
- [x] Conflict rule present: source wins, STOP and report
