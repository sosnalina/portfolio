# Scene Stack — Process_accountability gallery (shell)

> If any number in this spec conflicts with the source's own layout, **the source wins. STOP and report.** Do not redesign, do not flatten, do not substitute your own markup.

## What this is

A new gallery widget for the Bill Pay case study. It is the `scene-accordion` mechanism (the Quality_of_decisions gallery) rotated from side-by-side to stacked: each panel takes the full 800px content column, and the panels sit one above the other.

**The word "rotate" describes the intent only. Nothing in this build uses `transform: rotate()`.** The change is a set of explicit property swaps, listed in §3.

This round builds the shell: correct geometry, correct motion, and a placeholder clock. The scenes that go inside the panels come later and will override the placeholder durations with their own.

## 1. Sources

| Element | Source |
|---|---|
| Panel mechanism, markup shape, class structure | `assets/scene-gallery/bill-pay/scenes-accordion.html` — the `#ag-row` subtree only |
| Panel / caption / tag CSS and all timing values | the `.ag-*` rules inside `scenes-accordion.html` |
| Stage sizing and section layout | `css/widgets/bill-pay/scene-accordion/scene-accordion.css` |
| Section markup pattern | `_includes/scene-accordion.njk` |
| Asset registration | `case-studies/bill-pay/index.njk` |
| Tag component | existing `principles-tag` component — reuse, do not duplicate |
| Panel copy | the existing `scene-gallery-accountability` placeholder markup in the same page |
| Colour, spacing, type tokens | `css/tokens.css` |
| Geometry, timing model and behaviour decisions | Hadar, 14 Sep |

**`scene-accordion` and `scene-gallery-accordion` are finished, committed, reviewed work. They are read-only.** Copy from them. Do not edit either, and do not edit the `scene-gallery-accountability` placeholder — it stays on the page untouched for now.

### Why the shell comes out of the HTML file, not the CSS file

`scene-accordion.css` says so in its own header comment: the panels, tag, caption and the width transition live entirely inside `scenes-accordion.html`. The widget CSS only sizes the iframe stage and lays out the row beneath it. The accordion mechanism exists in that HTML file and nowhere else, so that is where it is copied from. Mirror this architecture rather than relocating the shell into the widget CSS — the two galleries must not diverge structurally.

## 2. Files

All four are **new**. Duplicate the structure of the `scene-accordion` equivalents and change only what this spec specifies.

| New file | Duplicate from |
|---|---|
| `assets/scene-gallery/bill-pay/scenes-stack.html` | `assets/scene-gallery/bill-pay/scenes-accordion.html` — **the `#ag-row` subtree and its `.ag-*` rules only** |
| `css/widgets/bill-pay/scene-stack/scene-stack.css` | `css/widgets/bill-pay/scene-accordion/scene-accordion.css` |
| `js/bill-pay/scene-stack.js` | `js/bill-pay/scene-accordion.js` |
| section partial, alongside `_includes/scene-accordion.njk` | `_includes/scene-accordion.njk` |

### Critical: what not to copy

`scenes-accordion.html` is ~348KB because it carries a full Bill Pay mock plus four `qod2-track` elements, a magnifier, float cards, a calendar row and a footer. **None of that comes across.** `scenes-stack.html` contains the column, two panels, two captions, the tag, the `.sst-*` CSS and the clock script — nothing else. Both panel interiors are empty in this round.

If the new file exceeds ~15KB, something was copied that shouldn't have been. Stop and report.

### COMPONENT-MAP.md

`COMPONENT-MAP.md` is the single source of truth for component-to-file mapping and tracks which parts of the Bill Pay mock are duplicated into each gallery. The new widget needs an entry: its four files, the fact that its shell is duplicated from `scenes-accordion.html`, and that its panel interiors are empty pending the scenes. Add it in the file's existing format — do not invent a new one.

## 3. Layout deltas from `scene-accordion`

Every other aspect of the mechanism carries over unchanged.

| Property | scene-accordion | scene-stack |
|---|---|---|
| Container flex direction | `row` | `column` |
| Animated panel dimension | `width`, 141px ↔ 627px | `height`, 141px ↔ 461px |
| Fixed panel dimension | `height: 461px` | `width: 800px` — never animates |
| Tag translate axis | `translateX` | `translateY` |
| Tag translate distance | collapsed width + gap | collapsed height + gap = **173px** |
| Caption slide | `translateX(-14px)` → 0 | `translateY(-14px)` → 0 |
| Gap | 32px | 32px |
| Radius | 24px | 24px |
| Duration and easing | 480ms, `cubic-bezier(0.215, 0.61, 0.355, 1)` | identical |

**Panels never change position.** Panel 0 is always the upper one, panel 1 always the lower. Only their heights change.

## 4. Geometry and tokens

Define in `scenes-stack.html` under the `sst-` prefix. No hardcoded values — colour, spacing and type reference existing tokens.

```css
--sst-panel-width: 800px;
--sst-panel-active-height: 461px;
--sst-panel-collapsed-height: 141px;
--sst-duration: 480ms;
--sst-ease: cubic-bezier(0.215, 0.61, 0.355, 1);
--sst-caption-collapse-duration: 288ms;
--sst-content-fade: 200ms;
--sst-content-reveal-delay: 350ms;
--sst-inset-y: 48px;
--sst-tag-height: 22px;
--sst-caption-band-height: 120px;
--sst-overhang: 20px;
```

- Column height is `calc(var(--sst-panel-active-height) + var(--spacing-32) + var(--sst-panel-collapsed-height))` = **634px, fixed.** The section must not reflow when panels swap.
- Panel 0 background: `var(--primitive-green-light)`.
- Panel 1 background: `var(--primitive-white)`.
- Section background: the existing `section--grey-light` modifier. Do not author a new background rule.
- Tag: `position: absolute; top: var(--sst-inset-y); left: calc(-1 * var(--sst-overhang));` — it overhangs the panel's left edge, exactly as in the reference.
- Caption block: `left: var(--spacing-64); top: calc(var(--sst-inset-y) + var(--sst-tag-height));` height `var(--sst-caption-band-height)`, `flex-direction: column`, `justify-content: center`, `gap: 7px`.
- Headline font `var(--text-widget-legend)`. Description font `var(--text-widget-step-subheadline)`. Both `color: var(--primitive-black)`.

## 5. Markup

`#sst-column` inside `scenes-stack.html`:

```html
<div class="sst-column" id="sst-column">
  <div class="sst-panel sst-panel--green is-active" id="sst-panel-0" data-index="0">
    <div class="sst-panel__content">
      <div class="sst-caption">
        <p class="sst-caption__headline">Inline audit trail</p>
        <p class="sst-caption__description">Every decision behind a bill, who made it and why, proving the process held before money moves</p>
      </div>
    </div>
  </div>
  <div class="sst-panel sst-panel--white" id="sst-panel-1" data-index="1">
    <div class="sst-panel__content">
      <div class="sst-caption">
        <p class="sst-caption__headline">Review before release</p>
        <p class="sst-caption__description">Where bills become payments. The last checkpoint before funds move.</p>
      </div>
    </div>
  </div>
  <div class="sst-tag" id="sst-tag">
    <div class="principles-tag"><p class="principles-tag__label"># Process_accountability</p></div>
  </div>
</div>
```

The tag is a **single shared element**, a sibling of both panels — not one per panel. It is targeted from the active panel by sibling selector, matching the reference's `.ag-panel--green.is-active ~ .ag-tag`.

Captions are **one per panel**, inside `.sst-panel__content`. They do not translate with the tag; they fade and slide in place.

### Caption overflow check

Captions carry `white-space: nowrap`, copied from the reference. Panel 0's description is 95 characters. At `var(--text-widget-step-subheadline)` inside 800px with a 64px left inset, it should fit. **Measure it. If it overflows the panel, STOP and report — do not switch it to wrap and do not shorten the copy.**

## 6. Behaviour

Collapsed panels show **no content at all** — no headline, no description. `opacity: 0` on the caption, as in the reference.

There is **no counter, no progress rail and no arrow buttons.** Do not include `.gallery__interaction` or anything from `walkthrough-gallery/{gallery,legend,progress-bar}.css`.

### The timing model

The gallery plays itself. Panels also respond to clicks. One clock governs both.

- Each panel has a **hold duration**. Placeholders for this round: **4000ms for panel 0, 4000ms for panel 1.** These are placeholders only — the scenes that land in the panels later replace them with their own lengths, so keep them in one editable array, not inlined at call sites.
- When a panel's hold elapses, the next panel activates.
- After panel 1's hold elapses with no interaction, it **loops back to panel 0** and keeps going. This matches the existing galleries.
- **Clicking a collapsed panel activates it and plays it from its own start.** There is no resume and no memory of prior position: activation resets that panel's clock to zero, whether it came from a click or from the previous panel finishing. One rule, both paths.
- Clicking the already-active panel does nothing. It does not restart it.

### Viewport gating

The clock does not run while the gallery is outside the viewport. Use **`IntersectionObserver`** — do not hand-roll scroll-offset maths.

On leaving the viewport the clock **pauses**; on re-entering it **resumes from where it stopped**. It does not restart, and it does not reset to panel 0. This matches the current behaviour of the existing galleries. A proper cross-gallery fix for viewport start behaviour is pending and is explicitly not in scope here — do not improve on the existing behaviour in this widget alone.

### Activation

Activation mirrors the reference's `applyScene`:

```js
function applyScene(index) {
  panels[0].classList.toggle("is-active", index === 0);
  panels[1].classList.toggle("is-active", index === 1);
}
```

Drive the clock from a single timer or a single `requestAnimationFrame` loop that owns elapsed time — not one timer per panel, and not nested `setTimeout` chains. Every activation path goes through `applyScene` and resets elapsed to zero. One class swap drives both directions: the panel gaining `.is-active` grows 141 → 461 while the one losing it shrinks 461 → 141, both starting the same frame on the same curve, so the pair reads as a single movement. There is no separate reverse code path.

No parent-page message protocol in this round.

### Motion values

| Element | Purpose | Value |
|---|---|---|
| Panel height | State indication | 480ms, `var(--sst-ease)` |
| Tag translateY | Spatial consistency — tag follows the active panel | 0 ↔ 173px, 480ms, `var(--sst-ease)` |
| Caption in | State indication | opacity 0 → 1 and `translateY(-14px)` → 0, 480ms, `var(--sst-ease)` |
| Caption out | State indication | 288ms, `var(--sst-ease)` |
| Panel content | Explanation | opacity fade 200ms, with `var(--sst-content-reveal-delay)` on reveal so content appears after the panel has opened |

The 480ms-in / 288ms-out caption asymmetry is deliberate and is copied from the reference. Do not normalise it.

Animate `transform` and `opacity` only, with the single exception of `height` on the panel, which is inherent to the accordion and is what the reference animates too. No `top`, `left`, `width`, or `margin`.

### Reduced motion

```css
@media (prefers-reduced-motion: reduce) {
  /* panel height: change instantly, no transition */
  /* tag translateY: change instantly, no transition */
  /* captions: crossfade only, 150ms, no translate */
}
```

Panel size is how this widget communicates which scene is active, so under reduced motion it must still change — instantly, rather than not at all. The autoplay clock is unaffected.

## 7. Placement

The new section goes **directly above** the existing `scene-gallery-accountability` section, as its own `section section--grey-light`. Both galleries render on the page at once for now. The old one will be deleted in a later round; it is not touched here.

Register `scene-stack.css` and `scene-stack.js` in `case-studies/bill-pay/index.njk` the same way `scene-accordion`'s are registered.

## 8. Build phases

**Phase 1 — static layout.** Both panels at rest with panel 0 active: 800px wide, 461px and 141px tall, 32px gap, correct backgrounds, tag and caption in position, column exactly 634px. No transitions, no clock, no click wiring.

**Phase 2 — motion, clock and interaction.** Transitions, tag translate, caption fades, the autoplay clock, click activation, loop, and viewport gating.

**Phase 1 must be confirmed in the browser by Hadar before Phase 2 begins.** Each phase is its own prompt with its own stop instruction.

## 9. Done, for Phase 1

- What gets looked at: the two stacked panels at 800px in the browser, panel 0 green and active, panel 1 white and collapsed, tag sitting at the top-left of panel 0 and overhanging its edge.
- The one number: the column is **634px** tall. A build outside that is a defect to report, not a judgement call.
- Out of scope: panel interiors, the wave scene, any counter or arrow rail, and the existing placeholder gallery.
