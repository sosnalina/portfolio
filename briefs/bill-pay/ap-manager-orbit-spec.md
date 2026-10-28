# AP Manager Orbit — Motion Spec v2 (replaces v1's orbit section entirely)

Acceptance criteria: the built result must behave identically to the approved reference (a ring-locked orbit demo Hadar reviewed and approved), not just "close." Quote entrance and blob sway are unaffected — leave those exactly as currently built.

## Core principle

Every orbiting item is locked to one of exactly 3 fixed radii from the ring center, full stop. No free 2D drift, no radius wobble, no settle-to-center mechanic, no dynamic z-index, no lean. An item's distance from center is always exactly one of: 150px, 125px, or 100px — angle is the only thing that ever changes.

RING_CENTER = (190, 212.23). RING_OUTER = 150px, RING_MIDDLE = 125px, RING_INNER = 100px.

## Remove entirely from the current implementation

- WOBBLE_AMPLITUDE_PX / wobble period logic (the ±9px radius "breathing")
- The settle round-robin: cycleIndex, CLOSE_PASS_RADIUS_PX, settleProgress, the bezier pull-toward-center
- The dynamic z-index / .ap-manager-orbit__orbit-item--settling class and its CSS
- The 100px minimum-radius clamp (superseded, no longer applies)

## Guide ring rotation — unchanged, keep exactly as currently implemented

The two outer/inner guide rings keep their existing slow counter-rotation. Purely cosmetic (shifts the dashes along the ring; the circle's shape/radius never change) and fully independent of the per-item orbit math — do not touch the ring rotation CSS/animation at all.

## Keep unchanged

- The IntersectionObserver play/pause for orbit items, guide rings, and manager idle wobble — all three continue to pause/resume together exactly as currently implemented: t only advances while the section is in viewport; pausing stops the rAF/animation outright; resuming continues from the last state (not a restart).
- The manager's own independent idle wobble (2-3px sinusoidal, no radius/angle math) — untouched.
- Each item's existing anchor-position extraction (anchorX/anchorY, computed once from static DOM position via offsetLeft/offsetTop/offsetWidth/offsetHeight) — keep exactly as currently implemented. Only what happens after that changes.

## Stacking order is now a non-issue — do not "also fix" it

An earlier investigation found a DOM-order stacking bug. That's moot now: no item's radius ever goes below 100px (the inner ring, exact — no lean dips below it), which stays outside the manager's ~74px widest silhouette edge — no visual overlap, so stacking no longer matters. Do not add, restore, or "fix" any z-index or DOM-reorder logic for this.

## Per-item motion formula

For each item, every frame:

speedWobble = 1 + 0.08 * sin(t * 0.3 + itemIndex * 1.7)
angle_deg = angle0 + speed * speedWobble * t
angle_rad = angle_deg * PI / 180

radius = ringRadius, full stop — always exactly the assigned ring radius, no deviation.

x = 190 + radius * cos(angle_rad)
y = 212.23 + radius * sin(angle_rad)
transform: translate(x - anchorX, y - anchorY)

itemIndex = the item's fixed position in the table below (0–13), used only for the speed-wobble phase offset.
t = the same accumulated-while-visible time value already driving the manager's idle wobble.

## Per-item table — exact values, use as given

| # | item | ring radius (px) | angle0 (deg) | speed (deg/s) |
|---|------|---|---|---|
| 0 | finance-director | 150 | 228.8 | 9.5 |
| 1 | ap-clerk | 125 | 321.5 | -10.6 |
| 2 | procurement-manager | 150 | 151.1 | -10.4 |
| 3 | coin-1 | 125 | 13.3 | 11.4 |
| 4 | coin-2 | 100 | 159.7 | -11.5 |
| 5 | coin-3 | 150 | 59.7 | 11.3 |
| 6 | hashtag | 100 | 294.1 | 10.2 |
| 7 | trend-arrow | 150 | 179.5 | -9.1 |
| 8 | banknote-small | 125 | 110.7 | -9.3 |
| 9 | banknote-big-wrap | 150 | 279.1 | -10.2 |
| 10 | star-1 | 125 | 251.4 | 10.7 |
| 11 | star-2 | 150 | 343.7 | -11.2 |
| 12 | star-3 | 150 | 199.7 | 8.7 |
| 13 | star-4 | 100 | 58.3 | -9.6 |

## Notes on where these numbers came from (do not re-derive, use as given)

- angle0 was computed from each item's actual Phase 1 static position relative to RING_CENTER — not arbitrary.
- Ring assignment was determined by nearest of the 3 radii to each item's actual static distance from center. Two close calls: procurement-manager (~147, assigned outer) and trend-arrow (~138, assigned outer). Flag both if either looks wrong once built.
- Speed magnitudes are all within a narrow band (~8.7–11.5 deg/s) — deliberately narrow, per direct feedback that a wider spread looked jarring. Do not widen this range.

## Acceptance check before reporting back

1. Every item's radius, at every sampled frame, is exactly one of {150, 125, 100} — no deviation beyond floating-point noise.
2. No item ever gets closer to the manager's silhouette than 100px (still well outside his ~74px widest edge).
3. Speed differences between items feel subtle, not dramatic, when watched.
