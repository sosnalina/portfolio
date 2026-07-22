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

Dot marker colors — primitive/green is #108000, primitive/disable is #b5b5b5, primitive/orange is #ff8d28, primitive/grey-dark is #6b6c72, primitive/grey-light is #f8f9fc, primitive/black is #393a3d. The `hover` state's dot is filled `primitive/disable` (#b5b5b5) — confirmed directly in Figma, a real distinct asset, not a placeholder.

**Card shadow:** plain neutral `rgba(0,0,0,0.1)`, intentionally not a variable (Figma has no effect-type variables) — applied via local Effect Styles `effect/shadow-green` (selected) and `effect/shadow-orange` (pain-point-hover), requiring manual `--shadow-*` custom properties at build time since these don't auto-translate from a Figma pull.

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
