(function () {
  var ILLUSTRATION_BASE = "assets/illustrations/cockpit-widget/";
  var QUOTE_MARK_SRC = "assets/icons/quote-mark.svg";
  var PAIN_POINTS_FIXED_HEIGHT = 73; // header (31px) + its gap (24px) + one collapsed tag row (18px) — the section's permanently fixed box
  var PAIN_POINTS_HEADER_SPACE = 55; // header (31px) + its gap (24px) — the drawer's collapsed top offset

  var PERSONAS = [
    { id: "finance-director", labelHtml: "Finance<br>Director", word: "cats", painPoints: ["Weak audit trail", "Failing on performance KPIs", "Missing early payment discounts", "Tool sets allow unauthorized edits", "Controls get worked around"] }, // Real content — Notion "Pain Point → Step Highlight Mapping" table, Finance Director rows
    { id: "ap-manager", labelHtml: "AP<br>Manager", word: "dogs", painPoints: ["Missing visibility on approval audit", "One bad batch stalls the whole run", "Balancing conflicting priorities", "Vendor inquiries add overhead"] }, // Real content — Notion "Pain Point → Step Highlight Mapping" table, AP Manager rows
    { id: "ap-clerk", labelHtml: "AP<br>Clerk", word: "elephant", painPoints: [3, 2, 4, 1, 3] },
    { id: "department-heads", labelHtml: "Department Heads", word: "giraffe", painPoints: [3, 2, 4] },
    { id: "procurement-manager", labelHtml: "Procurement Manager", word: "penguin", painPoints: [3, 2, 4, 1] }
  ];

  var STEPS = [
    { id: "manage-vendors", name: "Manage Vendors", subheadline: "Onboard, Create, Update", driver: "ap-clerk", escalation: ["finance-director", "procurement-manager"] },
    { id: "capture-approve-bill", name: "Capture & Approve Bill", subheadline: "Capture, Validate, Route", driver: "ap-clerk", escalation: ["ap-manager", "department-heads", "finance-director"] },
    { id: "execute-payments", name: "Execute Payments", subheadline: "Set, Prioritize, Batch", driver: "ap-manager", escalation: ["finance-director"] },
    { id: "track-manage", name: "Track & Manage", subheadline: "Monitor, Flag, Resolve", driver: "ap-manager", escalation: ["finance-director"] },
    { id: "reconcile-comply", name: "Reconcile & Comply", subheadline: "Post, Archive, Audit", driver: "finance-director", escalation: [] }
  ];

  var PERSONA_STEPS = {
    "finance-director": { driving: ["reconcile-comply"], escalating: ["manage-vendors", "capture-approve-bill", "execute-payments", "track-manage"] },
    "ap-manager": { driving: ["track-manage", "execute-payments"], escalating: ["capture-approve-bill"] },
    "ap-clerk": { driving: ["manage-vendors", "capture-approve-bill"], escalating: [] },
    "department-heads": { driving: [], escalating: ["capture-approve-bill"] },
    "procurement-manager": { driving: [], escalating: ["manage-vendors"] }
  };

  var personaById = {};
  PERSONAS.forEach(function (p) { personaById[p.id] = p; });
  var stepById = {};
  STEPS.forEach(function (s) { stepById[s.id] = s; });

  var state = {
    mode: "journey",
    journeySelectedStep: STEPS[0].id,
    journeyHoverStep: null,
    empathySelectedPersona: null,
    empathyHoverPersona: null,
    hasEnteredEmpathy: false
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
      }

      els.stepsColumn.appendChild(li);
    });
  }

  function memberVisualState(persona, activeRail) {
    if (activeRail) {
      if (state.empathyHoverPersona) {
        if (persona.id === state.empathyHoverPersona) {
          return { stateClass: "hover", illustrationState: "none", dimmed: false };
        }
        if (persona.id === state.empathySelectedPersona) {
          return { stateClass: "selected-hovering-other", illustrationState: "driver", dimmed: true };
        }
        return { stateClass: "none", illustrationState: "none", dimmed: true };
      }
      if (persona.id === state.empathySelectedPersona) {
        return { stateClass: "selected", illustrationState: "driver", dimmed: false };
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

  function renderCenterStage() {
    Array.prototype.slice.call(els.right.querySelectorAll(":scope > .cockpit-generated-content")).forEach(function (el) {
      el.remove();
    });

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
    quoteText.textContent = repeatWord(word, 12);
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
    for (var i = 0; i < 7; i++) {
      var li = document.createElement("li");
      li.textContent = repeatWord(word, 3);
      doesList.appendChild(li);
    }
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

    tagTexts.forEach(function (text) {
      expandedView.appendChild(makeTagEl(text));
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

    els.toggleTrack.addEventListener("click", function () {
      switchMode(state.mode === "journey" ? "empathy" : "journey");
    });

    renderAll();
  });
})();
