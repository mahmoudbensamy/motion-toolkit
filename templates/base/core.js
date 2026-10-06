'use strict';
/* ==========================================================
   MICROCOSM — motion graphics explainer (Part 1)
   Deterministic canvas timeline: frame(t) renders time t (s)
   ========================================================== */
const cv = document.getElementById('c');
let X = cv.getContext('2d');
const W = 1080, H = 1920, DUR = 271;
const C = {
  bg0: '#03090f', bg1: '#0a2230', teal: '#2ee6c8', cyan: '#4cc9ff', amber: '#ffb547',
  mag: '#ff5fa2', purp: '#b07bff', green: '#7be36b', red: '#ff5d6c', ink: '#eaf6fa',
  muted: '#86a3b3', soil: '#4a2f1c', bp: '#0a2a44'
};
const TAU = Math.PI * 2;

/* ---------- math ---------- */
function rng(a) { return function () { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const lerp = (a, b, k) => a + (b - a) * k;
const P = (t, a, b) => clamp((t - a) / (b - a));
const eo = k => 1 - Math.pow(1 - k, 3);
const eio = k => k < .5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2;
const eback = k => { if (k <= 0) return 0; if (k >= 1) return 1; const c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * Math.pow(k - 1, 3) + c1 * Math.pow(k - 1, 2); };
const eel = k => k <= 0 ? 0 : k >= 1 ? 1 : Math.pow(2, -10 * k) * Math.sin((k * 10 - .75) * TAU / 3) + 1;
function IO(t, a, b = 1e9, fi = .45, fo = .45) { if (t < a || t > b) return 0; return Math.min(eo(P(t, a, a + fi)), 1 - eio(P(t, b - fo, b))); }
function track(t, init, steps) { let v = init.slice(); for (const [a, b, to, ef] of steps) { const k = (ef || eio)(P(t, a, b)); if (k <= 0) break; v = v.map((x, i) => lerp(x, to[i], k)); } return v; }
function rgba(hex, a) { const n = parseInt(hex.slice(1), 16); return `rgba(${n >> 16 & 255},${n >> 8 & 255},${n & 255},${a})`; }
function mix(h1, h2, k) { const a = parseInt(h1.slice(1), 16), b = parseInt(h2.slice(1), 16); const r = Math.round(lerp(a >> 16 & 255, b >> 16 & 255, k)), g = Math.round(lerp(a >> 8 & 255, b >> 8 & 255, k)), bl = Math.round(lerp(a & 255, b & 255, k)); return '#' + ((1 << 24) + (r << 16) + (g << 8) + bl).toString(16).slice(1); }

/* ---------- canvas helpers ---------- */
let GZ = 1;
function camSet(cx = 960, cy = 540, z = 1) { const zz = z * GZ; X.setTransform(zz, 0, 0, zz, W / 2 - cx * zz, H / 2 - cy * zz); }
function sprite(w, h, fn) { const c = document.createElement('canvas'); c.width = w; c.height = h; fn(c.getContext('2d'), w, h); return c; }
function withA(a, fn) { if (a <= 0.002) return; X.save(); X.globalAlpha *= a; fn(); X.restore(); }

function T(str, x, y, o = {}) {
  const { size = 40, font = 'SG', weight = 700, color = C.ink, align = 'center', alpha = 1, base = 'middle', ls = 0, glow = 0, rtl = false } = o;
  if (alpha <= 0.003) return 0;
  X.save(); X.globalAlpha *= alpha; X.font = `${weight} ${size}px ${font}`; X.fillStyle = color;
  X.textAlign = align; X.textBaseline = base; X.direction = rtl ? 'rtl' : 'ltr'; X.letterSpacing = ls + 'px';
  if (glow) { X.shadowColor = o.glowColor || color; X.shadowBlur = glow; }
  X.fillText(str, x, y); const w = X.measureText(str).width; X.restore(); return w;
}
function TW(str, size, font = 'SG', weight = 700, ls = 0) { X.save(); X.font = `${weight} ${size}px ${font}`; X.letterSpacing = ls + 'px'; const w = X.measureText(str).width; X.restore(); return w; }
// animated text: fade + rise in at t0, out at t1
function TA(str, x, y, t, t0, t1, o = {}) {
  const a = IO(t, t0, t1, o.fi || .5, o.fo || .45); if (a <= 0) return;
  const k = eo(P(t, t0, t0 + (o.fi || .5)));
  T(str, x, y + (1 - k) * (o.rise ?? 26), Object.assign({}, o, { alpha: a * (o.alpha ?? 1) }));
}
function chip(str, x, y, col, a, o = {}) {
  if (a <= 0.003) return;
  const size = o.size || 24, font = o.font || 'JB', weight = o.weight || 600, ls = o.ls ?? 2;
  const w = TW(str, size, font, weight, ls) + (o.padX || 26) * 2, h = size + (o.padY || 16) * 2;
  const sc = o.pop ? eback(clamp(o.pop)) : 1;
  X.save(); X.translate(x, y); X.scale(sc, sc); X.globalAlpha *= a;
  X.beginPath(); X.roundRect(-w / 2, -h / 2, w, h, h / 2);
  X.fillStyle = rgba(col, o.fillA ?? .12); X.fill(); X.lineWidth = 2; X.strokeStyle = rgba(col, .85); X.stroke();
  X.font = `${weight} ${size}px ${font}`; X.letterSpacing = ls + 'px'; X.fillStyle = o.textColor || col; X.textAlign = 'center'; X.textBaseline = 'middle';
  X.fillText(str, ls / 2, 1); X.restore();
}
function chipA(str, x, y, col, t, t0, t1, o = {}) { const a = IO(t, t0, t1, .35, .4); chip(str, x, y, col, a, Object.assign({ pop: P(t, t0, t0 + .45) }, o)); }

function glowCircle(x, y, r, col, a) { if (a <= 0) return; const g = X.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, rgba(col, a)); g.addColorStop(1, rgba(col, 0)); X.fillStyle = g; X.beginPath(); X.arc(x, y, r, 0, TAU); X.fill(); }
function arrowHead(x, y, ang, s, col) { X.save(); X.translate(x, y); X.rotate(ang); X.beginPath(); X.moveTo(0, 0); X.lineTo(-s, -s * .6); X.lineTo(-s, s * .6); X.closePath(); X.fillStyle = col; X.fill(); X.restore(); }
function line(x1, y1, x2, y2, col, lw = 2, a = 1, dash) { if (a <= 0) return; X.save(); X.globalAlpha *= a; X.strokeStyle = col; X.lineWidth = lw; X.lineCap = 'round'; if (dash) X.setLineDash(dash); X.beginPath(); X.moveTo(x1, y1); X.lineTo(x2, y2); X.stroke(); X.restore(); }
function lineP(x1, y1, x2, y2, col, lw, p, a = 1) { if (p <= 0) return; line(x1, y1, lerp(x1, x2, p), lerp(y1, y2, p), col, lw, a); }

/* ---------- static textures ---------- */
const R0 = rng(11);
const NOISE = [0, 1, 2].map(i => sprite(256, 256, (c, w, h) => { const id = c.createImageData(w, h); const r = rng(100 + i); for (let k = 0; k < w * h; k++) { const v = r() * 255 | 0; id.data[k * 4] = v; id.data[k * 4 + 1] = v; id.data[k * 4 + 2] = v; id.data[k * 4 + 3] = 255; } c.putImageData(id, 0, 0); }));
const VIG = sprite(W, H, (c) => { const g = c.createRadialGradient(W / 2, H / 2, H * .35, W / 2, H / 2, H * 1.05); g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, 'rgba(0,0,0,.72)'); c.fillStyle = g; c.fillRect(0, 0, W, H); });
const MOTES = Array.from({ length: 80 }, () => ({ x: R0() * W, y: R0() * H, r: .8 + R0() * 2.6, sp: .006 + R0() * .02, ph: R0() * TAU, a: .08 + R0() * .25, c: R0() < .7 ? C.teal : C.cyan }));

/* ---------- microbe sprites ---------- */
function mkRod(col) {
  return sprite(150, 80, (c, w, h) => {
    c.translate(w / 2, h / 2); c.shadowColor = col; c.shadowBlur = 16;
    c.strokeStyle = rgba(col, .7); c.lineWidth = 2.5; c.lineCap = 'round';
    c.beginPath(); c.moveTo(-30, 0); c.bezierCurveTo(-42, -10, -50, 10, -64, 0); c.stroke();
    const g = c.createLinearGradient(0, -12, 0, 12); g.addColorStop(0, mix(col, '#ffffff', .45)); g.addColorStop(1, col);
    c.fillStyle = g; c.beginPath(); c.roundRect(-32, -12, 64, 24, 12); c.fill();
    c.shadowBlur = 0; c.fillStyle = 'rgba(255,255,255,.4)'; c.beginPath(); c.roundRect(-20, -7, 34, 5, 3); c.fill();
    c.fillStyle = rgba('#000000', .18); c.beginPath(); c.ellipse(4, 3, 12, 4, 0, 0, TAU); c.fill();
  });
}
function mkCoccus(col) {
  return sprite(90, 60, (c, w, h) => {
    c.translate(w / 2, h / 2); c.shadowColor = col; c.shadowBlur = 14;
    for (const dx of [-11, 11]) { const g = c.createRadialGradient(dx - 4, -4, 1, dx, 0, 13); g.addColorStop(0, mix(col, '#fff', .55)); g.addColorStop(1, col); c.fillStyle = g; c.beginPath(); c.arc(dx, 0, 12, 0, TAU); c.fill(); }
  });
}
function mkSpiral(col) {
  return sprite(130, 50, (c, w, h) => {
    c.translate(w / 2, h / 2); c.shadowColor = col; c.shadowBlur = 14; c.strokeStyle = col; c.lineWidth = 7; c.lineCap = 'round';
    c.beginPath(); for (let i = 0; i <= 40; i++) { const x = -44 + i * 2.2, y = Math.sin(i / 40 * TAU * 2) * 9; i ? c.lineTo(x, y) : c.moveTo(x, y); } c.stroke();
  });
}
const SP = { rodT: mkRod(C.teal), rodA: mkRod(C.amber), rodC: mkRod(C.cyan), cocM: mkCoccus(C.mag), cocP: mkCoccus(C.purp), spG: mkSpiral(C.green), rodG: mkRod('#9a9a9a'), rodK: mkRod('#c9c3b5') };
const SPK = ['rodT', 'rodA', 'cocM', 'spG', 'rodC', 'cocP'];
function drawSprite(sp, x, y, ang, sc, a = 1) { if (a <= 0 || sc <= 0) return; X.save(); X.translate(x, y); X.rotate(ang); X.scale(sc, sc); X.globalAlpha *= a; X.drawImage(sp, -sp.width / 2, -sp.height / 2); X.restore(); }

/* ---------- icons (line style) ---------- */
function stroke(col, lw) { X.strokeStyle = col; X.lineWidth = lw; X.lineCap = 'round'; X.lineJoin = 'round'; }
function iconCloud(x, y, s, col, a) {
  withA(a, () => { X.save(); X.translate(x, y); X.scale(s, s); X.beginPath(); X.moveTo(-70, 30); X.bezierCurveTo(-104, 30, -104, -18, -66, -16); X.bezierCurveTo(-62, -54, -8, -58, 2, -26); X.bezierCurveTo(16, -58, 74, -48, 66, -10); X.bezierCurveTo(102, -6, 98, 30, 68, 30); X.closePath(); X.fillStyle = rgba(col, .14); X.fill(); stroke(col, 5 / s); X.stroke(); X.restore(); });
}
function iconRain(x, y, s, col, a, t) {
  withA(a, () => { for (let k = 0; k < 7; k++) { const dx = -60 + k * 20, off = ((t * 380 + k * 47) % 110); const yy = y + off * s; const fa = 1 - off / 110; line(x + dx * s, yy, x + dx * s - 6 * s, yy + 18 * s, col, 4, fa); } });
}
function iconThermo(x, y, s, col, a, lvl) {
  withA(a, () => {
    X.save(); X.translate(x, y); X.scale(s, s); stroke(col, 5 / s);
    X.beginPath(); X.roundRect(-13, -78, 26, 118, 13); X.stroke(); X.beginPath(); X.arc(0, 56, 24, 0, TAU); X.fillStyle = rgba(C.red, .9); X.fill(); X.stroke();
    X.fillStyle = C.red; X.beginPath(); X.roundRect(-6, 40 - 110 * lvl, 12, 110 * lvl + 10, 6); X.fill();
    for (let i = 0; i < 4; i++) line(18, -60 + i * 22, 28, -60 + i * 22, col, 3 / s);
    X.restore();
  });
}
function iconSun(x, y, s, col, a, t) {
  withA(a, () => { X.save(); X.translate(x, y); X.scale(s, s); glowCircle(0, 0, 120, col, .35); stroke(col, 5 / s); X.beginPath(); X.arc(0, 0, 34, 0, TAU); X.fillStyle = rgba(col, .25); X.fill(); X.stroke(); X.rotate(t * .3); for (let i = 0; i < 10; i++) { X.rotate(TAU / 10); line(50, 0, 66, 0, col, 5 / s); } X.restore(); });
}
function iconDrop(x, y, s, col, a) {
  withA(a, () => { X.save(); X.translate(x, y); X.scale(s, s); X.beginPath(); X.moveTo(0, -46); X.bezierCurveTo(16, -20, 34, 0, 34, 18); X.arc(0, 18, 34, 0, Math.PI); X.bezierCurveTo(-34, 0, -16, -20, 0, -46); X.closePath(); X.fillStyle = rgba(col, .2); X.fill(); stroke(col, 5 / s); X.stroke(); X.restore(); });
}
function iconO2(x, y, s, col, a) {
  withA(a, () => { X.save(); X.translate(x, y); X.scale(s, s); stroke(col, 5 / s); for (const dx of [-20, 20]) { X.beginPath(); X.arc(dx, 0, 24, 0, TAU); X.fillStyle = rgba(col, .18); X.fill(); X.stroke(); } X.restore(); T('O₂', x, y + 2 * s, { size: 26 * s, font: 'SG', color: col }); });
}
function iconBulb(x, y, s, col, a) {
  withA(a, () => { X.save(); X.translate(x, y); X.scale(s, s); stroke(col, 5 / s); X.beginPath(); X.arc(0, -10, 32, Math.PI * .8, Math.PI * 2.2); X.lineTo(14, 30); X.lineTo(-14, 30); X.closePath(); X.fillStyle = rgba(col, .2); X.fill(); X.stroke(); line(-12, 42, 12, 42, col, 5 / s); line(-8, 52, 8, 52, col, 5 / s); X.restore(); });
}
function iconHex(x, y, s, col, a, lab = 'N·P') {
  withA(a, () => { X.save(); X.translate(x, y); X.scale(s, s); stroke(col, 5 / s); X.beginPath(); for (let i = 0; i < 6; i++) { const an = i / 6 * TAU + Math.PI / 6; X.lineTo(Math.cos(an) * 40, Math.sin(an) * 40); } X.closePath(); X.fillStyle = rgba(col, .16); X.fill(); X.stroke(); X.restore(); T(lab, x, y + 2 * s, { size: 22 * s, color: col }); });
}
function iconLock(x, y, s, col, a) {
  withA(a, () => { X.save(); X.translate(x, y); X.scale(s, s); stroke(col, 4 / s); X.beginPath(); X.arc(0, -8, 11, Math.PI, 0); X.lineTo(11, 0); X.moveTo(-11, 0); X.lineTo(-11, -8); X.stroke(); X.beginPath(); X.roundRect(-16, -2, 32, 24, 5); X.fillStyle = col; X.fill(); X.restore(); });
}
function badge(x, y, r, ok, a, pop) {
  if (a <= 0) return; const s = eback(clamp(pop)); const col = ok ? C.teal : C.red;
  X.save(); X.translate(x, y); X.scale(s, s); X.globalAlpha *= a; X.shadowColor = col; X.shadowBlur = 24;
  X.beginPath(); X.arc(0, 0, r, 0, TAU); X.fillStyle = col; X.fill(); X.shadowBlur = 0; stroke('#04121a', r * .2);
  X.beginPath(); if (ok) { X.moveTo(-r * .42, 0); X.lineTo(-r * .1, r * .32); X.lineTo(r * .45, -r * .3); } else { X.moveTo(-r * .32, -r * .32); X.lineTo(r * .32, r * .32); X.moveTo(r * .32, -r * .32); X.lineTo(-r * .32, r * .32); } X.stroke(); X.restore();
}
function dial(x, y, r, val, label, col, a, valTxt) {
  withA(a, () => {
    const a0 = Math.PI * .75, span = Math.PI * 1.5;
    X.beginPath(); X.arc(x, y, r + 16, 0, TAU); X.fillStyle = 'rgba(6,22,32,.85)'; X.fill(); stroke(rgba(col, .35), 2); X.stroke();
    stroke('rgba(255,255,255,.12)', 10); X.beginPath(); X.arc(x, y, r, a0, a0 + span); X.stroke();
    X.save(); X.shadowColor = col; X.shadowBlur = 14; stroke(col, 10); X.beginPath(); X.arc(x, y, r, a0, a0 + span * val); X.stroke(); X.restore();
    for (let i = 0; i <= 10; i++) { const an = a0 + span * i / 10; line(x + Math.cos(an) * (r - 18), y + Math.sin(an) * (r - 18), x + Math.cos(an) * (r - 10), y + Math.sin(an) * (r - 10), 'rgba(255,255,255,.35)', 2); }
    const an = a0 + span * val; line(x, y, x + Math.cos(an) * (r - 22), y + Math.sin(an) * (r - 22), C.ink, 4);
    X.beginPath(); X.arc(x, y, 7, 0, TAU); X.fillStyle = C.ink; X.fill();
    T(label, x, y + r + 44, { size: 22, font: 'JB', weight: 600, color: col, ls: 3 });
    if (valTxt) T(valTxt, x, y + r * .55, { size: 20, font: 'JB', weight: 600, color: C.ink });
  });
}
function meter(cx, y, w, val, label, col, a) {
  withA(a, () => {
    T(label, cx - w / 2, y - 18, { size: 18, font: 'JB', weight: 600, color: C.muted, align: 'left', ls: 3 });
    T(Math.round(val * 100) + '%', cx + w / 2, y - 18, { size: 18, font: 'JB', weight: 600, color: col, align: 'right' });
    X.beginPath(); X.roundRect(cx - w / 2, y, w, 10, 5); X.fillStyle = 'rgba(255,255,255,.09)'; X.fill();
    if (val > 0.005) { X.save(); X.shadowColor = col; X.shadowBlur = 14; X.beginPath(); X.roundRect(cx - w / 2, y, Math.max(10, w * val), 10, 5); X.fillStyle = col; X.fill(); X.restore(); }
  });
}

/* ---------- jar ---------- */
function jarPath(s, close) {
  const w = 110 * s, h = 150 * s, r = 42 * s, nw = 56 * s, nh = 50 * s;
  X.beginPath(); X.moveTo(-nw, -h - nh); X.lineTo(-nw, -h - 10 * s); X.quadraticCurveTo(-nw, -h, -nw - 22 * s, -h);
  X.lineTo(-w + r, -h); X.quadraticCurveTo(-w, -h, -w, -h + r); X.lineTo(-w, h - r); X.quadraticCurveTo(-w, h, -w + r, h);
  X.lineTo(w - r, h); X.quadraticCurveTo(w, h, w, h - r); X.lineTo(w, -h + r); X.quadraticCurveTo(w, -h, w - r, -h);
  X.lineTo(nw + 22 * s, -h); X.quadraticCurveTo(nw, -h, nw, -h - 10 * s); X.lineTo(nw, -h - nh); if (close) X.closePath();
}
const JM = (() => { const r = rng(5); return Array.from({ length: 30 }, (_, i) => ({ u: -.78 + r() * 1.56, v: -.5 + r() * 1.35, k: SPK[i % SPK.length], ph: r() * TAU, sp: .5 + r() * .8, sc: .38 + r() * .2 })); })();
const JLINKS = (() => { const L = []; for (let i = 0; i < JM.length; i++) for (let j = i + 1; j < JM.length; j++) { const du = (JM[i].u - JM[j].u) * 1.1, dv = JM[i].v - JM[j].v; if (Math.hypot(du, dv) < .42) L.push([i, j, R0()]); } return L; })();
function jmPos(m, s, t) { const w = 110 * s, h = 150 * s; return [m.u * w * .9 + Math.sin(t * m.sp + m.ph) * 9 * s, m.v * h * .9 + Math.cos(t * m.sp * .8 + m.ph) * 7 * s]; }
function jarContents(s, t, o) {
  const w = 110 * s, h = 150 * s;
  // water
  const wt = -h * .62;
  let g = X.createLinearGradient(0, wt, 0, h); g.addColorStop(0, 'rgba(60,170,200,.30)'); g.addColorStop(1, 'rgba(20,90,120,.45)');
  X.fillStyle = g; X.beginPath(); X.moveTo(-w, wt); for (let i = 0; i <= 20; i++) X.lineTo(-w + i * w / 10, wt + Math.sin(i * .9 + t * 2) * 3 * s); X.lineTo(w, h); X.lineTo(-w, h); X.closePath(); X.fill();
  line(-w, wt, w, wt, 'rgba(160,240,255,.5)', 2 * s);
  // soil
  const st = h * .28;
  g = X.createLinearGradient(0, st, 0, h); g.addColorStop(0, '#6b4528'); g.addColorStop(.55, '#4a2f1c'); g.addColorStop(1, '#22150d');
  X.fillStyle = g; X.beginPath(); X.moveTo(-w, st); for (let i = 0; i <= 20; i++) X.lineTo(-w + i * w / 10, st + Math.sin(i * 1.3) * 7 * s); X.lineTo(w, h); X.lineTo(-w, h); X.closePath(); X.fill();
  X.fillStyle = 'rgba(0,0,0,.25)'; X.fillRect(-w, h * .72, 2 * w, h * .3);
  const pr = rng(9); X.fillStyle = 'rgba(255,230,200,.12)'; for (let i = 0; i < 40; i++) { X.beginPath(); X.arc(-w + pr() * 2 * w, st + 10 * s + pr() * (h - st), (1 + pr() * 3) * s, 0, TAU); X.fill(); }
  // sprout
  stroke('#5fbf5a', 4 * s); X.beginPath(); X.moveTo(-w * .45, st + 4 * s); X.quadraticCurveTo(-w * .5, st - 40 * s, -w * .38, st - 70 * s); X.stroke();
  X.fillStyle = '#5fbf5a'; X.beginPath(); X.ellipse(-w * .3, st - 64 * s, 16 * s, 7 * s, -.5, 0, TAU); X.fill(); X.beginPath(); X.ellipse(-w * .5, st - 48 * s, 14 * s, 6 * s, .6, 0, TAU); X.fill();
  // network
  const net = o.net || 0;
  if (net > 0) {
    for (const [i, j, ph] of JLINKS) {
      const [x1, y1] = jmPos(JM[i], s, t), [x2, y2] = jmPos(JM[j], s, t);
      line(x1, y1, x2, y2, C.teal, 1.6 * s, net * .55);
      const f = (t * .7 + ph) % 1; glowCircle(lerp(x1, x2, f), lerp(y1, y2, f), 9 * s, C.amber, net * .9);
    }
  }
  const ma = o.microbes ?? 1;
  if (ma > 0) for (const m of JM) { const [x, y] = jmPos(m, s, t); drawSprite(SP[o.grey ? 'rodG' : m.k], x, y, m.ph + Math.sin(t * m.sp) * .5, m.sc * s * (1 + .25 * net), ma * (.85 + .15 * Math.sin(t * 3 + m.ph))); }
  if (o.warm > 0) { X.fillStyle = rgba(C.amber, .28 * o.warm); X.fillRect(-w, -h, 2 * w, 2 * h); glowCircle(0, h * .2, w * 1.3, C.amber, .25 * o.warm); }
  if (o.grey) { X.save(); X.globalCompositeOperation = 'saturation'; X.fillStyle = '#808080'; X.fillRect(-w, -h - 60 * s, 2 * w, 2 * h + 60 * s); X.restore(); X.fillStyle = 'rgba(10,20,26,.35)'; X.fillRect(-w, -h, 2 * w, 2 * h); }
}
function drawJar(x, y, s, o = {}) {
  const a = o.a ?? 1; if (a <= 0.003 || s <= 0) return;
  X.save(); X.translate(x, y); X.globalAlpha *= a;
  const w = 110 * s, h = 150 * s, nw = 56 * s, nh = 50 * s;
  if (o.glow > 0) { glowCircle(0, 0, 330 * s, o.glowCol || C.teal, .28 * o.glow); }
  const fill = o.fill ?? 1;
  if (fill > 0) { X.save(); jarPath(s, true); X.clip(); X.globalAlpha *= fill; jarContents(s, o.t || 0, o); X.restore(); }
  if (o.inner) { X.save(); jarPath(s, true); X.clip(); o.inner(s); X.restore(); }
  jarPath(s, false); X.fillStyle = 'rgba(190,235,255,.045)'; X.fill();
  const dp = o.draw ?? 1; stroke(o.lineCol || 'rgba(205,240,255,.9)', Math.max(2.5, 4.5 * s));
  if (dp < 1) X.setLineDash([1500 * s * dp, 1600 * s]);
  X.save(); if (o.glow > 0) { X.shadowColor = o.glowCol || C.teal; X.shadowBlur = 22 * o.glow; } X.stroke(); X.restore(); X.setLineDash([]);
  if (dp >= 1) { line(-w + 20 * s, -h + 46 * s, -w + 20 * s, h - 70 * s, 'rgba(255,255,255,.28)', 7 * s); line(-w + 38 * s, -h + 52 * s, -w + 38 * s, -h + 110 * s, 'rgba(255,255,255,.18)', 4 * s); line(-nw - 8 * s, -h - nh, nw + 8 * s, -h - nh, 'rgba(205,240,255,.9)', 5 * s); }
  if (o.hl > 0) { X.save(); X.setLineDash([12 * s, 10 * s]); X.lineDashOffset = -(o.t || 0) * 40; stroke(C.amber, 3 * s); X.globalAlpha *= o.hl; X.beginPath(); X.roundRect(-w + 10 * s, -h * .7, 2 * w - 20 * s, h * 1.62, 22 * s); X.stroke(); X.restore(); }
  if ((o.cork || 0) > 0) {
    const k = o.cork, off = (1 - eback(k)) * -170 * s;
    X.save(); X.globalAlpha *= clamp(k * 4); const cy = -h - nh - 30 * s + off;
    const g = X.createLinearGradient(-nw, 0, nw, 0); g.addColorStop(0, '#8a5a34'); g.addColorStop(.5, '#c8925c'); g.addColorStop(1, '#7a4c2a');
    X.fillStyle = g; X.beginPath(); X.roundRect(-nw - 4 * s, cy, 2 * nw + 8 * s, 46 * s, 8 * s); X.fill();
    X.fillStyle = 'rgba(0,0,0,.2)'; for (let i = 0; i < 4; i++) { X.beginPath(); X.arc(-nw * .6 + i * nw * .4, cy + 16 * s + (i % 2) * 12 * s, 3 * s, 0, TAU); X.fill(); }
    X.restore();
  }
  X.restore();
}

/* ---------- other props ---------- */
const PETRI = (() => { const r = rng(21); return Array.from({ length: 16 }, () => ({ a: r() * TAU, d: Math.sqrt(r()) * .72, s: .05 + r() * .06 })); })();
function drawPetri(x, y, r, t, a) {
  withA(a, () => {
    X.save(); X.translate(x, y);
    X.beginPath(); X.ellipse(0, 10, r * 1.02, r * 1.02, 0, 0, TAU); X.fillStyle = 'rgba(0,0,0,.35)'; X.fill();
    const g = X.createRadialGradient(-r * .3, -r * .3, r * .1, 0, 0, r); g.addColorStop(0, 'rgba(255,214,120,.42)'); g.addColorStop(1, 'rgba(230,160,70,.25)');
    X.beginPath(); X.arc(0, 0, r, 0, TAU); X.fillStyle = g; X.fill(); stroke('rgba(220,240,255,.85)', 4); X.stroke();
    X.beginPath(); X.arc(0, 0, r * .9, 0, TAU); stroke('rgba(220,240,255,.3)', 2); X.stroke();
    for (const c of PETRI) { const cx = Math.cos(c.a) * c.d * r, cy = Math.sin(c.a) * c.d * r, cr = c.s * r; X.save(); X.shadowColor = '#fff3c4'; X.shadowBlur = 10; X.beginPath(); X.arc(cx, cy, cr, 0, TAU); X.fillStyle = '#fbeec0'; X.fill(); X.restore(); X.beginPath(); X.arc(cx, cy, cr * .55, 0, TAU); X.fillStyle = 'rgba(255,255,255,.5)'; X.fill(); }
    line(-r * .55, -r * .62, -r * .2, -r * .8, 'rgba(255,255,255,.35)', 5);
    X.restore();
  });
}
function drawField(x, y, r, t, a, o = {}) {
  withA(a, () => {
    X.save(); X.translate(x, y); X.beginPath(); X.arc(0, 0, r, 0, TAU); X.save(); X.clip();
    let g = X.createLinearGradient(0, -r, 0, r * .2); g.addColorStop(0, '#123a55'); g.addColorStop(1, '#3a8b9c'); X.fillStyle = g; X.fillRect(-r, -r, 2 * r, 2 * r);
    glowCircle(r * .45, -r * .45, r * .55, C.amber, .55); X.beginPath(); X.arc(r * .45, -r * .45, r * .12, 0, TAU); X.fillStyle = '#ffd98a'; X.fill();
    X.fillStyle = 'rgba(255,255,255,.75)'; const cx = ((t * 18) % (2.6 * r)) - 1.3 * r; for (const [dx, dy, rr] of [[0, 0, .1], [.1, .02, .08], [-.1, .03, .07]]) { X.beginPath(); X.arc(cx + dx * r, -r * .55 + dy * r, rr * r, 0, TAU); X.fill(); }
    X.fillStyle = '#1f5546'; X.beginPath(); X.moveTo(-r, r * .05); for (let i = 0; i <= 12; i++) X.lineTo(-r + i * r / 6, r * .05 - Math.sin(i * .8) * r * .12 - r * .06); X.lineTo(r, r); X.lineTo(-r, r); X.fill();
    if (o.cross) { g = X.createLinearGradient(0, r * .2, 0, r); g.addColorStop(0, '#6b4528'); g.addColorStop(1, '#2a1a10'); X.fillStyle = g; X.fillRect(-r, r * .26, 2 * r, r); X.fillStyle = '#3f8a43'; X.fillRect(-r, r * .2, 2 * r, r * .08); }
    else { X.fillStyle = '#2f7a3f'; X.beginPath(); X.moveTo(-r, r * .3); X.quadraticCurveTo(0, r * .12, r, r * .32); X.lineTo(r, r); X.lineTo(-r, r); X.fill();
      g = X.createLinearGradient(0, r * .35, 0, r * .7); g.addColorStop(0, '#5fc3e4'); g.addColorStop(1, '#2a7fa8'); X.fillStyle = g; X.beginPath(); X.ellipse(-r * .2, r * .52, r * .5, r * .13, 0, 0, TAU); X.fill();
      line(-r * .55, r * .5, r * .1, r * .5, 'rgba(255,255,255,.4)', 2); }
    X.fillStyle = '#4b3424'; X.fillRect(r * .38, -r * .05, r * .06, r * .32); X.fillStyle = '#2f8a4a'; X.beginPath(); X.arc(r * .41, -r * .12, r * .16, 0, TAU); X.fill(); X.fillStyle = '#3fa65a'; X.beginPath(); X.arc(r * .36, -r * .17, r * .1, 0, TAU); X.fill();
    X.restore(); stroke('rgba(220,240,255,.85)', 4); X.beginPath(); X.arc(0, 0, r, 0, TAU); X.stroke(); X.restore();
  });
}
function drawTank(x, y, w, h, a, t, o = {}) {
  withA(a, () => {
    const ry = w * .13; X.save(); X.translate(x, y);
    X.beginPath(); X.ellipse(0, 0, w / 2 * 1.08, ry * 1.2, 0, 0, TAU); X.fillStyle = 'rgba(0,0,0,.35)'; X.fill();
    const wl = -h * .82;
    let g = X.createLinearGradient(0, wl, 0, 0); g.addColorStop(0, 'rgba(70,190,170,.55)'); g.addColorStop(1, 'rgba(20,90,90,.75)');
    X.fillStyle = g; X.beginPath(); X.moveTo(-w / 2, wl); X.lineTo(-w / 2, 0); X.ellipse(0, 0, w / 2, ry, 0, Math.PI, 0, true); X.lineTo(w / 2, wl); X.ellipse(0, wl, w / 2, ry, 0, 0, Math.PI); X.fill();
    X.beginPath(); X.ellipse(0, wl, w / 2, ry, 0, 0, TAU); X.fillStyle = 'rgba(120,230,210,.45)'; X.fill();
    const pr = rng(31 + (o.seed || 0)); for (let i = 0; i < 26; i++) { const px = (-.45 + pr() * .9) * w, py = wl + 20 + pr() * (h * .78 - 30); glowCircle(px + Math.sin(t + i) * 4, py + Math.cos(t * .7 + i) * 4, 6, i % 3 ? C.green : C.teal, .7); }
    stroke('rgba(210,240,255,.8)', 3.5); X.beginPath(); X.moveTo(-w / 2, -h); X.lineTo(-w / 2, 0); X.ellipse(0, 0, w / 2, ry, 0, Math.PI, 0, true); X.lineTo(w / 2, -h); X.stroke();
    X.beginPath(); X.ellipse(0, -h, w / 2, ry, 0, 0, TAU); X.stroke();
    line(-w / 2 + 16, -h + 20, -w / 2 + 16, -20, 'rgba(255,255,255,.25)', 6);
    X.restore();
  });
}
function drawTree(x, y, s, a) { withA(a, () => { X.fillStyle = '#2a1d14'; X.fillRect(x - 8 * s, y - 90 * s, 16 * s, 90 * s); X.fillStyle = '#1f6a3a'; X.beginPath(); X.arc(x, y - 120 * s, 56 * s, 0, TAU); X.fill(); X.fillStyle = '#2b8a4c'; X.beginPath(); X.arc(x - 20 * s, y - 136 * s, 34 * s, 0, TAU); X.fill(); }); }

/* ---------- background ---------- */
function bgDark(t, a = 1) {
  withA(a, () => {
    const g = X.createRadialGradient(W * .5, H * .42, 50, W * .5, H * .5, W * .75); g.addColorStop(0, '#0d2a38'); g.addColorStop(1, C.bg0);
    X.fillStyle = g; X.fillRect(0, 0, W, H);
    for (const m of MOTES) { const y = ((m.y - t * m.sp * H) % H + H) % H, x = m.x + Math.sin(t * .3 + m.ph) * 30; X.globalAlpha = a * m.a * (.6 + .4 * Math.sin(t * 1.3 + m.ph)); X.fillStyle = m.c; X.beginPath(); X.arc(x, y, m.r, 0, TAU); X.fill(); }
  });
}

