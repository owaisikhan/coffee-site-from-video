# Kodexa House

Espresso bar and roastery site. Scroll through the hero and the owner's pour video plays frame by frame, from
the first drop to the finished latte.

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
```

## Change things

| To change | Edit |
|---|---|
| Menu, prices, add-ons, origins, story, all copy | `app/_lib/content.js` |
| Name, WhatsApp number, currency, hours, address | `app/_lib/siteConfig.js` |
| Colours and fonts | `app/_styles/globals.css` and `app/layout.js` |
| Hero video | put the new file in `raw/`, run `npm run frames -- raw/your-video.mp4` |

Items marked PLACEHOLDER in those files are waiting on real details.

## Check it

```bash
npm run build && npm start          # terminal 1
npm run check                       # terminal 2: overflow at 320-414px, order and booking flows
```

## How the hero works

`app/_components/home/Hero.js` pins the first screen for six screen-heights of scrolling. Scroll progress picks one of
200 WebP frames from `public/frames/`, which is drawn on a canvas and fills the screen. The footage
is portrait: phones get the full frames, desktops get a 16:9 crop upscaled to 1920x1080 that follows the subject
(the `FOCUS` list in `scripts/make-frames.mjs`). The camera overlay (timecode, beat, frame counter, brew temperature, progress bar) and the four copy blocks all read
the same progress value.
