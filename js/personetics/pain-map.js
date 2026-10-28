(function () {
  // Pain map (spec: briefs/personetics/pain-map.md §1.7–§1.8). Tab switch and row open are instant;
  // the only motion is the toggle pill's CSS transition. Also exports PainMap.checkOverflow().
  var root = document.getElementById("pain-map");
  if (!root) return;

  var OPEN_CONTENT_MAX = 282; // Figma `open` frame; keep in sync with pain-map.css
  var track = root.querySelector(".pain-map-toggle__track");
  var tabs = Array.prototype.slice.call(root.querySelectorAll(".pain-map-toggle__tab"));
  var TAB_IDS = tabs.map(function (t) { return t.getAttribute("data-tab"); });
  var current = TAB_IDS[0];

  function panelFor(selector, id) {
    return root.querySelector(selector + '[data-tab="' + id + '"]');
  }

  function closeRows(panel) {
    Array.prototype.forEach.call(panel.querySelectorAll(".pain-map-row"), function (row) {
      row.classList.remove("pain-map-row--open");
      row.querySelector(".pain-map-row__closed").setAttribute("aria-expanded", "false");
    });
  }

  function setTab(id) {
    current = id;
    TAB_IDS.forEach(function (t) {
      track.classList.toggle(t, t === id);
      var left = panelFor(".pain-map__left-panel", t);
      var rows = panelFor(".pain-map__rows", t);
      left.hidden = rows.hidden = t !== id;
      closeRows(rows); // every tab shows all rows closed when it is (re)entered
    });
    tabs.forEach(function (b) {
      b.setAttribute("aria-selected", b.getAttribute("data-tab") === id ? "true" : "false");
    });
  }

  function openRow(row, viaKeyboard) {
    closeRows(row.parentNode);
    row.classList.add("pain-map-row--open");
    row.querySelector(".pain-map-row__closed").setAttribute("aria-expanded", "true");
    if (viaKeyboard) row.querySelector(".pain-map-row__open").focus(); // the pressed button just left the layout
  }

  tabs.forEach(function (b) {
    b.addEventListener("click", function () { setTab(b.getAttribute("data-tab")); });
  });
  Array.prototype.forEach.call(root.querySelectorAll(".pain-map-row"), function (row) {
    row.querySelector(".pain-map-row__closed").addEventListener("click", function (e) {
      openRow(row, e.detail === 0);
    });
  });

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
      var rows = panelFor(".pain-map__rows", id).querySelectorAll(".pain-map-row");
      Array.prototype.forEach.call(rows, function (row, i) {
        var name = id + " row " + (i + 1);
        if (lineCount(row.querySelector(".pain-map-row__number")) > 1) findings.push(name + ": closed number wraps");
        if (lineCount(row.querySelector(".pain-map-row__title")) > 1) findings.push(name + ": closed title wraps");
        openRow(row, false);
        if (lineCount(row.querySelector(".pain-map-row__number-open")) > 1) findings.push(name + ": open number wraps");
        if (lineCount(row.querySelector(".pain-map-row__title-open")) > 1) findings.push(name + ": open title wraps");
        var open = row.querySelector(".pain-map-row__open");
        var cs = getComputedStyle(open);
        var content = open.scrollHeight - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom);
        if (content > OPEN_CONTENT_MAX) {
          findings.push(name + ": open content is " + Math.round(content) + "px, over " + OPEN_CONTENT_MAX + "px (clipped)");
        }
        closeRows(row.parentNode);
      });
    });
    setTab(startTab);
    return findings;
  }

  window.PainMap = { checkOverflow: checkOverflow };
})();
