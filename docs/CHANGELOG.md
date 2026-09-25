# Changelog

## 2026-09-25: first build
- One-page site for Kodexa House with the burger-king scroll behaviour, built from the owner's pour video.
- Hero: 200 desktop and 100 phone frames (18 KB each, 5 MB in total) cut from `raw/coffee-shop.mp4`.
- Desktop hero shows the portrait footage in a viewfinder panel over a blurred copy, since stretching 478px wide footage to a desktop screen looked soft.
- Orders and bookings go to WhatsApp with a prefilled message. Menu, prices and contact details are placeholders.
- Fixed while building: the brew thermometer's scale sat beside the temperature number instead of the tube.
- Changed from the burger build: captions 2 and 3 in the pinned brew section are set visible before their `from()` tweens, so they actually fade in (in the burger build they tween from 0 to 0).
