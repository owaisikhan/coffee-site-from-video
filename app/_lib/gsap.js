"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);
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
