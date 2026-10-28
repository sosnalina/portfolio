(function () {
  // Mesh motion for the Personetics cognitive banking diagram
  // (spec: briefs/personetics/cognitive-banking-diagram.md §2, approved reference ported verbatim).
  // BASE and EDGES are read from the rendered markup, the single source.
  var TAU = Math.PI * 2;
  var AMPLITUDE = 8; // px, locked
  var LOOP = 8 / 1.3; // s, locked

  var PARAMS = {
    insight: { pin: 4, phase: 0, rate: 1.0 },
    logic: { pin: 2, phase: TAU / 3, rate: 0.88 },
    data: { pin: 2, phase: (2 * TAU) / 3, rate: 1.13 },
  };

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

  var root = document.querySelector(".cbd");
  if (!root) return;

  var meshes = Array.prototype.map.call(root.querySelectorAll(".cbd__mesh"), function (g) {
    var dots = Array.prototype.slice.call(g.querySelectorAll(".cbd__dot"));
    var edges = Array.prototype.slice.call(g.querySelectorAll(".cbd__edge"));
    var base = dots.map(function (d) {
      return [parseFloat(d.getAttribute("cx")), parseFloat(d.getAttribute("cy"))];
    });
    return {
      params: PARAMS[g.getAttribute("data-mesh")],
      base: base,
      dots: dots,
      edges: edges,
      joins: edges.map(function (e) {
        return [parseInt(e.getAttribute("data-a"), 10), parseInt(e.getAttribute("data-b"), 10)];
      }),
    };
  });

  function render(t) {
    meshes.forEach(function (m) {
      var pos = dotPositions(m.base, m.params, t);
      m.dots.forEach(function (d, i) {
        d.setAttribute("cx", pos[i][0]);
        d.setAttribute("cy", pos[i][1]);
      });
      m.edges.forEach(function (e, i) {
        var a = pos[m.joins[i][0]];
        var b = pos[m.joins[i][1]];
        e.setAttribute("x1", a[0]);
        e.setAttribute("y1", a[1]);
        e.setAttribute("x2", b[0]);
        e.setAttribute("y2", b[1]);
      });
    });
  }

  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
  var onScreen = false;
  var frame = 0;

  function tick() {
    render(performance.now() / 1000); // t = seconds since page load
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
