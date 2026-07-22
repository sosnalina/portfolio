New pages reuse existing component CSS files wherever possible. Only add a new component file when COMPONENT-MAP.md defines a genuinely new component.

## Source of truth

All values (colors, spacing, typography, sizing) live in css/tokens.css.
Read tokens.css before touching any file.
All visual decisions must trace back only to the specified Figma frame or css/tokens.css. Nothing else.

Figma → CSS component mapping lives in COMPONENT-MAP.md, not here. Read it before touching any component.

## Naming convention

All structural frames and layers use kebab-case names describing structural role — never Figma's auto-generated defaults (`Frame 1197135573`, `Group 1197132897`, etc.) and never placeholder content.

- `-row` — a horizontal grouping
- `-column` / `-block` — a vertical grouping
- `-wrapper` — a container that exists only to hold/position one thing
- `-divider` — a line/rule
- `title` / `subtitle` — a repeated text role inside a component, not the specific words in it

Exception: decorative vector/illustration internals that are exported as a single flattened image asset do not need renaming — the coding agent never reads their Figma layer names.

## How to receive a task

Each task must specify:

- The exact Figma frame name
- The Figma link — and whether it is a frame link or a selection link
- The section's mapped CSS file (per COMPONENT-MAP.md)

If any of these are missing, stop and ask before doing anything.

## Execution rules

- Build one section at a time. Do not proceed until the current section passes the verification checklist.
- Before editing: read tokens.css, COMPONENT-MAP.md, and the existing CSS file for the current component.
- Edit only the CSS file and HTML markup required for the current section. No formatting-only edits to unrelated files. Do not touch unrelated files even if you notice issues outside current scope.
- Do not add wrapper elements in HTML unless they are explicitly present in the Figma frame.
- After each section, capture a browser screenshot at the exact viewport width (desktop, then 600px mobile if applicable — see Mobile scope) and compare it pixel-by-pixel against the matching Figma frame at that breakpoint. Fix all mismatches before proceeding.
- List every file changed before marking the task complete.
- List every unresolved spec issue before ending the task. No unresolved spec issues may remain when marking a section complete.
- If the Figma spec is unclear or a mapping is missing, stop and ask. Do not guess.

## Forbidden behaviors — these are absolute

- Never hardcode a color, spacing value, or font size. Use CSS custom properties only.
- Never create a new CSS file if one already exists for that component.
- Never create duplicate files or parallel implementations.
- Never modify files outside the scope of the current task.
- Never add features, patterns, or styles not present in the specified Figma frame.
- Never use a hex value, pixel value, or font name directly in any CSS rule.
- Never approximate a missing token. If a Figma value has no token mapping, stop immediately, list it as a blocking issue, and ask.
- Never modify unrelated files or sections, even if you notice issues outside current scope.
- Never introduce JavaScript unless the task explicitly requests it.
- Never rename existing CSS files or token names.
- Never map a component to a CSS file without first checking COMPONENT-MAP.md.
- Never leave a text layer unbound to a named text style. A text layer that merely matches a token's color or value locally does not satisfy this — it must be genuinely bound to a named style in Figma.
- Never assume a divider, dot marker, or simple shape that appears as an `<img>` reference in Figma's Dev Mode code export is actually an image asset. Figma's codegen packages simple native shapes (lines, basic vectors) as SVG exports by default, even when the underlying node has a real, tokenized stroke/fill. Check the actual node type and variable bindings before treating it as a pre-made asset — build it as CSS/inline SVG using the real token instead of importing the codegen's image.

## Mobile scope

Site-wrapper pages (landing, navigation, about, resume, project gallery) support both desktop and mobile per the verification checklist below. Case study article pages are desktop-only by design decision — do not build or verify mobile layouts for them. The checklist's mobile-match requirement and the Responsive section's mobile breakpoint rule below apply only to wrapper pages, not case studies.

## Responsive — hard switch at 600px (wrapper pages only)

"Slot gap" is a deliberate project term: it refers to the flex gap between child components inside a section's content slot.
One @media (max-width: 600px) block per CSS file for wrapper pages. Case study article pages are exempt — desktop-only by design (see Mobile scope).
Desktop: section padding --spacing-128 all sides, hero height 1000px, slot gap --spacing-64, max-width --sizing-content-max.
Mobile: section padding --spacing-32 horizontal + --spacing-64 vertical, hero height 600px, slot gap --spacing-32, max-width removed.
Background colors do not change across breakpoints.

## Verification checklist — all items must be true before marking any section complete

- [ ] Exact Figma frame matched visually at desktop width
- [ ] Exact Figma frame matched visually at 600px mobile (wrapper pages only — case study pages are exempt, see Mobile scope)
- [ ] No hardcoded values in any file touched
- [ ] All text layers bound to named text styles (not just matching values locally)
- [ ] Only the files required for this section were modified
- [ ] Component mapping confirmed against COMPONENT-MAP.md
- [ ] All changed files listed
- [ ] No unresolved spec issues remain