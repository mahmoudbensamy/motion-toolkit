'use strict';
/* ==========================================================
   TIMELINE for microcosm_2.wav (new script, 300.7 s)
   old scenes are re-timed through word-anchor maps [new, old]
   ========================================================== */
const DUR2 = 303;
const MAPA = [[0, 0], [1.82, 1.82], [3.0, 3.1], [3.9, 4.08], [5.26, 5.32], [6.24, 6.32], [6.86, 7.08], [7.54, 7.80], [8.38, 8.64], [9.0, 9.50], [10.54, 11.22], [11.32, 12.04], [12.30, 12.92], [13.50, 14.16], [14.64, 15.34], [15.45, 16.0],
  [21.9, 17.12], [22.80, 17.96], [23.00, 18.20], [23.56, 18.98], [24.62, 20.16], [25.02, 20.56], [26.02, 21.44], [26.96, 22.54], [27.94, 23.36], [28.94, 24.00], [29.74, 24.50], [30.32, 24.94], [31.22, 25.84], [32.12, 27.08], [32.64, 27.86], [34.20, 29.24], [36.06, 31.12], [36.32, 31.38], [37.04, 32.30], [37.74, 33.05]];
const MAPB = [[49.62, 39.02], [51.16, 40.22], [52.44, 41.46], [53.28, 42.34], [54.78, 43.80], [55.10, 44.08], [56.04, 44.88], [56.50, 45.48], [57.10, 46.26], [58.08, 47.14], [59.14, 48.34], [60.48, 49.52], [61.90, 50.80], [62.10, 51.28], [63.14, 52.12], [64.14, 53.00], [64.76, 53.74], [65.16, 54.20], [66.28, 55.36], [67.04, 56.02], [67.58, 56.54], [69.14, 58.00], [69.66, 58.60], [69.92, 58.90], [71.04, 59.96], [71.72, 60.70], [72.32, 61.24], [73.06, 61.90], [73.88, 62.68], [74.36, 63.28], [74.9, 63.9]];
const MAPC = [[75.0, 67.85], [75.84, 68.18], [77.46, 69.48], [79.90, 71.76], [81.30, 72.88], [82.18, 73.76], [82.56, 74.22], [82.82, 74.56], [83.24, 74.96], [84.72, 76.12], [86.38, 77.4], [86.72, 77.58], [87.08, 78.36], [87.82, 78.96], [88.60, 80.0], [89.14, 80.84], [89.46, 81.18], [90.24, 81.9],
  [91.46, 82.5], [92.18, 83.26], [92.60, 83.76], [93.84, 84.94], [94.5, 85.4], [95.82, 86.38], [98.36, 87.58], [99.86, 89.08], [104.3, 90.3], [104.58, 90.62], [106.0, 91.3], [112.78, 92.4], [113.78, 92.96], [116.24, 95.12], [117.18, 95.9],
  [120.18, 96.66], [123.12, 97.6], [124.10, 98.84], [124.78, 99.86], [126.56, 101.04], [127.20, 101.78], [128.04, 102.40], [128.52, 103.06], [129.04, 103.56], [129.76, 104.28], [130.38, 104.70], [131.20, 105.24],
  [133.36, 107.0], [133.90, 107.64], [134.42, 108.08], [136.06, 109.28], [136.76, 110.12], [137.12, 110.62], [137.58, 111.08], [138.18, 111.60], [139.72, 113.36], [140.66, 114.30], [141.04, 114.68], [142.06, 115.50], [142.66, 116.22], [143.46, 116.82], [143.96, 117.32], [144.78, 117.96], [145.76, 118.62], [146.50, 119.06], [147.32, 119.82], [148.56, 120.80], [149.38, 121.74], [150.0, 122.10], [150.32, 122.40], [150.70, 122.74], [152.02, 123.92], [152.30, 124.24], [152.80, 124.70], [154.38, 125.84], [154.70, 126.26], [155.22, 126.80], [156.34, 127.94], [157.10, 128.64], [157.66, 129.32], [158.08, 129.80], [158.54, 130.40], [159.60, 131.28], [160.50, 132.04], [160.94, 132.62], [161.50, 133.20], [162.58, 134.16], [163.68, 135.14], [164.56, 135.94], [165.22, 136.64], [166.20, 137.58], [168.40, 139.56], [169.78, 140.60], [171.36, 142.16],
  [173.04, 143.50], [173.88, 144.34], [174.40, 144.94], [175.66, 146.02], [177.14, 147.18], [178.18, 147.96], [178.58, 148.34], [180.04, 149.62], [181.38, 150.76], [181.86, 152.60], [183.02, 153.88], [183.98, 154.72], [184.46, 155.36], [185.64, 156.74], [187.74, 159.12], [188.18, 159.68], [189.22, 160.48], [190.38, 161.98], [191.34, 163.08], [193.44, 164.74], [194.44, 165.82], [196.06, 167.26], [197.62, 168.84], [199.14, 170.20], [200.18, 171.36], [200.62, 171.96], [200.96, 172.38], [202.14, 173.52], [203.34, 174.88], [203.68, 175.32], [204.54, 176.18], [205.4, 176.9],
  [206.54, 177.06], [208.44, 179.52], [209.50, 180.38], [211.38, 182.16], [214.0, 184.44], [215.50, 185.70], [215.74, 186.06], [216.38, 187.74], [217.94, 189.28], [218.80, 190.24], [219.44, 191.10], [220.28, 192.02], [221.34, 193.52], [222.56, 196.54], [223.10, 197.12], [224.12, 198.34], [225.0, 199.06], [225.64, 199.64], [226.34, 200.44], [227.54, 201.70], [228.46, 202.58], [229.22, 203.32], [230.32, 204.74], [230.86, 205.36], [231.82, 206.48], [232.70, 207.50],
  [233.96, 208.72], [234.30, 209.06], [235.50, 210.20], [236.16, 210.60], [237.46, 211.86], [237.76, 212.18], [239.36, 214.02], [240.32, 215.16], [240.66, 215.54], [241.50, 216.42], [241.86, 216.84], [242.32, 217.32], [242.74, 219.80], [243.42, 220.52], [243.76, 220.96], [244.72, 222.12], [245.30, 222.78], [245.92, 223.58], [246.38, 224.20], [247.56, 225.42], [248.28, 226.16], [249.52, 227.32], [250.12, 227.96], [250.74, 228.44], [251.98, 229.94], [253.34, 231.66], [253.84, 232.22], [254.70, 232.86], [255.38, 233.84], [256.70, 235.78], [257.58, 236.94], [258.30, 237.72], [259.82, 239.24], [260.46, 240.04], [260.82, 240.46], [261.58, 241.44], [262.18, 242.08], [263.06, 243.32], [263.82, 244.14], [265.20, 245.72], [265.6, 245.95]];
const MAPH = [[278.42, 246.52], [279.78, 247.80], [280.92, 249.32], [281.56, 249.96], [282.08, 250.54], [283.56, 252.06], [284.86, 253.58], [285.26, 253.96], [286.68, 255.98], [287.80, 257.48], [289.48, 259.34], [290.40, 260.52], [290.68, 260.98], [292.00, 262.54], [292.80, 263.80], [294.04, 265.48], [294.32, 265.98], [300.7, 270.0], [303.5, 270.6]];
function mapT(m, t) {
  if (t <= m[0][0]) return m[0][1] + (t - m[0][0]);
  for (let i = 1; i < m.length; i++) if (t < m[i][0]) { const [n0, o0] = m[i - 1], [n1, o1] = m[i]; return o0 + (t - n0) * (o1 - o0) / (n1 - n0); }
  const [n, o] = m[m.length - 1]; return o + (t - n);
}
const HEADER = (t) => drawTitle(CX, 250, 54, t, -100, 1);

/* ---------- N1: remote control + fast microbes (37.5 – 50) ---------- */
function sceneN1(t) {
  camSet(CX, 960, 1); bgDark(t);
  HEADER(t);
  const p1 = 1 - P(t, 43.1, 43.7);           // remote phase fades
  const shrink = eio(P(t, 43.2, 44.0));
  const jx = CX, jy = lerp(880, 680, shrink), js = lerp(1.45, 1.05, shrink);
  const warm = eio(P(t, 41.8, 42.5)) * (1 - P(t, 43.2, 43.8));
  const temp = lerp(.3, .88, eel(P(t, 39.4, 40.6)));
  // microbe multiplication inside jar
  const mult = P(t, 44.2, 45.6);
  drawJar(jx, jy, js, { t, cork: 1, glow: .6 + warm * .6, glowCol: warm > .3 ? C.amber : C.teal, warm, net: .2,
    inner: mult > 0 ? (s) => { const r = rng(5); for (let i = 0; i < 60 * mult; i++) { const x = (-.8 + r() * 1.6) * 110 * s * .85, y = (-.5 + r() * 1.3) * 150 * s * .85; drawSprite(SP[SPK[i % SPK.length]], x + Math.sin(t + i) * 5, y + Math.cos(t * .8 + i) * 4, i, .3 * s, clamp(mult * 3 - i / 30)); } } : null });
  withA(p1, () => {
    // dials
    dial(165, 700, 60, temp, 'TEMP', C.red, 1, Math.round(lerp(20, 37, (temp - .3) / .58)) + '°C');
    dial(915, 860, 60, .4, 'O₂', C.cyan, 1, '21%');
    dial(165, 1010, 60, .82, 'LIGHT', C.amber, 1, '12 h');
    const lk = [P(t, 40.9, 41.2), P(t, 41.2, 41.5)];
    iconLock(915 + 52, 860 - 52, 1.1 * eback(lk[0]), C.ink, lk[0]); iconLock(165 + 52, 1010 - 52, 1.1 * eback(lk[1]), C.ink, lk[1]);
    // remote
    const ra = eback(P(t, 38.6, 39.1));
    if (ra > 0) {
      X.save(); X.translate(CX, 1390); X.scale(ra, ra);
      X.beginPath(); X.roundRect(-300, -130, 600, 260, 40); X.fillStyle = '#0d2633'; X.fill(); X.save(); X.shadowColor = C.teal; X.shadowBlur = 24; stroke(rgba(C.teal, .7), 3); X.stroke(); X.restore();
      [['TEMP', C.red, temp, 0], ['O₂', C.cyan, .4, lk[0]], ['LIGHT', C.amber, .82, lk[1]]].forEach(([lb, col, v, lock], i) => {
        const y = -70 + i * 70; T(lb, -260, y, { size: 22, font: 'JB', weight: 600, color: col, align: 'left' });
        X.beginPath(); X.roundRect(-140, y - 6, 320, 12, 6); X.fillStyle = 'rgba(255,255,255,.1)'; X.fill();
        X.beginPath(); X.roundRect(-140, y - 6, 320 * v, 12, 6); X.fillStyle = col; X.fill();
        X.beginPath(); X.arc(-140 + 320 * v, y, 16, 0, TAU); X.fillStyle = C.ink; X.fill();
        if (lock > 0) iconLock(225, y, .9, C.muted, lock);
      });
      X.restore();
    }
    chipA('CHANGE ONE VARIABLE', CX, 330 + 70, C.amber, t, 39.4, 999, { size: 24 });
    chipA('HOLD THE REST', CX, 330 + 140, C.muted, t, 40.95, 999, { size: 22 });
    const ek = P(t, 41.8, 42.1);
    if (ek > 0) for (let k = 0; k < 6; k++) { const ph = (t * .7 + k / 6) % 1; X.beginPath(); X.arc(jx + Math.sin(ph * 6 + k) * 20, jy - 300 - ph * 120, 6 + ph * 8, 0, TAU); X.strokeStyle = rgba(C.amber, ek * (1 - ph)); X.lineWidth = 3; X.stroke(); }
    chipA('SEE THE EFFECT — CLEARLY', CX, 1180, C.amber, t, 42.3, 999, { size: 24, fillA: .2 });
  });
  // fast: doubling row
  const da = IO(t, 44.2, 999, .4, .3);
  if (da > 0) withA(da, () => {
    [1, 2, 4, 8].forEach((n, i) => { const a = eback(P(t, 44.3 + i * .3, 44.7 + i * .3)); if (a <= 0) return; const x = 200 + i * 230, y = 1080;
      for (let k = 0; k < n; k++) { const ang = k / n * TAU; const rr = n === 1 ? 0 : 14 + n * 3; drawSprite(SP.cocM, x + Math.cos(ang) * rr * 1.3, y + Math.sin(ang) * rr * 1.3, ang, .62 * a); }
      if (i < 3) T('→', x + 115, y, { size: 36, color: C.muted, alpha: clamp(a) }); });
    TA('microbes multiply FAST', CX, 1180, t, 44.9, 999, { size: 30, font: 'JB', weight: 600, color: C.mag });
  });
  // years vs weeks
  const ya = IO(t, 46.4, 999, .4, .3);
  if (ya > 0) withA(ya, () => {
    const yk = eo(P(t, 46.5, 47.6)), wk = eo(P(t, 48.6, 49.4));
    T('IN NATURE', 120, 1300, { size: 22, font: 'JB', weight: 600, color: C.green, align: 'left', ls: 3 });
    X.beginPath(); X.roundRect(120, 1325, 840 * yk, 28, 14); X.fillStyle = C.green; X.fill();
    T('YEARS', 120 + 840 * yk - 12, 1395, { size: 34, color: C.green, align: 'right', alpha: P(t, 46.8, 47.2) });
    T('IN YOUR LAB', 120, 1460, { size: 22, font: 'JB', weight: 600, color: C.amber, align: 'left', ls: 3, alpha: P(t, 48.2, 48.6) });
    X.beginPath(); X.roundRect(120, 1485, Math.max(1, 110 * wk), 28, 14); X.fillStyle = C.amber; X.fill();
    T('WEEKS', 260, 1499, { size: 34, color: C.amber, align: 'left', alpha: P(t, 49.2, 49.5), glow: 14 });
  });
}

/* ---------- Winogradsky extra narration overlays (on top of old C) ---------- */
function overlayC(t) {
  camSet(CX, 960, 1 + .03 * eio(P(mapT(MAPC, t), 80, 105)));
  chipA('like a microbial layer cake', CX, 395, C.amber, t, 100.4, 102.1, { size: 22 });
  chipA('NO OXYGEN at the bottom', CX, 395, C.red, t, 102.2, 104.5, { size: 22 });
  // H2S rising from SRB band
  const ha = IO(t, 106.5, 112.9, .4, .5);
  if (ha > 0) for (let i = 0; i < 12; i++) { const ph = (t * .35 + i / 12) % 1; const y = lerp(1460, 1100, ph); glowCircle(440 + ((i * 47) % 200), y, 8, '#ffe066', ha * (1 - ph) * .9); }
  chipA('releases H₂S', CX, 395, '#ffe066', t, 106.5, 108.0, { size: 22 });
  chipA('→ that’s why the mud turns BLACK', CX, 395, C.ink, t, 108.0, 109.5, { size: 22 });
  chipA('H₂S rises… and meets the light', CX, 395, C.amber, t, 109.5, 112.7, { size: 22 });
  chipA('both: photosynthesis WITHOUT O₂', CX, 395, C.mag, t, 117.7, 120.2, { size: 22 });
  chipA('the top: where the O₂ is', CX, 395, C.cyan, t, 120.2, 122.6, { size: 22 });
}

/* ---------- N2: the smart researcher (265.6 – 272.7) ---------- */
function sceneN2(t) {
  camSet(CX, 960, 1); bgDark(t);
  TA('THE SMART RESEARCHER', CX, 330, t, 266.6, 999, { size: 32, font: 'JB', weight: 600, color: C.amber, ls: 6 });
  TA("doesn't ask", CX, 470, t, 267.4, 999, { size: 28, font: 'JB', weight: 400, color: C.muted });
  card(CX, 680, 900, 260, C.red, P(t, 267.9, 268.3), 0);
  TA('Is the microcosm', CX, 640, t, 268.0, 999, { size: 50 });
  TA('realistic?', CX, 710, t, 268.8, 999, { size: 50 });
  const sk = eo(P(t, 269.3, 269.8)); if (sk > 0) { line(160, 760, lerp(160, 920, sk), 600, C.red, 8); }
  TA('it asks', CX, 900, t, 269.4, 999, { size: 28, font: 'JB', weight: 400, color: C.muted });
  card(CX, 1150, 900, 380, C.teal, P(t, 270.0, 270.4), P(t, 271.3, 271.8));
  TA('Is it realistic', CX, 1060, t, 270.15, 999, { size: 50 });
  TA('ENOUGH', CX, 1150, t, 270.95, 999, { size: 80, color: C.teal, glow: 22 });
  TA('for MY question?', CX, 1240, t, 271.35, 999, { size: 50 });
  badge(900, 980, 34, true, P(t, 271.6, 271.9), P(t, 271.6, 272.1));
}

/* ---------- N3 / N4: question for you ---------- */
function bubble(x, y, s, a, t) {
  withA(a, () => { X.save(); X.translate(x, y); X.scale(s, s); X.beginPath(); X.roundRect(-150, -100, 300, 180, 40); X.moveTo(-60, 80); X.lineTo(-90, 140); X.lineTo(-10, 80); X.closePath(); X.fillStyle = rgba(C.teal, .15); X.fill(); X.shadowColor = C.teal; X.shadowBlur = 24; stroke(C.teal, 6); X.stroke(); X.shadowBlur = 0;
    for (let i = 0; i < 3; i++) { const b = .5 + .5 * Math.sin(t * 5 - i * .8); X.beginPath(); X.arc(-60 + i * 60, -10, 16, 0, TAU); X.fillStyle = rgba(C.ink, .4 + .6 * b); X.fill(); } X.restore(); });
}
function sceneN3(t) {
  camSet(CX, 960, 1); bgDark(t);
  TA('A QUESTION FOR YOU', CX, 330, t, 272.4, 999, { size: 32, font: 'JB', weight: 600, color: C.amber, ls: 6 });
  bubble(CX, 720, eback(P(t, 272.5, 273.1)), P(t, 272.5, 272.8), t);
  TA('If you designed a microcosm', CX, 1000, t, 273.6, 999, { size: 40 });
  TA('today…', CX, 1060, t, 275.1, 999, { size: 40 });
  TA('what would you test?', CX, 1180, t, 275.6, 999, { size: 62, color: C.teal, glow: 20 });
  chipA('↓  write it in the comments', CX, 1330, C.amber, t, 276.9, 999, { size: 28, fillA: .2 });
}
function overlayN4(t) {
  camSet(CX, 960, 1);
  const a = P(t, 294.6, 295.2);
  if (a <= 0) return;
  withA(a, () => { const g = X.createLinearGradient(0, 0, 0, 760); g.addColorStop(0, 'rgba(2,8,14,.6)'); g.addColorStop(.75, 'rgba(2,8,14,.45)'); g.addColorStop(1, 'rgba(2,8,14,0)'); X.fillStyle = g; X.fillRect(0, 0, W, 760); });
  bubble(CX, 300, .55 * eback(P(t, 294.7, 295.3)), a, t);
  TA('if you designed one today…', CX, 470, t, 295.85, 999, { size: 34 });
  TA('what would you test?', CX, 540, t, 297.7, 999, { size: 52, color: C.teal, glow: 18 });
  chipA('↓  comments', CX, 640, C.amber, t, 299.35, 999, { size: 26, fillA: .2 });
}

/* ---------- master ---------- */
const SEGS = [
  { a: 0, b: 37.95, old: MAPA },
  { a: 37.5, b: 50.05, fn: sceneN1 },
  { a: 49.62, b: 75.45, old: MAPB },
  { a: 75.0, b: 266.05, old: MAPC, ov: overlayC },
  { a: 265.6, b: 272.85, fn: sceneN2 },
  { a: 272.36, b: 278.85, fn: sceneN3 },
  { a: 278.42, b: 999, old: MAPH, ov: overlayN4 },
];
const XF = .45;
function draw(t) {
  X.setTransform(1, 0, 0, 1, 0, 0); X.globalAlpha = 1; X.globalCompositeOperation = 'source-over'; X.fillStyle = C.bg0; X.fillRect(0, 0, W, H);
  for (const s of SEGS) {
    if (t < s.a || t > s.b) continue;
    const A = s.a === 0 ? 1 : eio(P(t, s.a, s.a + XF)); if (A <= 0) continue;
    if (s.old) renderOld(mapT(s.old, t), A);
    else { X.save(); X.globalAlpha = A; s.fn(t); X.restore(); }
    if (s.ov) { X.save(); X.globalAlpha = A; s.ov(t); X.restore(); }
  }
  GZ = 1; X.setTransform(1, 0, 0, 1, 0, 0); X.globalAlpha = 1; X.drawImage(VIG, 0, 0);
  const n = NOISE[Math.floor(t * 30) % 3]; X.globalAlpha = .035; X.fillStyle = X.createPattern(n, 'repeat'); X.save(); const ox = (Math.floor(t * 30) * 73) % 256; X.translate(ox, ox * .6); X.fillRect(-256, -256, W + 512, H + 512); X.restore(); X.globalAlpha = 1;
  const fb = 1 - P(t, 0, .6) + P(t, 302.2, 303); if (fb > 0) { X.fillStyle = `rgba(0,0,0,${clamp(fb)})`; X.fillRect(0, 0, W, H); }
}
window.frame = (t) => { draw(t); return cv.toDataURL('image/jpeg', .94); };
window.draw = draw;
const FONTS = [['SG', 'space-grotesk-latin-500-normal.woff2', 500], ['SG', 'space-grotesk-latin-700-normal.woff2', 700], ['CAIRO', 'cairo-arabic-700-normal.woff2', 700, 'U+0600-06FF,U+0750-077F,U+FB50-FDFF,U+FE70-FEFF'], ['CAIRO', 'cairo-arabic-900-normal.woff2', 900, 'U+0600-06FF,U+0750-077F,U+FB50-FDFF,U+FE70-FEFF'], ['JB', 'jetbrains-mono-latin-400-normal.woff2', 400], ['JB', 'jetbrains-mono-latin-600-normal.woff2', 600]];
Promise.all(FONTS.map(([f, u, w, ur]) => { const ff = new FontFace(f, `url(fonts/${u})`, Object.assign({ weight: String(w) }, ur ? { unicodeRange: ur } : {})); document.fonts.add(ff); return ff.load(); }))
  .then(() => { draw(0); window.READY = true; }).catch(e => { window.ERR = String(e); window.READY = true; });
