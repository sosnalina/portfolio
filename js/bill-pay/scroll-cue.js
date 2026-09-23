(function () {
  // Phase 2 (motion) — docs/specs/scroll-cue-spec.md, "Approved reference"
  // code block. Ported verbatim: only the selectors, this project's JS file
  // structure, and the hidden-starting-state setup below are new. Where
  // this differs from the spec's own prose is where the prose and the
  // reference code disagreed — the code wins, per the spec.
  //
  // This widget deliberately does not use js/shared/viewport-gate.js: its
  // trigger is a one-shot observer on the NEXT section (not this element),
  // rootMargin 0px 0px 1px 0px, fire-once-then-disconnect, with no exit
  // behaviour — none of which match ViewportGate's onEnter/onExit, 90%,
  // re-firing contract. Same documented exception as
  // js/bill-pay/ap-manager-orbit.js.

  document.addEventListener("DOMContentLoaded", function () {
    var clip = document.querySelector(".scroll-cue-clip");
    if (!clip) return;

    var pill = clip.querySelector(".scroll-cue");
    var arrow = clip.querySelector(".scroll-cue__arrow");
    if (!pill || !arrow) return;

    var section = clip.closest(".section");
    var nextSection = section ? section.nextElementSibling : null;
    if (!nextSection) return;

    // Already past on load: leave the pill in its final (Phase 1 CSS) state.
    if (nextSection.getBoundingClientRect().top <= window.innerHeight) return;

    var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduceMotion) {
      pill.style.opacity = "0";
    } else {
      pill.style.transform = "translateY(99px) scale(0.95)";
      pill.style.opacity = "0";
    }

    function playReducedMotion() {
      pill.animate([{ opacity: 0 }, { opacity: 1 }], {
        duration: 200,
        easing: "cubic-bezier(0.23,1,0.32,1)",
        fill: "both"
      });
    }

    function play() {
      var IO = "cubic-bezier(0.77,0,0.175,1)";
      var OV = "cubic-bezier(.175,.885,.32,1.275)";
      var OUT = "cubic-bezier(0.23,1,0.32,1)";
      var DUR = 0.5;
      var B = 0.25;

      function spring(t) {
        var z = 1 - B;
        var w0 = (2 * Math.PI) / DUR;
        var wd = w0 * Math.sqrt(1 - z * z);
        return 1 - Math.exp(-z * w0 * t) * (Math.cos(wd * t) + ((z * w0) / wd) * Math.sin(wd * t));
      }

      var T = DUR * 2;
      var N = 80;
      var f = [];
      for (var i = 0; i <= N; i++) {
        var x = spring((T * i) / N);
        f.push({
          transform: "translateY(" + (99 * (1 - x)).toFixed(2) + "px) scale(" + (0.95 + 0.05 * Math.min(x, 1)).toFixed(4) + ")",
          offset: i / N
        });
      }
      f[N].transform = "translateY(0px) scale(1)";

      pill.animate(f, { duration: T * 1000, easing: "linear", fill: "both" });
      pill.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 200, easing: OUT, fill: "both" });
      arrow.animate([{ transform: "translateY(-14px)" }, { transform: "translateY(0)" }], {
        duration: 350,
        delay: 300,
        easing: OV,
        fill: "both"
      });
      arrow.animate(
        [
          { transform: "translateY(0)" },
          { transform: "translateY(3px)" },
          { transform: "translateY(0)" },
          { transform: "translateY(3px)" },
          { transform: "translateY(0)" }
        ],
        { duration: 900, delay: T * 1000 + 4000, easing: IO, composite: "add" }
      );
    }

    var io = new IntersectionObserver(
      function (entries) {
        if (entries[0].isIntersecting) {
          if (reduceMotion) playReducedMotion();
          else play();
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px 1px 0px" }
    );
    io.observe(nextSection);
  });
})();
