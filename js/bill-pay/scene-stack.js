(function () {
  // Unlike scene-accordion.js, this gallery has no counter or arrow
  // controls — no postMessage protocol, no progress-bar retrigger. The
  // autoplay clock, click handling and viewport gating all live inside
  // the iframe document itself (assets/scene-gallery/bill-pay/
  // scenes-stack.html). This file's only job is getting the iframe's
  // src loaded, same as every other scene-gallery iframe on this page.
  document.addEventListener("DOMContentLoaded", function () {
    var visual = document.getElementById("scene-stack-visual");
    visual.src = "/assets/scene-gallery/bill-pay/scenes-stack.html";
  });
})();
