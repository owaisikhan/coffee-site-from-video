// Turn a video into the hero's scroll frames.
//
//   npm run frames                       (uses raw/coffee-shop.mp4)
//   npm run frames -- raw/new-video.mp4
//
// Writes 200 desktop frames to public/frames/pour and 200 phone frames to
// public/frames/pour-mobile, as WebP. Plain node, no @/ alias.
//
// The footage is portrait. Phones get the full frame. Desktops get the middle
// 16:9 band, upscaled to 1920x1080 with lanczos and a light sharpen, so it can
// fill a wide screen without the browser stretching a 478px frame itself.
// The band follows the subject using FOCUS below.

import { spawnSync } from "node:child_process";
import { mkdirSync, mkdtempSync, readdirSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import ffmpeg from "ffmpeg-static";

const input = process.argv[2] || "raw/coffee-shop.mp4";
const DESKTOP = 200;
const outDesk = "public/frames/pour";
const outPhone = "public/frames/pour-mobile";

const run = (args) => {
  const r = spawnSync(ffmpeg, ["-hide_banner", "-loglevel", "error", "-y", ...args], { stdio: "inherit" });
  if (r.status !== 0) process.exit(r.status ?? 1);
};

const work = mkdtempSync(join(tmpdir(), "frames-"));
console.log(`Reading ${input}`);
run(["-i", input, "-vsync", "0", join(work, "s_%04d.png")]);
const source = readdirSync(work).filter((f) => f.endsWith(".png")).sort();
if (source.length < DESKTOP) console.warn(`Only ${source.length} source frames; some will repeat.`);

for (const dir of [outDesk, outPhone]) {
  rmSync(dir, { recursive: true, force: true });
  mkdirSync(dir, { recursive: true });
}

// Where the subject sits in raw/coffee-shop.mp4, as [source frame, height from
// the top (0 to 1)]. Read off a grid of every 15th frame. Between keyframes the
// crop pans smoothly. For a different video, update this list (or use [[1, 0.5]]).
const FOCUS = [
  [1, 0.3], [16, 0.42], [31, 0.45], [46, 0.47], [61, 0.38], [76, 0.47], [91, 0.5],
  [136, 0.5], [181, 0.47], [196, 0.45], [211, 0.65], [226, 0.62], [241, 0.6],
  [256, 0.5], [271, 0.55], [286, 0.56], [301, 0.68], [316, 0.62], [331, 0.48],
  [346, 0.5], [361, 0.55], [376, 0.55], [391, 0.5], [427, 0.5],
];

const focusAt = (frame) => {
  if (frame <= FOCUS[0][0]) return FOCUS[0][1];
  for (let k = 1; k < FOCUS.length; k++) {
    const [f1, y1] = FOCUS[k];
    const [f0, y0] = FOCUS[k - 1];
    if (frame <= f1) return y0 + ((y1 - y0) * (frame - f0)) / (f1 - f0);
  }
  return FOCUS[FOCUS.length - 1][1];
};

// PNG stores width and height at bytes 16-23.
const size = (file) => {
  const b = readFileSync(file);
  return { w: b.readUInt32BE(16), h: b.readUInt32BE(20) };
};

const wide = (file, frame) => {
  const { w, h } = size(file);
  const band = Math.round((w * 9) / 16);
  const y = Math.round(Math.min(h - band, Math.max(0, focusAt(frame) * h - band / 2)));
  return `crop=${w}:${band}:0:${y},scale=1920:1080:flags=lanczos,unsharp=5:5:0.7`;
};
const webp = ["-c:v", "libwebp", "-quality", "80", "-compression_level", "6"];

for (let i = 0; i < DESKTOP; i++) {
  const index = Math.round((i * (source.length - 1)) / (DESKTOP - 1));
  const pick = source[index];
  const name = `f_${String(i + 1).padStart(3, "0")}.webp`;
  run(["-i", join(work, pick), "-vf", wide(join(work, pick), index + 1), ...webp, join(outDesk, name)]);
  run(["-i", join(work, pick), ...webp, join(outPhone, name)]);
}

rmSync(work, { recursive: true, force: true });
console.log(`Wrote ${DESKTOP} frames to ${outDesk} and ${DESKTOP} to ${outPhone}.`);
