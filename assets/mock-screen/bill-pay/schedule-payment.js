(function () {
  "use strict";

  var ICONS = "../../icons/bill-pay-mock/";

  /* Every icon below is assembled from the REAL exported Figma vector layers
     (downloaded, not hand-drawn), positioned with the exact inset percentages
     Figma specifies for each layer — multi-layer icons stay multi-layer. */
  function layeredIcon(size, layers) {
    var inner = layers
      .map(function (l) {
        return (
          '<span style="position:absolute;inset:' + l.inset + '"><img src="' + ICONS + l.src + '" alt="" style="display:block;width:100%;height:100%" /></span>'
        );
      })
      .join("");
    return '<span style="position:relative;display:inline-block;width:' + size + "px;height:" + size + 'px">' + inner + "</span>";
  }

  var GLYPH = {
    bank: layeredIcon(14, [
      { src: "bank-1.svg", inset: "4.36% 8.33% 8.33% 8.33%" },
      { src: "bank-2.svg", inset: "20.83% 45.83% 70.83% 45.83%" }
    ]),
    check: layeredIcon(14, [
      { src: "check-1.svg", inset: "20.81% 8.31% 20.79% 8.31%" },
      { src: "check-2.svg", inset: "37.46% 41.67% 54.17% 20.83%" },
      { src: "check-3.svg", inset: "37.54% 20.83% 54.13% 62.5%" },
      { src: "check-4.svg", inset: "52.07% 20.84% 35.38% 45.79%" }
    ]),
    info: layeredIcon(20, [
      { src: "info-circle-1.svg", inset: "45.83% 45.83% 33.33% 45.83%" },
      { src: "info-circle-2.svg", inset: "33.33% 45.82% 58.33% 45.85%" },
      { src: "info-circle-3.svg", inset: "8.33% 8.3% 8.33% 8.3%" }
    ]),
    arrow: layeredIcon(18, [{ src: "withdraw-arrives-arrow.svg", inset: "32.99% 16.69% 33.04% 16.67%" }]),
    statusCheck: '<img src="' + ICONS + 'status-check.svg" alt="" style="display:block;width:100%;height:100%" />',
    chevron: '<img src="' + ICONS + 'dropdown-chevron.svg" alt="" style="display:block;width:12px;height:6.86px" />',
    alertCircle: '<img src="' + ICONS + 'alert-circle.svg" alt="" style="display:block;width:100%;height:100%" />'
  };

  function money(n) {
    return "$" + n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  /* ---- Row data — source of truth is the batch-full Figma template
     (node 2964:601336). All 13 rows, verbatim. */
  var ROWS = [
    { id: 1, vendor: "Barnett Lawn Care", method: "bank", last4: "3456", bill: "153", due: "08/29/25", withdraw: "08/25", arrives: "08/28", fee: 1.0, amount: 650.0, action: "Manage" },
    { id: 2, vendor: "Bluebird Office Supplies", method: "check", last4: "", bill: "1764", due: "09/06/25", withdraw: "09/02", arrives: "09/05", fee: 1.0, amount: 385.0, action: "Manage" },
    { id: 3, vendor: "Barnett Lawn Care", method: "bank", last4: "3456", bill: "154", due: "09/09/25", withdraw: "09/05", arrives: "09/08", fee: 1.0, amount: 725.0, action: "Manage" },
    { id: 4, vendor: "Good Heart Catering", method: "check", last4: "", bill: "9092", due: "09/12/25", withdraw: "09/08", arrives: "09/11", fee: 1.0, amount: 1250.0, action: "Manage" },
    { id: 5, vendor: "Greenfield Solutions", method: "bank", last4: "1278", bill: "7562", due: "09/14/25", withdraw: "09/10", arrives: "09/13", fee: 1.0, amount: 1800.0, action: "Manage" },
    { id: 6, vendor: "Red Ocean Developer", method: "bank", last4: "7989", bill: "349", due: "09/15/25", withdraw: "09/11", arrives: "09/14", fee: 1.0, amount: 1500.0, action: "Manage" },
    { id: 7, vendor: "Bluebird Office Supplies", method: "check", last4: "", bill: "1789", due: "09/16/25", withdraw: "09/12", arrives: "09/15", fee: 1.0, amount: 520.0, action: "Manage" },
    { id: 8, vendor: "Greenfield Solutions", method: "bank", last4: "1278", bill: "7562", due: "09/19/25", withdraw: "09/15", arrives: "09/18", fee: 1.0, amount: 1950.0, action: "Manage" },
    { id: 9, vendor: "Good Heart Catering", method: "check", last4: "", bill: "9095", due: "09/20/25", withdraw: "09/16", arrives: "09/19", fee: 1.0, amount: 875.0, action: "Manage" },
    { id: 10, vendor: "Barnett Lawn Care", method: "bank", last4: "3456", bill: "155", due: "09/22/25", withdraw: "09/18", arrives: "09/21", fee: 1.0, amount: 580.0, action: "Manage" },
    { id: 11, vendor: "Greenfield Solutions", method: "bank", last4: "1278", bill: "7589", due: "09/24/25", withdraw: "09/20", arrives: "09/23", fee: 1.0, amount: 1750.0, action: "Manage" },
    { id: 12, vendor: "Red Ocean Developer", method: "bank", last4: "7989", bill: "354", due: "09/25/25", withdraw: "09/21", arrives: "09/24", fee: 1.0, amount: 1650.0, action: "Manage" },
    { id: 13, vendor: "Bluebird Office Supplies", method: "check", last4: "", bill: "1790", due: "09/27/25", withdraw: "09/23", arrives: "09/26", fee: 1.0, amount: 290.0, action: "Manage" }
  ];

  /* titleStrong (Avenir Heavy/800) + titleMedium (Avenir Medium, no matching
     self-hosted weight — substituted 400/Regular) reproduce Figma's real
     two-weight title run ("Standard" Heavy + " | 3-5 business days" Medium),
     confirmed via get_design_context on the drawer container (2967:603486).
     withdraw/arrives are NOT static — §6.6 spec: arrival = bill's due date
     minus 1 day (safety buffer, same across all 3 speed options), withdraw =
     arrival minus `days` business days. Computed per-drawer in
     renderRadioGroup() from the payload's real bill date(s). */
  var DELIVERY_OPTIONS = [
    { key: "standard", titleStrong: "Standard", titleMedium: " | 3-5 business days", subtitle: "Maximum safety buffer", fee: "$0.50 fee", days: 5 },
    { key: "latest-safe", titleStrong: "Fast", titleMedium: " | 1-2 business days", subtitle: "Optimal cash flow", fee: "$10.00 fee", days: 2 },
    { key: "expedited", titleStrong: "Instant", titleMedium: " | Same day", subtitle: "Latest possible", fee: "$15.00 fee", days: 0 },
    { key: "custom", titleStrong: "Custom", titleMedium: "", subtitle: "Choose specific dates and delivery speed", fee: null, days: null }
  ];

  /* Custom-view speed tabs (node 2922:165022) — a distinct 3-segment
     button-group component from the DELIVERY_OPTIONS radios above. Now
     genuinely the same 3 names ("Standard"/"Fast"/"Instant") on both —
     previously the radios read "Standard"/"Latest Safe"/"Expedited" while
     the tabs already read "Standard"/"Fast"/"Instant", an inconsistency
     fixed by renaming the radios' titleStrong only (`key` is untouched, so
     nothing that reads DELIVERY_OPTIONS[i].key elsewhere breaks). Same
     underlying business-day tiers (5/2/1) and fees ($0.50/$10/$15) as the
     matching radio, per spec §6.6 "the first three names are the same
     across both — radios are the preset picks, Custom tabs let the user
     tweak within the same speed tier." */
  var SPEED_TABS = [
    { key: "standard", label: "Standard", fee: 0.5, days: 5 },
    { key: "fast", label: "Fast", fee: 10.0, days: 2 },
    { key: "instant", label: "Instant", fee: 15.0, days: 0 }
  ];

  /* Fixed 2-month range (no navigation) — matches the mock bill data's
     due-date span (Aug 29 – Sep 27, 2025). */
  var CALENDAR_MONTHS = [
    { year: 2025, month: 7 },
    { year: 2025, month: 8 }
  ];
  var MONTH_NAMES = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  var MONTH_NAMES_SHORT = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  function pad2(n) {
    return n < 10 ? "0" + n : "" + n;
  }
  function parseMMDDYY(s) {
    var p = s.split("/");
    return new Date(2000 + parseInt(p[2], 10), parseInt(p[0], 10) - 1, parseInt(p[1], 10));
  }
  function addDays(date, n) {
    var d = new Date(date);
    d.setDate(d.getDate() + n);
    return d;
  }
  function isBusinessDay(d) {
    var day = d.getDay();
    return day !== 0 && day !== 6;
  }
  /* Steps `n` business days from `date` (n>0 forward, n<0 backward); `date`
     itself is never counted, only days actually stepped onto. */
  function addBusinessDays(date, n) {
    var d = new Date(date);
    var dir = n >= 0 ? 1 : -1;
    var remaining = Math.abs(n);
    while (remaining > 0) {
      d.setDate(d.getDate() + dir);
      if (isBusinessDay(d)) remaining--;
    }
    return d;
  }
  /* Arrival anchor must itself be a business day before counting back N
     business days for withdraw - otherwise the radio (backward) and Custom
     tab (forward) computations stop being inverses of each other. Rolls
     back to the closest earlier weekday; no-op if already a business day. */
  function normalizeArrival(d) {
    var r = new Date(d);
    while (!isBusinessDay(r)) {
      r.setDate(r.getDate() - 1);
    }
    return r;
  }
  function fmtMD(d) {
    return pad2(d.getMonth() + 1) + "/" + pad2(d.getDate());
  }
  function fmtLong(d) {
    return MONTH_NAMES_SHORT[d.getMonth()] + " " + d.getDate() + ", " + d.getFullYear();
  }
  /* Batch drawer scope = the single clicked bill. Bulk drawer scope = every
     bill under that vendor. Deduped + sorted per §6.6 collision rule (two
     bills sharing a due date collapse to one calendar mark). */
  function getDrawerDueDates(payload) {
    var rows = payload.rows ? payload.rows : [payload];
    var seen = {};
    var out = [];
    rows.forEach(function (r) {
      var d = parseMMDDYY(r.due);
      var k = d.getTime();
      if (!seen[k]) {
        seen[k] = true;
        out.push(d);
      }
    });
    out.sort(function (a, b) {
      return a - b;
    });
    return out;
  }

  /* Table rows derive dates from the same engine the drawer uses (Standard
     tier, 5 business days = DELIVERY_OPTIONS[0]/SPEED_TABS[0]), instead of
     storing them, so the two surfaces cannot drift apart. `payload` is
     either a single bill row or a bulk vendor group - same shape
     getDrawerDueDates() already accepts. */
  function computeStandardDates(payload) {
    var dueDates = getDrawerDueDates(payload);
    var arrival = normalizeArrival(addDays(dueDates[0], -1));
    var withdraw = addBusinessDays(arrival, -5);
    return { withdraw: withdraw, arrival: arrival };
  }

  function methodLabel(row) {
    if (row.method === "bank") return "Bank payment (ACH)..." + row.last4;
    return "Check";
  }

  /* Good Heart Catering is missing delivery details (node 3092:155767) —
     its payment-method line (batch row and bulk vendor-summary row alike)
     is replaced with the same orange alert icon used by the footer's
     Vendors stat below, at 12px rather than the bank/check icons' 14px
     (reads better at that size — spec §2). Both the alert markup and its
     resolved counterpart ("Bank payment (ACH)" + bank icon, per spec §4)
     are built into the DOM together and toggled via data-vendor-state —
     this mock has no click behavior anywhere (scenes drive everything),
     so this only makes the resolved state available for a future scene to
     switch to; the mock's own default is the alert state. */
  var ALERTED_VENDOR = "Good Heart Catering";

  function renderVendorMethod(vendorName, method, last4) {
    if (vendorName === ALERTED_VENDOR) {
      return (
        '<div class="bp-vendor__method" data-vendor-state="alert">' +
          '<span class="bp-vendor__method-icon bp-vendor__method-icon--alert" data-state="alert">' + GLYPH.alertCircle + "</span>" +
          '<p class="bp-vendor__method-text" data-state="alert">Add delivery details</p>' +
          '<span class="bp-vendor__method-icon" data-state="resolved">' + GLYPH.bank + "</span>" +
          '<p class="bp-vendor__method-text" data-state="resolved">Bank payment (ACH)</p>' +
        "</div>"
      );
    }
    return (
      '<div class="bp-vendor__method">' +
        '<span class="bp-vendor__method-icon">' + GLYPH[method] + "</span>" +
        '<p class="bp-vendor__method-text">' + methodLabel({ method: method, last4: last4 }) + "</p>" +
      "</div>"
    );
  }

  function vendorGroups() {
    var order = [];
    var map = {};
    ROWS.forEach(function (r) {
      if (!map[r.vendor]) {
        map[r.vendor] = { vendor: r.vendor, method: r.method, last4: r.last4, rows: [] };
        order.push(r.vendor);
      }
      map[r.vendor].rows.push(r);
    });
    return order.map(function (v) {
      var g = map[v];
      g.total = g.rows.reduce(function (s, r) { return s + r.amount; }, 0);
      return g;
    });
  }

  var state = {
    mode: "batch", // batch | bulk
    narrow: false,
    expanded: {}, // vendor -> bool
    drawer: {
      open: false,
      row: null,
      revealed: false, // whether the selected row's own state (card, chevron, expand) has resolved - see openDrawer()/closeDrawer()
      view: "default", // view: default | bank-details
      delivery: "radios", // delivery: radios | custom
      selectedRadio: "standard",
      calendar: { tab: "standard", withdraw: null, arrival: null },
      billMeta: "", // current subtitle text for the "default" step, restored on transition back
      transitioning: false, // guards swapDrawerContent() against re-entrant clicks mid-transition
      subtitleSwapTimer: null
    }
  };

  var els = {};

  function q(sel) { return document.querySelector(sel); }

  function rowCellsCommon(narrowAttr) {
    return narrowAttr ? " data-narrow-hide" : "";
  }

  function renderActionCell(action, isSub) {
    if (state.narrow) {
      return (
        '<div class="bp-cell bp-cell--action" data-action="' + action + '">' +
        '<img class="bp-action-icon" src="' + ICONS + "narrow-action.svg" + '" alt="" />' +
        "</div>"
      );
    }
    return (
      '<div class="bp-cell bp-cell--action" data-action="' + action + '">' +
      '<span class="bp-action-text">' + action + "</span>" +
      "</div>"
    );
  }

  function renderBatchRow(row) {
    var narrowHideSpeed = rowCellsCommon(true);
    var dates = computeStandardDates(row);
    return (
      '<div class="bp-row" data-row-id="' + row.id + '">' +
        '<div class="bp-cell bp-cell--vendor">' +
          '<div class="bp-vendor">' +
            '<div class="bp-vendor__body">' +
              '<p class="bp-vendor__name">' + row.vendor + "</p>" +
              renderVendorMethod(row.vendor, row.method, row.last4) +
            "</div>" +
          "</div>" +
        "</div>" +
        '<div class="bp-cell bp-cell--bill"><span>' + row.bill + "</span></div>" +
        '<div class="bp-cell bp-cell--status"><span class="bp-status__check">' + GLYPH.statusCheck + '</span><span class="bp-status-text">Approved</span></div>' +
        '<div class="bp-cell bp-cell--due"><span>' + row.due + "</span></div>" +
        '<div class="bp-cell bp-cell--speed"' + narrowHideSpeed + ">" +
          '<div class="bp-speed__top"><p class="bp-speed__label">Standard</p><span class="bp-badge"><span>On time</span></span></div>' +
          '<div class="bp-speed__meta"><span>Withdraw ' + fmtMD(dates.withdraw) + "</span><span style=\"display:inline-flex\">" + GLYPH.arrow + "</span><span>Arrives " + fmtMD(dates.arrival) + "</span></div>" +
        "</div>" +
        '<div class="bp-cell bp-cell--fee"' + narrowHideSpeed + '><div class="bp-fee"><span>' + money(row.fee) + "</span><span>" + GLYPH.info + "</span></div></div>" +
        '<div class="bp-cell bp-cell--balance"><span>' + money(row.amount) + "</span></div>" +
        '<div class="bp-cell bp-cell--amount"><div class="bp-amount-field"><span>' + money(row.amount) + "</span></div></div>" +
        renderActionCell(row.action) +
      "</div>"
    );
  }

  /* Spec correction: bulk sub-rows do NOT have a Manage/Review action —
     only the vendor summary row does. But the action cell isn't empty
     either: re-pulling all 4 Figma sub-row variants (Component 25/26/27/28)
     shows each ends in a "T Action>Mangae" cell whose content is the
     shared "close" icon component (node I2913:147954;141:141702), not
     text — present in BOTH bulk-full (2913:147101) and bulk-narrow
     (2926:18524), so it's not a narrow-mode-only affordance. That icon is
     already in this codebase as narrow-action.svg (currently only used by
     renderActionCell's narrow branch below) — its viewBox (14.0445 x
     14.0552) matches this exact Figma icon box (24px, inset
     20.63/20.67/20.81/20.81%) to the sub-pixel, confirming it's the same
     asset, not the larger/darker close.svg used for header/drawer close. */
  function renderSubRow(row) {
    return (
      '<div class="bp-row bp-row--sub" data-row-id="' + row.id + '">' +
        '<div class="bp-cell bp-cell--vendor" style="opacity:0"></div>' +
        '<div class="bp-cell bp-cell--bill"><span>' + row.bill + "</span></div>" +
        '<div class="bp-cell bp-cell--status"><span class="bp-status__check">' + GLYPH.statusCheck + '</span><span class="bp-status-text">Approved</span></div>' +
        '<div class="bp-cell bp-cell--due"><span>' + row.due + "</span></div>" +
        '<div class="bp-cell bp-cell--speed" data-narrow-hide style="opacity:0"></div>' +
        '<div class="bp-cell bp-cell--fee" data-narrow-hide style="opacity:0"></div>' +
        '<div class="bp-cell bp-cell--balance"><span>' + money(row.amount) + "</span></div>" +
        '<div class="bp-cell bp-cell--amount"><div class="bp-amount-field"><span>' + money(row.amount) + "</span></div></div>" +
        '<div class="bp-cell bp-cell--action"><img class="bp-action-icon" src="' + ICONS + 'narrow-action.svg" alt="" /></div>' +
      "</div>"
    );
  }

  function renderVendorRow(group) {
    var expanded = !!state.expanded[group.vendor];
    var narrowHideSpeed = rowCellsCommon(true);
    // The vendor row the open drawer refers to, AND whose own selected
    // state has resolved (state.drawer.revealed - see openDrawer()'s
    // reveal, deferred until the drawer's own opening motion settles).
    // Its group is forced open and can't be collapsed from here while
    // selected, so its chevron is hidden via CSS (opacity+visibility, not
    // display - keeps its space reserved so the vendor name doesn't
    // shift; see .bp-vendor__chevron[data-selected]). Gating on `revealed`
    // (not just `open`) matters for renderRows() calls that happen WHILE
    // already revealed (setMode(), etc.) - those should render the
    // already-resolved end state directly, not the pre-reveal one.
    var isSelected = !!(state.drawer.open && state.drawer.revealed && state.drawer.row && state.drawer.row.vendor === group.vendor);
    // Aggregate values for the vendor row so bulk-mode vendor summaries
    // show the same columns as batch rows (speed meta, open balance).
    // Fee is NOT summed: one vendor = one payment = one $1.00 fee,
    // regardless of how many bills are aggregated under it.
    var feeTotal = 1.0;
    var dates = computeStandardDates(group);

    var vendorRowHtml =
      '<div class="bp-row" data-vendor-row="' + group.vendor + '">' +
        '<div class="bp-cell bp-cell--vendor">' +
          '<div class="bp-vendor">' +
            '<button class="bp-vendor__chevron" type="button" data-chevron data-expanded="' + expanded + '"' + (isSelected ? ' data-selected="true"' : "") + ' aria-label="Expand vendor">' +
              '<img src="' + ICONS + 'dropdown-chevron.svg" alt="" />' +
            "</button>" +
            '<div class="bp-vendor__body">' +
              '<p class="bp-vendor__name">' + group.vendor + "</p>" +
              renderVendorMethod(group.vendor, group.method, group.last4) +
            "</div>" +
          "</div>" +
        "</div>" +
        '<div class="bp-cell bp-cell--bill"><span>' + group.rows.length + "</span></div>" +
        '<div class="bp-cell bp-cell--status" style="opacity:0"></div>' +
        '<div class="bp-cell bp-cell--due" style="opacity:0"></div>' +
        '<div class="bp-cell bp-cell--speed"' + narrowHideSpeed + ">" +
          '<div class="bp-speed__top"><p class="bp-speed__label">Standard</p><span class="bp-badge"><span>On time</span></span></div>' +
          '<div class="bp-speed__meta"><span>Withdraw ' + fmtMD(dates.withdraw) + "</span><span style=\"display:inline-flex\">" + GLYPH.arrow + "</span><span>Arrives " + fmtMD(dates.arrival) + "</span></div>" +
        "</div>" +
        '<div class="bp-cell bp-cell--fee"' + narrowHideSpeed + '><div class="bp-fee"><span>' + money(feeTotal) + "</span><span>" + GLYPH.info + "</span></div></div>" +
        '<div class="bp-cell bp-cell--balance"><span>' + money(group.total) + "</span></div>" +
        /* Amount is an aggregate (sum of the group's bill sub-rows), not a
           directly editable value - plain text like Open balance beside
           it, not the sub-rows' .bp-amount-field input look. */
        '<div class="bp-cell bp-cell--amount"><span>' + money(group.total) + "</span></div>" +
        /* Confirmed against Figma: the vendor summary row's Manage action
           is present in bulk-full (node 2207:169585, "T Action>Mangae"
           cell renders "Manage") but structurally absent — no action cell
           at all, not even collapsed — in bulk-narrow (node 2926:18517's
           "bp-Table row" instances end at the Amount cell). */
        (state.narrow ? "" : renderActionCell("Manage")) +
      "</div>";
    var expandWrapHtml =
      '<div class="bp-expand-wrap" data-expand-wrap="' + group.vendor + '" style="overflow:hidden;height:' + (expanded ? "auto" : "0") + ";margin-top:" + (expanded ? "14px" : "0") + '">' +
        '<div class="bp-expand-inner" style="display:flex;flex-direction:column;gap:14px">' + (expanded ? group.rows.map(renderSubRow).join("") : "") + "</div>" +
      "</div>";
    return '<div class="bp-vendor-group">' + vendorRowHtml + expandWrapHtml + "</div>";
  }

  function renderRows() {
    var scroll = els.rowsScroll;
    if (state.mode === "batch") {
      scroll.innerHTML = ROWS.map(renderBatchRow).join("");
    } else {
      scroll.innerHTML = vendorGroups().map(renderVendorRow).join("");
    }
    bindRowEvents();
  }

  /* Selected-row card and drawer selection both key off the drawer's
     payload shape, not state.mode: a batch payload is a single ROWS entry
     (has .bill, rendered as .bp-row[data-row-id]); a bulk payload is a
     vendor group (no .bill, has .rows, rendered as .bp-row[data-vendor-row]).
     Same distinguishing field revealSelectedRow()/openDrawer() already use
     (see "!payload.bill" below and in openDrawer()). One lookup for both
     modes - the card mechanism itself doesn't branch on mode anywhere else. */
  function selectedRowEl(payload) {
    return payload.bill
      ? els.rowsScroll.querySelector('.bp-row[data-row-id="' + payload.id + '"]')
      : els.rowsScroll.querySelector('.bp-row[data-vendor-row="' + cssEscape(payload.vendor) + '"]');
  }

  /* Keeps the selected-row card (see .bp-row-card-layer / .bp-row-selected-
     card in schedule-payment.html) locked to its row's live position, and
     toggles its visibility. Re-run whenever anything could move that row
     OR change whether it should be visible: selection changes (openDrawer/
     closeDrawer/setMode), scrolling, window resize (the whole mock
     rescales - see applyScale()), and another row's expand/collapse
     finishing (which can shift this row up/down if it sits below the one
     that (dis)expanded).

     Position and visibility are separate concerns on purpose. The card's
     position is kept current the moment a row is known to be selected
     (state.drawer.open + .row), even before state.drawer.revealed flips
     true - so when it does become visible (see openDrawer()'s deferred
     reveal), it fades in already in the right place instead of jumping
     there. Visibility (the [data-visible] attribute, opacity-transitioned
     in CSS) tracks state.drawer.revealed, which openDrawer()/closeDrawer()
     control directly to sequence the reveal against the drawer's own
     motion - see those functions for why.

     Works identically in batch and bulk (see selectedRowEl() above) - a
     mode switch while a drawer is open re-renders the row list for the
     NEW mode (setMode() calls renderRows() then this), so a stale
     drawer.row from the old mode simply won't match any element in the
     new DOM and the card hides via the !rowEl branch below, rather than
     needing its own mode-change handling.

     Math mirrors scenes.html's nativeRect(): getBoundingClientRect()
     returns already-scaled (visual) pixels, but this card's own top/left/
     width are read by the browser BEFORE .scaler's transform is applied
     (the card lives inside that same scaled subtree), so the raw pixel
     difference has to be divided by the current scale factor before being
     written back as a plain CSS px value - otherwise the position would be
     right at 100% width and increasingly wrong at any other size. */
  function updateSelectedRowCard() {
    var hasSelection = state.drawer.open && !!state.drawer.row;
    var rowEl = hasSelection ? selectedRowEl(state.drawer.row) : null;
    var revealed = !!(rowEl && state.drawer.revealed);

    /* Mirrors the card's own [data-visible] onto the row itself, so
       .bp-cell--vendor's 12px inset (below) shows exactly while the card
       is visible - not for the whole open-drawer window, same as the
       card. Cleared from any PREVIOUS row explicitly rather than relying
       on renderRows() to wipe it: this function also runs from scroll/
       resize/expand-collapse, none of which re-render the rows, so a
       stale flag from a row that's no longer selected would otherwise
       stick until the next full render. */
    var prevSelectedRow = els.rowsScroll.querySelector('.bp-row[data-selected="true"]');
    if (prevSelectedRow && prevSelectedRow !== rowEl) {
      prevSelectedRow.removeAttribute("data-selected");
    }
    if (rowEl) {
      if (revealed) {
        rowEl.setAttribute("data-selected", "true");
      } else {
        rowEl.removeAttribute("data-selected");
      }
    }

    if (!rowEl) {
      els.rowCard.removeAttribute("data-visible");
      return;
    }
    var scale = document.documentElement.clientWidth / 1440;
    var rowRect = rowEl.getBoundingClientRect();
    var layerRect = els.rowCardLayer.getBoundingClientRect();
    var nativeTop = (rowRect.top - layerRect.top) / scale;
    var nativeLeft = (rowRect.left - layerRect.left) / scale;
    var nativeWidth = rowRect.width / scale;
    // +11 optically centers the fixed 68px card on the row's 60px content
    // band (content sits 15px down from the row's own top, flush to its
    // bottom) - identical geometry to the row-relative version this
    // overlay replaces.
    els.rowCard.style.top = nativeTop + 11 + "px";
    els.rowCard.style.left = nativeLeft + "px";
    els.rowCard.style.width = nativeWidth + "px";
    if (revealed) {
      els.rowCard.setAttribute("data-visible", "true");
    } else {
      els.rowCard.removeAttribute("data-visible");
    }
  }

  function bindRowEvents() {
    var chevrons = els.rowsScroll.querySelectorAll("[data-chevron]");
    for (var i = 0; i < chevrons.length; i++) {
      chevrons[i].addEventListener("click", onChevronClick);
    }
    var actions = els.rowsScroll.querySelectorAll(".bp-cell--action");
    for (var j = 0; j < actions.length; j++) {
      actions[j].addEventListener("click", onActionClick);
    }
  }

  /* ---- §7.2 bulk expand/collapse ---- */
  /* Animates a group open: measures its natural height, then transitions
     0 -> natural (--bp-ease-expand, duration scaled to content so short
     and long lists both feel proportionate - see the Math.max/min below).
     Shared by two callers: a manual chevron click (onChevronClick), and
     openDrawer()'s automatic expand-on-select (see revealSelectedRow()) -
     both need the identical animation, just triggered differently, so
     this is the one place it's implemented rather than two. */
  function expandGroupAnimated(vendor) {
    var wrap = els.rowsScroll.querySelector('[data-expand-wrap="' + cssEscape(vendor) + '"]');
    var btn = els.rowsScroll.querySelector('.bp-row[data-vendor-row="' + cssEscape(vendor) + '"] [data-chevron]');
    if (!wrap) return;
    var group = vendorGroups().filter(function (g) { return g.vendor === vendor; })[0];
    wrap.querySelector(".bp-expand-inner").innerHTML = group.rows.map(renderSubRow).join("");
    var natural = wrap.querySelector(".bp-expand-inner").scrollHeight;
    var duration = Math.max(225, Math.min(15 * natural, 375));
    wrap.style.height = "0px";
    wrap.style.marginTop = "14px";
    if (btn) {
      btn.setAttribute("data-expanded", "true");
      btn.removeAttribute("data-collapsing");
      btn.style.setProperty("--bp-expand-duration", duration + "ms");
    }
    wrap.style.transition = "height " + duration + "ms var(--bp-ease-expand)";
    requestAnimationFrame(function () {
      wrap.style.height = natural + "px";
    });
    state.expanded[vendor] = true;
    var onEnd = function () {
      wrap.style.height = "auto";
      wrap.removeEventListener("transitionend", onEnd);
      // This expand can shift a DIFFERENT (selected) row up/down if it
      // sits below `vendor` in the list.
      updateSelectedRowCard();
    };
    wrap.addEventListener("transitionend", onEnd);
  }

  function onChevronClick(e) {
    var btn = e.currentTarget;
    var row = btn.closest(".bp-row");
    var vendor = row.getAttribute("data-vendor-row");
    var wrap = els.rowsScroll.querySelector('[data-expand-wrap="' + cssEscape(vendor) + '"]');
    var expanded = !!state.expanded[vendor];

    if (!expanded) {
      expandGroupAnimated(vendor);
    } else {
      var current = wrap.scrollHeight;
      var dur = Math.max(225, Math.min(15 * current, 375));
      wrap.style.height = current + "px";
      btn.setAttribute("data-collapsing", "true");
      btn.style.setProperty("--bp-expand-duration", dur + "ms");
      wrap.style.transition = "height " + dur + "ms var(--bp-ease-collapse)";
      requestAnimationFrame(function () {
        wrap.style.height = "0px";
      });
      state.expanded[vendor] = false;
      btn.setAttribute("data-expanded", "false");
      var onEnd2 = function () {
        // unmount content AFTER collapse completes
        wrap.querySelector(".bp-expand-inner").innerHTML = "";
        wrap.style.marginTop = "0";
        btn.removeAttribute("data-collapsing");
        wrap.removeEventListener("transitionend", onEnd2);
        updateSelectedRowCard();
      };
      wrap.addEventListener("transitionend", onEnd2);
    }
  }

  function cssEscape(s) {
    return s.replace(/["\\]/g, "\\$&");
  }

  function onActionClick(e) {
    var cell = e.currentTarget;
    var row = cell.closest(".bp-row");
    var rowId = row.getAttribute("data-row-id");
    var vendorName = row.getAttribute("data-vendor-row");
    var payload;
    if (rowId) {
      payload = ROWS.filter(function (r) { return String(r.id) === rowId; })[0];
    } else if (vendorName) {
      payload = vendorGroups().filter(function (g) { return g.vendor === vendorName; })[0];
    }
    openDrawer(payload);
  }

  /* Resolves the row's own selected state once the drawer's opening
     motion has finished (see openDrawer()'s transitionend listener) - the
     card, the chevron-hide, and (conditionally) the group expand all
     start together at this one moment, rather than each waiting on the
     others. They're independent visual facts about the same row ("this
     one", "can't be toggled from here", "already showing its bills") -
     staggering them further would read as choreography, not response.
     alreadyExpanded is measured back in openDrawer() BEFORE this fires,
     so a group that was already open stays exactly as it was - no expand
     animation runs for it. Batch payloads have no chevron to hide (only
     vendor rows carry .bp-vendor__chevron), so that step is a harmless
     no-op for them - but the row lookup itself must still succeed via
     selectedRowEl() or updateSelectedRowCard() below never runs and the
     card never reveals. */
  function revealSelectedRow(payload, alreadyExpanded) {
    var rowEl = selectedRowEl(payload);
    if (!rowEl) return;
    var chevron = rowEl.querySelector(".bp-vendor__chevron");
    if (chevron) chevron.setAttribute("data-selected", "true");
    updateSelectedRowCard();
    if (!payload.bill && !alreadyExpanded) {
      expandGroupAnimated(payload.vendor);
    }
  }

  /* ---- §7.3 drawer + column collapse (unified motion) ---- */
  function openDrawer(payload) {
    state.drawer.open = true;
    state.drawer.row = payload;
    state.drawer.revealed = false;
    state.drawer.view = "default";
    // §6.6: every drawer opens fresh with the 4 radios, Standard selected.
    state.drawer.delivery = "radios";
    state.drawer.selectedRadio = "standard";
    state.drawer.calendar = { tab: "standard", withdraw: null, arrival: null };
    state.narrow = true;

    /* Drawer head (vendor name + subtitle + close/back) is a persistent
       block — see the "Drawer head" markup in schedule-payment.html and
       swapDrawerContent() below — so it never gets destroyed/recreated
       across steps within one drawer session. Every fresh open still
       needs its own vendor name + subtitle text and a hard reset to the
       non-drilldown resting state (no transition — this is a cold open,
       not a step transition). "Payment No.XXXXXX" is gone from the
       updated layout (node 3068:151634) — the bulk case reads "2 Bills •
       Total Amount:" there. The batch (single-bill) wording isn't shown
       in that node (only a bulk vendor drawer was updated); "Bill
       no.153 • Total Amount:" mechanically mirrors the existing
       bill-no/bills-count split with the new suffix — flagged in the
       build report as an inference, not a directly-read Figma value. */
    state.drawer.billMeta = payload.bill
      ? "Bill no." + payload.bill + " • Total Amount:"
      : payload.rows.length + " Bills • Total Amount:";
    // Measured here, before anything changes it, so revealSelectedRow()
    // (fired later, after the drawer settles) knows whether to animate
    // the group open or leave it exactly as it already was.
    var alreadyExpanded = !payload.bill && !!state.expanded[payload.vendor];
    els.drawerHead.classList.remove("bp-drawer__head--drilldown");
    els.drawerVendorName.textContent = payload.vendor;
    els.drawerSubtitle.textContent = state.drawer.billMeta;
    els.drawerFooter.style.display = "none";

    els.screen.classList.add("bp-screen--narrow");
    renderDrawer();
    requestAnimationFrame(function () {
      els.screen.classList.add("bp-screen--drawer-open");
    });
    // Rows render now in their PRE-selection state (state.drawer.revealed
    // is still false - renderVendorRow's isSelected gate) - the chevron
    // is visible, and an unexpanded group stays unexpanded, until the
    // reveal below fires.
    renderRows();
    updateSelectedRowCard();

    /* The drawer opens first; the row's own selected state resolves only
       once that motion has actually finished - not at the same moment,
       and not on a guessed delay. Listening for the drawer's own
       transitionend (rather than duplicating its 225ms) means this stays
       correct even if that duration ever changes. Guarded against the
       drawer having already closed, or moved on to a different row,
       before its opening transition finished (fast repeated clicks). */
    var onDrawerOpenEnd = function () {
      els.drawer.removeEventListener("transitionend", onDrawerOpenEnd);
      if (!state.drawer.open || !state.drawer.row || state.drawer.row.vendor !== payload.vendor) return;
      state.drawer.revealed = true;
      revealSelectedRow(payload, alreadyExpanded);
    };
    els.drawer.addEventListener("transitionend", onDrawerOpenEnd);
  }

  /* Closing doesn't replay the opening sequence backwards. On open, the
     row's own state deliberately waits for the drawer to finish arriving
     before it resolves (see openDrawer()) - but gating the reverse the
     same way would make the row block its own exit, sitting there
     un-reverting while the drawer that referred to it is already most of
     the way gone. An exit should read as everything retreating at once,
     not a graceful multi-stage unwind, so the card fade-out and chevron
     fade-back-in start immediately here, concurrent with the drawer's own
     195ms close-slide, rather than waiting on it. The group's expanded
     state is left alone either way - it was never tied to selection in
     the first place, only its entry into that state was (see
     revealSelectedRow()); collapsing it back is a separate, manual action
     via the now-visible-again chevron. */
  function closeDrawer() {
    state.drawer.revealed = false;
    if (state.drawer.row) {
      var rowEl = selectedRowEl(state.drawer.row);
      var chevron = rowEl ? rowEl.querySelector(".bp-vendor__chevron") : null;
      if (chevron) chevron.removeAttribute("data-selected");
    }
    updateSelectedRowCard();

    els.screen.classList.remove("bp-screen--drawer-open");
    var onEnd = function () {
      els.screen.classList.remove("bp-screen--narrow");
      state.narrow = false;
      state.drawer.open = false;
      els.drawer.removeEventListener("transitionend", onEnd);
      renderRows();
      updateSelectedRowCard();
    };
    els.drawer.addEventListener("transitionend", onEnd);
  }

  function renderDrawer() {
    if (state.drawer.view === "default") {
      renderDrawerDefault();
    } else {
      renderDrawerBankDetails();
    }
  }

  /* ---- \u00a76.6 Custom payment delivery flow \u2014 calendar build ---- */

  /* 6-row (42-cell) month grid, Sunday-first, with real adjacent-month
     padding dates (not blank) \u2014 standard calendar construction. */
  function buildMonthGrid(year, month) {
    var first = new Date(year, month, 1);
    var gridStart = addDays(first, -first.getDay());
    var cells = [];
    for (var i = 0; i < 42; i++) {
      var d = addDays(gridStart, i);
      cells.push({ date: d, col: i % 7, inMonth: d.getMonth() === month });
    }
    return cells;
  }

  /* Three orthogonal concerns per cell, computed independently:
     - mark: what's drawn INSIDE the cell (start/end/due marker, plain
       number, or nothing) \u2014 priority highest-first: adjacent-month padding
       -> exact marker date (withdraw/arrival) -> due-date mark -> in-range
       fill ("range", no inner mark) -> weekend outside the range (Past
       Month treatment) -> normal clickable weekday.
     - band: the cell's background fill. Green/grey/orange are mutually
       exclusive per the delivery-color spec: on-time ranges are solid
       green throughout; overdue ranges are grey up to the due date (the
       earliest due date in scope \u2014 see splitDate below) then orange from
       there to arrival. The due-date cell itself and the arrival cell each
       get a hard-stop half gradient rather than a flat fill (arrival is
       always a business day, so it can never land in column 0/6 and need
       a row-edge cap; a due date can, see cap below).
     - cap: row-edge rounding for a range cell that continues into/from an
       adjacent grid row (column 0 = receives from the row above, rounded
       left; column 6 = continues into the row below, rounded right) \u2014
       independent of what's drawn inside, so a due-date mark landing on a
       Sunday/Saturday gets both the due gradient AND the matching cap.
     Due dates can now render strictly inside a range (previously
     impossible when arrival was always <= every due date by construction;
     user-picked withdraw dates or the Fast/Instant tabs can push arrival
     past a due date, which is exactly the overdue case this exists for). */
  function classifyCell(cell, withdraw, arrival, dueDates, splitDate, overdue) {
    if (!cell.inMonth) return { mark: "past", clickable: false, band: "none", cap: "none" };
    var t = cell.date.getTime();
    var w = withdraw.getTime();
    var a = arrival.getTime();
    var inRange = t >= w && t <= a;
    var isWeekend = cell.col === 0 || cell.col === 6;
    var isDue = dueDates.some(function (d) {
      return d.getTime() === t;
    });
    var mark, clickable;
    if (t === w) {
      mark = "start";
      clickable = true;
    } else if (t === a) {
      mark = "end";
      clickable = true;
    } else if (isDue) {
      mark = "due";
      clickable = true;
    } else if (inRange) {
      /* Every business day is a valid pick, whether or not it currently
         sits inside the committed range — only weekends (and, above,
         adjacent-month padding) stay non-clickable. Previously this whole
         branch was hardcoded non-clickable, which made every weekday
         already inside the range unreachable — a bug, not a design
         choice: nothing about being inside the current range should make
         a date invalid to re-pick. */
      mark = "range";
      clickable = !isWeekend;
    } else if (isWeekend) {
      mark = "past";
      clickable = false;
    } else {
      mark = "normal";
      clickable = true;
    }

    /* On-time and overdue-before-the-due-date both read as the same grey
       — green was tried and reverted; orange is the only color signal
       (overdue, from the due date to arrival). */
    var band = "none";
    if (mark === "end") {
      band = overdue ? "grad-arrival-orange" : "grad-arrival-grey";
    } else if (inRange) {
      if (overdue && t > splitDate) {
        band = "orange";
      } else if (overdue && t === splitDate) {
        band = "grad-due";
      } else {
        band = "grey";
      }
    }

    var cap = "none";
    if (inRange && mark !== "start" && mark !== "end") {
      if (cell.col === 0) cap = "left";
      else if (cell.col === 6) cap = "right";
    }

    return { mark: mark, clickable: clickable, band: band, cap: cap };
  }

  function cellMarkup(v, day) {
    var classes = ["bp-cal-day", "bp-cal-day--" + v.mark];
    if (v.band !== "none") classes.push("bp-cal-day--band-" + v.band);
    if (v.cap !== "none") classes.push("bp-cal-day--cap-" + v.cap);
    var inner;
    if (v.mark === "start" || v.mark === "end") {
      inner = '<span class="bp-cal-day__marker bp-cal-day__marker--' + v.mark + '"><span class="bp-cal-day__marker-num">' + day + "</span></span>";
    } else if (v.mark === "due") {
      inner = '<span class="bp-cal-day__due-wrap"><span class="bp-cal-day__num--due">' + day + "</span></span>";
    } else {
      var numCls = v.mark === "past" ? "bp-cal-day__num bp-cal-day__num--past" : "bp-cal-day__num";
      inner = '<span class="' + numCls + '">' + day + "</span>";
    }
    return { className: classes.join(" "), inner: inner };
  }

  function renderCalendarCell(cell, v) {
    var day = cell.date.getDate();
    var iso = cell.date.getFullYear() + "-" + pad2(cell.date.getMonth() + 1) + "-" + pad2(cell.date.getDate());
    var built = cellMarkup(v, day);
    var pick = v.clickable ? ' data-cal-pick="' + iso + '"' : "";
    return (
      '<div class="' + built.className + '" data-cal-date="' + iso + '" data-cal-col="' + cell.col + '" data-cal-in-month="' + cell.inMonth + '"' + pick + ">" +
        built.inner +
      "</div>"
    );
  }

  function renderCalendarColumn(year, month, withdraw, arrival, dueDates, splitDate, overdue) {
    var cells = buildMonthGrid(year, month);
    var label = MONTH_NAMES[month] + " " + year;
    return (
      '<div class="bp-cal-column">' +
        '<div class="bp-cal-months-header">' +
          '<div class="bp-cal-nav" aria-hidden="true"><img src="' + ICONS + 'calendar/chevron-left.svg" alt="" /></div>' +
          '<p class="bp-cal-months-header__title">' + label + "</p>" +
          '<div class="bp-cal-nav" aria-hidden="true"><img src="' + ICONS + 'calendar/chevron-right.svg" alt="" /></div>' +
        "</div>" +
        '<div class="bp-cal-block">' +
          '<div class="bp-cal-dow-header"><span>S</span><span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span></div>' +
          '<div class="bp-cal-divider-h"></div>' +
          '<div class="bp-cal-grid">' +
            cells.map(function (c) { return renderCalendarCell(c, classifyCell(c, withdraw, arrival, dueDates, splitDate, overdue)); }).join("") +
          "</div>" +
        "</div>" +
      "</div>"
    );
  }

  /* Re-derives every cell's classification for a (possibly previewed)
     withdraw/arrival pair and mutates each cell IN PLACE (className +
     innerHTML only \u2014 never removes/replaces the cell node itself). This is
     what makes the hover preview safe: the hovered element's own identity
     never changes, so mutating it can't trigger a spurious mouseleave that
     would fight the hover handler that just ran. Legend dates and the
     overdue/on-time badge update the same way; showBadge is false during
     hover (\u00a76 \u2014 the badge disappears rather than showing a stale verdict
     while the range previews a different one). */
  function updateCalendarView(dueDates, withdraw, arrival, showBadge) {
    var splitDate = dueDates[0].getTime();
    var overdue = isDeliveryOverdue(arrival, dueDates);
    var cells = els.drawerInner.querySelectorAll(".bp-cal-day[data-cal-date]");
    for (var i = 0; i < cells.length; i++) {
      var cellEl = cells[i];
      var iso = cellEl.getAttribute("data-cal-date");
      var parts = iso.split("-");
      var d = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
      var col = parseInt(cellEl.getAttribute("data-cal-col"), 10);
      var inMonth = cellEl.getAttribute("data-cal-in-month") === "true";
      var v = classifyCell({ date: d, col: col, inMonth: inMonth }, withdraw, arrival, dueDates, splitDate, overdue);
      var built = cellMarkup(v, d.getDate());
      cellEl.className = built.className;
      cellEl.innerHTML = built.inner;
      if (v.clickable) cellEl.setAttribute("data-cal-pick", iso);
      else cellEl.removeAttribute("data-cal-pick");
    }
    var wSpan = els.drawerInner.querySelector(".bp-cal-legend__text--withdraw span");
    var aSpan = els.drawerInner.querySelector(".bp-cal-legend__text--arrival span");
    if (wSpan) wSpan.textContent = fmtLong(withdraw);
    if (aSpan) aSpan.textContent = fmtLong(arrival);
    var badgeEl = els.drawerInner.querySelector(".bp-cal-legend__badge");
    if (badgeEl) {
      if (!showBadge) {
        badgeEl.style.display = "none";
      } else {
        badgeEl.style.display = "";
        badgeEl.classList.toggle("bp-badge--overdue", overdue);
        badgeEl.querySelector("span").textContent = overdue ? "Overdue" : "On time";
      }
    }
  }

  /* On time only if arrival lands on/before every due date in the payment;
     one late due date (bulk, multiple bills) makes the whole thing overdue. */
  function isDeliveryOverdue(arrival, dueDates) {
    return dueDates.some(function (d) {
      return arrival.getTime() > d.getTime();
    });
  }

  function renderDeliveryCalendar(dueDates) {
    var cal = state.drawer.calendar;
    var withdraw = cal.withdraw;
    var arrival = cal.arrival;
    var splitDate = dueDates[0].getTime();
    var overdue = isDeliveryOverdue(arrival, dueDates);
    return (
      '<div class="bp-speed-tabs">' +
        SPEED_TABS.map(function (t, i) {
          var edgeCls = i === 0 ? " bp-speed-tab--start" : i === SPEED_TABS.length - 1 ? " bp-speed-tab--end" : " bp-speed-tab--mid";
          return (
            '<button type="button" class="bp-speed-tab' + edgeCls + '" data-cal-tab="' + t.key + '" data-active="' + (t.key === cal.tab) + '">' +
              t.label + " " + money(t.fee) +
            "</button>"
          );
        }).join("") +
      "</div>" +
      '<div class="bp-cal-row">' +
        CALENDAR_MONTHS.map(function (m, idx) {
          return renderCalendarColumn(m.year, m.month, withdraw, arrival, dueDates, splitDate, overdue) + (idx === 0 ? '<div class="bp-cal-divider-v"></div>' : "");
        }).join("") +
      "</div>" +
      '<div class="bp-cal-legend">' +
        '<div class="bp-cal-legend__item"><span class="bp-cal-legend__dot bp-cal-legend__dot--due"></span><p class="bp-cal-legend__text bp-cal-legend__text--due">Due Date <span>' + fmtLong(dueDates[0]) + "</span></p></div>" +
        '<div class="bp-cal-legend__item"><span class="bp-cal-legend__dot bp-cal-legend__dot--withdraw"></span><p class="bp-cal-legend__text bp-cal-legend__text--withdraw">Withdraw <span>' + fmtLong(withdraw) + "</span></p></div>" +
        '<div class="bp-cal-legend__item"><span class="bp-cal-legend__dot bp-cal-legend__dot--arrival"></span><p class="bp-cal-legend__text bp-cal-legend__text--arrival">Est. arrival <span>' + fmtLong(arrival) + '</span></p><span class="bp-badge bp-cal-legend__badge' + (overdue ? " bp-badge--overdue" : "") + '"><span>' + (overdue ? "Overdue" : "On time") + "</span></span></div>" +
      "</div>"
    );
  }

  function renderRadioGroup(dueDates) {
    var earliestDue = dueDates[0];
    var baseArrival = normalizeArrival(addDays(earliestDue, -1));
    var selected = state.drawer.selectedRadio;
    return (
      '<div class="bp-radio-group">' +
      DELIVERY_OPTIONS.map(function (opt) {
        var checked = opt.key === selected;
        var isCustom = opt.key === "custom";
        var withdraw = isCustom ? null : addBusinessDays(baseArrival, -opt.days);
        return (
          (isCustom ? '<div class="bp-radio-group__divider"></div>' : "") +
          '<div class="bp-radio-item' + (isCustom ? " bp-radio-item--custom" : "") + '" data-radio="' + opt.key + '">' +
            '<div class="bp-radio" data-checked="' + checked + '"></div>' +
            '<div class="bp-radio-item__content">' +
              '<div class="bp-radio-item__text">' +
                '<div class="bp-radio-item__title-block">' +
                  '<p class="bp-radio-item__title"><strong>' + opt.titleStrong + "</strong><span>" + opt.titleMedium + "</span></p>" +
                  '<p class="bp-radio-item__subtitle">' + opt.subtitle + "</p>" +
                "</div>" +
                (withdraw
                  ? '<div class="bp-radio-item__meta"><span>Withdraw ' + fmtMD(withdraw) + "</span>" + GLYPH.arrow + "<span>Arrives " + fmtMD(baseArrival) + "</span></div>"
                  : "") +
              "</div>" +
              (opt.fee ? '<p class="bp-radio-item__fee">' + opt.fee + "</p>" : "") +
            "</div>" +
          "</div>"
        );
      }).join("") +
      "</div>"
    );
  }

  /* bp-tool-tip (node 3013:121336) \u2014 mounted as a child of a specific
     .bp-cal-day cell via showTooltip()/hideTooltip() below. Trigger timing
     and content are the scene script's job (deferred, per spec \u00a76.6) -
     this only defines what renders once something calls showTooltip(). */
  function renderTooltip(text, position) {
    return (
      '<div class="bp-tooltip bp-tooltip--' + position + '">' +
        '<div class="bp-tooltip__bubble"><p class="bp-tooltip__text">' + text + "</p></div>" +
        '<div class="bp-tooltip__beak-wrap"><img src="' + ICONS + 'calendar/tooltip-beak.svg" alt="" /></div>' +
      "</div>"
    );
  }

  /* Column within the 7-wide calendar grid (0 = Sunday .. 6 = Saturday),
     derived from the cell's own DOM position - .bp-cal-grid is a flat
     42-cell run (buildMonthGrid()/renderCalendarColumn()), Sunday-first -
     rather than a stored attribute, so wiring the tooltip touches nothing
     in renderCalendarCell()/classifyCell(). Positional, not day-name-based:
     column 0 is always "leftmost" regardless of which date lands there. */
  function calendarCellColumn(cellEl) {
    var siblings = cellEl.parentElement.children;
    return Array.prototype.indexOf.call(siblings, cellEl) % 7;
  }

  function calendarTooltipVariant(cellEl) {
    var col = calendarCellColumn(cellEl);
    if (col === 0) return "left";
    if (col === 6) return "right";
    return "middle";
  }

  /* Shows a tooltip on any calendar date cell - clickable ([data-cal-pick])
     or not (weekends, adjacent-month "Past Month" cells: classifyCell()
     never gives them a class/attribute beyond their existing variant, and
     this doesn't add one either - only appends a sibling node inside the
     cell, so a non-clickable cell carrying a tooltip gains zero styling or
     interaction change). One tooltip at a time: mounts fresh (removing any
     previous one first) rather than tracking/reusing a persistent node,
     since the calendar itself is wholesale-rebuilt on tab switch or date
     pick (renderDeliveryCalendar()) - a kept reference would go stale the
     moment that happens. */
  function showTooltip(cellEl, text) {
    hideTooltip();
    if (!cellEl) return;
    cellEl.insertAdjacentHTML("beforeend", renderTooltip(text, calendarTooltipVariant(cellEl)));
  }

  function hideTooltip() {
    var existing = q(".bp-tooltip");
    if (existing) existing.remove();
  }

  function renderDrawerDefault() {
    var payload = state.drawer.row;
    if (!payload) return;
    var method = payload.method;
    var last4 = payload.last4;
    var total = typeof payload.total === "number" ? payload.total : payload.amount;
    var dueDates = getDrawerDueDates(payload);
    var isCustomView = state.drawer.delivery === "custom";

    /* Head (vendor name, subtitle, close/back) is persistent markup, set up
       in openDrawer() and animated in swapDrawerContent() - not rendered here. */
    var html =
      '<p class="bp-drawer__total-amount">' + money(total) + "</p>" +
      '<div class="bp-drawer__divider"></div>' +
      '<div class="bp-drawer__method">' +
        '<span style="display:inline-flex;width:15px;height:15px">' + GLYPH[method] + "</span>" +
        "<span>" + methodLabel({ method: method, last4: last4 }) + "</span>" +
        '<a id="bp-drawer-edit">Edit</a>' +
      "</div>" +
      '<div class="bp-drawer__divider"></div>' +
      '<div class="bp-drawer__section-title-row">' +
        '<div class="bp-drawer__section-title-group">' +
          '<p class="bp-drawer__section-title">Payment delivery options</p>' +
          (isCustomView ? "" : '<span class="bp-badge"><span>On time</span></span>') +
        "</div>" +
        (isCustomView ? '<button type="button" class="bp-show-more" id="bp-show-more">Show more</button>' : "") +
      "</div>" +
      (isCustomView ? renderDeliveryCalendar(dueDates) : renderRadioGroup(dueDates)) +
      '<div class="bp-drawer__divider"></div>' +
      '<p class="bp-drawer__section-title bp-drawer__section-title--note">Note to vendor</p>' +
      '<textarea class="bp-note-field" placeholder="Add a note (optional)"></textarea>' +
      '<div style="height:32px"></div>';

    els.drawerInner.innerHTML = html;
    q("#bp-drawer-edit").addEventListener("click", function () {
      swapDrawerContent("bank-details");
    });

    if (!isCustomView) {
      var radios = els.drawerInner.querySelectorAll("[data-radio]");
      for (var i = 0; i < radios.length; i++) {
        radios[i].addEventListener("click", function (e) {
          var key = e.currentTarget.getAttribute("data-radio");
          if (key === "custom") {
            var std = SPEED_TABS[0];
            var earliestDue = dueDates[0];
            var baseArrival = normalizeArrival(addDays(earliestDue, -1));
            var withdraw = addBusinessDays(baseArrival, -std.days);
            state.drawer.delivery = "custom";
            state.drawer.calendar = { tab: std.key, withdraw: withdraw, arrival: addBusinessDays(withdraw, std.days) };
            renderDrawerDefault();
            return;
          }
          state.drawer.selectedRadio = key;
          var all = els.drawerInner.querySelectorAll(".bp-radio");
          for (var k = 0; k < all.length; k++) all[k].setAttribute("data-checked", "false");
          e.currentTarget.querySelector(".bp-radio").setAttribute("data-checked", "true");
        });
      }
    } else {
      var showMoreBtn = q("#bp-show-more");
      if (showMoreBtn) {
        showMoreBtn.addEventListener("click", function () {
          state.drawer.delivery = "radios";
          state.drawer.selectedRadio = "standard";
          renderDrawerDefault();
        });
      }
      var tabs = els.drawerInner.querySelectorAll("[data-cal-tab]");
      for (var ti = 0; ti < tabs.length; ti++) {
        tabs[ti].addEventListener("click", function (e) {
          var key = e.currentTarget.getAttribute("data-cal-tab");
          var tabDef = SPEED_TABS.filter(function (t) { return t.key === key; })[0];
          state.drawer.calendar.tab = key;
          state.drawer.calendar.arrival = addBusinessDays(state.drawer.calendar.withdraw, tabDef.days);
          renderDrawerDefault();
        });
      }
      var pickable = els.drawerInner.querySelectorAll("[data-cal-pick]");
      for (var pi = 0; pi < pickable.length; pi++) {
        pickable[pi].addEventListener("click", function (e) {
          var iso = e.currentTarget.getAttribute("data-cal-pick");
          var parts = iso.split("-");
          var picked = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
          var tabDef = SPEED_TABS.filter(function (t) { return t.key === state.drawer.calendar.tab; })[0];
          state.drawer.calendar.withdraw = picked;
          state.drawer.calendar.arrival = addBusinessDays(picked, tabDef.days);
          renderDrawerDefault();
        });
        /* §6 hover preview — mutates cells in place via updateCalendarView()
           rather than re-rendering the drawer, so the hovered element is
           never removed/replaced and mouseenter/mouseleave can't fight each
           other. Guards on a missing data-cal-pick because a cell's own
           pickability can change mid-hover (this cell's listener stays
           attached even if the preview it triggered made some OTHER cell
           non-clickable, but never this one — this cell is always the new
           withdraw mark itself, always clickable — the guard exists for
           symmetry/safety, not a case that fires today). */
        pickable[pi].addEventListener("mouseenter", function (e) {
          var iso = e.currentTarget.getAttribute("data-cal-pick");
          if (!iso) return;
          var parts = iso.split("-");
          var hovered = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
          var tabDef = SPEED_TABS.filter(function (t) { return t.key === state.drawer.calendar.tab; })[0];
          var previewArrival = addBusinessDays(hovered, tabDef.days);
          updateCalendarView(dueDates, hovered, previewArrival, false);
        });
        pickable[pi].addEventListener("mouseleave", function () {
          updateCalendarView(dueDates, state.drawer.calendar.withdraw, state.drawer.calendar.arrival, true);
        });
      }
      /* §6.6 weekend tooltip — the coloured range answers "would this
         arrive late," not "why didn't moving back two days help" (a
         weekend in between doesn't count as a business day, which is a
         rule, not a state, and needs words). Column 0/6 is always
         Sunday/Saturday regardless of which month's padding is showing
         there, so this is keyed off data-cal-col, not day-in-month.
         Weekend cells stay exactly as non-clickable as before — no
         data-cal-pick, no listener added by the pickable loop above —
         this only adds the tooltip, nothing else about them changes. */
      var weekendCells = els.drawerInner.querySelectorAll('.bp-cal-day[data-cal-col="0"], .bp-cal-day[data-cal-col="6"]');
      for (var wi = 0; wi < weekendCells.length; wi++) {
        weekendCells[wi].addEventListener("mouseenter", function (e) {
          showTooltip(e.currentTarget, "Bank transfers only move on business days");
        });
        weekendCells[wi].addEventListener("mouseleave", function () {
          hideTooltip();
        });
      }
    }
  }

  /* Field labels, order, helper text, and gaps (41px tabs-to-fields, 30px
     between field groups, 6px/4px label-field-helper) confirmed via
     get_design_context on node 2926:28499 (Frame 1000002478) — the real
     Figma order is Pay to / Email / (ZIP + State) / Bank account number /
     Routing number, not the generic 5-field guess from the first pass. */
  function renderDrawerBankDetails() {
    var payload = state.drawer.row;
    var vendor = payload ? payload.vendor : "";
    var isAlerted = vendor === ALERTED_VENDOR;
    /* Head (vendor name, subtitle, close/back) is persistent markup, set up
       in openDrawer() and animated in swapDrawerContent() - not rendered here. */
    /* Reuses the same speed-tabs component the delivery calendar's Custom
       view uses (.bp-speed-tabs / .bp-speed-tab, node 2922:165022) instead
       of the old icon-illustrated bp-tabs/bp-tab pair - plain text labels,
       2-segment border-overlap. Only 2 segments here (vs. the calendar's
       3), so just --start/--end, no --mid. */
    /* Good Heart Catering has no delivery details on file — every value
       box below renders completely empty (§3), including the State
       dropdown (chevron stays, nothing reads as selected). Labels and
       helper text are unaffected. */
    var html =
      '<div class="bp-speed-tabs">' +
        '<button type="button" class="bp-speed-tab bp-speed-tab--start" data-active="true">Bank payment (ACH)</button>' +
        '<button type="button" class="bp-speed-tab bp-speed-tab--end" data-active="false">Paper check</button>' +
      "</div>" +
      (isAlerted
        ? '<div class="bp-field"><label class="bp-field__label">Pay to</label><div class="bp-field__value-box"></div></div>' +
          '<div class="bp-field">' +
            '<label class="bp-field__label">Email</label>' +
            '<div class="bp-field__value-box"></div>' +
            '<p class="bp-field__helper">We’ll email them with payment status updates.</p>' +
          "</div>" +
          '<div class="bp-field-row">' +
            '<div class="bp-field bp-field--zip"><label class="bp-field__label">Vendor’s ZIP code</label><div class="bp-field__value-box"></div></div>' +
            '<div class="bp-field bp-field--state"><label class="bp-field__label">State</label><div class="bp-field__value-box">' + GLYPH.chevron + "</div></div>" +
          "</div>" +
          '<div class="bp-field">' +
            '<label class="bp-field__label">Bank account number (5-17 digits)</label>' +
            '<div class="bp-field__value-box"></div>' +
            '<p class="bp-field__helper">Double-check the bank info to avoid loss of funds.</p>' +
          "</div>" +
          '<div class="bp-field"><label class="bp-field__label">Routing number (9 digits)</label><div class="bp-field__value-box"></div></div>'
        : '<div class="bp-field"><label class="bp-field__label">Pay to</label><div class="bp-field__value-box"><span>' + vendor + "</span></div></div>" +
          '<div class="bp-field">' +
            '<label class="bp-field__label">Email</label>' +
            '<div class="bp-field__value-box"><span>billing@barnettlawncare.com</span></div>' +
            '<p class="bp-field__helper">We’ll email them with payment status updates.</p>' +
          "</div>" +
          '<div class="bp-field-row">' +
            '<div class="bp-field bp-field--zip"><label class="bp-field__label">Vendor’s ZIP code</label><div class="bp-field__value-box"><span>02903</span></div></div>' +
            '<div class="bp-field bp-field--state"><label class="bp-field__label">State</label><div class="bp-field__value-box"><span>RI</span>' + GLYPH.chevron + "</div></div>" +
          "</div>" +
          '<div class="bp-field">' +
            '<label class="bp-field__label">Bank account number (5-17 digits)</label>' +
            '<div class="bp-field__value-box"><span>4419827365</span></div>' +
            '<p class="bp-field__helper">Double-check the bank info to avoid loss of funds.</p>' +
          "</div>" +
          '<div class="bp-field"><label class="bp-field__label">Routing number (9 digits)</label><div class="bp-field__value-box"><span>011500120</span></div></div>');

    els.drawerInner.innerHTML = html;
  }

  /* ---- §6.4 / §7.4 default ↔ bank-details transition ----
     Two independent things change together, on the same clock:
     1. The BODY (#bp-drawer-inner: amount+method row, or tabs+fields) is
        unrelated content between the two steps, so it keeps the existing
        fade-out/swap/fade-in crossfade (200ms out, 200ms in) - untouched,
        this predates this pass.
     2. The HEAD (vendor name, subtitle, close/back) is persistent markup
        (see openDrawer()) that never gets destroyed/recreated, so it
        genuinely animates instead of cutting:
          - .bp-drawer__head--drilldown toggles the CSS transitions already
            defined on .bp-drawer__chevron / .bp-drawer__head-text /
            .bp-drawer__close (opacity + translateX, 180ms, --bp-ease-toggle,
            the same curve the body crossfade already uses) - X fades out,
            the vendor name+subtitle block slides sideways to its Figma
            position (node 2926:28489), the chevron fades in ~40ms later.
          - The subtitle's TEXT itself can't be transitioned (no interpolating
            between two strings), so it gets scene 1's technique adapted to a
            one-shot transition instead of a continuous scrub: fade to 0,
            swap textContent at the trough, fade back to 1 - same idea as
            scene 1's opacity dip masking its mid-flight row-data swap, just
            without a floor since this isn't a continuous scrub. */
  var DRAWER_HEAD_EASE = "var(--bp-ease-toggle)";
  var DRAWER_HEAD_MS = 180;

  function swapDrawerContent(view) {
    if (state.drawer.transitioning) return;
    state.drawer.transitioning = true;

    var toDrilldown = view === "bank-details";
    els.drawerHead.classList.toggle("bp-drawer__head--drilldown", toDrilldown);

    var subtitleText = toDrilldown ? "Delivery method" : state.drawer.billMeta;
    els.drawerSubtitle.style.transition = "opacity " + DRAWER_HEAD_MS / 2 + "ms " + DRAWER_HEAD_EASE;
    els.drawerSubtitle.style.opacity = "0";
    clearTimeout(state.drawer.subtitleSwapTimer);
    state.drawer.subtitleSwapTimer = setTimeout(function () {
      els.drawerSubtitle.textContent = subtitleText;
      els.drawerSubtitle.style.opacity = "1";
    }, DRAWER_HEAD_MS / 2);

    els.drawerInner.setAttribute("data-fading", "true");
    setTimeout(function () {
      state.drawer.view = view;
      renderDrawer();
      els.drawerFooter.style.display = toDrilldown ? "flex" : "none";
      requestAnimationFrame(function () {
        els.drawerInner.removeAttribute("data-fading");
      });
      setTimeout(function () {
        state.drawer.transitioning = false;
      }, DRAWER_HEAD_MS);
    }, 200);
  }

  /* ---- §6.1 mode toggle + §6.5 aggregation ---- */
  function updateAggregates() {
    var bills = ROWS.length;
    var groups = vendorGroups();
    var vendors = groups.length;
    var payments = state.mode === "batch" ? bills : vendors;
    var totalAmount = ROWS.reduce(function (s, r) { return s + r.amount; }, 0);
    var totalFee = 1.0 * payments; // $1.00 processing fee per payment made

    els.totalAmount.textContent = money(totalAmount);
    els.totalFee.textContent = "Total processing fees: " + money(totalFee);
    els.statBills.textContent = bills;
    els.statVendors.textContent = vendors;
    els.statPayments.textContent = payments;
  }

  function setMode(mode) {
    state.mode = mode;
    state.expanded = {};
    els.toggle.setAttribute("aria-checked", mode === "bulk" ? "true" : "false");
    // Temporarily suppress CSS transitions to avoid a visual 'jump'
    // when swapping the rows DOM (reflows can animate width/padding).
    document.documentElement.classList.add("bp-disable-transitions");
    renderRows();
    updateAggregates();
    updateSelectedRowCard();
    // Remove the disabling class after two frames so the layout can
    // settle without transitions, then normal transitions resume.
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        document.documentElement.classList.remove("bp-disable-transitions");
      });
    });
  }

  /* ---- scale-to-fit (§4) ---- */
  function applyScale() {
    var w = document.documentElement.clientWidth;
    var scale = w / 1440;
    els.scaler.style.transform = "scale(" + scale + ")";
    var h = els.screen.scrollHeight;
    document.body.style.height = h * scale + "px";
    // The scale factor itself changed - the selected-row card's native-px
    // position depends on it directly (see updateSelectedRowCard()).
    updateSelectedRowCard();
  }

  function init() {
    els.screen = q("#bp-screen");
    els.scaler = q(".scaler");
    els.rowsScroll = q("#bp-rows-scroll");
    els.headerRow = q("#bp-header-row");
    els.toggle = q("#bp-mode-toggle");
    els.totalAmount = q("#bp-total-amount");
    els.totalFee = q("#bp-total-fee");
    els.statBills = q("#bp-stat-bills");
    els.statVendors = q("#bp-stat-vendors");
    els.statPayments = q("#bp-stat-payments");
    els.drawer = q("#bp-drawer");
    els.drawerInner = q("#bp-drawer-inner");
    els.drawerHead = q("#bp-drawer-head");
    els.drawerVendorName = q("#bp-drawer-vendor-name");
    els.drawerSubtitle = q("#bp-drawer-subtitle");
    els.drawerFooter = q("#bp-drawer-footer");
    els.rowCardLayer = q("#bp-row-card-layer");
    els.rowCard = q("#bp-row-selected-card");

    els.toggle.addEventListener("click", function () {
      setMode(state.mode === "batch" ? "bulk" : "batch");
    });

    /* Head close (X) / back (chevron) are persistent elements (never
       destroyed/recreated across drawer steps - see openDrawer() and
       swapDrawerContent()), so their listeners are bound once here rather
       than re-bound on every renderDrawer() call. */
    q("#bp-drawer-close").addEventListener("click", closeDrawer);
    q("#bp-drawer-back").addEventListener("click", function () {
      swapDrawerContent("default");
    });
    /* "Apply changes" (bank-details footer) returns to the drawer's
       previous step - same navigation as the back chevron, not a submit. */
    q("#bp-drawer-apply").addEventListener("click", function () {
      swapDrawerContent("default");
    });

    /* ---- top-of-scroll fade gradient: only shown once there's content
       scrolled away above the visible area ---- */
    els.rowsScroll.addEventListener("scroll", function () {
      els.rowsScroll.classList.toggle("is-scrolled", els.rowsScroll.scrollTop > 0);
      updateSelectedRowCard();
    });

    renderRows();
    updateAggregates();
    applyScale();
    window.addEventListener("resize", applyScale);
  }

  document.addEventListener("DOMContentLoaded", init);
})();
