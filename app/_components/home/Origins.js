"use client";

import { useEffect, useRef } from "react";
import { createStepper, gsap, stepSnap } from "@/app/_lib/gsap";
import { ORIGINS } from "@/app/_lib/content";

/* Pinned sideways scroll: the vertical distance equals the track's overflow width. */
export function Origins() {
  const triggerRef = useRef(null);
  const pinRef = useRef(null);
  const trackRef = useRef(null);

  useEffect(() => {
    let stepper;
    const ctx = gsap.context(() => {
      const distance = () => -(trackRef.current.scrollWidth - window.innerWidth);
      // One swipe per card: the progress at which each card reaches the left edge.
      const cardStops = () => {
        const track = trackRef.current;
        const total = Math.abs(distance()) || 1;
        const pad = track.firstElementChild?.offsetLeft ?? 0;
        const stops = [...track.children].map((card) => Math.min(1, (card.offsetLeft - pad) / total));
        return [...new Set([0, ...stops, 1])].sort((a, b) => a - b);
      };
      stepper = createStepper(cardStops);
      gsap.to(trackRef.current, {
        x: distance,
        ease: "none",
        scrollTrigger: {
          trigger: triggerRef.current,
          start: "top top",
          end: () => `+=${Math.abs(distance())}`,
          scrub: 0.6,
          pin: pinRef.current,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          snap: stepSnap(cardStops),
          ...stepper.callbacks,
        },
      });
    }, triggerRef);
    return () => {
      stepper?.kill();
      ctx.revert();
    };
  }, []);

  return (
    <div ref={triggerRef} id="origins">
      <div ref={pinRef} className="relative h-svh overflow-hidden bg-bg">
        <div className="absolute left-6 top-20 z-10 md:left-12">
          <p className="font-mono text-[11px] tracking-[0.3em] text-muted">SOURCING // WHERE THE BEANS GROW</p>
          <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight text-text md:text-5xl">
            <span className="text-accent">{"// 06."}</span> ORIGINS
          </h2>
        </div>
        <div ref={trackRef} data-hscroll className="flex h-full items-center gap-6 pl-6 pr-[40vw] pt-16 md:gap-10 md:pl-12">
          {ORIGINS.map((o) => (
            <article
              key={o.n}
              className="relative flex h-[58vh] w-[80vw] shrink-0 flex-col justify-end overflow-hidden rounded-3xl border border-stroke md:w-[36vw]"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={o.img} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
              <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_20%,rgba(10,7,5,0.94)_72%)]" />
              <div className="relative z-10 p-7 md:p-8">
                <span className="absolute right-6 top-0 -translate-y-full font-display text-6xl font-semibold text-white/15">{o.n}</span>
                <p className="font-mono text-[10px] tracking-[0.3em] text-accent">
                  {o.region} · {o.tag}
                </p>
                <h3 className="mt-2 font-display text-3xl font-semibold tracking-wide text-text md:text-4xl">{o.name}</h3>
                <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted">{o.spec}</p>
                <div className="mt-5 h-px w-full bg-stroke" />
              </div>
            </article>
          ))}
        </div>
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap font-mono text-[10px] tracking-[0.3em] text-muted">
          SCROLL TO TRAVEL <span aria-hidden="true">→</span>
        </div>
      </div>
    </div>
  );
}
