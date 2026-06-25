# CLAUDE.md — Portfolio Website

## Identity
You are a code generator, not a designer.
Implement only what is visible in the specified Figma frame.
No creativity. No interpretation. No assumptions. If the spec is incomplete, stop.
Figma file: https://www.figma.com/design/3XG9JnADI2psNR3B7TwQdx/Untitled

## Stack
HTML + CSS only. No frameworks, no npm, no build tools.
Vanilla JS only if explicitly requested.
Deployed via Vercel from GitHub.

## Folder structure — never change
portfolio/
├── index.html
├── css/
│   ├── tokens.css
│   ├── reset.css
│   └── components/
│       ├── section.css
│       ├── hero.css
│       ├── header.css
│       ├── subheader.css
│       ├── body.css
│       └── video.css

## Source of truth
All values (colors, spacing, typography, sizing) live in css/tokens.css.
Read tokens.css before touching any file.
All visual decisions must trace back only to the specified Figma frame or css/tokens.css. Nothing else.

## How to receive a task
Each task must specify:
- The exact Figma frame name
- The Figma link — and whether it is a frame link or a selection link
- The section's mapped CSS file

If any of these are missing, stop and ask before doing anything.

## Component mapping — Figma → CSS file
section/header → header.css
section/sub-header → subheader.css
text/body → body.css
Visual/video → video.css
section (platfrom=desktop/mobile, placement=Hero) → hero.css
section (platfrom=desktop/mobile, placement=*) → section.css
Note: "platfrom" is a typo in Figma — preserve it in code comments exactly as it appears. Do not correct it.

## Execution rules
- Build one section at a time. Do not proceed until the current section passes the verification checklist.
- Before editing: read tokens.css and the existing CSS file for the current component.
- Edit only the CSS file and HTML markup required for the current section. No formatting-only edits to unrelated files. Do not touch unrelated files even if you notice issues outside current scope.
- Do not add wrapper elements in HTML unless they are explicitly present in the Figma frame.
- After each section, capture a browser screenshot at the exact viewport width (desktop, then 600px mobile) and compare it pixel-by-pixel against the matching Figma frame at that breakpoint. Fix all mismatches before proceeding.
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

## Responsive — hard switch at 600px
"Slot gap" is a deliberate project term: it refers to the flex gap between child components inside a section's content slot.
One @media (max-width: 600px) block per CSS file. No exceptions.
Desktop: section padding --spacing-128 all sides, hero height 1000px, slot gap --spacing-64, max-width --sizing-content-max.
Mobile: section padding --spacing-32 horizontal + --spacing-64 vertical, hero height 600px, slot gap --spacing-32, max-width removed.
Background colors do not change across breakpoints.

## Verification checklist — all items must be true before marking any section complete
- [ ] Exact Figma frame matched visually at desktop width
- [ ] Exact Figma frame matched visually at 600px mobile
- [ ] No hardcoded values in any file touched
- [ ] Only the files required for this section were modified
- [ ] All changed files listed
- [ ] No unresolved spec issues remain
