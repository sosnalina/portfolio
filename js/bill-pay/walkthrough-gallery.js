(function () {
  // Chevron path from Figma component set 609:30333 ("arrows") — identical geometry
  // for both left/right and normal/hover; the 4 Figma variants collapse to one path
  // here since color is the only real state and direction is handled via CSS rotate.
  var ARROW_ICON_PATH =
    "M9 0C13.9706 0 18 4.02944 18 9C18 13.9706 13.9706 18 9 18C4.02944 18 0 13.9706 0 9C0 4.02944 4.02944 0 9 0ZM9 1C4.58172 1 1 4.58172 1 9C1 13.4183 4.58172 17 9 17C13.4183 17 17 13.4183 17 9C17 4.58172 13.4183 1 9 1ZM8.93945 5.61621C9.15159 5.36165 9.52961 5.32693 9.78418 5.53906L13.3838 8.53906C13.5206 8.65306 13.5996 8.82193 13.5996 9C13.5996 9.17807 13.5206 9.34694 13.3838 9.46094L9.78418 12.4609C9.52961 12.6731 9.15159 12.6384 8.93945 12.3838C8.72736 12.1293 8.7612 11.7512 9.01562 11.5391L11.3428 9.60059H5C4.66876 9.60059 4.4006 9.33119 4.40039 9C4.4006 8.66881 4.66876 8.40039 5 8.40039H11.3438L9.01562 6.46094C8.7612 6.24877 8.72736 5.87073 8.93945 5.61621Z";

  var DEFAULT_DURATION = 4000;

  // Placeholder content — swap for real Bill Pay copy later, per spec.
  var STEPS = [
    { headline: "Entry point — Bills page", description: "Choose a single bill from the unpaid tab", duration: DEFAULT_DURATION },
    { headline: "Review payment details", description: "Confirm the amount and vendor info", duration: DEFAULT_DURATION },
    { headline: "Select account & date", description: "Pick where the payment comes from", duration: DEFAULT_DURATION },
    { headline: "Payment confirmed", description: "Done — the bill is on its way", duration: DEFAULT_DURATION }
  ];

  var state = {
    stepIndex: 0
  };

  var els = {};
  var autoAdvanceTimer = null;

  function pad(n) {
    return n < 10 ? "0" + n : String(n);
  }

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
    els.counter.textContent = pad(index + 1) + " / " + pad(STEPS.length);

    retriggerAnimation(els.caption, "gallery__caption--blooming");
    retriggerAnimation(els.counter, "gallery__counter--animating");

    // Every step's bar starts empty and fills independently — never carries
    // over or accumulates from the previous step.
    retriggerProgressBar(step.duration);

    scheduleAutoAdvance(step.duration);
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
    els.progressFill = document.getElementById("gallery-progress-fill");
    els.counter = document.getElementById("gallery-counter");
    els.prevButton = document.getElementById("gallery-prev");
    els.nextButton = document.getElementById("gallery-next");

    els.prevButton.appendChild(buildArrowIcon(true));
    els.nextButton.appendChild(buildArrowIcon(false));

    els.prevButton.addEventListener("click", function () {
      goToStep(state.stepIndex - 1);
    });
    els.nextButton.addEventListener("click", function () {
      goToStep(state.stepIndex + 1);
    });

    renderStep(state.stepIndex);
  });
})();
