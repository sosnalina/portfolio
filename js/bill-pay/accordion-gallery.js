(function () {
  var AUTO_ADVANCE_MS = 4000;

  var state = {
    openIndex: 0,
    // Flips permanently to true on the first real accordion-scene-change
    // message. Once true, scheduleAutoAdvance() no-ops forever — the scene
    // iframe's own internal timeline owns advancing from then on. The
    // placeholder scene never sends this message, so a page using only the
    // placeholder stays in 4s-timer mode indefinitely, which is the
    // intended first-build behavior.
    iframeDriven: false
  };

  var els = { items: [] };
  var autoAdvanceTimer = null;

  function openItem(index) {
    state.openIndex = index;
    els.items.forEach(function (item, i) {
      var isOpen = i === index;
      item.classList.toggle("accordion-item--open", isOpen);
      item.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });
  }

  function scheduleAutoAdvance() {
    clearTimeout(autoAdvanceTimer);
    if (state.iframeDriven) return;
    autoAdvanceTimer = setTimeout(function () {
      var total = els.items.length;
      openItem((state.openIndex + 1) % total);
      scheduleAutoAdvance();
    }, AUTO_ADVANCE_MS);
  }

  function postSceneJump(index) {
    els.visual.contentWindow.postMessage(
      { type: "accordion-jump-to-scene", index: index },
      window.location.origin
    );
  }

  // Every click posts the jump message to the iframe, even a click on the
  // already-open item (harmless there, per the communication contract) —
  // but the accordion's OWN open/close state and timer only change for a
  // click on a currently-closed item. In iframe-driven mode,
  // scheduleAutoAdvance() below still gets called but no-ops (see its own
  // guard), since the iframe's timeline owns advancing once that mode is on.
  function handleItemClick(index) {
    postSceneJump(index);
    if (index === state.openIndex) return;
    openItem(index);
    scheduleAutoAdvance();
  }

  // Validates and applies a scene-change report from the visual iframe.
  // Guards against: (a) messages from any origin other than our own; (b) a
  // message from any window other than the currently-mounted iframe; (c) a
  // malformed or out-of-range payload.
  function handleSceneMessage(event) {
    if (event.origin !== window.location.origin) return;
    if (event.source !== els.visual.contentWindow) return;

    var data = event.data;
    if (!data || data.type !== "accordion-scene-change") return;
    if (typeof data.index !== "number" || data.index < 0 || data.index > 2) return;

    if (!state.iframeDriven) {
      // TODO: switch to iframe-driven timing on first scene-change event received
      state.iframeDriven = true;
      clearTimeout(autoAdvanceTimer);
    }
    openItem(data.index);
  }

  document.addEventListener("DOMContentLoaded", function () {
    els.items = Array.prototype.slice.call(document.querySelectorAll(".accordion-item"));
    els.visual = document.getElementById("accordion-gallery-visual");

    els.items.forEach(function (item, index) {
      item.addEventListener("click", function () {
        handleItemClick(index);
      });
    });

    window.addEventListener("message", handleSceneMessage);

    openItem(0);
    scheduleAutoAdvance();
  });
})();
