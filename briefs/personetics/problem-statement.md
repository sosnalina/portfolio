# Personetics — Problem statement (visual spec)

Section 04 (Mind the gap / Discovery & Problem Definition), last element.
Scope doc: `briefs/personetics/personetics-build-scope.md`. This file holds every value for this visual: static and motion. The scope doc only links here.

Status (28 Oct 2026): static spec ships with the foundation build. §1 was updated on 28 Oct (new brace, black braces, Semi-Bold lead-ins); if the foundation build already shipped the earlier version, §1.1 lists the change. Motion (§2) is locked and ready to build after §1.1 is QA'd.

> **Conflict rule.** If any number in this spec conflicts with the existing layout or code, the existing source wins. STOP and report. Do not redesign, flatten or substitute your own markup.

---

## 1. Static

Build type: **new structure, build new.** No existing component is duplicated. Pattern: a macro, `problemStatement(lines)` in `_includes/personetics/problem-statement.njk`, plus its own CSS file. The page renders its sections in a loop from the synced text, so the block takes the persona lines as an argument. The problem statement is Personetics-only, so its files go case-study-first: `_includes/personetics/` and `css/widgets/personetics/problem-statement/` (one subfolder per widget, CLAUDE.md).

### Sources
| Element | Source |
|---|---|
| Frame | Figma file `3XG9JnADI2psNR3B7TwQdx`, node `I1979:49296;39:123;2004:52157`. Horizontal row, items centred, gap `spacing/64`, width 800. Height follows the text. |
| Right brace | **Hadar's SVG, supplied in chat 28 Oct**, 43 × 165 (replaces Figma vector `2009:52766`, 50.4 × 164.96). Full markup under "Brace asset". Figma is no longer a source for the brace (Hadar, 28 Oct). |
| Left brace | The same shape rotated 180°. Not a separate file. |
| Statement text | Fills the remaining width: 800 − 2 × 43 − 2 × 64 = **586**. Colour `--primitive-black`. |
| Text styles | Body: Literata Light Italic 16 / 37.66px (Figma style `desktop/articles/problem-statement`). Lead-ins: **Literata Semi-Bold Italic (600)** 16 / 37.66px (Hadar, 28 Oct; replaces Bold Italic 700 in Figma style `desktop/articles/problem-statement-lead`). |
| Brace colour | **`--primitive-black`** (Hadar, 28 Oct; replaces `--primitive-red`). Set in CSS; the fill inside the SVG file is ignored. |
| Copy | Text sync (scope doc §1): the LOCKED `[[VISUAL:persona]]` lines in workbench section s5. Never typed into this spec or the page by hand. Typographic apostrophes (’) kept. |
| Placement | Last element of section 04, at the `[[VISUAL:persona]]` marker (today: after body paragraph 3). Gap above = the content column's existing `gap: var(--spacing-64)` (`section.css`). No extra margin. |
| Viewport | Case study pages are desktop-only (`CLAUDE.md`). No mobile layout. |

### Unresolved — do not build
- (none)

### Dependencies
- Literata **Semi-Bold Italic (600)** must be loaded. Add one `@import` for `Literata:ital,wght@1,600` in `tokens.css`, as its own line after the existing italic imports, following the file's one-weight-per-import rule (see the comment at the top of `tokens.css`). Without it the browser fakes the weight.
- `--primitive-red` stays in `tokens.css` for the section badges; this component no longer reads it.

### Tokens (in `tokens.css`, with the other `--text-*` tokens)
```css
--text-problem-statement: italic 300 16px/37.66px "Literata", Georgia, serif;
--text-problem-statement-lead: italic 600 16px/37.66px "Literata", Georgia, serif;
```

### Brace asset
- File: `_includes/personetics/problem-statement-brace.svg`, included twice.
- Content: Hadar's SVG below, with two edits only: the path `fill` is `currentColor`, and the root has `aria-hidden="true" focusable="false"`. Root `width`, `height` and `viewBox` exactly as given (43 × 165). Path data character for character.
```svg
<svg xmlns="http://www.w3.org/2000/svg" width="43" height="165" viewBox="0 0 43 165" fill="none" aria-hidden="true" focusable="false">
  <path d="M4.32381 0.114817C5.01971 0.0451767 5.60642 0.0644351 6.28918 0.0383199C12.8602 -0.213599 18.484 0.683943 23.4185 5.52105C26.0364 8.06425 27.8768 11.3031 28.7226 14.8578C29.5712 18.4789 29.2804 26.6849 29.2817 30.8243L29.2844 54.9753C29.2791 57.8726 29.1278 61.6098 29.4435 64.4795C29.5554 65.4904 31.1761 66.8255 31.8483 67.5666C34.1702 70.1292 40.3518 75.45 41.8554 78.0861C42.6039 79.4238 42.9986 80.9319 42.9999 82.466C43.0065 84.05 42.5947 85.6074 41.8054 86.9803C40.2544 89.6745 34.1176 94.9386 31.8128 97.4945C31.1616 98.2168 29.5593 99.5279 29.4501 100.512C29.1318 103.387 29.2778 107.132 29.2831 110.023L29.2804 134.819C29.2804 138.619 29.5422 146.672 28.7792 149.997C27.9767 153.487 26.2153 156.682 23.6961 159.219C18.3288 164.632 13.3272 164.996 6.3589 164.998C4.46456 165.023 2.89383 164.853 1.46913 163.435C0.503543 162.469 -0.0265977 161.15 0.00102808 159.783C0.00629014 158.684 0.385149 157.621 1.07711 156.769C4.11595 152.994 10.341 156.324 14.4322 153.675C19.4798 150.405 19.1562 147.101 19.1365 141.646L19.126 134.265L19.122 105.468C19.1154 96.0539 19.6469 95.3138 26.2666 88.7027L32.4403 82.509C29.4462 79.52 22.2122 72.893 20.4994 69.5527C19.7864 68.1612 19.3904 66.5558 19.2365 65.0039C19.0655 63.2763 19.1273 61.5149 19.1273 59.7805L19.1299 52.0707V27.4996C19.1312 24.3571 19.3772 19.8787 18.7879 16.8955C18.5208 15.5461 17.404 13.9092 16.4791 12.9243C12.0906 8.25075 7.04034 11.5777 2.36237 9.40061C1.25734 8.7807 0.445662 7.60882 0.187821 6.40093C-0.513348 3.11437 1.22972 0.897217 4.32381 0.114817Z" fill="currentColor"/>
</svg>
```

### Markup (rendered by `problemStatement(lines)`)
`lines` = the `## visual: persona` lines of `briefs/personetics/article-text.md`. One `<p>` per line, with each line's lead-in (`I am a`, `I’m trying to`, `But`, `Because`, `Which makes me feel`, `In an ideal world`) in `<strong>`. A lead-in matches only at the start of a line, as whole words. The lines below are the 28 Oct synced text, shown only to fix the output structure.
```njk
{# Rendered output of problemStatement(lines) #}
<div class="problem-statement">
  <span class="problem-statement__brace problem-statement__brace--open">{% include "personetics/problem-statement-brace.svg" %}</span>
  <div class="problem-statement__text">
    <p><strong>I am a</strong> person living paycheck to paycheck, one bill away from overdraft.</p>
    <p><strong>I’m trying to</strong> build a cushion, so one bad month doesn’t knock me down.</p>
    <p><strong>But</strong> I can’t think past payday, and I don’t trust my bank.</p>
    <p><strong>Because</strong> they’re only good at charging fees, and my headspace is taken up by reaching the end of the month without falling short.</p>
    <p><strong>Which makes me feel</strong> anxious, ashamed, and on my own.</p>
    <p><strong>In an ideal world</strong> I’d see the hard days coming, stay in control without the guilt, and know my bank is on my side, so saving finally feels possible.</p>
  </div>
  <span class="problem-statement__brace">{% include "personetics/problem-statement-brace.svg" %}</span>
</div>
```

### CSS — `css/widgets/personetics/problem-statement/problem-statement.css`, linked from the Personetics page the same way `principles.css` is linked from Bill Pay
```css
.problem-statement {
  display: flex;
  align-items: center;
  gap: var(--spacing-64);
}

.problem-statement__brace {
  display: flex;
  flex: none;
  color: var(--primitive-black);
}

/* Opening brace = the closing brace rotated 180°.
   Rotates the HTML wrapper, so transform-origin is its centre by default. */
.problem-statement__brace--open {
  transform: rotate(180deg);
}

.problem-statement__text {
  flex: 1 1 auto;
  min-width: 0;
  font: var(--text-problem-statement);
  color: var(--primitive-black);
}

.problem-statement__text p {
  margin: 0;
}

.problem-statement__text strong {
  font: var(--text-problem-statement-lead);
}
```

### Check before reporting (Claude Code)
- Measured inside the page (not across a screenshot): block 800 wide, braces 43 × 165 and vertically centred, text column 586 wide, 64px gaps. Report the block's measured height: it follows the text, and the column widened from 571.2, so line breaks may differ from the old Figma frame.
- Braces render `--primitive-black`. Lead-ins render as real Semi-Bold Italic: the network tab shows the 600 italic file loading.

### 1.1 Change to an already-built foundation (28 Oct)
If the foundation build already shipped the earlier version (red 50.4 brace, Bold 700 lead-ins), this is a change, not a rebuild. Exactly these edits:
1. Replace `_includes/personetics/problem-statement-brace.svg` with the asset above.
2. `problem-statement.css`: `.problem-statement__brace` `color` → `var(--primitive-black)`.
3. `tokens.css`: `--text-problem-statement-lead` weight `700` → `600`; the Literata italic 700 import → italic 600. Before removing the 700 import, check nothing else uses italic 700; if something does, keep it and add 600 as a new line.
4. Nothing else. The text width follows from flex.

---

## 2. Motion — entrance (locked 28 Oct)

### Approved reference
Playable comparison, option **A · Double split**, approved by Hadar 28 Oct ("lock it"): https://claude.ai/artifact/MkzZJ3fnDYokEmfPobnYXV (version 16). The reference code below is copied from it and is the spec. **Port it. Do not re-derive the behaviour from the prose. Where the prose and the code disagree, the code wins.** Options E and EE on that page are rejected and are not part of this spec.

### Definition of done (motion build)
- **What Hadar looks at:** `/case-studies/personetics/`, scrolling section 04 into view, against the reference page at 1× and 0.25×.
- **The number that matters:** total duration **2750 ms, derived** (braces settle at 1930; text ends at 1850 + 900). A build more than 15% off is a defect: report it.
- **Out of scope:** any other visual's motion; static changes beyond §1.1; mobile.

### Purpose (animation-planning-standard §1)
- Braces: **explanation + delight.** One cell divides twice; the divisions draw the frame that holds the persona's words.
- Text: **state indication.** The statement arrives once its frame is in place.

### Beats — one continuous gesture, no holds
Each beat starts while the previous one is still finishing, so nothing comes to rest until the end (Hadar, 28 Oct).

| Time | Beat | Curve |
|---|---|---|
| 0–300 ms | A dot appears at the block's centre: radius 3.6 → 4, opacity 0 → 1 | `cubic-bezier(0.23, 1, 0.32, 1)` |
| 200–700 ms | The dot splits in two with a liquid neck. Each half travels to its brace's middle point (the tip of the triangle) and grows to the brace's thickness (radius 4 → 5) | `cubic-bezier(0.77, 0, 0.175, 1)` |
| 620–1220 ms | Each half splits again into two pens. They run up and down the brace's centre line, drawing the brace behind them, and disappear into the rounded tips. The drawing runs at 0.75× the speed of the other beats (600 ms; Hadar, 28 Oct) | `cubic-bezier(0.77, 0, 0.175, 1)` |
| 1100–1300 ms | The liquid softness fades out; the braces are crisp | linear |
| 1230–1930 ms | The braces drift apart to their final positions, pass them by about 1px and settle back | `cubic-bezier(0.6, 0, 0.3, 1.06)` (overshoot picked by Hadar on the reference slider, 28 Oct) |
| 1850–2750 ms | The text block fades in while drifting up 20px. Same entrance as the Bill Pay AP manager quote. Starts 80 ms before the braces settle, so no text shows while they open | `cubic-bezier(0.23, 1, 0.32, 1)` |

Total: **2750 ms, derived.**

### Mechanism
- **Liquid splits = metaball ("goo") filter:** Gaussian blur, then an alpha threshold (`feColorMatrix` alpha row `0 0 0 20 -8`). Blur `stdDeviation` = `min(6, radius × 0.5)`, fading to 0 between 1100 and 1300 ms; at 0 the filter is removed. Standard technique, not a bespoke mechanism.
- **Drawing = a mask** on the brace path: two stroked lines along the brace's centre line (middle point → top tip, middle point → bottom tip), 16px wide, butt caps, revealed with `stroke-dasharray` / `stroke-dashoffset`. The reveal edge sits at each pen's centre, under the dot. The lines extend past the middle point (head, 8.5px) and past each tip (tail), so the triangle and the tips are complete the moment the pens arrive. Mask coordinates are brace-local, so one mask serves both braces.
- **Pens** = four circles (two per brace) placed along the same centre lines with `getPointAtLength`. Hidden once the drawing completes; each ends inside its rounded tip.
- **From 1300 ms** the exact brace path is drawn, no mask, and the drift moves it by `transform` only.
- **Both braces render in one SVG, inside one filter group.** Two separate SVGs cannot share a liquid neck. So the entrance draws into a temporary overlay SVG covering the block (`aria-hidden`). At the end it hands off to the static braces from §1, which sit at exactly the same place; the overlay is removed.
- **Coordinates are a rule, not rendered positions:** overlay width W and height H = the block's own box, measured once at init, inside the page. Centre = (W/2, H/2). Right brace box: x = W − 43, y = (H − 165)/2. Before drifting, each brace sits 30px from the centre (right box starts at W/2 + 30). The reference uses W = 800, H = 302; the build uses the measured values.
- **Seekable:** every frame is a pure function of `t`. No accumulated state.
- **Trigger:** plays **once, the first time the block enters the viewport**; never replays on scrolling back (Hadar, 28 Oct; matches Bill Pay). Use the project's existing viewport helper (the hero's Phase 2 build, commit `172181e`, used `ViewportGate`). Pre-flight confirms its path and threshold.
- **Before the trigger:** braces and text are hidden only once JS has armed the block (a class the script adds). Without JS the block shows its final static state.

### Exceptions to `animation-planning-standard` §7 (deliberate, stated)
- The drawing animates a mask's `stroke-dashoffset`, and the splits use an SVG filter. Neither is transform/opacity. Both run on one small element for about 1.3 s and stop; the filter is removed once its blur reaches 0. After 1300 ms motion is transform/opacity only.

### Paint order (§7a)
- **Geometric.** The braces are only near the centre while the text is fully transparent (text starts at 1850 ms, when the braces are within 1px of their final positions). Visible elements never overlap. The pens render above the brace they draw, inside the same overlay.

### Reduced motion (§8)
- No splits, drawing, drift or rise. Braces fade in 0 → 1 over 200 ms; text fades in 0 → 1 over 300 ms (the Bill Pay quote's reduced-motion rule). Linear. No overlay.

### Reference code — port this
Copied from the approved artifact (version 16). Only option A; the comparison UI, options E and EE, the scrubber and the sliders are not ported.

Overlay SVG:
```html
<svg viewBox="0 0 800 302" width="800" height="302" aria-hidden="true">
  <defs>
    <!-- Metaball ("goo") filter: blur, then a hard alpha threshold, so touching shapes merge like liquid. -->
    <filter id="goo" x="0" y="0" width="800" height="302" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
      <feGaussianBlur id="gooBlur" in="SourceGraphic" stdDeviation="6" result="b"></feGaussianBlur>
      <feColorMatrix in="b" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -8"></feColorMatrix>
    </filter>
    <!-- Reveals the brace along its centre line, from the middle point outward. Butt caps keep the
         reveal edge under the pen. Coordinates are brace-local, so one mask serves both braces. -->
    <mask id="reveal" maskUnits="userSpaceOnUse" x="-20" y="-20" width="90" height="205">
      <path id="mUp" fill="none" stroke="#fff" stroke-width="16" stroke-linecap="butt"></path>
      <path id="mDn" fill="none" stroke="#fff" stroke-width="16" stroke-linecap="butt"></path>
    </mask>
  </defs>
  <g id="braces" fill="var(--stage-brace)">
    <path id="bl"></path><path id="br"></path>
    <g id="pen" hidden>
      <g id="penR"><path class="penBrace" mask="url(#reveal)"></path></g>
      <g id="penL"><path class="penBrace" mask="url(#reveal)"></path></g>
      <circle class="dot" r="5"></circle><circle class="dot" r="5"></circle>
      <circle class="dot" r="5"></circle><circle class="dot" r="5"></circle>
    </g>
  </g>
</svg>
```

Script:
```js
// ---------- Easing ----------
function bezier(x1, y1, x2, y2) {
  const f = (a, b, t) => 3 * a * (1 - t) * (1 - t) * t + 3 * b * (1 - t) * t * t + t * t * t;
  return function (x) {
    if (x <= 0) return 0; if (x >= 1) return 1;
    let lo = 0, hi = 1, t = x;
    for (let i = 0; i < 28; i++) { t = (lo + hi) / 2; if (f(x1, x2, t) < x) lo = t; else hi = t; }
    return f(y1, y2, t);
  };
}
const EASE_OUT = bezier(0.23, 1, 0.32, 1);        // enter / exit
const EASE_IN_OUT = bezier(0.77, 0, 0.175, 1);    // move / morph on screen
const DRIFT_EASE = bezier(0.6, 0, 0.3, 1.06);     // drift apart, ~1px overshoot (Hadar, 28 Oct)
const clamp01 = v => v < 0 ? 0 : v > 1 ? 1 : v;
const prog = (t, start, dur, ease) => ease(clamp01((t - start) / dur));
const lerp = (a, b, k) => a + (b - a) * k;

// ---------- Geometry ----------
const STAGE_W = 800, STAGE_H = 302;               // port: the block's measured width / height
const CX = STAGE_W / 2, CY = STAGE_H / 2;
const RB_W = 43, RB_H = 165, RB_TOP = (STAGE_H - RB_H) / 2, RB_X0 = STAGE_W - RB_W;
const CLOSE_SHIFT = RB_X0 - 430;                   // port: RB_X0 - (CX + 30)
const restTransforms = dx => ({
  tr: `translate(${(RB_X0 - dx).toFixed(2)} ${RB_TOP})`,
  tl: `translate(${(RB_W + dx).toFixed(2)} ${RB_TOP + RB_H}) rotate(180)`
});

// The brace's centre line, from its middle point to the top tip and to the bottom tip (brace-local coords).
const PEN_R = 5; // half the brace's arm thickness (19.13 → 29.28)
const PEN_MID = [38.5, 82.5];
// The reveal line runs past both ends of the centre line: HEAD covers the outer half of the middle point,
// TAIL covers the end of each rounded tip. The pens themselves run only between the middle point and the tip.
const PEN_UP_D = "M47 82.5 L38.5 82.5 L26.5 70 C24.6 68 24.2 66 24.2 62 L24.2 27 C24.2 14 18 6 4.6 4.8 L-3 4.2";
const PEN_DN_D = "M47 82.5 L38.5 82.5 L26.5 95 C24.6 97 24.2 99 24.2 103 L24.2 138 C24.2 151 18 159 4.6 160.2 L-3 160.8";
const PEN_UP = document.getElementById("mUp"), PEN_DN = document.getElementById("mDn");
PEN_UP.setAttribute("d", PEN_UP_D); PEN_DN.setAttribute("d", PEN_DN_D);
const PEN_HEAD = 8.5, PEN_TAIL = Math.hypot(7.6, 0.6);
const PEN_FULL = PEN_UP.getTotalLength();
const PEN_LEN = PEN_FULL - PEN_HEAD - PEN_TAIL; // middle point → tip centre
const penAt = p => PEN_HEAD + PEN_LEN * p;      // pen position along the line
// Reveal edge sits at the pen's centre, under the dot; the tail closes over the last 10% of the stroke.
const revealAt = p => p <= 0 ? 0 : penAt(p) + PEN_TAIL * clamp01((p - 0.9) / 0.1);
[PEN_UP, PEN_DN].forEach(el => el.setAttribute("stroke-dasharray", `${PEN_FULL} ${PEN_FULL}`));
document.querySelectorAll(".penBrace").forEach(el => el.setAttribute("d", BRACE_D)); // port: BRACE_D read from the brace SVG

// ---------- Braces at time t ----------
function braces(t) {
  const enter = prog(t, 0, 300, EASE_OUT);
  const s = prog(t, 200, 500, EASE_IN_OUT);
  const p = prog(t, 620, 600, EASE_IN_OUT);
  const drift = prog(t, 1230, 700, DRIFT_EASE);
  const r = lerp(4 * lerp(0.9, 1, enter), PEN_R, s);
  const dx = CLOSE_SHIFT * (1 - drift);
  const tf = restTransforms(dx);
  const goo = Math.min(6, r * 0.5) * (1 - prog(t, 1100, 200, x => x));
  if (t >= 1300) return Object.assign({ dl: BRACE_D, dr: BRACE_D, alpha: 1, goo: 0 }, tf);
  // Brace-local point → stage, for each side (the left brace is the right one rotated 180°).
  const toR = ([x, y]) => [RB_X0 - dx + x, RB_TOP + y];
  const toL = ([x, y]) => [RB_W + dx - x, RB_TOP + RB_H - y];
  const up = PEN_UP.getPointAtLength(penAt(p)), dn = PEN_DN.getPointAtLength(penAt(p));
  const pens = side => {
    const to = side === "r" ? toR : toL;
    const m = to(PEN_MID);
    // Before arrival the pens ride on the travelling dot; afterwards they follow the centre line.
    const lag = [(1 - s) * (m[0] - CX), (1 - s) * (m[1] - CY)];
    return [up, dn].map(q => { const a = to([q.x, q.y]); return [a[0] - lag[0], a[1] - lag[1]]; });
  };
  return { pen: { tl: tf.tl, tr: tf.tr, reveal: p, r, right: pens("r"), left: pens("l"), showDots: p < 1 }, alpha: enter, goo };
}

// ---------- Applying a frame ----------
function render(t) {
  const b = braces(t);
  const bl = document.getElementById("bl"), br = document.getElementById("br");
  const pen = document.getElementById("pen");
  // SVG elements have no .hidden property: toggle the attribute itself.
  if (b.pen) pen.removeAttribute("hidden"); else pen.setAttribute("hidden", "");
  if (b.pen) {
    bl.setAttribute("d", ""); br.setAttribute("d", "");
    document.getElementById("penR").setAttribute("transform", b.pen.tr);
    document.getElementById("penL").setAttribute("transform", b.pen.tl);
    [PEN_UP, PEN_DN].forEach(el => el.setAttribute("stroke-dashoffset", (PEN_FULL - revealAt(b.pen.reveal)).toFixed(2)));
    const pts = b.pen.right.concat(b.pen.left);
    pen.querySelectorAll(".dot").forEach((c, i) => {
      c.setAttribute("cx", pts[i][0].toFixed(2)); c.setAttribute("cy", pts[i][1].toFixed(2));
      c.setAttribute("r", b.pen.r.toFixed(2)); c.style.display = b.pen.showDots ? "" : "none";
    });
  } else {
    bl.setAttribute("d", b.dl);
    br.setAttribute("d", b.dr);
  }
  if (b.tl) { bl.setAttribute("transform", b.tl); br.setAttribute("transform", b.tr); }
  else { bl.removeAttribute("transform"); br.removeAttribute("transform"); }
  const g = document.getElementById("braces");
  g.style.opacity = b.alpha;
  if (b.goo > 0.05) {
    document.getElementById("gooBlur").setAttribute("stdDeviation", b.goo.toFixed(2));
    g.setAttribute("filter", "url(#goo)");
  } else g.removeAttribute("filter");
  renderText(t);
}

// ---------- Text: the Bill Pay AP manager quote entrance ----------
const TEXT_START = 1850, TEXT_DUR = 900, TEXT_RISE = 20;
function renderText(t) {
  const k = prog(t, TEXT_START, TEXT_DUR, EASE_OUT);
  textEl.style.opacity = k;
  textEl.style.transform = `translateY(${((1 - k) * TEXT_RISE).toFixed(2)}px)`;
}

// ---------- Reduced motion: no splits, drawing, drift or rise ----------
function renderReduced(t) {
  // port: targets the static braces and text; no overlay
  braceEls.forEach(el => { el.style.opacity = prog(t, 0, 200, x => x); });
  textEl.style.opacity = prog(t, 0, 300, x => x);
  textEl.style.transform = "none";
}
```

### What changes in the port (everything else is copied)
1. `STAGE_W` / `STAGE_H` = the block's measured width and height; the overlay's `viewBox`, `width`, `height` and the filter's `width`/`height` match. `CLOSE_SHIFT = RB_X0 - (CX + 30)`.
2. `BRACE_D` = the `d` of the included brace SVG, read from the DOM. Path data lives in one file only.
3. Overlay fill = `--primitive-black` (replaces the reference page's `--stage-brace`).
4. Element ids namespaced (e.g. `problem-statement-goo`, `problem-statement-reveal`) so they can't clash with the page.
5. `textEl` = `.problem-statement__text`; `braceEls` = the two `.problem-statement__brace` spans.
6. Static braces stay hidden while the overlay plays. At the end (t ≥ 1930) the overlay's final frame equals the static braces' position: show the static braces, remove the overlay. If they don't line up, STOP and report.
7. Files: `js/personetics/problem-statement.js`; CSS additions in the existing `problem-statement.css`.
8. The reference page's base CSS hid `[hidden]` elements; the site has no such rule. `problem-statement.css` adds `.problem-statement__overlay [hidden] { display: none; }` so the pen group hides after 1300 ms. (28 Oct)

### Unresolved — do not build
- (none)

### Checklist (animation-planning-standard §9)
- [x] Purpose named for every element
- [x] Curves: project tokens, plus the drift curve chosen by eye on the reference
- [x] Durations: from the reference; the drawing's 0.75× pace and the 900 ms text entrance are Hadar's calls
- [x] Total stated: 2750 ms, derived
- [x] No magnitude hand-picked: overshoot picked by Hadar on a slider
- [x] Bumps: n/a
- [x] Cascades: n/a
- [x] Pure function of `t`
- [x] Randomness: none
- [x] transform/opacity, with two stated exceptions (mask dash, filter)
- [x] No `scale(0)` entrance: the dot starts at radius 3.6, opacity 0
- [x] Rotating SVG: the left brace's 180° is a `transform` attribute with an explicit translate in user space, not CSS `transform-origin`; `transform-box` n/a
- [x] Paint order: geometric
- [x] Platform features: metaball filter, SVG mask, `getPointAtLength`; no bespoke engine
- [x] Reduced motion stated
- [x] Replay: once, on first viewport entry
- [x] Conflict rule present: source wins, STOP and report
