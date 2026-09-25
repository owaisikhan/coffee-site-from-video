# UI conventions

## Tokens (`app/_styles/globals.css`)
| Token | Value | Use |
|---|---|---|
| bg | `#0e0a08` | page |
| surface | `#17110d` | cards, alternating sections |
| text | `#f3e9dc` | headings and body on dark |
| muted | `#9a8a7a` | secondary text, labels (5.6:1 on bg) |
| placeholder | `#6b5d51` | input placeholders only |
| stroke | `#2a211b` | hairlines and card borders |
| accent | `#d4924a` | crema amber: prices, section numbers, primary buttons |

## Type
- Bricolage Grotesque 600 for headings, uppercase, tight tracking.
- DM Sans for body text.
- JetBrains Mono for labels, the camera overlay, prices in lists and buttons, with wide tracking.

## Patterns
- Section heads: mono label (`THE MENU // PICK YOUR CUP`), then the heading with the number in accent (`// 01.`).
- Primary actions are solid accent with bg-coloured text; WhatsApp actions carry `ui/WhatsAppIcon.js`.
- Touch targets are at least 44px (`min-h-11`, `h-11 w-11`).
- Entrance reveals are skipped under `prefers-reduced-motion`; scroll-scrubbed pins still work because the user drives them.
- Images are stills from the owner's video in `public/stills/`; no stock photos.

## Motion
| Section | Trigger | Behaviour |
|---|---|---|
| Hero | pin, `+=600%`, scrub 0.4 | frame scrub, HUD readouts, four copy blocks by band, flash as the milk lands |
| Menu | `top 75%` / `top 80%` | head and cards rise in; ADD TO ORDER flies the photo into the build preview |
| Build | click | size letter bursts from the preview; add-ons fly into the total, which flashes |
| House | `top 80%` | video starts, media slides in, copy and facts stagger |
| Stats | `top 65%` | counters run 0 to N over 2.2s |
| Brew | pin, `+=280%`, scrub 1.2 | thermometer 20 to 93°C, bean still fades into the pour, three captions |
| Origins | pin, distance = track overflow, scrub 0.6 | cards travel sideways |
| Story, Visit | `top 85%` | head and cards rise in |
