// Build-time only: parses briefs/personetics/article-text.md (written by the text sync,
// scope doc §1) into the section list the Personetics page loops over. Nothing here ships
// to the browser. Throws on anything it can't parse, so a bad sync fails the build.
const fs = require("fs");
const path = require("path");

const SOURCE = path.join(__dirname, "..", "briefs", "personetics", "article-text.md");

const escapeHtml = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const fail = (lineNo, message) => {
  throw new Error(`article-text.md line ${lineNo}: ${message}`);
};

function parse(source) {
  // Skip the leading <!-- ... --> header comment.
  const text = source.replace(/^﻿?\s*<!--[\s\S]*?-->/, "");
  const commentLines = source.slice(0, source.length - text.length).split("\n").length - 1;
  const lines = text.split("\n");
  const lineNo = (i) => i + 1 + commentLines;

  const sections = [];
  let section = null;
  let mode = null; // "body" | "visual" | "painmap"
  let paragraph = []; // body lines of the paragraph being collected
  let visualName = null;

  const flushParagraph = (i) => {
    if (!paragraph.length) return;
    const joined = paragraph.join("\n");
    const marker = joined.match(/^\[\[VISUAL:([a-z0-9-]+)\]\]$/i);
    if (marker) {
      section.blocks.push({ type: "visual", name: marker[1] });
    } else {
      if (joined.includes("[[VISUAL")) fail(lineNo(i), "a [[VISUAL:name]] marker must be alone in its paragraph");
      const html = paragraph.map(escapeHtml).join("<br>");
      const last = section.blocks[section.blocks.length - 1];
      if (last && last.type === "text") last.paragraphs.push(html);
      else section.blocks.push({ type: "text", paragraphs: [html] });
    }
    paragraph = [];
  };

  // Pain map block (pain-map spec §2): `## pain-map` > `### tab: id` > `#### row`.
  let tab = null;
  let row = null;
  const PAIN_MAP_TABS = ["spend", "plan", "save"];

  const painMapField = (line, i) => {
    const m = line.match(/^([a-z]+): ?(.*)$/);
    if (!m) fail(lineNo(i), `unrecognised pain-map line "${line}"`);
    const key = m[1];
    const value = escapeHtml(m[2].trim());
    if (!value) fail(lineNo(i), `pain-map "${key}" is empty`);
    const target = row || tab || section.painMap;
    const allowed = row ? ["number", "title", "quote"] : tab ? ["number", "label"] : ["headline"];
    if (!allowed.includes(key)) fail(lineNo(i), `unknown pain-map key "${key}" here (allowed: ${allowed.join(", ")})`);
    if (key === "quote") row.quotes.push(value);
    else if (target[key] !== undefined) fail(lineNo(i), `duplicate pain-map "${key}"`);
    else target[key] = value;
  };

  const checkPainMap = () => {
    const pm = section.painMap;
    if (!pm) return;
    const at = pm.line;
    if (!pm.headline) fail(at, `section ${section.number}: pain-map has no headline`);
    if (pm.tabs.map((t) => t.id).join() !== PAIN_MAP_TABS.join()) {
      fail(at, `section ${section.number}: pain-map tabs must be exactly ${PAIN_MAP_TABS.join(", ")} in that order`);
    }
    for (const t of pm.tabs) {
      if (!t.number || !t.label) fail(t.line, `pain-map tab "${t.id}" needs number and label`);
      if (t.rows.length < 2 || t.rows.length > 3) fail(t.line, `pain-map tab "${t.id}" has ${t.rows.length} rows (must be 2 or 3)`);
      for (const r of t.rows) {
        if (!r.number || !r.title) fail(r.line, `pain-map row in tab "${t.id}" needs number and title`);
        if (!r.quotes.length) fail(r.line, `pain-map row "${r.title}" has no quotes`);
        delete r.line;
      }
      delete t.line;
    }
    delete pm.line;
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].replace(/\s+$/, "");

    const sectionStart = line.match(/^# (\d\d)$/);
    if (sectionStart) {
      if (section) { flushParagraph(i); checkPainMap(); }
      tab = null;
      row = null;
      const number = sectionStart[1];
      if (sections.length && number <= sections[sections.length - 1].number) {
        fail(lineNo(i), `section ${number} is out of order`);
      }
      const header = (lines[i + 1] || "").match(/^header: (.+?)\s*$/);
      const title = (lines[i + 2] || "").match(/^title: (.+?)\s*$/);
      if (!header) fail(lineNo(i + 1), `section ${number}: expected "header: ..." right after the "# ${number}" line`);
      if (!title) fail(lineNo(i + 2), `section ${number}: expected "title: ..." right after the header line`);
      section = { number, header: escapeHtml(header[1]), title: escapeHtml(title[1]), blocks: [], visuals: {} };
      sections.push(section);
      mode = "body";
      i += 2;
      continue;
    }

    if (!section) {
      if (line.trim()) fail(lineNo(i), "content before the first \"# NN\" section line");
      continue;
    }

    if (line === "## pain-map") {
      flushParagraph(i);
      if (section.painMap) fail(lineNo(i), `duplicate "## pain-map" in section ${section.number}`);
      section.painMap = { line: lineNo(i), tabs: [] };
      tab = null;
      row = null;
      mode = "painmap";
      continue;
    }

    const visualStart = line.match(/^## visual: ([a-z0-9-]+)$/i);
    if (visualStart) {
      flushParagraph(i);
      tab = null;
      row = null;
      visualName = visualStart[1];
      if (section.visuals[visualName]) fail(lineNo(i), `duplicate "## visual: ${visualName}" in section ${section.number}`);
      section.visuals[visualName] = [];
      mode = "visual";
      continue;
    }

    if (mode === "painmap") {
      const tabStart = line.match(/^### tab: ([a-z]+)$/);
      if (tabStart) {
        tab = { line: lineNo(i), id: tabStart[1], rows: [] };
        row = null;
        section.painMap.tabs.push(tab);
        continue;
      }
      if (line === "#### row") {
        if (!tab) fail(lineNo(i), `"#### row" outside a "### tab:" block`);
        row = { line: lineNo(i), quotes: [] };
        tab.rows.push(row);
        continue;
      }
    }

    if (/^#{1,6}\s/.test(line)) fail(lineNo(i), `unrecognised heading "${line}"`);

    if (mode === "painmap") {
      if (line.trim()) painMapField(line, i);
      continue;
    }

    if (mode === "visual") {
      if (line.trim()) section.visuals[visualName].push(escapeHtml(line));
    } else if (line.trim()) {
      paragraph.push(line);
    } else {
      flushParagraph(i);
    }
  }
  if (section) { flushParagraph(lines.length); checkPainMap(); }

  if (!sections.length) fail(1, "no sections found");
  for (const s of sections) {
    if (!s.blocks.length) fail(1, `section ${s.number} has no body`);
    for (const b of s.blocks) {
      if (b.type === "text" && !b.paragraphs.length) fail(1, `section ${s.number} has an empty text block`);
    }
  }
  return sections;
}

module.exports = parse(fs.readFileSync(SOURCE, "utf8"));
