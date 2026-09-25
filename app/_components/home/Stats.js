"use client";

import { useEffect, useRef } from "react";
import { gsap, prefersReducedMotion } from "@/app/_lib/gsap";
import { STATS } from "@/app/_lib/content";

export function Stats() {
  const ref = useRef(null);
  const numbers = useRef([]);

  useEffect(() => {
    if (prefersReducedMotion()) {
      STATS.forEach((s, i) => {
        if (numbers.current[i]) numbers.current[i].textContent = `${s.end}${s.suffix}`;
      });
      return;
    }
    const ctx = gsap.context(() => {
      STATS.forEach((s, i) => {
        const el = numbers.current[i];
        if (!el) return;
        const counter = { val: 0 };
        gsap.to(counter, {
          val: s.end,
          duration: 2.2,
          ease: "power4.out",
          onUpdate: () => {
            el.textContent = `${Math.round(counter.val)}${s.suffix}`;
          },
          scrollTrigger: { trigger: ref.current, start: "top 65%", once: true },
        });
      });
      gsap.from(".stat-card", {
        opacity: 0,
        y: 60,
        stagger: 0.12,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: { trigger: ref.current, start: "top 70%", once: true },
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={ref} className="relative overflow-hidden border-y border-stroke bg-bg">
      <div className="mx-auto max-w-[1400px]">
        <div className="grid grid-cols-2 gap-3 p-3 md:grid-cols-4 md:gap-0 md:p-0">
          {STATS.map((s, i) => (
            <div
              key={s.label}
              className={`stat-card relative flex flex-col justify-between rounded-2xl border border-stroke px-5 py-8 md:rounded-none md:border-0 md:px-10 md:py-20 ${
                i < 3 ? "md:border-r md:border-stroke" : ""
              }`}
            >
              <p className="font-mono text-[10px] tracking-[0.35em] text-muted">0{i + 1}</p>
              <div className="my-6">
                <span
                  ref={(el) => {
                    numbers.current[i] = el;
                  }}
                  className="text-glow-accent font-display text-[clamp(3.5rem,7vw,8rem)] font-semibold leading-none tracking-tighter text-accent"
                >
                  0
                </span>
              </div>
              <div>
                <p className="whitespace-pre-line font-mono text-xs tracking-[0.15em] text-text md:text-sm">{s.label}</p>
                <p className="mt-3 text-xs leading-relaxed text-muted md:text-sm">{s.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
