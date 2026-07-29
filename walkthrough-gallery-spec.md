# Walkthrough Gallery — Build Spec

Bill Pay case study widget. Simpler sibling to the Cockpit widget — same case study, same token system, much smaller scope. Reflects the final, as-built state (original spec + all review fixes applied).

Figma source: node [609:30266](https://www.figma.com/design/3XG9JnADI2psNR3B7TwQdx/Portfolio?node-id=609-30266) ("gallery" frame), Components page. Arrow component set: [609:30333](https://www.figma.com/design/3XG9JnADI2psNR3B7TwQdx/Portfolio?node-id=609-30333).

---

## 1. Tokens

No hardcoded values anywhere — everything traces to `css/tokens.css`.

```css
--primitive-black: #393a3d;
--primitive-disable: #b5b5b5;
--spacing-8: 8px;
--spacing-32: 32px;
--spacing-64: 64px;
```

Two widget text tokens added for this build (`--text-widget-legend` already existed and is reused as-is for the headline — no new token needed there):

```css
--text-widget-caption-description: 300 11px/13px "Literata", Georgia, serif;
--text-widget-counter: 800 12px/1 "Manrope", Arial, sans-serif;
```

**Gotcha (line-height):** Figma's dev-mode export named the description's text style `desktop/widgets/cockpit/Navigation/step-subheadline`, matching an *existing* token (`--text-widget-step-subheadline`, 8px line-height) — but the raw markup showed `leading-[normal]`, which doesn't match. Calling `get_variable_defs` directly on the node confirmed the real bound line-height is `100` (i.e. 100%/ratio-1), not 8px. This Gallery instance genuinely uses a different, untightened line-height than Cockpit's own locally-overridden value, so it got its own token (`--text-widget-caption-description`) rather than reusing the mismatched one. Line-height was subsequently increased a further 2px (11px → 13px) after live review for readability — the value above is the current, final one.

---

## 2. File placement

```
css/widgets/bill-pay/walkthrough-gallery/   (gallery.css, visual.css, caption.css, progress-bar.css, legend.css)
js/bill-pay/walkthrough-gallery.js
walkthrough-gallery.html
```

One CSS file per component-part, per convention — no fused single stylesheet.

---

## 3. Layout — responsive via flex + aspect-ratio

Sits inside an existing 800px-wide host frame, but the internal layout is proportional (flex + `aspect-ratio`, not fixed pixel widths) so it holds up if the host frame's width ever changes.

- **Outer container** (`.gallery`): flex row, `align-items: flex-start`, gap `var(--spacing-64)`.
- **Visual box** (`.gallery__visual`, left): `flex: 1 0 0`, `aspect-ratio: 565 / 375`, `min-width: 0`, border-radius `var(--spacing-8)`, box-shadow `0px 0px 30px` of `primitive-black` at 15% (via `color-mix(in srgb, var(--primitive-black) 15%, transparent)` — this codebase's established pattern for an rgba-equivalent without hardcoding rgba()). Placeholder solid dark fill for now; real screenshots/GIFs come later.
- **Nav panel** (`.gallery__navigation`, right): fixed width 159px, `flex-shrink: 0`, flex column, gap `var(--spacing-32)`.
  - **Caption block** (`.gallery__caption`): flex column, gap `var(--spacing-8)`, width 100%.
    - Headline: `--text-widget-legend` (Literata Medium, 13px, line-height 1.27), color `primitive-black`, single line, ellipsis on overflow.
    - Description: `--text-widget-caption-description` (Literata Light, 11px/13px), color `primitive-black`, width 100%, wraps up to 3 lines via `-webkit-line-clamp`. **Fixed height: 64px, regardless of text length** — shorter text leaves empty space below, box never shrinks, keeping everything below it pinned in the same position across all steps. Overflow beyond 3 lines is hidden, not scrollable.
  - Below caption: progress bar, then legend row (`.gallery__interaction`), gap 19px between them, both full width.
    - Legend row (`.gallery__legend`): `display: flex; justify-content: space-between; align-items: center`. Counter: `flex: 1 0 0`. Arrows group (`.gallery__buttons`): fixed width 41px, `flex-shrink: 0`, gap 5px between icons.

---

## 4. Content

4 steps, placeholder copy — swap for real Bill Pay content later (see `STEPS` in `walkthrough-gallery.js`):

1. "Entry point — Bills page" / "Choose a single bill from the unpaid tab"
2. "Review payment details" / "Confirm the amount and vendor info"
3. "Select account & date" / "Pick where the payment comes from"
4. "Payment confirmed" / "Done — the bill is on its way"

---

## 5. Progress bar

- 1px height, full width of nav panel. Track: `var(--primitive-disable)`. Fill: `var(--primitive-black)`.
- Fill animates linearly from 0% to 100% width over the step's duration. Default duration: 4000ms per step, structured as a per-step overridable value (`STEPS[n].duration`) — later, animated GIF/HTML steps can supply their own real duration instead of the default.
- **Resets to 0% width and restarts from zero on every step change — manual or automatic. Never carries over or accumulates across steps.** This was the bug found in the Figma Make reference build (it summed progress across all steps instead of resetting per step) and must not be repeated.
- **The reset itself is instant, not animated** — jumps to 0% width with no transition, no visible reverse-fill. Only the forward fill is animated. (Fixed post-review: the reset was originally visibly un-winding back to zero. `retriggerProgressBar()` now explicitly forces `transition: none` + `animation: none` + `width: 0%`, forces a reflow, then re-enables the transition and starts the new forward-fill animation — see `js/bill-pay/walkthrough-gallery.js`.)

---

## 6. Step counter ("01 / 04")

- Font: `--text-widget-counter` (Manrope ExtraBold, 12px, line-height 1), color `primitive-black`.
- **Single persistent DOM element, created once, never recreated or duplicated.** On step change: update `textContent` directly, then retrigger its animation via the class-toggle/forced-reflow/re-add pattern (`retriggerAnimation()`). This was a real bug in an earlier build attempt (duplicate counters stacking in the DOM) — do not repeat it.
- Transition: fade in + slide up 8px (`translateY(8px)` → `translateY(0)`, opacity 0→1), 260ms.
- **Delay: ~500ms after the step change begins**, so the counter visibly appears after the caption's own bloom finishes, not simultaneously with it. (Fixed post-review: originally fired at the same time as the caption; `.gallery__counter--animating`'s animation now carries an explicit `500ms` delay — `animation: gallery-counter-in 260ms ease 500ms both`.)

---

## 7. Arrows (prev/next)

Figma source: component set [609:30333](https://www.figma.com/design/3XG9JnADI2psNR3B7TwQdx/Portfolio?node-id=609-30333) ("arrows"), 4 variants (`left/hover`, `left/normal`, `right/hover`, `right/normal`) — collapsed in code to **one icon asset and two color states**, not four separate instances.

**Confirmed genuine SVG, not raster:** Figma's dev-mode export presented these as generic `<img>`-style asset references. Per this project's rule about not assuming codegen `<img>` exports are pre-flattened images, both "normal" and "hover" assets were downloaded and inspected directly — confirmed real SVGs with **identical path geometry**, differing only in `fill` (`#B5B5B5` vs `#393A3D`). This is why one inline `<svg>` with `fill="currentColor"`, controlled via CSS `color`, is correct here rather than importing 4 separate image files.

- One chevron SVG (the "right" variant), built inline in `buildArrowIcon()`. Prev = the same icon rotated 180° via CSS `transform: rotate(180deg)` (`.gallery__arrow-icon--prev`); next = unrotated. No four separate icon assets.
- Color is the only real state: normal = `var(--primitive-disable)`, hover = `var(--primitive-black)`, transition 150ms ease.
- 18px icons, 5px gap between the two.
- Click: immediately advances/reverses the step regardless of current timer or animation state — cancels and resets the progress bar for the new step.
- Looping: next on step 4/4 → step 1. Prev on step 1 → step 4. No dead ends.

---

## 8. Step transition — "bloom" (caption only)

**The screen (visual box) does not animate on step change — cuts instantly to new content.** (Fixed post-review: the bloom was originally applied to both the screen and the caption; the visual-box bloom rule, its `@keyframes`, and the JS/HTML references to it were removed entirely. `visual.css` now holds only static box styling — see §3.)

Caption (headline + description) only:
- Animate: opacity 0→1, scale 0.96→1, blur(4px)→blur(0px).
- 380ms, `cubic-bezier(0.4, 0, 0.2, 1)`, starting 100ms after the step change begins (`animation: gallery-bloom 380ms cubic-bezier(0.4, 0, 0.2, 1) 100ms both`, in `caption.css`).
- Implemented as a real CSS `@keyframes` that retriggers on every step change — via the same toggle-class/force-reflow/re-add pattern used elsewhere in this codebase (Cockpit's thumb-peek, this widget's own counter). A transition that only fires once on page load does not satisfy this — that was exactly what was missing from an earlier build attempt after two rounds of prompting.

---

## 9. Behavior summary

- Auto-advances every step's duration (4000ms default).
- Manual override via arrows at any time.
- Every step change — auto or manual — triggers all three, together: instant progress-bar reset, bloom transition on the caption only (screen cuts instantly), counter fade-slide delayed ~500ms after the caption bloom begins.
- Loops continuously, no dead ends.
- No duplicate DOM elements ever created for counter, screen, or caption — single persistent elements, animations retriggered via class toggle + reflow.

---

## 10. Review fixes applied (post-build)

Four changes made after live review of the initial build, all reflected in the sections above and already applied to the shipped code:

1. Description line-height increased +2px (11px → 13px) for readability.
2. Bloom transition removed from the screen entirely; kept on the caption only (§8).
3. Progress-bar reset made instant — no visible reverse/unwind motion (§5).
4. Counter transition given a ~500ms delay so it appears after the caption, not simultaneously (§6).
