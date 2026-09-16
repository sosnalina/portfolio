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

  /* §18.9 — Bill Activity drawer timeline, fixed placeholder content,
     identical for every bill. Never bound to ROWS — including the
     $47,300.00 figures, which stay literal even when the clicked row's own
     amount differs. `dot` drives both the rail dot's state (§18.7) and,
     for "upcoming", the whole item's 0.5 opacity / headline-only layout.
     `duration` is the line rendered AFTER this item, before the next one;
     null means none (entries 10/11 — the 28px gap between them still
     applies, since content-column spacing is per-child, not per-pair).
     `wideGapBefore` singles out the one 42px gap (this item's own extra
     margin-top, see .bp-activity-item--wide-gap) — every other gap in the
     column, including 10→11, stays the container's plain 28px. */
  var ACTIVITY_TIMELINE = [
    { dot: "complete", stage: "Received", detail: "Email from vendor", actor: "Invoice capture (system) • Aug 26, 2025", duration: "3h 12m" },
    { dot: "complete", stage: "Coded", detail: "GL 6100 Contract labor • Engineering", actor: "Marcus Webb, AP clerk • Aug 26, 2025", duration: "21h 5m" },
    { dot: "complete", stage: "Matched", detail: "PO 4418 • receipt GRN-2207 • within tolerance", actor: "Matching engine (system) • Aug 27, 2025", duration: "4h 20m" },
    { dot: "complete", stage: "Sent for approval", detail: "Two approvers required • bills over $25,000", actor: "Marcus Webb, AP clerk • Aug 27, 2025", duration: "1d 2h" },
    { dot: "warning", stage: "Returned for correction", detail: "Cost center should be Platform, not Engineering", actor: "Dana Kim, Finance Director • Aug 28, 2025", duration: "19h 44m" },
    { dot: "complete", stage: "Recoded", detail: "GL 6100 Contract labor • Platform", actor: "Marcus Webb, AP clerk • Aug 29, 2025", duration: "42m" },
    { dot: "complete", stage: "Sent for approval", detail: "Second attempt", actor: "Marcus Webb, AP clerk • Aug 29, 2025", duration: "3d 4h" },
    { dot: "complete", stage: "Approved • 1 of 2", detail: "Reviewed amount $47,300.00", actor: "Priya Raman, department head • Sep 1, 2025", duration: "2d 22h" },
    { dot: "complete", stage: "Approved • 2 of 2", detail: "Reviewed amount $47,300.00", actor: "Dana Kim, Finance Director • Sep 4, 2025", duration: "Ready to pay • 3d 2h" },
    { dot: "upcoming", stage: "Scheduled for payment", detail: null, actor: null, duration: null, wideGapBefore: true },
    { dot: "upcoming", stage: "Paid", detail: null, actor: null, duration: null }
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
    },
    // §18: second, independent drawer — its own slot, never reusing state.drawer.
    activityDrawer: {
      open: false,
      row: null,
      revealed: false
    }
  };

  var els = {};

  function q(sel) { return document.querySelector(sel); }

  function rowCellsCommon(narrowAttr) {
    return narrowAttr ? ' data-narrow-hide="payment"' : "";
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
        '<div class="bp-cell bp-cell--bill" data-narrow-hide="activity"><span>' + row.bill + "</span></div>" +
        '<div class="bp-cell bp-cell--status bp-cell--status--clickable" data-narrow-hide="activity"><span class="bp-status__check">' + GLYPH.statusCheck + '</span><span class="bp-status-text bp-hover-underline">Approved</span></div>' +
        '<div class="bp-cell bp-cell--due" data-narrow-hide="activity"><span>' + row.due + "</span></div>" +
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
        '<div class="bp-cell bp-cell--speed" data-narrow-hide="payment" style="opacity:0"></div>' +
        '<div class="bp-cell bp-cell--fee" data-narrow-hide="payment" style="opacity:0"></div>' +
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
  /* The two drawers are mutually exclusive (§18.4 — opening either closes
     the other), so at most one of these is ever open at once. Picks
     whichever is, so updateSelectedRowCard() below stays the single,
     un-duplicated implementation for both (§18.5's "reuse the function;
     do not duplicate its logic"). */
  function activeDrawerState() {
    if (state.drawer.open) return state.drawer;
    if (state.activityDrawer.open) return state.activityDrawer;
    return null;
  }

  function updateSelectedRowCard() {
    var sel = activeDrawerState();
    var hasSelection = !!(sel && sel.row);
    var rowEl = hasSelection ? selectedRowEl(sel.row) : null;
    var revealed = !!(rowEl && sel.revealed);

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
    /* §18.4/§18.11 — batch mode only. renderVendorRow/renderSubRow never
       render this class, so in bulk mode this querySelectorAll is always
       empty: no handler, no hover, no cursor, exactly as spec requires,
       with no separate mode branch needed here. */
    var statusCells = els.rowsScroll.querySelectorAll(".bp-cell--status--clickable");
    for (var k = 0; k < statusCells.length; k++) {
      statusCells[k].addEventListener("click", onStatusCellClick);
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

  /* §18.10 — reads the clicked cell's closest .bp-row and looks the record
     up fresh from ROWS, the same pattern onActionClick() uses above; no
     copy or subset is passed. Batch-only by construction: this handler is
     only ever bound to .bp-cell--status--clickable, which only
     renderBatchRow emits (see bindRowEvents()). */
  function onStatusCellClick(e) {
    var cell = e.currentTarget;
    var row = cell.closest(".bp-row");
    var rowId = row.getAttribute("data-row-id");
    var payload = ROWS.filter(function (r) { return String(r.id) === rowId; })[0];
    if (payload) openActivityDrawer(payload);
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
    // §18.4 — the two drawers are mutually exclusive; opening this one closes the other.
    if (state.activityDrawer.open) {
      closeActivityDrawer();
    }
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
    els.screen.setAttribute("data-narrow-mode", "payment"); // §18.12 — which drawer's column set is hidden
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
      state.drawer.open = false;
      // Only clear narrow mode if the activity drawer isn't the one now
      // holding it open (e.g. openActivityDrawer() closing this drawer to
      // switch — see its own state.narrow = true, set before this fires).
      if (!state.activityDrawer.open) {
        els.screen.classList.remove("bp-screen--narrow");
        els.screen.removeAttribute("data-narrow-mode");
        state.narrow = false;
      }
      els.drawer.removeEventListener("transitionend", onEnd);
      renderRows();
      updateSelectedRowCard();
    };
    els.drawer.addEventListener("transitionend", onEnd);
  }

  /* Every separator in this drawer is the bullet U+2022, never U+00B7 —
     wraps just the glyph so its optical-centring nudge (.bp-activity-bullet)
     doesn't touch the surrounding spaces' word-wrap behaviour. */
  function withBullets(s) {
    return s.split(" • ").join(' <span class="bp-activity-bullet">•</span> ');
  }

  /* §18.9 — fixed placeholder content, rendered once (it never varies by
     row, so there's nothing for openActivityDrawer() to re-render here).
     §18.7's dot/rail geometry is NOT set here — see positionActivityRail()
     below, which needs live layout this markup alone can't provide. */
  function renderActivityTimeline() {
    var dotsHtml = "";
    var contentHtml = "";
    ACTIVITY_TIMELINE.forEach(function (entry) {
      dotsHtml += '<div class="bp-activity__dot bp-activity__dot--' + entry.dot + '"></div>';
      var itemClass = "bp-activity-item" + (entry.dot === "upcoming" ? " bp-activity-item--upcoming" : "") + (entry.wideGapBefore ? " bp-activity-item--wide-gap" : "");
      if (entry.dot === "upcoming") {
        // §18.7: upcoming items are headline-only — no detail, no actor line.
        contentHtml += '<div class="' + itemClass + '">' + '<p class="bp-activity-item__stage">' + entry.stage + "</p>" + "</div>";
      } else {
        contentHtml +=
          '<div class="' + itemClass + '">' +
          '<div class="bp-activity-item__headline">' +
          '<p class="bp-activity-item__stage">' + withBullets(entry.stage) + "</p>" +
          '<p class="bp-activity-item__detail">' + withBullets(entry.detail) + "</p>" +
          "</div>" +
          '<p class="bp-activity-item__actor">' + withBullets(entry.actor) + "</p>" +
          "</div>";
      }
      if (entry.duration) {
        contentHtml += '<p class="bp-activity-duration">' + withBullets(entry.duration) + "</p>";
      }
    });
    els.activityRail.innerHTML = '<div class="bp-activity__rail-line" id="bp-activity-rail-line"></div>' + dotsHtml;
    els.activityTimelineContent.innerHTML = contentHtml;
    els.activityRailLine = q("#bp-activity-rail-line");
  }

  /* §18.7's acceptance criterion (revised): each dot's vertical centre
     sits on the MIDPOINT OF THE STAGE STRING'S CAP-HEIGHT — not the line
     box's own geometric centre. The box-centre rule (this function's
     original version) was wrong: this webfont's fontBoundingBoxAscent +
     fontBoundingBoxDescent (22px) exceeds its own authored 20px
     line-height, so the baseline sits low in the box and the box's
     geometric centre lands measurably below the glyphs' actual visual
     weight — by an amount that isn't even constant, since it grows with
     each string's own ascenders/descenders ("Received", no descender,
     measured ~0.4px off; "Scheduled for payment", has one, measured ~2px
     off). Cap-height doesn't have that problem: unlike ink extent, it
     doesn't move with descenders/ascenders, so every dot lands the same
     way regardless of which letters happen to be in that stage's text.

     Cap-height is a font/size-level constant, not a per-string one — every
     stage line shares --bp-text-timeline-stage, so ONE reference
     measurement (a flat-top capital with no accent/overshoot ambiguity),
     read from the actual resolved font via Canvas's actualBoundingBoxAscent
     (not assumed from a table, not hardcoded), covers all eleven. Baseline
     position is still read per element via a live DOM probe (a zero-height
     vertical-align:baseline span, whose top/bottom coincide exactly with
     that line's baseline) rather than cached from one element and reused,
     so this stays correct even if a future entry's stage text ever wraps
     to a second line — nothing here assumes single-line height. Divides by
     the current scale factor exactly like updateSelectedRowCard() does,
     since this reads real (scaled) viewport pixels but writes native ones.
     Re-run on every open, and from applyScale() while open, since the
     scale factor itself can change between opens (window resize). */
  function positionActivityRail() {
    var scale = document.documentElement.clientWidth / 1440;
    var railRect = els.activityRail.getBoundingClientRect();
    var stages = els.activityTimelineContent.querySelectorAll(".bp-activity-item__stage");
    var dots = els.activityRail.querySelectorAll(".bp-activity__dot");
    if (!stages.length || stages.length !== dots.length) return;

    var canvas = document.createElement("canvas");
    var ctx = canvas.getContext("2d");
    ctx.font = getComputedStyle(stages[0]).font;
    ctx.textBaseline = "alphabetic";
    var capHeight = ctx.measureText("H").actualBoundingBoxAscent;

    var centers = [];
    for (var i = 0; i < dots.length; i++) {
      var stageEl = stages[i];
      var stageRect = stageEl.getBoundingClientRect();

      var probe = document.createElement("span");
      probe.style.display = "inline-block";
      probe.style.width = "0";
      probe.style.height = "0";
      probe.style.verticalAlign = "baseline";
      stageEl.appendChild(probe);
      var baselineFromBoxTop = probe.getBoundingClientRect().top - stageRect.top;
      stageEl.removeChild(probe);

      var capMidFromBoxTop = baselineFromBoxTop - capHeight / 2;
      var centerY = (stageRect.top + capMidFromBoxTop - railRect.top) / scale;
      dots[i].style.top = centerY - 6 + "px"; // 6 = half the 12px dot
      centers.push(centerY);
    }
    // Rail line: first dot's centre to last dot's centre, no further either way.
    els.activityRailLine.style.top = centers[0] + "px";
    els.activityRailLine.style.height = centers[centers.length - 1] - centers[0] + "px";
  }

  /* ---- §18: Bill Activity drawer — second, independent side drawer.
     Mirrors openDrawer()/closeDrawer() (§7.3's motion, the row-lift via
     updateSelectedRowCard()/revealSelectedRow(), the narrow column
     collapse) but against its own state.activityDrawer slot, with no
     bank-details/radios/footer machinery — this drawer has none of that
     (§18.5's "no footer"). */
  function openActivityDrawer(row) {
    // §18.4 — mutually exclusive with the payment drawer.
    if (state.drawer.open) {
      closeDrawer();
    }
    state.activityDrawer.open = true;
    state.activityDrawer.row = row;
    state.activityDrawer.revealed = false;
    state.narrow = true;

    els.activityVendorName.textContent = row.vendor;
    els.activityBillNumber.textContent = "Bill No." + row.bill;
    els.activityBalance.textContent = money(row.amount);
    els.activityDue.textContent = fmtLong(parseMMDDYY(row.due));

    els.screen.classList.add("bp-screen--narrow");
    els.screen.setAttribute("data-narrow-mode", "activity"); // §18.12 — which drawer's column set is hidden
    renderRows();
    updateSelectedRowCard();
    positionActivityRail();
    requestAnimationFrame(function () {
      els.screen.classList.add("bp-screen--activity-open");
    });

    var onOpenEnd = function () {
      els.activityDrawer.removeEventListener("transitionend", onOpenEnd);
      if (!state.activityDrawer.open || !state.activityDrawer.row || state.activityDrawer.row.id !== row.id) return;
      state.activityDrawer.revealed = true;
      revealSelectedRow(row, false);
    };
    els.activityDrawer.addEventListener("transitionend", onOpenEnd);
  }

  function closeActivityDrawer() {
    state.activityDrawer.revealed = false;
    if (state.activityDrawer.row) {
      var rowEl = selectedRowEl(state.activityDrawer.row);
      var chevron = rowEl ? rowEl.querySelector(".bp-vendor__chevron") : null;
      if (chevron) chevron.removeAttribute("data-selected");
    }
    updateSelectedRowCard();

    els.screen.classList.remove("bp-screen--activity-open");
    var onEnd = function () {
      state.activityDrawer.open = false;
      if (!state.drawer.open) {
        els.screen.classList.remove("bp-screen--narrow");
        els.screen.removeAttribute("data-narrow-mode");
        state.narrow = false;
      }
      els.activityDrawer.removeEventListener("transitionend", onEnd);
      renderRows();
      updateSelectedRowCard();
    };
    els.activityDrawer.addEventListener("transitionend", onEnd);
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
    // Same reasoning for the timeline rail (§18.7) - only while it's
    // actually visible, since its content is otherwise unlaid-out (0-rects).
    if (state.activityDrawer.open) {
      positionActivityRail();
    }
  }

  // ---- Continue → review state ----

  /* Cubic-bezier solver, ported verbatim from the approved footer-button-
     morph widget (bp_footer_button_morph_options, option C, 450ms, 16 Sep —
     spec §5). `reviewOut` is the same (0.23, 1, 0.32, 1) curve the spec's
     own §6 beats table calls easeOutStrong, so it's reused for the rest of
     the timeline too, not re-defined. */
  function bz(x1, y1, x2, y2) {
    return function (x) {
      if (x <= 0) return 0;
      if (x >= 1) return 1;
      var lo = 0, hi = 1, t = 0;
      for (var i = 0; i < 30; i++) {
        t = (lo + hi) / 2;
        var u = 1 - t, cx = 3 * u * u * t * x1 + 3 * u * t * t * x2 + t * t * t;
        if (cx < x) lo = t; else hi = t;
      }
      var u2 = 1 - t;
      return 3 * u2 * u2 * t * y1 + 3 * u2 * t * t * y2 + t * t * t;
    };
  }
  var reviewIo = bz(0.77, 0, 0.175, 1);
  var easeOutStrong = bz(0.23, 1, 0.32, 1);
  var reviewPop = bz(0.175, 0.885, 0.32, 1.275);

  function reviewSeg(p, a, b) {
    return Math.max(0, Math.min(1, (p - a) / (b - a)));
  }
  function reviewLerp(a, b, k) {
    return a + (b - a) * k;
  }
  function reviewClamp01(x) {
    return Math.max(0, Math.min(1, x));
  }

  var REVIEW_SECONDARY_END = 129; // Figma 3217:200283 — Save for later

  /* Ported from the approved widget's mode==='pop' branch only — the
     `stretch`/`roll` branches, the `mode` variable, and the oY/nY fields
     (always 0 in `pop`) are deleted, per §5's port instructions. P0/S0 are
     read live from the real buttons at click time (startReviewTransition()),
     never hardcoded; `P0 * 0.88` replaces the widget's literal `88` (88% of
     its own demo P0=100). P1 (round 2, spec §1) is likewise measured live
     at click time — see measurePrimaryEndWidth() below — never hardcoded. */
  function reviewMorphState(p, P0, S0, P1) {
    var s = {};
    var sq = reviewIo(reviewSeg(p, 0, 0.3));
    s.pw = p < 0.3 ? reviewLerp(P0, P0 * 0.88, sq) : reviewLerp(P0 * 0.88, P1, reviewPop(reviewSeg(p, 0.3, 1)));
    s.sw = reviewLerp(S0, REVIEW_SECONDARY_END, reviewIo(reviewSeg(p, 0.3, 1)));
    s.oO = 1 - easeOutStrong(reviewSeg(p, 0, 0.25));
    s.nO = easeOutStrong(reviewSeg(p, 0.55, 1));
    var t = easeOutStrong(reviewSeg(p, 0.3, 1));
    s.tO = t;
    s.tS = 0.95 + 0.05 * t;
    return s;
  }

  /* §7 reduced motion — widths jump straight to their end values (no width
     animation), old→new label crossfade linear over 0–150ms, tertiary
     Cancel opacity-only over the same window (no scale). */
  function reviewMorphStateReduced(tMs, P1) {
    var k = reviewClamp01(tMs / 150);
    return { pw: P1, sw: REVIEW_SECONDARY_END, oO: 1 - k, nO: k, tO: k, tS: 1 };
  }

  /* Round 2 spec §1 — P1 = new-label text width + button left/right padding
     (16+16) + left/right border widths, minimum 100. Measured in native px
     (canvas.measureText with the button's own computed font, same technique
     already used by positionActivityRail() above — not through .scaler). */
  function measurePrimaryEndWidth() {
    var canvas = measurePrimaryEndWidth._canvas || (measurePrimaryEndWidth._canvas = document.createElement("canvas"));
    var ctx = canvas.getContext("2d");
    ctx.font = getComputedStyle(els.btnPrimary).font;
    var textWidth = ctx.measureText(els.btnPrimaryNew.textContent).width;
    var btnStyle = getComputedStyle(els.btnPrimary);
    var borderWidth = (parseFloat(btnStyle.borderLeftWidth) || 0) + (parseFloat(btnStyle.borderRightWidth) || 0);
    return Math.max(100, textWidth + 16 + 16 + borderWidth);
  }

  var reviewState = { started: false, P0: 0, S0: 0, P1: 0, clickTime: 0, rafId: null };

  /* The one pure function driving the whole transition — every value below
     is a function of tMs alone (§6: "no accumulated state... must render
     correctly for any tMs, including seeking backward"). */
  function renderReviewState(tMs, reduced) {
    tMs = Math.max(0, Math.min(600, tMs));

    /* .bp-table-wrap, .bp-header::before, .bp-header__row, .bp-footer__stats
       share one 0–300ms easeOutStrong opacity fade (§6 beats table). Reduced
       motion only drops the table-wrap's own translateY — the fade itself
       is already opacity-only for all four, so §7 leaves it unchanged. */
    var fadeP = easeOutStrong(reviewClamp01(tMs / 300));
    var fadeOpacity = 1 - fadeP;
    var fadeVisibility = fadeOpacity > 0 ? "visible" : "hidden";

    els.tableWrap.style.opacity = fadeOpacity;
    els.tableWrap.style.transform = reduced ? "none" : "translateY(" + 739 * fadeP + "px)";
    els.tableWrap.style.visibility = fadeVisibility;

    els.header.style.setProperty("--bp-header-before-opacity", fadeOpacity);

    els.headerRowFields.style.opacity = fadeOpacity;
    els.headerRowFields.style.visibility = fadeVisibility;

    els.footerStats.style.opacity = fadeOpacity;
    els.footerStats.style.visibility = fadeVisibility;

    /* Footer buttons — §5 morph, own 450ms/curves (not easeOutStrong). */
    var btnP = reviewClamp01(tMs / 450);
    var st = reduced ? reviewMorphStateReduced(tMs, reviewState.P1) : reviewMorphState(btnP, reviewState.P0, reviewState.S0, reviewState.P1);
    els.btnPrimary.style.width = st.pw + "px";
    els.btnSecondary.style.width = st.sw + "px";
    els.btnPrimaryOld.style.opacity = st.oO;
    els.btnPrimaryNew.style.opacity = st.nO;
    els.btnSecondaryOld.style.opacity = st.oO;
    els.btnSecondaryNew.style.opacity = st.nO;
    els.btnTertiary.style.opacity = st.tO;
    els.btnTertiary.style.transform = "scale(" + st.tS + ")";
    els.btnTertiary.style.visibility = st.tO > 0 ? "visible" : "hidden";

    /* Subheader — 400ms normal / 300ms reduced (opacity-only, no scale). */
    var subDuration = reduced ? 300 : 400;
    var subP = easeOutStrong(reviewClamp01(tMs / subDuration));
    els.headerSubtitle.style.opacity = subP;
    els.headerSubtitle.style.transform = reduced ? "none" : "scale(" + (0.95 + 0.05 * subP) + ")";
    els.headerSubtitle.style.visibility = subP > 0 ? "visible" : "hidden";

    /* Review image — 300–600ms, opacity only, identical in both modes. */
    var imgP = easeOutStrong(reviewClamp01((tMs - 300) / 300));
    els.reviewImage.style.opacity = imgP;
    els.reviewImage.style.visibility = imgP > 0 ? "visible" : "hidden";
  }

  function reviewTick(clickTime, reduced) {
    var tMs = performance.now() - clickTime;
    renderReviewState(tMs, reduced);
    if (tMs < 600) {
      reviewState.rafId = requestAnimationFrame(function () {
        reviewTick(clickTime, reduced);
      });
    } else {
      reviewState.rafId = null;
    }
  }

  function startReviewTransition() {
    if (reviewState.started) return;
    reviewState.started = true;
    var reduced = !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    // Read live, native widths — getComputedStyle().width is unaffected by
    // .scaler's transform:scale() (transforms don't change computed style,
    // only paint), so this needs no scale-factor division.
    reviewState.P0 = parseFloat(getComputedStyle(els.btnPrimary).width);
    reviewState.S0 = parseFloat(getComputedStyle(els.btnSecondary).width);
    // Round 2 spec §1 — measured here, same moment as P0/S0, before the
    // morph starts. The new-label span is opacity:0 but still laid out, so
    // its text can be measured now even though it won't render until later.
    reviewState.P1 = measurePrimaryEndWidth();
    var clickTime = performance.now();
    reviewState.clickTime = clickTime;
    requestAnimationFrame(function () {
      reviewTick(clickTime, reduced);
    });
  }

  // ---- Scheduling loader and reset ----

  /* Approved reference "bp_scheduling_loader_transition" (16 Sep, spec §4),
     ported verbatim per the port instructions there. `out`/`ov`/`seg` are
     not re-defined — they're the file's existing easeOutStrong/reviewPop/
     reviewSeg (identical curves, see spec §4 change 7). `io` (easeInOutCubic)
     doesn't already exist in this file, so it's defined new here. */
  function easeInOutCubic(x) {
    x = Math.max(0, Math.min(1, x));
    return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
  }

  var LOADER_POP = 350;
  var LOADER_FILL_START = 890;
  var LOADER_FILL_DURATION = 2000; // 890 + 2000 = 2890ms to 100% (spec §0/§4)
  var LOADER_DONE_AT = LOADER_FILL_START + LOADER_FILL_DURATION;
  /* [elsKey, start, period, travel] — cS/cB/cC from the reference, renamed
     to the actual element keys per the port's element-mapping table. */
  var LOADER_CIRCLES = [
    ["loaderSCircle", 400, 3200, -8],
    ["loaderBCircle", 470, 3300, -10],
    ["loaderClock", 540, 2900, -6]
  ];

  /* ---- Payments scheduled (success), round 3 — approved reference
     "bp_schedule_payments_full_flow" (16 Sep, spec §4), ported per its own
     port instructions there. SUCCESS_S0/SUCCESS_C0 continue straight off
     LOADER_DONE_AT (2890ms) rather than restating it, so the 1s hold and
     the 5190ms total stay derived, not hardcoded twice. */
  var SUCCESS_S0 = LOADER_DONE_AT + 1000; // 3890 — art/text/progress exit starts
  var SUCCESS_C0 = SUCCESS_S0 + 550; // 4440 — ring + V start
  var SUCCESS_RING_CIRC = 2 * Math.PI * 42;
  var SUCCESS_PROGRESS_DROP = 300;
  var cssEase = bz(0.25, 0.1, 0.25, 1); // the CSS "ease" keyword — used by kf() below

  /* Keyframe interpolator, ported verbatim from the reference's kf(). Each
     frame is [progress 0-1, [values...]]; interpolation between frames uses
     cssEase, and progress past the last frame holds that frame's values
     exactly (spec §4 change 7 — no static-CSS fallback, no 1px jump). */
  function kf(frames, p) {
    if (p <= frames[0][0]) return frames[0][1];
    for (var i = 1; i < frames.length; i++) {
      if (p <= frames[i][0]) {
        var a = frames[i - 1], b = frames[i];
        var k = cssEase((p - a[0]) / (b[0] - a[0]));
        return a[1].map(function (v, j) {
          return v + (b[1][j] - v) * k;
        });
      }
    }
    return frames[frames.length - 1][1];
  }
  /* TIP is [width, left, top] per keyframe; LNG is [width, right, top] —
     ported verbatim from the reference, values unchanged. */
  var SUCCESS_TIP = [
    [0, [0, 1, 19]],
    [0.54, [0, 1, 19]],
    [0.70, [50, -8, 37]],
    [0.84, [17, 21, 48]],
    [1, [25, 14, 45]]
  ];
  var SUCCESS_LONG = [
    [0, [0, 46, 54]],
    [0.65, [0, 46, 54]],
    [0.84, [55, 0, 35]],
    [1, [47, 8, 38]]
  ];

  var loaderState = { active: false, clickTime: 0, reduced: false, rafId: null };

  /* Pure function of tMs alone (spec §4 change 4) — every value below is
     derived from tMs (and the reduced-motion flag) with no other state. */
  function renderLoaderState(tMs, reduced) {
    els.whiteout.style.opacity = easeOutStrong(reviewSeg(tMs, 0, 300));

    var textPop = reviewPop(reviewSeg(tMs, 250, 750));
    var textOp = easeOutStrong(reviewSeg(tMs, 250, 550));
    els.loaderText.style.opacity = textOp;
    els.loaderText.style.transform = reduced ? "none" : "translateY(" + (1 - textPop) * 40 + "px)";
    els.loaderText.style.visibility = textOp > 0 ? "visible" : "hidden";

    var progPop = reviewPop(reviewSeg(tMs, 310, 810));
    var progLy = (1 - progPop) * 40;
    var progOp = easeOutStrong(reviewSeg(tMs, 310, 610));
    /* Round 3, spec §4 change 2 — past SUCCESS_S0 the entrance is replaced
       by the exit: normally a reversed-entrance drop (opacity held at 1,
       per the reference's own `if(t>=S0){…}` line); reduced motion instead
       fades opacity to 0 with no translateY (spec §6). */
    if (tMs >= SUCCESS_S0) {
      if (reduced) {
        progOp = 1 - easeOutStrong(reviewSeg(tMs, SUCCESS_S0, SUCCESS_S0 + 300));
        progLy = 0;
      } else {
        var back = Math.max(0, Math.min(500, 500 - (tMs - SUCCESS_S0)));
        progLy = (1 - reviewPop(reviewSeg(back, 0, 500))) * SUCCESS_PROGRESS_DROP;
        progOp = 1;
      }
    }
    els.loaderProgress.style.opacity = progOp;
    els.loaderProgress.style.transform = reduced ? "none" : "translateY(" + progLy + "px)";
    // §4 change 8 — forced hidden from S0+500 regardless of opacity, since
    // normal motion holds opacity at 1 throughout its own exit.
    els.loaderProgress.style.visibility = progOp > 0 && tMs < SUCCESS_S0 + 500 ? "visible" : "hidden";

    var womanOp = easeOutStrong(reviewSeg(tMs, 250, 450));
    els.loaderWoman.style.opacity = womanOp;
    els.loaderWoman.style.visibility = womanOp > 0 ? "visible" : "hidden";

    LOADER_CIRCLES.forEach(function (c) {
      var el = els[c[0]];
      var start = c[1], period = c[2], travel = c[3];
      var sc = 0.9 + 0.1 * reviewPop(reviewSeg(tMs, start, start + LOADER_POP));
      var fy = 0;
      if (tMs > start + LOADER_POP) {
        var phase = (tMs - start - LOADER_POP) / period;
        fy = (travel * (1 - Math.cos(2 * Math.PI * phase))) / 2;
      }
      var op = easeOutStrong(reviewSeg(tMs, start, start + 200));
      el.style.opacity = op;
      el.style.transform = reduced ? "none" : "translateY(" + fy + "px) scale(" + sc + ")";
      el.style.visibility = op > 0 ? "visible" : "hidden";
    });

    var f = easeInOutCubic(reviewSeg(tMs, LOADER_FILL_START, LOADER_FILL_START + LOADER_FILL_DURATION));
    els.loaderProgressFill.style.width = f * 100 + "%";
    // Hadar, 16 Sep (spec §4 change 9): floored, never rounds up to "(100%)"
    // before the label switches to "Done" at 2890ms.
    els.loaderProgressLabel.textContent = tMs >= LOADER_DONE_AT ? "Done" : "In progress (" + Math.floor(f * 100) + "%)";

    /* ---- Round 3 — Payments scheduled (success), spec §4 changes 3-8.
       Art wrapper, old/new text and the button are opacity-only in BOTH
       motion modes (spec §6 "unchanged"), so none of these four branch on
       `reduced`. */
    var artOp = 1 - easeOutStrong(reviewSeg(tMs, SUCCESS_S0, SUCCESS_S0 + 300));
    els.loaderArt.style.opacity = artOp;
    els.loaderArt.style.visibility = artOp > 0 ? "visible" : "hidden";

    var oldTextOp = 1 - easeOutStrong(reviewSeg(tMs, SUCCESS_S0, SUCCESS_S0 + 250));
    els.loaderTextOld.style.opacity = oldTextOp;
    els.loaderTextOld.style.visibility = oldTextOp > 0 ? "visible" : "hidden";

    var newTextOp = easeOutStrong(reviewSeg(tMs, SUCCESS_S0 + 250, SUCCESS_S0 + 550));
    els.loaderTextNew.style.opacity = newTextOp;
    els.loaderTextNew.style.visibility = newTextOp > 0 ? "visible" : "hidden";

    var btnOp = easeOutStrong(reviewSeg(tMs, SUCCESS_C0, SUCCESS_C0 + 300));
    els.btnSuccess.style.opacity = btnOp;
    els.btnSuccess.style.visibility = btnOp > 0 ? "visible" : "hidden";

    /* Ring — normal: stroke draws 0-400ms via easeInOutCubic (spec's own
       curve, matching the fill bar). Reduced: fully drawn the instant C0
       is reached (spec §6 "fully drawn from C0"), no animated draw. */
    var ringDraw = reduced ? (tMs >= SUCCESS_C0 ? 1 : 0) : easeInOutCubic(reviewSeg(tMs, SUCCESS_C0, SUCCESS_C0 + 400));
    els.successRing.style.strokeDasharray = SUCCESS_RING_CIRC;
    els.successRing.style.strokeDashoffset = SUCCESS_RING_CIRC * (1 - ringDraw);

    /* V lines — normal: kf() interpolation over 750ms (spec §4 change 7,
       holds the last keyframe with no jump). Reduced: geometry jumps
       straight to the 100% keyframe values from C0 (spec §6), with no
       intermediate interpolation. */
    var vp = reduced ? (tMs >= SUCCESS_C0 ? 1 : 0) : reviewSeg(tMs, SUCCESS_C0, SUCCESS_C0 + 750);
    var tipG = kf(SUCCESS_TIP, vp);
    els.successTip.style.width = tipG[0] + "px";
    els.successTip.style.left = tipG[1] + "px";
    els.successTip.style.top = tipG[2] + "px";
    els.successTip.style.opacity = tipG[0] > 0 ? 1 : 0;
    var lngG = kf(SUCCESS_LONG, vp);
    els.successLong.style.width = lngG[0] + "px";
    els.successLong.style.right = lngG[1] + "px";
    els.successLong.style.top = lngG[2] + "px";
    els.successLong.style.opacity = lngG[0] > 0 ? 1 : 0;

    // §4 change 8 — hard visibility switch at C0 in normal motion; reduced
    // motion additionally fades the whole check container (spec §6 — this
    // is what makes the ring/V's own instant-jump geometry read as a reveal
    // rather than a pop).
    if (reduced) {
      els.successCheck.style.opacity = easeOutStrong(reviewSeg(tMs, SUCCESS_C0, SUCCESS_C0 + 300));
    }
    els.successCheck.style.visibility = tMs >= SUCCESS_C0 ? "visible" : "hidden";
  }

  function loaderTick() {
    if (!loaderState.active) return;
    var tMs = performance.now() - loaderState.clickTime;
    renderLoaderState(tMs, loaderState.reduced);
    // Never stops on its own — the floats loop forever (spec §4 change 5).
    loaderState.rafId = requestAnimationFrame(loaderTick);
  }

  function startLoader() {
    if (loaderState.active) return;
    loaderState.active = true;
    loaderState.reduced = !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    loaderState.clickTime = performance.now();
    els.whiteout.style.visibility = "visible";
    els.loader.style.visibility = "visible";
    loaderTick();
  }

  /* §5 routing — extends round 1's single handler on #bp-btn-primary rather
     than adding a second listener. First click: round 1's review transition
     (unchanged). Later clicks: start the loader, but only once the review
     transition has actually finished and the loader isn't already running;
     otherwise ignored. */
  function onPrimaryButtonClick() {
    if (!reviewState.started) {
      startReviewTransition();
      return;
    }
    var reviewElapsed = performance.now() - reviewState.clickTime;
    if (reviewElapsed >= 600 && !loaderState.active) {
      startLoader();
    }
  }

  /* §5 reset — instant, no animation. Cancels both animation loops, strips
     every inline style/custom property either renderer wrote (letting CSS
     defaults restore the main-table state), restores the progress label,
     and clears both once-guards so Continue works again. None of these
     elements carry inline style attributes outside what the two renderers
     write, so a full style-attribute wipe is equivalent to (and simpler
     than) removing each property by name. */
  function resetToMainTable() {
    if (reviewState.rafId) {
      cancelAnimationFrame(reviewState.rafId);
      reviewState.rafId = null;
    }
    if (loaderState.rafId) {
      cancelAnimationFrame(loaderState.rafId);
      loaderState.rafId = null;
    }

    [
      els.tableWrap, els.header, els.headerRowFields, els.footerStats,
      els.btnPrimary, els.btnSecondary, els.btnPrimaryOld, els.btnPrimaryNew,
      els.btnSecondaryOld, els.btnSecondaryNew, els.btnTertiary,
      els.headerSubtitle, els.reviewImage,
      els.whiteout, els.loader, els.loaderText, els.loaderProgress,
      els.loaderWoman, els.loaderSCircle, els.loaderBCircle, els.loaderClock,
      els.loaderProgressFill,
      // Round 3 — §5 coverage: every element renderLoaderState() writes to
      // beyond LOADER_DONE_AT must be listed here too, same wipe mechanism.
      els.loaderArt, els.loaderTextOld, els.loaderTextNew, els.btnSuccess,
      els.successCheck, els.successRing, els.successTip, els.successLong
    ].forEach(function (el) {
      el.removeAttribute("style");
    });
    els.loaderProgressLabel.textContent = "In progress (0%)";

    reviewState.started = false;
    reviewState.P0 = 0;
    reviewState.S0 = 0;
    reviewState.P1 = 0;
    loaderState.active = false;
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
    els.activityDrawer = q("#bp-activity-drawer");
    els.activityVendorName = q("#bp-activity-vendor-name");
    els.activityBillNumber = q("#bp-activity-bill-number");
    els.activityBalance = q("#bp-activity-balance");
    els.activityDue = q("#bp-activity-due");
    els.activityRail = q("#bp-activity-rail");
    els.activityTimelineContent = q("#bp-activity-timeline-content");
    renderActivityTimeline();

    els.header = q("#bp-header");
    els.headerSubtitle = q("#bp-header-subtitle");
    els.headerRowFields = q("#bp-header-row-fields");
    els.tableWrap = q("#bp-table-wrap");
    els.footerStats = q("#bp-footer-stats");
    els.reviewImage = q("#bp-review-image");
    els.btnTertiary = q("#bp-btn-tertiary");
    els.btnSecondary = q("#bp-btn-secondary");
    els.btnPrimary = q("#bp-btn-primary");
    els.btnSecondaryOld = els.btnSecondary.querySelector(".bp-btn__label--old");
    els.btnSecondaryNew = els.btnSecondary.querySelector(".bp-btn__label--new");
    els.btnPrimaryOld = els.btnPrimary.querySelector(".bp-btn__label--old");
    els.btnPrimaryNew = els.btnPrimary.querySelector(".bp-btn__label--new");
    els.headerClose = q(".bp-header__close");

    els.whiteout = q("#bp-whiteout");
    els.loader = q("#bp-loader");
    els.loaderText = q("#bp-loader-text");
    els.loaderProgress = q("#bp-loader-progress");
    els.loaderWoman = q("#bp-loader-woman");
    els.loaderSCircle = q("#bp-loader-s-circle");
    els.loaderBCircle = q("#bp-loader-b-circle");
    els.loaderClock = q("#bp-loader-clock");
    els.loaderProgressLabel = q("#bp-loader-progress-label");
    els.loaderProgressFill = q("#bp-loader-progress-fill");
    els.loaderArt = q("#bp-loader-art");
    els.loaderTextOld = q("#bp-loader-text-old");
    els.loaderTextNew = q("#bp-loader-text-new");
    els.btnSuccess = q("#bp-btn-success");
    els.successCheck = q("#bp-success-check");
    els.successRing = q("#bp-success-ring");
    els.successTip = q("#bp-success-check-tip");
    els.successLong = q("#bp-success-check-long");

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
    q("#bp-activity-close").addEventListener("click", closeActivityDrawer);

    /* §6 trigger, round 1 — first click starts the review transition.
       Round 2 (§5) extends this SAME handler (onPrimaryButtonClick) to also
       route later clicks to the loader, rather than adding a second
       listener. */
    q(".bp-footer__buttons .bp-btn--continue").addEventListener("click", onPrimaryButtonClick);

    /* §5 — X and Back both reset, but only once something is actually
       showing to reset from (review state or loader active); on the main
       table this is a no-op, per spec's "keep any existing behaviour"
       (there was none). */
    els.headerClose.addEventListener("click", function () {
      if (reviewState.started) resetToMainTable();
    });
    els.btnTertiary.addEventListener("click", function () {
      if (reviewState.started) resetToMainTable();
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
