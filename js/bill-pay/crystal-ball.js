/*
  Crystal ball — Bill Pay, "High hopes, flat Metrics" section.
  Markup: _includes/crystal-ball.njk · Styles: css/widgets/bill-pay/crystal-ball/crystal-ball.css

  Ported verbatim from the playable mock Hadar approved on 28 Sep 2026. Every number below is
  an approved value; do not retune or re-derive.

  Behaviour
  - Idle: every object floats on its own sine (tempo ≈ the Fee & Delivery gallery's 2.9–3.3s
    ease-in-out bob), with per-object variation from a seeded PRNG (same result every load).
  - Cursor inside "Ellipse big": the stroke pushes nearby objects along it; fast strokes also
    kick objects in scattered directions and spin them (chaos grows with speed^1.8).
  - Every object stays inside "Ellipse small" (rotated corners checked, float included).
  - Cursor leaves: objects spring home and the float — which never stopped — carries on.
  - Dotted brush strokes get 30% of all movement and never rotate.
  - "Ellipse big", "Ellipse small", "base" and "glass" never react to the cursor.
  - Glass: its own endless liquid wobble (outline curvature + faint stretch).
  - Plays only while on screen, via js/shared/viewport-gate.js: starts on enter, pauses on exit,
    resumes from the same moment on re-enter (same play/pause behaviour as the AP Manager orbit).
*/
(function () {
  // Approved tuning values (mock slider defaults, 28 Sep 2026).
  const P = {
    maxDist: 24,      // px — furthest any object may travel from home
    strength: 1.0,    // mouse influence
    sensitivity: 1.0, // how quickly fast strokes turn into chaos
    returnK: 5,       // return spring (rad/s) once the cursor leaves
    floatAmp: 2.5,    // px — idle float travel
    floatSpeed: 1.0,  // × idle float tempo
    variation: 0.5,   // spread between objects
    dotsAmt: 0.3,     // dotted strokes move this fraction of the objects
    glassAmt: 1.0,    // × glass wobble amount
    glassSpeed: 1.0,  // × glass wobble tempo
  };

  function setup(cb) {
    /* ───────── Geometry (ball units, 156 × 156) ───────── */
    const BIG = { x: 78, y: 74, r: 74 };    // Ellipse big: 4,0 148×148 — cursor area
    const SMALL = { x: 78, y: 74, r: 66 };  // Ellipse small: 12,8 132×132 — movement boundary

    // Seeded PRNG — per-object variation is fixed, not re-rolled per load
    let seed = 20260928;
    const rnd = () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; };

    const bodies = [...cb.querySelectorAll('.crystal-ball__layer')]
      .filter(el => el.dataset.crystalBall === 'object' || el.dataset.crystalBall === 'dots')
      .map(el => {
        const cs = getComputedStyle(el);
        const L = parseFloat(cs.left), T = parseFloat(cs.top), W = parseFloat(cs.width), H = parseFloat(cs.height);
        const hx = L + W / 2, hy = T + H / 2;
        const margin = Math.min(W, H) * 0.4;
        const homeR = Math.hypot(hx - SMALL.x, hy - SMALL.y);
        return {
          el, dots: el.dataset.crystalBall === 'dots',
          hx, hy, hw: W / 2, hh: H / 2,
          cornerLimit: Math.max(SMALL.r, ...[[-1,-1],[1,-1],[1,1],[-1,1]].map(([sx,sy]) => Math.hypot(hx + sx * W / 2 - SMALL.x, hy + sy * H / 2 - SMALL.y))), // whole shape stays inside Ellipse small (never tighter than its home)
          rLimit: Math.max(SMALL.r - margin, homeR),   // centre stays inside Ellipse small (never tighter than where it already sits)
          x: 0, y: 0, vx: 0, vy: 0, a: 0, va: 0,        // scramble offset + velocity, rotation + angular velocity
          // idle float: independent tempo, travel, direction and phase per object
          fDur: rnd() * 2 - 1, fAmp: rnd() * 2 - 1, fDirX: rnd() * 2 - 1, fDurX: rnd() * 2 - 1, fRot: rnd() * 2 - 1,
          phY: rnd() * Math.PI * 2, phX: rnd() * Math.PI * 2, phR: rnd() * Math.PI * 2,
          chaosAng: rnd() * Math.PI * 2,
        };
      });

    /* ───────── Pointer ───────── */
    const ptr = { inside: false, x: 0, y: 0, dx: 0, dy: 0, speed: 0, has: false };
    const toBall = e => { const r = cb.getBoundingClientRect(); const s = r.width / 156; return [(e.clientX - r.left) / s, (e.clientY - r.top) / s]; };
    cb.addEventListener('pointermove', e => {
      const [x, y] = toBall(e);
      const inside = Math.hypot(x - BIG.x, y - BIG.y) <= BIG.r;
      if (inside && ptr.has && ptr.inside) { ptr.dx += x - ptr.x; ptr.dy += y - ptr.y; }
      ptr.x = x; ptr.y = y; ptr.has = true; ptr.inside = inside;
    });
    cb.addEventListener('pointerleave', () => { ptr.inside = false; ptr.has = false; });

    /* ───────── Loop ───────── */
    const glass = cb.querySelector('[data-crystal-ball="glass"]');
    let raf = null, last = null, fT = 0, gT = 0;

    function frame(now) {
      if (last === null) last = now;
      const dt = Math.min(0.05, (now - last) / 1000); last = now;
      fT += dt * P.floatSpeed; gT += dt * P.glassSpeed;

      // cursor displacement this frame → speed (ball px/s), smoothed
      const moved = Math.hypot(ptr.dx, ptr.dy);
      const instSpeed = dt > 0 ? moved / dt : 0;
      ptr.speed += (instSpeed - ptr.speed) * Math.min(1, dt * 12);

      // chaos grows faster than speed: calm strokes push, aggressive strokes scatter
      const s = (ptr.speed * P.sensitivity) / 400;          // ~1 at a brisk stroke
      const chaos = Math.pow(s, 1.8);

      for (const b of bodies) {
        const k = b.dots ? P.dotsAmt : 1;
        const cx = b.hx + b.x, cy = b.hy + b.y;

        if (ptr.inside && moved > 0) {
          const d = Math.hypot(cx - ptr.x, cy - ptr.y);
          const fall = Math.exp(-(d * d) / (2 * 38 * 38));      // influence radius ~38px
          // 1 — push along the stroke (proportional to how far the cursor moved)
          const push = 1.2 * P.strength * fall * k;
          b.vx += ptr.dx * push; b.vy += ptr.dy * push;
          // 2 — scatter: each object kicked off in its own direction, only when the stroke is fast
          b.chaosAng += 2.4 + rnd() * 1.6;
          const kick = 260 * P.strength * chaos * fall * k * dt * 60 * 0.12;
          b.vx += Math.cos(b.chaosAng) * kick; b.vy += Math.sin(b.chaosAng) * kick;
          // 3 — spin from the stroke passing the object off-centre
          if (!b.dots) {
            const rx = cx - ptr.x, ry = cy - ptr.y;
            b.va += ((ptr.dx * ry - ptr.dy * rx) / (d * d + 60)) * 250 * P.strength * fall * (0.4 + chaos);
          }
        }

        // springs: soft while the cursor is inside (contents stay stirred), firm once it leaves
        const w = ptr.inside ? P.returnK * 0.22 : P.returnK;
        const c = ptr.inside ? 3.5 : 2 * 0.8 * w;          // inside: drag lets contents coast; outside: spring, damping ratio 0.8
        b.vx += (-w * w * b.x - c * b.vx) * dt;
        b.vy += (-w * w * b.y - c * b.vy) * dt;
        b.va += (-w * w * b.a - c * b.va) * dt;
        b.x += b.vx * dt; b.y += b.vy * dt; b.a += b.va * dt;

        // limit 1 — max movement distance
        const lim = P.maxDist * k;
        const off = Math.hypot(b.x, b.y);
        if (off > lim) { const f = lim / off; b.x *= f; b.y *= f; const nx = b.x / lim, ny = b.y / lim; const vn = b.vx * nx + b.vy * ny; if (vn > 0) { b.vx -= 1.4 * vn * nx; b.vy -= 1.4 * vn * ny; } }

        // idle float — independent sine per object (≈ the gallery's ease-in-out yoyo), never paused, so return lands straight back into it
        const v = P.variation;
        const TY = 3.1 * (1 + 0.35 * v * b.fDur);            // gallery reference: 2.9–3.3s
        const TX = 4.3 * (1 + 0.45 * v * b.fDurX);
        const amp = P.floatAmp * (1 + 0.4 * v * b.fAmp) * k;
        const fy = -amp * (0.5 - 0.5 * Math.cos(2 * Math.PI * fT / TY + b.phY));   // rest → up → rest, like translateY(0 → travel)
        const fx = amp * 0.6 * v * b.fDirX * Math.sin(2 * Math.PI * fT / TX + b.phX);
        const fr = b.dots ? 0 : 2.2 * v * b.fRot * Math.sin(2 * Math.PI * fT / (TY * 1.7) + b.phR);

        b.a = Math.max(-35, Math.min(35, b.a));
        // limit 2 — Ellipse small boundary (soft bounce), checked on the final drawn position, float included
        if (b.dots) {
          // dotted strokes: centre-based (their stroke boxes already overhang the circle at rest)
          const ex = b.hx + b.x + fx - SMALL.x, ey = b.hy + b.y + fy - SMALL.y, er = Math.hypot(ex, ey);
          if (er > b.rLimit) { const nx = ex / er, ny = ey / er; b.x -= (er - b.rLimit) * nx; b.y -= (er - b.rLimit) * ny; const vn = b.vx * nx + b.vy * ny; if (vn > 0) { b.vx -= 1.4 * vn * nx; b.vy -= 1.4 * vn * ny; } }
        } else {
          // objects: every corner of the rotated shape stays inside — long shapes like check-v can't poke out
          for (let pass = 0; pass < 4; pass++) {
            const rad = (b.a + fr) * Math.PI / 180, co = Math.cos(rad), si = Math.sin(rad);
            let worst = 0, wx = 0, wy = 0;
            for (const [sx, sy] of [[-1,-1],[1,-1],[1,1],[-1,1]]) {
              const px = b.hx + b.x + fx + sx * b.hw * co - sy * b.hh * si - SMALL.x;
              const py = b.hy + b.y + fy + sx * b.hw * si + sy * b.hh * co - SMALL.y;
              const pr = Math.hypot(px, py);
              if (pr > worst) { worst = pr; wx = px; wy = py; }
            }
            if (worst <= b.cornerLimit) break;
            const nx = wx / worst, ny = wy / worst, over = worst - b.cornerLimit;
            b.x -= over * nx; b.y -= over * ny;
            const vn = b.vx * nx + b.vy * ny; if (vn > 0) { b.vx -= 1.4 * vn * nx; b.vy -= 1.4 * vn * ny; }
            if (pass >= 1) b.va *= 0.5;   // still touching after the push: calm the spin that swung it out
          }
        }

        b.el.style.transform = `translate(${(b.x + fx).toFixed(2)}px, ${(b.y + fy).toFixed(2)}px) rotate(${(b.a + fr).toFixed(2)}deg)`;
      }
      ptr.dx = 0; ptr.dy = 0;

      // glass — own loop, never touched by the cursor.
      // Liquid: the outline's curvature drifts on four out-of-step waves, plus a faint breathing stretch.
      const A = P.glassAmt;
      const r = (i, f) => (50 + 7 * A * Math.sin(gT * f + i * 1.7)).toFixed(2) + '%';
      glass.style.borderRadius = `${r(0, .83)} ${r(1, .67)} ${r(2, .91)} ${r(3, .73)} / ${r(4, .61)} ${r(5, .87)} ${r(6, .71)} ${r(7, .79)}`;
      const gsx = 1 + 0.025 * A * Math.sin(gT * 0.53), gsy = 1 + 0.025 * A * Math.sin(gT * 0.47 + 1);
      glass.style.transform = `rotate(${(-41.018 + Math.sin(gT * 0.31) * 1.5 * A).toFixed(3)}deg) scale(${gsx.toFixed(4)}, ${gsy.toFixed(4)})`;

      raf = requestAnimationFrame(frame);
    }

    function play() { if (raf !== null) return; last = null; raf = requestAnimationFrame(frame); }
    function pause() { if (raf !== null) cancelAnimationFrame(raf); raf = null; }

    window.ViewportGate.observe(cb, { onEnter: play, onExit: pause });
  }

  document.addEventListener('DOMContentLoaded', function () {
    const cb = document.querySelector('.crystal-ball');
    if (cb) setup(cb);
  });
})();
