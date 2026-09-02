(function () {
  // Chevron path from Figma component set 609:30333 ("arrows") — same
  // asset Gallery 1's and Gallery 2's own parent JS reuse from
  // walkthrough-gallery.js. Button styles/states are reused
  // identically, not re-derived.
  var ARROW_ICON_PATH =
    "M9 0C13.9706 0 18 4.02944 18 9C18 13.9706 13.9706 18 9 18C4.02944 18 0 13.9706 0 9C0 4.02944 4.02944 0 9 0ZM9 1C4.58172 1 1 4.58172 1 9C1 13.4183 4.58172 17 9 17C13.4183 17 17 13.4183 17 9C17 4.58172 13.4183 1 9 1ZM8.93945 5.61621C9.15159 5.36165 9.52961 5.32693 9.78418 5.53906L13.3838 8.53906C13.5206 8.65306 13.5996 8.82193 13.5996 9C13.5996 9.17807 13.5206 9.34694 13.3838 9.46094L9.78418 12.4609C9.52961 12.6731 9.15159 12.6384 8.93945 12.3838C8.72736 12.1293 8.7612 11.7512 9.01562 11.5391L11.3428 9.60059H5C4.66876 9.60059 4.4006 9.33119 4.40039 9C4.4006 8.66881 4.66876 8.40039 5 8.40039H11.3438L9.01562 6.46094C8.7612 6.24877 8.72736 5.87073 8.93945 5.61621Z";

  // Panel 0's own span is the Quality_Of_Decisions scene's real length
  // (SCENE0_MARKS.total, computed from SCENE0_SEQUENCE) — unchanged by
  // Scene 2's redesign, since panel 0 isn't part of it. Panel 1's own
  // span is Scene 2's real fix-round-4 beat-sheet length (SCENE1_MARKS.
  // total, computed from SCENE1_SEQUENCE — 15530ms: fix round 3's own
  // 15130ms plus fix round 4's new `footerTotalBumpBack` beat (400ms),
  // giving the orange face the same "three blocks, then the whole
  // strip" whole-footer bump the green face already had (fix round 4
  // also reordered the green face's own copy to fire after its block
  // bumps, not before — no duration change from that part) — see those
  // beats' own comments in the iframe's script. Must match
  // BOUNDARIES/TOTAL_DURATION inside
  // assets/scene-gallery/bill-pay/scenes-accordion.html exactly — the
  // iframe owns the actual clock and is the one hand-synced source of
  // truth for these numbers, same no-shared-module pattern as Gallery
  // 1's and Gallery 2's own boundaries/parent-JS pairs. (Real QA once
  // caught the drift from leaving this file un-synced: with only this
  // file behind, the nav arrows sent seek targets computed from a
  // boundary the iframe's own clock had long since outgrown, so "next"
  // silently seeked to a mid-scene timestamp instead of ever reaching
  // panel 1 — keep both files' numbers moving together.)
  var SCENE_BOUNDARIES = [0, 26732];
  var TOTAL_DURATION = 42262;
  var SCENE_COUNT = SCENE_BOUNDARIES.length;

  var state = { sceneIndex: 0 };
  var els = {};

  function retriggerProgressBar(duration) {
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

  // Like Gallery 2, this gallery's caption text lives inside the
  // iframe (baked into scenes-accordion.html — both panels show fixed
  // copy), not driven by the parent — so all this needs to reflect on
  // scene change is the counter and the progress line.
  function renderScene(index) {
    state.sceneIndex = index;
    els.counter.textContent = (index + 1) + " / " + SCENE_COUNT;
    retriggerProgressBar(sceneDuration(index));
  }

  function handleVisualMessage(event) {
    if (event.origin !== window.location.origin) return;
    if (event.source !== els.visual.contentWindow) return;

    var data = event.data;
    if (!data || data.type !== "scene-accordion-state") return;
    if (typeof data.sceneIndex !== "number") return;

    if (data.sceneIndex !== state.sceneIndex) {
      renderScene(data.sceneIndex);
    }
  }

  function seekToScene(newIndex) {
    var total = SCENE_BOUNDARIES.length;
    var target = ((newIndex % total) + total) % total;
    els.visual.contentWindow.postMessage(
      { type: "scene-accordion-seek", ms: SCENE_BOUNDARIES[target] },
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
    els.visual = document.getElementById("scene-accordion-visual");
    els.progressFill = document.getElementById("scene-accordion-progress-fill");
    els.counter = document.getElementById("scene-accordion-counter");
    els.prevButton = document.getElementById("scene-accordion-prev");
    els.nextButton = document.getElementById("scene-accordion-next");

    els.prevButton.appendChild(buildArrowIcon(true));
    els.nextButton.appendChild(buildArrowIcon(false));

    // Task: "advancing never stops... clicking an arrow... jumps to
    // that panel and autoplay continues from there" — seekToScene just
    // re-anchors the iframe's own clock, same as Gallery 1/Gallery 2;
    // nothing here ever pauses anything.
    els.prevButton.addEventListener("click", function () {
      seekToScene(state.sceneIndex - 1);
    });
    els.nextButton.addEventListener("click", function () {
      seekToScene(state.sceneIndex + 1);
    });

    window.addEventListener("message", handleVisualMessage);

    els.visual.src = "/assets/scene-gallery/bill-pay/scenes-accordion.html";

    renderScene(0);
  });
})();
