(function () {
  // Chevron path from Figma component set 609:30333 ("arrows") — identical geometry
  // for both left/right and normal/hover; the 4 Figma variants collapse to one path
  // here since color is the only real state and direction is handled via CSS rotate.
  var ARROW_ICON_PATH =
    "M9 0C13.9706 0 18 4.02944 18 9C18 13.9706 13.9706 18 9 18C4.02944 18 0 13.9706 0 9C0 4.02944 4.02944 0 9 0ZM9 1C4.58172 1 1 4.58172 1 9C1 13.4183 4.58172 17 9 17C13.4183 17 17 13.4183 17 9C17 4.58172 13.4183 1 9 1ZM8.93945 5.61621C9.15159 5.36165 9.52961 5.32693 9.78418 5.53906L13.3838 8.53906C13.5206 8.65306 13.5996 8.82193 13.5996 9C13.5996 9.17807 13.5206 9.34694 13.3838 9.46094L9.78418 12.4609C9.52961 12.6731 9.15159 12.6384 8.93945 12.3838C8.72736 12.1293 8.7612 11.7512 9.01562 11.5391L11.3428 9.60059H5C4.66876 9.60059 4.4006 9.33119 4.40039 9C4.4006 8.66881 4.66876 8.40039 5 8.40039H11.3438L9.01562 6.46094C8.7612 6.24877 8.72736 5.87073 8.93945 5.61621Z";

  // Brief fallback only — used the instant a step renders, before that step's
  // iframe reports its own real duration via postMessage (see
  // handleVisualMessage). Never a value anyone hand-types per step.
  var DEFAULT_DURATION = 4000;

  // Step headline/description copy. `visual` paths are root-absolute, not
  // relative: this script is shared between walkthrough-gallery.html (repo
  // root) and case-studies/bill-pay/index.njk (two levels deep) — a relative
  // path here would only resolve correctly for one of the two host pages.
  var STEPS = [
    { headline: "Pick a single bill", description: "Start from the Unpaid tab on the Bills page", visual: "/assets/walkthrough/bill-pay/step-1.html" },
    { headline: "Set the funding source", description: "Pick the account to withdraw from", visual: "/assets/walkthrough/bill-pay/step-2.html" },
    { headline: "Set a delivery method", description: "Choose payment type, speed and withdrawal date", visual: "/assets/walkthrough/bill-pay/step-3.html" },
    { headline: "Review & schedule", description: "Submit and get your confirmation", visual: "/assets/walkthrough/bill-pay/step-4.html" }
  ];

  var state = {
    stepIndex: 0
  };

  var els = {};
  var autoAdvanceTimer = null;

  // Step 1 preload (see loadHeldStep1) — step-1.html is the only step
  // whose first frame is heavy enough (a ~320KB base64 screenshot) to
  // show a visible white box while it loads/decodes, so it's the only
  // step kept preloaded off-screen in "hold" mode, ready before the
  // gallery is ever entered, instead of loaded fresh on entry like
  // steps 2-4.
  var holdLoadCount = 0;
  var step1Ready = false;
  var step1ReadyMs = null;
  var entryPending = false;

  // Toggle-off/reflow/toggle-on — the one retrigger pattern used for every
  // per-step animation (bloom on screen+caption, counter fade-slide). A class
  // added once and left in place would only ever play on its first attach.
  function retriggerAnimation(el, className) {
    el.classList.remove(className);
    void el.offsetWidth;
    el.classList.add(className);
  }

  function retriggerProgressBar(duration) {
    // Reset must be an instant snap to 0% — no visible reverse/unwind motion.
    // transition:none + an explicit width guard against any tween of the old
    // fill amount back down to zero; forced reflow commits that instant state
    // before the transition is re-enabled and the new forward fill starts.
    els.progressFill.style.transition = "none";
    els.progressFill.style.animation = "none";
    els.progressFill.style.width = "0%";
    void els.progressFill.offsetWidth;
    els.progressFill.style.transition = "";
    els.progressFill.style.animation = "gallery-progress-fill " + duration + "ms linear forwards";
  }

  function renderStep(index) {
    var step = STEPS[index];

    els.headline.textContent = step.headline;
    els.description.textContent = step.description;
    els.counter.textContent = (index + 1) + " / " + STEPS.length;
    els.visual.src = step.visual;

    retriggerAnimation(els.caption, "gallery__caption--blooming");
    retriggerAnimation(els.counter, "gallery__counter--animating");

    // Every step's bar starts empty and fills independently — never carries
    // over or accumulates from the previous step. Start on the fallback
    // duration immediately (so nothing sits frozen) — handleVisualMessage
    // re-triggers both of these again, in place, once the new iframe's own
    // dry-run measurement reports the real duration (normally within
    // milliseconds, since the dry-run pass does no real animation work).
    retriggerProgressBar(DEFAULT_DURATION);
    scheduleAutoAdvance(DEFAULT_DURATION);
  }

  // Validates and applies a step iframe's self-reported duration. Guards
  // against: (a) messages from any origin other than our own — this page
  // and the walkthrough iframes are always same-origin, so anything else is
  // rejected outright; (b) stale messages from a step the user has already
  // navigated away from (e.g. rapid arrow clicks) — only a message whose
  // source is literally the currently-mounted iframe is trusted.
  function handleVisualMessage(event) {
    if (event.origin !== window.location.origin) return;
    if (event.source !== els.visual.contentWindow) return;

    var data = event.data;
    if (!data) return;

    // The held step 1 iframe (see loadHeldStep1) reports readiness once
    // its own dry-run measurement completes, instead of the usual
    // walkthrough-duration + auto-play. Just record it here — playback
    // only starts once the gallery has actually entered (see enterStep1
    // and onEnter below), which may be later than this message, earlier
    // (in which case entryPending is already waiting on it), or never.
    if (data.type === "walkthrough-ready" && typeof data.ms === "number") {
      step1Ready = true;
      step1ReadyMs = data.ms;
      if (entryPending) {
        entryPending = false;
        enterStep1();
      }
      return;
    }

    if (data.type !== "walkthrough-duration" || typeof data.ms !== "number") return;

    retriggerProgressBar(data.ms);
    scheduleAutoAdvance(data.ms);
  }

  function scheduleAutoAdvance(duration) {
    clearTimeout(autoAdvanceTimer);
    autoAdvanceTimer = setTimeout(function () {
      goToStep(state.stepIndex + 1);
    }, duration);
  }

  function goToStep(newIndex) {
    var total = STEPS.length;
    state.stepIndex = ((newIndex % total) + total) % total;
    renderStep(state.stepIndex);
  }

  // Stops playback and resets to step 1 when the gallery leaves the viewport.
  // Reloads step 1 in hold mode (see loadHeldStep1) rather than blanking the
  // iframe src, so it's already loaded and showing its first frame again by
  // the time the gallery is re-entered instead of going white while step
  // 1's ~320KB screenshot loads and decodes.
  function stopAndReset() {
    clearTimeout(autoAdvanceTimer);
    state.stepIndex = 0;
    entryPending = false;
    renderStep1Static();
    loadHeldStep1();
    els.progressFill.style.transition = "none";
    els.progressFill.style.animation = "none";
    els.progressFill.style.width = "0%";
  }

  // Preloads step 1 off-screen, paused on its first frame, so it's ready
  // before the gallery is entered. A fresh query param on every call
  // (rather than reassigning the same unchanged src) is required for the
  // same reason stated below on step 2-4 loads — reassigning an unchanged
  // src to a live iframe doesn't reliably reload it.
  function loadHeldStep1() {
    step1Ready = false;
    step1ReadyMs = null;
    holdLoadCount++;
    els.visual.src = STEPS[0].visual + "?hold=" + holdLoadCount;
  }

  // Step 1's headline/description/counter, shown statically while it's
  // held — no caption bloom, no counter animation, since nothing is
  // playing yet.
  function renderStep1Static() {
    var step = STEPS[0];
    els.headline.textContent = step.headline;
    els.description.textContent = step.description;
    els.counter.textContent = "1 / " + STEPS.length;
  }

  // Starts the held step 1 iframe playing in place — no src reassignment,
  // since it's already loaded and sitting on its first frame. Mirrors
  // renderStep's own caption/counter/progress-bar/auto-advance retrigger,
  // using step 1's real reported duration (step1ReadyMs) instead of
  // DEFAULT_DURATION, since it's already known by the time this runs.
  function enterStep1() {
    els.visual.contentWindow.postMessage({ type: "walkthrough-play" }, window.location.origin);

    retriggerAnimation(els.caption, "gallery__caption--blooming");
    retriggerAnimation(els.counter, "gallery__counter--animating");

    retriggerProgressBar(step1ReadyMs);
    scheduleAutoAdvance(step1ReadyMs);
  }

  function buildArrowIcon(isPrev) {
    var svgNS = "http://www.w3.org/2000/svg";
    var svg = document.createElementNS(svgNS, "svg");
    svg.setAttribute("viewBox", "0 0 18 18");
    svg.setAttribute("width", "18");
    svg.setAttribute("height", "18");
    svg.setAttribute("fill", "none");
    svg.classList.add("gallery__arrow-icon");
    if (isPrev) svg.classList.add("gallery__arrow-icon--prev");

    var path = document.createElementNS(svgNS, "path");
    path.setAttribute("d", ARROW_ICON_PATH);
    path.setAttribute("fill", "currentColor");
    svg.appendChild(path);

    return svg;
  }

  document.addEventListener("DOMContentLoaded", function () {
    els.caption = document.getElementById("gallery-caption");
    els.headline = document.getElementById("gallery-headline");
    els.description = document.getElementById("gallery-description");
    els.visual = document.getElementById("gallery-visual");
    els.progressFill = document.getElementById("gallery-progress-fill");
    els.counter = document.getElementById("gallery-counter");
    els.prevButton = document.getElementById("gallery-prev");
    els.nextButton = document.getElementById("gallery-next");
    els.gallery = document.querySelector(".gallery");

    els.prevButton.appendChild(buildArrowIcon(true));
    els.nextButton.appendChild(buildArrowIcon(false));

    els.prevButton.addEventListener("click", function () {
      goToStep(state.stepIndex - 1);
    });
    els.nextButton.addEventListener("click", function () {
      goToStep(state.stepIndex + 1);
    });

    window.addEventListener("message", handleVisualMessage);

    // Step 1 starts preloaded off-screen (see loadHeldStep1) so it's
    // already loaded and showing its first frame however soon the gallery
    // is entered, rather than going white while it loads on entry.
    renderStep1Static();
    loadHeldStep1();

    // Playback is gated by ViewportGate (js/shared/viewport-gate.js) — the
    // only thing that ever starts it, including on first page load, so
    // nothing auto-advances or fills the progress bar while the gallery is
    // out of view.
    ViewportGate.observe(els.gallery, {
      onEnter: function () {
        // state.stepIndex is always 0 here: stopAndReset() (onExit) always
        // resets it, and it starts at 0 by default, so entry always means
        // starting the held step 1, never a fresh renderStep() load.
        if (step1Ready) {
          enterStep1();
        } else {
          // A fast scroll before step 1's own load/dry-run finished —
          // handleVisualMessage's walkthrough-ready branch calls
          // enterStep1() itself the moment it arrives.
          entryPending = true;
        }
      },
      onExit: stopAndReset
    });
  });
})();
