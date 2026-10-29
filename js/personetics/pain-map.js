(function () {
  // Pain map (spec: briefs/personetics/pain-map.md §1.7–§1.8, §3). layout() writes every row's target
  // height, top padding and drawer height; CSS transitions do the motion. Also exports PainMap.checkOverflow().
  var root = document.getElementById("pain-map");
  if (!root) return;

  var MAIN_H = 526; // Figma `open` frame: height of main
  var MAX_OPEN = 282; // Figma `open` frame: max open content (header + quotes); keep in sync with the spec
  var CLOSED_VISUAL = 27 + 12 + 16 * 1.46 * (14 / 16); // closed text block as drawn: 59.44px
  var TITLE_ROOM_CLOSED = 411.96; // §1.6: 540 - 16.04 - 48 - 2 × 32
  var TITLE_ROOM_OPEN = 443.96;

  var track = root.querySelector(".pain-map-toggle__track");
  var tabs = Array.prototype.slice.call(root.querySelectorAll(".pain-map-toggle__tab"));
  var TAB_IDS = tabs.map(function (t) { return t.getAttribute("data-tab"); });
  var current = TAB_IDS[0];
  var rows = [];

  function panelFor(selector, id) {
    return root.querySelector(selector + '[data-tab="' + id + '"]');
  }

  // Sets every row's target height, top padding and drawer height (-1 = all closed).
  function layout(openIdx) {
    rows.forEach(function (r, i) {
      var open = i === openIdx;
      r.classList.toggle("pain-map-row--open", open);
      r.querySelector(".pain-map-row__head").setAttribute("aria-expanded", open ? "true" : "false");
    });
    var n = rows.length, qh = 0, co = 0;
    if (openIdx >= 0) {
      var r0 = rows[openIdx];
      var headOpen = r0.querySelector(".pain-map-row__head").offsetHeight;
      var natural = r0.querySelector(".pain-map-row__quotes-inner").offsetHeight;
      qh = Math.min(natural, Math.max(0, MAX_OPEN - headOpen)); // clipped past 282, never scrolls
      co = headOpen + qh;
    }
    // Same top and bottom padding on every row: whatever is left of the 526px once contents are placed.
    var contents = openIdx >= 0 ? co + (n - 1) * CLOSED_VISUAL : n * CLOSED_VISUAL;
    var pad = (MAIN_H - contents) / (2 * n);
    rows.forEach(function (r, i) {
      var open = i === openIdx;
      r.style.height = ((open ? co : CLOSED_VISUAL) + 2 * pad) + "px";
      r.querySelector(".pain-map-row__inner").style.paddingTop = pad + "px";
      r.querySelector(".pain-map-row__quotes").style.height = (open ? qh : 0) + "px";
    });
  }

  // Tab switch / load: all rows closed with no animation.
  function resetRows() {
    root.classList.add("no-anim");
    layout(-1);
    void root.offsetWidth; // commit the no-transition state before re-enabling
    root.classList.remove("no-anim");
  }

  function setTab(id) {
    current = id;
    TAB_IDS.forEach(function (t) {
      track.classList.toggle(t, t === id);
      panelFor(".pain-map__left-panel", t).hidden = t !== id;
      panelFor(".pain-map__rows", t).hidden = t !== id;
    });
    tabs.forEach(function (b) {
      b.setAttribute("aria-selected", b.getAttribute("data-tab") === id ? "true" : "false");
    });
    rows = Array.prototype.slice.call(panelFor(".pain-map__rows", id).querySelectorAll(".pain-map-row"));
    resetRows(); // after unhiding: a hidden panel measures 0
  }

  tabs.forEach(function (b) {
    b.addEventListener("click", function () { setTab(b.getAttribute("data-tab")); });
  });
  Array.prototype.forEach.call(root.querySelectorAll(".pain-map-row"), function (row) {
    // Anywhere in a closed row opens it; anywhere in the open row (header, quotes, padding) closes it.
    row.addEventListener("click", function () {
      var i = rows.indexOf(row);
      if (i < 0) return;
      layout(row.classList.contains("pain-map-row--open") ? -1 : i);
    });
  });

  setTab(current);

  // ---------- Overflow check (§1.8): returns a list of findings; [] means measured, none ----------
  function lineCount(el) {
    var range = document.createRange();
    range.selectNodeContents(el);
    var tops = [];
    Array.prototype.forEach.call(range.getClientRects(), function (r) {
      if (r.width && !tops.some(function (t) { return Math.abs(t - r.top) < 2; })) tops.push(r.top);
    });
    return tops.length;
  }

  function checkOverflow() {
    var findings = [];
    var startTab = current;
    var headline = root.querySelector(".pain-map__headline");
    if (lineCount(headline) > 1 || headline.scrollWidth > headline.clientWidth) findings.push("headline wraps or is cut");

    TAB_IDS.forEach(function (id) {
      setTab(id);
      var left = panelFor(".pain-map__left-panel", id);
      var mainBottom = root.querySelector(".pain-map__main").getBoundingClientRect().bottom;
      if (lineCount(left.querySelector(".pain-map__number")) > 1) findings.push(id + ": left number wraps");
      if (left.querySelector(".pain-map__label").getBoundingClientRect().bottom > mainBottom) {
        findings.push(id + ": left label runs past the bottom of main");
      }
      rows.forEach(function (row, i) {
        var name = id + " row " + (i + 1);
        var number = row.querySelector(".pain-map-row__number");
        var title = row.querySelector(".pain-map-row__title");
        // Number and title are laid out at the open size and nowrap: compare their scrollWidth to the room.
        var textW = row.querySelector(".pain-map-row__text").clientWidth;
        if (number.scrollWidth > textW - 2 * 32) findings.push(name + ": number wider than its room (closed)");
        if (title.scrollWidth > TITLE_ROOM_CLOSED + 0.5) findings.push(name + ": title wider than " + TITLE_ROOM_CLOSED + "px (closed)");
        layout(i);
        // scrollWidth is of the unscaled box, so the same measure holds with the row open.
        if (title.scrollWidth > TITLE_ROOM_OPEN + 0.5) findings.push(name + ": title wider than " + TITLE_ROOM_OPEN + "px (open)");
        var head = row.querySelector(".pain-map-row__head");
        var natural = row.querySelector(".pain-map-row__quotes-inner").offsetHeight;
        var content = head.offsetHeight + natural;
        if (content > MAX_OPEN) {
          findings.push(name + ": open content is " + Math.round(content) + "px, over " + MAX_OPEN + "px (clipped)");
        }
      });
      resetRows();
    });
    setTab(startTab);
    return findings;
  }

  window.PainMap = { checkOverflow: checkOverflow };
})();
