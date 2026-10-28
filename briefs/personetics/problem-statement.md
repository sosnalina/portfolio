# Personetics — Problem statement (visual spec)

Section 04 (Mind the gap / Discovery & Problem Definition), last element.
Scope doc: `briefs/personetics/personetics-build-scope.md`. This file holds every value for this visual: static and motion. The scope doc only links here.

Status (28 Oct 2026): static spec complete, ships with the foundation build. Motion not specced yet.

---

## 1. Static — ready to build

Build type: **new structure, build new.** No existing component is duplicated. Pattern: a macro, `problemStatement(lines)` in `_includes/personetics/problem-statement.njk`, plus its own CSS file. The page renders its sections in a loop from the synced text, so the block takes the persona lines as an argument (28 Oct; replaces a `{% set %}` block in `index.njk`). Unlike `principles.css` (shared, in `css/components/`), the problem statement is Personetics-only, so its files go case-study-first: `_includes/personetics/` and `css/widgets/personetics/problem-statement/` (one subfolder per widget, CLAUDE.md).

### Sources
| Element | Source |
|---|---|
| Frame | Figma file `3XG9JnADI2psNR3B7TwQdx`, node `I1979:49296;39:123;2004:52157`. Horizontal row, items centred, gap `spacing/64`, 800 × 302. |
| Right brace | Vector node `I1979:49296;39:123;2009:52766`, 50.4 × 164.96. The only SVG source. |
| Left brace | Vector node `I1979:49296;39:123;2009:52764`: the same shape rotated 180°. Not used as a file; built by rotating the right brace. |
| Statement text | Text node `I1979:49296;39:123;2004:52159`, fills the remaining width (800 − 2 × 50.4 − 2 × 64 = 571.2). Colour bound to `primitive/black`. |
| Text styles | Figma styles created 28 Oct: `desktop/articles/problem-statement` (Literata Light Italic 16 / 37.66px) and `desktop/articles/problem-statement-lead` (Literata Bold Italic 16 / 37.66px). |
| Brace colour | `--primitive-red` (Hadar, 28 Oct). Set in CSS; whatever fill is inside the SVG file is ignored. |
| Copy | Text sync (scope doc §1): the LOCKED `[[VISUAL:persona]]` lines in workbench section s5. Never typed into this spec or the page by hand. Typographic apostrophes (’) kept. |
| Placement | Last element of section 04, at the `[[VISUAL:persona]]` marker (today: after body paragraph 3). Gap above = the content column's existing `gap: var(--spacing-64)` (`section.css`), which matches Figma. No extra margin. |
| Viewport | Case study pages are desktop-only (`CLAUDE.md`). No mobile layout. |

### Unresolved — do not build
- (none)

### Dependencies
- `--primitive-red` is added by the same foundation build (scope doc §2). Tokens are written before this component.
- Literata **Bold Italic (700)** is not loaded today. `tokens.css` loads italic 300 and 400 only, so without it the browser fakes bold by thickening the light italic. Add one `@import` for `Literata:ital,wght@1,700`, as its own line after the existing italic imports. Follow the file's one-weight-per-import rule (see the comment at the top of `tokens.css`).

### Tokens (add to `tokens.css`, with the other `--text-*` tokens)
```css
--text-problem-statement: italic 300 16px/37.66px "Literata", Georgia, serif;
--text-problem-statement-lead: italic 700 16px/37.66px "Literata", Georgia, serif;
```

### Brace asset
- Claude Code downloads the SVG of node `I1979:49296;39:123;2009:52766` through its Figma MCP.
- Save it as `_includes/personetics/problem-statement-brace.svg`, so a single file is included twice.
- Edit the file in two ways only: set every `fill` to `currentColor`, and add `aria-hidden="true" focusable="false"` to the root. Keep the root `width`, `height` and `viewBox` exactly as exported (50.4 × 164.96).

### Markup (rendered by `problemStatement(lines)`, `_includes/personetics/problem-statement.njk`)
`lines` = the `## visual: persona` lines of `briefs/personetics/article-text.md`. One `<p>` per line, with each line's lead-in (`I am a`, `I’m trying to`, `But`, `Because`, `Which makes me feel`, `In an ideal world`) in `<strong>`. A lead-in matches only at the start of a line, as whole words. The six lines below are the 28 Oct synced text, shown only to fix the output structure.
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

### CSS — new file `css/widgets/personetics/problem-statement/problem-statement.css`, linked from the Personetics page the same way `principles.css` is linked from Bill Pay
```css
.problem-statement {
  display: flex;
  align-items: center;
  gap: var(--spacing-64);
}

.problem-statement__brace {
  display: flex;
  flex: none;
  color: var(--primitive-red);
}

/* Opening brace = the closing brace rotated 180°, matching the Figma node.
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
- Measured inside the page (not across a screenshot): block 800 × 302, braces 50.4 × 164.96 and vertically centred, text column 571.2 wide, 64px gaps.
- Braces render `#E5071A`. The lead-ins render as real Bold Italic: the network tab shows the 700 italic file loading.

---

## 2. Motion — not specced yet (phase 2, own chat)

- **Entrance on viewport entry.** Direction = braces-open family. The starting keyframe should be more creative than "braces centred, then open" (Hadar's example: starts as a circle). Claude to offer several starting-keyframe options as a playable comparison.
- When motion is specced, it is written into this file, and any static value it changes is changed in §1 above — never in a second place.
