(function () {
  // Motion spec: "AP Manager Illustration — Motion Spec", phase 2 on top of
  // the static layout built against Figma node 478:8539. Orbit anchor
  // positions come from the DOM itself (each item's own static left/top/
  // width/height, set in ap-manager-orbit.css) rather than being
  // duplicated here — the static layout stays the single source of truth,
  // this file only adds a transform delta on top of it per frame.

  var RING_CENTER = { x: 190, y: 212.23 };

  // Ambient drift: linear, deg/s. ±15% variance between neighbors comes
  // from ORBIT_SPEED_MULTIPLIER below. Both guide rings (3.5/2.2deg/s,
  // see ap-manager-orbit.css) stay slower than the slowest orbiting
  // object (8 * 0.85 = 6.8deg/s minimum).
  var ORBIT_BASE_SPEED_DEG_PER_S = 8;

  // Radius breathing: ±9px (within the spec's 8-10px range), period
  // varies per object (5-9s) so neighbors don't breathe in lockstep.
  var WOBBLE_AMPLITUDE_PX = 9;

  // "One settles" — cycles through every orbit item in DOM/asset-list
  // order, one per SETTLE_INTERVAL_MS. SETTLE_DURATION_MS is split evenly
  // into pull-in and return, each eased with the spec's own
  // moving/morphing curve. Both values are the open ones the spec left
  // for this pass to set (per the animate skill: explanatory-tier motion,
  // no 300ms ceiling — an editorial pace, matching the 900ms already
  // used for the quote entrance).
  var SETTLE_INTERVAL_MS = 3600;
  var SETTLE_DURATION_MS = 1800;
  // ap-manager.png's own opaque silhouette isn't circular (checked via
  // alpha-channel sampling, 72 directions around its center): edge
  // ranges from ~45.17 rendered px (narrowest, ~20deg) to ~74.11px
  // (widest, ~345deg, the hair). Since a settling item can approach from
  // any angle — all 14 orbit items drift continuously, so which angle
  // they're at when their own turn comes is effectively arbitrary — the
  // radius has to clear the WIDEST edge, not the narrowest, or it lands
  // back inside the silhouette whenever a settle happens to land on a
  // wide-hair direction (confirmed empirically: the initial choice of
  // 50, based on the narrowest edge + a small buffer, still tested
  // opaque in 6/6 live-observed settle angles). 80 = ~74.11 + a small
  // (~6px) buffer, clearing every direction with room to still read as
  // "near his head" rather than orbiting well clear of it.
  var CLOSE_PASS_RADIUS_PX = 80;

  // Paint-order promotion: applied to whichever item is actually mid-settle
  // (s > 0 below), not merely whichever one owns the current round-robin
  // slot — the round-robin slot also covers the flat radius0+wobble tail
  // once its pull-in/return finishes, and it shouldn't stay promoted then.
  // See css/components/ap-manager-orbit.css's "Paint order" section for
  // the rest of the stacking scheme this participates in.
  var SETTLING_CLASS = "ap-manager-orbit__orbit-item--settling";

  // Hard floor: whatever drift/wobble/settle above computed, radius never
  // goes below this — applied as the very last step in render(), after
  // everything else. 100 matches .ap-manager-orbit__ring--inner's radius
  // (see ap-manager-orbit.css), so no item can visually cross inside the
  // inner guide ring or overlap the manager's face artwork. The two
  // largest orbiting items — finance-director and procurement-manager,
  // both full character faces rather than small icon-scale objects — get
  // a higher individual floor instead of the shared one, since the base
  // 100px only clears the manager for a zero-size point: it doesn't
  // allow for their own width.
  var RADIUS_FLOOR_PX = 100;

  // ap-manager himself is the anchor everyone else orbits around, not
  // one of the orbiting factors — excluded from the orbit/settle array
  // below (see buildItems' selector) and given his own small idle drift
  // instead: same sinusoidal wobble mechanism as everywhere else, just
  // applied on both axes around his own static Phase 1 position rather
  // than as a radius offset from the ring center. No settle, no radius/
  // angle math.
  var MANAGER_IDLE_AMPLITUDE_PX = 2.5;
  var MANAGER_IDLE_PERIOD_MS = 6000;

  // cubic-bezier(0.77, 0, 0.175, 1) — the spec's own moving/morphing
  // curve, reused for the pull-in and return halves of the settle.
  var EASE_IN_OUT = makeBezierEasing(0.77, 0, 0.175, 1);

  function makeBezierEasing(x1, y1, x2, y2) {
    function a(p1, p2) { return 1 - 3 * p2 + 3 * p1; }
    function b(p1, p2) { return 3 * p2 - 6 * p1; }
    function c(p1) { return 3 * p1; }
    function calc(t, p1, p2) { return ((a(p1, p2) * t + b(p1, p2)) * t + c(p1)) * t; }
    function slope(t, p1, p2) { return 3 * a(p1, p2) * t * t + 2 * b(p1, p2) * t + c(p1); }
    function solveT(x) {
      var t = x;
      for (var i = 0; i < 8; i++) {
        var s = slope(t, x1, x2);
        if (s === 0) return t;
        t -= (calc(t, x1, x2) - x) / s;
      }
      return t;
    }
    return function (x) {
      if (x <= 0) return 0;
      if (x >= 1) return 1;
      return calc(solveT(x), y1, y2);
    };
  }

  function settleProgress(localT) {
    var half = SETTLE_DURATION_MS / 2;
    if (localT < half) return EASE_IN_OUT(localT / half);
    if (localT < SETTLE_DURATION_MS) return EASE_IN_OUT(1 - (localT - half) / half);
    return 0;
  }

  function buildItems(container) {
    // :not(.ap-manager-orbit__ap-manager) — he keeps the orbit-item marker
    // class in the markup (for styling/will-change), but is deliberately
    // excluded from this array so he never enters the settle round-robin.
    // Indices are reassigned sequentially over the remaining 14 here, not
    // inherited from DOM position, so the round-robin cycles cleanly over
    // exactly the items that are actually in it.
    var els = container.querySelectorAll(".ap-manager-orbit__orbit-item:not(.ap-manager-orbit__ap-manager)");
    var items = [];
    for (var i = 0; i < els.length; i++) {
      var el = els[i];
      var anchorX = el.offsetLeft + el.offsetWidth / 2;
      var anchorY = el.offsetTop + el.offsetHeight / 2;
      var dx0 = anchorX - RING_CENTER.x;
      var dy0 = anchorY - RING_CENTER.y;
      var isLargeCharacter = el.classList.contains("ap-manager-orbit__finance-director") ||
        el.classList.contains("ap-manager-orbit__procurement-manager");
      var radiusFloor = isLargeCharacter
        ? RADIUS_FLOOR_PX + Math.max(el.offsetWidth, el.offsetHeight) / 2
        : RADIUS_FLOOR_PX;
      items.push({
        el: el,
        anchorX: anchorX,
        anchorY: anchorY,
        radius0: Math.hypot(dx0, dy0),
        angle0: Math.atan2(dy0, dx0),
        speedMultiplier: 1 + 0.15 * Math.sin(i * 2.4),
        wobblePeriodMs: (5 + (i % 5)) * 1000,
        wobblePhase: i * 1.7,
        index: i,
        radiusFloor: radiusFloor
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
    var n = items.length;
    var cycleIndex = Math.floor(t / SETTLE_INTERVAL_MS) % n;
    var localT = t % SETTLE_INTERVAL_MS;
    for (var i = 0; i < n; i++) {
      var item = items[i];
      var angleSpeedRad = ((ORBIT_BASE_SPEED_DEG_PER_S * item.speedMultiplier) * Math.PI) / 180;
      var angle = item.angle0 + angleSpeedRad * (t / 1000);
      var wobble = WOBBLE_AMPLITUDE_PX * Math.sin((2 * Math.PI * t) / item.wobblePeriodMs + item.wobblePhase);
      var radius = item.radius0 + wobble;
      var isSettling = false;
      if (item.index === cycleIndex) {
        var s = settleProgress(localT);
        radius += (CLOSE_PASS_RADIUS_PX - radius) * s;
        isSettling = s > 0;
      }
      item.el.classList.toggle(SETTLING_CLASS, isSettling);
      radius = Math.max(radius, item.radiusFloor);
      var x = RING_CENTER.x + radius * Math.cos(angle);
      var y = RING_CENTER.y + radius * Math.sin(angle);
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
