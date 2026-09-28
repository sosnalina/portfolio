(function () {
// ================= easing =================
function bezier(x1, y1, x2, y2) {
  const cx = 3*x1, bx = 3*(x2-x1)-cx, ax = 1-cx-bx, cy = 3*y1, by = 3*(y2-y1)-cy, ay = 1-cy-by;
  const X = s => ((ax*s+bx)*s+cx)*s, Y = s => ((ay*s+by)*s+cy)*s;
  return t => { if (t <= 0) return 0; if (t >= 1) return 1; let lo = 0, hi = 1, s = t;
    for (let i = 0; i < 28; i++) { s = (lo+hi)/2; if (X(s) < t) lo = s; else hi = s; } return Y(s); };
}
const SLIDE = bezier(0.65, 0, 0, 1);            // measured tile move
const POP   = bezier(0.175, 0.885, 0.32, 1.275);// project entrance overshoot
const OUT   = bezier(0.23, 1, 0.32, 1);         // strong ease-out
const SPLIT = bezier(0.16, 1, 0.3, 1);          // ui bits SplitText curve
const DROP  = bezier(0.34, 1.8, 0.64, 1);       // springy overshoot
const SLAM  = bezier(0.55, 0, 0.9, 0.3);        // stamp slam
const clamp = v => Math.max(0, Math.min(1, v));
const prog = (t, t0, d) => clamp((t - t0) / d);
const lerp = (a, b, p) => a + (b - a) * p;

// ================= stage = crop of the Figma frame =================
// All coordinates below are Figma frame coordinates (frame 1425:23641, 1440 wide).
const X0 = 0, Y0 = 0, W = 1440;

// ================= words (final boxes straight from Figma) =================
// kf1: where the word sits in the first keyframe (only where it differs)
const WORDS = {
  When:       { text: 'When',        x: 488, y: 241, w: 165, fx: 'blur',     t: 4.365 },
  simplicity: { text: ' simplicity', x: 559, y: 297, w: 289, fx: 'track',    t: 0.15, kf1: { x: 489, y: 297 }, move: { t: 4.015, d: 0.45 } },
  is:         { text: ' is',         x: 566, y: 366, w: 59,  fx: 'stamp',    t: 0.55 },
  the:        { text: 'the',         x: 481, y: 435, w: 90,  fx: 'type',     t: 0.86, kf1: { x: 675, y: 366 }, move: { t: 3.765, d: 0.55, L: true } },
  not:        { text: ' not',        x: 658, y: 366, w: 105, fx: 'weight',   t: 4.845 },
  right:      { text: ' right',      x: 571, y: 435, w: 154, fx: 'pop',      t: 4.265 },
  design:     { text: ' design',     x: 725, y: 435, w: 194, fx: 'mask',     t: 1.60, kf1: { x: 731, y: 435 }, move: { t: 3.865, d: 0.45 } },
  strategy:   { text: '  strategy',  x: 562, y: 505, w: 255, fx: 'scramble', t: 2.04, kf1: { x: 568, y: 505 }, move: { t: 4.085, d: 0.40 } },
};

function wordPos(id, t) {
  const w = WORDS[id], m = w.move;
  if (!m) return { x: w.x, y: w.y };
  const a = w.kf1, b = w, p = SLIDE(prog(t, m.t, m.d));
  if (m.L) { // drop a row first, then across — one easing over the whole path
    const dy = Math.abs(b.y - a.y), dx = Math.abs(b.x - a.x), d = p * (dx + dy);
    return d <= dy ? { x: a.x, y: a.y + Math.sign(b.y - a.y) * d } : { x: a.x + Math.sign(b.x - a.x) * (d - dy), y: b.y };
  }
  return { x: lerp(a.x, b.x, p), y: lerp(a.y, b.y, p) };
}
function nudge(id, t) { // neighbours get shoved when "right" lands
  const k = prog(t, WORDS.right.t + 0.12, 0.34);
  if (k <= 0 || k >= 1) return 0;
  const amp = 7 * Math.sin(Math.PI * k) * (1 - k);
  return id === 'the' ? -amp : id === 'design' ? amp : 0;
}

const TYPE_STEP = 0.06, SCRAMBLE = 'abcdefghijklmnopqrstuvwxyz';
function charStyle(w, i, t) {
  const n = w.chars.length, t0 = w.t, ch = w.text[i];
  switch (w.fx) {
    case 'track': { const e = SPLIT(prog(t, t0, 0.45)), off = (i - (n - 1) / 2) * 0.32 * (1 - e);
      return { o: clamp(e * 1.6), tf: `translateX(${off}em)`, blur: (1 - e) * 9 }; }
    case 'pop': { const p = prog(t, t0, 0.32);
      return { o: clamp(p * 4), tf: `scale(${lerp(0.5, 1, POP(p))})` }; }
    case 'type': return { o: t >= t0 + i * TYPE_STEP ? 1 : 0, tf: 'none' };
    case 'mask': { const st = t0 + i * 0.025, p = OUT(prog(t, st, 0.42));
      return { o: t < st ? 0 : 1, tf: `translateY(${(1 - p) * 140}%)` }; }
    case 'scramble': {
      if (t < t0) return { o: 0, tf: 'none' };
      const p = prog(t, t0, 0.45);
      if (ch === ' ' || i < p * n || p >= 1) return { o: 1, tf: 'none', text: ch };
      const f = Math.floor(t * 20), h = ((i + 1) * 73856093 ^ f * 19349663) >>> 0;
      return { o: 1, tf: 'none', text: SCRAMBLE[h % SCRAMBLE.length] }; }
    case 'blur': { const e = OUT(prog(t, t0 + i * 0.045, 0.4));
      return { o: e, tf: `translateY(${(1 - e) * 22}px)`, blur: (1 - e) * 10 }; }
    default: return { o: 1, tf: 'none' };
  }
}
function wordFx(w, t) {
  if (w.fx === 'stamp') { const p = prog(t, w.t, 0.16), e = SLAM(p), k = prog(t, w.t + 0.16, 0.26);
    const shake = k > 0 && k < 1 ? Math.sin(k * 30) * 4 * (1 - k) : 0;
    return { o: p > 0 ? 1 : 0, tf: ` translateX(${shake}px) scale(${1.45 - 0.45 * e}) rotate(${-9 * (1 - e)}deg)` }; }
  if (w.fx === 'weight') { const a = POP(prog(t, w.t, 0.22)), b = OUT(prog(t, w.t + 0.22, 0.28));
    return { o: clamp(prog(t, w.t, 0.5) * 5), tf: '', wt: Math.round(t < w.t + 0.22 ? 200 + 600 * a : 800 - 400 * b) }; } // settles at the hero's regular 400
  return { o: 1, tf: '' };
}

// ================= objects =================
// b: Figma render bounds [x, y, w, h]. Brush strokes (dots, underline, slash) and the arrow are Figma SVG exports.
// Bubble, pile, buildings, checkbox, coin and stars are placeholders sized to their Figma bounds.
const DOT_PATH = 'M144.9 352.4C148 349.3 149.8 349.7 150.2 353.4C150.7 357.7 148.5 362 145.9 362C141.7 362 141.1 356.2 144.9 352.4ZM233.6 300.8C235.2 299.8 235.1 299.8 239.6 301C246.1 302.8 242.8 311.4 236.1 310.1C232.5 309.3 230.7 302.7 233.6 300.8ZM115 291.6C115.9 290.8 121.7 290.8 123.8 291.6C127.9 293.2 123.8 301 118.9 301C115.4 301 112.6 294.1 115 291.6ZM175 267.8C178 264.6 182.8 265.7 183.2 269.7C183.5 273.4 180.1 276.4 176.2 275.8C173.2 275.4 172.5 270.6 175 267.8ZM300.6 259.5C303.3 257.7 305.5 257.6 307.2 259.2C311 263 305 270.3 300.1 267.8C297.6 266.5 297.9 261.5 300.6 259.5ZM65 258.1C67.3 254.8 73.1 255.2 74 258.7C74.8 261.8 70.5 266.3 67.1 265.8C64.3 265.4 63.1 260.8 65 258.1ZM1.6 232.2C4.1 229.6 7.6 229.3 9.4 231.5C12.2 234.9 7 241.5 2.4 240.3C-0.4 239.5 -0.9 234.9 1.6 232.2ZM227.3 227C231.3 223 237.2 225.6 235.4 230.5C234.2 233.6 231.8 235.2 228.7 234.8C225 234.4 224.3 230.1 227.3 227ZM178.4 211.7C181.5 210.5 185.3 212.7 185.4 215.8C185.4 217.7 180.7 222 178.6 222C173.2 222 173.1 213.8 178.4 211.7ZM137.6 210.3C140.6 207.1 142.8 207.7 143.2 211.8C143.6 215.7 141.1 220 138.5 220C134.8 220 134.3 213.8 137.6 210.3ZM104.7 201.9C111.2 197.9 114.6 200.1 112.5 206.9C111.2 211.4 108.8 213.7 104.7 214.6C98.8 215.7 98.8 205.5 104.7 201.9ZM156.5 182.5C159.5 178.7 163 179.1 164.3 183.5C166 189.8 163.1 196 158.4 196C152.1 196 151.1 189.4 156.5 182.5ZM332.1 178.4C334.3 175.4 337.7 175.6 338.2 178.8C338.6 181.8 336.6 186.7 334.7 187.4C330.7 188.9 329 182.8 332.1 178.4ZM134.3 177C140.1 177 142 179.2 139.6 183.3C135.8 189.9 127.9 186.9 129.8 179.6C130.3 177.3 131 177 134.3 177ZM180.8 170.5C187.4 163.9 194.4 171.2 189.9 180C188 183.5 185.2 184.5 181.6 182.8C177.6 180.9 177.2 174.1 180.8 170.5ZM112.1 167.5C117.1 164.8 119.4 165.5 119.4 169.5C119.4 175.8 115.3 180.9 110.2 181C104.9 181 106.4 170.7 112.1 167.5ZM33.2 171.7C33.7 169.5 40.1 169.3 42.9 171.4C44.8 172.8 44.8 172.9 43 176.4C39.2 183.4 31.2 179.6 33.2 171.7ZM267.7 169C273.4 169 275.1 170.8 273.4 175C270.8 181.3 264.1 180 263.6 173.1C263.3 169 263.3 169 267.7 169ZM159.4 152.6C163.2 147.8 167.4 150.3 167.4 157.4C167.4 162.8 164.9 166.2 161 166.2C154.7 166.2 154 159.6 159.4 152.6ZM219.5 156.4C222.1 153.6 224.6 153.3 226.8 155.6C229.5 158.2 228 162.4 223.8 164C218.5 166 215.5 160.6 219.5 156.4ZM132.1 146.1C136.2 143.7 141.7 146.8 142.9 151.9C144.7 160.5 132.2 163 129.4 154.6C128.1 150.7 129.1 147.9 132.1 146.1ZM184.3 140.1C189.2 135.2 197.4 139.4 197.4 146.9C197.4 151.4 188.3 153.8 185 150.2C182.2 147 181.9 142.5 184.3 140.1ZM103.3 136.6C106.2 135.9 107 136 108.8 137.3C112.7 140.2 107.3 147.4 102.2 146.2C98.9 145.5 99.8 137.6 103.3 136.6ZM62.4 135.6C65.8 131.4 68.4 132.6 68.4 138.3C68.4 143.3 62.5 147.3 61 143.4C59.9 140.6 60.3 138.3 62.4 135.6ZM158.3 128.1C163.3 122.7 167.6 126.8 165.9 135.5C165.2 139.4 163.3 141.2 159.8 141.2C153.6 141.2 152.8 134 158.3 128.1ZM121.8 124.4C124.7 121.5 129.1 122.2 130 125.6C130.6 128.1 129.3 130.4 126.2 132.1C121.2 134.7 117.7 128.6 121.8 124.4ZM262.5 115.1C265 112.4 267.8 112.7 268.2 115.6C268.7 119.1 265.8 125 263.5 125C259.9 125 259.2 118.6 262.5 115.1ZM219.1 113.6C220.5 112.2 227.6 113.4 228.8 115.2C231.5 119.5 223.8 125.2 219.8 121.9C218.3 120.7 217.8 114.9 219.1 113.6ZM186.6 107C189.3 106 193.3 106.7 195.2 108.5C197.5 110.6 193.1 117 189.4 117C184.6 117 182.3 108.7 186.6 107ZM143.1 101.6C145.2 99.5 152.9 101.5 153.2 104.2C153.8 109.5 145.8 113.5 143.4 109C142.2 106.8 142 102.7 143.1 101.6ZM311.5 95.6C314.3 92 316.8 92.6 317.2 96.8C317.6 100.7 315.1 105 312.5 105C308.9 105 308.3 99.6 311.5 95.6ZM108 95.8C111.2 92.3 116.4 94.1 116.4 98.6C116.4 101.4 112.9 104 109.2 104C105.8 104 105.1 99 108 95.8ZM175.8 83.4C176.5 81.6 182.4 81.5 184.9 83.3C188.9 86.3 183.4 92.9 177.7 91.8C175.8 91.5 174.7 86.3 175.8 83.4ZM38.5 74.3C41.9 70.7 43.9 71.7 43.8 76.8C43.7 82 41.3 85 38.6 83.4C35.9 81.7 35.9 77.2 38.5 74.3ZM257.4 70C259.6 67.7 260.7 67.5 263.4 69C268.4 71.7 262.9 80.2 257.3 78.5C254.7 77.6 254.7 72.6 257.4 70ZM112.2 45.3C116.8 43.3 117.8 44.1 117.6 49.6C117.2 59.2 105.4 64 105.4 54.7C105.4 50 107.1 47.6 112.2 45.3ZM215.8 47.4C216.9 44.5 226.4 46.5 226.4 49.7C226.3 56.3 216.2 58.6 215.6 52.1C215.4 50.3 215.5 48.2 215.8 47.4ZM161.4 36.7C163.8 35.8 164.3 35.9 166.4 38C170.5 42.1 164.8 48.6 159 46.4C155.8 45.2 157.6 38.2 161.4 36.7ZM128 2.8C131 -0.4 135.8 0.7 136.2 4.7C136.5 8.4 133.1 11.4 129.2 10.8C126.2 10.4 125.5 5.6 128 2.8ZM209.6 1.2C212.2 -1.5 219.4 0.7 219.3 4.2C219.2 11.9 208.4 12.7 208.4 4.9C208.4 3.5 208.9 1.8 209.6 1.2Z';
const DOT_SUBPATHS = DOT_PATH.split(/(?=M)/);
const dotGroup = id => `<g id="${id}">${DOT_SUBPATHS.map(d => `<path class="dot hero-headline-scene__fill-box" d="${d}" fill="#000"/>`).join('')}</g>`;
const usesSvg = (id, list) => `<defs>${dotGroup(id)}</defs>` + list.map(([x, y, sc, r]) => `<g transform="translate(${x} ${y})"><g class="u"><use href="#${id}" transform="scale(${sc}) rotate(${r})"/></g></g>`).join('');
const STAR = (R, r) => { let d = ''; for (let i = 0; i < 16; i++) { const a = i * Math.PI / 8 - Math.PI / 2, rr = i % 2 ? r : R; d += (i ? 'L' : 'M') + (Math.cos(a) * rr).toFixed(1) + ' ' + (Math.sin(a) * rr).toFixed(1); } return d + 'Z'; };
const starSvg = (R, r) => ({ vb: `${-R} ${-R} ${2 * R} ${2 * R}`, svg: `<path d="${STAR(R, r)}" fill="#fff"/>` });

const OBJS = [
  // --- first keyframe ---
  { id: 'starBig', fx: 'star', t: 0.52, b: [534.1, 245.9, 85.1, 81.6], vb: '0 0 85.1 81.6', // Figma Vector 464, rotated 33.73°
    svg: `<path transform="translate(-14.1 36.567) rotate(-33.73)" d="M32.967 0L45.647 20.288L73.543 5.072L58.327 32.967L83.686 53.255L53.255 48.183L60.863 73.543L45.647 50.719L25.36 71.007L35.503 45.647L12.68 53.255L27.895 38.039L0 25.36L30.431 27.895L32.967 0Z" fill="#fff"/>` },
  { id: 'dotsW', fx: 'scatter', t: 0.64, b: [452.7, 215.7, 109, 90], vb: '0 0 109 90',
    svg: [[68.4315, 103.784, 0.203128, -128.167], [94.0309, 71.6898, 0.247389, 159.842]]
      .map(([x, y, sc, r]) => `<g class="cl"><g transform="translate(${x} ${y}) scale(${sc}) rotate(${r})">${DOT_SUBPATHS.map(d => `<path class="dot" d="${d}" fill="#000"/>`).join('')}</g></g>`).join('') },
  { id: 'slash', fx: 'bump', t: 1.34, b: [634.2, 391.4, 27.3, 42.1], vb: '0 0 28 43',
    svg: `<path d="M26.2 5C26.1 5.5 25.6 6.1 25.4 6.4C25.3 6.5 25.2 6.6 25.2 6.7C25 6.9 24.8 7.2 24.3 7.7C24.2 7.9 24.1 8.1 24 8.2C22.7 10.1 21.3 11.9 19.9 13.7C19.6 14.3 19.2 14.9 18.9 15.2C18.5 15.6 18.2 15.9 18 16.1C16.9 17.5 15.8 19 14.8 20.5C14.4 20.9 14.1 21.4 13.8 21.9C13.6 22.3 13.3 22.8 13 23.2C12.9 23.4 12.8 23.6 12.8 23.8C12.8 23.8 12.8 23.9 12.7 24C12.6 24.3 12.5 24.6 12.4 24.9C12.1 25.5 11.7 26.1 11.4 26.6C11.3 26.7 11.3 26.8 11.2 26.8C11 27.2 10.8 27.6 10.6 28C10.2 28.3 10 28.7 9.6 29.4C9.5 29.7 9.3 30 9.1 30.4C8.9 30.6 8.8 30.7 8.6 30.8C8.5 30.9 8.4 31 8.4 31.2C8.4 31.4 8.4 31.6 8.2 31.9C7.5 32.5 7.5 33 7.4 33.3C7.4 33.4 7.4 33.5 7.4 33.6C7.3 33.9 7.1 34.2 6.9 34.4C6.7 34.6 6.5 35 6.4 35.4C6.4 35.5 6.3 35.7 6.2 35.8C6.1 36 6 36.3 5.9 36.5C5.6 37.2 5.4 37.5 5.3 37.8C5.3 37.9 5.3 38 5.2 38C5.1 38.3 5 38.6 4.8 38.9C4.7 39.2 4.5 39.6 4.3 39.9C4.3 39.9 4.2 39.9 4.2 40C3.7 40.5 3.3 40.9 3 41.4C2.8 41.7 2.4 41.9 2.1 42C1.7 42.1 1.2 42.1 0.9 41.9C0.5 41.7 0.2 41.4 0.1 41C-0.1 40.6 0 40.2 0.2 39.8C0.5 39.1 0.9 38.4 1.3 37.8C1.3 37.8 1.4 37.7 1.4 37.7C1.8 37 2.3 36.2 2.7 35.4C3 34.8 3.4 34.3 3.7 33.7C3.7 33.7 3.8 33.6 3.8 33.5C4 33 4.2 32.5 4.3 32.2C4.5 31.9 4.6 31.7 4.8 31.5C4.9 31.4 4.9 31.3 5 31.2C5.3 30.6 5.6 29.9 6 29.4C6.2 29.1 6.5 28.8 6.7 28.6C7 28.2 7.3 27.9 7.4 27.7C7.6 27.3 7.8 26.9 8.1 26.6C8.3 26.3 8.5 26 8.5 25.8C8.5 25.5 8.7 25.4 8.8 25.2C9 25 9.1 24.8 9.3 24.5C9.5 24.2 9.7 24 9.8 23.8C10.1 23.5 10.2 23.3 10.3 23C10.4 22.8 10.4 22.6 10.5 22.5C10.6 22.2 10.7 22 10.8 21.8C10.9 21.7 11 21.5 11.1 21.4C11.2 21.2 11.4 21 11.5 20.8C11.7 20.6 11.8 20.5 12.1 20.4C12.2 20.1 12.3 20 12.3 19.9C12.3 19.8 12.3 19.6 12.4 19.4C12.5 19 12.7 18.8 12.9 18.6C13.1 18.4 13.2 18.2 13.4 18C13.5 17.8 13.6 17.6 13.7 17.4C13.8 17.1 13.9 16.8 14.1 16.7C14.2 16.6 14.3 16.5 14.3 16.5C14.6 16 14.8 15.6 15.1 15.1C15.2 14.7 15.3 14.5 15.3 14.3C15.3 14.2 15.5 13.8 15.6 13.4C15.8 13.2 15.9 12.9 16 12.7C16 12.6 16.1 12.5 16.2 12.4C16.3 12.3 16.5 12.3 16.5 12.1C16.6 12.1 16.6 12 16.6 11.9C16.7 11.8 16.7 11.7 16.7 11.7C16.7 11.6 16.8 11.5 17 11.4C17.1 11.3 17.2 11.2 17.3 11.1C17.5 10.7 17.6 10.4 17.8 10C17.9 9.9 17.8 9.8 17.8 9.7C17.7 9.5 17.6 9.4 17.6 9.3C17.6 9.1 17.7 9.1 17.8 9.1C17.8 9 17.7 8.9 17.8 8.9C17.9 8.7 18 8.5 18.1 8.4C18.3 8.2 18.4 8 18.5 7.8C18.6 7.7 18.8 7.4 19 7.2C19.2 7.1 19.3 6.9 19.4 6.8C19.5 6.7 19.6 6.5 19.7 6.3C19.8 6.1 19.8 6 20 5.9C20.1 5.8 20.3 5.8 20.4 5.8C20.5 5.6 20.7 5.5 20.8 5.3C20.7 5 20.6 4.6 20.9 4.5C21 4.4 21.1 4.4 21.2 4.4C21.3 4.4 21.3 4.4 21.4 4.3C21.4 4.3 21.5 4.2 21.5 4.1C21.5 4 21.5 3.8 21.6 3.7C21.8 3.6 21.9 3.6 22.1 3.5C22.4 3.2 22.6 2.8 22.9 2.5C23.4 1.8 24 1.2 24.5 0.6C24.8 0.3 25.3 0 25.8 0C26 0 26.3 0 26.5 0.2C26.7 0.3 26.8 0.5 26.8 0.7C26.7 1.1 27 1.4 27.2 1.7C27.3 2 27.3 2.3 27.1 2.6C26.9 3 26.6 3.5 26.4 4.1C26.3 4.3 26.3 4.5 26.2 4.6C26.2 4.8 26.2 4.9 26.2 5Z" fill="#393A3D"/>` },
  { id: 'circle', fx: 'draw', t: 5.385, b: [690, 367, 84, 84], vb: '0 0 84 84',
    svg: `<defs><mask id="cm" maskUnits="userSpaceOnUse" x="-5" y="-5" width="94" height="94"><circle class="d" cx="42" cy="42" r="41.165" fill="none" stroke="#fff" stroke-width="5" pathLength="1" transform="rotate(-90 42 42)"/></mask></defs><circle cx="42" cy="42" r="41.165" fill="none" stroke="#B5B5B5" stroke-width="1.67" stroke-linecap="round" stroke-dasharray="1 8" mask="url(#cm)"/>`,
  },
  { id: 'star596', fx: 'star', t: 0.98, b: [615.5, 366.8, 29, 26], vb: '0 0 29 26', svg: `<path d="M14 7L8.6 1.1L9.8 10.5L0 11.8L9.7 14.1L6 20.2L12.7 16.1L11.3 25.2L16.2 17.1L22.7 23.6L18.4 15.7L28.4 15.3L18.9 10.3L21.7 0L14 7Z" fill="#fff"/>` },
  { id: 'coin', fx: 'star', t: 5.585, b: [702.8, 369.7, 14, 15.1], vb: '0 0 14 15.1', svg: `<image href="/assets/illustrations/bill-pay/ap-manager-orbit/coin.png" width="14" height="15.1"/>` }, // ap-manager-orbit/coin.png (47×51) at Figma's coin size
  { id: 'underline', fx: 'wipeRight', t: 2.10, b: [732.4, 506.1, 187.7, 7.6], vb: '0 0 188 8', anchor: 'design',
    svg: `<path d="M16 0.1C17.5 -0.1 20.3 0 21.9 0.1C22.4 0.1 22.7 0.1 23.1 0.1C24.1 0.1 25.5 0.1 28.2 0.2C29 0.2 29.9 0.2 30.7 0.2C39.4 0.3 48.2 0.5 56.9 0.7C59.5 0.7 62.2 0.7 63.9 0.8C66.1 0.9 67.6 1 68.8 1C69.1 1 69.4 1.1 69.6 1.1C76.3 1.3 83 1.5 89.7 1.9C91.9 2.1 94.1 2.2 96.2 2.4C97.6 2.5 99 2.6 100.3 2.6C101 2.7 101.6 2.7 102.2 2.7C103.4 2.8 104.5 2.7 105.5 2.7C106.9 2.7 108.2 2.6 109.3 2.6C110.3 2.6 111.4 2.7 112.5 2.7C114 2.7 115.6 2.8 116.9 2.8C117.2 2.8 117.6 2.8 117.9 2.8C119.6 2.8 121.3 2.8 123 2.8C124.8 3 126.7 3 129.5 3C130.7 3 132.1 3.1 133.8 3.1C134.9 3.1 135.5 3.2 135.9 3.2C136.1 3.3 136.2 3.3 136.3 3.3C136.8 3.4 137.2 3.3 137.8 3.2C138.5 3.2 139.3 3.1 140.4 3.2C144 3.5 145.6 3.3 146.7 3.1C147.1 3.1 147.4 3.1 147.7 3C148.5 3 149.5 3 150.4 3.1C150.8 3.1 151.1 3.2 151.4 3.2C152.3 3.3 154.1 3.4 155.5 3.3C156 3.3 156.7 3.3 157.5 3.4C158.3 3.4 159.3 3.5 160.4 3.5C163 3.5 164.4 3.5 165.5 3.5C165.9 3.5 166.2 3.5 166.5 3.5C167.4 3.5 168.6 3.6 169.8 3.6C171.2 3.7 172.7 3.7 173.8 3.7C174.9 3.8 175.9 4 177 4.1C178.7 4.2 180.4 4.3 182.2 4.3C183.6 4.4 185 4.6 186.1 4.9C187.1 5.2 187.7 5.6 187.7 6C187.7 6.4 187.1 6.8 186.1 7.1C185 7.4 183.6 7.6 182.2 7.6C180.4 7.6 178.6 7.6 176.8 7.6C175.5 7.5 174.4 7.4 173.2 7.4C169.7 7.2 166.1 7 162.5 6.9C160 6.7 157.5 6.6 155 6.5C154.7 6.5 154.5 6.4 154.2 6.4C152.8 6.4 151.5 6.4 150.3 6.4C149.7 6.4 149.1 6.4 148.6 6.5C147.4 6.5 146.5 6.4 145.7 6.3C145.2 6.3 144.7 6.3 144.2 6.3C144 6.3 143.6 6.3 143.2 6.3C141.5 6.3 138.6 6.3 136 6.2C134.8 6.2 133.5 6.1 132.2 6C130.3 5.9 128.6 5.8 127.7 5.8C126.2 5.8 124.4 5.8 122.9 5.7C121.4 5.7 120.1 5.6 119.3 5.7C118.5 5.8 117.7 5.8 116.6 5.7C115.8 5.7 114.9 5.6 113.6 5.6C113.2 5.6 112.8 5.6 112.4 5.5C111.5 5.5 110.8 5.5 110.1 5.4C108.9 5.3 107.9 5.3 106.5 5.3C104.9 5.4 103.2 5.4 101.9 5.3C101.4 5.3 100.8 5.2 100.2 5.2C99 5.2 98 5.1 97.2 5C96.4 4.9 95.8 4.8 95.3 4.7C95.1 4.7 95 4.6 94.8 4.6C94.2 4.6 93.6 4.5 93.1 4.5C92.2 4.5 91.6 4.6 90.8 4.6C89.5 4.6 88.4 4.5 87.3 4.4C86.4 4.3 85.5 4.2 84.4 4.2C83.6 4.2 82.8 4.2 82 4.2C80.7 4.2 79.5 4.2 78.7 4.2C78.4 4.2 78.1 4.1 77.8 4C75.7 4 73.6 4 71.6 4.1C71.4 4.1 71.2 4.1 71 4.1C70.5 4.1 70.1 4.1 69.6 4.2C69.3 4.2 69 4.2 68.8 4.3C68.1 4.4 66.6 4.4 65 4.5C64 4.5 62.9 4.5 62 4.6C61.5 4.6 61 4.5 60.5 4.5C60.1 4.4 59.6 4.4 59.1 4.4C58.8 4.4 58.5 4.4 58.2 4.4C57.9 4.4 57.7 4.5 57.4 4.5C57.1 4.5 56.5 4.5 55.7 4.4C55.2 4.4 54.6 4.4 54.1 4.3C52.5 4.4 51 4.4 49.5 4.4C49.2 4.5 48.9 4.5 48.7 4.6C48.5 4.6 48.4 4.7 48.2 4.8C48 4.9 47.8 5 47.6 5C47.4 5.1 47.1 5.1 47 5.1C46.9 5.1 46.8 5 46.6 5C46.5 5 46.2 5.1 46 5.1C45.3 5.1 44.4 5.1 43.6 5.1C42.7 5 41.9 5 41.2 5C40.4 5 39.2 5 38.1 4.9C37.3 4.9 36.6 4.8 35.9 4.8C35.2 4.8 34.5 4.8 33.9 4.9C33.1 4.9 32.3 4.9 31.7 4.9C31.5 4.9 31.4 4.8 31.2 4.7C31 4.7 30.9 4.6 30.7 4.5C29.8 4.5 29 4.5 28.2 4.5C28.1 4.5 28.1 4.6 28.1 4.6C27.4 4.8 26.5 5 25.2 4.9C24.8 4.8 24.6 4.7 24.4 4.7C24.2 4.6 24.1 4.5 23.8 4.5C23.6 4.5 23.2 4.5 22.9 4.6C22.4 4.7 21.8 4.7 21.3 4.7C21.2 4.7 21.2 4.6 21.1 4.6C20.7 4.6 20.1 4.5 19.5 4.4C17.8 4.3 16 4.3 14.2 4.2C11.2 4.1 8.3 4.1 5.4 4C4 3.9 2.6 3.7 1.6 3.4C0.6 3.1 0 2.7 0 2.3C0 1.9 0.6 1.5 1.6 1.2C2.6 0.9 4 0.7 5.4 0.7C7.7 0.6 10.1 0.6 12.4 0.5C12.5 0.5 12.7 0.5 12.8 0.5C13.3 0.4 13.7 0.4 14.1 0.4C14.6 0.3 15 0.2 15.4 0.2C15.6 0.2 15.8 0.1 16 0.1Z" fill="#fff"/>` },
  { id: 'arrow', fx: 'wipeLeft', t: 2.36, b: [820.3, 535.7, 44, 30], vb: '0 0 44 30', anchor: 'strategy',
    svg: `<path d="M0.5 19.5C0 19.7 -0.1 20.3 0.1 20.8L4.3 28.8C4.5 29.3 5.1 29.5 5.6 29.2C6.1 29 6.3 28.4 6 27.9L2.3 20.8L9.5 17.1C9.9 16.9 10.1 16.3 9.9 15.8C9.6 15.3 9 15.1 8.5 15.3L0.5 19.5ZM42.8 0.3L41.8 0C40.1 4.8 36 11.6 29.3 16.2C22.7 20.8 13.4 23.3 1.3 19.4L1 20.4L0.7 21.3C13.4 25.4 23.3 22.8 30.5 17.9C37.6 13 41.9 5.8 43.7 0.7L42.8 0.3Z" fill="#108000"/>` },
  { id: 'check', fx: 'checkpop', t: 2.68, b: [525.6, 536.2, 46.3, 35.3], vb: '525.6 542.2 46.3 35.3', anchor: 'strategy', // checkbox-box.png + drawn V (Figma mask group 529.3,542.2 38x35.3)
    svg: `<image class="box hero-headline-scene__fill-box" href="/assets/illustrations/bill-pay/hero/checkbox-box.png" x="525.6" y="547.9" width="46.3" height="27.5"/><defs><mask id="ckTex" maskUnits="userSpaceOnUse" x="520" y="535" width="60" height="50"><rect x="520" y="535" width="60" height="50" fill="#fff"/><ellipse cx="543.7" cy="548.3" rx="0.58" ry="0.18" transform="rotate(137 543.7 548.3)" fill="#000"/><ellipse cx="535.4" cy="563.4" rx="0.70" ry="0.23" transform="rotate(22 535.4 563.4)" fill="#000"/><ellipse cx="547.6" cy="545.4" rx="0.30" ry="0.30" transform="rotate(144 547.6 545.4)" fill="#000"/><ellipse cx="536.5" cy="550.8" rx="0.56" ry="0.48" transform="rotate(147 536.5 550.8)" fill="#000"/><ellipse cx="553.1" cy="544.7" rx="0.36" ry="0.34" transform="rotate(34 553.1 544.7)" fill="#000"/><ellipse cx="542.4" cy="548.0" rx="0.31" ry="0.26" transform="rotate(174 542.4 548.0)" fill="#000"/><ellipse cx="538.5" cy="563.4" rx="0.57" ry="0.28" transform="rotate(140 538.5 563.4)" fill="#000"/><ellipse cx="557.6" cy="562.8" rx="0.56" ry="0.32" transform="rotate(136 557.6 562.8)" fill="#000"/><ellipse cx="547.4" cy="554.0" rx="0.54" ry="0.31" transform="rotate(76 547.4 554.0)" fill="#000"/><ellipse cx="540.9" cy="549.3" rx="0.64" ry="0.18" transform="rotate(76 540.9 549.3)" fill="#000"/><ellipse cx="550.9" cy="573.6" rx="0.61" ry="0.25" transform="rotate(18 550.9 573.6)" fill="#000"/><ellipse cx="536.3" cy="557.6" rx="0.63" ry="0.20" transform="rotate(125 536.3 557.6)" fill="#000"/><ellipse cx="547.2" cy="576.7" rx="0.29" ry="0.35" transform="rotate(80 547.2 576.7)" fill="#000"/><ellipse cx="544.2" cy="555.3" rx="0.50" ry="0.43" transform="rotate(17 544.2 555.3)" fill="#000"/><ellipse cx="562.2" cy="576.1" rx="0.49" ry="0.38" transform="rotate(15 562.2 576.1)" fill="#000"/><ellipse cx="558.3" cy="553.8" rx="0.54" ry="0.39" transform="rotate(114 558.3 553.8)" fill="#000"/><ellipse cx="542.2" cy="556.5" rx="0.58" ry="0.16" transform="rotate(118 542.2 556.5)" fill="#000"/><ellipse cx="544.8" cy="564.4" rx="0.50" ry="0.23" transform="rotate(73 544.8 564.4)" fill="#000"/><ellipse cx="536.7" cy="551.7" rx="0.45" ry="0.45" transform="rotate(20 536.7 551.7)" fill="#000"/><ellipse cx="538.0" cy="557.1" rx="0.39" ry="0.20" transform="rotate(110 538.0 557.1)" fill="#000"/><ellipse cx="563.1" cy="552.7" rx="0.46" ry="0.28" transform="rotate(97 563.1 552.7)" fill="#000"/><ellipse cx="566.5" cy="548.3" rx="0.34" ry="0.23" transform="rotate(59 566.5 548.3)" fill="#000"/><ellipse cx="532.4" cy="572.1" rx="0.34" ry="0.25" transform="rotate(37 532.4 572.1)" fill="#000"/><ellipse cx="547.1" cy="555.9" rx="0.53" ry="0.48" transform="rotate(176 547.1 555.9)" fill="#000"/><ellipse cx="562.9" cy="576.3" rx="0.58" ry="0.41" transform="rotate(116 562.9 576.3)" fill="#000"/><ellipse cx="564.4" cy="570.3" rx="0.69" ry="0.43" transform="rotate(100 564.4 570.3)" fill="#000"/><ellipse cx="546.3" cy="556.8" rx="0.49" ry="0.29" transform="rotate(48 546.3 556.8)" fill="#000"/><ellipse cx="534.4" cy="550.3" rx="0.33" ry="0.27" transform="rotate(13 534.4 550.3)" fill="#000"/><ellipse cx="535.7" cy="562.8" rx="0.52" ry="0.48" transform="rotate(157 535.7 562.8)" fill="#000"/><ellipse cx="532.9" cy="573.6" rx="0.56" ry="0.20" transform="rotate(64 532.9 573.6)" fill="#000"/><ellipse cx="566.4" cy="564.1" rx="0.49" ry="0.19" transform="rotate(124 566.4 564.1)" fill="#000"/><ellipse cx="567.8" cy="559.3" rx="0.49" ry="0.18" transform="rotate(26 567.8 559.3)" fill="#000"/><ellipse cx="559.0" cy="568.9" rx="0.49" ry="0.39" transform="rotate(132 559.0 568.9)" fill="#000"/><ellipse cx="532.8" cy="576.3" rx="0.51" ry="0.20" transform="rotate(139 532.8 576.3)" fill="#000"/><ellipse cx="564.9" cy="569.5" rx="0.40" ry="0.38" transform="rotate(23 564.9 569.5)" fill="#000"/><ellipse cx="557.1" cy="552.1" rx="0.43" ry="0.21" transform="rotate(57 557.1 552.1)" fill="#000"/><ellipse cx="551.2" cy="570.3" rx="0.41" ry="0.23" transform="rotate(49 551.2 570.3)" fill="#000"/><ellipse cx="561.0" cy="571.6" rx="0.62" ry="0.23" transform="rotate(132 561.0 571.6)" fill="#000"/><ellipse cx="549.7" cy="568.6" rx="0.74" ry="0.43" transform="rotate(120 549.7 568.6)" fill="#000"/><ellipse cx="541.3" cy="567.2" rx="0.73" ry="0.31" transform="rotate(89 541.3 567.2)" fill="#000"/><ellipse cx="566.4" cy="555.8" rx="0.36" ry="0.23" transform="rotate(50 566.4 555.8)" fill="#000"/><ellipse cx="544.2" cy="559.9" rx="0.74" ry="0.36" transform="rotate(0 544.2 559.9)" fill="#000"/><ellipse cx="549.3" cy="565.9" rx="0.65" ry="0.18" transform="rotate(169 549.3 565.9)" fill="#000"/><ellipse cx="536.3" cy="556.6" rx="0.61" ry="0.22" transform="rotate(45 536.3 556.6)" fill="#000"/><ellipse cx="547.6" cy="565.3" rx="0.29" ry="0.48" transform="rotate(101 547.6 565.3)" fill="#000"/><ellipse cx="548.7" cy="569.0" rx="0.29" ry="0.21" transform="rotate(32 548.7 569.0)" fill="#000"/><ellipse cx="533.0" cy="563.7" rx="0.48" ry="0.38" transform="rotate(156 533.0 563.7)" fill="#000"/><ellipse cx="561.8" cy="577.3" rx="0.58" ry="0.27" transform="rotate(140 561.8 577.3)" fill="#000"/><ellipse cx="551.7" cy="543.7" rx="0.65" ry="0.40" transform="rotate(26 551.7 543.7)" fill="#000"/><ellipse cx="551.0" cy="575.7" rx="0.47" ry="0.46" transform="rotate(54 551.0 575.7)" fill="#000"/><ellipse cx="533.0" cy="550.4" rx="0.50" ry="0.42" transform="rotate(83 533.0 550.4)" fill="#000"/><ellipse cx="541.3" cy="557.7" rx="0.32" ry="0.47" transform="rotate(90 541.3 557.7)" fill="#000"/><ellipse cx="564.3" cy="566.2" rx="0.66" ry="0.33" transform="rotate(128 564.3 566.2)" fill="#000"/><ellipse cx="536.7" cy="548.3" rx="0.51" ry="0.46" transform="rotate(46 536.7 548.3)" fill="#000"/><ellipse cx="553.9" cy="570.2" rx="0.32" ry="0.20" transform="rotate(158 553.9 570.2)" fill="#000"/><ellipse cx="558.1" cy="562.5" rx="0.41" ry="0.33" transform="rotate(142 558.1 562.5)" fill="#000"/><ellipse cx="549.4" cy="570.2" rx="0.69" ry="0.17" transform="rotate(48 549.4 570.2)" fill="#000"/><ellipse cx="542.0" cy="570.0" rx="0.50" ry="0.35" transform="rotate(16 542.0 570.0)" fill="#000"/><ellipse cx="548.0" cy="564.4" rx="0.50" ry="0.33" transform="rotate(177 548.0 564.4)" fill="#000"/><ellipse cx="542.0" cy="560.8" rx="0.65" ry="0.33" transform="rotate(63 542.0 560.8)" fill="#000"/><ellipse cx="557.2" cy="573.7" rx="0.72" ry="0.24" transform="rotate(143 557.2 573.7)" fill="#000"/><ellipse cx="564.1" cy="550.1" rx="0.47" ry="0.30" transform="rotate(100 564.1 550.1)" fill="#000"/><ellipse cx="547.9" cy="545.5" rx="0.37" ry="0.18" transform="rotate(171 547.9 545.5)" fill="#000"/><ellipse cx="542.9" cy="547.3" rx="0.64" ry="0.48" transform="rotate(164 542.9 547.3)" fill="#000"/><ellipse cx="555.8" cy="548.0" rx="0.69" ry="0.49" transform="rotate(56 555.8 548.0)" fill="#000"/><ellipse cx="558.9" cy="546.3" rx="0.69" ry="0.21" transform="rotate(170 558.9 546.3)" fill="#000"/><ellipse cx="562.0" cy="548.7" rx="0.47" ry="0.33" transform="rotate(86 562.0 548.7)" fill="#000"/><ellipse cx="547.2" cy="555.5" rx="0.30" ry="0.28" transform="rotate(86 547.2 555.5)" fill="#000"/><ellipse cx="551.9" cy="558.4" rx="0.26" ry="0.27" transform="rotate(159 551.9 558.4)" fill="#000"/><ellipse cx="542.6" cy="576.6" rx="0.31" ry="0.47" transform="rotate(58 542.6 576.6)" fill="#000"/></mask><clipPath id="ckFlat"><rect x="520" y="535" width="60" height="42.3"/></clipPath></defs><g mask="url(#ckTex)" clip-path="url(#ckFlat)"><path class="d" pathLength="1" d="M535.6 557.2 L546.4 578.5" fill="none" stroke="#393a3d" stroke-width="10.5" stroke-linecap="butt"/><path class="d" pathLength="1" d="M543.4 578.5 L567.2 544.6" fill="none" stroke="#393a3d" stroke-width="8.5" stroke-linecap="round"/></g>` },
  // --- rearrange arrivals ---
  { id: 'pile', fx: 'stack', t: 4.165, b: [500.5, 329.8, 56.4, 105], vb: '0 0 56.4 105', // pile.png (tray + papers, one piece)
    svg: `<image href="/assets/illustrations/bill-pay/hero/pile.png" width="56.4" height="105"/>` },
  { id: 'pileDotsB', fx: 'scatterUses', t: 4.605, b: [501.9, 356.3, 72, 48], vb: '0 0 72 48', svg: usesSvg('pdB', [[62.2021, 50.0093, 0.104845, -157.412], [49.597, 46.1886, 0.130991, 176.568], [13.5566, 30.4563, 0.0387733, 176.133]]) },
  { id: 'pileDotsC', fx: 'scatterUses', t: 4.645, b: [527.5, 378.1, 56, 48], vb: '0 0 56 48', svg: usesSvg('pdC', [[40.732, 51.1034, 0.104845, -142.574], [49.8741, 37.8013, 0.130991, 159.578]]) },
  { id: 'pileDotsA', fx: 'scatterUses', t: 4.685, b: [485.9, 398.1, 37, 27], vb: '0 0 37 27', svg: usesSvg('pdA', [[27.7868, 29.5428, 0.0571884, -142.574], [26.0075, 23.7225, 0.0714496, 170.224]]) },
  { id: 'swirl', fx: 'draw', t: 4.325, b: [487.7, 325.1, 46.9, 43.1], vb: '-46 -36 62 50',
    svg: `<path class="d" pathLength="1" d="M-40 10 C-44 -20 -10 -34 4 -18 C14 -6 -2 10 -14 0 C-22 -8 -8 -26 12 -22" stroke="#108000" stroke-width="4" fill="none" stroke-linecap="round"/>` },
  { id: 'bubble', fx: 'pop', t: 4.525, b: [661, 232.6, 109, 75.5], vb: '0 0 109 75.5', svg: `<image href="/assets/illustrations/bill-pay/hero/bubble.png" width="109" height="75.5"/>` },
  { id: 'bill', fx: 'bill', t: 4.765, b: [673, 228, 76.5, 71.8], vb: '0 0 76.5 71.8', svg: `<image href="/assets/illustrations/bill-pay/hero/bubble-bill.png" width="76.5" height="71.8"/>` }, // lands after the bubble, then floats
  { id: 'buildings', fx: 'fromRight', t: 4.615, b: [780.6, 372.5, 80.8, 69.8], vb: '0 0 80.8 69.8', svg: `<image href="/assets/illustrations/bill-pay/hero/buildings.png" width="80.8" height="69.8"/>` },
  { id: 'star899', fx: 'star', t: 4.765, b: [547, 334, 21, 19], vb: '0 0 21 19', svg: `<path d="M8.273 0L11.455 5.241L18.455 1.31L14.636 8.517L21 13.759L13.364 12.448L15.273 19L11.455 13.103L6.364 18.345L8.909 11.793L3.182 13.759L7 9.828L0 6.552L7.636 7.207L8.273 0Z" fill="#fff"/>` },
  { id: 'star526', fx: 'star', t: 4.805, b: [655, 221, 16.3, 15.3], vb: '0 0 16.3 15.3', svg: `<path d="M6.406 0L8.87 4.222L14.29 1.055L11.333 6.861L16.261 11.082L10.348 10.027L11.826 15.304L8.87 10.555L4.928 14.777L6.899 9.499L2.464 11.082L5.42 7.916L0 5.277L5.913 5.805L6.406 0Z" fill="#fff"/>` },
  { id: 'dotsBuilding', fx: 'scatterUses', t: 4.885, b: [809.5, 364.2, 104.6, 59.7], vb: '0 0 105 60',
    svg: `<defs>${dotGroup('dotsB-g')}</defs>` + [
      [10.7481, 12.8359, 0.110167, 24.2456], [5.54531, 22.9722, 0.137639, -24.915], [39.9739, 26.9624, 0.0407411, -23.3376],
      [49.3188, 25.8024, 0.0217356, -6.65319], [52.9843, 24.9168, 0.0183365, -0.79272], [55.4818, 24.9086, 0.0152002, -7.66317],
      [42.1711, 8.62552, 0.119457, -16.0172], [73.2886, 18.7147, 0.0166289, -18.902], [75.1693, 18.9741, 0.0169388, -33.9251],
      [75.1673, 15.2177, 0.0341775, -21.5366], [73.6108, -0.855445, 0.094736, 3.52333]
    ].map(([x, y, s, r]) => `<g transform="translate(${x} ${y})"><g class="u"><use href="#dotsB-g" transform="scale(${s}) rotate(${r})"/></g></g>`).join('') },
];

// ================= build =================
const stage = document.querySelector('.hero-headline-scene'), els = {};
if (!stage) return;
function build() {
  for (const o of OBJS) { // objects paint behind words
    const s = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    s.setAttribute('class', 'hero-headline-scene__obj'); s.setAttribute('viewBox', o.vb); s.setAttribute('aria-hidden', 'true');
    Object.assign(s.style, { left: (o.b[0] - X0) + 'px', top: (o.b[1] - Y0) + 'px', width: o.b[2] + 'px', height: o.b[3] + 'px' });
    s.innerHTML = o.svg; stage.appendChild(s);
    o.el = s; o.draws = [...s.querySelectorAll('.d')]; o.dots = [...s.querySelectorAll('.dot')]; o.uses = [...s.querySelectorAll('.u')];
    o.box = s.querySelector('.box'); o.bill = s.querySelector('.bill');
    let seed = o.id.length * 97 + 13; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
    o.order = o.dots.map(() => rnd()); // seeded scatter order — same on every play and seek
    o.dotC = o.dots.map(d => { const b = d.getBBox(); return [b.x + b.width / 2, b.y + b.height / 2]; });
    o.cls = [...s.querySelectorAll('.cl')].map(g => { const b = g.getBBox(); return { g, c: [b.x + b.width / 2, b.y + b.height / 2] }; });
  }
  for (const [id, w] of Object.entries(WORDS)) {
    const el = document.createElement('div');
    el.className = 'hero-headline-scene__word' + (w.fx === 'mask' ? ' hero-headline-scene__word--mask' : ''); el.setAttribute('aria-hidden', 'true');
    el.style.width = w.w + 'px';
    w.chars = [...w.text].map(c => { const s = document.createElement('span'); s.className = 'hero-headline-scene__char'; s.textContent = c; el.appendChild(s); return s; });
    stage.appendChild(el); els[id] = el;
  }
  // scramble: lock each letter's width to its final glyph so the word doesn't jitter
  WORDS.strategy.chars.forEach(c => { c.style.width = c.getBoundingClientRect().width / scaleNow() + 'px'; c.style.textAlign = 'center'; });
  measureGaps();
}

// slash sits centred in the gap between "is" and the word after it ("the" first, then "not")
let GAP = null;
function measureGaps() { // measured on the rendered glyphs (not layout boxes), before any word is moved
  const st = stage.getBoundingClientRect(), k = scaleNow();
  const ink = (id, i) => { const r = document.createRange(); r.selectNodeContents(WORDS[id].chars[i]); const b = r.getBoundingClientRect(); return { l: (b.left - st.left) / k, r: (b.right - st.left) / k }; };
  const isR = WORDS.is.x + ink('is', 2).r;
  const mid = (isR + WORDS.not.x + ink('not', 1).l) / 2;
  GAP = { kf1: mid, kf2: mid }; // slash holds one spot; "the" is placed optically around it (kf1.x)
}
function slashX(t) { const m = WORDS.the.move; return lerp(GAP.kf1, GAP.kf2, SLIDE(prog(t, m.t, m.d))); }

// ================= idle loops (start once everything has landed) =================
// float: the project's ag-float (ease-in-out, 6-10px travel, ~2.9-3.3s, staggered phases)
const float = (tau, travel, period, phase) => travel * (1 - Math.cos(2 * Math.PI * (tau / period + phase))) / 2;
// orbit: ap-manager-orbit (coin ~11.4 deg/s with an 8% speed wobble)
const COIN_C = { x: 732, y: 409 }, COIN_HOME = { x: 709.8, y: 377.2 };
const COIN_R = Math.hypot(COIN_HOME.x - COIN_C.x, COIN_HOME.y - COIN_C.y), COIN_A0 = Math.atan2(COIN_HOME.y - COIN_C.y, COIN_HOME.x - COIN_C.x);
function coinOrbit(tau) {
  let a = 0; const steps = 60; // integrate the wobbling speed so position is still a pure function of tau
  for (let i = 0; i < steps; i++) { const s = (i + 0.5) / steps * tau; a += 20 * (1 + 0.08 * Math.sin(s * 0.3 + 3 * 1.7)) * tau / steps; }
  const r = COIN_A0 + a * Math.PI / 180;
  return { dx: COIN_C.x + Math.cos(r) * COIN_R - COIN_HOME.x, dy: COIN_C.y + Math.sin(r) * COIN_R - COIN_HOME.y };
}
const STAR_IDLE = { starBig: [-8, 3.2, 0, 5, 7.1], star596: [-6, 2.9, 0.2, 8, 5.3], star899: [-7, 3.1, 0.6, 9, 6.2], star526: [-6, 3.0, 0.8, 10, 4.7] }; // travel, period, phase, rot deg, rot period

// ================= render (pure function of t) =================
const subEl = document.querySelector('.section-hero--scene .section-hero__sub-headline');
const cursor = document.createElement('div'); cursor.className = 'hero-headline-scene__cursor'; stage.appendChild(cursor);
function render(t) {
  for (const [id, w] of Object.entries(WORDS)) {
    const p = wordPos(id, t), el = els[id], wf = wordFx(w, t);
    el.style.transform = `translate(${p.x - X0 + nudge(id, t)}px, ${p.y - Y0}px)` + wf.tf;
    el.style.opacity = wf.o; if (wf.wt) el.style.fontWeight = wf.wt;
    w.chars.forEach((c, i) => {
      const s = charStyle(w, i, t);
      if (s.text !== undefined && c.textContent !== s.text) c.textContent = s.text;
      c.style.opacity = s.o; c.style.transform = s.tf; c.style.transformOrigin = s.origin || '50% 70%';
      c.style.filter = s.blur ? `blur(${s.blur.toFixed(2)}px)` : 'none';
    });
  }
  const tau = Math.max(0, t - END); // idle-loop clock, 0 until the build has finished
  for (const o of OBJS) {
    let rot = 0, sc = 1, op = 1, tx = 0, ty = 0, sy = 1, origin = '50% 50%', clip = 'none';
    if (o.anchor) { const w = WORDS[o.anchor], p = wordPos(o.anchor, t); tx = p.x - w.x; ty = p.y - w.y; }
    const k = prog(t, o.t, 0.3);
    switch (o.fx) {
      case 'star': sc = DROP(k); op = k > 0 ? 1 : 0; break;
      case 'pop': { const kp = prog(t, o.t, 0.32); sc = lerp(0.5, 1, POP(kp)); op = clamp(kp * 4);
        break; }
      case 'bump': { const kb = prog(t, o.t, 0.32); op = kb > 0 ? 1 : 0; origin = '50% 50%';
        sc = kb < 0.4 ? lerp(0.3, 1.2, OUT(kb / 0.4)) : lerp(1.2, 1, OUT((kb - 0.4) / 0.6)); // up fast, settle slower
        tx += slashX(t) - (o.b[0] + o.b[2] / 2); break; }
      case 'bill': sc = Math.max(0, DROP(k)); op = k > 0 ? 1 : 0; // floats inside the bubble: gentle bob + uneven sway, 20° total
        ty += float(tau, -5, 3.1, 0); rot = 7 * Math.sin(2 * Math.PI * tau / 4.3) + 3 * Math.sin(2 * Math.PI * tau / 2.7 + 1); break;
      case 'wipeUp': { const e = OUT(prog(t, o.t, 0.22)); clip = `inset(${(1 - e) * 100}% 0 0 0)`; break; }
      case 'wipeRight': { const e = OUT(prog(t, o.t, 0.35)); clip = `inset(-20% ${(1 - e) * 100}% -20% 0)`; break; }
      case 'wipeLeft': { const e = OUT(prog(t, o.t, 0.35)); clip = `inset(0 0 0 ${(1 - e) * 100}%)`; break; }
      case 'draw': o.draws.forEach(d => { const e = OUT(k); d.style.strokeDasharray = 1; d.style.strokeDashoffset = 1 - e; }); break;
      case 'checkpop': o.box.style.transform = `scale(${Math.max(0, DROP(k))}) rotate(${-12 * (1 - OUT(k))}deg)`;
        o.draws.forEach((d, i) => { const e = OUT(prog(t, o.t + (i ? 0.24 : 0.14), i ? 0.22 : 0.12)); d.style.strokeDasharray = 1; d.style.strokeDashoffset = 1 - e; }); break; // short stroke down, then the long one up
      case 'scatter': { // size jitter breathes 174% -> 224% -> 174% ... (Figma brush sizeJitter 1.74)
        const J = 1.99 + 0.25 * Math.cos(2 * Math.PI * tau / 7 + Math.PI);
        o.dots.forEach((d, i) => { const kd = prog(t, o.t + o.order[i] * 0.32, 0.22), r = (o.order[i] * 7.31) % 1 - 0.5;
          const ph = o.order[i] * 6.283, breathe = 0.55 * r * 2 * Math.sin(2 * Math.PI * tau / 7 + ph) * clamp(tau); // per-dot, own phase
          const [cx, cy] = o.dotC[i], k = Math.max(0, POP(kd) * (1 + (J - 1.74) * r * 2 + breathe));
          d.setAttribute('transform', `translate(${cx} ${cy}) scale(${k}) translate(${-cx} ${-cy})`); });
        o.cls.forEach(({ g, c }, i) => g.setAttribute('transform', `rotate(${10 * Math.sin(2 * Math.PI * tau / 6.5 + i * 2.1) * clamp(tau)} ${c[0]} ${c[1]})`)); // cluster sway, like the building dots
        break; }
      case 'scatterUses': o.uses.forEach((u, i) => { // angular jitter drifts a few degrees per cluster
        const ku = prog(t, o.t + i * 0.025, 0.24), aj = 9 * Math.sin(2 * Math.PI * tau / 6 + i * 1.3) * clamp(tau);
        u.style.transform = `rotate(${aj}deg) scale(${POP(ku)})`; }); break;
      case 'stack': { const kb = prog(t, o.t, 0.42), land = prog(t, o.t + 0.2, 0.22);
        const sq = land > 0 && land < 1 ? 1 - 0.14 * Math.sin(Math.PI * land) : 1;
        ty += (DROP(kb) - 1) * 160; op = kb > 0 ? 1 : 0; sy = sq; sc = 1 + (1 - sq) * 0.6; origin = '50% 100%'; break; }
      case 'fromRight': tx += (1 - SLIDE(prog(t, o.t, 0.5))) * (W + 40 - (o.b[0] - X0)); break;
    }
    if (STAR_IDLE[o.id]) { const [tr, pe, ph, ra, rp] = STAR_IDLE[o.id]; ty += float(tau, tr, pe, ph) - float(0, tr, pe, ph); rot = ra * Math.sin(2 * Math.PI * tau / rp); }
    if (o.id === 'coin') { const c = coinOrbit(tau); tx += c.dx; ty += c.dy; }
    if (o.pulse) { const kp = prog(t, o.pulse(), 0.3); if (kp > 0 && kp < 1) sc *= 1 + 0.08 * Math.sin(Math.PI * kp); }
    o.el.style.opacity = op; o.el.style.clipPath = clip; o.el.style.transformOrigin = origin;
    o.el.style.transform = `translate(${tx}px, ${ty}px) rotate(${rot}deg) scale(${sc}, ${sc * sy / (o.fx === 'stack' ? sc : 1)})`;
  }
  // typing cursor on "the"
  const w = WORDS.the, end = w.t + 3 * TYPE_STEP, on = t >= w.t - 0.12 && t < end + 0.28 && (t < end || Math.floor((t - end) / 0.25) % 2 === 0);
  cursor.style.opacity = on ? 1 : 0;
  if (on) { const typed = Math.min(3, Math.max(0, Math.floor((t - w.t) / TYPE_STEP) + 1)), p = wordPos('the', t);
    const cw = w.chars.slice(0, typed).reduce((s, c) => s + c.offsetWidth, 0);
    cursor.style.transform = `translate(${p.x - X0 + (w.w - w.chars.reduce((s, c) => s + c.offsetWidth, 0)) / 2 + cw + 3}px, ${p.y - Y0 + 19.4}px)`; }
  subEl.style.opacity = OUT(prog(t, SUB.t, SUB.d));
}

// ================= playback =================
const HOLD = 0.625; // 0.5s real time at 1.25x — first keyframe sits still before the rearrange
const BUILD_END = 5.885; // last build beat (coin) has landed
const SUB = { t: BUILD_END + 0.38, d: 0.45 }; // section-header subheading entrance: 380ms delay, 450ms opacity, cubic-bezier(0.23,1,0.32,1)
const END = SUB.t + SUB.d, SPEED = 1.25;
let t = 0;
const scaleNow = () => 1;
document.fonts.load('italic 400 60px Literata').then(() => document.fonts.ready).then(() => {
  build();
  render(END);
});
})();
