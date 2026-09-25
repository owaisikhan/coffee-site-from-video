# kodexa-builder learnings

This file is how this repo teaches the kodexa-builder skill. Every session
that loads the skill reads it first and appends to it as the user corrects,
reverses or chooses things. Entries promoted into the skill are marked with
the version they landed in. See the skill's `references/self-improvement.md`
for the rules.

- **Project:** Kodexa House (coffee-site-from-video)
- **Type:** 3d-website (scroll-driven frame sequence), marketing-site
- **Who reads it daily:** customers from a social link, mostly on phones
- **Palette exceptions:** none
- **Skill version when started:** 1.3.0

## Summary

| ID | Date | Kind | Lesson (short) | Scope | Status |
|---|---|---|---|---|---|
| L-001 | 2026-09-25 | rule | Always push finished work to `main` | all | ready (also burger-king L-001) |
| L-002 | 2026-09-25 | gap | A site can be built from the owner's own video: frames, stills and a loop all come from one file | type: 3d-website | logged |
| L-003 | 2026-09-25 | gotcha | Portrait footage on desktop: viewfinder panel over a tiny-canvas blur, not a stretched cover | type: 3d-website | logged |
| L-004 | 2026-09-25 | gotcha | GSAP `from()` on an element already at opacity 0 tweens 0 to 0 | all | logged |

## Entries

### L-001 · 2026-09-25 · strong · rule
- **Said / saw:** "always create a main branch and push the code there" (burger-king session, applied again here)
- **Context:** second repo in a row; this one already had `main`
- **Lesson:** Finished work lands on `main`. Experiments still go on their own branches.
- **Scope:** all
- **Target in skill:** SKILL.md section 3, "Working style the user has shown repeatedly"
- **Status:** ready

### L-002 · 2026-09-25 · medium · gap
- **Said / saw:** "for a new idea how would i give those frames to u" then pushed `raw/coffee-shop.mp4` to the repo
- **Context:** first site built from the owner's own footage instead of a clone
- **Lesson:** Ask for one short continuous video committed to `raw/` in the repo (file links through the sandbox proxy are unreliable). Cut 200 desktop and 100 phone WebP frames at quality 80 with `ffmpeg-static` (the Playwright ffmpeg here is a stripped build), pull stills for every other section from the same video, and ship `npm run frames` so a new video is one command. About 18 KB per frame beat the 1 MB frames of the cloned site.
- **Scope:** type: 3d-website
- **Target in skill:** references/types/3d-website.md, new section "Frame sequences from the owner's video"
- **Status:** logged

### L-003 · 2026-09-25 · medium · gotcha
- **Said / saw:** footage is 478x850 portrait; cover-fit on 1440x900 would upscale 3x and crop most of the frame
- **Context:** hero canvas
- **Lesson:** For portrait footage on desktop, draw the frame contained at full height in a panel right of centre and fill the rest with the same frame drawn into a 27x48 offscreen canvas and scaled up (a cheap blur that works in every browser), darkened. Phones keep the full-bleed cover.
- **Scope:** type: 3d-website
- **Target in skill:** references/types/3d-website.md, section 7 "Phones" or a new "Aspect ratio" note
- **Status:** logged

### L-004 · 2026-09-25 · medium · gotcha
- **Said / saw:** the cloned burger site's pinned sear captions 2 and 3 start at inline opacity 0 and use `tl.from({ opacity: 0 })`
- **Context:** porting the pinned caption swap to the brew section
- **Lesson:** `from()` animates from the given value to the element's current value. If the element already sits at opacity 0, it tweens 0 to 0 and never appears. `gsap.set(el, { opacity: 1 })` before building the timeline, or use `fromTo()`.
- **Scope:** all
- **Target in skill:** references/types/3d-website.md, "Gotchas"
- **Status:** logged
