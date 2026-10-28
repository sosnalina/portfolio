(function () {
  // Problem statement entrance (spec: briefs/personetics/problem-statement.md §2).
  // Ported from the approved reference (option A, double split). Every frame is a
  // pure function of t. Plays once, the first time the block enters the viewport.
  var blockEl = document.querySelector(".problem-statement");
  if (!blockEl) return;
  var textEl = blockEl.querySelector(".problem-statement__text");
  var braceEls = Array.prototype.slice.call(blockEl.querySelectorAll(".problem-statement__brace"));
  var BRACE_D = braceEls[0].querySelector("path").getAttribute("d"); // single source: the included brace SVG

  var NS = "http://www.w3.org/2000/svg";
  var ARMED = "problem-statement--armed";
  var OVERLAY = "problem-statement__overlay";
  var HAND_OFF = 1930, TOTAL = 2750;

  // Armed: braces and text hidden until the entrance plays. Without JS this class never exists.
  blockEl.classList.add(ARMED);

  // ---------- Easing ----------
  function bezier(x1, y1, x2, y2) {
    const f = (a, b, t) => 3 * a * (1 - t) * (1 - t) * t + 3 * b * (1 - t) * t * t + t * t * t;
    return function (x) {
      if (x <= 0) return 0; if (x >= 1) return 1;
      let lo = 0, hi = 1, t = x;
      for (let i = 0; i < 28; i++) { t = (lo + hi) / 2; if (f(x1, x2, t) < x) lo = t; else hi = t; }
      return f(y1, y2, t);
    };
  }
  const EASE_OUT = bezier(0.23, 1, 0.32, 1);        // enter / exit
  const EASE_IN_OUT = bezier(0.77, 0, 0.175, 1);    // move / morph on screen
  const DRIFT_EASE = bezier(0.6, 0, 0.3, 1.06);     // drift apart, ~1px overshoot (Hadar, 28 Oct)
  const clamp01 = v => v < 0 ? 0 : v > 1 ? 1 : v;
  const prog = (t, start, dur, ease) => ease(clamp01((t - start) / dur));
  const lerp = (a, b, k) => a + (b - a) * k;

  // ---------- Geometry (set in play(), from the block's measured box) ----------
  let STAGE_W, STAGE_H, CX, CY, RB_TOP, RB_X0, CLOSE_SHIFT;
  const RB_W = 43, RB_H = 165;
  const restTransforms = dx => ({
    tr: `translate(${(RB_X0 - dx).toFixed(2)} ${RB_TOP})`,
    tl: `translate(${(RB_W + dx).toFixed(2)} ${RB_TOP + RB_H}) rotate(180)`
  });

  // The brace's centre line, from its middle point to the top tip and to the bottom tip (brace-local coords).
  const PEN_R = 5; // half the brace's arm thickness (19.13 → 29.28)
  const PEN_MID = [38.5, 82.5];
  // The reveal line runs past both ends of the centre line: HEAD covers the outer half of the middle point,
  // TAIL covers the end of each rounded tip. The pens themselves run only between the middle point and the tip.
  const PEN_UP_D = "M47 82.5 L38.5 82.5 L26.5 70 C24.6 68 24.2 66 24.2 62 L24.2 27 C24.2 14 18 6 4.6 4.8 L-3 4.2";
  const PEN_DN_D = "M47 82.5 L38.5 82.5 L26.5 95 C24.6 97 24.2 99 24.2 103 L24.2 138 C24.2 151 18 159 4.6 160.2 L-3 160.8";
  const PEN_HEAD = 8.5, PEN_TAIL = Math.hypot(7.6, 0.6);
  let PEN_UP, PEN_DN, PEN_FULL, PEN_LEN;
  const penAt = p => PEN_HEAD + PEN_LEN * p;      // pen position along the line
  // Reveal edge sits at the pen's centre, under the dot; the tail closes over the last 10% of the stroke.
  const revealAt = p => p <= 0 ? 0 : penAt(p) + PEN_TAIL * clamp01((p - 0.9) / 0.1);

  // ---------- Braces at time t ----------
  function braces(t) {
    const enter = prog(t, 0, 300, EASE_OUT);
    const s = prog(t, 200, 500, EASE_IN_OUT);
    const p = prog(t, 620, 600, EASE_IN_OUT);
    const drift = prog(t, 1230, 700, DRIFT_EASE);
    const r = lerp(4 * lerp(0.9, 1, enter), PEN_R, s);
    const dx = CLOSE_SHIFT * (1 - drift);
    const tf = restTransforms(dx);
    const goo = Math.min(6, r * 0.5) * (1 - prog(t, 1100, 200, x => x));
    if (t >= 1300) return Object.assign({ dl: BRACE_D, dr: BRACE_D, alpha: 1, goo: 0 }, tf);
    // Brace-local point → stage, for each side (the left brace is the right one rotated 180°).
    const toR = ([x, y]) => [RB_X0 - dx + x, RB_TOP + y];
    const toL = ([x, y]) => [RB_W + dx - x, RB_TOP + RB_H - y];
    const up = PEN_UP.getPointAtLength(penAt(p)), dn = PEN_DN.getPointAtLength(penAt(p));
    const pens = side => {
      const to = side === "r" ? toR : toL;
      const m = to(PEN_MID);
      // Before arrival the pens ride on the travelling dot; afterwards they follow the centre line.
      const lag = [(1 - s) * (m[0] - CX), (1 - s) * (m[1] - CY)];
      return [up, dn].map(q => { const a = to([q.x, q.y]); return [a[0] - lag[0], a[1] - lag[1]]; });
    };
    return { pen: { tl: tf.tl, tr: tf.tr, reveal: p, r, right: pens("r"), left: pens("l"), showDots: p < 1 }, alpha: enter, goo };
  }

  // ---------- Applying a frame ----------
  let svg, ids;
  const $ = id => svg.getElementById(ids + id);
  function render(t) {
    const b = braces(t);
    const bl = $("bl"), br = $("br");
    const pen = $("pen");
    // SVG elements have no .hidden property: toggle the attribute itself.
    if (b.pen) pen.removeAttribute("hidden"); else pen.setAttribute("hidden", "");
    if (b.pen) {
      bl.setAttribute("d", ""); br.setAttribute("d", "");
      $("penR").setAttribute("transform", b.pen.tr);
      $("penL").setAttribute("transform", b.pen.tl);
      [PEN_UP, PEN_DN].forEach(el => el.setAttribute("stroke-dashoffset", (PEN_FULL - revealAt(b.pen.reveal)).toFixed(2)));
      const pts = b.pen.right.concat(b.pen.left);
      pen.querySelectorAll(".dot").forEach((c, i) => {
        c.setAttribute("cx", pts[i][0].toFixed(2)); c.setAttribute("cy", pts[i][1].toFixed(2));
        c.setAttribute("r", b.pen.r.toFixed(2)); c.style.display = b.pen.showDots ? "" : "none";
      });
    } else {
      bl.setAttribute("d", b.dl);
      br.setAttribute("d", b.dr);
    }
    if (b.tl) { bl.setAttribute("transform", b.tl); br.setAttribute("transform", b.tr); }
    else { bl.removeAttribute("transform"); br.removeAttribute("transform"); }
    const g = $("braces");
    g.style.opacity = b.alpha;
    if (b.goo > 0.05) {
      $("gooBlur").setAttribute("stdDeviation", b.goo.toFixed(2));
      g.setAttribute("filter", `url(#${ids}goo)`);
    } else g.removeAttribute("filter");
    renderText(t);
  }

  // ---------- Text: the Bill Pay AP manager quote entrance ----------
  const TEXT_START = 1850, TEXT_DUR = 900, TEXT_RISE = 20;
  function renderText(t) {
    const k = prog(t, TEXT_START, TEXT_DUR, EASE_OUT);
    textEl.style.opacity = k;
    textEl.style.transform = `translateY(${((1 - k) * TEXT_RISE).toFixed(2)}px)`;
  }

  // ---------- Reduced motion: no splits, drawing, drift or rise ----------
  function renderReduced(t) {
    // targets the static braces and text; no overlay
    braceEls.forEach(el => { el.style.opacity = prog(t, 0, 200, x => x); });
    textEl.style.opacity = prog(t, 0, 300, x => x);
    textEl.style.transform = "none";
  }

  // ---------- Overlay: both braces in one SVG, inside one filter group ----------
  function buildOverlay() {
    ids = "problem-statement-";
    const box = blockEl.getBoundingClientRect();
    STAGE_W = box.width; STAGE_H = box.height;
    CX = STAGE_W / 2; CY = STAGE_H / 2;
    RB_TOP = (STAGE_H - RB_H) / 2; RB_X0 = STAGE_W - RB_W;
    CLOSE_SHIFT = RB_X0 - (CX + 30);
    const holder = document.createElement("div");
    holder.innerHTML =
      `<svg class="${OVERLAY}" viewBox="0 0 ${STAGE_W} ${STAGE_H}" width="${STAGE_W}" height="${STAGE_H}" aria-hidden="true">
        <defs>
          <!-- Metaball ("goo") filter: blur, then a hard alpha threshold, so touching shapes merge like liquid. -->
          <filter id="${ids}goo" x="0" y="0" width="${STAGE_W}" height="${STAGE_H}" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
            <feGaussianBlur id="${ids}gooBlur" in="SourceGraphic" stdDeviation="6" result="b"></feGaussianBlur>
            <feColorMatrix in="b" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -8"></feColorMatrix>
          </filter>
          <!-- Reveals the brace along its centre line, from the middle point outward. Butt caps keep the
               reveal edge under the pen. Coordinates are brace-local, so one mask serves both braces. -->
          <mask id="${ids}reveal" maskUnits="userSpaceOnUse" x="-20" y="-20" width="90" height="205">
            <path id="${ids}mUp" fill="none" stroke="#fff" stroke-width="16" stroke-linecap="butt"></path>
            <path id="${ids}mDn" fill="none" stroke="#fff" stroke-width="16" stroke-linecap="butt"></path>
          </mask>
        </defs>
        <g id="${ids}braces" class="${OVERLAY}-braces">
          <path id="${ids}bl"></path><path id="${ids}br"></path>
          <g id="${ids}pen" hidden>
            <g id="${ids}penR"><path class="penBrace" mask="url(#${ids}reveal)"></path></g>
            <g id="${ids}penL"><path class="penBrace" mask="url(#${ids}reveal)"></path></g>
            <circle class="dot" r="5"></circle><circle class="dot" r="5"></circle>
            <circle class="dot" r="5"></circle><circle class="dot" r="5"></circle>
          </g>
        </g>
      </svg>`;
    svg = holder.firstElementChild;
    blockEl.appendChild(svg);
    PEN_UP = $("mUp"); PEN_DN = $("mDn");
    PEN_UP.setAttribute("d", PEN_UP_D); PEN_DN.setAttribute("d", PEN_DN_D);
    PEN_FULL = PEN_UP.getTotalLength();
    PEN_LEN = PEN_FULL - PEN_HEAD - PEN_TAIL; // middle point → tip centre
    [PEN_UP, PEN_DN].forEach(el => el.setAttribute("stroke-dasharray", `${PEN_FULL} ${PEN_FULL}`));
    svg.querySelectorAll(".penBrace").forEach(el => el.setAttribute("d", BRACE_D));
  }

  // Back to the static final state: the block's own CSS shows braces and text.
  function finish() {
    if (svg) { svg.remove(); svg = null; }
    braceEls.forEach(el => { el.style.opacity = ""; });
    textEl.style.opacity = "";
    textEl.style.transform = "";
    blockEl.classList.remove(ARMED);
  }

  // ---------- Playback: t = ms since the trigger ----------
  function play(reduced) {
    const start = performance.now();
    let handedOff = false;
    function tick(now) {
      const t = now - start;
      if (reduced) {
        if (t >= 300) { finish(); return; }
        renderReduced(t);
      } else {
        if (t >= TOTAL) { finish(); return; }
        if (handedOff) renderText(t);
        else {
          render(t);
          if (t >= HAND_OFF) {
            // Overlay's last brace positions equal the static braces: show them, drop the overlay.
            handedOff = true;
            braceEls.forEach(el => { el.style.opacity = "1"; });
            svg.remove(); svg = null;
          }
        }
      }
      requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  let played = false;
  ViewportGate.observe(blockEl, {
    onEnter: function () {
      if (played) return;
      played = true;
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduced) {
        braceEls.forEach(el => { el.style.opacity = "0"; });
        textEl.style.opacity = "0";
      } else {
        buildOverlay();
        render(0);
      }
      play(reduced);
    },
    onExit: function () {} // plays once: nothing happens on exit
  });
})();
