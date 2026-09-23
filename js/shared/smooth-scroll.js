document.addEventListener("DOMContentLoaded", function () {
  var lenis = new Lenis({ lerp: 0.08, autoRaf: true });
  window.siteLenis = lenis;

  // Galleries are same-origin iframes, and an iframe swallows wheel events,
  // so scrolling over one would fall back to native, jumpy scroll. Forward
  // each iframe's wheel input to the page's Lenis instead. Re-hook on every
  // iframe load, because the walkthrough reloads its iframe.
  function hook(f) {
    try {
      var w = f.contentWindow;
      if (!w || w.__wheelHooked) return;
      w.__wheelHooked = true;
      w.addEventListener("wheel", function (e) {
        e.preventDefault();
        var k = e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? window.innerHeight : 1;
        lenis.scrollTo(lenis.targetScroll + e.deltaY * k);
      }, { passive: false });
    } catch (err) {}
  }
  document.querySelectorAll("iframe").forEach(function (f) {
    hook(f);
    f.addEventListener("load", function () { hook(f); });
  });
});
