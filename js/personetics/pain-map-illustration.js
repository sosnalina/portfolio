(function () {
  // Pain map illustration transition (spec: briefs/personetics/pain-map.md §6). Port of the approved reference,
  // version 9 (§6.8) with the changes in §6.9. Every frame is a pure function of (scene, t); nothing is random.
  var stage = document.querySelector("#pain-map .pain-map__illustration");
  if (!stage) return;

  // ---------- Easing: project tokens ----------
  function bezier(x1, y1, x2, y2) {
    var f = function (a, b, t) { return 3 * a * (1 - t) * (1 - t) * t + 3 * b * (1 - t) * t * t + t * t * t; };
    return function (x) {
      if (x <= 0) return 0; if (x >= 1) return 1;
      var lo = 0, hi = 1, t = x;
      for (var i = 0; i < 28; i++) { t = (lo + hi) / 2; if (f(x1, x2, t) < x) lo = t; else hi = t; }
      return f(y1, y2, t);
    };
  }
  var EASE_OUT = bezier(0.23, 1, 0.32, 1);          // entering / exiting
  var EASE_IO = bezier(0.77, 0, 0.175, 1);          // moving / morphing on screen
  var POP = bezier(0.175, 0.885, 0.32, 1.275);      // entrance overshoot
  var LINEAR = function (x) { return x; };
  var clamp = function (v) { return v < 0 ? 0 : v > 1 ? 1 : v; };
  var seg = function (t, start, dur, ease) { return ease(clamp((t - start) / dur)); };
  var lerp = function (a, b, k) { return a + (b - a) * k; };
  var arr = function (list) { return Array.prototype.slice.call(list); };
  var SVGNS = "http://www.w3.org/2000/svg";

  var CX = 114, CY = 94, SEED_R = 5;
  var SHRINK_R = 5;                  // dot radius just before it stretches into a line
  var EXIT_FACTOR = 1.4;             // exits play 1.4x faster than entrances
  var PLAYBACK = 1.2;                // page speed relative to the reference's own clock
  var FADE_MS = 75;                  // reduced motion: fade out, swap, fade in (§6.4)
  var ART_W = 228;
  // Seeded, never Math.random(): a scrub must reproduce the same frame.
  var JITTER = [0, 70, 25, 100, 45, 85, 10, 60, 110, 35, 90, 15, 55, 95, 30, 75, 5, 65];

  var sceneEls = {};
  arr(stage.querySelectorAll(".pain-map__scene")).forEach(function (el) { sceneEls[el.getAttribute("data-tab")] = el; });
  var goo = document.getElementById("pain-map-goo-blur");

  // ---------- Init: all scenes visible while they are prepared and measured ----------
  for (var k0 in sceneEls) { sceneEls[k0].hidden = false; sceneEls[k0].style.display = "block"; }

  // Layers: wrap each element child of each SVG in <g class="pe" data-i="N">, N = 2 + position.
  for (var k1 in sceneEls) {
    var svg = sceneEls[k1].querySelector("svg");
    arr(svg.children).forEach(function (child, n) {
      var g = document.createElementNS(SVGNS, "g");
      g.setAttribute("class", "pe");
      g.setAttribute("data-i", String(2 + n));
      svg.replaceChild(g, child);
      g.appendChild(child);
    });
  }
  var layer = function (scene, i) { return sceneEls[scene].querySelector('.pe[data-i="' + i + '"]'); };

  // Plan: the stroked rings keep their weight in screen pixels.
  [3, 5, 7, 9].forEach(function (i) {
    arr(layer("plan", i).querySelectorAll("ellipse, path")).forEach(function (el) { el.setAttribute("vector-effect", "non-scaling-stroke"); });
  });

  // Save: the four hairline layers (2-5) become four dots, drawn first so the lines stay behind the objects.
  var saveSvg = sceneEls.save.querySelector("svg");
  [2, 3, 4, 5].forEach(function (i) { saveSvg.removeChild(layer("save", i)); });
  var saveDotsG = document.createElementNS(SVGNS, "g");
  saveDotsG.setAttribute("class", "pe-free pain-map-save-dots");
  var saveDots = [0, 1, 2, 3].map(function () {
    var r = document.createElementNS(SVGNS, "rect");
    r.setAttribute("class", "pain-map-save-dot");
    r.style.fill = "var(--primitive-black)";
    saveDotsG.appendChild(r);
    return r;
  });
  saveSvg.insertBefore(saveDotsG, saveSvg.firstChild);

  // Spend: two pens in a group after layer 3 and before layer 4.
  var spendSvg = sceneEls.spend.querySelector("svg");
  var spendPensG = document.createElementNS(SVGNS, "g");
  spendPensG.setAttribute("class", "pe-free pain-map-spend-pens");
  var spendPens = [0, 1].map(function () {
    var c = document.createElementNS(SVGNS, "circle");
    c.setAttribute("class", "pain-map-spend-pen");
    c.style.fill = "var(--primitive-black)";
    spendPensG.appendChild(c);
    return c;
  });
  spendSvg.insertBefore(spendPensG, layer("spend", 4));

  function bboxOf(g) { var b = g.getBBox(); return { cx: b.x + b.width / 2, cy: b.y + b.height / 2, w: b.width, h: b.height }; }
  var pe = function (scene) {
    return arr(sceneEls[scene].querySelectorAll(".pe")).map(function (g) { return Object.assign({ g: g, i: +g.dataset.i }, bboxOf(g)); });
  };

  // Non-scaling strokes are measured in screen pixels, so their weight follows the stage's display scale.
  var strokeEls = arr(stage.querySelectorAll("[vector-effect]")).map(function (el) {
    return {
      el: el, w: parseFloat((el.getAttribute("style").match(/stroke-width:([\d.]+)/) || [0, 1])[1]),
      dash: (el.getAttribute("stroke-dasharray") || "").split(/[\s,]+/).filter(Boolean).map(Number)
    };
  });
  function applyStrokeScale() {
    var k = stage.getBoundingClientRect().width / ART_W;
    strokeEls.forEach(function (s) {
      s.el.style.strokeWidth = (s.w * k).toFixed(3);
      if (s.dash.length) s.el.style.strokeDasharray = s.dash.map(function (v) { return (v * k).toFixed(3); }).join(" ");
    });
  }
  applyStrokeScale(); window.addEventListener("resize", applyStrokeScale);

  // ---------- PLAN: the black bottom ellipse is the seed. It starts as the small circle, grows to its own shape,
  // then travels down to the bottom of the stack while the other five rings peel off the same spot. ----------
  var PLAN_BLACK = 4, PLAN_RED = 2, PLAN_DOTTED = 9;
  var PLAN_RING_LINES = [2, 3, 4, 5, 7, 9];
  var PLAN_ITEM_PARENT = { 6: 3, 8: 5, 10: 9, 11: 7, 12: 3, 13: 9 };   // item layer -> the ring it sits on
  var PLAN_ROT = { 6: -40, 8: 25, 10: 90, 11: 30, 12: 0, 13: -30 };

  function makePlan() {
    var all = pe("plan");
    var rings = all.filter(function (e) { return PLAN_RING_LINES.indexOf(e.i) >= 0; });
    var items = all.filter(function (e) { return PLAN_ITEM_PARENT[e.i]; });
    var black = rings.filter(function (r) { return r.i === PLAN_BLACK; })[0];
    var red = rings.filter(function (r) { return r.i === PLAN_RED; })[0];
    var dotted = rings.filter(function (r) { return r.i === PLAN_DOTTED; })[0];
    var others = rings.filter(function (r) { return r !== black && r !== red; })
      .sort(function (a, b) { return Math.abs(a.cy - CY) - Math.abs(b.cy - CY); });
    black.start = 180; black.dur = 420;
    others.forEach(function (r, n) { r.start = 190 + 35 * n; r.dur = 380; });
    // The red ellipse is born on the dotted ring (same colour, same shape) once that ring is nearly in place, then rises to the top.
    var tRed = 0;
    while (seg(tRed, dotted.start, dotted.dur, EASE_OUT) < 0.75) tRed++;
    red.start = tRed + 40; red.dur = 340; red.fadeStart = tRed;
    items.forEach(function (it, n) {
      it.ring = rings.filter(function (r) { return r.i === PLAN_ITEM_PARENT[it.i]; })[0];
      it.start = it.ring.start + 170 + JITTER[n];
      it.dur = 260;
    });
    var T = Math.max.apply(null, rings.map(function (r) { return r.start + r.dur; }).concat(items.map(function (i) { return i.start + i.dur; })));
    var bRx = black.w / 2, bRy = black.h / 2;
    function render(t) {
      // The black ellipse's current shape: circle r5 -> its own width, then its own height.
      var sxB = lerp(SEED_R / bRx, 1, seg(t, 0, 300, EASE_IO)), syB = lerp(SEED_R / bRy, 1, seg(t, 0, 200, EASE_OUT));
      black.k = seg(t, black.start, black.dur, EASE_OUT);
      black.g.setAttribute("transform", "translate(" + black.cx + " " + lerp(CY, black.cy, black.k) + ") scale(" + sxB + " " + syB + ") translate(" + (-black.cx) + " " + (-black.cy) + ")");
      others.forEach(function (r) {
        r.k = seg(t, r.start, r.dur, EASE_OUT);
        // Each ring leaves the seed's own shape, then opens to its own.
        var Y = lerp(CY, r.cy, r.k), sx = lerp(sxB, 1, r.k), sy = lerp(syB * bRy / (r.h / 2), 1, r.k);
        r.g.setAttribute("transform", "translate(" + r.cx + " " + Y + ") scale(" + sx + " " + sy + ") translate(" + (-r.cx) + " " + (-r.cy) + ")");
        r.g.style.opacity = clamp(r.k / 0.3);
      });
      red.k = seg(t, red.start, red.dur, EASE_OUT);
      red.g.setAttribute("transform", "translate(" + red.cx + " " + lerp(dotted.cy, red.cy, red.k) + ") scale(1 " + lerp((dotted.h / 2) / (red.h / 2), 1, red.k) + ") translate(" + (-red.cx) + " " + (-red.cy) + ")");
      red.g.style.opacity = seg(t, red.fadeStart, 80, LINEAR);
      items.forEach(function (it) {
        var s = seg(t, it.start, it.dur, POP), rot = PLAN_ROT[it.i] * (1 - seg(t, it.start, it.dur, EASE_OUT));
        var dy = (1 - it.ring.k) * (CY - it.ring.cy);
        it.g.setAttribute("transform", "translate(0 " + dy + ") translate(" + it.cx + " " + it.cy + ") rotate(" + rot + ") scale(" + Math.max(s, 0.0001) + ") translate(" + (-it.cx) + " " + (-it.cy) + ")");
        it.g.style.opacity = s > 0.001 ? 1 : 0;
      });
    }
    return { T: T, render: render };
  }

  // ---------- SAVE: seed circle splits 1 -> 2 -> 4 (liquid), each dot stretches into its line, items pop ----------
  var SAVE_LINES = [68.75, 119.75, 18.75, 170.75];     // centre of each hairline; first two are the inner pair
  function makeSave() {
    var items = pe("save");
    var lineStart = [380, 405, 430, 455];
    items.forEach(function (it, n) {
      var best = 0;
      SAVE_LINES.forEach(function (y, li) { if (Math.abs(y - it.cy) < Math.abs(SAVE_LINES[best] - it.cy)) best = li; });
      it.line = best;
      it.start = lineStart[best] + 120 + JITTER[n % JITTER.length];
      it.dur = 240;
      it.rot = it.g.querySelector("image") ? (n % 2 ? 25 : -25) : it.g.querySelector("circle") ? 0 : (n % 2 ? 90 : -90);
    });
    var T = Math.max.apply(null, items.map(function (i) { return i.start + i.dur; }).concat(lineStart.map(function (s) { return s + 300; })));
    function render(t) {
      var s1 = seg(t, 0, 240, EASE_IO), s2 = seg(t, 130, 250, EASE_IO);
      var yA = lerp(CY, SAVE_LINES[0], s1), yB = lerp(CY, SAVE_LINES[1], s1);
      var ys = [yA, yB, lerp(yA, SAVE_LINES[2], s2), lerp(yB, SAVE_LINES[3], s2)];   // inner A, inner B, outer A, outer B
      var gooK = 1 - seg(t, 240, 90, LINEAR);
      var r = lerp(SEED_R, SHRINK_R, seg(t, 300, 140, EASE_IO));   // dots get smaller first
      saveDots.forEach(function (d, i) {
        var hk = seg(t, lineStart[i], 300, EASE_OUT);
        var w = lerp(2 * r, ART_W, hk);
        var h = Math.max(0.5, (4 * r * r) / w);   // stretches like liquid: the thinner, the longer, no pause
        d.setAttribute("x", CX - w / 2); d.setAttribute("y", ys[i] - h / 2);
        d.setAttribute("width", w); d.setAttribute("height", h); d.setAttribute("rx", h / 2);
        d.style.fill = "color-mix(in srgb, var(--primitive-grey-dark) " + (hk * 100).toFixed(1) + "%, var(--primitive-black))";
      });
      if (gooK > 0.02) { goo.setAttribute("stdDeviation", (SEED_R * 0.5 * gooK).toFixed(2)); saveDotsG.setAttribute("filter", "url(#pain-map-goo)"); }
      else saveDotsG.removeAttribute("filter");
      items.forEach(function (it) {
        var s = seg(t, it.start, it.dur, POP), rot = it.rot * (1 - seg(t, it.start, it.dur, EASE_OUT));
        it.g.setAttribute("transform", "translate(" + it.cx + " " + it.cy + ") rotate(" + rot + ") scale(" + Math.max(s, 0.0001) + ") translate(" + (-it.cx) + " " + (-it.cy) + ")");
        it.g.style.opacity = s > 0.001 ? 1 : 0;
      });
    }
    return { T: T, render: render };
  }

  // ---------- SPEND: the seed splits in two and the halves fly apart, one to the left end of the lower line and one to the
  // right end of the upper line. Each draws its line back across the artboard as a pen, shrinking to hairline as it goes.
  // When both lines have crossed the middle, the scalloped ring pops in; once it is nearly in place the rest of the
  // objects pop in between the lines. ----------
  var SPEND_LINES = [   // origin = where the pen starts, (ux, uy) = unit direction it draws in, from the Figma line transforms
    { i: 2, ox: 5, oy: 94.6499023, ux: 0.9874613285, uy: 0.1578612030, len: 218.134369, rev: false },   // lower line: drawn left to right
    { i: 3, ox: 225.9348, oy: 41.2487, ux: -0.9963000417, uy: 0.0859434158, len: 221.729202, rev: true }  // upper line: drawn right to left
  ];
  var SPEND_RING = 4;                                                       // layer 4 = the scalloped ring
  var SPEND_DELAY = [60, 0, 110, 80, 40, 100, 70, 30, 90, 50, 20, 120];     // seeded
  function makeSpend() {
    var all = pe("spend");
    var lines = SPEND_LINES.map(function (L) {
      return Object.assign({ el: all.filter(function (e) { return e.i === L.i; })[0].g.querySelector("line") }, L);
    });
    lines.forEach(function (L) { L.el.setAttribute("stroke-dasharray", L.len + " " + L.len); });
    var penStart = [200, 230], penDur = 360;
    var penX = function (t, n) {
      var L = SPEND_LINES[n];
      return lerp(CX, L.ox, seg(t, 0, 240, EASE_IO)) + L.ux * L.len * seg(t, penStart[n], penDur, EASE_IO);
    };
    // The ring starts when both pens have crossed x = 114 (the middle of the artboard).
    var crossed = [null, null];
    for (var ms = 0; ms <= 1000 && (crossed[0] === null || crossed[1] === null); ms++) {
      if (crossed[0] === null && ms >= penStart[0] && penX(ms, 0) >= CX) crossed[0] = ms;
      if (crossed[1] === null && ms >= penStart[1] && penX(ms, 1) <= CX) crossed[1] = ms;
    }
    var ringStart = Math.max(crossed[0], crossed[1]), ringDur = 300, restBase = ringStart + 160;   // the rest start as the ring nears its place
    var items = all.filter(function (e) { return e.i > 3; });
    items.forEach(function (it, n) {
      var boat = it.i === 9, ring = it.i === SPEND_RING;
      it.start = ring ? ringStart : restBase + (boat ? 0 : 40 + SPEND_DELAY[n % SPEND_DELAY.length]);
      it.dur = ring ? ringDur : boat ? 320 : 260;
      var hasImg = !!it.g.querySelector("image"), hasCircle = !!it.g.querySelector("circle");
      it.rot = ring ? -100 : boat ? -8 : hasImg ? (n % 2 ? 22 : -22) : hasCircle ? 0 : (n % 2 ? 100 : -100);
    });
    var T = Math.max.apply(null, items.map(function (i) { return i.start + i.dur; }).concat(penStart.map(function (s) { return s + penDur; })));
    function render(t) {
      var s = seg(t, 0, 240, EASE_IO);
      lines.forEach(function (L, n) {
        var k = seg(t, penStart[n], penDur, EASE_IO);
        L.el.setAttribute("stroke-dashoffset", ((L.rev ? -1 : 1) * L.len * (1 - k)).toFixed(2));
        L.el.parentNode.style.opacity = k > 0 ? 1 : 0;
        spendPens[n].setAttribute("cx", lerp(CX, L.ox, s) + L.ux * L.len * k);
        spendPens[n].setAttribute("cy", lerp(CY, L.oy, s) + L.uy * L.len * k);
        spendPens[n].setAttribute("r", lerp(SEED_R, 0.3, k));
        spendPens[n].style.opacity = k >= 0.999 ? 0 : 1;
      });
      var gooK = 1 - seg(t, 100, 130, LINEAR);
      if (gooK > 0.02) { goo.setAttribute("stdDeviation", (SEED_R * 0.5 * gooK).toFixed(2)); spendPensG.setAttribute("filter", "url(#pain-map-goo)"); }
      else spendPensG.removeAttribute("filter");
      items.forEach(function (it) {
        var p = seg(t, it.start, it.dur, POP), rot = it.rot * (1 - seg(t, it.start, it.dur, EASE_OUT));
        it.g.setAttribute("transform", "translate(" + it.cx + " " + it.cy + ") rotate(" + rot + ") scale(" + Math.max(p, 0.0001) + ") translate(" + (-it.cx) + " " + (-it.cy) + ")");
        it.g.style.opacity = p > 0.001 ? 1 : 0;
      });
    }
    return { T: T, render: render, ringStart: ringStart };
  }

  // All scenes are measured while visible, then one is shown at a time.
  var SCENES = { plan: makePlan(), save: makeSave(), spend: makeSpend() };
  function show(scene) { for (var k in sceneEls) sceneEls[k].style.display = k === scene ? "block" : "none"; }

  // ---------- Driver: any tab to any tab ----------
  // State is (scene, t). Not on the target tab: run t back to 0 (the seed, identical in every scene), swap, run forward.
  // Switching again mid-move just reverses t from wherever it is, so interruptions are continuous.
  var scene = "spend", t = SCENES.spend.T, target = "spend", last = 0, raf = 0, fadeTimer = 0;
  function draw() { show(scene); SCENES[scene].render(t); }
  function frame(now) {
    var dt = Math.min(64, now - last) * PLAYBACK; last = now;
    if (scene !== target) { t -= dt * EXIT_FACTOR; if (t <= 0) { scene = target; t = 0; } }
    else t = Math.min(SCENES[scene].T, t + dt);
    draw();
    raf = (scene === target && t >= SCENES[scene].T) ? 0 : requestAnimationFrame(frame);
  }

  function setTarget(id) {
    if (!SCENES[id] || id === target) return;
    target = id;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      // §6.4: the illustration still changes, with a fade out, swap, fade in; no other motion.
      clearTimeout(fadeTimer);
      stage.style.transition = "opacity " + FADE_MS + "ms linear";
      stage.style.opacity = 0;
      fadeTimer = setTimeout(function () {
        scene = target; t = SCENES[scene].T; draw();
        stage.style.opacity = 1;
      }, FADE_MS);
      return;
    }
    if (!raf) { last = performance.now(); raf = requestAnimationFrame(frame); }
  }

  draw();   // load state: Spend, settled; no entrance, nothing waits on ViewportGate
  arr(document.querySelectorAll("#pain-map .pain-map-toggle__tab")).forEach(function (b) {
    b.addEventListener("click", function () { setTarget(b.getAttribute("data-tab")); });
  });
})();
