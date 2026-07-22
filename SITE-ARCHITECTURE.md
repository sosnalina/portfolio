# SITE-ARCHITECTURE.md

Defines site-wide structure: page types, navigation, and shared cross-page behaviors. Component-level Figma→CSS mapping lives in COMPONENT-MAP.md, not here — this doc is about how pages relate to each other, not how individual components are built.

---

## Site hierarchy

```
Landing (password gate)
    │
    ▼
  Home
    │
    ▼
Case studies
    │
    ├── Bill Pay (in progress)
    ├── CP (not started — Figma frame not yet linked)
    └── Personetics (not started — Figma frame not yet linked)
```

Entering the correct password on the landing page is what grants access to Home. From Home, navigation goes to individual case study pages. Case study count and identity beyond Bill Pay are not final.

---

## Page types

Two categories, with different rules (see Mobile behavior below):

- **Wrapper pages** — landing (password-gated) and home. Support both desktop and mobile.
- **Case study pages** — Bill Pay, CP, Personetics. Desktop-only by design decision (see CLAUDE.md's Mobile scope section for the build rule).

---

## Mobile behavior — case study pages

When a case study page is viewed on a mobile viewport, it does not attempt to render the desktop layout responsively. Instead, it shows a single shared message: "Please view on desktop" (or similar — final copy still needs deciding).

This is a **shared, site-wide behavior** — one component/pattern reused across all case study pages, not rebuilt per case study. Implementation detail (JS viewport check, CSS-only breakpoint swap, etc.) still needs deciding.
