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

  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
  var onScreen = false;
  var frame = 0;

  function tick() {
    var t = performance.now() / 1000; // t = seconds since page load
    render(t);
    renderLegs(t);
    frame = requestAnimationFrame(tick);
  }

  // Animate only while on screen and motion is allowed; reduced motion = full stop at t = 0.
  function sync() {
    if (reduced.matches) {
      cancelAnimationFrame(frame);
      frame = 0;
      render(0);
    } else if (onScreen && !frame) {
      frame = requestAnimationFrame(tick);
    } else if (!onScreen && frame) {
      cancelAnimationFrame(frame);
      frame = 0;
    }
  }

  reduced.addEventListener("change", sync);
  ViewportGate.observe(root, {
    onEnter: function () { onScreen = true; sync(); },
    onExit: function () { onScreen = false; sync(); },
  });
  sync();
})();
