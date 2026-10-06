'use strict';
/* ==========================================================
   MICROCOSM — REEL (1080x1920) full explainer
   timeline keyed to vo.wav word timestamps
   ========================================================== */
const CX = 540;
function bpJar(x, y, s, t, dp, col) {
  X.save(); X.translate(x, y); stroke(col || 'rgba(200,235,255,.95)', 3); X.setLineDash([1500 * s * dp, 1600 * s]); jarPath(s, false); X.stroke(); X.setLineDash([]); X.restore();
}
function hdr(str, t, t0, t1, o = {}) { TA(str, CX, o.y || 300, t, t0, t1, Object.assign({ size: 56, color: C.ink }, o)); }
function sub(str, x, y, t, t0, t1, o = {}) { TA(str, x, y, t, t0, t1, Object.assign({ size: 24, font: 'JB', weight: 400, color: C.muted }, o)); }
function bpBG() {
  X.fillStyle = '#082238'; X.fillRect(-300, -300, W + 600, H + 600);
  const g = X.createRadialGradient(CX, 800, 100, CX, 900, 1400); g.addColorStop(0, 'rgba(30,90,140,.55)'); g.addColorStop(1, 'rgba(0,0,0,0)'); X.fillStyle = g; X.fillRect(-300, -300, W + 600, H + 600);
  for (let x = -200; x <= W + 200; x += 40) line(x, -200, x, H + 200, x % 200 === 0 ? 'rgba(120,190,255,.14)' : 'rgba(120,190,255,.06)', 1);
  for (let y = -200; y <= H + 200; y += 40) line(-200, y, W + 200, y, y % 200 === 0 ? 'rgba(120,190,255,.14)' : 'rgba(120,190,255,.06)', 1);
}
function card(cx, cy, w, h, col, a, act = 0) {
  withA(a, () => { X.beginPath(); X.roundRect(cx - w / 2, cy - h / 2, w, h, 26); X.fillStyle = 'rgba(8,28,40,.82)'; X.fill(); X.save(); if (act > 0) { X.shadowColor = col; X.shadowBlur = 30 * act; } stroke(rgba(col, .25 + .6 * act), 2.5); X.stroke(); X.restore(); X.fillStyle = rgba(col, .9); X.fillRect(cx - w / 2, cy - h / 2 + 30, 6, h - 60); });
}
function drawHelix(x, y, len, col, a, t, amp = 16) {
  withA(a, () => { for (let k = 0; k < 2; k++) { X.beginPath(); for (let i = 0; i <= 40; i++) { const xx = x - len / 2 + len * i / 40, yy = y + Math.sin(i / 40 * TAU * 2 + t * 2 + k * Math.PI) * amp; i ? X.lineTo(xx, yy) : X.moveTo(xx, yy); } stroke(col, 4); X.stroke(); }
    for (let i = 0; i <= 12; i++) { const xx = x - len / 2 + len * i / 12, s1 = Math.sin(i / 12 * TAU * 2 + t * 2); line(xx, y + s1 * amp, xx, y - s1 * amp, rgba(col, .5), 2); } });
}
function iconTooth(x, y, s, col, a) { withA(a, () => { X.save(); X.translate(x, y); X.scale(s, s); X.beginPath(); X.moveTo(-40, -30); X.bezierCurveTo(-46, -64, -10, -66, 0, -50); X.bezierCurveTo(10, -66, 46, -64, 40, -30); X.bezierCurveTo(36, 0, 30, 10, 24, 50); X.quadraticCurveTo(16, 66, 10, 40); X.quadraticCurveTo(0, 14, -10, 40); X.quadraticCurveTo(-16, 66, -24, 50); X.bezierCurveTo(-30, 10, -36, 0, -40, -30); X.closePath(); X.fillStyle = rgba(col, .15); X.fill(); stroke(col, 5 / s); X.stroke(); for (const [dx, dy] of [[-28, -20], [-18, -8], [22, -14], [30, -28], [-8, -2]]) { X.beginPath(); X.arc(dx, dy, 6, 0, TAU); X.fillStyle = rgba(C.amber, .9); X.fill(); } X.restore(); }); }
function iconPill(x, y, s, a) { withA(a, () => { X.save(); X.translate(x, y); X.scale(s, s); X.rotate(-.6); X.beginPath(); X.roundRect(-46, -18, 46, 36, [18, 0, 0, 18]); X.fillStyle = C.red; X.fill(); X.beginPath(); X.roundRect(0, -18, 46, 36, [0, 18, 18, 0]); X.fillStyle = C.ink; X.fill(); X.restore(); }); }
function iconSnow(x, y, s, col, a) { withA(a, () => { X.save(); X.translate(x, y); X.scale(s, s); for (let i = 0; i < 3; i++) { X.rotate(Math.PI / 3); line(-36, 0, 36, 0, col, 5 / s); for (const d of [-22, 22]) { line(d, 0, d + (d > 0 ? 10 : -10), -10, col, 4 / s); line(d, 0, d + (d > 0 ? 10 : -10), 10, col, 4 / s); } } X.restore(); }); }
function oilBlob(x, y, r, t, a) { withA(a, () => { X.beginPath(); for (let i = 0; i <= 48; i++) { const an = i / 48 * TAU, rr = r * (1 + .1 * Math.sin(3 * an + t) + .05 * Math.sin(5 * an - t * 2)); const px = x + Math.cos(an) * rr * 1.3, py = y + Math.sin(an) * rr * .8; i ? X.lineTo(px, py) : X.moveTo(px, py); } X.closePath(); X.fillStyle = '#0b0b10'; X.fill(); stroke(C.purp, 3); X.stroke(); }); }

/* ==========================================================
   SCENE A — hook + definition (0 – 39.2)
   ========================================================== */
const S1S = sprite(W, H, (c) => {
  let g = c.createLinearGradient(0, 0, 0, 710); g.addColorStop(0, '#04111b'); g.addColorStop(1, '#0f2f3c'); c.fillStyle = g; c.fillRect(0, 0, W, 720);
  const r = rng(3); c.fillStyle = 'rgba(200,240,255,.6)'; for (let i = 0; i < 90; i++) { c.globalAlpha = .2 + r() * .6; c.beginPath(); c.arc(r() * W, r() * 560, r() * 1.6, 0, TAU); c.fill(); } c.globalAlpha = 1;
  c.fillStyle = '#0a2229'; c.beginPath(); c.moveTo(0, 700); for (let x = 0; x <= W; x += 30) c.lineTo(x, 650 - Math.sin(x / 200) * 40 - Math.sin(x / 70) * 10); c.lineTo(W, 720); c.lineTo(0, 720); c.fill();
  [[700, '#55361f'], [1000, '#43291a'], [1320, '#311e13'], [1640, '#24160e']].forEach(([y0, col], i) => { c.fillStyle = col; c.beginPath(); c.moveTo(0, y0); for (let x = 0; x <= W; x += 30) c.lineTo(x, y0 + Math.sin(x / 120 + i) * 12 + Math.sin(x / 41 + i * 2) * 4); c.lineTo(W, H); c.lineTo(0, H); c.fill(); });
  for (let i = 0; i < 4000; i++) { c.fillStyle = `rgba(${r() < .5 ? '255,220,180' : '0,0,0'},${.05 + r() * .12})`; c.fillRect(r() * W, 710 + r() * 1210, 2, 2); }
  for (let i = 0; i < 120; i++) { const x = r() * W, y = 740 + r() * 1180, rr = 4 + r() * 16; c.fillStyle = r() < .5 ? '#6a5040' : '#3a2a20'; c.beginPath(); c.ellipse(x, y, rr * 1.3, rr, r() * 3, 0, TAU); c.fill(); c.fillStyle = 'rgba(255,255,255,.08)'; c.beginPath(); c.ellipse(x - rr * .3, y - rr * .3, rr * .5, rr * .3, 0, 0, TAU); c.fill(); }
  c.strokeStyle = 'rgba(120,85,55,.55)'; c.lineCap = 'round';
  for (let i = 0; i < 7; i++) { let x = 60 + r() * 960, y = 705; c.lineWidth = 5; c.beginPath(); c.moveTo(x, y); for (let k = 0; k < 7; k++) { const nx = x + (r() - .5) * 90, ny = y + 40 + r() * 60; c.quadraticCurveTo(x + (r() - .5) * 60, (y + ny) / 2, nx, ny); x = nx; y = ny; } c.stroke(); }
  for (let i = 0; i < 420; i++) { const x = r() * W, hh = 10 + r() * 26; c.strokeStyle = r() < .5 ? '#3f7a3a' : '#5a9a45'; c.lineWidth = 2; c.beginPath(); c.moveTo(x, 706); c.quadraticCurveTo(x + (r() - .5) * 10, 706 - hh * .6, x + (r() - .5) * 14, 706 - hh); c.stroke(); }
});
const OILX = 540, OILY = 1200;
const BAC = (() => { const r = rng(17); return Array.from({ length: 30 }, (_, i) => ({ x: 70 + r() * 940, y: 790 + r() * 1000, k: ['rodT', 'rodA', 'cocM', 'spG', 'rodC'][i % 5], ph: r() * TAU, th: i / 30 * TAU + r() * .1, d: r() })); })();
function oilR(t) { return lerp(140, 28, eio(P(t, 3.6, 9.6))); }
function world1(t) {
  X.setTransform(1, 0, 0, 1, 0, 0); X.drawImage(S1S, 0, 0);
  const r = oilR(t);
  for (let k = 0; k < 50; k++) {
    const ts = 3.7 + k * .12; if (t < ts) break; const age = t - ts, life = 1.6; if (age > life + 1.4) continue;
    const an = (k * 2.399) % TAU, d = oilR(ts) * 1.1 + age * 60; const px = OILX + Math.cos(an) * d * 1.3, py = OILY + Math.sin(an) * d * .8;
    if (age < life) { X.beginPath(); X.arc(px, py, 9 * (1 - age / life), 0, TAU); X.fillStyle = '#0b0b10'; X.fill(); X.strokeStyle = rgba(C.purp, .6); X.lineWidth = 1.5; X.stroke(); }
    else { const ba = age - life; X.beginPath(); X.arc(px, py - ba * 60, 4 + ba * 2, 0, TAU); X.strokeStyle = rgba(C.cyan, .7 * (1 - ba / 1.4)); X.lineWidth = 2; X.stroke(); }
  }
  const oa = P(t, 2.7, 3.2);
  if (oa > 0) {
    X.save(); X.globalAlpha = oa; const rr = r * eback(P(t, 2.7, 3.3)); X.beginPath(); for (let i = 0; i <= 72; i++) { const a = i / 72 * TAU; const q = rr * (1 + .09 * Math.sin(3 * a + t * 1.3) + .05 * Math.sin(5 * a - t * 2) + .04 * Math.sin(7 * a + 1)); const px = OILX + Math.cos(a) * q * 1.3, py = OILY + Math.sin(a) * q * .8; i ? X.lineTo(px, py) : X.moveTo(px, py); } X.closePath();
    const g = X.createRadialGradient(OILX - r * .4, OILY - r * .3, r * .05, OILX, OILY, r * 1.4); g.addColorStop(0, '#2b2a33'); g.addColorStop(.5, '#0c0c11'); g.addColorStop(1, '#050507');
    X.fillStyle = g; X.shadowColor = rgba(C.purp, .6); X.shadowBlur = 30; X.fill(); X.shadowBlur = 0;
    const ig = X.createLinearGradient(OILX - r * 1.3, OILY - r, OILX + r * 1.3, OILY + r); ig.addColorStop(0, C.purp); ig.addColorStop(.5, C.teal); ig.addColorStop(1, C.amber);
    X.strokeStyle = ig; X.lineWidth = 4; X.globalAlpha = oa * .85; X.stroke(); X.globalAlpha = oa * .25; X.fillStyle = '#fff'; X.beginPath(); X.ellipse(OILX - r * .45, OILY - r * .35, r * .35, r * .12, -.3, 0, TAU); X.fill(); X.restore();
  }
  BAC.forEach((b, i) => {
    const ap = eback(P(t, 1.7 + i * .025, 2.15 + i * .025)); if (ap <= 0) return;
    const m = eio(P(t, 3.1 + (i % 7) * .08, 5.4 + (i % 7) * .1));
    const ring = r + 34 + b.d * 26, th = b.th + t * .08;
    const tx = OILX + Math.cos(th) * ring * 1.3, ty = OILY + Math.sin(th) * ring * .8;
    const wx = b.x + Math.sin(t * .9 + b.ph) * 22, wy = b.y + Math.cos(t * .7 + b.ph) * 16;
    const x = lerp(wx, tx, m) + Math.cos(th) * Math.sin(t * 9 + i) * 4 * m, y = lerp(wy, ty, m) + Math.sin(th) * Math.sin(t * 9 + i) * 3 * m;
    drawSprite(SP[b.k], x, y, lerp(b.ph + Math.sin(t * .8 + b.ph) * .7, th + Math.PI, m), .62 * ap);
  });
  chipA('SOIL BACTERIA', 250, 790, C.teal, t, 1.9, 10.1);
  chipA('OIL SPILL', OILX, 1010, C.purp, t, 4.0, 10.1, { size: 26 });
}
const WC = document.createElement('canvas'); WC.width = W; WC.height = H; const WX = WC.getContext('2d');
const TAGS = (() => { const r = rng(44); const L = ['pH', 'O₂', 'MOISTURE', 'PREDATORS', 'SEASONS', 'UV', 'SALINITY', 'NUTRIENTS', 'GRAZERS', 'WIND', 'CO₂', 'ROOTS', 'METALS', 'VIRUSES', 'COMPETITION', 'Fe²⁺', 'NO₃⁻', 'fungi']; return L.map((s, i) => ({ s, x: 110 + r() * 860, y: 330 + r() * 900, ph: r() * TAU, c: [C.cyan, C.amber, C.mag, C.green, C.purp][i % 5] })); })();
const TITLE = 'MICROCOSM';
function drawTitle(cx, cy, size, t, t0, a = 1, ls = 10) {
  if (a <= 0) return;
  const lsp = ls * size / 130; const tw = TW(TITLE, size, 'SG', 700, lsp); let x = cx - tw / 2;
  for (let i = 0; i < TITLE.length; i++) {
    const ch = TITLE[i]; const cw = TW(ch, size, 'SG', 700, lsp); const k = P(t, t0 + i * .045, t0 + i * .045 + .55);
    if (k > 0) { const e = eo(k); X.save(); X.globalAlpha *= a * e; X.translate(x + cw / 2, cy + (1 - e) * size * .5); X.scale(1, lerp(.6, 1, eback(k)));
      X.font = `700 ${size}px SG`; X.textAlign = 'center'; X.textBaseline = 'middle';
      const gg = X.createLinearGradient(0, -size / 2, 0, size / 2); gg.addColorStop(0, '#ffffff'); gg.addColorStop(1, C.teal); X.fillStyle = gg;
      X.shadowColor = C.teal; X.shadowBlur = size * .35 * (1 - .6 * P(t, t0 + 1.2, t0 + 2.5)); X.fillText(ch, 0, 0); X.restore(); }
    x += cw;
  }
}
function sceneA(t) {
  const bump = eio(P(t, 25.0, 26.2)) - eio(P(t, 27.8, 29.0));
  const z = 1 + .05 * eio(P(t, 0, 10)) - .05 * eio(P(t, 10, 11.4)) + .1 * bump;
  camSet(CX, 960 - 40 * bump, z);
  bgDark(t, P(t, 10, 12));
  // world card
  if (t < 13.6) {
    const sx = X; X = WX; world1(t); X = sx;
    const pre = eio(P(t, 10.4, 12.0)), p = eio(P(t, 12.0, 12.95));
    const sc = lerp(1 - .05 * pre, .19, p), cy = lerp(960, 1130, p), ca = (1 - .3 * pre) * (1 - P(t, 12.7, 13.2));
    withA(ca, () => { X.save(); X.translate(CX, cy); X.scale(sc, sc); X.beginPath(); X.roundRect(-W / 2, -H / 2, W, H, lerp(0, 160, p)); X.clip(); X.drawImage(WC, -W / 2, -H / 2); X.restore(); });
  }
  // factors
  if (t > 4.4 && t < 10.6) {
    camSet(CX, 960, 1); const out = 10.2;
    iconCloud(260, 400, 1.1 * eback(P(t, 6.2, 6.7)), C.ink, IO(t, 6.2, out));
    iconRain(260, 452, 1.05, C.cyan, IO(t, 6.95, out), t);
    TA('WEATHER', 260, 300, t, 6.3, out, { size: 20, font: 'JB', weight: 600, color: C.muted, ls: 4 });
    TA('RAIN', 140, 560, t, 7.05, out, { size: 20, font: 'JB', weight: 600, color: C.cyan, ls: 4 });
    iconThermo(820, 410, 1.0 * eback(P(t, 7.7, 8.2)), C.ink, IO(t, 7.7, out), .45 + .3 * Math.sin(t * 4));
    TA('TEMPERATURE', 820, 545, t, 7.8, out, { size: 20, font: 'JB', weight: 600, color: C.red, ls: 4 });
    TAGS.forEach((g, i) => { const t0 = 8.5 + i * .03; const a = IO(t, t0, out + i * .01, .25, .35); if (a <= 0) return; chip(g.s, g.x + Math.sin(t * 7 + g.ph) * 5, g.y + Math.cos(t * 6 + g.ph) * 5, g.c, a * .9, { size: 18, pop: P(t, t0, t0 + .35) }); });
    chipA('YOU CAN’T CONTROL IT', CX, 262, C.red, t, 5.25, out, { size: 26 });
    TA('× 1000', CX, 700, t, 8.6, out, { size: 120, glow: 24, glowColor: C.red });
    TA('OTHER FACTORS', CX, 800, t, 8.8, out, { size: 46, font: 'JB', weight: 600, color: C.ink, ls: 6 });
    camSet(CX, 960 - 40 * bump, z);
  }
  // jar
  const [jx, jy, js] = track(t, [CX, 1050, 2.0], [[13.9, 14.9, [CX, 820, 1.55]], [17.2, 18.2, [CX, 880, 1.45]], [33.0, 33.8, [330, 980, .75]]]);
  const glow = P(t, 13.8, 14.6) * (1 + .3 * Math.sin(t * 2.2)) * (1 - .4 * P(t, 18, 19)) + .6 * IO(t, 38.1, 41, .4, .4);
  const ba = IO(t, 19.9, 33.4, .6, .5);
  if (ba > 0) withA(ba, () => {
    const by = jy + 150 * js + 4, bw = 860 * eo(P(t, 19.9, 20.6));
    const g = X.createLinearGradient(0, by, 0, by + 40); g.addColorStop(0, '#2a4a58'); g.addColorStop(1, '#0d1e26'); X.fillStyle = g; X.fillRect(CX - bw / 2, by, bw, 36); line(CX - bw / 2, by, CX + bw / 2, by, 'rgba(200,240,255,.6)', 2);
    for (const [fx, sc, col] of [[180, .9, C.cyan], [880, .8, C.mag], [960, .6, C.amber]]) withA(P(t, 20.1, 20.7), () => { X.save(); X.translate(fx, by); X.scale(sc, sc); stroke('rgba(200,240,255,.55)', 3); X.beginPath(); X.moveTo(-14, -120); X.lineTo(-14, -70); X.lineTo(-50, 0); X.lineTo(50, 0); X.lineTo(14, -70); X.lineTo(14, -120); X.stroke(); X.fillStyle = rgba(col, .35); X.beginPath(); X.moveTo(-34, -30); X.lineTo(-50, 0); X.lineTo(50, 0); X.lineTo(34, -30); X.fill(); X.restore(); });
  });
  const net = IO(t, 24.9, 28.6, .9, .6);
  drawJar(jx, jy, js, { t, draw: eio(P(t, 10.8, 12.0)), fill: P(t, 12.7, 13.25), cork: P(t, 12.85, 13.3), glow, net, hl: IO(t, 29.2, 32.9, .4, .4), a: P(t, 10.75, 10.9) });

  camSet(CX, 960, 1);
  // title → header
  if (t > 15.1) {
    const k = eio(P(t, 17.1, 18.0)); const cy = lerp(1300, 250, k), sz = lerp(116, 54, k);
    drawTitle(CX, cy, sz, t, 15.25, 1);
    TA('ميكروكوزم', CX, 1420, t, 15.7, 17.3, { size: 64, font: 'CAIRO', weight: 900, color: C.amber, rtl: true });
    TA('mikrós = small  ·  kósmos = world', CX, 1500, t, 16.0, 17.3, { size: 26, font: 'JB', weight: 400, color: C.muted });
    TA('= literally, a small world', CX, 1565, t, 16.66, 17.3, { size: 30, font: 'JB', weight: 600, color: C.amber });
  }
  // definition
  if (t > 18 && t < 22.8) {
    const o = 22.4;
    TA('MINIATURE', CX, 1255, t, 18.95, o, { size: 28, font: 'JB', weight: 600, color: C.amber, ls: 10 });
    TA('ECOSYSTEM', CX, 1330, t, 18.15, o, { size: 92, glow: 18, glowColor: C.teal });
    chipA('BUILT IN THE LAB', CX, 1435, C.cyan, t, 20.1, o, { size: 26 });
  }
  // sampling
  if (t > 20.5 && t < 23.5) {
    const ea = IO(t, 20.6, 23.2, .4, .4), ex = 850, ey = 470, er = 110 * eback(P(t, 20.6, 21.2));
    drawField(ex, ey, er, t, ea, { cross: true });
    const dn = eio(P(t, 21.25, 21.7)), up = eio(P(t, 21.8, 22.1)), fly = eio(P(t, 22.1, 22.8));
    if (t < 22.85) withA(ea * P(t, 21.0, 21.3), () => {
      let cx = ex, cy = lerp(250, 440, dn) - up * 170;
      if (fly > 0) { cx = lerp(ex, jx, fly); cy = lerp(cy, jy - 300, fly) - Math.sin(fly * Math.PI) * 140; }
      X.save(); X.translate(cx, cy); X.rotate(fly * -.6); X.beginPath(); X.roundRect(-16, -90, 32, 180, 7); X.fillStyle = 'rgba(190,235,255,.12)'; X.fill(); stroke('rgba(220,245,255,.95)', 3); X.stroke();
      if (up > 0 || fly > 0) { const g = X.createLinearGradient(0, 0, 0, 90); g.addColorStop(0, '#3f8a43'); g.addColorStop(.1, '#6b4528'); g.addColorStop(1, '#2a1a10'); X.fillStyle = g; X.fillRect(-12, 8, 24, 78); }
      X.restore();
    });
    chipA('REAL ENVIRONMENTAL SAMPLE', 820, 625, C.amber, t, 21.4, 23.2, { size: 19 });
  }
  // sources
  if (t > 23.2 && t < 28.2) {
    const o = 27.8;
    [['SOIL', 23.3, '#c98a52'], ['WATER', 23.95, C.cyan], ['SEDIMENT', 24.45, '#a99a86']].forEach(([s, t0, col], i) => {
      const x = 220 + i * 320, y = 1320, a = IO(t, t0, o, .4, .4); if (a <= 0) return; const pop = eback(P(t, t0, t0 + .45));
      withA(a, () => {
        X.save(); X.setLineDash([3, 10]); X.lineDashOffset = -t * 30; lineP(x, y - 70, jx + (x - CX) * .25, jy + 120, rgba(col, .8), 3, eo(P(t, t0 + .2, t0 + .8))); X.restore();
        X.save(); X.translate(x, y); X.scale(pop, pop); X.beginPath(); X.arc(0, 0, 62, 0, TAU); X.fillStyle = 'rgba(8,28,40,.9)'; X.fill(); X.fillStyle = rgba(col, .14); X.fill(); stroke(col, 3); X.stroke();
        if (i === 0) { X.fillStyle = col; X.beginPath(); X.ellipse(0, 8, 34, 22, 0, 0, TAU); X.fill(); X.fillStyle = '#3f8a43'; X.fillRect(-26, -16, 52, 8); }
        if (i === 2) ['#cbb89c', '#9c8a72', '#6f604e'].forEach((c2, k) => { X.fillStyle = c2; X.fillRect(-34, -20 + k * 14, 68, 13); });
        X.restore(); if (i === 1) iconDrop(x, y + 4, .7 * pop, col, 1);
        T(s, x, y + 104, { size: 32 });
      });
    });
    chipA('INTACT MICROBIAL COMMUNITY', CX, 470, C.teal, t, 25.8, 28.2, { size: 24 });
    sub('exactly as it exists in nature', CX, 535, t, 27.05, 28.2);
  }
  // piece of nature + controls
  if (t > 29 && t < 33.5) {
    const o = 33.1;
    TA('A PIECE OF NATURE', CX, 1340, t, 29.2, o, { size: 66, color: C.amber, glow: 16 });
    TA('under conditions YOU control', CX, 1420, t, 31.1, o, { size: 32, font: 'JB', weight: 600 });
    [['TEMP', 165, 700, 31.35, C.red, .68, '28°C'], ['O₂', 915, 860, 31.75, C.cyan, .4, '21%'], ['LIGHT', 165, 1010, 32.15, C.amber, .82, '12 h']].forEach(([lb, x, y, t0, col, v, vt]) => {
      const a = IO(t, t0, o, .4, .4); if (a <= 0) return; const s = eback(P(t, t0, t0 + .45)); const val = lerp(.08, v, eel(P(t, 32.3, 33.1)));
      X.save(); X.translate(x, y); X.scale(s, s); X.translate(-x, -y); dial(x, y, 60, val, lb, col, a, vt); X.restore();
    });
  }
  // comparison rows
  if (t > 33.6) {
    drawPetri(330, 560, 125 * eback(P(t, 33.75, 34.35)), t, P(t, 33.75, 34.2));
    TA('PURE CULTURE', 480, 530, t, 33.9, 999, { size: 50, align: 'left' });
    sub('one species, alone', 480, 590, t, 34.5, 999, { align: 'left' });
    badge(430, 455, 30, false, P(t, 34.9, 35.15), P(t, 34.9, 35.35));
    drawField(330, 1400, 125 * eback(P(t, 35.75, 36.35)), t, P(t, 35.75, 36.2));
    TA('FIELD STUDY', 480, 1370, t, 35.85, 999, { size: 50, align: 'left' });
    sub('everything uncontrolled', 480, 1430, t, 36.4, 999, { align: 'left' });
    badge(430, 1295, 30, false, P(t, 37.3, 37.55), P(t, 37.3, 37.75));
    TA('MICROCOSM', 480, 950, t, 38.1, 999, { size: 50, align: 'left', color: C.teal });
    sub('the middle ground', 480, 1010, t, 38.45, 999, { align: 'left', color: C.teal });
    badge(420, 845, 30, true, P(t, 38.1, 38.35), P(t, 38.1, 38.55));
  }
}

/* ==========================================================
   SCENE B — spectrum, interactions, replicates, mesocosm (38.9 – 75.4)
   ========================================================== */
const TANG = (() => { const r = rng(61); return ['RAIN', 'TEMP', 'pH', 'PREDATORS', 'NUTRIENTS', 'SEASON'].map((s, i) => { const an = i / 6 * TAU + .3; return { s, x: CX + Math.cos(an) * 360, y: 320 + Math.sin(an) * 80, ph: r() * TAU }; }); })();
function foc(t, a, b) { return Math.min(eo(P(t, a, a + .5)), 1 - eo(P(t, b - .3, b + .2))); }
function sceneB(t) {
  camSet(CX, 960, 1); bgDark(t);
  const fL = foc(t, 40.85, 48.75), fR = foc(t, 48.75, 56.5), fM = foc(t, 56.5, 999);
  const outSide = 1 - P(t, 58.8, 59.3);
  const aL = (1 - .7 * Math.max(fR, fM)) * outSide, aR = (1 - .7 * Math.max(fL, fM)) * outSide, aMl = (1 - .7 * Math.max(fL, fR)) * outSide;
  const sf = P(t, 38.9, 39.4); // subs fade
  // spectrum
  const sb = eio(P(t, 39.0, 40.4));
  if (sb > 0) withA(outSide, () => {
    const x = 100, half = 470 * sb, cy = 980; const g = X.createLinearGradient(0, 510, 0, 1450); g.addColorStop(0, C.cyan); g.addColorStop(1, C.green);
    X.save(); X.shadowColor = C.teal; X.shadowBlur = 16; X.fillStyle = g; X.beginPath(); X.roundRect(x - 4, cy - half, 8, half * 2, 4); X.fill(); X.restore();
    if (sb > .98) { arrowHead(x, cy - half - 6, -Math.PI / 2, 22, C.cyan); arrowHead(x, cy + half + 6, Math.PI / 2, 22, C.green); }
    TA('CONTROL', x + 10, 462, t, 40.0, 999, { size: 18, font: 'JB', weight: 600, color: C.cyan, ls: 3 });
    TA('REALISM', x + 10, 1500, t, 40.2, 999, { size: 18, font: 'JB', weight: 600, color: C.green, ls: 3 });
    for (const [y, f] of [[560, fL], [980, fM], [1400, fR]]) { glowCircle(x, y, 40, C.ink, .2 + .6 * f); X.beginPath(); X.arc(x, y, 8 + 5 * f, 0, TAU); X.fillStyle = C.ink; X.fill(); }
    TA('SWEET SPOT', 170, 1050, t, 58.4, 999, { size: 16, font: 'JB', weight: 600, color: C.teal, ls: 3, align: 'left' });
  });
  // rows
  const rows = [
    { y: 560, a: aL, f: fL, name: 'PURE CULTURE', subt: 'one species, alone', col: C.ink, c: [0, 1, 43.6, 44.3], r: [0, .12, 45.3, 46.0], draw: (s) => drawPetri(330, 560, 125 * s, t, 1), bad: [430, 455, false] },
    { y: 1400, a: aR, f: fR, name: 'FIELD STUDY', subt: 'everything uncontrolled', col: C.ink, c: [0, .06, 53.4, 54.0], r: [0, 1, 51.3, 52.2], draw: (s) => drawField(330, 1400, 125 * s, t, 1), bad: [430, 1295, false] },
    { y: 980, a: aMl, f: fM, name: 'MICROCOSM', subt: 'the middle ground', col: C.teal, c: [0, .75, 57.4, 58.4], r: [0, .7, 57.6, 58.6], bad: [420, 845, true] },
  ];
  rows.forEach((rw, i) => {
    if (rw.draw) withA(rw.a, () => { X.save(); X.translate(330, rw.y); X.scale(1 + .08 * rw.f, 1 + .08 * rw.f); X.translate(-330, -rw.y); rw.draw(1); X.restore(); });
    withA(i === 2 ? (1 - .7 * Math.max(fL, fR)) * outSide : rw.a, () => {
      const ty = lerp(rw.y - 30, rw.y - 60, sf);
      T(rw.name, 480, ty, { size: 50, align: 'left', color: rw.col });
      T(rw.subt, 480, rw.y + 30, { size: 24, font: 'JB', weight: 400, color: i === 2 ? C.teal : C.muted, align: 'left', alpha: 1 - sf });
      meter(710, rw.y + 10, 460, lerp(rw.c[0], rw.c[1], eo(P(t, rw.c[2], rw.c[3]))), 'CONTROL', C.cyan, P(t, 39.3, 39.9));
      meter(710, rw.y + 75, 460, lerp(rw.r[0], rw.r[1], eo(P(t, rw.r[2], rw.r[3]))), 'REALISM', C.green, P(t, 39.5, 40.1));
    });
    badge(rw.bad[0], rw.bad[1], 30, rw.bad[2], 1 - P(t, 38.95, 39.4), 1);
  });
  // left callout
  withA(IO(t, 47.0, 48.8, .5, .4), () => { X.save(); X.setLineDash([6, 8]); X.lineDashOffset = t * 20; stroke(rgba(C.red, .8), 3); X.beginPath(); X.arc(150, 330, 48, 0, TAU); X.stroke(); X.restore(); drawSprite(SP.rodT, 150 + Math.sin(t * 2) * 5, 330, Math.sin(t) * .4, .7); line(115, 365, 185, 295, C.red, 4); T('No microbe lives alone in nature', 600, 330, { size: 34 }); });
  // right callout: tangle
  if (t > 54.0 && t < 57) {
    const o = 56.6;
    TANG.forEach((n, i) => chipA(n.s, n.x + Math.sin(t * 3 + n.ph) * 4, n.y, [C.cyan, C.red, C.purp, C.mag, C.green, C.amber][i], t, 54.2 + i * .1, o, { size: 17 }));
    withA(IO(t, 55.0, o, .4, .4), () => {
      for (let i = 0; i < TANG.length; i++) for (let j = 0; j < TANG.length; j++) { if (i === j || (i + j) % 2) continue; const a = TANG[i], b = TANG[j]; const p = eo(P(t, 55.0 + (i + j) * .04, 55.7 + (i + j) * .04)); stroke(rgba(C.ink, .35), 2); X.beginPath(); X.moveTo(a.x, a.y); X.quadraticCurveTo(CX + Math.sin(i * 3 + j) * 160, 320 + Math.cos(i + j * 2) * 60, lerp(a.x, b.x, p), lerp(a.y, b.y, p)); X.stroke(); }
      T('?', CX, 320, { size: 90, color: C.amber, glow: 24, alpha: eback(P(t, 55.3, 55.8)) });
    });
    TA('cause  ⇄  effect ?', CX, 430, t, 55.4, o, { size: 24, font: 'JB', weight: 600, color: C.amber });
  }
  // jar track
  const [jx, jy, js] = track(t, [330, 980, .75], [[58.9, 59.7, [CX, 880, 1.6]], [61.3, 62.0, [220, 760, .7]], [67.4, 68.2, [240, 1430, .5]]]);
  const net = IO(t, 59.5, 61.6, .6, .5);
  const warm = eio(P(t, 65.6, 66.4)) * (1 - P(t, 67.3, 68.0));
  drawJar(jx, jy, js * (1 + .08 * fM * outSide), { t, glow: .5 * IO(t, 38.9, 40, .01, .8) + .7 * IO(t, 56.6, 59.2, .4, .4) + .6 * net + warm * .6, glowCol: warm > .3 ? C.amber : C.teal, net, warm, a: 1 - .7 * Math.max(fL, fR) });
  chipA('INTERACTIONS PRESERVED', CX, 1330, C.teal, t, 59.9, 61.5, { size: 26 });
  sub('competition · cooperation · predation', CX, 1400, t, 60.6, 61.5);
  // replicates
  if (t > 62.5 && t < 68.1) {
    const oa = 1 - P(t, 67.3, 67.8);
    [CX, 860].forEach((x, i) => { const k = eback(P(t, 62.65 + i * .1, 63.15 + i * .1)); drawJar(lerp(220, x, k), 760, .7, { t: t + i * 1.7, warm, glow: warm * .6, glowCol: C.amber, a: P(t, 62.65, 62.85) * oa }); });
    drawJar(CX, 1270, .7 * eback(P(t, 63.25, 63.75)), { t: t + 4, grey: true, a: P(t, 63.25, 63.45) * oa });
    withA(oa, () => {
      const bk = eo(P(t, 62.7, 63.2)); if (bk > 0) { stroke(rgba(C.teal, .9), 3); X.beginPath(); X.moveTo(110, 900); X.lineTo(110, 915); X.lineTo(lerp(110, 970, bk), 915); if (bk > .99) X.lineTo(970, 900); X.stroke(); }
      TA('REPLICATES  × 3', CX, 965, t, 62.7, 999, { size: 36, color: C.teal });
      TA('CONTROL', CX, 1435, t, 63.3, 999, { size: 34, color: C.muted });
      const dk = IO(t, 64.65, 999, .4, .3);
      if (dk > 0) { const s = eback(P(t, 64.65, 65.1)); X.save(); X.translate(CX, 480); X.scale(s, s); X.translate(-CX, -480); dial(CX, 480, 56, lerp(.3, .85, eel(P(t, 65.1, 66.0))), 'TEMP  ▲', C.amber, dk); X.restore(); }
      chipA('CHANGE ONE VARIABLE', CX, 300, C.amber, t, 65.1, 999, { size: 26 });
      const la = IO(t, 66.1, 999, .3, .3); if (la > 0) withA(la, () => { iconLock(330, 1048, .8, C.muted, 1); T('O₂ · LIGHT · MOISTURE  fixed', 360, 1050, { size: 20, font: 'JB', weight: 600, color: C.muted, align: 'left' }); });
      const ek = P(t, 66.75, 67.0);
      if (ek > 0) { [220, CX, 860].forEach((x, i) => { for (let k = 0; k < 4; k++) { const ph = (t * .7 + k * .25 + i * .13) % 1; X.beginPath(); X.arc(x + Math.sin(ph * 6 + k) * 14, 640 - ph * 120, 6 + ph * 6, 0, TAW()); X.strokeStyle = rgba(C.amber, ek * (1 - ph)); X.lineWidth = 3; X.stroke(); } T('CO₂ ↑', x + 70, 590, { size: 20, font: 'JB', weight: 600, color: C.amber, alpha: ek }); });
        TA('→  MEASURE THE EFFECT', CX, 1520, t, 66.8, 999, { size: 32, color: C.amber }); }
    });
  }
  // mesocosm
  if (t > 67.4) {
    withA(P(t, 67.5, 68.0), () => {
      const lb = eo(P(t, 71.7, 72.3)); if (lb > 0) { X.save(); X.globalAlpha *= lb; X.setLineDash([10, 10]); stroke(rgba(C.cyan, .7), 2.5); X.beginPath(); X.roundRect(110, 1300, 260, 240, 20); X.stroke(); X.restore(); T('LAB BENCH', 240, 1275, { size: 18, font: 'JB', weight: 600, color: C.cyan, ls: 4, alpha: lb }); }
      const gk = eo(P(t, 68.1, 68.8)); X.fillStyle = 'rgba(40,90,50,.4)'; X.fillRect(CX - 480 * gk, 1180, 960 * gk, 6);
      const out = P(t, 74.2, 74.8);
      iconSun(880, 560, .9 * eback(out), C.amber, out, t); drawTree(985, 1180, .9 * eback(P(t, 74.3, 74.9)), P(t, 74.3, 74.6));
      const big = eback(P(t, 68.15, 68.9)), sh = eio(P(t, 72.7, 73.3));
      drawTank(lerp(600, 330, sh), 1180, lerp(480, 210, sh) * big, lerp(560, 280, sh) * big, P(t, 68.15, 68.4), t, { seed: 0 });
      drawTank(570, 1180, 210 * eback(P(t, 72.9, 73.4)), 280 * eback(P(t, 72.9, 73.4)), P(t, 72.9, 73.1), t, { seed: 1 });
      drawTank(810, 1180, 210 * eback(P(t, 73.05, 73.55)), 280 * eback(P(t, 73.05, 73.55)), P(t, 73.05, 73.25), t, { seed: 2 });
      const pk = eback(P(t, 73.7, 74.2));
      if (pk > 0) withA(P(t, 73.7, 73.9), () => { X.save(); X.translate(700, 1340); X.scale(pk, pk); const g = X.createLinearGradient(0, -50, 0, 50); g.addColorStop(0, '#4cb6d6'); g.addColorStop(1, '#1d5f80'); X.fillStyle = 'rgba(40,90,50,.5)'; X.beginPath(); X.ellipse(0, 0, 320, 64, 0, 0, TAU); X.fill(); X.fillStyle = g; X.beginPath(); X.ellipse(0, 0, 290, 50, 0, 0, TAU); X.fill(); stroke('rgba(230,250,255,.85)', 3); for (const dx of [-170, -55, 60, 175]) { X.beginPath(); X.ellipse(dx, 0, 42, 14, 0, 0, TAU); X.stroke(); } X.restore(); });
      TA('MESOCOSM', CX, 330, t, 69.45, 999, { size: 100, glow: 26, glowColor: C.green, ls: 8 });
      TA('same idea  ·  bigger scale', CX, 425, t, 71.7, 999, { size: 28, font: 'JB', weight: 600, color: C.green });
      TA('TANKS', 570, 835, t, 72.9, 999, { size: 20, font: 'JB', weight: 600, color: C.muted, ls: 4 });
      TA('PONDS', 700, 1430, t, 73.75, 999, { size: 20, font: 'JB', weight: 600, color: C.muted, ls: 4 });
      chipA('OUTSIDE THE LAB', CX, 600, C.amber, t, 74.2, 999, { size: 24 });
    });
  }
}
function TAW() { return TAU; }

/* ==========================================================
   SCENE C — Winogradsky column (74.9 – 105.8)
   ========================================================== */
const COL = { x: CX, l: 420, r: 660, top: 440, bot: 1500, mud: 960, water: 480 };
const BANDS = [
  { y0: 1360, y1: 1500, col: '#141010', n1: 'SULFATE-REDUCING', n2: 'BACTERIA', sub: 'Desulfovibrio · H₂S', lc: '#d8d2c6', t0: 90.6 },
  { y0: 1230, y1: 1360, col: '#3d8f3a', n1: 'GREEN SULFUR', n2: 'BACTERIA', sub: 'Chlorobium', lc: C.green, t0: 92.95 },
  { y0: 1090, y1: 1230, col: '#94306f', n1: 'PURPLE SULFUR', n2: 'BACTERIA', sub: 'Chromatium', lc: C.mag, t0: 95.1 },
  { y0: 960, y1: 1090, col: '#1f9c80', n1: 'CYANOBACTERIA', n2: '', sub: 'photosynthesis · O₂', lc: C.teal, t0: 97.55 },
];
const SPECK = (() => { const r = rng(77); return Array.from({ length: 300 }, () => ({ x: r(), y: r(), r: .6 + r() * 2.2 })); })();
function sceneC(t) {
  camSet(CX, 960, 1 + .03 * eio(P(t, 80, 105))); bgDark(t);
  withA(IO(t, 75.4, 81.0, 1.0, 1.2) * .55, () => { X.fillStyle = '#3a2410'; X.fillRect(-300, -300, W + 600, H + 600); });
  if (t < 80.8) {
    const yk = eio(P(t, 76.5, 77.6)), mvk = eio(P(t, 77.9, 78.5));
    const cy = lerp(900, 380, mvk), sz = lerp(230, 56, mvk), a = P(t, 75.0, 75.5) * (1 - P(t, 80.0, 80.6));
    T(yk >= 1 ? '1880s' : String(Math.round(lerp(2026, 1880, yk))), CX, cy, { size: sz, color: mix(C.ink, C.amber, yk), alpha: a, glow: 30 * (1 - mvk), glowColor: C.amber });
    withA(a * (1 - mvk), () => { const off = (lerp(2026, 1880, yk) * 12) % 120; for (let i = -12; i <= 12; i++) { const x = CX + i * 50 - off / 2.4; line(x, 1080, x, (i % 2 === 0) ? 1040 : 1060, rgba(C.amber, .5), 2); } line(40, 1080, 1040, 1080, rgba(C.amber, .5), 2); });
    TA('THIS IDEA IS NOT NEW', CX, 700, t, 75.3, 78.0, { size: 28, font: 'JB', weight: 600, color: C.amber, ls: 8 });
  }
  if (t > 78.3) {
    const k = eio(P(t, 79.6, 80.3)), a = 1 - P(t, 99.5, 100.1);
    TA('SERGEI WINOGRADSKY', CX, lerp(900, 250, k), t, 78.35, 999, { size: lerp(60, 40, k), ls: 5, glow: 20 * (1 - k), glowColor: C.amber, alpha: a });
    TA('1856 – 1953  ·  pioneer of microbial ecology', CX, lerp(975, 298, k), t, 78.9, 999, { size: lerp(26, 19, k), font: 'JB', weight: 400, color: C.amber, alpha: a });
  }
  const dk = eio(P(t, 79.9, 80.6));
  if (dk > 0) {
    const { l, r, top, bot } = COL;
    const la = IO(t, 86.2, 99.8, .35, .6);
    if (la > 0) withA(la, () => { const g = X.createLinearGradient(190, 0, 660, 0); g.addColorStop(0, rgba('#ffd27a', .35)); g.addColorStop(1, rgba('#ffd27a', 0)); X.fillStyle = g; X.beginPath(); X.moveTo(190, 600); X.lineTo(660, 460); X.lineTo(660, 1500); X.closePath(); X.fill(); iconSun(190, 600, .8, C.amber, 1, t); T('LIGHT', 190, 705, { size: 20, font: 'JB', weight: 600, color: C.amber, ls: 4 }); });
    X.save(); X.beginPath(); X.roundRect(l, top, r - l, bot - top, [0, 0, 26, 26]); X.clip();
    const mk = eio(P(t, 80.8, 81.6)), wk = eio(P(t, 81.15, 82.0));
    const mudTop = lerp(bot, COL.mud, mk), watTop = lerp(COL.mud, COL.water, wk);
    if (wk > 0) { const g = X.createLinearGradient(0, watTop, 0, COL.mud); g.addColorStop(0, 'rgba(90,190,220,.35)'); g.addColorStop(1, 'rgba(40,120,150,.5)'); X.fillStyle = g; X.fillRect(l, watTop, r - l, COL.mud - watTop + 10); line(l, watTop, r, watTop, 'rgba(180,240,255,.7)', 2); }
    if (mk > 0) { const g = X.createLinearGradient(0, COL.mud, 0, bot); g.addColorStop(0, '#5a3a22'); g.addColorStop(1, '#2a1a10'); X.fillStyle = g; X.fillRect(l, mudTop, r - l, bot - mudTop); }
    BANDS.forEach((b, i) => { const a = eo(P(t, 87.4 + (3 - i) * .35, 88.6 + (3 - i) * .35)); if (a <= 0) return; X.save(); X.globalAlpha *= a; const g = X.createLinearGradient(0, b.y0, 0, b.y1); g.addColorStop(0, mix(b.col, '#000000', .1)); g.addColorStop(.5, b.col); g.addColorStop(1, mix(b.col, '#000000', .25)); X.fillStyle = g; X.beginPath(); X.moveTo(l, b.y0); for (let x = l; x <= r; x += 12) X.lineTo(x, b.y0 + Math.sin(x / 25 + i) * 4); X.lineTo(r, b.y1); X.lineTo(l, b.y1); X.fill(); X.restore();
      const pulse = IO(t, b.t0, b.t0 + 2.2, .2, .8); if (pulse > 0) { X.fillStyle = rgba('#ffffff', .18 * pulse); X.fillRect(l, b.y0, r - l, b.y1 - b.y0); } });
    if (mk > .5) for (const s of SPECK) { const y = COL.water + s.y * (bot - COL.water); if (y < mudTop) continue; X.fillStyle = y < COL.mud ? 'rgba(170,240,255,.35)' : 'rgba(0,0,0,.35)'; X.beginPath(); X.arc(l + s.x * (r - l), y, s.r, 0, TAU); X.fill(); }
    const bba = P(t, 88, 89); if (bba > 0) for (let i = 0; i < 14; i++) { const ph = (t * .25 + i * .137) % 1; const y = lerp(COL.mud - 10, COL.water + 10, ph); X.strokeStyle = rgba(C.cyan, bba * (1 - ph) * .8); X.lineWidth = 2; X.beginPath(); X.arc(l + 20 + ((i * 53) % 200), y, 3 + i % 3, 0, TAU); X.stroke(); }
    const ps = P(t, 83.3, 83.9); if (ps > 0) for (let i = 0; i < 9; i++) { const ty = lerp(380, 1000 + (i % 4) * 70, eo(ps)); X.save(); X.translate(l + 30 + i * 22, ty); X.rotate(i); X.fillStyle = rgba('#f2ead8', .8 * (1 - .5 * P(t, 87, 89))); X.fillRect(-10, -3, 20, 6); X.restore(); }
    const gs = P(t, 85.0, 85.5); if (gs > 0) for (let i = 0; i < 6; i++) { const ty = lerp(380, 1420 + (i % 3) * 20, eo(gs)); X.fillStyle = rgba('#ffffff', .85 * (1 - .6 * P(t, 87, 89))); X.beginPath(); X.moveTo(l + 50 + i * 28, ty - 8); X.lineTo(l + 58 + i * 28, ty); X.lineTo(l + 50 + i * 28, ty + 8); X.lineTo(l + 42 + i * 28, ty); X.fill(); }
    X.restore();
    const ms = IO(t, 80.75, 81.6, .1, .2); if (ms > 0) line(COL.x - 20, 380, COL.x - 20, mudTop, '#6b4528', 14, ms);
    const ws = IO(t, 81.1, 82.0, .1, .2); if (ws > 0) line(COL.x + 24, 380, COL.x + 24, watTop, 'rgba(110,210,240,.8)', 10, ws);
    X.save(); stroke('rgba(210,240,255,.92)', 5); X.setLineDash([2600 * dk, 2800]); X.beginPath(); X.moveTo(l - 14, top); X.lineTo(l, top + 6); X.lineTo(l, bot - 26); X.quadraticCurveTo(l, bot, l + 26, bot); X.lineTo(r - 26, bot); X.quadraticCurveTo(r, bot, r, bot - 26); X.lineTo(r, top + 6); X.lineTo(r + 14, top); X.stroke(); X.restore();
    if (dk >= 1) line(l + 20, top + 40, l + 20, bot - 60, 'rgba(255,255,255,.22)', 8);
  }
  // ingredients
  if (t > 82.3 && t < 86) {
    const o = 85.6;
    withA(IO(t, 82.4, o, .4, .4), () => { const s = eback(P(t, 82.4, 82.9)); X.save(); X.translate(870, 620); X.scale(s, s); for (let i = 0; i < 5; i++) { X.save(); X.rotate(-.3 + i * .15); X.fillStyle = '#f2ead8'; X.beginPath(); X.roundRect(-14 + i * 10 - 25, -55, 16, 110, 4); X.fill(); X.restore(); } X.restore(); });
    TA('PAPER', 870, 740, t, 82.5, o, { size: 44 });
    TA('cellulose →', 870, 795, t, 83.2, o, { size: 22, font: 'JB', weight: 400, color: C.amber });
    TA('carbon source', 870, 828, t, 83.3, o, { size: 22, font: 'JB', weight: 400, color: C.amber });
    withA(IO(t, 83.75, o, .4, .4), () => { const s = eback(P(t, 83.75, 84.25)); X.save(); X.translate(870, 1000); X.scale(s, s); X.fillStyle = '#e8eef2'; X.beginPath(); X.moveTo(-50, 20); X.lineTo(-30, -40); X.lineTo(10, -55); X.lineTo(48, -20); X.lineTo(40, 30); X.lineTo(-10, 45); X.closePath(); X.fill(); X.fillStyle = 'rgba(0,0,0,.15)'; X.beginPath(); X.moveTo(10, -55); X.lineTo(48, -20); X.lineTo(40, 30); X.lineTo(5, 0); X.fill(); X.restore(); });
    TA('GYPSUM', 870, 1105, t, 83.8, o, { size: 44 });
    TA('CaSO₄ →', 870, 1160, t, 84.9, o, { size: 22, font: 'JB', weight: 400, color: C.amber });
    TA('sulfate source', 870, 1193, t, 85.0, o, { size: 22, font: 'JB', weight: 400, color: C.amber });
  }
  if (t > 86.6 && t < 89.9) {
    const a = IO(t, 86.7, 89.7, .3, .5), wkk = Math.floor(lerp(0, 8, P(t, 86.9, 89.2)));
    withA(a, () => { X.beginPath(); X.arc(190, 900, 44, 0, TAU); stroke(C.ink, 4); X.stroke(); const an = t * 9; line(190, 900, 190 + Math.cos(an) * 32, 900 + Math.sin(an) * 32, C.amber, 4); line(190, 900, 190 + Math.cos(an / 12) * 22, 900 + Math.sin(an / 12) * 22, C.ink, 4); T('WEEK ' + wkk, 190, 985, { size: 28, font: 'JB', weight: 600 }); });
  }
  const la = 1 - .75 * P(t, 101.6, 102.1) - .25 * P(t, 103.3, 103.7);
  BANDS.forEach(b => {
    const k = eo(P(t, b.t0, b.t0 + .5)); if (k <= 0 || la <= 0) return; const y = (b.y0 + b.y1) / 2;
    withA(la, () => { lineP(COL.r + 6, y, 685, y, b.lc, 2.5, k); });
    const ty = b.n2 ? y - 34 : y - 16;
    TA(b.n1, 695, ty, t, b.t0 + .1, 999, { size: 30, align: 'left', color: b.lc, alpha: la });
    if (b.n2) TA(b.n2, 695, ty + 34, t, b.t0 + .15, 999, { size: 30, align: 'left', color: b.lc, alpha: la });
    TA(b.sub, 695, (b.n2 ? ty + 70 : ty + 36), t, b.t0 + .35, 999, { size: 18, font: 'JB', weight: 400, color: C.muted, align: 'left', alpha: la });
  });
  { const k = eo(P(t, 98.8, 99.3)); if (k > 0 && la > 0) { withA(la, () => lineP(COL.r + 6, 720, 685, 720, C.cyan, 2.5, k)); TA('AEROBES', 695, 704, t, 98.85, 999, { size: 30, align: 'left', color: C.cyan, alpha: la }); TA('O₂-rich water', 695, 742, t, 99.1, 999, { size: 18, font: 'JB', weight: 400, color: C.muted, align: 'left', alpha: la }); } }
  if (t > 101.6) {
    const ok = eo(P(t, 101.7, 102.4)), hk = eo(P(t, 102.3, 103.0)), oa = 1 - P(t, 105.2, 105.8) * 0;
    const g1 = X.createLinearGradient(0, 490, 0, 1480); g1.addColorStop(0, C.cyan); g1.addColorStop(1, rgba(C.cyan, 0));
    X.save(); X.shadowColor = C.cyan; X.shadowBlur = 12; X.strokeStyle = g1; X.lineWidth = 12; X.lineCap = 'round'; X.beginPath(); X.moveTo(370, 500); X.lineTo(370, lerp(500, 1470, ok)); X.stroke(); X.restore();
    T('O₂', 370, 460, { size: 32, color: C.cyan, alpha: ok * oa });
    const g2 = X.createLinearGradient(0, 1490, 0, 500); g2.addColorStop(0, '#ffe066'); g2.addColorStop(1, 'rgba(255,224,102,0)');
    X.save(); X.shadowColor = '#ffe066'; X.shadowBlur = 12; X.strokeStyle = g2; X.lineWidth = 12; X.lineCap = 'round'; X.beginPath(); X.moveTo(310, 1480); X.lineTo(310, lerp(1480, 510, hk)); X.stroke(); X.restore();
    T('H₂S', 310, 1530, { size: 32, color: '#ffe066', alpha: hk });
    TA('REDOX', 150, 950, t, 102.35, 999, { size: 36 });
    TA('GRADIENT', 150, 995, t, 103.0, 999, { size: 36 });
  }
  if (t > 103.4) {
    const k = eo(P(t, 103.5, 104.4)), cx = 870, cy = 1010, rr = 120;
    TA('NUTRIENT CYCLING', CX, 380, t, 103.55, 999, { size: 48, color: C.amber, glow: 16 });
    sub('the sulfur cycle, inside one column', CX, 432, t, 104.0, 999, { size: 20 });
    X.save(); X.globalAlpha *= P(t, 103.5, 103.8); X.setLineDash([14, 10]); X.lineDashOffset = -t * 40; stroke(rgba(C.amber, .8), 4); X.beginPath(); X.arc(cx, cy, rr, -Math.PI / 2, -Math.PI / 2 + TAU * k); X.stroke(); X.restore();
    for (let i = 0; i < 3; i++) { const an = -Math.PI / 2 + i * TAU / 3 + TAU / 6; if (k > (i + 1) / 3 - .05) arrowHead(cx + Math.cos(an) * rr, cy + Math.sin(an) * rr, an + Math.PI / 2, 20, C.amber); }
    for (let i = 0; i < 6; i++) { const an = -Math.PI / 2 + ((t * .35 + i / 6) % 1) * TAU; glowCircle(cx + Math.cos(an) * rr, cy + Math.sin(an) * rr, 12, C.amber, .8 * k); }
    [['SO₄²⁻', -Math.PI / 2, C.ink], ['H₂S', Math.PI / 6, '#ffe066'], ['S⁰', Math.PI * 5 / 6, '#ffe9a0']].forEach(([s, an, col], i) => { const a = eback(P(t, 103.6 + i * .2, 104.1 + i * .2)); if (a <= 0) return; const x = cx + Math.cos(an) * rr, y = cy + Math.sin(an) * rr; X.save(); X.translate(x, y); X.scale(a, a); X.beginPath(); X.arc(0, 0, 42, 0, TAU); X.fillStyle = '#0b1f2a'; X.fill(); stroke(col, 3); X.stroke(); X.restore(); T(s, x, y + 2, { size: 24, color: col, alpha: clamp(a) }); });
  }
}

/* ==========================================================
   SCENE D — design your own (105.2 – 142.5)
   ========================================================== */
function bpJarFull(x, y, s, t, o = {}) {
  const a = o.a ?? 1; if (a <= 0 || s <= 0) return; const w = 110 * s, h = 150 * s; const col = o.killed ? '#9fb0bc' : C.amber;
  withA(a, () => {
    X.save(); X.translate(x, y); jarPath(s, true); X.fillStyle = 'rgba(8,34,56,.92)'; X.fill();
    X.save(); jarPath(s, true); X.clip();
    if ((o.sed || 0) > 0) { const top = lerp(h, h * .2, o.sed); X.fillStyle = rgba(col, .18); X.fillRect(-w, top, 2 * w, h - top); X.save(); X.beginPath(); X.rect(-w, top, 2 * w, h - top); X.clip(); for (let yy = -h; yy < h + 60 * s; yy += 14 * s) line(-w, yy, w, yy + 60 * s, rgba(col, .4), 1.5); X.restore();
      if ((o.oil || 0) > 0) { X.fillStyle = 'rgba(40,10,60,.85)'; X.fillRect(-w, top - 26 * s * o.oil, 2 * w, 26 * s * o.oil); line(-w, top - 26 * s * o.oil, w, top - 26 * s * o.oil, C.purp, 2); } }
    if ((o.heat || 0) > 0) { X.fillStyle = rgba(C.red, .1 * o.heat); X.fillRect(-w, -h, 2 * w, 2 * h); }
    if ((o.bub || 0) > 0) for (let i = 0; i < 8; i++) { const ph = (t * .4 + i / 8) % 1; X.beginPath(); X.arc(-w * .7 + i * w * .2, h * .1 - ph * h * .9, 4 * s, 0, TAU); X.strokeStyle = rgba(C.cyan, (1 - ph) * .9 * o.bub); X.lineWidth = 2; X.stroke(); }
    if ((o.light || 0) > 0) glowCircle(0, -h * .4, w * 1.4, C.amber, .2 * o.light);
    if ((o.mic || 0) > 0 && !o.killed) for (let i = 0; i < 10; i++) { glowCircle(Math.sin(i * 2.3 + t * .8) * w * .7, h * .15 + Math.cos(i * 1.7 + t * .6) * h * .35, 9 * s, i % 2 ? C.teal : C.green, .8 * o.mic); }
    X.restore(); X.restore();
    bpJar(x, y, s, t, o.dp ?? 1, o.killed ? 'rgba(170,190,205,.8)' : undefined);
    if (o.killed) { X.save(); X.setLineDash([8, 8]); stroke('rgba(170,190,205,.6)', 2); X.beginPath(); X.roundRect(x - w - 14, y - h - 70 * s, 2 * w + 28, 2 * h + 84 * s, 16); X.stroke(); X.restore(); }
  });
}
const STEPS = [['01', 'SAMPLE SOURCE', 110.1, 115.0], ['02', 'CONDITIONS', 115.45, 120.3], ['03', 'REPLICATES', 120.75, 126.3], ['04', 'CONTROLS', 126.75, 132.9]];
function sceneD(t) {
  camSet(CX, 960, 1); bpBG();
  const ck = 1 - P(t, 132.9, 133.4);
  withA(ck, () => {
    TA('DESIGN YOUR OWN', CX, 270, t, 106.55, 999, { size: 54 });
    TA('MICROCOSM', CX, 338, t, 106.95, 999, { size: 54, color: C.teal, glow: 14 });
    // step indicator
    const ia = P(t, 108.0, 108.6);
    withA(ia, () => { line(270, 1050, 810, 1050, 'rgba(120,190,255,.3)', 3);
      STEPS.forEach(([n, , ta, td], i) => { const x = 270 + i * 180; const act = eo(P(t, ta, ta + .4)), done = P(t, td, td + .3) || (i < 3 && t > STEPS[i + 1][2]); X.beginPath(); X.arc(x, 1050, 32, 0, TAU); X.fillStyle = act > 0 ? rgba(C.teal, .2 + .7 * act) : '#0a2a44'; X.fill(); stroke(act > 0 ? C.teal : 'rgba(120,190,255,.5)', 3); X.stroke(); T(done ? '✓' : n, x, 1052, { size: 24, color: act > 0 ? '#04121a' : 'rgba(200,235,255,.7)' }); }); });
    STEPS.forEach(([n, s, ta, td], i) => TA(s, CX, 1160, t, ta, i === 3 ? 999 : STEPS[i + 1][2] - .1, { size: 60, color: C.ink, glow: 12, glowColor: C.teal, fo: .3 }));
    // step 1 details
    sub('keep it close to its original state', CX, 1250, t, 111.55, 115.3, { size: 26, color: C.ink });
    [['same temperature', 330, 1330, 112.25], ['same moisture', 760, 1330, 112.85], ['minimal disturbance', CX, 1410, 113.35]].forEach(([s, x, y, t0]) => chipA(s, x, y, C.amber, t, t0, 115.3, { size: 20, padX: 18 }));
    // step 2 icons
    [['TEMP', 116.8, (x, y, a) => iconThermo(x, y - 6, .5, C.red, a, .6)], ['HUMIDITY', 117.3, (x, y, a) => iconDrop(x, y, .62, C.cyan, a)], ['OXYGEN', 117.95, (x, y, a) => iconO2(x, y, .75, C.ink, a)], ['LIGHT', 118.6, (x, y, a) => iconBulb(x, y, .7, C.amber, a)], ['NUTRIENTS', 119.05, (x, y, a) => iconHex(x, y, .75, C.green, a)]].forEach(([lb, t0, fn], i) => {
      const a = IO(t, t0, 120.6, .3, .3); if (a <= 0) return; const x = 160 + i * 190, y = 1310, s4 = eback(P(t, t0, t0 + .45));
      X.save(); X.translate(x, y); X.scale(s4, s4); X.translate(-x, -y); X.beginPath(); X.arc(x, y, 62, 0, TAU); X.fillStyle = 'rgba(10,40,64,.9)'; X.fill(); stroke('rgba(120,190,255,.4)', 2); X.stroke(); fn(x, y, a); X.restore();
      T(lb, x, y + 92, { size: 16, font: 'JB', weight: 600, color: C.muted, ls: 2, alpha: a });
    });
    // step 3
    withA(IO(t, 121.7, 122.7, .3, .25), () => { T('1 JAR', CX, 1300, { size: 90, color: C.red }); line(CX - 150, 1330, CX + 150, 1270, C.red, 8); });
    TA('n ≥ 3', CX, 1300, t, 122.7, 126.6, { size: 120, color: C.teal, glow: 20 });
    sub('replicates per treatment', CX, 1405, t, 124.2, 126.6, { size: 26, color: C.ink });
    // step 4
    chipA('THE MOST IMPORTANT', CX, 1240, C.amber, t, 126.2, 133.0, { size: 22 });
    TA('KILLED CONTROL', CX, 1325, t, 128.6, 133.0, { size: 52, color: C.ink });
    sub('a sterilized sample', CX, 1390, t, 130.35, 133.0, { size: 26, color: C.ink });
    chipA('AUTOCLAVE', 390, 1465, C.cyan, t, 131.25, 133.0, { size: 22 });
    chipA('OR CHEMICAL', 700, 1465, C.cyan, t, 132.6, 133.0, { size: 22 });
    // jar visuals
    const sed = eo(P(t, 110.6, 111.4));
    const cond = { heat: P(t, 116.8, 117.2), bub: P(t, 117.3, 117.7), light: P(t, 118.6, 119.0), mic: P(t, 117.9, 118.4) };
    const [jx, jy, js] = track(t, [CX, 730, 1.25], [[122.45, 122.9, [CX, 760, .8]], [126.75, 127.4, [390, 770, .62]]]);
    if (t > 109.9 && t < 110.75) { const fy = lerp(380, 720, eio(P(t, 110.0, 110.55))); X.save(); X.translate(CX, fy); stroke(C.amber, 3); X.beginPath(); X.roundRect(-16, -55, 32, 110, 6); X.stroke(); X.restore(); }
    bpJarFull(jx, jy, js, t, Object.assign({ dp: eio(P(t, 105.6, 107.2)), sed }, cond));
    TA('SEDIMENT SAMPLE', 760, 870, t, 111.3, 122.4, { size: 18, font: 'JB', weight: 600, color: C.amber, ls: 3, align: 'left' });
    badge(CX + 150, 560, 30, false, IO(t, 122.05, 122.75, .15, .2), P(t, 122.05, 122.45));
    const p3 = [[240, 170], [840, 610]];
    p3.forEach(([x3, x4], i) => { const k = eback(P(t, 122.75 + i * .1, 123.2 + i * .1)), k4 = eio(P(t, 126.75, 127.4)); const x = lerp(lerp(CX, x3, k), x4, k4), s = lerp(.8, .62, k4); bpJarFull(x, lerp(760, 770, k4), s, t, Object.assign({ sed: 1, a: P(t, 122.75, 122.95) }, cond)); });
    const kk = eback(P(t, 128.6, 129.1));
    if (kk > 0) { bpJarFull(860, 770, .62 * kk, t, { sed: 1, killed: true, a: P(t, 128.6, 128.8) }); T('KILLED', 860, 930, { size: 18, font: 'JB', weight: 600, color: '#9fb0bc', ls: 4, alpha: P(t, 128.8, 129.2) }); }
  });
  // logic stage
  if (t > 133.0) {
    TA('WHY?', CX, 330, t, 133.15, 999, { size: 100, color: C.amber, glow: 24 });
    const lv = 1 - .9 * eio(P(t, 135.1, 136.2));
    bpJarFull(300, 740, .95 * eback(P(t, 133.4, 133.9)), t, { sed: 1, oil: lv, mic: 1, a: P(t, 133.4, 133.6) });
    bpJarFull(780, 740, .95 * eback(P(t, 133.6, 134.1)), t, { sed: 1, oil: lv, killed: true, a: P(t, 133.6, 133.8) });
    TA('LIVE', 300, 1000, t, 133.6, 999, { size: 34, color: C.teal });
    TA('KILLED CONTROL', 780, 1000, t, 133.8, 999, { size: 34, color: '#b9c6d0' });
    meter(300, 1080, 360, lv, 'POLLUTANT', C.purp, P(t, 134.0, 134.5));
    meter(780, 1080, 360, lv, 'POLLUTANT', C.purp, P(t, 134.0, 134.5));
    chipA('≠ BIODEGRADATION', CX, 1225, C.red, t, 137.55, 999, { size: 34, fillA: .2 });
    const ev = P(t, 139.5, 139.9);
    if (ev > 0) for (let k = 0; k < 3; k++) { const ph = (t * .6 + k / 3) % 1; X.save(); X.globalAlpha *= ev * (1 - ph); stroke(C.cyan, 4); X.beginPath(); for (let i = 0; i <= 12; i++) { const yy = 560 - ph * 160 - i * 6, xx = 760 + k * 20 + Math.sin(i * .9 + t * 4) * 8; i ? X.lineTo(xx, yy) : X.moveTo(xx, yy); } X.stroke(); X.restore(); }
    chipA('EVAPORATION ?', CX, 1325, C.cyan, t, 139.5, 999, { size: 28 });
    const ad = P(t, 140.55, 141.0); if (ad > 0) for (let i = 0; i < 10; i++) { const k = eo(clamp(ad * 1.4 - i * .04)); glowCircle(780 + (i - 5) * 18, lerp(770, 830 + (i % 3) * 14, k), 7, C.purp, .9 * ad); }
    chipA('ADSORPTION TO SOIL ?', CX, 1420, C.purp, t, 140.55, 999, { size: 28 });
  }
}

/* ==========================================================
   SCENE E — what we measure + SIP (142.0 – 177.4)
   ========================================================== */
const STK = [[.35, .25, .2, .12, .08], [.28, .3, .18, .14, .1], [.2, .22, .3, .16, .12], [.12, .18, .42, .16, .12]];
const STKC = [C.teal, C.cyan, C.amber, C.mag, C.purp];
function sceneE(t) {
  camSet(CX, 960, 1); bgDark(t);
  const ca = 1 - P(t, 162.9, 163.4);
  if (ca > 0) withA(ca, () => {
    TA('WHAT DO WE', CX, 270, t, 144.3, 999, { size: 58 });
    TA('MEASURE?', CX, 340, t, 144.6, 999, { size: 58, color: C.teal, glow: 16 });
    const cards = [[640, 145.95, C.amber, '01', 'ACTIVITY', 148.7], [1000, 149.55, C.green, '02', 'CHEMISTRY', 152.5], [1360, 153.8, C.cyan, '03', 'COMMUNITY', 999]];
    cards.forEach(([cy, t0, col, n, name, tend], i) => {
      const a = IO(t, t0, 999, .4, .3); if (a <= 0) return; const act = foc(t, t0, tend + .3); const k = eo(P(t, t0, t0 + .5));
      X.save(); X.translate((1 - k) * 80, 0);
      card(CX, cy, 940, 320, col, a, act);
      withA(a, () => { T(n, 110, cy - 105, { size: 22, font: 'JB', weight: 600, color: col, align: 'left', ls: 3 }); T(name, 110, cy - 55, { size: 46, align: 'left' }); });
      X.restore();
    });
    // card 1 viz
    if (t > 146) {
      const cy = 640, x0 = 580, x1 = 960, y0 = cy + 110, y1 = cy - 110, a = P(t, 146.2, 146.6);
      withA(a, () => { line(x0, y0, x1, y0, 'rgba(255,255,255,.3)', 2); line(x0, y0, x0, y1, 'rgba(255,255,255,.3)', 2);
        const pc = eo(P(t, 147.15, 148.3)), po = eo(P(t, 148.3, 149.3));
        X.save(); X.shadowColor = C.amber; X.shadowBlur = 10; stroke(C.amber, 5); X.beginPath(); for (let i = 0; i <= 40 * pc; i++) { const f = i / 40; const xx = lerp(x0, x1, f), yy = lerp(y0 - 10, y1 + 10, 1 - Math.exp(-f * 2.6)); i ? X.lineTo(xx, yy) : X.moveTo(xx, yy); } X.stroke(); X.restore();
        X.save(); X.shadowColor = C.cyan; X.shadowBlur = 10; stroke(C.cyan, 5); X.beginPath(); for (let i = 0; i <= 40 * po; i++) { const f = i / 40; const xx = lerp(x0, x1, f), yy = lerp(y1 + 20, y0 - 20, 1 - Math.exp(-f * 2.6)); i ? X.lineTo(xx, yy) : X.moveTo(xx, yy); } X.stroke(); X.restore();
      });
      TA('CO₂ production ↑', 110, cy + 30, t, 147.15, 999, { size: 22, font: 'JB', weight: 600, color: C.amber, align: 'left' });
      TA('O₂ consumption ↓', 110, cy + 75, t, 148.3, 999, { size: 22, font: 'JB', weight: 600, color: C.cyan, align: 'left' });
    }
    if (t > 149.6) {
      const cy = 1000;
      [['POLLUTANT', C.purp, 150.75, () => lerp(1, .3, eio(P(t, 151, 153)))]].forEach(([lb, col, t0, vf], i) => {
        const a = IO(t, t0, 999, .3, .3); if (a <= 0) return; const y = cy; const v = vf() * eo(P(t, t0, t0 + .6));
        withA(a, () => { T(lb, 580, y, { size: 18, font: 'JB', weight: 600, color: col, align: 'left', ls: 2 }); X.beginPath(); X.roundRect(740, y - 9, 220, 18, 9); X.fillStyle = 'rgba(255,255,255,.08)'; X.fill(); X.save(); X.shadowColor = col; X.shadowBlur = 10; X.beginPath(); X.roundRect(740, y - 9, Math.max(18, 220 * v), 18, 9); X.fillStyle = col; X.fill(); X.restore(); });
      });
      TA('concentrations over time', 110, cy + 40, t, 150.4, 999, { size: 20, font: 'JB', weight: 400, color: C.muted, align: 'left' });
    }
    if (t > 154.5) {
      const cy = 1360;
      TA('WHO is there?', 110, cy + 20, t, 155.3, 999, { size: 24, color: C.ink, align: 'left' });
      TA('16S rRNA amplicon seq.', 110, cy + 55, t, 156.7, 999, { size: 18, font: 'JB', weight: 600, color: C.cyan, align: 'left' });
      TA('HOW MANY?', 110, cy + 95, t, 160.45, 999, { size: 24, color: C.ink, align: 'left' });
      TA('qPCR', 300, cy + 95, t, 161.95, 999, { size: 18, font: 'JB', weight: 600, color: C.amber, align: 'left' });
      const sk = eo(P(t, 156.7, 157.8));
      if (sk > 0) STK.forEach((col, j) => { let y = cy + 100; col.forEach((f, q) => { const hh = f * 200 * sk; X.fillStyle = STKC[q]; X.fillRect(560 + j * 46, y - hh, 34, hh - 2); y -= hh; }); });
      const qk = eo(P(t, 161.95, 162.8));
      if (qk > 0) { const x0 = 780, x1 = 970, y0 = cy + 100, y1 = cy - 90; line(x0, y0, x1, y0, 'rgba(255,255,255,.3)', 2); line(x0, y0, x0, y1, 'rgba(255,255,255,.3)', 2); X.save(); X.setLineDash([6, 6]); line(x0, cy, x1, cy, 'rgba(255,255,255,.35)', 1.5); X.restore(); X.save(); X.shadowColor = C.amber; X.shadowBlur = 10; stroke(C.amber, 4); X.beginPath(); for (let i = 0; i <= 50 * qk; i++) { const f = i / 50; const yy = lerp(y0 - 6, y1 + 10, 1 / (1 + Math.exp(-(f - .5) * 12))); i ? X.lineTo(lerp(x0, x1, f), yy) : X.moveTo(x0, yy); } X.stroke(); X.restore(); T('Ct', x0 + 95, cy - 18, { size: 16, font: 'JB', weight: 600, color: C.muted, alpha: qk }); }
    }
  });
  // SIP
  if (t > 163.2) {
    const qa = 1 - P(t, 166.9, 167.4);
    TA('WHO EXACTLY EATS', CX, 270, t, 163.4, 167.3, { size: 52, alpha: qa });
    TA('THE POLLUTANT?', CX, 335, t, 165.8, 167.3, { size: 52, color: C.purp });
    TA('STABLE ISOTOPE', CX, 270, t, 167.25, 999, { size: 58, color: C.amber, glow: 14 });
    TA('PROBING', CX, 340, t, 167.8, 999, { size: 58, color: C.amber, glow: 14 });
    sub('SIP', CX, 395, t, 168.4, 999, { size: 22, color: C.muted });
    // substrate
    const sa = eback(P(t, 170.15, 170.65));
    if (sa > 0) {
      X.save(); X.translate(CX, 560); X.scale(sa, sa); X.rotate(t * .2);
      for (let i = 0; i < 6; i++) { const an = i / 6 * TAU, an2 = (i + 1) / 6 * TAU; line(Math.cos(an) * 70, Math.sin(an) * 70, Math.cos(an2) * 70, Math.sin(an2) * 70, C.ink, 4); }
      for (let i = 0; i < 6; i++) { const an = i / 6 * TAU; const gold = P(t, 171.3 + i * .06, 171.6 + i * .06); X.beginPath(); X.arc(Math.cos(an) * 70, Math.sin(an) * 70, 20, 0, TAU); X.fillStyle = mix('#4a5a66', '#ffc94a', gold); X.shadowColor = '#ffc94a'; X.shadowBlur = 20 * gold; X.fill(); X.shadowBlur = 0; }
      X.restore();
      TA('¹³C', CX, 560, t, 171.9, 999, { size: 40, color: '#ffc94a', glow: 14 });
      TA('¹³C-LABELED SUBSTRATE', CX, 680, t, 170.2, 999, { size: 22, font: 'JB', weight: 600, color: '#ffc94a', ls: 3 });
    }
    // microbes
    const mx = [180, 360, 540, 720, 900], eaters = [1, 3];
    const ma = P(t, 170.6, 171.0);
    if (ma > 0) {
      mx.forEach((x, i) => { const eat = eaters.includes(i) ? eo(P(t, 172.4, 173.2)) : 0; if (eat > 0) glowCircle(x, 860, 70, '#ffc94a', .5 * eat); drawSprite(SP[i % 2 ? 'rodA' : 'rodT'], x, 860 + Math.sin(t * 2 + i) * 6, -Math.PI / 2 + Math.sin(t + i) * .2, .9, ma); });
      const fl = IO(t, 172.3, 173.6, .2, .4); if (fl > 0) eaters.forEach(i => { for (let k = 0; k < 5; k++) { const f = (t * 1.4 + k / 5) % 1; glowCircle(lerp(CX, mx[i], f), lerp(620, 830, f), 9, '#ffc94a', fl); } });
    }
    // DNA
    const da = P(t, 173.45, 173.9);
    if (da > 0) {
      const fly = eio(P(t, 175.3, 175.95));
      mx.forEach((x, i) => { const heavy = eaters.includes(i); const tx = lerp(x, CX + (heavy ? -10 : 10), fly), ty = lerp(1040, heavy ? 1420 : 1290, fly); const sc = lerp(1, .35, fly); X.save(); X.translate(tx, ty); X.scale(sc, sc); drawHelix(0, 0, 120, heavy ? '#ffc94a' : C.cyan, da * (1 - P(t, 175.85, 176.0)), t + i); X.restore(); });
      TA('DNA', 100, 1040, t, 173.5, 175.4, { size: 20, font: 'JB', weight: 600, color: C.muted });
      TA('HEAVIER', CX, 1130, t, 174.85, 175.5, { size: 34, color: '#ffc94a', glow: 14 });
    }
    // tube
    const ta = P(t, 175.1, 175.5);
    if (ta > 0) withA(ta, () => {
      const x = CX, y0 = 1200, y1 = 1500; X.beginPath(); X.moveTo(x - 45, y0); X.lineTo(x - 45, y1 - 45); X.arc(x, y1 - 45, 45, Math.PI, 0, true); X.lineTo(x + 45, y0); const g = X.createLinearGradient(0, y0, 0, y1); g.addColorStop(0, 'rgba(120,200,255,.08)'); g.addColorStop(1, 'rgba(120,200,255,.3)'); X.fillStyle = g; X.fill(); stroke('rgba(220,245,255,.9)', 3); X.stroke();
      const bk = P(t, 175.9, 176.2);
      if (bk > 0) { X.save(); X.shadowColor = C.cyan; X.shadowBlur = 16; X.fillStyle = rgba(C.cyan, .9 * bk); X.fillRect(x - 40, 1286, 80, 9); X.shadowColor = '#ffc94a'; X.fillStyle = rgba('#ffc94a', .95 * bk); X.fillRect(x - 40, 1415, 80, 11); X.restore();
        T('¹²C-DNA · light', x + 75, 1290, { size: 18, font: 'JB', weight: 600, color: C.cyan, align: 'left', alpha: bk }); T('¹³C-DNA · heavy', x + 75, 1420, { size: 18, font: 'JB', weight: 600, color: '#ffc94a', align: 'left', alpha: bk }); }
      chipA('THE POLLUTANT EATER', 250, 1420, '#ffc94a', t, 176.15, 999, { size: 18 });
    });
  }
}

/* ==========================================================
   SCENE F — applications (176.9 – 207.8)
   ========================================================== */
function sceneF(t) {
  camSet(CX, 960, 1); bgDark(t);
  TA('APPLICATIONS', CX, 300, t, 177.5, 999, { size: 70, color: C.ink, glow: 16, glowColor: C.teal, ls: 4 });
  const A = [
    { y: 560, t0: 180.35, t1: 187.7, col: C.purp, title: 'BIOREMEDIATION', icon: (x, y, a) => { oilBlob(x, y, 30, t, a); for (let i = 0; i < 6; i++) { const an = i / 6 * TAU + t * .5; drawSprite(SP[i % 2 ? 'rodA' : 'rodT'], x + Math.cos(an) * 60, y + Math.sin(an) * 40, an + Math.PI, .4, a); } },
      lines: [['can native bacteria clean a spill alone?', 182.3]], chips: [['+ NUTRIENTS ?', 420, 186.05]] },
    { y: 830, t0: 189.25, t1: 192.0, col: C.red, title: 'ANTIBIOTICS & PESTICIDES', size: 34, icon: (x, y, a) => { iconPill(x - 10, y - 10, .8, a); withA(a, () => { for (let i = 0; i < 5; i++) glowCircle(x + 30 + i * 6, y + 30 - i * 8, 6, C.green, .7); }); },
      lines: [['→ effects on soil microbes', 191.1]] },
    { y: 1100, t0: 193.5, t1: 197.1, col: C.amber, title: 'WARMING & CO₂', icon: (x, y, a) => iconThermo(x, y, .6, C.red, a, .5 + .35 * P(t, 193.5, 196)),
      lines: [['rising temperature → CO₂ release ↑', 193.9]] },
    { y: 1370, t0: 199.05, t1: 999, col: C.teal, title: 'ORAL MICROCOSMS', icon: (x, y, a) => iconTooth(x, y, .85, C.ink, a),
      lines: [['mimic dental plaque', 201.2], ['test antimicrobials on a real biofilm', 203.3], ['not just one species', 206.4]] },
  ];
  A.forEach((c, i) => {
    const a = IO(t, c.t0, 999, .45, .3); if (a <= 0) return; const act = foc(t, c.t0, c.t1); const dim = 1 - .45 * (1 - act) * P(t, c.t1, c.t1 + .5);
    const k = eo(P(t, c.t0, c.t0 + .5)); X.save(); X.translate(0, (1 - k) * 60);
    withA(dim, () => {
      card(CX, c.y, 940, 240, c.col, a, act);
      X.save(); X.translate(180, c.y); const s = eback(P(t, c.t0, c.t0 + .5)); X.scale(s, s); X.translate(-180, -c.y); c.icon(180, c.y, a); X.restore();
      withA(a, () => T(c.title, 290, c.y - 62, { size: c.size || 40, align: 'left', color: c.col === C.red ? '#ff8a95' : c.col }));
      c.lines.forEach(([s, t0], j) => TA(s, 290, c.y - 8 + j * 42, t, t0, 999, { size: 22, font: 'JB', weight: 400, color: C.ink, align: 'left' }));
      (c.chips || []).forEach(([s, x, t0]) => chipA(s, x, c.y + 62, C.amber, t, t0, 999, { size: 18 }));
    });
    X.restore();
  });
}

/* ==========================================================
   SCENE G — limitations (207.3 – 246.8)
   ========================================================== */
const BEM = (() => { const r = rng(91); const L = []; for (let i = 0; i < 16; i++) L.push({ u: -.75 + r() * 1.5, v: -.4 + r() * 1.2, k: ['rodT', 'spG', 'rodC', 'cocM'][i % 4], ph: r() * TAU, kind: i % 4 === 3 ? 'vanish' : 'stay' }); for (let i = 0; i < 14; i++) L.push({ u: -.75 + r() * 1.5, v: -.4 + r() * 1.2, k: 'rodA', ph: r() * TAU, kind: 'bloom', t0: 216.9 + i * .05 }); return L; })();
function drawLandscapeWide(x0, y0, w, h, t, a) {
  withA(a, () => {
    X.save(); X.beginPath(); X.roundRect(x0, y0, w, h, 26); X.clip();
    let g = X.createLinearGradient(0, y0, 0, y0 + h); g.addColorStop(0, '#123a55'); g.addColorStop(.55, '#3a8b9c'); g.addColorStop(.56, '#2f7a3f'); g.addColorStop(1, '#1f5a30'); X.fillStyle = g; X.fillRect(x0, y0, w, h);
    X.fillStyle = '#1f5546'; X.beginPath(); X.moveTo(x0, y0 + h * .56); for (let i = 0; i <= 20; i++) X.lineTo(x0 + i * w / 20, y0 + h * .56 - Math.abs(Math.sin(i * .7)) * h * .14); X.lineTo(x0 + w, y0 + h * .57); X.fill();
    stroke('#5fc3e4', 18); X.beginPath(); X.moveTo(x0 + w * .1, y0 + h); X.bezierCurveTo(x0 + w * .3, y0 + h * .7, x0 + w * .6, y0 + h * .9, x0 + w * .8, y0 + h * .6); X.stroke();
    for (const fx of [.15, .45, .7, .9]) drawTree(x0 + w * fx, y0 + h * .62, .55, 1);
    X.restore(); stroke('rgba(220,240,255,.7)', 3); X.beginPath(); X.roundRect(x0, y0, w, h, 26); X.stroke();
  });
}
function sceneG(t) {
  camSet(CX, 960, 1); bgDark(t);
  // warning
  const wa = IO(t, 207.6, 211.5, .4, .5);
  if (wa > 0) withA(wa, () => {
    const s = eback(P(t, 207.6, 208.2)); X.save(); X.translate(CX, 760); X.scale(s, s); X.beginPath(); X.moveTo(0, -120); X.lineTo(130, 100); X.lineTo(-130, 100); X.closePath(); X.fillStyle = rgba(C.amber, .15); X.fill(); X.shadowColor = C.amber; X.shadowBlur = 24; stroke(C.amber, 8); X.stroke(); X.restore();
    T('!', CX, 790, { size: 120, color: C.amber, alpha: s > .5 ? 1 : 0 });
    TA('MICROCOSM', CX, 1030, t, 209.0, 999, { size: 80, color: C.teal });
    TA('≠ NATURE', CX, 1125, t, 210.15, 999, { size: 80, color: C.amber, glow: 16 });
  });
  // bottle effect
  if (t > 211.6 && t < 225) {
    const o = 224.6;
    TA('BOTTLE EFFECT', CX, 300, t, 212.1, o, { size: 72, color: C.amber, glow: 16 });
    const bf = eo(P(t, 220.5, 223.6));
    const [jx, jy, js] = track(t, [CX, 880, 1.8], [[224.1, 224.8, [CX, 560, .6]]]);
    drawJar(jx, jy, js, { t, a: IO(t, 211.7, 999, .5, .1), microbes: 0, cork: P(t, 213.9, 214.4), glow: .4,
      inner: (s) => {
        BEM.forEach(m => { let a = 1; if (m.kind === 'vanish') a = 1 - P(t, 217.0 + m.ph * .05, 217.6 + m.ph * .05); if (m.kind === 'bloom') a = eback(P(t, m.t0, m.t0 + .4)); if (a <= 0) return; const w = 110 * s, h = 150 * s; const x = m.u * w * .85 + Math.sin(t * .7 + m.ph) * 8 * s, y = m.v * h * .8 + Math.cos(t * .6 + m.ph) * 7 * s; drawSprite(SP[m.k], x, y, m.ph + Math.sin(t) * .4, .42 * s * a, clamp(a)); });
        if (bf > 0) { X.save(); X.setLineDash([1500 * s * bf, 1600 * s]); jarPath(s, true); stroke(rgba(C.green, .55), 30 * s); X.stroke(); X.restore(); }
      } });
    chipA('the community shifts on its own', CX, 1290, C.ink, t, 216.4, o, { size: 22 });
    chipA('some bloom ↑', 330, 1380, C.amber, t, 216.95, o, { size: 22 });
    chipA('others vanish ↓', 750, 1380, C.mag, t, 217.15, o, { size: 22 });
    chipA('BIOFILM ON THE WALLS', CX, 1470, C.green, t, 222.4, o, { size: 24 });
  }
  // scale
  if (t > 224.1 && t < 233) {
    const o = 232.6;
    TA('SCALE', CX, 300, t, 226.1, o, { size: 80, color: C.cyan, glow: 16 });
    if (t > 224.8) drawJar(CX, 560, .6, { t, a: IO(t, 224.8, o, .05, .4), cork: 1, glow: .3 });
    TA("can't capture:", CX, 710, t, 227.9, o, { size: 22, font: 'JB', weight: 600, color: C.muted });
    drawLandscapeWide(70, 770, 940, 600, t, IO(t, 226.3, o, .5, .4));
    const ga = IO(t, 228.4, o, .5, .4);
    if (ga > 0) withA(ga * .55, () => { const g = X.createLinearGradient(70, 0, 1010, 0); g.addColorStop(0, 'rgba(76,201,255,.6)'); g.addColorStop(.5, 'rgba(46,230,200,.1)'); g.addColorStop(1, 'rgba(255,181,71,.6)'); X.fillStyle = g; X.beginPath(); X.roundRect(70, 770, 940, 600, 26); X.fill(); });
    chipA('LARGE GRADIENTS', 300, 830, C.cyan, t, 228.4, o, { size: 22 });
    const ma = IO(t, 229.9, o, .3, .4);
    if (ma > 0) withA(ma, () => { for (let i = 0; i < 7; i++) { const f = (t * .18 + i / 7) % 1; const x = lerp(-40, 1120, f), y = 900 + Math.sin(i * 2 + f * 8) * 40 + i * 12; stroke(C.ink, 3); X.beginPath(); X.moveTo(x - 14, y - 8); X.lineTo(x, y); X.lineTo(x + 14, y - 8); X.stroke(); } });
    chipA('MIGRATION', 800, 960, C.ink, t, 229.9, o, { size: 22 });
    const sa = IO(t, 231.6, o, .3, .4);
    if (sa > 0) { const ph = (Math.sin(t * 2) + 1) / 2; iconSun(430, 1280, .45, C.amber, sa * (1 - ph * .7), t); iconSnow(650, 1280, .8, C.ink, sa * (.3 + ph * .7)); }
    chipA('SEASONS', CX, 1280, C.amber, t, 231.6, o, { size: 22 });
  }
  // debate
  if (t > 232.6) {
    TA('AN OLD DEBATE', CX, 290, t, 232.8, 999, { size: 64 });
    sub('in ecology', CX, 355, t, 233.8, 999, { size: 26, color: C.teal });
    const ap = P(t, 234.4, 234.9);
    const ang = -.2 * eo(P(t, 236.8, 237.8)) + .2 * eio(P(t, 240.3, 241.5));
    if (ap > 0) withA(ap, () => {
      const px = CX, py = 640; stroke(C.ink, 6); line(px, py, px, py + 330, C.ink, 6); X.beginPath(); X.moveTo(px - 90, py + 340); X.lineTo(px + 90, py + 340); X.stroke();
      const L = 340, ex = Math.cos(ang) * L, ey = Math.sin(ang) * L;
      line(px - ex, py - ey, px + ex, py + ey, C.ink, 8); X.beginPath(); X.arc(px, py, 14, 0, TAU); X.fillStyle = C.amber; X.fill();
      [[-1, C.red], [1, C.teal]].forEach(([sgn, col]) => { const x = px + sgn * ex, y = py + sgn * ey; line(x, y, x - 70, y + 150, 'rgba(234,246,250,.5)', 2); line(x, y, x + 70, y + 150, 'rgba(234,246,250,.5)', 2); X.beginPath(); X.ellipse(x, y + 150, 90, 20, 0, 0, Math.PI); X.fillStyle = rgba(col, .35); X.fill(); stroke(col, 4); X.stroke(); });
      const lx = px - ex, ly = py - ey + 230, rx = px + ex, ry = py + ey + 230;
      TA('LIMITED', lx, ly, t, 236.9, 999, { size: 36, color: '#ff8a95' }); TA('RELEVANCE', lx, ly + 42, t, 237.1, 999, { size: 36, color: '#ff8a95' });
      sub('e.g. Carpenter, 1996', lx, ly + 84, t, 237.6, 999, { size: 16 });
      TA('POWERFUL TOOL', rx, ry, t, 240.0, 999, { size: 34, color: C.teal }); TA('to test hypotheses', rx, ry + 40, t, 240.9, 999, { size: 22, font: 'JB', weight: 600, color: C.teal });
      sub('e.g. Benton et al., 2007', rx, ry + 80, t, 241.4, 999, { size: 16 });
    });
    chipA('✓  interpret it correctly', CX, 1330, C.green, t, 243.3, 999, { size: 26 });
    chipA('✓  validate it in the field', CX, 1425, C.green, t, 245.7, 999, { size: 26 });
  }
}

/* ==========================================================
   SCENE H — wrap-up + cosmos (246.3 – 271)
   ========================================================== */
const GAL = (() => { const r = rng(123); return Array.from({ length: 700 }, (_, i) => { const arm = i % 3, rr = Math.pow(r(), .7) * 620; return { rr, a0: arm * TAU / 3 + rr * .011 + (r() - .5) * .5, s: .8 + r() * 2.6, c: [C.teal, C.cyan, C.amber, C.mag, C.purp, C.green][i % 6], ph: r() * TAU }; }); })();
function drawGalaxy(t, a) {
  if (a <= 0) return; X.save(); X.globalAlpha *= a; X.globalCompositeOperation = 'lighter';
  glowCircle(CX, 960, 360, C.teal, .25); glowCircle(CX, 960, 160, '#ffffff', .25);
  for (const g of GAL) { const an = g.a0 + t * (.25 - g.rr / 4000); const x = CX + Math.cos(an) * g.rr, y = 960 + Math.sin(an) * g.rr * .62; X.globalAlpha = a * (.5 + .5 * Math.sin(t * 2 + g.ph)); X.fillStyle = g.c; X.beginPath(); X.arc(x, y, g.s, 0, TAU); X.fill(); }
  X.restore();
  for (let i = 0; i < 14; i++) { const an = i / 14 * TAU + t * .2, rr = 140 + (i % 4) * 70; drawSprite(SP[SPK[i % SPK.length]], CX + Math.cos(an) * rr, 960 + Math.sin(an) * rr * .62, an + Math.PI / 2, .5, a * .9); }
}
function sceneH(t) {
  const zk = eio(P(t, 261.8, 264.6));
  camSet(CX, lerp(960, 1000, zk), 1 + 4 * zk * zk);
  bgDark(t);
  const pa = 1 - P(t, 257.2, 257.8);
  if (pa > 0) withA(pa, () => {
    TA('THE TAKEAWAY', CX, 300, t, 246.5, 999, { size: 30, font: 'JB', weight: 600, color: C.amber, ls: 10 });
    // bridge
    const bk = eo(P(t, 249.2, 250.0));
    if (bk > 0) { X.save(); X.shadowColor = C.teal; X.shadowBlur = 20; stroke(C.teal, 10); X.beginPath(); for (let i = 0; i <= 60 * bk; i++) { const f = i / 60; const x = lerp(230, 850, f), y = 980 - Math.sin(f * Math.PI) * 240; i ? X.lineTo(x, y) : X.moveTo(x, y); } X.stroke(); X.restore(); for (let i = 1; i < 10; i++) { const f = i / 10; if (f > bk) break; const x = lerp(230, 850, f), y = 980 - Math.sin(f * Math.PI) * 240; line(x, y, x, 980, rgba(C.teal, .4), 3); } line(200, 980, 880, 980, rgba(C.teal, .5 * bk), 4); }
    drawJar(CX, 650, .5 * eback(P(t, 247.8, 248.4)), { t, glow: 1, cork: 1, net: .6, a: P(t, 247.8, 248.1) });
    const la = eback(P(t, 249.9, 250.4)); if (la > 0) { X.save(); X.translate(180, 900); X.scale(la * 1.2, la * 1.2); stroke('rgba(200,240,255,.8)', 4); X.beginPath(); X.moveTo(-16, -90); X.lineTo(-16, -50); X.lineTo(-56, 40); X.lineTo(56, 40); X.lineTo(16, -50); X.lineTo(16, -90); X.stroke(); X.fillStyle = rgba(C.cyan, .4); X.beginPath(); X.moveTo(-36, -4); X.lineTo(-56, 40); X.lineTo(56, 40); X.lineTo(36, -4); X.fill(); X.restore(); }
    TA('LAB', 180, 1050, t, 249.95, 999, { size: 36, color: C.cyan });
    drawField(900, 880, 110 * eback(P(t, 250.5, 251.0)), t, P(t, 250.5, 250.7));
    TA('NATURE', 900, 1050, t, 250.55, 999, { size: 36, color: C.green });
    TA('enough CONTROL', CX, 1200, t, 252.0, 999, { size: 44, color: C.cyan });
    sub('→ to understand the cause', CX, 1255, t, 253.5, 999, { size: 24, color: C.ink });
    TA('enough REALISM', CX, 1360, t, 254.9, 999, { size: 44, color: C.green });
    sub('→ for results that mean something', CX, 1415, t, 255.95, 999, { size: 24, color: C.ink });
  });
  // jar of mud → cosmos
  if (t > 257.4) {
    const ja = P(t, 257.8, 258.6) * (1 - P(t, 263.6, 264.5));
    drawJar(CX, 960, 1.6, { t, a: ja, cork: 1, glow: .5 + .8 * P(t, 261, 263), net: P(t, 262.5, 263.5) });
    camSet(CX, 960, 1);
    drawGalaxy(t, P(t, 263.4, 264.9));
    drawTitle(CX, 1560, 110, t, 265.45, 1);
    TA('ask the right question', CX, 1665, t, 266.0, 999, { size: 30, font: 'JB', weight: 600, color: C.amber });
  }
}

/* ==========================================================
   MASTER
   ========================================================== */
const SCENES = [[sceneA, 0, 39.15], [sceneB, 38.9, 75.6], [sceneC, 74.95, 106.2], [sceneD, 105.2, 142.6], [sceneE, 142.0, 177.5], [sceneF, 176.9, 207.9], [sceneG, 207.3, 246.9], [sceneH, 246.3, 999]];
function renderOld(t, A = 1) {
  X.setTransform(1, 0, 0, 1, 0, 0); X.globalAlpha = A; X.globalCompositeOperation = 'source-over'; X.fillStyle = C.bg0; X.fillRect(0, 0, W, H);
  for (const [fn, a, b] of SCENES) {
    if (t < a || t > b) continue;
    let alpha = 1; GZ = 1;
    if (fn === sceneB) { const out = eio(P(t, 74.95, 75.6)); GZ = 1 + .35 * out; alpha = P(t, 38.9, 39.05) * (1 - out); }
    else if (fn === sceneA) alpha = 1 - P(t, 39.0, 39.15);
    else if (fn === sceneC) { const ink = eio(P(t, 74.95, 75.6)); GZ = lerp(.82, 1, ink); alpha = ink; }
    else if (fn === sceneD) { const wp = eio(P(t, 105.2, 106.0)), wy = wp * (H + 80) - 40; X.save(); X.globalAlpha = A; X.setTransform(1, 0, 0, 1, 0, 0); X.beginPath(); X.rect(0, 0, W, Math.max(0, wy)); X.clip(); fn(t); X.restore(); if (wp < 1) { X.setTransform(1, 0, 0, 1, 0, 0); X.save(); X.shadowColor = C.cyan; X.shadowBlur = 40; X.globalAlpha = A; X.fillStyle = C.cyan; X.fillRect(0, wy - 3, W, 6); X.restore(); } continue; }
    else alpha = P(t, a, a + .6) * (b < 900 ? 1 - P(t, b - .6, b) : 1);
    if (fn === sceneC && t > 105.2) { /* C stays under D's wipe */ }
    if (alpha <= 0) continue; X.save(); X.globalAlpha = alpha * A; fn(t); X.restore();
  }
  GZ = 1;
  { const f = IO(t, 75.0, 75.8, .15, .5); if (f > 0) { X.setTransform(1, 0, 0, 1, 0, 0); X.globalAlpha = A; X.fillStyle = rgba('#fff4dd', .35 * f); X.fillRect(0, 0, W, H); } }
  X.globalAlpha = 1;
}
