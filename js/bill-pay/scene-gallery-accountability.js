(function () {
  // The shared progress-bar prev/next arrow (walkthrough-gallery.js /
  // scene-gallery.js / scene-gallery-2.js / scene-accordion.js each carry
  // their own literal copy of this exact constant, per this codebase's own
  // established convention) is ONE svg path combining a circular ring
  // (two concentric-circle subpaths, native bbox 0,0,18,18 — an "M...Z"
  // each) with the arrow glyph itself (a third "M...Z" subpath, native
  // bbox 4.400390148162842,5.400117874145508,9.199209213256836,
  // 7.199787139892578 — measured via SVGGeometryElement.getBBox() on that
  // subpath alone, isolated by splitting the original "d" string on its M
  // commands). This task calls for a circle-less, tightly-cropped arrow —
  // below is just that third subpath, verbatim/unmodified, with
  // ARROW_GLYPH_VIEWBOX set to its own measured bounds. This does NOT
  // touch the shared ARROW_ICON_PATH constant anywhere else — the four
  // other files above keep their own full circle+glyph copy for their
  // prev/next buttons, untouched by this file.
  var ARROW_GLYPH_PATH =
    "M8.93945 5.61621C9.15159 5.36165 9.52961 5.32693 9.78418 5.53906L13.3838 8.53906C13.5206 8.65306 13.5996 8.82193 13.5996 9C13.5996 9.17807 13.5206 9.34694 13.3838 9.46094L9.78418 12.4609C9.52961 12.6731 9.15159 12.6384 8.93945 12.3838C8.72736 12.1293 8.7612 11.7512 9.01562 11.5391L11.3428 9.60059H5C4.66876 9.60059 4.4006 9.33119 4.40039 9C4.4006 8.66881 4.66876 8.40039 5 8.40039H11.3438L9.01562 6.46094C8.7612 6.24877 8.72736 5.87073 8.93945 5.61621Z";
  var ARROW_GLYPH_VIEWBOX = "4.400390 5.400118 9.199209 7.199787";

  // Duplicated from scene-gallery-accordion.js's own SCENES per the
  // "Process_accountability" build spec — this gallery's own two states,
  // not a copy of the source's three.
  var SCENES = [
    {
      name: "Inline audit trail",
      caption: "Every decision behind a bill, who made it and why, proving the process held before money moves"
    },
    {
      name: "Review before release",
      caption: "Where bills become payments. The last checkpoint before funds move."
    }
  ];

  // TEMPORARY. The real scene document for this gallery does not exist yet, so
  // nothing on the page knows how long a state should hold. This constant is a
  // stand-in so the gallery has visible behaviour in the meantime.
  //
  // When the real scene document is plugged in, scene length drives the swap —
  // not this value. Each state's duration comes from that document's own scene
  // boundaries, exactly as the Volume_Productivity gallery works today
  // (js/bill-pay/scene-gallery-accordion.js: the timeline plays inside the
  // iframe and posts its own sceneIndex back; the rail follows). At that point
  // this constant is DELETED, not retuned. Do not treat 4000 as a design value.
  var STATE_DURATION_MS = 4000;

  var state = { sceneIndex: 0 };
  var els = { items: [], names: [] };
  var advanceTimer = null;

  // The arrow always tracks the active item's own name line, and every
  // item *before* the active one is guaranteed closed (only one item is
  // ever active at a time) — so the target only ever depends on fixed,
  // already-closed item heights, never on the active item's own
  // currently-transitioning caption height. That means the target is
  // knowable the instant the active index changes, with no dependency on
  // live (and possibly mid-transition) layout — computed here from each
  // item's real closed-state height plus the rail's own --spacing-24 gap
  // and divider height, measured once at boot rather than hardcoded, so it
  // never drifts from whatever the CSS actually renders.
  function measureRailRhythm() {
    var gap = parseFloat(
      getComputedStyle(document.documentElement).getPropertyValue("--spacing-24")
    );
    var nameHeight = els.names[0].getBoundingClientRect().height;
    var dividerHeight = els.dividers[0].getBoundingClientRect().height;
    return {
      nameHeight: nameHeight,
      period: nameHeight + gap + dividerHeight + gap
    };
  }

  function positionArrow(index) {
    var rhythm = els.railRhythm;
    var centerY = index * rhythm.period + rhythm.nameHeight / 2;
    els.arrow.style.transform = "translateY(" + (centerY - els.arrowHalfHeight) + "px)";
  }

  function setActive(index) {
    state.sceneIndex = index;
    els.items.forEach(function (item, i) {
      var isActive = i === index;
      item.classList.toggle("scene-gallery-accountability__item--active", isActive);
    });
    // Guarded: railRhythm/arrowHalfHeight aren't measured until fonts are
    // ready (see DOMContentLoaded) — the initial setActive(0) call (before
    // that resolves) only needs to toggle the caption's active class; the
    // arrow itself gets positioned once those measurements are in.
    if (els.railRhythm) positionArrow(index);
  }

  function buildArrowIcon() {
    var svgNS = "http://www.w3.org/2000/svg";
    var svg = document.createElementNS(svgNS, "svg");
    svg.setAttribute("viewBox", ARROW_GLYPH_VIEWBOX);
    svg.setAttribute("fill", "none");

    var path = document.createElementNS(svgNS, "path");
    path.setAttribute("d", ARROW_GLYPH_PATH);
    path.setAttribute("fill", "var(--primitive-black)");
    svg.appendChild(path);

    return svg;
  }

  // goToState() is the single entry point for changing the active state:
  // clears any pending timer, calls setActive(), then schedules the next
  // advance. Both the auto-advance timer and the rail's click handler go
  // through it, so there is never more than one timer pending.
  function goToState(index) {
    var total = SCENES.length;
    var target = ((index % total) + total) % total;
    if (advanceTimer) {
      clearTimeout(advanceTimer);
      advanceTimer = null;
    }
    setActive(target);
    advanceTimer = setTimeout(function () {
      goToState(target + 1);
    }, STATE_DURATION_MS);
  }

  function buildRail(listEl) {
    els.dividers = [];
    SCENES.forEach(function (scene, index) {
      var item = document.createElement("li");
      item.className = "scene-gallery-accountability__item";

      var name = document.createElement("p");
      name.className = "scene-gallery-accountability__item-name";
      name.textContent = scene.name;
      item.appendChild(name);

      var captionWrap = document.createElement("div");
      captionWrap.className = "scene-gallery-accountability__item-caption-wrap";
      var captionRow = document.createElement("div");
      captionRow.className = "scene-gallery-accountability__item-caption-row";
      var caption = document.createElement("p");
      caption.className = "scene-gallery-accountability__item-caption";
      caption.textContent = scene.caption;
      captionRow.appendChild(caption);
      captionWrap.appendChild(captionRow);
      item.appendChild(captionWrap);

      item.addEventListener("click", function () {
        goToState(index);
      });

      listEl.appendChild(item);
      els.items.push(item);
      els.names.push(name);

      var divider = document.createElement("li");
      divider.className = "scene-gallery-accountability__divider";
      divider.setAttribute("role", "presentation");
      listEl.appendChild(divider);
      els.dividers.push(divider);
    });
  }

  // Dev-time safety net for the CSS ellipsis on .scene-gallery-accountability__
  // item-name (scene-gallery-accountability.css): measures each name's real
  // single-line width — same Range technique used to verify "Built for
  // bulk runs" fits, not the unreliable scrollWidth (which reports the
  // box's own width, not the content's, whenever content is narrower than
  // the box) — against the rail's own live computed width, never a
  // hardcoded 144, so this keeps following the rail if it's ever resized.
  // Never blocks rendering; the CSS already truncates visibly if this ever
  // fires, this just surfaces it loudly instead of letting a future
  // content change ellipsize silently with nobody noticing.
  function checkRailOverflow(railEl) {
    var availableWidth = railEl.getBoundingClientRect().width;
    els.names.forEach(function (nameEl, index) {
      var range = document.createRange();
      range.selectNodeContents(nameEl);
      var naturalWidth = range.getBoundingClientRect().width;
      if (naturalWidth > availableWidth) {
        console.error(
          "scene-gallery-accountability: rail name \"" + SCENES[index].name + "\" " +
          "measures " + naturalWidth.toFixed(2) + "px, exceeding the rail's " +
          "available width of " + availableWidth.toFixed(2) + "px — it will " +
          "render truncated with an ellipsis."
        );
      }
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    var listEl = document.getElementById("scene-gallery-accountability-list");
    els.rail = listEl.closest(".scene-gallery-accountability__rail");
    els.arrow = document.getElementById("scene-gallery-accountability-arrow");

    els.arrow.appendChild(buildArrowIcon());
    buildRail(listEl);

    // Activates scene 0 and starts the auto-advance timer immediately —
    // doesn't need font metrics, so no reason to wait for them. Clicking a
    // rail item (see buildRail() above) re-enters here via the same
    // goToState() call, restarting the timer from zero for that state.
    goToState(0);

    // Literata (tokens.css) is a web font loaded async. Every measurement
    // below depends on its own final glyph metrics — the rail names'
    // rendered widths (for the overflow check) and line-height (for the
    // rail's vertical rhythm, which drives the arrow's translateY) — so
    // measuring before the swap-in reads a fallback font's different
    // metrics instead, baking a stale value into a one-shot inline style.
    // Confirmed empirically while building an earlier pass of this file
    // (when the arrow's *horizontal* position also depended on a live
    // text measurement): without a guard like this, a boot-time
    // measurement read ~8px off from the post-swap value. The arrow's
    // horizontal position is fully static CSS now (see
    // scene-gallery-accountability.css's own comment on
    // .scene-gallery-accountability__arrow) and no longer needs this, but the
    // vertical rhythm below still does. document.fonts.ready resolves
    // immediately if fonts are already loaded (e.g. a repeat view), so
    // this costs nothing in that case.
    document.fonts.ready.then(function () {
      els.arrowHalfHeight = els.arrow.getBoundingClientRect().height / 2;
      els.railRhythm = measureRailRhythm();
      checkRailOverflow(els.rail);
      positionArrow(state.sceneIndex);
    });
  });
})();
