(function () {
  // Shared ENTER/EXIT visibility gate for the Bill Pay galleries (the
  // parent walkthrough gallery and the three iframe scene documents). The
  // 90% enter threshold lives only here — every caller just wires onEnter/
  // onExit.
  //
  // ENTER fires once when either becomes true:
  //   - at least 90% of the element is visible, or
  //   - the visible slice covers at least 90% of the viewport height
  //     (for an element taller than the viewport).
  // EXIT fires once when no part of the element is visible.
  // Anything in between (partly visible, below the enter line) changes
  // nothing — whatever state the caller was already in continues.
  var ENTER_RATIO = 0.9;

  var THRESHOLDS = [];
  for (var i = 0; i <= 20; i++) THRESHOLDS.push(i / 20);

  function meetsEnterThreshold(entry) {
    if (!entry.isIntersecting) return false;
    if (entry.intersectionRatio >= ENTER_RATIO) return true;
    if (entry.rootBounds && entry.rootBounds.height > 0) {
      return entry.intersectionRect.height / entry.rootBounds.height >= ENTER_RATIO;
    }
    return false;
  }

  function observe(el, callbacks) {
    var entered = false;

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) {
            if (entered) {
              entered = false;
              callbacks.onExit();
            }
            return;
          }
          if (!entered && meetsEnterThreshold(entry)) {
            entered = true;
            callbacks.onEnter();
          }
        });
      },
      { threshold: THRESHOLDS }
    );

    observer.observe(el);
    return observer;
  }

  window.ViewportGate = { observe: observe };
})();
