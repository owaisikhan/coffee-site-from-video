# Changelog

## 2026-09-25: desktop hero fills the screen
- Reversal: the desktop viewfinder panel is gone. The owner saw it on a 2000x920 screen and asked for the footage to fill the screen, as it does on phones.
- Desktop frames are now a 16:9 crop of the portrait footage, upscaled to 1920x1080 with lanczos and a light sharpen (about 34 KB each), and the crop follows the subject through a focus list in `scripts/make-frames.mjs`. A fixed middle crop lost the drop in the opening frames and the grounds later on.
- Phone frames are unchanged.

## 2026-09-25: first build
- One-page site for Kodexa House with the burger-king scroll behaviour, built from the owner's pour video.
- Hero: 200 desktop and 100 phone frames (18 KB each, 5 MB in total) cut from `raw/coffee-shop.mp4`.
- Desktop hero showed the portrait footage in a viewfinder panel over a blurred copy (reversed the same day, see above).
- Orders and bookings go to WhatsApp with a prefilled message. Menu, prices and contact details are placeholders.
- Fixed while building: the brew thermometer's scale sat beside the temperature number instead of the tube.
- Changed from the burger build: captions 2 and 3 in the pinned brew section are set visible before their `from()` tweens, so they actually fade in (in the burger build they tween from 0 to 0).
