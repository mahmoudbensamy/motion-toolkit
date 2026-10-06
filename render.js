// Render any canvas-timeline project locally, then (optionally) make the upload copy in the same run.
// node render.js <projectDir> --audio mix.wav [--workers 10] [--fps 30] [--dur SEC] [--draft] [--upload 30] [--mode fast|quality]
// Project contract: index.html exposes window.frame(t) -> JPEG dataURL and window.READY, and a duration
// via window.DURATION (or DUR2 / DUR). Width/height are read from the globals W and H.
const path = require('path'), fs = require('fs'), { spawn } = require('child_process');
const { chromium } = require('playwright-core');
const { compress } = require('./compress');
const FF = path.join(__dirname, 'bin', 'ffmpeg.exe');
let CFG = {}; try { CFG = JSON.parse(fs.readFileSync(path.join(__dirname, 'config.json'), 'utf8').replace(/^\uFEFF/, '')); } catch (e) { }   // written by setup.js: { mode, workers }
const a = process.argv.slice(2), g = (k, d) => { const i = a.indexOf('--' + k); return i >= 0 ? a[i + 1] : d; }, has = k => a.includes('--' + k);
const dir = path.resolve(a[0] || '.'), draft = has('draft');
const WK = +g('workers', CFG.workers || 10), FPS = draft ? 15 : +g('fps', 30), audioFile = path.resolve(dir, g('audio', 'mix.wav'));
const name = path.basename(dir), log = s => { fs.appendFileSync(path.join(dir, 'progress.log'), s + '\n'); console.log(s); };
const url = 'file:///' + path.join(dir, 'index.html').replace(/\\/g, '/');

async function open() {
  const br = await chromium.launch({ channel: 'msedge', args: ['--allow-file-access-from-files'] });
  const p = await br.newPage({ viewport: { width: 1080, height: 1920 } });
  await p.goto(url); await p.waitForFunction('window.READY===true');
  const err = await p.evaluate('window.ERR'); if (err) log('FONT ERR ' + err);
  return { br, p };
}
async function worker(i, a0, b0, seg, st, prog) {
  const { br, p } = await open();
  const vf = draft ? ['-vf', 'scale=540:-2'] : [], crf = draft ? '28' : '18';
  const ff = spawn(FF, ['-loglevel', 'error', '-y', '-f', 'image2pipe', '-c:v', 'mjpeg', '-r', '' + FPS, '-i', '-', ...vf, '-c:v', 'libx264', '-preset', draft ? 'ultrafast' : 'veryfast', '-crf', crf, '-pix_fmt', 'yuv420p', seg]);
  for (let f = a0; f < b0; f++) {
    const d = await p.evaluate(t => window.frame(t), f / FPS);
    if (!ff.stdin.write(Buffer.from(d.slice(d.indexOf(',') + 1), 'base64'))) await new Promise(r => ff.stdin.once('drain', r));
    prog.done++;
  }
  ff.stdin.end(); await new Promise(r => ff.on('close', r)); await br.close();
}
(async () => {
  const probe = await open();
  const [W, H, durAuto] = await probe.p.evaluate("[W, H, window.DURATION || (typeof DUR2 !== 'undefined' ? DUR2 : DUR)]"); await probe.br.close();
  const DUR = +g('dur', durAuto), NF = Math.round(DUR * FPS), per = Math.ceil(NF / WK), st = Date.now(), prog = { done: 0 };
  fs.writeFileSync(path.join(dir, 'progress.log'), `${name}: ${W}x${H}, ${DUR}s, ${NF} frames @${FPS}fps, ${WK} workers${draft ? ' (DRAFT)' : ''}\n`);
  const tick = setInterval(() => log(`frames ${prog.done}/${NF}  ${(prog.done / ((Date.now() - st) / 1000)).toFixed(1)} fps  elapsed ${((Date.now() - st) / 1000).toFixed(0)}s`), 15000);
  const segs = [], jobs = [];
  for (let i = 0; i < WK; i++) { const a0 = i * per, b0 = Math.min(NF, a0 + per); if (a0 >= b0) continue; const seg = path.join(dir, `seg_${i}.mp4`); segs.push(seg); jobs.push(worker(i, a0, b0, seg, st, prog)); }
  await Promise.all(jobs); clearInterval(tick); log(`render done in ${((Date.now() - st) / 1000).toFixed(0)}s`);
  fs.writeFileSync(path.join(dir, 'list.txt'), segs.map(s => `file '${s.replace(/\\/g, '/')}'`).join('\n'));
  const out = path.join(dir, `${name}${draft ? '_DRAFT' : ''}.mp4`);   // master: new name each project, never overwrites another project's file
  await new Promise((res, rej) => spawn(FF, ['-loglevel', 'error', '-y', '-f', 'concat', '-safe', '0', '-i', path.join(dir, 'list.txt'), '-i', audioFile, '-map', '0:v', '-map', '1:a', '-c:v', 'copy', '-c:a', 'aac', '-b:a', '192k', '-shortest', '-movflags', '+faststart', out], { stdio: 'inherit' }).on('close', c => c ? rej(new Error('mux failed')) : res()));
  segs.forEach(s => fs.unlinkSync(s)); log(`MASTER ${out} ${(fs.statSync(out).size / 1048576).toFixed(0)} MB  (${((Date.now() - st) / 1000).toFixed(0)}s)`);
  if (has('upload') && !draft) { const r = compress(out, { mb: +g('upload', 30), mode: g('mode', CFG.mode || 'fast'), width: +g('width', 0) }); log(`UPLOAD ${r.out} ${r.size.toFixed(1)} MB  (total ${((Date.now() - st) / 1000).toFixed(0)}s)`); }
})().catch(e => { console.error(e); process.exit(1); });
