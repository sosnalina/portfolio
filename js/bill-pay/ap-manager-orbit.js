(function () {
  // Motion spec v2 (case-studies/bill-pay/ap-manager-orbit-spec.md), which
  // fully replaces the v1 wobble/settle/dynamic-z-index orbit approach.
  // Anchor positions still come from the DOM itself (each item's own
  // static left/top/width/height, set in ap-manager-orbit.css) — the
  // static layout stays the single source of truth, this file only adds a
  // transform delta on top of it per frame.

  var RING_CENTER = { x: 190, y: 212.23 };

  // The 3 fixed radii every item is locked to. Radius never varies — no
  // free drift, no wobble, no settle-to-center, no lean.
  var RING_OUTER = 150;
  var RING_MIDDLE = 125;
  var RING_INNER = 100;

  // ap-manager himself is the anchor everyone else orbits around, not one
  // of the orbiting items — given his own small idle drift instead: same
  // sinusoidal wobble mechanism, applied on both axes around his own
  // static Phase 1 position rather than as a radius/angle offset from the
  // ring center. Untouched by the v2 rewrite.
  var MANAGER_IDLE_AMPLITUDE_PX = 2.5;
  var MANAGER_IDLE_PERIOD_MS = 6000;

  // Per-item table — exact values from the spec, in table order (this
  // array position is itemIndex, used only for the speed-wobble phase
  // offset). angle0 was computed from each item's actual Phase 1 static
  // position relative to RING_CENTER; ring radius from the nearest of the
  // 3 fixed radii to that same static distance.
  var ITEM_CONFIGS = [
    { name: "finance-director", ringRadius: RING_OUTER, angle0: 228.8, speed: 9.5 },
    { name: "ap-clerk", ringRadius: RING_MIDDLE, angle0: 321.5, speed: -10.6 },
    { name: "procurement-manager", ringRadius: RING_OUTER, angle0: 151.1, speed: -10.4 },
    { name: "coin-1", ringRadius: RING_MIDDLE, angle0: 13.3, speed: 11.4 },
    { name: "coin-2", ringRadius: RING_INNER, angle0: 159.7, speed: -11.5 },
    { name: "coin-3", ringRadius: RING_OUTER, angle0: 59.7, speed: 11.3 },
    { name: "hashtag", ringRadius: RING_INNER, angle0: 294.1, speed: 10.2 },
    { name: "trend-arrow", ringRadius: RING_OUTER, angle0: 179.5, speed: -9.1 },
    { name: "banknote-small", ringRadius: RING_MIDDLE, angle0: 110.7, speed: -9.3 },
    { name: "banknote-big-wrap", ringRadius: RING_OUTER, angle0: 279.1, speed: -10.2 },
    { name: "star-1", ringRadius: RING_MIDDLE, angle0: 251.4, speed: 10.7 },
    { name: "star-2", ringRadius: RING_OUTER, angle0: 343.7, speed: -11.2 },
    { name: "star-3", ringRadius: RING_OUTER, angle0: 199.7, speed: 8.7 },
    { name: "star-4", ringRadius: RING_INNER, angle0: 58.3, speed: -9.6 }
  ];

  function buildItems(container) {
    var items = [];
    for (var i = 0; i < ITEM_CONFIGS.length; i++) {
      var config = ITEM_CONFIGS[i];
      var el = container.querySelector(".ap-manager-orbit__" + config.name);
      if (!el) continue;
      items.push({
        el: el,
        // Unchanged extraction: anchorX/anchorY are the element's own
        // static (untransformed) center, read straight from the DOM —
        // offsetLeft/offsetTop/offsetWidth/offsetHeight are unaffected by
        // the transform this file applies, so this stays a one-time read.
        anchorX: el.offsetLeft + el.offsetWidth / 2,
        anchorY: el.offsetTop + el.offsetHeight / 2,
        itemIndex: i,
        ringRadius: config.ringRadius,
        angle0: config.angle0,
        speed: config.speed
      });
    }
    return items;
  }

  function renderManagerIdle(el, t) {
    var dx = MANAGER_IDLE_AMPLITUDE_PX * Math.cos((2 * Math.PI * t) / MANAGER_IDLE_PERIOD_MS);
    var dy = MANAGER_IDLE_AMPLITUDE_PX * Math.sin((2 * Math.PI * t) / MANAGER_IDLE_PERIOD_MS);
    el.style.transform = "translate(" + dx.toFixed(2) + "px, " + dy.toFixed(2) + "px)";
  }

  function render(items, t) {
    // t (same accumulated-while-visible clock as renderManagerIdle) is in
    // ms; the spec's formula deg/s speeds are written in seconds, so
    // convert once per frame here rather than per-item.
    var tSec = t / 1000;
    for (var i = 0; i < items.length; i++) {
      var item = items[i];
      var speedWobble = 1 + 0.08 * Math.sin(tSec * 0.3 + item.itemIndex * 1.7);
      var angleDeg = item.angle0 + item.speed * speedWobble * tSec;
      var angleRad = (angleDeg * Math.PI) / 180;

      var radius = item.ringRadius;
      var x = RING_CENTER.x + radius * Math.cos(angleRad);
      var y = RING_CENTER.y + radius * Math.sin(angleRad);
      item.el.style.transform = "translate(" + (x - item.anchorX).toFixed(2) + "px, " + (y - item.anchorY).toFixed(2) + "px)";
    }
  }

  function setupOrbit(container) {
    var items = buildItems(container);
    var manager = container.querySelector(".ap-manager-orbit__ap-manager");
    var ringOuter = container.querySelector(".ap-manager-orbit__ring--outer");
    var ringInner = container.querySelector(".ap-manager-orbit__ring--inner");
    var blob = container.querySelector(".ap-manager-orbit__quote-blob-wrap");
    var raf = null;
    var t = 0;
    var lastFrame = null;

    function tick(now) {
      if (lastFrame === null) lastFrame = now;
      t += now - lastFrame;
      lastFrame = now;
      render(items, t);
      if (manager) renderManagerIdle(manager, t);
      raf = requestAnimationFrame(tick);
    }

    function play() {
      if (raf !== null) return;
      lastFrame = null;
      raf = requestAnimationFrame(tick);
      if (ringOuter) ringOuter.style.animationPlayState = "running";
      if (ringInner) ringInner.style.animationPlayState = "running";
      if (blob) blob.style.animationPlayState = "running";
    }

    function pause() {
      if (raf !== null) cancelAnimationFrame(raf);
      raf = null;
      if (ringOuter) ringOuter.style.animationPlayState = "paused";
      if (ringInner) ringInner.style.animationPlayState = "paused";
      if (blob) blob.style.animationPlayState = "paused";
    }

    var observer = new IntersectionObserver(function (entries) {
      for (var i = 0; i < entries.length; i++) {
        if (entries[i].isIntersecting) play();
        else pause();
      }
    }, { threshold: 0 });
    observer.observe(container);
  }

  function setupQuoteEntrance(container) {
    var mark = container.querySelector(".ap-manager-orbit__quote-mark");
    if (!mark) return;
    var observer = new IntersectionObserver(function (entries) {
      for (var i = 0; i < entries.length; i++) {
        if (entries[i].isIntersecting) {
          container.classList.add("ap-manager-orbit--quote-visible");
          observer.disconnect();
        }
      }
    }, { threshold: 0.4 });
    observer.observe(mark);
  }

  document.addEventListener("DOMContentLoaded", function () {
    var container = document.querySelector(".ap-manager-orbit");
    if (!container) return;

    setupQuoteEntrance(container);

    var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return; // orbit items stay at their static Phase 1 position;
    // rings/blob animation is disabled via the CSS reduced-motion query.

    setupOrbit(container);
  });
})();
