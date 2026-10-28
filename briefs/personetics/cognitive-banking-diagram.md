# Personetics — Cognitive banking diagram (visual spec)

Section 01 (Sleeping giants / Context), between body paragraphs 2 and 3.
Scope doc: `briefs/personetics/personetics-build-scope.md`. This file holds every value for this visual, static and motion. The scope doc only links here.

Status (28 Oct 2026): mesh motion **locked** (Hadar, playable comparison). Values in §1–§2 were read from Figma on 28 Oct and are final; do not re-read Figma for them. §4 decisions settled 28 Oct. Not built. Build spec is §5: static and motion in one round (Hadar's call, 28 Oct: motion is already locked).

---

## 1. Static — sourced values

### Sources
| Element | Source |
|---|---|
| Diagram frame | Figma file `3XG9JnADI2psNR3B7TwQdx`, node `2005:52725` ("Frame 1197135564", inside "Slot 4" `1979:48648`). 800 × 514, white fill, clips content, no auto layout (absolute positions). |
| Mesh component | Node `2005:52577`, renamed `mesh` (28 Oct). 136 × 125. |
| Mesh instances | `mesh / insight` `2005:52727`, `mesh / logic` `2005:52728`, `mesh / data` `2005:52726`. |
| Leaders | `leader / insight`, `leader / logic`, `leader / data` (direct children of the frame). |
| Illustration group | `2005:52732`: `red-shape` `2005:52733` + `lighthouse`, `compass`, `reel` (layers renamed 28 Oct). |
| Callouts | Frames "Frame 3" (Insight), "Frame 1" (Logic), "Frame 2" (Data). Vertical auto layout, gap 12. |
| Tag | Frame `2005:52760`. Scope doc says **duplicate** the Bill Pay design-principles tag (see §4). |

All coordinates below are relative to the diagram frame's top-left, in px.

### Mesh component (`mesh`)
Six dots, ellipse 6 × 6 (r = 3), fill `#6B6C72`. Coordinates are dot **centres**, in component space:

| Dot | Centre | Position |
|---|---|---|
| `dot-01` | (3, 42) | left |
| `dot-02` | (113, 3) | top |
| `dot-03` | (133, 93) | right |
| `dot-04` | (90, 119) | bottom right |
| `dot-05` | (44, 122) | bottom left |
| `dot-06` | (68, 42) | inner |

Lines: stroke `#6B6C72`, 0.3px. In Figma they are 5 multi-segment paths (`line 01-02-03-04-05` closed outline, `line 05-03`, `line 02-04-01`, `line 05-06-03`, `line 02-06-01`). In code they are 12 single edges, each drawn from its two dot centres every frame:

```
01-02, 02-03, 03-04, 04-05, 05-01, 05-03, 02-04, 04-01, 05-06, 06-03, 02-06, 06-01
```
(Figma path vertices sit up to 1.5px off some dot centres; drawing from dot centres removes that. Intentional.)

### Instances — transform and pin
Transform = Figma `relativeTransform` to the diagram frame, `[[a, c, e], [b, d, f]]` written as SVG `matrix(a b c d e f)`.

| Instance | SVG matrix | Pinned dot | Surrounds |
|---|---|---|---|
| `mesh / insight` | `matrix(-0.99550 0.09479 -0.09479 -0.99550 435.236 222.437)` | `dot-05` | lighthouse |
| `mesh / logic` | `matrix(0.99965 -0.02644 0.02644 0.99965 413.371 220.596)` | `dot-03` | compass |
| `mesh / data` | `matrix(-0.39056 0.92058 -0.92058 -0.39056 322.188 345.820)` | `dot-03` | reel |

Pins were computed from the leader endpoints: each pinned dot's on-screen centre matches its leader's mesh end within 1px.

The section 02 Danny head uses the same component with **no pin** (every dot drifts). Its placement is specced with the Danny figure, not here.

### Leaders
Polyline, stroke `#6B6C72`, 0.3px, no fill. First point = pinned dot.

| Leader | Points |
|---|---|
| `leader / insight` | (380,105) → (380,50) → (464,50) |
| `leader / logic` | (550,310) → (590,310) → (590,338) |
| `leader / data` | (184,432) → (26,432) → (26,361) |

### Illustration group (`2005:52732`)
| Layer | Type | Box (x, y, w, h) |
|---|---|---|
| `red-shape` `2005:52733` | group of 8 vectors, fills `#E5071A` and `#871105` | 206, 157, 305, 325 |
| `lighthouse` `2005:52742` | rectangle, image fill | 282, 31, 117, 154 |
| `compass` `2005:52743` | rectangle, image fill | 393, 220, 89, 89 |
| `reel` `2005:52744` | rectangle, image fill | 234, 306, 92, 107 |

The red shape's two fills are exactly `--primitive-red` and `--primitive-red-dark` (scope doc §1).

### Callouts
Each: title → rule → body → keywords, vertical stack, gap 12.

| Callout | Frame box (x, y, w, h) |
|---|---|
| Insight | 477, 37, 249, 140 |
| Logic | 572, 344, 228, 140 |
| Data | 0, 199, 228, 140 |

| Part | Font | Colour |
|---|---|---|
| Title | Literata Medium (500), 16px, line-height 146% | `#393A3D` (bound to a Figma variable) |
| Rule | line 26px wide, 1px stroke | `#E5071A` |
| Body | Literata ExtraLight (200), 14px / 20px, Figma style `mocks/field/Literata` | `#393A3D` (bound to a Figma variable) |
| Keywords | Literata Medium (500), 14px, line-height 150% | `#E5071A` |

Body wraps naturally inside the frame width (249 / 228). No hand-placed line breaks.

### Tag (Figma values, for reference against the Bill Pay duplicate)
Frame `2005:52760` at (0, 69), 206 × 28: fill `#393A3D`, radius 6.27, padding 6.27 / 12.53. Text "Headline headline headline", Literata SemiBold (600) 13.28px, white.

### Paint order (static, from Figma layer order, back to front)
1. `mesh / data`, `mesh / insight`, `mesh / logic`
2. leaders
3. illustration group (red shape, then photos)
4. callouts, tag

**Meshes paint behind the red shape and the photos.** Static order is valid: it never changes during the motion.

---

## 2. Motion — LOCKED (Hadar, 28 Oct 2026)

| Item | Value |
|---|---|
| Purpose | Delight (animation-planning-standard §1) |
| What moves | Every mesh dot except the pinned one. Edges follow their dots. Leaders, callouts, photos, red shape: static. |
| Pattern | Wave: one slow wave rolls across each mesh, in the mesh's own (component) coordinates |
| Amplitude | 8px |
| Loop | `8 / 1.3` s (≈ 6.15s) per cycle at rate 1.00 |
| Desync | Per mesh: Insight phase 0, rate 1.00 · Logic phase ⅓ loop, rate 0.88 · Data phase ⅔ loop, rate 1.13 (standard §6: ±10–15% between parallel tracks) |
| Curve | None: continuous sine motion, constant cycle (standard §2/§6) |
| Total duration | n/a: continuous loop, starts on page load, never stops |
| Seekability | Every position is a pure function of `t`. No randomness, no accumulated state. |
| Clearance | Checked over a full cycle at true size: no dot comes within 2px of an edge it isn't part of, and nothing comes within 4px of callout text. Logic and Data reach that limit at exactly 8px; Insight is clear to 12px. **Amplitude must not go above 8px.** |
| Reduced motion | Decorative, so full stop: render at `t = 0` and do not animate (standard §8). |
| Properties | Dot centres and edge endpoints are SVG attributes updated per frame. The meshes are small inline SVG (6 dots, 12 lines each). |

### Approved reference — port this, do not re-derive it
Where the prose and the code disagree, the code wins. Constants are the locked values.

```js
const TAU = Math.PI * 2;
const AMPLITUDE = 8;            // px, locked
const LOOP = 8 / 1.3;           // s, locked

const BASE = [[3,42],[113,3],[133,93],[90,119],[44,122],[68,42]];   // dot-01 … dot-06
const EDGES = [[0,1],[1,2],[2,3],[3,4],[4,0],[4,2],[1,3],[3,0],[4,5],[5,2],[1,5],[5,0]];

const MESHES = [
  { name: "insight", pin: 4, phase: 0,         rate: 1.00 },   // pin = dot-05
  { name: "logic",   pin: 2, phase: TAU / 3,   rate: 0.88 },   // pin = dot-03
  { name: "data",    pin: 2, phase: 2*TAU / 3, rate: 1.13 },   // pin = dot-03
];
// Danny head (section 02): pin: null.

function offset(i, theta, A) {
  const [x, y] = BASE[i];
  const ph = (x / 140 + y / 120) * Math.PI;
  return [0.4 * A * Math.cos(theta - ph), A * Math.sin(theta - ph)];
}

function dotPositions(mesh, t, A = AMPLITUDE) {
  const theta = (TAU / LOOP) * mesh.rate * t + mesh.phase;
  return BASE.map((b, i) => {
    if (i === mesh.pin) return b;
    const [dx, dy] = offset(i, theta, A);
    return [b[0] + dx, b[1] + dy];
  });
}
// Each frame: set each dot's cx/cy from dotPositions(); set each edge's x1/y1/x2/y2
// from the two dots it joins. Positions are in component space; the instance's
// SVG matrix (§1) places the mesh in the diagram.
```

---

## 3. Not in scope of this file
- Danny figure and its head placement (section 02).
- Leg motion.

## 4. Decisions — settled 28 Oct 2026
| Item | Decision |
|---|---|
| Photos | Exported by Hadar, PNG @2x, transparent: `assets/personetics/cognitive-banking-diagram/lighthouse.png` (234 × 308), `compass.png` (178 × 178), `reel.png` (184 × 214). Displayed at the 1x box sizes in §1. |
| Red shape | Exported by Hadar as SVG (305 × 325, no ids). Lives at `_includes/personetics/cognitive-banking-diagram-red-shape.svg` and is included inline. Raw hex already replaced by classes: `red-shape__face--light` (5 paths, was `#E5071A`) and `red-shape__face--dark` (3 paths, was `#871105`). CSS sets their `fill` to `--primitive-red` / `--primitive-red-dark`. |
| `image 371` | Invisible leftover. Deleted from Figma by Hadar. Not built. |
| Callout text | From the text sync: `## visual: diagram` lines in `briefs/personetics/article-text.md` (synced 28 Oct). Never Figma's copy, which is stale. Line format: `Title · k1 · k2 · k3 — body`. |
| Fonts | Literata 500 and 600 roman are loaded. 200 roman is not: add its own `@import` (one weight per import, see the `tokens.css` header comment). |
| Tag | Duplicate the Bill Pay tag: classes `.principles-tag` / `.principles-tag__label` from `css/components/principles.css`, markup as in `_includes/bill-pay/scene-gallery-accordion.njk`. Bill Pay size, not the Figma values in §1 (Hadar). Keeps Figma's top-left position (0, 69); width follows its text. Text: placeholder "Headline headline headline" (Figma). |
| Placement | Marker `[[VISUAL:diagram]]` in section 01, after body paragraph 2. Gaps above and below = the content column's existing `gap: var(--spacing-64)`, which matches Figma (64 / 64). No extra margin. |
| Paint order | Static DOM order = §1 paint order. Valid through phase 2: the order never changes. |

## 5. Build spec (static + motion, one round)

Build type: **new structure, build new**, except the tag (duplicate, §4). The markup renders every mesh at `t = 0` (dots at `BASE`); the script animates it per §2. With reduced motion on, the page shows the static layout, which is the view to overlay on Figma.

### Files
| File | What |
|---|---|
| `_includes/personetics/cognitive-banking-diagram.njk` | Macro `cognitiveBankingDiagram(lines)`. `lines` = `s.visuals.diagram`. |
| `css/widgets/personetics/cognitive-banking-diagram/cognitive-banking-diagram.css` | Component CSS. |
| `js/personetics/cognitive-banking-diagram.js` | Mesh motion: §2 reference ported; reads `BASE` and edges from the markup (single source). Draws frames only while on screen; `t` = seconds since page load. |
| `case-studies/personetics/index.njk` | Import the macro; add an `elif block.name == "diagram"` branch beside `persona`; add the new CSS and `../../css/components/principles.css` to `stylesheets`, and the script to `scripts`. |
| `css/tokens.css` | One `@import` for Literata 200; three text tokens (below). |

### Tokens (add with the other `--text-*` tokens)
```css
--text-diagram-callout-title: 500 16px/1.46 "Literata", Georgia, serif;
--text-diagram-callout-body: 200 14px/20px "Literata", Georgia, serif;
--text-diagram-callout-keywords: 500 14px/1.5 "Literata", Georgia, serif;
```
Colours already exist: `#393A3D` = `--primitive-black`, `#6B6C72` = `--primitive-grey-dark`, `#E5071A` = `--primitive-red`, `#871105` = `--primitive-red-dark`.

### Structure (DOM order = paint order, back to front)
Root `.cbd`: `position: relative`, 800 × 514, `overflow: hidden` (Figma clips). No background (section 01 is white). Every child is `position: absolute` at its §1 box. Coordinates and box sizes are diagram geometry from Figma and are written as px in the component CSS, with one comment saying so; colours, type and the callout gap use tokens.

1. **Line layer** — one inline `<svg>`, 800 × 514, `viewBox="0 0 800 514"`, `aria-hidden="true"`, at (0, 0). Inside, in this order:
   - Three `<g class="cbd__mesh" data-mesh="…">` in the order data, insight, logic, each with the §1 `transform="matrix(…)"`. Inside each: the 12 edges as `<line>` (from the §2 `EDGES` list, endpoints = dot centres from `BASE`), then the 6 dots as `<circle r="3">` at `BASE`. Each dot and edge gets an index attribute so phase 2 can address it.
   - The three leaders as `<polyline>` with the §1 points.
   - Strokes and fills from CSS: stroke `--primitive-grey-dark`, `stroke-width: 0.3`, polylines `fill: none`, dots fill `--primitive-grey-dark`.
2. **Red shape** — the included SVG at (206, 157). CSS fills for its two face classes.
3. **Photos** — `<img alt="">` for lighthouse, compass, reel at their §1 boxes, with `width`/`height` = the 1x box.
4. **Callouts** — Data, Insight, Logic at their §1 frame boxes. Each: title, rule (26 × 1, `--primitive-red`), body, keywords; `flex-direction: column`, `gap: var(--spacing-12)`. Text from the sync line: title = text before the first ` · `; keywords = text between the first ` · ` and ` — ` (separators kept); body = text after ` — `. Callouts are matched to boxes by title. The split happens inside the macro; no change to `.eleventy.js` or `_data/`. If any callout line is missing or doesn't match the format, STOP and report. Body wraps naturally in the box width.
5. **Tag** — Bill Pay markup, at (0, 69).

### Reduced motion
§2: full stop, render at `t = 0`. Switching the setting while the page is open takes effect immediately.

### Check before reporting (Claude Code)
- Measured inside the page, not across a screenshot: diagram 800 × 514; 64px gaps above and below; red shape box 206, 157, 305 × 325; each photo and callout at its §1 box.
- Network tab: Literata 200 roman loads.
- `/case-studies/bill-pay/` unchanged.
