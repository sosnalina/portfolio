# scroll-cue — spec

## Sources
| Element | Source |
|---|---|
| Pill: fill, radius, text style, gap, height | Figma 3XG9JnADI2psNR3B7TwQdx, node 1401:45235 |
| Fill | primitive/grey-medium (#E4E5E7) |
| Radius | spacing/24 |
| Text | "Watch them come into play". Literata Medium Italic, 16px, primitive/black (#393A3D) |
| Gap icon→text | 10px (Figma auto-layout) |
| Height | 35px (Figma frame height) |
| Side padding | 12px (Hadar, 23 Sep; overrides Figma's 16px). Must be a spacing token. |
| Vertical text alignment | Cap-centred via `text-box: trim-both cap alphabetic; line-height: 1` on the text (Hadar, 23 Sep, picked visually) |
| Circle | 18×18, fill #FFFFFF, 1px stroke primitive/black, r = 8.5 (Figma node I1401:45238;784:37314) |
| Arrow | The EXISTING arrow SVG already in the repo. Copy its paths; do not redraw. Points down. Stroke 1.2px, round caps and joins, primitive/black. |
| Position | Last child of the "Designing a Cockpit" section on the Bill Pay case study page, in normal flow, the last child of `.section__slot`. 64px above (the slot's own row-gap) and 64px below (the section's `.section__content` bottom padding, overridden for this instance) — equal spacing above and below the pill (Hadar, 23 Sep, post-QA; replaces "30px above the section's bottom edge"). |
| Interactivity | None. Not a link, not a button. Plain text. |

Build new: no existing component to duplicate.

## Structure
- A clipping wrapper, absolutely positioned at the section's bottom and full width, with `overflow: hidden` and `pointer-events: none`. It hides the pill while it is below the section edge, so the pill never paints over the next (green) section.
- The pill is `inline-flex`, `align-items: center`, and hugs its content horizontally (no fixed width).
- The icon is ONE inline SVG (18×18): the circle, plus a `<clipPath>` equal to the circle, plus the arrow `<g>` inside that clip. The clip is needed so the arrow can drop in from above the circle.

## Motion (Phase 2 — do not build in Phase 1)
Purpose: spatial consistency. It rises from the section edge and points at what's next.

Trigger: an IntersectionObserver on the NEXT section (the green one), with `rootMargin: '0px 0px 1px 0px'`. It fires just before that section's top edge enters the viewport. It plays ONCE, then the observer disconnects. Scrolling back up does not hide it or replay it.

Already past it on page load: show the final state, with no animation.

Sequence:
1. Rise: a damped spring, duration 0.5s, bounce 0.25, run for 1000ms and sampled into linear WAAPI keyframes. translateY goes 99px → 0 (64px gap + 35px pill; derived from the position change, 23 Sep — was 65px/30px gap), and scale goes 0.95 → 1.
2. Pill opacity 0 → 1: 200ms, `cubic-bezier(0.23,1,0.32,1)`.
3. Arrow drop-in: translateY −14px → 0, 350ms, delay 300ms, `cubic-bezier(.175,.885,.32,1.275)`.
4. Hold for 4000ms after the rise ends.
5. Arrow double dip: 0 → 3px → 0 → 3px → 0, 900ms, `cubic-bezier(0.77,0,0.175,1)`, starting at 1000ms + 4000ms. Plays once.

Properties: transform and opacity only.

Reduced motion (`prefers-reduced-motion: reduce`): opacity 0 → 1 only, 200ms, with the same trigger. No rise, no scale, no arrow drop, no dip.

Total duration: fixed at 5.9s from trigger to end of dip.

### Approved reference: port this, do not re-derive
Approved by Hadar in the browser, 23 Sep. Where the prose and this code disagree, the code wins.
Change ONLY: the selectors, tokenised colours, and the integration into the project's JS file structure.

    const IO='cubic-bezier(0.77,0,0.175,1)',OV='cubic-bezier(.175,.885,.32,1.275)',OUT='cubic-bezier(0.23,1,0.32,1)';
    const DUR=0.5,B=0.25;
    const spring=t=>{const z=1-B,w0=2*Math.PI/DUR,wd=w0*Math.sqrt(1-z*z);return 1-Math.exp(-z*w0*t)*(Math.cos(wd*t)+(z*w0/wd)*Math.sin(wd*t))};
    const T=DUR*2,N=80,f=[];
    for(let i=0;i<=N;i++){const x=spring(T*i/N);f.push({transform:`translateY(${(99*(1-x)).toFixed(2)}px) scale(${(0.95+0.05*Math.min(x,1)).toFixed(4)})`,offset:i/N})}
    f[N].transform='translateY(0px) scale(1)';
    function play(){
      pill.animate(f,{duration:T*1000,easing:'linear',fill:'both'});
      pill.animate([{opacity:0},{opacity:1}],{duration:200,easing:OUT,fill:'both'});
      arrow.animate([{transform:'translateY(-14px)'},{transform:'translateY(0)'}],{duration:350,delay:300,easing:OV,fill:'both'});
      arrow.animate([{transform:'translateY(0)'},{transform:'translateY(3px)'},{transform:'translateY(0)'},{transform:'translateY(3px)'},{transform:'translateY(0)'}],{duration:900,delay:T*1000+4000,easing:IO,composite:'add'});
    }
    const io=new IntersectionObserver(es=>{if(es[0].isIntersecting){play();io.disconnect();}},{rootMargin:'0px 0px 1px 0px'});
    io.observe(nextSection);
