(function () {
  // Head mesh motion for the Personetics Danny figure
  // (spec: briefs/personetics/danny-figure.md §1 "Head mesh"; motion duplicated from
  // js/personetics/cognitive-banking-diagram.js, single mesh, no pinned dot).
  // BASE and EDGES are read from the rendered markup, the single source.
  var TAU = Math.PI * 2;
  var AMPLITUDE = 8; // px in mesh space, same as the diagram
  var LOOP = 8 / 1.3; // s, same as the diagram

  var PARAMS = { pin: null, phase: 0, rate: 1.0 };

  function offset(base, i, theta, A) {
    var x = base[i][0];
    var y = base[i][1];
    var ph = (x / 140 + y / 120) * Math.PI;
    return [0.4 * A * Math.cos(theta - ph), A * Math.sin(theta - ph)];
  }

  function dotPositions(base, mesh, t) {
    var theta = (TAU / LOOP) * mesh.rate * t + mesh.phase;
    return base.map(function (b, i) {
      if (i === mesh.pin) return b;
      var d = offset(base, i, theta, AMPLITUDE);
      return [b[0] + d[0], b[1] + d[1]];
    });
  }

  var root = document.querySelector(".dfg");
  if (!root) return;

  var g = root.querySelector(".dfg__mesh");
  var dots = Array.prototype.slice.call(g.querySelectorAll(".dfg__dot"));
  var edges = Array.prototype.slice.call(g.querySelectorAll(".dfg__edge"));
  var base = dots.map(function (d) {
    return [parseFloat(d.getAttribute("cx")), parseFloat(d.getAttribute("cy"))];
  });
  var joins = edges.map(function (e) {
    return [parseInt(e.getAttribute("data-a"), 10), parseInt(e.getAttribute("data-b"), 10)];
  });

  function render(t) {
    var pos = dotPositions(base, PARAMS, t);
    dots.forEach(function (d, i) {
      d.setAttribute("cx", pos[i][0]);
      d.setAttribute("cy", pos[i][1]);
    });
    edges.forEach(function (e, i) {
      var a = pos[joins[i][0]];
      var b = pos[joins[i][1]];
      e.setAttribute("x1", a[0]);
      e.setAttribute("y1", a[1]);
      e.setAttribute("x2", b[0]);
      e.setAttribute("y2", b[1]);
    });
  }

  // Leg swing (spec: briefs/personetics/danny-figure.md §2). Whole-figure stop motion: the frame
  // is a pure function of t, and --dfg-frame (0..6) selects one frame of the strip.
  var CYCLE = 1.5; // s, locked by Hadar 29 Oct
  var SINE = 0.55; // 0 = constant speed, 1 = full sine; locked by eye
  var FRAMES = 7; // strip index 0..6

  // Frame index as a pure function of time t (seconds). One cycle goes 0 -> 6 -> 0.
  // The sine makes the ends linger and the middle fast; blending toward a triangle
  // wave (SINE < 1) keeps the legs from parking at the ends.
  function frameAt(t) {
    var p = (t / CYCLE) % 1;
    var sn = 0.5 - 0.5 * Math.cos(TAU * p);
    var tri = p < 0.5 ? 2 * p : 2 - 2 * p;
    var s = tri + (sn - tri) * SINE;
    return Math.round(s * (FRAMES - 1));
  }

  var strip = root.querySelector(".dfg__strip");
  var legFrame = -1; // last index set; -1 so the first call always writes

  function renderLegs(t) {
    var f = frameAt(t);
    if (f === legFrame) return;
    legFrame = f;
    strip.style.setProperty("--dfg-frame", f);
  }

  // Bubble wobble and text entrance (spec: briefs/personetics/danny-figure.md §3 phase 2).
  // The ellipse sways as a sine of t; the quote fades in once, from the first onEnter.
  // Both are pure functions of t (and of enterT for the text).
  var BUBBLE_ANGLE = 5; // deg, same as the Bill Pay AP manager blob
  var BUBBLE_RATE = 0.6; // rad/s, same
  var TEXT_DURATION = 0.9; // s
  var TEXT_RISE = 20; // px

  function bezier(x1, y1, x2, y2) {
    var f = function (a, b, t) { return 3 * a * (1 - t) * (1 - t) * t + 3 * b * (1 - t) * t * t + t * t * t; };
    return function (x) {
      if (x <= 0) return 0;
      if (x >= 1) return 1;
      var lo = 0, hi = 1, t = x;
      for (var i = 0; i < 28; i++) { t = (lo + hi) / 2; if (f(x1, x2, t) < x) lo = t; else hi = t; }
      return f(y1, y2, t);
    };
  }
  var EASE_OUT = bezier(0.23, 1, 0.32, 1);

  var bubbleBody = root.querySelector(".dfg__bubble-body");
  var quote = root.querySelector(".dfg__quote");
  var enterT = null; // seconds on the shared clock at the first onEnter
  var textDone = false;

  function renderBubble(t) {
    var deg = Math.sin(t * BUBBLE_RATE) * BUBBLE_ANGLE;
    bubbleBody.style.transform = "rotate(" + deg.toFixed(3) + "deg)";
  }

  function clearText() {
    quote.style.opacity = "";
    quote.style.transform = "";
    root.classList.remove("dfg--armed");
    textDone = true;
  }

  function renderText(t) {
    if (enterT === null || textDone) return;
    var k = EASE_OUT((t - enterT) / TEXT_DURATION);
    if (k >= 1) {
      clearText();
      return;
    }
    quote.style.opacity = k.toFixed(3);
    quote.style.transform = "translateY(" + ((1 - k) * TEXT_RISE).toFixed(2) + "px)";
  }

  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
  var inRoot = false; // .dfg gate: bubble, quote, mesh
  var inFigure = false; // .dfg__figure gate: legs
  var frame = 0;

  // Hidden until the entrance plays; without this class (no JS, or reduced motion) the quote shows.
  if (!reduced.matches) root.classList.add("dfg--armed");

  function tick() {
    var t = performance.now() / 1000; // t = seconds since page load
    render(t);
    renderLegs(t);
    renderBubble(t);
    renderText(t);
    frame = requestAnimationFrame(tick);
  }

  // Animate only while on screen and motion is allowed; reduced motion = full stop at t = 0.
  function sync() {
    if (reduced.matches) {
      cancelAnimationFrame(frame);
      frame = 0;
      render(0);
      clearText();
      bubbleBody.style.transform = "";
    } else if ((inRoot || inFigure) && !frame) {
      frame = requestAnimationFrame(tick);
    } else if (!inRoot && !inFigure && frame) {
      cancelAnimationFrame(frame);
      frame = 0;
    }
  }

  reduced.addEventListener("change", sync);
  ViewportGate.observe(root, {
    onEnter: function () {
      inRoot = true;
      if (enterT === null) enterT = performance.now() / 1000;
      sync();
    },
    onExit: function () { inRoot = false; sync(); },
  });
  // The legs hang below .dfg into section 03, so they get their own gate; the loop runs while either is on screen.
  ViewportGate.observe(root.querySelector(".dfg__figure"), {
    onEnter: function () { inFigure = true; sync(); },
    onExit: function () { inFigure = false; sync(); },
  });
  sync();
})();
