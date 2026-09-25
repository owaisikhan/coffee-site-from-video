"use client";

import { useEffect, useRef } from "react";
import { gsap, stepSnap } from "@/app/_lib/gsap";
import { BREW_STAGES } from "@/app/_lib/content";

/*
 * Pinned for 280% of the viewport: one scrubbed timeline raises the
 * thermometer from 20 to 93°C, warms its colour from crema to deep amber,
 * crossfades the resting bean into the pour, and swaps three captions.
 */
export function Brew() {
  const triggerRef = useRef(null);
  const pinRef = useRef(null);
  const tempRef = useRef(null);
  const fillRef = useRef(null);
  const glowRef = useRef(null);
  const beanRef = useRef(null);
  const pourRef = useRef(null);
  const stages = useRef([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const state = { t: 0 };
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: triggerRef.current,
          start: "top top",
          end: "+=280%",
          scrub: 1.2,
          pin: pinRef.current,
          anticipatePin: 1,
          // One swipe per caption: resting, bloom, peak.
          snap: stepSnap([0, 0.2, 0.52, 0.88, 1]),
        },
        defaults: { ease: "none" },
      });
      tl.to(
        state,
        {
          t: 1,
          duration: 1,
          onUpdate: () => {
            const t = state.t;
            if (tempRef.current) tempRef.current.textContent = String(Math.round(20 + 73 * t));
            if (fillRef.current) {
              const r = Math.round(212 + 20 * t);
              const g = Math.round(146 - 60 * t);
              const b = Math.round(74 - 50 * t);
              fillRef.current.style.height = `${t * 100}%`;
              fillRef.current.style.backgroundColor = `rgb(${r},${g},${b})`;
              fillRef.current.style.boxShadow = `0 0 ${20 + t * 60}px rgba(${r},${g},${b},${0.3 + t * 0.5})`;
            }
            if (glowRef.current) glowRef.current.style.opacity = String(t * 0.8);
            if (beanRef.current) beanRef.current.style.opacity = String(Math.max(0, 0.55 * (1 - t * 1.6)));
            if (pourRef.current) pourRef.current.style.opacity = String(Math.min(0.6, Math.max(0, ((t - 0.25) / 0.75) * 0.6)));
          },
        },
        0,
      );
      // Stages 2 and 3 are set to fully visible first, so the "from" tweens animate from 0 up to 1.
      gsap.set([stages.current[1], stages.current[2]], { opacity: 1 });
      tl.from(stages.current[0], { opacity: 0, y: 30, duration: 0.12, ease: "power2.out" }, 0)
        .to(stages.current[0], { opacity: 0, y: -30, duration: 0.12, ease: "power2.in" }, 0.3)
        .from(stages.current[1], { opacity: 0, y: 30, duration: 0.15, ease: "power2.out" }, 0.35)
        .to(stages.current[1], { opacity: 0, y: -30, duration: 0.12, ease: "power2.in" }, 0.62)
        .from(stages.current[2], { opacity: 0, y: 30, duration: 0.15, ease: "power2.out" }, 0.68);
    }, triggerRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={triggerRef} id="brew" className="scroll-mt-0">
      <div ref={pinRef} className="relative flex h-svh w-full items-center overflow-hidden bg-bg">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img ref={beanRef} src="/stills/bean.webp" alt="" aria-hidden="true" loading="lazy" className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-55" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img ref={pourRef} src="/stills/pour.webp" alt="" aria-hidden="true" loading="lazy" className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-0" />
        <div className="pointer-events-none absolute inset-0 bg-bg/70" />
        <div
          ref={glowRef}
          className="pointer-events-none absolute inset-0 opacity-0 bg-[radial-gradient(ellipse_70%_60%_at_70%_80%,rgba(232,120,40,0.3)_0%,transparent_70%)]"
        />
        <div className="absolute left-6 top-20 md:left-12 md:top-24">
          <p className="font-mono text-[11px] tracking-[0.3em] text-muted">PROCESS // FROM BEAN TO SHOT</p>
          <h2 className="mt-1 font-display text-3xl font-semibold tracking-tight text-text md:text-5xl">
            <span className="text-accent">{"// 04."}</span> THE BREW
          </h2>
        </div>
        <div className="relative ml-6 max-w-[62%] md:ml-12 md:max-w-xl">
          {BREW_STAGES.map((s, i) => (
            <div
              key={s.tempLabel}
              ref={(el) => {
                stages.current[i] = el;
              }}
              className={`absolute left-0 top-1/2 -translate-y-1/2 ${i === 0 ? "opacity-100" : "opacity-0"}`}
            >
              <p className="font-mono text-[10px] tracking-[0.35em] text-accent">{s.tempLabel}</p>
              <h3 className="mt-3 whitespace-pre-line font-display text-[clamp(2.4rem,5.5vw,6.5rem)] font-semibold leading-none tracking-tight text-text">
                {s.title}
              </h3>
              <p className="mt-6 max-w-sm text-sm leading-relaxed text-muted md:text-base">{s.body}</p>
            </div>
          ))}
          <div className="h-[clamp(260px,35vw,420px)]" />
        </div>
        <div className="absolute right-6 flex h-[70vh] flex-col items-center gap-6 md:right-16">
          <div className="text-center">
            <span ref={tempRef} className="text-glow-accent font-display text-[clamp(3.5rem,9vw,10rem)] font-semibold leading-none tracking-tighter text-accent">
              20
            </span>
            <p className="font-mono text-xs tracking-[0.3em] text-muted">°C</p>
          </div>
          <div className="relative h-[45vh]">
            <div className="flex h-full w-5 flex-col justify-end overflow-hidden rounded-full border border-stroke bg-surface">
              <div ref={fillRef} className="h-0 w-full rounded-full bg-accent" />
            </div>
            <div className="absolute right-8 top-0 flex h-full flex-col justify-between" aria-hidden="true">
              {[93, 75, 57, 38, 20].map((v) => (
                <span key={v} className="-my-1.5 font-mono text-[9px] leading-3 tracking-widest text-muted">
                  {v}°
                </span>
              ))}
            </div>
          </div>
        </div>
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap font-mono text-[10px] tracking-[0.3em] text-muted">
          SCROLL TO RAISE THE HEAT
        </div>
      </div>
    </div>
  );
}
