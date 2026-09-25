"use client";

import { useEffect, useRef } from "react";
import { gsap, prefersReducedMotion } from "@/app/_lib/gsap";
import { HOUSE_FACTS } from "@/app/_lib/content";

export function House() {
  const ref = useRef(null);
  const mediaRef = useRef(null);
  const videoRef = useRef(null);
  const copyRef = useRef(null);
  const factsRef = useRef(null);

  useEffect(() => {
    const reduced = prefersReducedMotion();
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: ref.current,
          start: "top 80%",
          once: true,
          onEnter: () => {
            if (!reduced) videoRef.current?.play().catch(() => {});
          },
        },
        defaults: { ease: "power3.out" },
      });
      if (reduced) return;
      tl.from(mediaRef.current, { opacity: 0, x: 60, duration: 1.1 })
        .from(copyRef.current.children, { opacity: 0, y: 40, stagger: 0.12, duration: 0.85 }, "-=0.7")
        .from(factsRef.current.children, { opacity: 0, y: 20, stagger: 0.07, duration: 0.6 }, "-=0.5");
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={ref} id="house" className="relative scroll-mt-16 overflow-hidden bg-bg px-6 py-24 md:px-12 md:py-32">
      <div className="mx-auto grid max-w-[1300px] items-center gap-16 md:grid-cols-[1.1fr_0.9fr]">
        <div ref={copyRef}>
          <p className="font-mono text-[11px] tracking-[0.35em] text-muted">03 // THE HOUSE</p>
          <h2 className="mt-4 font-display text-5xl font-semibold leading-none tracking-tight text-text md:text-7xl lg:text-8xl">
            SLOW
            <br />
            <span className="text-accent">COFFEE</span>
          </h2>
          <p className="mt-6 max-w-md text-base leading-relaxed text-muted">
            Kodexa House is a small espresso bar with a roaster in the back. Beans are weighed, ground and pulled for each cup,
            milk is steamed to order, and nobody will hurry you out of your seat.
          </p>
          <div className="mt-10 h-px w-full bg-stroke" />
          <div ref={factsRef} className="mt-8 grid grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-3">
            {HOUSE_FACTS.map((f) => (
              <div key={f.label}>
                <p className="font-mono text-[10px] tracking-[0.3em] text-muted">{f.label}</p>
                <p className="mt-1 font-display text-lg font-semibold tracking-wide text-text">{f.value}</p>
              </div>
            ))}
          </div>
          <a
            href="#visit"
            className="mt-10 inline-flex min-h-11 items-center gap-3 rounded-full border border-stroke bg-surface px-7 py-3 font-mono text-xs tracking-[0.25em] text-text transition-all hover:border-accent hover:text-accent"
          >
            BOOK A TABLE <span className="text-accent" aria-hidden="true">→</span>
          </a>
        </div>
        <div ref={mediaRef} className="flex justify-center">
          <div className="relative w-full max-w-[420px]">
            <span className="absolute -left-2 -top-2 z-20 h-9 w-9 border-l-2 border-t-2 border-accent" />
            <span className="absolute -right-2 -top-2 z-20 h-9 w-9 border-r-2 border-t-2 border-accent" />
            <span className="absolute -bottom-2 -left-2 z-20 h-9 w-9 border-b-2 border-l-2 border-accent" />
            <span className="absolute -bottom-2 -right-2 z-20 h-9 w-9 border-b-2 border-r-2 border-accent" />
            <div className="relative aspect-[478/850] w-full overflow-hidden rounded-2xl border border-stroke bg-surface">
              <video
                ref={videoRef}
                src="/video/house-loop.mp4"
                poster="/stills/pour.webp"
                preload="none"
                muted
                loop
                playsInline
                aria-label="Espresso pouring, then milk poured into a latte"
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-bg/80 via-transparent to-transparent" />
              <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-center">
                <p className="font-mono text-[10px] tracking-[0.35em] text-accent">POURING NOW</p>
                <p className="mt-1 font-display text-2xl font-semibold text-text">93°C</p>
              </div>
            </div>
            <div className="absolute -bottom-5 left-1/2 z-20 -translate-x-1/2 whitespace-nowrap rounded-full border border-stroke bg-surface px-5 py-2">
              <span className="font-mono text-[10px] tracking-[0.25em] text-accent">ROASTED IN HOUSE · EVERY WEEK</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
