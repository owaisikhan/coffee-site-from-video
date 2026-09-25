"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { Observer } from "gsap/Observer";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, ScrollToPlugin, Observer);
}

export { gsap, ScrollTrigger };

/** Entrance reveals are skipped under reduced motion; content stays visible. */
export const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/*
 * One swipe, one step: after any scroll inside a pinned section, glide to the
 * next stop in the direction of travel at an even speed, so scrubbed media
 * plays in one continuous motion instead of following a slow thumb.
 * `stops` is an array of progress values (0 to 1) or a function returning one;
 * include 0 and 1 so the reader can always leave the section.
 * Off under reduced motion.
 */
export function stepSnap(stops) {
  if (prefersReducedMotion()) return undefined;
  const list = () => (typeof stops === "function" ? stops() : stops);
  return {
    snapTo: (value, self) => {
      const points = list();
      const dir = self?.direction ?? 1;
      // Already resting on a stop (page load, refresh): stay there.
      const here = points.find((p) => Math.abs(p - value) < 0.002);
      if (here !== undefined) return here;
      // Otherwise even a few pixels of scroll counts: go on to the next stop that way.
      if (dir > 0) return points.find((p) => p >= value) ?? 1;
      return [...points].reverse().find((p) => p <= value) ?? 0;
    },
    duration: { min: 0.7, max: 1.6 },
    delay: 0.06,
    ease: "power1.inOut",
    inertia: false,
  };
}

/*
 * Full takeover for a pinned section. While the section is on screen, native
 * scrolling is blocked; each swipe (or one wheel flick) plays an automatic,
 * even glide to the next stop, even with the finger still down. Past the last
 * stop the next swipe carries the reader to the start of the following
 * section, and before the first stop back to the previous one.
 *
 * Spread `stepper.callbacks` into the section's ScrollTrigger config; call
 * `stepper.kill()` on cleanup. Pair it with `snap: stepSnap(stops)` so keyboard
 * and scrollbar scrolling still land on a stop. Off under reduced motion.
 */
export function createStepper(stops) {
  const list = () => (typeof stops === "function" ? stops() : stops);
  let st = null;
  let animating = false;
  let lastInput = 0;
  let usedThisTouch = false;

  const glide = (y, duration, onDone) => {
    animating = true;
    gsap.to(window, {
      scrollTo: { y, autoKill: false },
      duration,
      ease: "power1.inOut",
      overwrite: true,
      onComplete: () => {
        animating = false;
        onDone?.();
      },
    });
  };

  const yAt = (p) => st.start + p * (st.end - st.start);

  const step = (dir) => {
    const p = st.progress;
    const points = list();
    const target = dir > 0 ? points.find((x) => x > p + 0.002) : [...points].reverse().find((x) => x < p - 0.002);
    if (target === undefined) {
      // Leave the section: forward to the next section's top, or back above the pin.
      if (dir < 0 && st.start <= 1) return;
      observer.disable();
      const y = dir > 0 ? st.end + window.innerHeight : Math.max(0, st.start - window.innerHeight);
      glide(y, 1);
      return;
    }
    glide(yAt(target), gsap.utils.clamp(0.7, 1.8, Math.abs(target - p) * 3.4));
  };

  const observer = Observer.create({
    target: window,
    type: "wheel,touch",
    tolerance: 6,
    preventDefault: true,
    onPress: () => {
      usedThisTouch = false;
    },
    onChangeY: (self) => {
      const now = performance.now();
      const isWheel = self.event.type === "wheel";
      const gap = now - lastInput;
      lastInput = now;
      if (animating || !st) return;
      // One step per touch gesture; for wheels, a new flick needs a short pause,
      // so trackpad inertia after a step does not trigger another one.
      if (isWheel ? gap < 180 : usedThisTouch) return;
      // Wheel: positive delta scrolls down. Touch: a finger moving up scrolls down.
      const dir = isWheel ? Math.sign(self.deltaY) : -Math.sign(self.deltaY);
      if (!dir) return;
      if (!isWheel) usedThisTouch = true;
      step(dir);
    },
  });
  observer.disable();

  const inside = (self) => {
    const y = window.scrollY;
    return y >= self.start - 2 && y <= self.end + 2;
  };

  const callbacks = prefersReducedMotion()
    ? {}
    : {
        onRefresh: (self) => {
          st = self;
          if (inside(self)) observer.enable();
        },
        onToggle: (self) => {
          st = self;
          if (self.isActive) observer.enable();
          else if (!inside(self)) observer.disable();
        },
        // Arriving with native momentum: settle on the edge stop. Checked a
        // frame later, because a jump (a menu link) passes through the section
        // and must not be pulled back into it.
        onEnter: (self) => {
          st = self;
          requestAnimationFrame(() => {
            if (self.isActive && !animating) glide(self.start, 0.5);
          });
        },
        onEnterBack: (self) => {
          st = self;
          requestAnimationFrame(() => {
            if (self.isActive && !animating) glide(self.end, 0.5);
          });
        },
      };

  return {
    callbacks,
    kill: () => observer.kill(),
  };
}
