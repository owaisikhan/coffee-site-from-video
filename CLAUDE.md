# Kodexa House (coffee-site-from-video)

Built with the kodexa-builder skill (v1.3.0). Load it for any new feature or
design work, and log preferences, corrections and reversals to
`.claude/kodexa-learnings.md` as they happen.

## What it is
A one-page site for Kodexa House, an espresso bar and roastery. It reuses the
scroll behaviour of the owner's SMASH burger build (burger-king repo): a pinned
hero that scrubs a frame sequence, a build-your-cup panel, a pinned brew
thermometer, a pinned sideways origins strip, and a booking form.

## Rules for this repo
- Push finished work to `main` (the owner's standing rule).
- The hero footage is the owner's own video, `raw/coffee-shop.mp4` (portrait, 478x850, 30fps, 14.3s).
  Regenerate frames with `npm run frames` (or `npm run frames -- raw/other.mp4`).
- Menu items, prices, origins, WhatsApp number, hours and address are PLACEHOLDERS.
  They live in `app/_lib/content.js` and `app/_lib/siteConfig.js` and nowhere else.
- Hero performance: frames load coarse to fine and the nearest loaded frame is drawn once per refresh. Keep per-scroll work to transforms, opacity and textContent; no left/top, no blend modes in the pinned hero.
- Leads go to WhatsApp (`whatsappLink()` in siteConfig). There is no backend and no database.
- Palette exceptions: none. The warm dark theme is chosen from the footage (shot on black with amber light), not a reflex.
- No em or en dashes anywhere, including copy, comments and docs.

## Stack and layout
Next.js 16 App Router, plain JavaScript, Tailwind v4 (`app/_styles/globals.css`), GSAP 3.15 with
ScrollTrigger and ScrollToPlugin registered once in `app/_lib/gsap.js`. House layout: `app/_components/<area>/`,
`app/_lib/`, no `src/`. No Lenis, on purpose: the scroll feel matches the burger site, which used native scroll.

## Commands
- `npm run dev`, `npm run build`, `npm start`
- `npx eslint .`
- `npm run check` (Playwright; start `npm run build && npm start` first, pass `-- --base http://localhost:3000`)
