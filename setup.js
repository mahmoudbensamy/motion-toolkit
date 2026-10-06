// One-command setup + self-test for a fresh clone (Windows, tested on Node 24 / Edge / NVIDIA NVENC).
//   node setup.js
// Safe to re-run. It never touches anything outside this folder. It:
//   1. checks Node, creates bin/ projects/ tests/   2. npm install (playwright-core)
//   3. gets ffmpeg into bin/ffmpeg.exe (via the ffmpeg-static npm package)
//   4. checks Edge and GPU encoding (NVENC), picks workers, writes config.json (machine-specific, git-ignored)
//   5. runs a full smoke test (draft render, full render, upload copy) and verifies the files, then deletes it
const fs = require('fs'), path = require('path'), os = require('os'), { spawnSync } = require('child_process');
const root = __dirname, FF = path.join(root, 'bin', 'ffmpeg.exe'), warn = [];
const say = (t, m) => console.log(t.padEnd(5) + m);
const fatal = m => { say('FAIL', m); console.log('\nSETUP FAILED'); process.exit(1); };
const run = (cmd, args, opt = {}) => opt.shell
  ? spawnSync([cmd, ...args].join(' '), { cwd: root, encoding: 'utf8', shell: true })   // single string: no Node DEP0190 warning
  : spawnSync(cmd, args, { cwd: root, encoding: 'utf8' });

if (process.platform !== 'win32') { warn.push('not Windows: scripts use bin\\ffmpeg.exe, NUL and Edge; expect to adapt (see README)'); say('WARN', warn[0]); }
const major = +process.versions.node.split('.')[0]; if (major < 18) fatal('Node 18+ required, found ' + process.versions.node);
say('OK', 'Node ' + process.versions.node);
for (const d of ['bin', 'projects', 'tests']) fs.mkdirSync(path.join(root, d), { recursive: true });

let r = run('npm', ['install', '--no-audit', '--no-fund'], { shell: true }); if (r.status !== 0) fatal('npm install failed:\n' + (r.stderr || r.stdout));
say('OK', 'npm install (playwright-core)');

if (!fs.existsSync(FF)) {
  r = run('npm', ['install', 'ffmpeg-static', '--no-save', '--no-audit', '--no-fund'], { shell: true }); if (r.status !== 0) fatal('ffmpeg-static install failed:\n' + (r.stderr || r.stdout));
  let src; try { src = require(path.join(root, 'node_modules', 'ffmpeg-static')); } catch (e) { fatal('ffmpeg-static did not provide a binary: ' + e.message); }
  if (!src || !fs.existsSync(src)) fatal('ffmpeg binary not found after install (download blocked?)');
  fs.copyFileSync(src, FF);
}
r = run(FF, ['-hide_banner', '-version']); if (r.status !== 0) fatal('bin/ffmpeg.exe does not run');
say('OK', r.stdout.split('\n')[0]);

const regHit = k => run('reg', ['query', k, '/ve']).status === 0;
const edge = regHit('HKLM\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\App Paths\\msedge.exe') || regHit('HKCU\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\App Paths\\msedge.exe')
  || [process.env['ProgramFiles(x86)'], process.env.ProgramFiles, process.env.LOCALAPPDATA].filter(Boolean).map(p => path.join(p, 'Microsoft', 'Edge', 'Application', 'msedge.exe')).some(fs.existsSync);
say(edge ? 'OK' : 'NOTE', edge ? 'Microsoft Edge found' : 'Edge not detected by registry/path; the smoke test below is the real check (if it fails, install Edge or set channel "chrome" in render.js)');

r = run(FF, ['-hide_banner', '-loglevel', 'error', '-f', 'lavfi', '-i', 'testsrc2=size=1080x1920:rate=30', '-t', '2', '-c:v', 'h264_nvenc', '-b:v', '1M', '-f', 'null', '-']);
const gpu = r.status === 0, mode = gpu ? 'fast' : 'quality';
say(gpu ? 'OK' : 'WARN', gpu ? 'GPU encoding (NVENC) works -> compress mode: fast' : 'no NVENC -> compress mode: quality (CPU, slower)');
if (!gpu) warn.push('no NVENC: using --mode quality');
const workers = Math.max(2, Math.min(10, os.cpus().length - 2));
fs.writeFileSync(path.join(root, 'config.json'), JSON.stringify({ mode, workers }, null, 2));
say('OK', `workers = ${workers} (${os.cpus().length} logical cores)`);

// ---- smoke test ----
const proj = path.join(root, 'projects', '_smoketest'); if (fs.existsSync(proj)) fs.rmSync(proj, { recursive: true, force: true });
const node = process.execPath, sh = (args, label) => { const x = spawnSync(node, args, { cwd: root, encoding: 'utf8' }); if (x.status !== 0) fatal(label + ' failed:\n' + (x.stderr || x.stdout).split('\n').slice(-12).join('\n')); return x.stdout; };
sh(['new-project.js', '_smoketest'], 'new-project');
r = run(FF, ['-hide_banner', '-loglevel', 'error', '-y', '-f', 'lavfi', '-i', 'sine=frequency=220:sample_rate=44100', '-t', '4', path.join(proj, 'voice.wav')]); if (r.status !== 0) fatal('could not make test audio');
let t = Date.now(); sh(['render.js', proj, '--audio', 'voice.wav', '--draft', '--workers', '4'], 'draft render'); say('OK', `draft render ${((Date.now() - t) / 1000).toFixed(0)}s`);
t = Date.now(); sh(['render.js', proj, '--audio', 'voice.wav', '--workers', '4', '--upload', '30'], 'full render + upload copy'); say('OK', `full render + upload copy ${((Date.now() - t) / 1000).toFixed(0)}s`);
const master = path.join(proj, '_smoketest.mp4'), up = path.join(proj, '_smoketest_upload.mp4');
const info = f => run(FF, ['-hide_banner', '-i', f]).stderr;
const mi = info(master); if (!/Video: h264.*1080x1920/.test(mi)) fatal('master is not h264 1080x1920'); if (!/Audio: aac/.test(mi)) fatal('master has no AAC audio'); if (!/Duration: 00:00:04/.test(mi)) fatal('master duration is not 4 s');
if (!fs.existsSync(up)) fatal('upload copy missing');
const sig = run(FF, ['-hide_banner', '-ss', '2', '-i', master, '-frames:v', '1', '-vf', 'signalstats,metadata=print:key=lavfi.signalstats.YAVG', '-f', 'null', '-']).stderr;
const y = +((/YAVG=([\d.]+)/.exec(sig) || [])[1]); if (!(y > 5)) fatal('test frame is blank (YAVG ' + y + ')');
say('OK', `smoke test verified: master 1080x1920 h264+aac 4 s, frame not blank (YAVG ${y.toFixed(0)}), upload copy exists`);
fs.rmSync(proj, { recursive: true, force: true });

console.log('\nSETUP OK' + (warn.length ? ' (with warnings: ' + warn.join('; ') + ')' : ''));
console.log('Next: node new-project.js <name>, then node render.js projects/<name> --audio voice.wav --upload 30');
