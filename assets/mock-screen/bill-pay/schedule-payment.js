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
    /* Bank-transfer / paper-check TAB ILLUSTRATIONS (Payment Tabs, bank-details
       view): Figma composes these from real exported layers, but nested 3-4
       levels deep inside `display:contents` grouping frames — each layer's
       inset% is relative to its own contents-frame, not the outer icon box,
       so naively re-flattening the raw percentages onto one box would place
       them wrong. Rather than fabricate incorrect precise coordinates, this
       renders the same real downloaded layers centered/stacked at a best-
       effort approximate scale — flagged in the build report as the one
       intentional icon-fidelity gap in this pass. */
    tabBank:
      '<span style="position:relative;display:inline-block;width:34px;height:34px">' +
      ["l1", "l2", "l3", "l4", "l5", "l6", "l7", "l8"]
        .map(function (l) {
          return '<img src="' + ICONS + "tab-bank/" + l + '.svg" alt="" style="position:absolute;inset:12%;width:76%;height:76%" />';
        })
        .join("") +
      "</span>",
    tabCheck:
      '<span style="position:relative;display:inline-block;width:24px;height:24px">' +
      ["l1", "l2", "l3", "l4"]
        .map(function (l) {
          return '<img src="' + ICONS + "tab-check/" + l + '.svg" alt="" style="position:absolute;inset:15%;width:70%;height:70%" />';
        })
        .join("") +
      "</span>"
  };

  function money(n) {
    return "$" + n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  /* ---- Row data — source of truth is the batch-full Figma template
     (node 2964:601336). All 13 rows, verbatim (including "Barmett" spelling
     as it appears in the real row instances, not the generic placeholder). */
  var ROWS = [
    { id: 1, vendor: "Barmett Lawn Care", method: "bank", last4: "3456", bill: "153", due: "08/29/25", withdraw: "08/25", arrives: "08/28", fee: 1.0, amount: 650.0, action: "Manage" },
    { id: 2, vendor: "Bluebird Office Supplies", method: "check", last4: "", bill: "1764", due: "09/06/25", withdraw: "09/02", arrives: "09/05", fee: 1.0, amount: 385.0, action: "Manage" },
    { id: 3, vendor: "Barmett Lawn Care", method: "bank", last4: "3456", bill: "154", due: "09/09/25", withdraw: "09/05", arrives: "09/08", fee: 1.0, amount: 725.0, action: "Manage" },
    { id: 4, vendor: "Good Heart Catering", method: "check", last4: "", bill: "9092", due: "09/12/25", withdraw: "09/08", arrives: "09/11", fee: 1.0, amount: 1250.0, action: "Manage" },
    { id: 5, vendor: "Greenfield Solutions", method: "bank", last4: "1278", bill: "7562", due: "09/14/25", withdraw: "09/10", arrives: "09/13", fee: 1.0, amount: 1800.0, action: "Manage" },
    { id: 6, vendor: "Red Ocean Developer", method: "bank", last4: "7989", bill: "349", due: "09/15/25", withdraw: "09/11", arrives: "09/14", fee: 1.0, amount: 1500.0, action: "Manage" },
    { id: 7, vendor: "Bluebird Office Supplies", method: "check", last4: "", bill: "1789", due: "09/16/25", withdraw: "09/12", arrives: "09/15", fee: 1.0, amount: 520.0, action: "Manage" },
    { id: 8, vendor: "Greenfield Solutions", method: "bank", last4: "1278", bill: "7562", due: "09/19/25", withdraw: "09/15", arrives: "09/18", fee: 1.0, amount: 1950.0, action: "Manage" },
    { id: 9, vendor: "Good Heart Catering", method: "check", last4: "", bill: "9095", due: "09/20/25", withdraw: "09/16", arrives: "09/19", fee: 1.0, amount: 875.0, action: "Manage" },
    { id: 10, vendor: "Barmett Lawn Care", method: "bank", last4: "3456", bill: "155", due: "09/22/25", withdraw: "09/18", arrives: "09/21", fee: 1.0, amount: 580.0, action: "Manage" },
    { id: 11, vendor: "Greenfield Solutions", method: "bank", last4: "1278", bill: "7589", due: "09/24/25", withdraw: "09/20", arrives: "09/23", fee: 1.0, amount: 1750.0, action: "Manage" },
    { id: 12, vendor: "Red Ocean Developer", method: "bank", last4: "7989", bill: "354", due: "09/25/25", withdraw: "09/21", arrives: "09/24", fee: 1.0, amount: 1650.0, action: "Manage" },
    { id: 13, vendor: "Bluebird Office Supplies", method: "check", last4: "", bill: "1790", due: "09/27/25", withdraw: "09/23", arrives: "09/26", fee: 1.0, amount: 290.0, action: "Manage" }
  ];

  /* titleStrong (Avenir Heavy/800) + titleMedium (Avenir Medium, no matching
     self-hosted weight — substituted 400/Regular) reproduce Figma's real
     two-weight title run ("Standard" Heavy + " | 3-5 business days" Medium),
     confirmed via get_design_context on the drawer container (2967:603486). */
  var DELIVERY_OPTIONS = [
    { key: "standard", titleStrong: "Standard", titleMedium: " | 3-5 business days", subtitle: "Maximum safety buffer", withdraw: "02/07", arrives: "02/12", fee: "$0.50 fee" },
    { key: "latest-safe", titleStrong: "Latest Safe", titleMedium: " | 1-2 business days", subtitle: "Optimal cash flow", withdraw: "02/11", arrives: "02/12", fee: "$10.00 fee" },
    { key: "expedited", titleStrong: "Expedited", titleMedium: " | Same day", subtitle: "Latest possible", withdraw: "02/12", arrives: "02/12", fee: "$15.00 fee" },
    { key: "custom", titleStrong: "Custom", titleMedium: "", subtitle: "Choose specific dates and delivery speed", withdraw: null, arrives: null, fee: null }
  ];

  function methodLabel(row) {
    if (row.method === "bank") return "Bank payment (ACH)..." + row.last4;
    return "Check";
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
    drawer: { open: false, row: null, view: "default" } // view: default | bank-details
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
    return (
      '<div class="bp-row" data-row-id="' + row.id + '">' +
        '<div class="bp-cell bp-cell--vendor">' +
          '<div class="bp-vendor">' +
            '<div class="bp-vendor__body">' +
              '<p class="bp-vendor__name">' + row.vendor + "</p>" +
              '<div class="bp-vendor__method">' +
                '<span class="bp-vendor__method-icon">' + GLYPH[row.method] + "</span>" +
                '<p class="bp-vendor__method-text">' + methodLabel(row) + "</p>" +
              "</div>" +
            "</div>" +
          "</div>" +
        "</div>" +
        '<div class="bp-cell bp-cell--bill"><span>' + row.bill + "</span></div>" +
        '<div class="bp-cell bp-cell--status"><span class="bp-status__check">' + GLYPH.statusCheck + '</span><span class="bp-status-text">Approved</span></div>' +
        '<div class="bp-cell bp-cell--due"><span>' + row.due + "</span></div>" +
        '<div class="bp-cell bp-cell--speed"' + narrowHideSpeed + ">" +
          '<div class="bp-speed__top"><p class="bp-speed__label">Standard</p><span class="bp-badge"><span>On time</span></span></div>' +
          '<div class="bp-speed__meta"><span>Withdraw ' + row.withdraw + "</span><span style=\"display:inline-flex\">" + GLYPH.arrow + "</span><span>Arrives " + row.arrives + "</span></div>" +
        "</div>" +
        '<div class="bp-cell bp-cell--fee"' + narrowHideSpeed + '><div class="bp-fee"><span>' + money(row.fee) + "</span><span>" + GLYPH.info + "</span></div></div>" +
        '<div class="bp-cell bp-cell--balance"><span>' + money(row.amount) + "</span></div>" +
        '<div class="bp-cell bp-cell--amount"><div class="bp-amount-field"><span>' + money(row.amount) + "</span></div></div>" +
        renderActionCell(row.action) +
      "</div>"
    );
  }

  /* Spec correction: bulk sub-rows do NOT have a Manage/Review action —
     only the vendor summary row does. Confirmed via individual pulls of all
     4 Figma sub-row variants (Component 25/26/27/28), which are otherwise
     byte-identical in structure — none render an action cell. */
  function renderSubRow(row) {
    return (
      '<div class="bp-row bp-row--sub" data-row-id="' + row.id + '">' +
        '<div class="bp-cell bp-cell--vendor" style="opacity:0"></div>' +
        '<div class="bp-cell bp-cell--bill"><span>' + row.bill + "</span></div>" +
        '<div class="bp-cell bp-cell--status"><span class="bp-status__check">' + GLYPH.statusCheck + '</span><span class="bp-status-text">Approved</span></div>' +
        '<div class="bp-cell bp-cell--due"><span>' + row.due + "</span></div>" +
        '<div class="bp-cell bp-cell--speed" data-narrow-hide style="opacity:0"></div>' +
        '<div class="bp-cell bp-cell--fee" data-narrow-hide style="opacity:0"></div>' +
        '<div class="bp-cell bp-cell--balance" style="opacity:0"></div>' +
        '<div class="bp-cell bp-cell--amount"><div class="bp-amount-field"><span>' + money(row.amount) + "</span></div></div>" +
        '<div class="bp-cell bp-cell--action"></div>' +
      "</div>"
    );
  }

  function renderVendorRow(group) {
    var expanded = !!state.expanded[group.vendor];
    var narrowHideSpeed = rowCellsCommon(true);
    var vendorRowHtml =
      '<div class="bp-row" data-vendor-row="' + group.vendor + '">' +
        '<div class="bp-cell bp-cell--vendor">' +
          '<div class="bp-vendor">' +
            '<button class="bp-vendor__chevron" type="button" data-chevron data-expanded="' + expanded + '" aria-label="Expand vendor">' +
              '<img src="' + ICONS + 'dropdown-chevron.svg" alt="" />' +
            "</button>" +
            '<div class="bp-vendor__body">' +
              '<p class="bp-vendor__name">' + group.vendor + "</p>" +
              '<div class="bp-vendor__method">' +
                '<span class="bp-vendor__method-icon">' + GLYPH[group.method] + "</span>" +
                '<p class="bp-vendor__method-text">' + methodLabel(group) + "</p>" +
              "</div>" +
            "</div>" +
          "</div>" +
        "</div>" +
        '<div class="bp-cell bp-cell--bill"><span>' + group.rows.length + "</span></div>" +
        '<div class="bp-cell bp-cell--status" style="opacity:0"></div>' +
        '<div class="bp-cell bp-cell--due" style="opacity:0"></div>' +
        '<div class="bp-cell bp-cell--speed"' + narrowHideSpeed + ">" +
          '<div class="bp-speed__top"><p class="bp-speed__label">Standard</p><span class="bp-badge"><span>On time</span></span></div>' +
        "</div>" +
        '<div class="bp-cell bp-cell--fee" style="opacity:0"' + narrowHideSpeed + "></div>" +
        '<div class="bp-cell bp-cell--balance" style="opacity:0"></div>' +
        '<div class="bp-cell bp-cell--amount"><div class="bp-amount-field"><span>' + money(group.total) + "</span></div></div>" +
        renderActionCell("Manage") +
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
  function onChevronClick(e) {
    var btn = e.currentTarget;
    var row = btn.closest(".bp-row");
    var vendor = row.getAttribute("data-vendor-row");
    var wrap = els.rowsScroll.querySelector('[data-expand-wrap="' + cssEscape(vendor) + '"]');
    var expanded = !!state.expanded[vendor];

    if (!expanded) {
      // mount content BEFORE expand starts
      var group = vendorGroups().filter(function (g) { return g.vendor === vendor; })[0];
      wrap.querySelector(".bp-expand-inner").innerHTML = group.rows.map(renderSubRow).join("");
      var natural = wrap.querySelector(".bp-expand-inner").scrollHeight;
      var duration = Math.max(225, Math.min(15 * natural, 375));
      wrap.style.height = "0px";
      wrap.style.marginTop = "14px";
      btn.setAttribute("data-expanded", "true");
      btn.removeAttribute("data-collapsing");
      btn.style.setProperty("--bp-expand-duration", duration + "ms");
      wrap.style.transition = "height " + duration + "ms var(--bp-ease-expand)";
      requestAnimationFrame(function () {
        wrap.style.height = natural + "px";
      });
      state.expanded[vendor] = true;
      var onEnd1 = function () {
        wrap.style.height = "auto";
        wrap.removeEventListener("transitionend", onEnd1);
      };
      wrap.addEventListener("transitionend", onEnd1);
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

  /* ---- §7.3 drawer + column collapse (unified motion) ---- */
  function openDrawer(payload) {
    state.drawer.open = true;
    state.drawer.row = payload;
    state.drawer.view = "default";
    els.screen.classList.add("bp-screen--narrow");
    renderDrawer();
    requestAnimationFrame(function () {
      els.screen.classList.add("bp-screen--drawer-open");
    });
    renderRows();
  }

  function closeDrawer() {
    els.screen.classList.remove("bp-screen--drawer-open");
    var onEnd = function () {
      els.screen.classList.remove("bp-screen--narrow");
      state.drawer.open = false;
      els.drawer.removeEventListener("transitionend", onEnd);
      renderRows();
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

  function renderDrawerDefault() {
    var payload = state.drawer.row;
    if (!payload) return;
    var vendor = payload.vendor;
    var method = payload.method;
    var last4 = payload.last4;
    var total = typeof payload.total === "number" ? payload.total : payload.amount;
    var billMeta = payload.bill ? "Bill no." + payload.bill + " \u2022 Payment No.348279" : payload.rows.length + " Bills \u2022 Payment No.348279";

    var html =
      '<div class="bp-drawer__head-row">' +
        '<button class="bp-drawer__back" type="button" id="bp-drawer-close" aria-label="Close">' +
          '<img src="' + ICONS + 'close.svg" alt="" />' +
        "</button>" +
        "<div>" +
          '<p class="bp-drawer__vendor">' + vendor + "</p>" +
          '<div class="bp-drawer__method">' +
            '<span style="display:inline-flex;width:15px;height:15px">' + GLYPH[method] + "</span>" +
            "<span>" + methodLabel({ method: method, last4: last4 }) + "</span>" +
            '<a id="bp-drawer-edit">Edit</a>' +
          "</div>" +
        "</div>" +
      "</div>" +
      '<div class="bp-drawer__divider"></div>' +
      '<p class="bp-drawer__total-label">Total amount paid:</p>' +
      '<p class="bp-drawer__total-amount">' + money(total) + "</p>" +
      '<p class="bp-drawer__total-meta">' + billMeta + "</p>" +
      '<div class="bp-drawer__divider"></div>' +
      '<p class="bp-drawer__section-title">Payment delivery options</p>' +
      '<div class="bp-radio-group">' +
      DELIVERY_OPTIONS.map(function (opt, idx) {
        var checked = idx === 0;
        var isCustom = opt.key === "custom";
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
                (opt.withdraw
                  ? '<div class="bp-radio-item__meta"><span>Withdraw ' + opt.withdraw + "</span>" + GLYPH.arrow + "<span>Arrives " + opt.arrives + "</span></div>"
                  : "") +
              "</div>" +
              (opt.fee ? '<p class="bp-radio-item__fee">' + opt.fee + "</p>" : "") +
            "</div>" +
          "</div>"
        );
      }).join("") +
      "</div>" +
      '<div class="bp-drawer__divider"></div>' +
      '<p class="bp-drawer__section-title bp-drawer__section-title--note">Note to vendor</p>' +
      '<textarea class="bp-note-field" placeholder="Add a note (optional)"></textarea>' +
      '<div style="height:32px"></div>';

    els.drawerInner.innerHTML = html;
    q("#bp-drawer-close").addEventListener("click", closeDrawer);
    q("#bp-drawer-edit").addEventListener("click", function () {
      swapDrawerContent("bank-details");
    });
    var radios = els.drawerInner.querySelectorAll("[data-radio]");
    for (var i = 0; i < radios.length; i++) {
      radios[i].addEventListener("click", function (e) {
        var all = els.drawerInner.querySelectorAll(".bp-radio");
        for (var k = 0; k < all.length; k++) all[k].setAttribute("data-checked", "false");
        e.currentTarget.querySelector(".bp-radio").setAttribute("data-checked", "true");
      });
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
    var emailGuess = vendor.split(" ")[0].toLowerCase() + "@example.com";
    var html =
      '<div class="bp-drawer__head-row">' +
        '<button class="bp-drawer__back" type="button" id="bp-drawer-back" aria-label="Back">' +
          '<span style="display:inline-flex;transform:rotate(90deg)">' + GLYPH.chevron + "</span>" +
        "</button>" +
        "<div>" +
          '<p class="bp-drawer__vendor">' + vendor + "</p>" +
          '<p class="bp-drawer__total-meta" style="margin-top:6px">Delivery method</p>' +
        "</div>" +
      "</div>" +
      '<div class="bp-tabs">' +
        '<div class="bp-tab" data-active="true">' + GLYPH.tabBank + "<span>Bank payment (ACH)</span></div>" +
        '<div class="bp-tab" data-active="false">' + GLYPH.tabCheck + "<span>Paper check</span></div>" +
      "</div>" +
      '<div class="bp-field bp-field--tall"><label class="bp-field__label">Pay to</label><div class="bp-field__value-box"><span>' + vendor + "</span></div></div>" +
      '<div class="bp-field">' +
        '<label class="bp-field__label">Email</label>' +
        '<div class="bp-field__value-box"><span>' + emailGuess + "</span></div>" +
        '<p class="bp-field__helper">We’ll email them with payment status updates.</p>' +
      "</div>" +
      '<div class="bp-field-row">' +
        '<div class="bp-field bp-field--zip"><label class="bp-field__label">Vendor’s ZIP code</label><div class="bp-field__value-box"><span>12345-1234</span></div></div>' +
        '<div class="bp-field bp-field--state"><label class="bp-field__label">State</label><div class="bp-field__value-box"><span>RI</span>' + GLYPH.chevron + "</div></div>" +
      "</div>" +
      '<div class="bp-field">' +
        '<label class="bp-field__label">Bank account number (5-17 digits)</label>' +
        '<div class="bp-field__value-box"><span>12345678910</span></div>' +
        '<p class="bp-field__helper">Double-check the bank info to avoid loss of funds.</p>' +
      "</div>" +
      '<div class="bp-field"><label class="bp-field__label">Routing number (9 digits)</label><div class="bp-field__value-box"><span>123456789</span></div></div>';

    els.drawerInner.innerHTML = html;
    q("#bp-drawer-back").addEventListener("click", function () {
      swapDrawerContent("default");
    });
  }

  /* ---- §6.4 / §7.4 bank-details crossfade ---- */
  function swapDrawerContent(view) {
    els.drawerInner.setAttribute("data-fading", "true");
    setTimeout(function () {
      state.drawer.view = view;
      renderDrawer();
      requestAnimationFrame(function () {
        els.drawerInner.removeAttribute("data-fading");
      });
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
    renderRows();
    updateAggregates();
  }

  /* ---- scale-to-fit (§4) ---- */
  function applyScale() {
    var w = document.documentElement.clientWidth;
    var scale = w / 1440;
    els.scaler.style.transform = "scale(" + scale + ")";
    var h = els.screen.scrollHeight;
    document.body.style.height = h * scale + "px";
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

    els.toggle.addEventListener("click", function () {
      setMode(state.mode === "batch" ? "bulk" : "batch");
    });

    /* ---- top-of-scroll fade gradient: only shown once there's content
       scrolled away above the visible area ---- */
    els.rowsScroll.addEventListener("scroll", function () {
      els.rowsScroll.classList.toggle("is-scrolled", els.rowsScroll.scrollTop > 0);
    });

    renderRows();
    updateAggregates();
    applyScale();
    window.addEventListener("resize", applyScale);
  }

  document.addEventListener("DOMContentLoaded", init);
})();
