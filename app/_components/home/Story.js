"use client";

import { useEffect, useRef } from "react";
import { gsap, prefersReducedMotion } from "@/app/_lib/gsap";
import { STORY } from "@/app/_lib/content";

export function Story() {
  const ref = useRef(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.from(".story-head", {
        opacity: 0,
        y: 30,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: { trigger: ref.current, start: "top 85%", once: true },
      });
      gsap.from(".story-card", {
        opacity: 0,
        y: 50,
        stagger: 0.12,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: { trigger: ".story-grid", start: "top 85%", once: true },
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={ref} id="story" className="relative scroll-mt-16 overflow-hidden bg-bg px-6 py-28 md:px-12">
      <div className="mx-auto max-w-[1300px]">
        <div className="story-head mb-14 border-b border-stroke pb-12 text-center">
          <p className="font-mono text-[11px] tracking-[0.4em] text-muted">ORIGIN // A THOUSAND YEARS OF COFFEE</p>
          <h2 className="mt-4 font-display text-5xl font-semibold leading-none tracking-tight text-text md:text-8xl">
            <span className="text-accent">{"// 07."}</span> THE STORY
          </h2>
          <p className="mt-4 font-mono text-[clamp(0.95rem,2vw,1.4rem)] tracking-[0.25em] text-muted">
            FROM A HILLSIDE TO YOUR TABLE
          </p>
          <p className="mx-auto mt-6 max-w-[52ch] text-base leading-relaxed text-muted">
            Coffee took centuries to travel from wild shrubs in Ethiopia to the espresso bar. Kodexa House is our small chapter
            in that story.
          </p>
        </div>
        <div className="story-grid grid gap-5 md:grid-cols-2">
          {STORY.map((c) => (
            <article
              key={c.era}
              className="story-card group relative flex flex-col overflow-hidden rounded-2xl border border-stroke bg-surface transition-all duration-300 hover:-translate-y-1 hover:border-accent/50"
            >
              <div className="relative h-64 overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={c.img} alt="" loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.05]" />
                <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_top,var(--color-surface)_1%,rgba(23,17,13,0.15)_50%,transparent_100%)]" />
                <span className="absolute left-4 top-4 rounded-full border border-accent/30 bg-bg/70 px-3 py-1 font-mono text-[9px] tracking-[0.25em] text-accent">
                  {c.era}
                </span>
              </div>
              <div className="flex flex-1 flex-col p-7">
                <h3 className="font-display text-xl font-semibold leading-tight tracking-tight text-text md:text-2xl">{c.title}</h3>
                <p className="mt-4 flex-1 text-sm leading-relaxed text-muted">{c.desc}</p>
              </div>
              <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-accent transition-all duration-500 group-hover:w-full" />
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
