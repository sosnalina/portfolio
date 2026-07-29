# Bill Pay — Content Brief

Structural brief for the Bill Pay case study page. Maps the section order, content boxes, and what's real vs. placeholder right now.

**Note on structure source:** section order below comes from a rough hand-built draft Hadar walked through verbally — not a finalized Figma file. No Figma node IDs are referenced here; a real Figma build for this case study hasn't been decided yet.

**Text status:** All copy below is lorem ipsum. Hadar is working from a draft that's still changing — real copy comes later.

**Text styles:** Header, Subheader, and Body are confirmed. There may also be a fourth: a headline that sits above an infographic/image as its own text element (separate from the image graphic) — not confirmed as a distinct style yet, could turn out to reuse Subheader. Don't assume only 3 styles exist when building typography classes — leave room for this one.

**Section vs. visual break:** A section can span more than one visual block (e.g. a white block followed by a green block) without starting a new section — this is used to break up long sections visually. The subheader belongs to the section, not to each visual block within it. Confirm per-section before assuming a color/visual change means a new section.

**Box status legend:**
- `READY` — real component, can be plugged in now
- `PLACEHOLDER` — box reserved, format not decided yet (could end up as an image export, a widget, or an inline interaction)

---

## 1. Hero

- Header: lorem ipsum
- Visual: `PLACEHOLDER` — floating screen mockup. Intended to have some kind of parallax/movement on scroll — motion treatment not designed yet.

## 2. Section header (plain)

- Header: lorem ipsum
- Body: lorem ipsum
- No visual box in this section.

## 3. Gallery section

- Header: lorem ipsum
- Body: lorem ipsum
- Visual: `READY` — Walkthrough Gallery widget. Built and pushed to production (separate session/VS Code instance). See `walkthrough-gallery-spec.md` for the as-built structure.
- Known issue (not content — flagged separately for implementation): the screen's drop shadow is currently clipped by the containing frame. Frame needs to allow the shadow to extend beyond its bounds. Confirm this is still open now that the widget is finished — may already be resolved.

## 4. Tipping Point (one section, two visual blocks)

- Subheader: "Tipping Point" (lorem ipsum stand-in for now)
- Body block 1 (white): lorem ipsum
  - Visual: `PLACEHOLDER` — image box. Format not decided. Whether this has its own headline separate from the image, or is image-only, is unconfirmed.
- Body block 2 (green — continuation of the same section, visual break only): lorem ipsum
  - Visual: `PLACEHOLDER` — a more complex illustrated diagram in the draft. Hadar hasn't decided whether this ships as a static image export or becomes an interactive widget. Headline-above-image status unconfirmed.

## 5. Cockpit Widget section

- Header: lorem ipsum
- Body: lorem ipsum
- Visual: `READY` — Cockpit Widget, pluggable now (see `BP-COCKPIT.md` for the component itself).
- Body (below widget): lorem ipsum

## 6. Section header + visual

- Header: lorem ipsum
- Visual: `PLACEHOLDER` — box reserved. Format (image vs. video) not confirmed. Also unconfirmed: whether this is its own section or a continuation of section 5 (Hadar isn't sure yet — this is as far as the content is solid).
- Body: lorem ipsum

## 7. Section header + visual

- Header: lorem ipsum
- Body: lorem ipsum
- Visual: `PLACEHOLDER` — same caveats as section 6 (format + whether it's a standalone section unconfirmed).

## 8. (End of current build)

- Empty section, no content assigned yet.

---

## Open questions
- Sections 6, 7: could turn out to be continuations of an earlier section rather than standalone ones — content isn't solid past section 5 yet.
- Headline-above-image vs. image-only: unconfirmed for sections 4, 6, 7.
- Final format for placeholder boxes (image export vs. widget vs. inline interaction) — undecided, revisit later.
- Gallery frame shadow-clipping — implementation fix, not a content change.
- Whether a real Figma file will be built for this case study at all — not decided.
- Where article content will live long-term (Notion vs. a structured content sheet vs. something else) — open, separate decision from this brief; affects SITE-ARCHITECTURE.md.
