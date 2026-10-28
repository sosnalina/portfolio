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
  let mode = null; // "body" | "visual"
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

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].replace(/\s+$/, "");

    const sectionStart = line.match(/^# (\d\d)$/);
    if (sectionStart) {
      if (section) flushParagraph(i);
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

    const visualStart = line.match(/^## visual: ([a-z0-9-]+)$/i);
    if (visualStart) {
      flushParagraph(i);
      visualName = visualStart[1];
      if (section.visuals[visualName]) fail(lineNo(i), `duplicate "## visual: ${visualName}" in section ${section.number}`);
      section.visuals[visualName] = [];
      mode = "visual";
      continue;
    }

    if (/^#{1,6}\s/.test(line)) fail(lineNo(i), `unrecognised heading "${line}"`);

    if (mode === "visual") {
      if (line.trim()) section.visuals[visualName].push(escapeHtml(line));
    } else if (line.trim()) {
      paragraph.push(line);
    } else {
      flushParagraph(i);
    }
  }
  if (section) flushParagraph(lines.length);

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
