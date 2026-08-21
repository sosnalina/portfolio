(function () {
  // Chevron path from Figma component set 609:30333 ("arrows") — identical
  // geometry for both left/right and normal/hover; the 4 Figma variants
  // collapse to one path here since color is the only real state and
  // direction is handled via CSS rotate. Copied verbatim from
  // js/bill-pay/walkthrough-gallery.js per spec: button styles/states are
  // reused identically, not re-derived.
  var ARROW_ICON_PATH =
    "M9 0C13.9706 0 18 4.02944 18 9C18 13.9706 13.9706 18 9 18C4.02944 18 0 13.9706 0 9C0 4.02944 4.02944 0 9 0ZM9 1C4.58172 1 1 4.58172 1 9C1 13.4183 4.58172 17 9 17C13.4183 17 17 13.4183 17 9C17 4.58172 13.4183 1 9 1ZM8.93945 5.61621C9.15159 5.36165 9.52961 5.32693 9.78418 5.53906L13.3838 8.53906C13.5206 8.65306 13.5996 8.82193 13.5996 9C13.5996 9.17807 13.5206 9.34694 13.3838 9.46094L9.78418 12.4609C9.52961 12.6731 9.15159 12.6384 8.93945 12.3838C8.72736 12.1293 8.7612 11.7512 9.01562 11.5391L11.3428 9.60059H5C4.66876 9.60059 4.4006 9.33119 4.40039 9C4.4006 8.66881 4.66876 8.40039 5 8.40039H11.3438L9.01562 6.46094C8.7612 6.24877 8.72736 5.87073 8.93945 5.61621Z";

  // Where each scene starts, in ms into the single continuous timeline
  // played by assets/scene-gallery/bill-pay/scenes.html. Must match that
  // file's BOUNDARIES/TOTAL_DURATION exactly — the two are hand-kept in
  // sync since there's no shared JS module between this page and the
  // iframe document. The iframe owns the actual clock (it plays
  // continuously and never reloads); this array is only what the parent
  // needs to know a scene's duration and to compute seek targets. Scene 1
  // (row travel) and scene 2 (bulk payment cursor demo) are both built;
  // scene 3 is still a placeholder.
  var SCENE_BOUNDARIES = [0, 6500, 15910];
  var TOTAL_DURATION = 22410;

  // Layout shell only — no scene animation, no real icons yet (per spec).
  // Placeholder copy; swap for real Bill Pay content when scenes are built.
  var SCENES = [
    { headline: "Lorem ipsum dolor sit amet", description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore." },
    { headline: "Consectetur adipiscing elit", description: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo." },
    { headline: "Duis aute irure dolor", description: "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim." }
  ];

  var state = {
    sceneIndex: 0
  };

  var els = {};

  // Toggle-off/reflow/toggle-on — the one retrigger pattern used for every
  // per-scene animation (bloom on caption, counter fade-slide). A class
  // added once and left in place would only ever play on its first attach.
  function retriggerAnimation(el, className) {
    el.classList.remove(className);
    void el.offsetWidth;
    el.classList.add(className);
  }

  function retriggerProgressBar(duration) {
    // Reset must be an instant snap to 0% — no visible reverse/unwind motion.
    els.progressFill.style.transition = "none";
    els.progressFill.style.animation = "none";
    els.progressFill.style.width = "0%";
    void els.progressFill.offsetWidth;
    els.progressFill.style.transition = "";
    els.progressFill.style.animation = "gallery-progress-fill " + duration + "ms linear forwards";
  }

  function sceneDuration(index) {
    var start = SCENE_BOUNDARIES[index];
    var end = index + 1 < SCENE_BOUNDARIES.length ? SCENE_BOUNDARIES[index + 1] : TOTAL_DURATION;
    return end - start;
  }

  function renderScene(index) {
    var scene = SCENES[index];
    state.sceneIndex = index;

    els.icon.textContent = index + 1;
    els.headline.textContent = scene.headline;
    els.description.textContent = scene.description;
    els.counter.textContent = (index + 1) + " / " + SCENES.length;

    retriggerAnimation(els.caption, "scene-gallery__caption--blooming");
    retriggerAnimation(els.counter, "gallery__counter--animating");

    retriggerProgressBar(sceneDuration(index));
  }

  // The iframe plays its timeline continuously and announces its current
  // time + scene index whenever a boundary is crossed (on load, during
  // natural playback, on looping back to 0, or right after a seek). Only
  // re-renders when the scene index actually changed — the progress line's
  // visible fill is driven by the CSS animation retriggerProgressBar
  // started here, not by re-syncing on every announcement.
  function handleVisualMessage(event) {
    if (event.origin !== window.location.origin) return;
    if (event.source !== els.visual.contentWindow) return;

    var data = event.data;
    if (!data || data.type !== "scene-gallery-state") return;
    if (typeof data.sceneIndex !== "number") return;

    if (data.sceneIndex !== state.sceneIndex) {
      renderScene(data.sceneIndex);
    }
  }

  // Prev/next seek within the one already-loaded document instead of
  // swapping iframe src — no reload, no blink. The iframe jumps its clock
  // and immediately acks with its new state via handleVisualMessage.
  function seekToScene(newIndex) {
    var total = SCENE_BOUNDARIES.length;
    var target = ((newIndex % total) + total) % total;
    els.visual.contentWindow.postMessage(
      { type: "scene-gallery-seek", ms: SCENE_BOUNDARIES[target] },
      window.location.origin
    );
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
    els.caption = document.getElementById("scene-gallery-caption");
    els.icon = document.getElementById("scene-gallery-icon");
    els.headline = document.getElementById("scene-gallery-headline");
    els.description = document.getElementById("scene-gallery-description");
    els.visual = document.getElementById("scene-gallery-visual");
    els.progressFill = document.getElementById("scene-gallery-progress-fill");
    els.counter = document.getElementById("scene-gallery-counter");
    els.prevButton = document.getElementById("scene-gallery-prev");
    els.nextButton = document.getElementById("scene-gallery-next");

    els.prevButton.appendChild(buildArrowIcon(true));
    els.nextButton.appendChild(buildArrowIcon(false));

    els.prevButton.addEventListener("click", function () {
      seekToScene(state.sceneIndex - 1);
    });
    els.nextButton.addEventListener("click", function () {
      seekToScene(state.sceneIndex + 1);
    });

    window.addEventListener("message", handleVisualMessage);

    // Loaded exactly once — the timeline plays inside this same document
    // for the whole gallery's life, seeked via postMessage, never reloaded.
    els.visual.src = "/assets/scene-gallery/bill-pay/scenes.html";

    renderScene(0);
  });
})();
