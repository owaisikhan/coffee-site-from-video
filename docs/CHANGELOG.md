# Changelog

## 2026-09-25: the last stop no longer looks paused
- Owner (phone screenshot of the cup stop): "it looks like someone paused in between".
- The cup stop moved from frame 180 (the cup mid-lift, blurred) to frame 168 (the latte resting on the bar during a slow push).
- The scrub now ends at frame 186; the footage goes dark and loops back to the first drop after that, which flashed on the way out.
- The hero canvas has a slow 9s camera drift (scale 1 to 1.06), so a resting stop still breathes. Off under reduced motion.
- Stop frames load first, so a glide always lands on its exact frame rather than a nearby loaded one.
- Steppers also switch on from a plain scroll check, because ScrollTrigger is not active on its exact start pixel (the first swipe after a menu link was being spent on settling).
- Origins has no extra end stop; the swipe after card 6 leaves the section.

## 2026-09-25: slower glide, a real image at every stop
- Owner (phone screenshot of "Double Ristretto" over an orange blur): slower, smoother glide, and a proper image behind the content at each stop.
- Glides now take 1.2 to 2.6s with a sine ease (was 0.7 to 1.8s).
- Hero stops moved onto clear shots: drop (frame 1), bean (73), double pour (132), latte on the bar (180). The old third stop sat on the whip-pan blur and the last on the loop's dark closing frames. Copy blocks follow the stops.
- Brew has one photo per caption (bean, tamp, pour) with crossfades and a lighter, directional overlay; the first caption shows on arrival; stops at each caption; 93°C at the peak stop.
- The HUD's camera spec hides below 380px wide, where it wrapped into the timecode.

## 2026-09-25: fully automatic steps
- Owner: "make it fully automatic even while finger is down".
- Pinned sections now take over scrolling with GSAP Observer (`createStepper()` in `app/_lib/gsap.js`): inside the hero, brew and origins, native scroll is blocked and each swipe or wheel flick starts an automatic glide to the next stop, with the finger still down. One step per touch; a wheel needs a short pause between flicks so trackpad inertia does not double-step. Past the last stop a swipe carries the reader to the next section's top; before the first stop, back above the section.
- Arriving by normal scrolling settles on the edge stop. That settle is checked a frame later, so menu links that jump across the page are not pulled back into a pinned section.
- `stepSnap` stays as a fallback for keyboard and scrollbar scrolling. Both are off under reduced motion.

## 2026-09-25: one swipe, one step
- Owner: slow scrolling on a phone made the video look laggy, a continuous scroll looked smooth; asked for one scroll to play through to the next section.
- The three pinned sections now step-snap (`stepSnap()` in `app/_lib/gsap.js`): any scroll, even a few pixels, glides at an even pace to the next stop in that direction. Hero stops at each copy block (0, 0.36, 0.6, 1), brew at each caption, origins at each card. Scrolling up steps back.
- Normal sections (menu, build, house, story, booking) scroll freely; they are taller than a phone screen and hold forms.
- Off under prefers-reduced-motion.

## 2026-09-25: smoother hero on phones
- Owner reported the phone hero was slow and laggy. Measured on an emulated mid-range phone (4x CPU throttle): normal 4G had 22 frames over 50ms; slow 4G never drew a scrubbed frame (the first loaded frame tried to draw the scroll position, which had not arrived).
- Frames now load coarse to fine (every 16th, then 8th, 4th, 2nd, rest) and the nearest loaded frame is drawn, at most once per screen refresh.
- Progress markers move with transforms instead of left/top; the flash layer lost its blend mode; the canvas no longer reallocates when the phone's address bar slides; phones draw at 1.25x density to match the 478px footage; the timecode only ticks while the hero is on screen.
- Phones get 200 frames (was 100), so the scrub no longer steps every 50px. 3.4 MB in total.
- Result: normal 4G down to 3 frames over 50ms; slow 4G lags well behind scroll 12% of the time instead of 94%.

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
