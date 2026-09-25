// Turn a video into the hero's scroll frames.
//
//   npm run frames                       (uses raw/coffee-shop.mp4)
//   npm run frames -- raw/new-video.mp4
//
// Writes 200 desktop frames to public/frames/pour and every other one (100)
// to public/frames/pour-mobile, as WebP at quality 80. Plain node, no @/ alias.

import { spawnSync } from "node:child_process";
import { mkdirSync, mkdtempSync, readdirSync, rmSync, copyFileSync } from "node:fs";
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

for (let i = 0; i < DESKTOP; i++) {
  const pick = source[Math.round((i * (source.length - 1)) / (DESKTOP - 1))];
  const name = `f_${String(i + 1).padStart(3, "0")}.webp`;
  run(["-i", join(work, pick), "-c:v", "libwebp", "-quality", "80", "-compression_level", "6", join(outDesk, name)]);
  if (i % 2 === 0) copyFileSync(join(outDesk, name), join(outPhone, `f_${String(i / 2 + 1).padStart(3, "0")}.webp`));
}

rmSync(work, { recursive: true, force: true });
console.log(`Wrote ${DESKTOP} frames to ${outDesk} and ${DESKTOP / 2} to ${outPhone}.`);
