// Make a size-capped upload copy. The original is NEVER touched or overwritten.
// node compress.js <input.mp4> [--mb 30] [--mode fast|quality] [--width 720] [--out file.mp4]
//   fast    = GPU (NVENC) single pass, native resolution unless --width is given (~80s for 5 min)
//   quality = CPU x264 two-pass (slower, ~3.5 min for 5 min)
// Measured on the Reel (1009 MB, 303 s): NVENC lands well UNDER the requested bitrate, so the loop
// tunes the bitrate both ways and keeps the biggest (= best-looking) result that still fits the cap.
const path = require('path'), fs = require('fs'), { spawnSync } = require('child_process');
const FF = path.join(__dirname, 'bin', 'ffmpeg.exe');

function duration(file) {
  const r = spawnSync(FF, ['-hide_banner', '-i', file], { encoding: 'utf8' });
  const m = /Duration:\s*(\d+):(\d+):(\d+\.?\d*)/.exec(r.stderr || '');
  if (!m) throw new Error('cannot read duration of ' + file);
  return +m[1] * 3600 + +m[2] * 60 + +m[3];
}
function run(args, label) {
  const t = Date.now(); const r = spawnSync(FF, ['-hide_banner', '-loglevel', 'error', '-y', ...args], { stdio: ['ignore', 'inherit', 'inherit'] });
  if (r.status !== 0) throw new Error(label + ' failed (exit ' + r.status + ')');
  console.log(`  ${label}: ${((Date.now() - t) / 1000).toFixed(0)}s`);
}
const mb = f => fs.statSync(f).size / 1048576;

function encode(input, tmp, vK, mode, vf, aud) {
  if (mode === 'quality') {
    const log = path.join(path.dirname(tmp), '_x264pass');
    const base = ['-i', input, '-vf', vf, '-c:v', 'libx264', '-preset', 'medium', '-b:v', vK + 'k', '-pix_fmt', 'yuv420p', '-passlogfile', log];
    run([...base, '-pass', '1', '-an', '-f', 'null', 'NUL'], 'pass 1'); run([...base, '-pass', '2', ...aud, tmp], 'pass 2');
    for (const f of fs.readdirSync(path.dirname(tmp))) if (f.startsWith('_x264pass')) fs.unlinkSync(path.join(path.dirname(tmp), f));
  } else {
    run(['-i', input, '-vf', vf, '-c:v', 'h264_nvenc', '-preset', 'p5', '-tune', 'hq', '-rc', 'vbr', '-multipass', 'fullres', '-b:v', vK + 'k', '-maxrate', Math.round(vK * 1.3) + 'k', '-bufsize', vK * 2 + 'k', '-pix_fmt', 'yuv420p', ...aud, tmp], 'nvenc');
  }
}
function compress(input, o = {}) {
  const cap = o.mb || 30, mode = o.mode || 'fast', audioK = 80;
  const out = o.out || input.replace(/\.mp4$/i, '') + '_upload.mp4', tmp = out.replace(/\.mp4$/i, '') + '.tmp.mp4';
  if (path.resolve(out) === path.resolve(input)) throw new Error('refusing to overwrite the original');
  if (mb(input) <= cap) { fs.copyFileSync(input, out); console.log('already under the cap, copied as is'); return { out, size: mb(out), vK: 0, attempt: 0 }; }
  const dur = duration(input), target = cap * 0.96;                  // aim just under the cap
  let vK = Math.floor((cap * 0.93 * 8192) / dur - audioK);            // bitrate that would exactly fill the cap
  if (mode === 'fast') vK = Math.floor(vK * 1.5);                     // NVENC undershoots; start higher (measured ~0.55x of request)
  const vf = 'hqdn3d=2:1.5:4:3' + (o.width ? `,scale=${o.width}:-2:flags=lanczos` : '');   // denoise first: film grain eats the bitrate
  const aud = ['-c:a', 'aac', '-b:a', audioK + 'k', '-ac', '1', '-movflags', '+faststart'];
  console.log(`input ${mb(input).toFixed(0)} MB, ${dur.toFixed(0)}s -> cap ${cap} MB (${mode}, ${o.width ? o.width + 'px wide' : 'native resolution'})`);
  let best = null;
  for (let attempt = 1; attempt <= 4; attempt++) {
    console.log(`attempt ${attempt}: video ${vK} kbps`);
    encode(input, tmp, vK, mode, vf, aud);
    const size = mb(tmp); console.log(`  -> ${size.toFixed(1)} MB`);
    if (size <= cap) { if (!best || size > best.size) { fs.copyFileSync(tmp, out); best = { out, size, vK, attempt }; } if (size >= cap * 0.8) break; }
    else if (best && best.size >= cap * 0.6) break;                  // already have a decent valid file; stop rather than burn time
    vK = Math.floor(vK * target / size);                             // move the bitrate toward the target, up or down
  }
  if (fs.existsSync(tmp)) fs.unlinkSync(tmp);
  if (!best) throw new Error('could not reach the size cap; try --width 720 or a larger --mb');
  return best;
}
module.exports = { compress };

if (require.main === module) {
  const a = process.argv.slice(2), g = k => { const i = a.indexOf('--' + k); return i >= 0 ? a[i + 1] : undefined; };
  if (!a[0]) { console.log('usage: node compress.js <input.mp4> [--mb 30] [--mode fast|quality] [--width 720] [--out file.mp4]'); process.exit(1); }
  const t = Date.now(); const r = compress(path.resolve(a[0]), { mb: +g('mb') || 30, mode: g('mode'), width: +g('width') || 0, out: g('out') && path.resolve(g('out')) });
  console.log(`DONE ${r.out}  ${r.size.toFixed(1)} MB  in ${((Date.now() - t) / 1000).toFixed(0)}s`);
}
