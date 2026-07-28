(function () {
  var ILLUSTRATION_BASE = "assets/illustrations/cockpit-widget/";
  var QUOTE_MARK_SRC = "assets/icons/quote-mark.svg";
  var ALERT_ICON_SRC = "assets/icons/alert.svg";
  var PAIN_POINTS_FIXED_HEIGHT = 73; // header (31px) + its gap (24px) + one collapsed tag row (18px) — the section's permanently fixed box
  var PAIN_POINTS_HEADER_SPACE = 55; // header (31px) + its gap (24px) — the drawer's collapsed top offset

  var PERSONAS = [
    {
      id: "finance-director", labelHtml: "Finance<br>Director", word: "cats",
      // Real content — Notion "Empathy — Persona Content" table, Finance Director row
      does: ["Approve vendor activation", "Set escalation thresholds", "Set segregation of duties", "Clear escalated payments", "Oversee month-end close", "Supply audit evidence"],
      quote: "Month-end, everything piles up at once, getting escalated. In most cases, that means a hole in the process that can't be enforced",
      painPoints: ["Weak audit trail", "Failing on performance KPIs", "Missing early payment discounts", "Tool sets allow unauthorized edits", "Controls get worked around"] // Real content — Notion "Pain Point → Step Highlight Mapping" table, Finance Director rows
    },
    {
      id: "ap-manager", labelHtml: "AP<br>Manager", word: "dogs",
      // Real content — Notion "Empathy — Persona Content" table, AP Manager row
      does: ["Release payment runs", "Execute payment policies", "Escalate exceptions", "Handle vendor inquiries", "Solve approval bottlenecks"],
      quote: "A fifth of my time goes to approvals. About the same amount goes to just vendors asking where their money is. That's before I've actually paid anything",
      painPoints: ["Missing visibility on approval audit", "One bad batch stalls the whole run", "Balancing conflicting priorities", "Vendor inquiries add overhead"] // Real content — Notion "Pain Point → Step Highlight Mapping" table, AP Manager rows
    },
    {
      id: "ap-clerk", labelHtml: "AP<br>Clerk", word: "elephant",
      // Real content — Notion "Empathy — Persona Content" table, AP Clerk row
      does: ["Monitor inbound channels", "Capture & verify invoice", "Code to GL & cost center", "Match to PO/receipt", "Route to approvers", "Stage payment runs", "Resolve stalled bills"],
      quote: "Urgency is my biggest bottleneck and most time-consuming task. Resolving those is constant rework. Sometimes overloading",
      painPoints: ["Tedious & error-prone manual work", "Constant context switching", "Troubleshooting doubles the work", "Chasing reroutes and approval requests", "Stuck fixing others' errors"] // Real content — Notion "Pain Point → Step Highlight Mapping" table, AP Clerk rows
    },
    {
      id: "department-heads", labelHtml: "Department Heads", word: "giraffe",
      // Real content — Notion "Empathy — Persona Content" table, Department Heads row
      does: ["Verify business need", "Confirm receipt", "Confirm budget", "Approve/reject invoices"],
      quote: "I keep getting pulled back into fulfillment-clerk work. Sign here, don't ask why. No idea what's already been flagged or delayed before it lands on my desk",
      painPoints: ["Approval friction eats into strategic work time", "Approves without full context", "Frustrated acting as a rubber stamp"] // Real content — Notion "Pain Point → Step Highlight Mapping" table, Department Heads rows
    },
    {
      id: "procurement-manager", labelHtml: "Procurement Manager", word: "penguin",
      // Real content — Notion "Empathy — Persona Content" table, Procurement Manager row
      does: ["Negotiate & sign contract", "Approve requisitions", "Issue purchase orders", "Hand off vendor info", "Weigh in on vendor setup", "Resolve PO mismatch & escalated invoices"],
      quote: "Between email threads and manual sign-offs, things I thought were done keep resurfacing. PRs sit in limbo for weeks with no clear path to resolution",
      painPoints: ["PR-to-AP disconnect", "No clear ownership of invoice disputes", "Pulled into unresolved escalations", "Late payments risk vendor relationship/terms"] // Real content — Notion "Pain Point → Step Highlight Mapping" table, Procurement Manager rows
    }
  ];

  var STEPS = [
    {
      id: "manage-vendors", name: "Manage Vendors", subheadline: "Onboard, Create, Update", driver: "ap-clerk", escalation: ["finance-director", "procurement-manager"],
      // Real content — Notion "Journey — Step Content & Highlight Mapping" table, Manage Vendors row
      summary: "Vendor details get collected, approved, and kept current. The risk is when records are wrong or change later, unnoticed",
      tasks: ["Collect, submit, and validate supplier details (forms, banking, tax IDs)", "Route for risk-based approval", "Create/update the vendor record"],
      painPoints: ["Bank-detail changes are the highest-cost failure point, misrouting a payment entirely.", "Duplicate entries create invoice exceptions, which lead to payment reissues", "Audit can't show how approval happened"]
    },
    {
      id: "capture-approve-bill", name: "Capture & Approve Bill", subheadline: "Capture, Validate, Route", driver: "ap-clerk", escalation: ["ap-manager", "department-heads", "finance-director"],
      // Real content — Notion "Journey — Step Content & Highlight Mapping" table, Capture & Approve Bill row
      summary: "Bills come in any format or source, get checked, turned into data, and routed for approval. Any missed error stalls a bill's payment",
      tasks: [
        "Receive invoices via email, mail, portal, EDI, or manual upload",
        "Confirm the invoice is addressed to the right entity",
        "Catch if the same invoice was received twice",
        "Capture and verify invoice details: vendor, dates, amounts, line items",
        "Assign GL accounts and cost centers",
        "Match invoice to PO and receipt",
        "Route to the right approver"
      ],
      painPoints: [
        "AP staff download attachments, rename files inconsistently, save to shared drives; invoices lost in inboxes; decentralized receipt",
        "Manually reviewing invoices for duplicates; missing mandatory fields not caught early",
        "One in four invoices needs manual intervention",
        "Inconsistent manual coding; non-PO invoices hard to code; coding errors",
        "Matching PO line items to receipt line items cited as single most tedious task; ~30% of teams still cite matching errors as bottleneck",
        "When approvers go unavailable, approvals stall for days — eating ~20% of AP time."
      ]
    },
    {
      id: "execute-payments", name: "Execute Payments", subheadline: "Set, Prioritize, Batch", driver: "ap-manager", escalation: ["finance-director"],
      // Real content — Notion "Journey — Step Content & Highlight Mapping" table, Execute Payments row
      summary: "Approved bills are grouped into batches. Cost, timing, and terms get weighed against each other and the batch, before it can be scheduled",
      tasks: [
        "Set and prioritize bills to be included in each payment run",
        "Configure payment method, delivery, and deduction date, balancing them against due dates and cash flow protection",
        "Apply company policy on early-payment discounts, late-fee avoidance, and vendor terms",
        "Route escalated payments (amount threshold, new vendor, bank-detail change, off-cycle, FX) to the Controller for review; release routine payments by default"
      ],
      painPoints: [
        "A bill missing required information risks stalling or breaking the entire run.",
        "Each payment method carries different processing times and fees; without them laid out together, mistakes slip through and work slows down.",
        "Late fees or missed early-payment discounts",
        "Check runs are slow (print, stamp, mail)",
        "Prefunding and settlement complexity",
        "Without automation to enforce a company's segregation-of-duty rules, the business is exposed to fraud risk and duplicate payments."
      ]
    },
    {
      id: "track-manage", name: "Track & Manage", subheadline: "Monitor, Flag, Resolve", driver: "ap-manager", escalation: ["finance-director"],
      // Real content — Notion "Journey — Step Content & Highlight Mapping" table, Track & Manage row
      summary: "Failed payments sit blocked until corrected. Without knowing which bill or vendor caused it, and why, there's nothing to act on",
      tasks: [
        "Check a payment's real time status and transaction history (scheduled → processing → sent → paid)",
        "Resolve a failed or returned payment: identify it, log it, contact the vendor, and reissue it",
        "Quickly cancel or void a payment when needed",
        "Track payment through pre-execution, execution, and post-execution states; reconcile differing views across AP workflow, provider, and bank settlement (lifecycle reconciliation)"
      ],
      painPoints: [
        "Failed payments sit blocked until someone manually digs in and fixes them manually.",
        "Understanding what caused a payment failure, which bill or vendor, and why, is manual, time-consuming work with no explanation surfaced automatically.",
        "A payment provider marking something \"complete\" doesn't mean the vendor's bank has actually received the funds yet."
      ]
    },
    {
      id: "reconcile-comply", name: "Reconcile & Comply", subheadline: "Post, Archive, Audit", driver: "finance-director", escalation: [],
      // Real content — Notion "Journey — Step Content & Highlight Mapping" table, Reconcile & Comply row
      summary: "Every paid bill gets posted and filed for record. Stale data can break that sync, and gaps in the trail mean manual digging later",
      tasks: [
        "Post/write approved invoice + payment status back to ERP; two-way sync (posting)",
        "Store invoice, PO, receipt, proof of payment; reconcile AP ledger; retain for audit (reconciliation/archival)",
        "Supply audit evidence linking a released payment back to its approved invoice and approval trail, as part of reconciliation integrity"
      ],
      painPoints: [
        "Second-pass errors; managing sync jobs creates overhead; stale master data breaks integrations (posting)",
        "Manual searches; no real-time analytics; audit trail gaps (reconciliation/archival)"
      ]
    }
  ];

  var PERSONA_STEPS = {
    "finance-director": { driving: ["reconcile-comply"], escalating: ["manage-vendors", "capture-approve-bill", "execute-payments", "track-manage"] },
    "ap-manager": { driving: ["track-manage", "execute-payments"], escalating: ["capture-approve-bill"] },
    "ap-clerk": { driving: ["manage-vendors", "capture-approve-bill"], escalating: [] },
    "department-heads": { driving: [], escalating: ["capture-approve-bill"] },
    "procurement-manager": { driving: [], escalating: ["manage-vendors"] }
  };

  // Real content — Notion "Pain Point → Step Highlight Mapping" table (Table 3):
  // per-pain-point mapping of either the step(s) it affects, or, for strategic
  // pain points, the persona(s) it strategically affects.
  var PAIN_POINT_HOVER_MAP = {
    "Approves without full context": { strategic: false, steps: ["Capture & Approve Bill"] },
    "Weak audit trail": { strategic: false, steps: ["Manage Vendors", "Reconcile & Comply"] },
    "Troubleshooting doubles the work": { strategic: false, steps: ["Execute Payments"] },
    "Late payments risk vendor relationship/terms": { strategic: true, personas: ["procurement-manager"] },
    "Approval friction eats into strategic work time": { strategic: true, personas: ["department-heads"] },
    "Failing on performance KPIs": { strategic: true, personas: ["ap-manager", "ap-clerk", "finance-director"] },
    "No clear ownership of invoice disputes": { strategic: false, steps: ["Manage Vendors", "Capture & Approve Bill"] },
    "Missing early payment discounts": { strategic: true, personas: ["finance-director", "department-heads"] },
    "PR-to-AP disconnect": { strategic: false, steps: ["Capture & Approve Bill"] },
    "Missing visibility on approval audit": { strategic: false, steps: ["Execute Payments"] },
    "Stuck fixing others' errors": { strategic: false, steps: ["Execute Payments"] },
    "Tool sets allow unauthorized edits": { strategic: false, steps: ["Execute Payments"] },
    "One bad batch stalls the whole run": { strategic: false, steps: ["Execute Payments"] },
    "Tedious & error-prone manual work": { strategic: false, steps: ["Manage Vendors", "Capture & Approve Bill"] },
    "Constant context switching": { strategic: false, steps: ["Manage Vendors", "Capture & Approve Bill"] },
    "Controls get worked around": { strategic: false, steps: ["Capture & Approve Bill", "Execute Payments", "Manage Vendors"] },
    "Pulled into unresolved escalations": { strategic: true, personas: ["procurement-manager"] },
    "Balancing conflicting priorities": { strategic: false, steps: ["Execute Payments"] },
    "Vendor inquiries add overhead": { strategic: true, personas: ["ap-manager"] },
    "Frustrated acting as a rubber stamp": { strategic: true, personas: ["department-heads"] },
    "Chasing reroutes and approval requests": { strategic: false, steps: ["Capture & Approve Bill", "Execute Payments"] }
  };

  var personaById = {};
  PERSONAS.forEach(function (p) { personaById[p.id] = p; });
  var stepById = {};
  STEPS.forEach(function (s) { stepById[s.id] = s; });
  var stepIdByName = {};
  STEPS.forEach(function (s) { stepIdByName[s.name] = s.id; });

  var state = {
    mode: "journey",
    journeySelectedStep: STEPS[0].id,
    journeyHoverStep: null,
    empathySelectedPersona: null,
    empathyHoverPersona: null,
    hasEnteredEmpathy: false,
    painPointHover: null
  };

  var els = {};

  function repeatWord(word, count) {
    var cap = word.charAt(0).toUpperCase() + word.slice(1);
    var words = [cap];
    for (var i = 1; i < count; i++) words.push(word);
    return words.join(" ") + ".";
  }

  function stepStateClass(step, activeRail) {
    if (activeRail) {
      if (step.id === state.journeyHoverStep && step.id !== state.journeySelectedStep) return "hover";
      if (step.id === state.journeySelectedStep && state.journeyHoverStep && state.journeyHoverStep !== step.id) return "selected-hovering-other";
      if (step.id === state.journeySelectedStep) return "selected";
      return "normal";
    }
    if (state.painPointHover) {
      if (state.painPointHover.strategic) return "normal";
      if (state.painPointHover.stepIds.indexOf(step.id) !== -1) return "pain-point-hover";
      return "normal";
    }
    var persona = state.empathySelectedPersona ? PERSONA_STEPS[state.empathySelectedPersona] : null;
    if (persona && persona.driving.indexOf(step.id) !== -1) return "driver";
    if (persona && persona.escalating.indexOf(step.id) !== -1) return "escalation";
    return "normal";
  }

  function updateStepClasses() {
    var activeRail = state.mode === "journey";
    Array.prototype.forEach.call(els.stepsColumn.children, function (li) {
      var step = stepById[li.dataset.stepId];
      li.className = "cockpit-step cockpit-step--" + stepStateClass(step, activeRail);
    });
  }

  function renderStepsRail() {
    var activeRail = state.mode === "journey";
    els.stepsColumn.classList.toggle("cockpit-steps-column--active", activeRail);
    els.stepsColumn.innerHTML = "";

    if (activeRail) {
      var selectedIndex = STEPS.findIndex(function (s) { return s.id === state.journeySelectedStep; });
      els.selectedBg.style.top = selectedIndex * 70 + "px";
      els.selectedBg.classList.remove("cockpit-selected-bg--hidden");
    } else {
      els.selectedBg.classList.add("cockpit-selected-bg--hidden");
    }

    STEPS.forEach(function (step) {
      var li = document.createElement("li");
      li.dataset.stepId = step.id;
      li.className = "cockpit-step cockpit-step--" + stepStateClass(step, activeRail);

      var dot = document.createElement("span");
      dot.className = "cockpit-step__dot";
      li.appendChild(dot);

      var body = document.createElement("div");
      body.className = "cockpit-step__body";

      var title = document.createElement("p");
      title.className = "cockpit-step__title";
      title.textContent = step.name;
      body.appendChild(title);

      var subtitle = document.createElement("p");
      subtitle.className = "cockpit-step__subtitle";
      subtitle.textContent = step.subheadline;
      body.appendChild(subtitle);

      li.appendChild(body);

      if (activeRail) {
        li.addEventListener("click", function () {
          state.journeySelectedStep = step.id;
          state.journeyHoverStep = null;
          renderAll();
        });
        li.addEventListener("mouseenter", function () {
          if (step.id === state.journeySelectedStep) return;
          state.journeyHoverStep = step.id;
          updateStepClasses();
        });
        li.addEventListener("mouseleave", function () {
          state.journeyHoverStep = null;
          updateStepClasses();
        });
      } else {
        li.addEventListener("click", triggerThumbPeek);
      }

      els.stepsColumn.appendChild(li);
    });
  }

  function memberVisualState(persona, activeRail) {
    if (activeRail) {
      if (state.painPointHover && state.painPointHover.strategic) {
        var isSelected = persona.id === state.empathySelectedPersona;
        var isStrategicMatch = state.painPointHover.personas.indexOf(persona.id) !== -1;
        if (isStrategicMatch) {
          return { stateClass: isSelected ? "selected-strategic" : "strategic", illustrationState: "strategic", dimmed: false };
        }
        if (isSelected) {
          return { stateClass: "selected", illustrationState: "none", dimmed: false };
        }
        return { stateClass: "none", illustrationState: "none", dimmed: true };
      }
      if (state.empathyHoverPersona) {
        if (persona.id === state.empathyHoverPersona) {
          return { stateClass: "hover", illustrationState: "none", dimmed: false };
        }
        if (persona.id === state.empathySelectedPersona) {
          return { stateClass: "selected-hovering-other", illustrationState: "none", dimmed: true };
        }
        return { stateClass: "none", illustrationState: "none", dimmed: true };
      }
      if (persona.id === state.empathySelectedPersona) {
        return { stateClass: "selected", illustrationState: "none", dimmed: false };
      }
      return { stateClass: "none", illustrationState: "none", dimmed: true };
    }
    var step = stepById[state.journeySelectedStep];
    if (step.driver === persona.id) {
      return { stateClass: "driver", illustrationState: "driver", dimmed: false };
    }
    if (step.escalation.indexOf(persona.id) !== -1) {
      return { stateClass: "escalation", illustrationState: "escalation", dimmed: false };
    }
    return { stateClass: "none", illustrationState: "none", dimmed: true };
  }

  function updateMemberClasses() {
    var activeRail = state.mode === "empathy";
    Array.prototype.forEach.call(els.memberRow.children, function (member) {
      var persona = personaById[member.dataset.personaId];
      var visual = memberVisualState(persona, activeRail);
      member.className = "cockpit-member cockpit-member--" + visual.stateClass + (visual.dimmed ? " cockpit-member--dimmed" : "");
      member.querySelector("img").src = ILLUSTRATION_BASE + persona.id + "-" + visual.illustrationState + ".png";
    });
  }

  function renderMembersRail() {
    var activeRail = state.mode === "empathy";
    els.membersRail.classList.toggle("cockpit-members-rail--active", activeRail);
    els.memberRow.innerHTML = "";

    PERSONAS.forEach(function (persona) {
      var visual = memberVisualState(persona, activeRail);

      var member = document.createElement("div");
      member.dataset.personaId = persona.id;
      member.className = "cockpit-member cockpit-member--" + visual.stateClass + (visual.dimmed ? " cockpit-member--dimmed" : "");

      var avatar = document.createElement("div");
      avatar.className = "cockpit-member__avatar";
      var img = document.createElement("img");
      img.src = ILLUSTRATION_BASE + persona.id + "-" + visual.illustrationState + ".png";
      img.alt = persona.labelHtml.replace("<br>", " ") + " illustration";
      avatar.appendChild(img);
      member.appendChild(avatar);

      var label = document.createElement("p");
      label.className = "cockpit-member__label";
      label.innerHTML = persona.labelHtml;
      member.appendChild(label);

      if (activeRail) {
        member.addEventListener("click", function () {
          state.empathySelectedPersona = persona.id;
          state.empathyHoverPersona = null;
          renderAll();
        });
        member.addEventListener("mouseenter", function () {
          if (persona.id === state.empathySelectedPersona) return;
          state.empathyHoverPersona = persona.id;
          updateMemberClasses();
        });
        member.addEventListener("mouseleave", function () {
          state.empathyHoverPersona = null;
          updateMemberClasses();
        });
      } else {
        member.addEventListener("click", triggerThumbPeek);
      }

      els.memberRow.appendChild(member);
    });

    var highlightPersonaId = activeRail ? state.empathySelectedPersona : null;

    if (highlightPersonaId) {
      var index = PERSONAS.findIndex(function (p) { return p.id === highlightPersonaId; });
      els.highlightFill.classList.add("cockpit-highlight-track__fill--visible");
      els.highlightFill.style.transform = "translateX(" + index * 100 + "%)";
    } else {
      els.highlightFill.classList.remove("cockpit-highlight-track__fill--visible");
    }
  }

  function renderJourneyStage() {
    var step = stepById[state.journeySelectedStep];

    var stage = document.createElement("div");
    stage.className = "cockpit-journey-stage cockpit-generated-content";

    var body = document.createElement("div");
    body.className = "cockpit-journey-stage__body";

    var bodyTop = document.createElement("div");
    bodyTop.className = "cockpit-journey-stage__body-top";

    var leftColumn = document.createElement("div");
    leftColumn.className = "cockpit-journey-stage__left-column";

    var summary = document.createElement("p");
    summary.className = "cockpit-journey-stage__summary";
    summary.textContent = step.summary;
    leftColumn.appendChild(summary);

    var tasksHeader = document.createElement("div");
    tasksHeader.className = "cockpit-widget-subheader";
    tasksHeader.innerHTML =
      '<p class="cockpit-widget-subheader__title">Tasks</p><div class="cockpit-widget-subheader__divider"></div>';
    leftColumn.appendChild(tasksHeader);

    var tasksList = document.createElement("div");
    tasksList.className = "cockpit-journey-stage__tasks";
    step.tasks.forEach(function (text) {
      var p = document.createElement("p");
      p.textContent = text;
      tasksList.appendChild(p);
    });
    leftColumn.appendChild(tasksList);

    bodyTop.appendChild(leftColumn);

    var divider = document.createElement("div");
    divider.className = "cockpit-quote-divider";
    bodyTop.appendChild(divider);

    var rightColumn = document.createElement("div");
    rightColumn.className = "cockpit-does-column";

    var painHeader = document.createElement("div");
    painHeader.className = "cockpit-widget-subheader";
    painHeader.innerHTML =
      '<p class="cockpit-widget-subheader__title">Frictions</p><div class="cockpit-widget-subheader__divider"></div>';
    rightColumn.appendChild(painHeader);

    var painList = document.createElement("div");
    painList.className = "cockpit-journey-stage__tasks";
    step.painPoints.forEach(function (text) {
      var p = document.createElement("p");
      p.textContent = text;
      painList.appendChild(p);
    });
    rightColumn.appendChild(painList);

    bodyTop.appendChild(rightColumn);

    body.appendChild(bodyTop);
    stage.appendChild(body);

    var footer = document.createElement("div");
    footer.className = "cockpit-journey-stage__footer";
    footer.innerHTML =
      '<div class="cockpit-section-divider"></div>' +
      '<div class="cockpit-journey-stage__legend">' +
      '<img class="cockpit-journey-stage__legend-icon" src="' + ALERT_ICON_SRC + '" alt="" />' +
      '<p class="cockpit-journey-stage__legend-label">Approval / Escalation</p>' +
      "</div>";
    stage.appendChild(footer);

    els.right.appendChild(stage);

    // Scroll-gradient cue: only show it when the body actually overflows.
    if (body.scrollHeight > body.clientHeight) {
      body.classList.add("cockpit-journey-stage__body--overflowing");
    }
  }

  function renderCenterStage() {
    Array.prototype.slice.call(els.right.querySelectorAll(":scope > .cockpit-generated-content")).forEach(function (el) {
      el.remove();
    });

    if (state.mode === "journey") {
      renderJourneyStage();
      return;
    }

    if (state.mode !== "empathy" || !state.empathySelectedPersona) return;

    var persona = personaById[state.empathySelectedPersona];
    var word = persona.word;

    var bodyTop = document.createElement("div");
    bodyTop.className = "cockpit-body-top cockpit-generated-content";

    var quoteBlock = document.createElement("div");
    quoteBlock.className = "cockpit-quote-block";
    var quoteMark = document.createElement("img");
    quoteMark.className = "cockpit-quote-mark";
    quoteMark.src = QUOTE_MARK_SRC;
    quoteMark.alt = "";
    quoteBlock.appendChild(quoteMark);
    var quoteText = document.createElement("p");
    quoteText.className = "cockpit-quote-text";
    quoteText.textContent = persona.quote;
    quoteBlock.appendChild(quoteText);
    bodyTop.appendChild(quoteBlock);

    var quoteDivider = document.createElement("div");
    quoteDivider.className = "cockpit-quote-divider";
    bodyTop.appendChild(quoteDivider);

    var doesColumn = document.createElement("div");
    doesColumn.className = "cockpit-does-column";
    doesColumn.innerHTML =
      '<div class="cockpit-widget-subheader"><p class="cockpit-widget-subheader__title">Does</p><div class="cockpit-widget-subheader__divider"></div></div>';
    var doesList = document.createElement("ol");
    doesList.className = "cockpit-does-list";
    persona.does.forEach(function (text) {
      var li = document.createElement("li");
      li.textContent = text;
      doesList.appendChild(li);
    });
    doesColumn.appendChild(doesList);
    bodyTop.appendChild(doesColumn);

    els.right.appendChild(bodyTop);

    var sectionDivider = document.createElement("div");
    sectionDivider.className = "cockpit-section-divider cockpit-generated-content";
    els.right.appendChild(sectionDivider);

    var painPoints = document.createElement("div");
    painPoints.className = "cockpit-pain-points cockpit-generated-content";

    var header = document.createElement("div");
    header.className = "cockpit-pain-points__header";
    header.innerHTML =
      '<div class="cockpit-widget-subheader"><p class="cockpit-widget-subheader__title">Pain points</p><div class="cockpit-widget-subheader__divider"></div></div>';
    painPoints.appendChild(header);

    var drawer = document.createElement("div");
    drawer.className = "cockpit-pain-points__drawer";

    var collapsedView = document.createElement("div");
    collapsedView.className = "cockpit-pain-points__view cockpit-pain-points__view--collapsed";

    var expandedView = document.createElement("div");
    expandedView.className = "cockpit-pain-points__view cockpit-pain-points__view--expanded";

    drawer.appendChild(collapsedView);
    drawer.appendChild(expandedView);
    painPoints.appendChild(drawer);

    els.right.appendChild(painPoints);

    var tagTexts = persona.painPoints.map(function (item) {
      return typeof item === "string" ? item : repeatWord(word, item).replace(/\.$/, "");
    });

    function makeTagEl(text) {
      var tag = document.createElement("div");
      tag.className = "cockpit-tag";
      tag.innerHTML = '<p class="cockpit-tag__label">' + text + "</p>";
      return tag;
    }

    var tagHoverLeaveTimer = null;

    tagTexts.forEach(function (text) {
      var tagEl = makeTagEl(text);
      tagEl.addEventListener("mouseenter", function () {
        clearTimeout(tagHoverLeaveTimer);
        var mapping = PAIN_POINT_HOVER_MAP[text];
        if (!mapping) {
          console.warn('No pain-point hover mapping found for: "' + text + '"');
          return;
        }
        if (mapping.strategic) {
          state.painPointHover = { strategic: true, personas: mapping.personas };
        } else {
          state.painPointHover = {
            strategic: false,
            stepIds: mapping.steps.map(function (name) { return stepIdByName[name]; })
          };
        }
        updateStepClasses();
        updateMemberClasses();
      });
      tagEl.addEventListener("mouseleave", function () {
        tagHoverLeaveTimer = setTimeout(function () {
          state.painPointHover = null;
          updateStepClasses();
          updateMemberClasses();
        }, 120);
      });
      expandedView.appendChild(tagEl);
    });

    var shown = [];
    var firstRowTop = null;
    for (var i = 0; i < tagTexts.length; i++) {
      var tagEl = makeTagEl(tagTexts[i]);
      collapsedView.appendChild(tagEl);
      var top = tagEl.offsetTop;
      if (firstRowTop === null) firstRowTop = top;
      if (top > firstRowTop) {
        collapsedView.removeChild(tagEl);
        break;
      }
      shown.push(tagEl);
    }

    var hiddenCount = tagTexts.length - shown.length;
    if (hiddenCount > 0) {
      var chip = document.createElement("div");
      chip.className = "cockpit-tag cockpit-tag--number";
      chip.innerHTML = '<p class="cockpit-tag__label">+' + hiddenCount + "</p>";
      collapsedView.appendChild(chip);
      while (chip.offsetTop > firstRowTop && shown.length > 0) {
        var last = shown.pop();
        collapsedView.removeChild(last);
        hiddenCount++;
        chip.querySelector(".cockpit-tag__label").textContent = "+" + hiddenCount;
      }
    }

    var expandedHeight = expandedView.scrollHeight;
    var expandedTop = (PAIN_POINTS_FIXED_HEIGHT - expandedHeight) / 2;
    var collapseTimer = null;

    function expandPainPoints() {
      clearTimeout(collapseTimer);
      painPoints.classList.add("cockpit-pain-points--expanded");
      drawer.style.top = expandedTop + "px";
      drawer.style.height = expandedHeight + "px";
      // Re-asserting overflow inline (redundant with the CSS rule) works around a
      // rendering bug where this element's computed top/height silently stick at
      // their old values otherwise, inside a fixed-size overflow:hidden ancestor.
      drawer.style.overflow = "hidden";
    }

    function collapsePainPoints() {
      painPoints.classList.remove("cockpit-pain-points--expanded");
      drawer.style.top = PAIN_POINTS_HEADER_SPACE + "px";
      drawer.style.height = "18px";
      drawer.style.overflow = "hidden";
    }

    if (hiddenCount > 0) {
      painPoints.addEventListener("mouseenter", expandPainPoints);
      painPoints.addEventListener("mouseleave", function () {
        collapseTimer = setTimeout(collapsePainPoints, 120);
      });
    }
  }

  function renderToggle() {
    var isEmpathy = state.mode === "empathy";
    els.toggleTrack.classList.toggle("journey", !isEmpathy);
    els.toggleTrack.classList.toggle("empathy", isEmpathy);
  }

  var thumbPeeking = false;

  function triggerThumbPeek() {
    if (thumbPeeking) return;
    thumbPeeking = true;
    var animationName = state.mode === "empathy" ? "thumbPeekLeft" : "thumbPeekRight";
    els.togglePill.style.animation = animationName + " 420ms ease-out both";
    setTimeout(function () {
      els.togglePill.style.animation = "none";
      thumbPeeking = false;
    }, 480);
  }

  function renderAll() {
    renderStepsRail();
    renderMembersRail();
    renderCenterStage();
    renderToggle();
  }

  function switchMode(newMode) {
    if (newMode === state.mode) return;
    state.mode = newMode;
    state.journeyHoverStep = null;
    state.empathyHoverPersona = null;
    if (newMode === "empathy" && !state.hasEnteredEmpathy) {
      state.empathySelectedPersona = PERSONAS[0].id;
      state.hasEnteredEmpathy = true;
    }
    renderAll();
  }

  document.addEventListener("DOMContentLoaded", function () {
    els.stepsColumn = document.getElementById("cockpit-steps-column");
    els.selectedBg = document.getElementById("cockpit-selected-bg");
    els.membersRail = document.getElementById("cockpit-members-rail");
    els.memberRow = document.getElementById("cockpit-member-row");
    els.highlightFill = document.getElementById("cockpit-highlight-fill");
    els.right = document.getElementById("cockpit-right");
    els.toggleTrack = document.getElementById("cockpit-toggle-track");
    els.togglePill = document.querySelector(".cockpit-toggle__pill");

    els.toggleTrack.addEventListener("click", function () {
      switchMode(state.mode === "journey" ? "empathy" : "journey");
    });

    renderAll();
  });
})();
