(function () {
  // headers wait until they clear the bottom 10% of the viewport — tuned by eye, Hadar 23 Sep
  var ENTER_OFFSET_BOTTOM = 0.1;

  document.querySelectorAll(".section-header").forEach(function (el) {
    ViewportGate.observe(el, {
      enterOffsetBottom: ENTER_OFFSET_BOTTOM,
      onEnter: function () {
        el.classList.add("is-entered");
      },
      onExit: function () {}
    });
  });
})();
