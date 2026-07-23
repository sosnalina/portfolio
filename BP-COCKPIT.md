# BP Cockpit — Figma Design Guidelines

Covers Figma structure and asset conventions only — does not duplicate the Behavioral Spec (mechanism/logic) or the Notion content tables (data).

---

## 1. Frame & Layout Constraints

- Widget is built for an **800px-wide desktop frame** — fills it, not centered with margin.
- **Height is fixed**, not content-driven / auto.
- **Mobile is explicitly deferred** — not addressed in this pass.

---

## 2. Naming Convention

Follows the general naming convention defined in CLAUDE.md — kebab-case, structural-role names, no Figma defaults.

Current named structure (Cockpit Widget-specific):
- **left-nav**: `nav-panel`, `headline-row`, `content-row`, `divider-wrapper`, `steps-column`
- **MemberTab**: `member-row`, `highlight-track`, all 5 columns named `Team-member` (all are real linked instances)
- **StepsRail**: subtitle text layer named `subtitle`
- **CenterStage**: `quote-block`, `quote-divider`, `section-divider`, `pain-points-divider`, `does-column`, `tags-row`

---

## 3. Tokenization

**Rule: everything traces to a `primitive/*` or `spacing/*` variable — no hardcoded values.**

Variables in active use:
- Colors: `primitive/black`, `primitive/white`, `primitive/green`, `primitive/grey-dark`, `primitive/grey-medium`, `primitive/grey-light`, `primitive/orange`, `primitive/disable`
- Opacity: `primitive/opacity-inactive` = 50% — shared by MemberTab's journey-mode dimming and toggle's inactive track
- Corner radius (spacing tokens doing double duty as radius tokens): `spacing/12` (StepsRail cards, toggle, MemberTab track/highlight), `spacing/16` (outer frame corners), `spacing/32` (Tag, pill-shaped)
- Layout spacing: `spacing/8`, `spacing/24` (CenterStage panel gap)

**Non-issue, do not touch:** a local paint style called `avatar-core-fill` covers the persona avatar illustration vectors. This has zero effect on the build — those illustrations are exported as PNG and committed to the repo (§8); the coding agent never touches their underlying Figma fill data.

---

## 4. Text Styles

Follows the general text-style rule defined in CLAUDE.md — every text layer must be genuinely bound to a named style, not just matching a token's value locally.

Named styles in use (Cockpit Widget-specific):
- `desktop/widget/Navigation/step-name` — 14px Regular — StepsRail titles, widget-subheader titles
- `desktop/widget/Navigation/step-subheadline` — 11px Light — StepsRail/left-nav subtitles
- `desktop/widget/Navigation/role` — 12px Medium — MemberTab persona labels
- `desktop/widget/header` — 18px Medium — left-nav headline (separate style from step-name — different font size, do not conflate)
- `desktop/widget/quete` — 14px Light Italic — CenterStage quote body text
- `desktop/widget/line-item` — 11px Light — Does list items
- `general/tab/selected`, `general/tab/non-selected` — 10px — toggle labels
- `general/tag` — 8.5px Medium — Tag label

Other Figma pages in the Portfolio file (case-study pages, payment-table mockups) have their own separate, unrelated typography — not this widget's concern.

---

## 5. MembersRail — Structure

- Built as **two sibling layers sharing a 5-column grid**, not nested parent/child:
  - **Track-highlight bar**: continuous background bar + selected-state overlay via percentage insets, matching the `NavRail` Figma component.
  - **`MemberTab` / `Team-member` group**: independently placed by column index, aligned to the same grid. All 5 columns are real linked `Team-member` instances.
- Column sizing uses auto-layout **"fill container"**, not fixed pixel widths.
- Selected segment = fixed 20% width (1-of-5), calculated as a proportion.
- **`MemberTab` component property:** `Mode`, values `empathy` / `journey` — matches Behavioral Spec's `mode` field exactly.
- **Label-to-track spacing:** the gap between a member's name/label and the highlight-track bar below it is `spacing/24` (`.cockpit-members-rail`'s own `gap`, between `.cockpit-member-row` and `.cockpit-highlight-track` as direct siblings — not a margin on either individually).
- Figma reference: `NavRail` component — [node 349-5296](https://www.figma.com/design/3XG9JnADI2psNR3B7TwQdx/Portfolio?node-id=349-5296)

---

## 6. Roles Table — Naming

| Rail label | Doc equivalent | Subtitle |
|---|---|---|
| Finance Director | Controller (CFO folded in) | Standardize & Control |
| AP Manager | AP Manager | Manages AP Cycle |
| AP Clerk | AP Clerk | Captures & Codes |
| Department Heads | Department-head approver | Budget Approvals |
| Procurement Manager | Procurement / buyer | Sourcing & POs |

---

## 7. Team-member Component — States

**Variant property:** `State`, 7 values, split by `Mode`:

| Mode | Values |
|---|---|
| Empathy (rail active) | `none`, `hover`, `selected`, `selected-hovering-other` |
| Journey (rail passive) | `none`, `driver`, `escalation` |

`hover` and `selected`/`selected-hovering-other` are CSS-only treatments over the `none`/`driver` art — no dedicated Empathy-only illustration files exist.

**Separate boolean property:** `strategicAlert` — independent of `State`, Empathy-mode-only.

---

## 8. Illustration Assets

- Illustration stays as SVG/vector inside Figma — do not flatten.
- **Exported as PNG @2x and committed directly to the repo.** The coding agent never fetches, exports, or otherwise interacts with Figma to obtain these — it just reads them from the repo like any other asset.
- Naming convention: `{persona-slug}-{state}`.
- **File location:** `assets/illustrations/cockpit-widget/{persona-slug}-{state}.png`. All 20 files are already in the repo at this path, named exactly per this convention — confirmed present: 5 personas (finance-director, ap-manager, ap-clerk, department-heads, procurement-manager) × 4 states (none, driver, escalation, strategic).
- Journey mode: 15 variants (5 personas × none/driver/escalation). Strategic: 5 variants. Total: 20 illustration assets. Empathy mode reuses Journey's `driver`/`none` art via CSS opacity — no separate files.
- **Design status:** Empathy mode illustrations complete, excluding the pain-point indicator asset (undesigned).

---

## 9. Reading Figma Exports

The coding agent never fetches or exports images from Figma itself. The only image files it works with are the persona illustrations from §8, already committed to the repo as PNG.

Follows the general codegen-image rule defined in CLAUDE.md. Applied to this widget: the CenterStage dividers (`quote-divider`, `section-divider`, `pain-points-divider`) and the left-nav vertical rule are confirmed genuine native `LINE` nodes bound to real color variables (`primitive/grey-medium` for the three CenterStage dividers, `primitive/black` for the left-nav rule) — build all of them as CSS, not imported images. StepsRail's dot markers are the same category, still exported per-state (see §10).

---

## 10. StepsRail — Structure & States

**Component:** `StepsRail`, node [299:4329](https://www.figma.com/design/3XG9JnADI2psNR3B7TwQdx/Portfolio?node-id=299-4329)

**Variant property:** `State`, 7 values (flat, no mode prefixes):

| Value | Context | Spec reference |
|---|---|---|
| `selected` | Journey mode, active rail | §4.1 |
| `hover` | Journey mode, active rail | §4.1 |
| `selected-hovering-other` | Journey mode, active rail | §4.1 |
| `driver` | Empathy mode, passive rail (filled) | §4.4 |
| `escalation` | Empathy mode, passive rail (hollow/ring) | §4.4 |
| `pain-point-hover` | Empathy mode, passive rail, hovering a pain-point tag | §4.4 |
| `normal` | Shared default/rest | §4.1, §4.4 |

Title bound to `desktop/widget/Navigation/step-name`; subtitle (named `subtitle`) bound to `desktop/widget/Navigation/step-subheadline`. Card corner radius bound to `spacing/12`.

**Dot size:** 7×7px (`.cockpit-step__dot`). Corrected this session — the dot was originally built at 8×8px before being checked against the confirmed Figma spec; all positioning math below (line centering, etc.) is derived from the corrected 7px value.

Dot marker colors — primitive/green is #108000, primitive/disable is #b5b5b5, primitive/orange is #ff8d28, primitive/grey-dark is #6b6c72, primitive/grey-light is #f8f9fc, primitive/black is #393a3d. The `hover` state's dot is filled `primitive/green` (#108000) — same token as `selected`/`driver` — confirmed via direct Figma vector inspection. (A `primitive/disable` claim was documented here previously; that was wrong and has been corrected.) The `escalation` dot's "hollow" look is a real fill, not transparency: `primitive/grey-light` (#f8f9fc) fill with a `primitive/green` stroke, so it renders correctly regardless of what background it's placed on.

**Card shadow vs. dot glow — two separate effects, not one:** the plain neutral `rgba(0,0,0,0.1)` shadow is a card-level effect only, applied to the elevated white-card look (`selected` / `selected-hovering-other`). The colored glow is a *separate, dot-level* effect applied directly to the dot marker itself, independent of whether that state's card has any shadow — green-tinted for `selected` and `driver` (`driver` has the dot glow with no card shadow at all, since its card isn't elevated), orange-tinted for `pain-point-hover`. Both the card shadow and the dot glow are intentionally not variables (Figma has no effect-type variables) — build via manual `--shadow-*` / `--glow-*` custom properties at build time since these don't auto-translate from a Figma pull.

**Structural architecture (added this session) — three independently stacked layers, not one fused per-state image.** `.cockpit-steps-column-wrapper` is the positioning context; inside it, three real elements are layered via `z-index`, bottom to top:

1. **Selected-row background** (`.cockpit-selected-bg`, `z-index: 1`, lowest) — a single persistent, absolutely-positioned white rounded rect + shadow. Journey-mode only; hidden entirely in Empathy mode via `.cockpit-selected-bg--hidden` (`display: none`), since the passive rail has no traveling selection. Its `top` is set per the row-position formula below and transitions via `transition: top 0.2s ease`, so it visibly travels between rows rather than jumping.
   - **Row-position formula: `top = index × 70px`.** Derived from the real layout, not an arbitrary constant: `.cockpit-steps-column` uses `justify-content: space-between` to lay out 5 fixed-height (`60px`) rows within a `340px`-tall column. 5 × 60px = 300px of row content, leaving 40px distributed evenly across the 4 gaps between rows = 10px per gap. `60px row + 10px gap = 70px` per step.
2. **Connector line** (`.cockpit-connector-line`, `z-index: 2`, middle) — one continuous dashed vertical line spanning the full `340px` column height, built via `repeating-linear-gradient` (not `border-style: dashed`, which can't hit an exact 2px-dash/2px-gap pattern), `primitive/black` at 35% opacity.
   - **Horizontal centering math: `left: calc(var(--spacing-16) + 3px)`.** This is deliberately *not* the dot's center value directly — it accounts for the line's own `1px` width. The dot's true center is `padding (16px) + half the dot's width (3.5px) = 19.5px`. Since CSS `left` places an element's *left edge*, and the line is `1px` wide, its edge must sit half the line's own width short of that center — `19.5px − 0.5px = 19px` — for the line's rendered center to land exactly on the dot's. Setting `left` directly to the dot's center value (`19.5px`) instead produces a consistent, deterministic 0.5px rightward offset (confirmed via `getBoundingClientRect` measurement, not a rounding artifact) — found and fixed this session.
3. **Dots + text** (`.cockpit-step__dot`, `.cockpit-step__body`, `z-index: 3`, highest) — both given `position: relative` with no offset, purely so they enter the stacking order above the two absolutely-positioned layers below. The parent `.cockpit-step` (`<li>`) itself stays `position: static`, so its own card background paints beneath both layers — letting the dashed line and the traveling selected-background show through/behind each card correctly, while the dot and title/subtitle always render on top.

---

## 11. Dimming Mechanism & Rail Interaction Logic

Full mechanism lives in Notion Behavioral Spec §4.1/§6. Structural note: dimming never swaps which illustration is showing — `driver` stays `driver`, `none` stays `none`, only opacity changes, via `primitive/opacity-inactive`.

---

## 12. References — Notion (Behavior & Content Data)

This doc covers Figma structure only. Two other sources are required to build the widget completely — they answer different questions, do not conflate them:

- **Behavioral Spec** — HOW the widget behaves: triggers, effects, interaction rules (hover, click, dimming, mode toggle, overflow/scroll behavior). https://app.notion.com/p/3a22f788b400812f8530f6e302ef9db4
- **Content Tables** — WHAT the widget displays: the actual text/data shown per persona, per step, per pain point. (Notion's own page title for this is "Logic & Content Tables" — despite the name, treat it as the content/data source, not a second behavioral spec.) Parent page linking to all 3 tables: https://app.notion.com/p/3a22f788b400815abd8fd1fb090ed4cd

**Mapping — which component pulls from which source:**

| Component / section (this doc) | Pulls from |
|---|---|
| StepsRail states, Roles Table (§6) | Content Tables → "Journey — Step Content & Highlight Mapping" |
| MemberTab persona labels (§5) | Content Tables → "Empathy — Persona Content" |
| StepsRail `pain-point-hover` state, CenterStage pain-point tags | Content Tables → "Pain Point → Step Highlight Mapping" (strategic rows also carry a gated `Strategic Persona(s)` formula field — see that table's schema) |
| All interaction/trigger logic (dimming, hover, mode toggle, scroll/overflow — not covered by this Figma-structure doc) | Behavioral Spec |

**Before building any section of this widget:** read this doc, the Behavioral Spec, and the relevant Content Table(s) per the mapping above — same as CLAUDE.md's rule to read tokens.css and COMPONENT-MAP.md before touching any component. Do not start building from this Figma-structure doc alone.

Do not invent placeholder content or logic not present in these two sources — if something needed isn't covered by either, stop and ask.

---

## 13. Tag Component — States & Pain-Point Overflow/Reveal Mechanism

**Component:** `Tag`, node [435:7598](https://www.figma.com/design/3XG9JnADI2psNR3B7TwQdx/Portfolio?node-id=435-7598)

**Variant property:** `State`, 4 values (flat, no mode prefixes):

| Value | Fill | Border | Text color | Used for |
|---|---|---|---|---|
| `normal` | `primitive/black` | none | `primitive/white` | Regular pain-point tag, rest state |
| `hover` | `primitive/orange` | none | `primitive/white` | Regular pain-point tag, hover state — not wired up in the current build; pain-point tag hover-highlighting is deferred (see Behavioral Spec §4.4) |
| `number-normal` | transparent | 1px solid `primitive/black` | `primitive/black` | "+N" overflow chip, rest state |
| `number-hover` | `primitive/black` | none | `primitive/white` | "+N" overflow chip, hover state |

All four states share the same shape/padding/corner-radius (`spacing/32` radius) and text style (`general/tag` — Literata Medium 8.5px). `number-normal`/`number-hover` are driven by plain CSS `:hover` on the chip element — no JS state needed for that color swap, since the chip only ever exists in the DOM while the drawer is collapsed (see below), so there's no ambiguity about when its hover applies.

**Overflow/reveal mechanism (CenterStage pain-point tags — not part of the Notion Behavioral Spec; defined here since it doesn't exist anywhere else):**

- The tags row is a **drawer**: collapsed, it's exactly one tag-row tall and shows as many tags as fit plus a `number-normal`/`number-hover` "+N" chip for the rest. Expanded, it grows to show every tag wrapped across multiple rows, and the chip is not rendered at all while expanded.
- Which tags fit is measured at render time (not hardcoded) — tags are appended one at a time and the first one that wraps to a second row is where the cut is made; the "+N" chip is then appended and, if the chip itself doesn't fit, one more tag is dropped and the count incremented, repeating until the chip fits.
- The drawer's two inner views (collapsed: first-row tags + chip; expanded: all tags wrapped) are cross-faded via `opacity`, stacked on top of each other (`top: 0` within the drawer) — not anchored differently from one another. What actually moves is the *drawer's own box* (see below), not the views inside it.
- **The widget's total height never changes, in any state — confirmed by direct measurement across 1/2/3-row cases, byte-identical.** `.cockpit-pain-points` has a *permanently fixed* `height: 73px` (`overflow: hidden`) — this is `header (31px) + its gap (24px) + one collapsed tag row (18px)`, and it does not vary with the drawer's state. Nothing outside this fixed box — not the rest of the widget, not the left nav, not anything on the page below it — ever moves or resizes.
- **The header's retraction is what frees the room the drawer grows into — not any change to the section's own size.** The "Pain points" header (`.cockpit-pain-points__header`) is `position: absolute`; on expand it slides up `translateY(-40px)` and fades to `opacity: 0`, clipped by the section's own `overflow: hidden`. That retraction frees exactly `55px` (header `31px` + its gap `24px`) on top of the drawer's own `18px` collapsed band — `55 + 18 = 73px`, the section's full fixed budget.
- **The drawer itself is also `position: absolute`, and both its `top` and `height` animate together** (not height alone) — collapsed: `top: 55px` (directly below the header), `height: 18px`. Expanded: both are computed per-persona from the real measured content (`expandedView.scrollHeight`), with `top = (73 − expandedHeight) / 2` — this **vertically centers** the tag content within the full freed 73px band (never top- or bottom-anchored), so a 2-row block and a 3-row block both center within the same space, just with different margins above/below. Confirmed real numbers: 2 rows = 44px content, ~14.5px margin above/below; 3 rows = 70px content, ~1.5px margin above/below (tight — 73px is close to the practical ceiling for 3 rows at this Tag size).
- **Trigger:** `mouseenter` on the whole pain-points section (not just the chip) expands it; `mouseleave` collapses it after a 120ms debounce, so briefly crossing a gap between tags doesn't flicker. The drawer is a descendant of the same section element, so moving into it never counts as leaving. If a persona's tags all fit in one row (`hiddenCount === 0`), the `mouseenter`/`mouseleave` listeners aren't attached at all — hovering does nothing for that persona, by design.
- **Motion:** expand = drawer `top`/`height` transition 420ms `cubic-bezier(0.34, 1.45, 0.64, 1)` (overshoot/spring); collapse = 300ms `cubic-bezier(0.4, 0, 0.2, 1)` (decelerate, no bounce). The header's slide (`transform`) uses the same two curves/durations as the drawer, paired with a simpler `ease-out` on its own `opacity`. The collapsed view fades out quickly on expand and fades back in with a delay on collapse (landing as the drawer settles); the expanded view fades in with a short delay after expand starts and fades out promptly on collapse.
- Pain-point tag **text** stays placeholder content per CLAUDE.md's Content Tables rule for CenterStage, *except* Finance Director and AP Manager, which now use real content pulled directly from Content Tables → "Pain Point → Step Highlight Mapping" (all other personas remain placeholder). The tag **count** for every persona comes from that same table — never a hardcoded snapshot (see `PERSONAS` in `cockpit-widget.js`, where each persona owns its own `painPoints` array; there is no separate lookup table to keep in sync).

**Gotcha — nested `overflow: hidden` staleness (found this session, flagging so it isn't rediscovered from scratch):** when the drawer's `top`/`height` are set via inline JS style, the browser can silently stop applying the update — `getComputedStyle` and `getBoundingClientRect` keep reporting the *old* values even though the inline `style` attribute is correctly set, reproducible on a fully fresh page load (not a caching artifact). Isolated to having **two nested `overflow: hidden` boxes** — the fixed-size `.cockpit-pain-points` parent and the absolutely-positioned `.cockpit-pain-points__drawer` child — where the child's box stops receiving layout updates. Temporarily forcing the child's `overflow` to `visible` fixes it instantly, which is how this was diagnosed; but removing that `overflow: hidden` permanently isn't an option, since it's what clips the two cross-fading views to the drawer's current size. The actual fix: redundantly re-assert `drawer.style.overflow = "hidden"` inline every time `top`/`height` change (see `expandPainPoints()`/`collapsePainPoints()` in `cockpit-widget.js`) — this forces the browser to re-validate layout for that element. If this same shape (nested `overflow: hidden` + JS-animated inline position/size on the inner one) comes up building anything else in this widget, apply the same workaround rather than re-diagnosing it.

---

## 14. Toggle Component — Motion

**Structure:** a sliding pill (`.cockpit-toggle__pill`, `position: absolute`) sits over two persistent, non-swapping text labels (`Journey` / `Empathy`, `.cockpit-toggle__labels`) — it's the pill's position and each label's color that change on toggle, never the DOM structure or text content. JS only ever toggles a `.journey`/`.empathy` class on `.cockpit-toggle__track`.

**Confirmed motion — pure CSS throughout, no `@keyframes`, no JS frame-driven animation:**
- **Pill position:** `transition: left 0.3s cubic-bezier(0.65, 0, 0.35, 1);` — `left: 0` (Journey) / `left: 69.333px` (Empathy). `69.333px = track width (160px) − pill width (90.667px)`.
- **Label color:** `transition: color 0.3s ease;` — each label independently switches between `primitive/grey-dark` (inactive) and `primitive/white` (active, sitting on the pill), driven purely by the `.journey`/`.empathy` class on the track, not by any per-label class of its own.
