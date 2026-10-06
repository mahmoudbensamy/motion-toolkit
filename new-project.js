// node new-project.js <name>   -> projects/<name>/ with the shared engine (core.js), fonts and a working demo scene.
// Vertical 9:16 (1080x1920), the same engine as the Reel. Edit scenes.js + timeline.js, then: node render.js projects/<name> --audio voice.wav
const fs = require('fs'), path = require('path');
const name = process.argv[2];
if (!name) { console.log('usage: node new-project.js <name>'); process.exit(1); }
const dst = path.join(__dirname, 'projects', name), base = path.join(__dirname, 'templates', 'base');
if (fs.existsSync(dst)) { console.error('already exists: ' + dst); process.exit(1); }
fs.mkdirSync(path.join(dst, 'fonts'), { recursive: true });
fs.copyFileSync(path.join(base, 'core.js'), path.join(dst, 'core.js'));
for (const f of fs.readdirSync(path.join(base, 'fonts'))) fs.copyFileSync(path.join(base, 'fonts', f), path.join(dst, 'fonts', f));

fs.writeFileSync(path.join(dst, 'index.html'), '<!doctype html><html><head><meta charset="utf-8"><style>html,body{margin:0;background:#000;overflow:hidden}canvas{display:block}</style></head><body><canvas id="c" width="1080" height="1920"></canvas><script src="core.js"></script><script src="scenes.js"></script><script src="timeline.js"></script></body></html>\n');

fs.writeFileSync(path.join(dst, 'scenes.js'), [
  "'use strict';",
  "// One function per scene, drawn at time t (seconds). Helpers come from core.js: T() text, bgDark() background,",
  "// P(t,a,b) progress 0..1, eo/eio/eback easing, IO() fade in/out, C colors, plus jars, icons, bacteria sprites, meters...",
  "function sceneDemo(t) {",
  "  bgDark(t);",
  "  T('عنوان الفيديو', W / 2, H * 0.42, { size: 110, font: 'CAIRO', weight: 900, rtl: true, color: C.teal, alpha: eo(P(t, 0.3, 1.2)) });",
  "  T('Your title here', W / 2, H * 0.52, { size: 64, color: C.ink, alpha: eo(P(t, 0.8, 1.6)) });",
  "}",
  ""].join('\n'));

fs.writeFileSync(path.join(dst, 'timeline.js'), [
  "'use strict';",
  "// Timeline: set DURATION to the voiceover length, then list scenes with start/end seconds taken from the word timestamps.",
  "const DURATION = 4; window.DURATION = DURATION;   // render.js reads this",
  "const XF = .45;                                    // cross-fade between scenes (s)",
  "const SEGS = [",
  "  { a: 0, b: DURATION, fn: sceneDemo },",
  "];",
  "function draw(t) {",
  "  X.setTransform(1, 0, 0, 1, 0, 0); X.globalAlpha = 1; X.globalCompositeOperation = 'source-over'; X.fillStyle = C.bg0; X.fillRect(0, 0, W, H);",
  "  for (const s of SEGS) {",
  "    if (t < s.a || t > s.b) continue;",
  "    const A = s.a === 0 ? 1 : eio(P(t, s.a, s.a + XF)); if (A <= 0) continue;",
  "    X.save(); X.globalAlpha = A; s.fn(t); X.restore();",
  "  }",
  "  GZ = 1; X.setTransform(1, 0, 0, 1, 0, 0); X.globalAlpha = 1; X.drawImage(VIG, 0, 0);   // vignette only: no film grain (grain wrecks compression)",
  "  const fb = 1 - P(t, 0, .6) + P(t, DURATION - .8, DURATION); if (fb > 0) { X.fillStyle = `rgba(0,0,0,${clamp(fb)})`; X.fillRect(0, 0, W, H); }",
  "}",
  "window.frame = (t) => { draw(t); return cv.toDataURL('image/jpeg', .94); };",
  "window.draw = draw;",
  "const AR = 'U+0600-06FF,U+0750-077F,U+FB50-FDFF,U+FE70-FEFF';",
  "const FONTS = [['SG', 'space-grotesk-latin-500-normal.woff2', 500], ['SG', 'space-grotesk-latin-700-normal.woff2', 700], ['CAIRO', 'cairo-arabic-700-normal.woff2', 700, AR], ['CAIRO', 'cairo-arabic-900-normal.woff2', 900, AR], ['JB', 'jetbrains-mono-latin-400-normal.woff2', 400], ['JB', 'jetbrains-mono-latin-600-normal.woff2', 600]];",
  "Promise.all(FONTS.map(([f, u, w, ur]) => { const ff = new FontFace(f, `url(fonts/${u})`, Object.assign({ weight: String(w) }, ur ? { unicodeRange: ur } : {})); document.fonts.add(ff); return ff.load(); }))",
  "  .then(() => { draw(0); window.READY = true; }).catch(e => { window.ERR = String(e); window.READY = true; });",
  ""].join('\n'));
console.log('created ' + dst + '\nnext: put your voiceover in it, edit scenes.js/timeline.js, then  node render.js "' + dst + '" --audio voice.wav --upload 30');
