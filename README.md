# Motion Toolkit (local rendering + upload copy)

Everything runs on this PC (Edge + NVENC on the GTX 1060). Nothing here modifies an existing video.

## New video (vertical 9:16, same engine as the Reel)
1. `node new-project.js my-video`            -> projects/my-video/ (engine, fonts, demo scene)
2. Put the voiceover in that folder (e.g. voice.wav). Edit scenes.js and timeline.js
   (set DURATION to the voiceover length; scene start/end seconds from the word timestamps).
3. `node render.js projects/my-video --audio voice.wav --draft`   quick 540p/15fps preview, minutes not an hour
4. `node render.js projects/my-video --audio voice.wav --upload 30`
   -> my-video.mp4 (full-quality master, untouched) + my-video_upload.mp4 (<= 30 MB, native resolution)

## Only need a small copy of an existing video
`node compress.js "C:\path\video.mp4" --mb 30`      (fast, GPU, ~80 s per 5 min)
`node compress.js video.mp4 --mb 30 --mode quality` (CPU two-pass, slower)
`--width 720` only if you want a smaller frame. The original is never overwritten.

## Measured on the Reel (1009 MB, 5:03, 1080x1920)
- Reel render (10 workers): ~9-10 min.   - 30 MB copy (GPU): 76 s -> 25.3 MB at native 1080x1920.
- Re-compress loop: accepts a result >= 80% of the cap, otherwise retunes the bitrate (max 4 tries).

## Notes
- Film grain makes files huge and hard to compress: the template has no grain; compress.js denoises (hqdn3d).
- Files already under the cap are copied as is.
- core.js is vertical-first (W=1080, H=1920). Landscape needs layout changes in the scenes.
- Word timestamps from the voiceover still come from the cloud step (faster-whisper) -- not moved here yet.

## Setup on a new Windows PC
```
git clone <this repo> "Motion Toolkit"
cd "Motion Toolkit"
npm install --no-audit --no-fund
npm install ffmpeg-static --no-audit --no-fund
mkdir bin; copy node_modules\ffmpeg-static\ffmpeg.exe bin\ffmpeg.exe
```
Requires Node.js and Microsoft Edge. GPU compression uses NVIDIA NVENC; without it use `--mode quality`.
Tested on Windows with Node 24, Edge, GTX 1060. Fonts: see FONTS-NOTICE.md.
