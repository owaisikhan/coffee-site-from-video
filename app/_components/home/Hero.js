"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger, prefersReducedMotion } from "@/app/_lib/gsap";
import { HERO_BEATS, SHOT_SPECS } from "@/app/_lib/content";

/*
 * Pinned hero: 600% of scroll scrubs the owner's pour video as a WebP frame
 * sequence on a canvas, filling the screen. Phones load 100 portrait frames;
 * desktops load 200 frames cut to the middle 16:9 band of the portrait
 * footage and upscaled to 1920x1080 (see scripts/make-frames.mjs).
 * Every HUD readout and copy block follows the same scroll progress.
 */

/** 1 inside |p - center| <= half, fading linearly to 0 over `fade`. */
const band = (p, center, half, fade = 0.05) => {
  const d = Math.abs(p - center);
  return d <= half ? 1 : d >= half + fade ? 0 : 1 - (d - half) / fade;
};

const beatIndex = (t) => HERO_BEATS.findIndex((b) => t < b.until);

export function Hero() {
  const triggerRef = useRef(null);
  const pinRef = useRef(null);
  const canvasRef = useRef(null);
  const introRef = useRef(null);
  const beanRef = useRef(null);
  const shotRef = useRef(null);
  const cupRef = useRef(null);
  const frameRef = useRef(null);
  const phaseRef = useRef(null);
  const sectionRef = useRef(null);
  const barRef = useRef(null);
  const markerRef = useRef(null);
  const railDotRef = useRef(null);
  const flashRef = useRef(null);
  const tempRef = useRef(null);
  const timecodeRef = useRef(null);
  const [gate, setGate] = useState("scroll");
  const [gateVisible, setGateVisible] = useState(false);
  const frameTotalRef = useRef(null);

  useEffect(() => {
    const isPhone = window.matchMedia("(max-width: 768px)").matches;
    const total = isPhone ? 100 : 200;
    if (frameTotalRef.current) frameTotalRef.current.textContent = ` / ${total}`;
    const dir = isPhone ? "pour-mobile" : "pour";
    const src = (i) => `/frames/${dir}/f_${String(i + 1).padStart(3, "0")}.webp`;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const frames = Array(total).fill(null);
    const loading = new Set();
    let drawn = -1;
    let wanted = -1;
    let anyLoaded = false;

    // Cover-fit on every screen: phones get the portrait frames, desktops a 16:9 crop.
    const paint = (img) => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const s = Math.max(w / img.width, h / img.height);
      const dw = img.width * s;
      const dh = img.height * s;
      ctx.imageSmoothingQuality = "high";
      ctx.clearRect(0, 0, w, h);
      ctx.drawImage(img, (w - dw) / 2, (h - dh) / 2, dw, dh);
    };

    const draw = (i) => {
      if (!frames[i]) return;
      drawn = i;
      paint(frames[i]);
    };

    const load = (i) =>
      fetch(src(i))
        .then((r) => r.blob())
        .then((b) => createImageBitmap(b));

    const show = (i) => {
      wanted = i;
      if (i === drawn) return;
      if (frames[i]) {
        draw(i);
        return;
      }
      if (loading.has(i)) return;
      loading.add(i);
      load(i)
        .then((bmp) => {
          frames[i] = bmp;
          loading.delete(i);
          anyLoaded = true;
          if (wanted === i) draw(i);
        })
        .catch(() => loading.delete(i));
    };

    // Preload in order with a fixed pool of parallel requests.
    const workers = isPhone ? 8 : 16;
    let next = 0;
    const pump = () => {
      const i = next++;
      if (i >= total) return;
      if (frames[i] || loading.has(i)) {
        pump();
        return;
      }
      loading.add(i);
      load(i)
        .then((bmp) => {
          frames[i] = bmp;
          loading.delete(i);
          if (!anyLoaded) {
            anyLoaded = true;
            draw(Math.max(0, wanted));
          }
        })
        .catch(() => loading.delete(i))
        .finally(pump);
    };
    for (let k = 0; k < Math.min(workers, total); k++) pump();

    // A plain <img> of frame 0 paints before the bitmap pipeline is ready.
    const poster = new Image();
    poster.onload = () => {
      if (!anyLoaded) paint(poster);
    };
    poster.src = src(0);

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const current = drawn < 0 ? 0 : drawn;
      drawn = -1;
      show(current);
      if (!anyLoaded && poster.complete && poster.naturalWidth) paint(poster);
    };
    resize();
    window.addEventListener("resize", resize);

    const setOpacity = (el, v) => {
      if (el) el.style.opacity = String(v);
    };

    const gctx = gsap.context(() => {
      if (!prefersReducedMotion()) {
        gsap.from(".hero-stagger", { opacity: 0, y: 34, duration: 1, stagger: 0.12, delay: 0.2, ease: "power3.out" });
      }
      ScrollTrigger.create({
        trigger: triggerRef.current,
        start: "top top",
        end: "+=600%",
        scrub: 0.4,
        pin: pinRef.current,
        anticipatePin: 1,
        onUpdate: (self) => {
          const t = self.progress;
          const i = Math.round(t * (total - 1));
          show(i);
          const beat = beatIndex(i / (total - 1));
          if (frameRef.current) frameRef.current.textContent = String(i).padStart(3, "0");
          if (phaseRef.current) phaseRef.current.textContent = HERO_BEATS[beat].label;
          if (sectionRef.current) sectionRef.current.textContent = String(beat + 1).padStart(2, "0");
          if (barRef.current) barRef.current.style.transform = `scaleX(${t})`;
          if (markerRef.current) markerRef.current.style.left = `${t * 100}%`;
          if (railDotRef.current) railDotRef.current.style.top = `${t * 100}%`;
          // A warm flash as the milk hits the cup.
          if (flashRef.current) flashRef.current.style.opacity = String(band(t, 0.745, 0.006, 0.06) * 0.7);
          if (tempRef.current) tempRef.current.textContent = `${Math.round(Math.min(1, t / 0.62) * 93)}°C`;
          setOpacity(introRef.current, band(t, 0, 0.05, 0.05));
          setOpacity(beanRef.current, band(t, 0.36, 0.04, 0.05));
          setOpacity(shotRef.current, band(t, 0.6, 0.06, 0.06));
          setOpacity(cupRef.current, band(t, 0.95, 0.06, 0.06));
        },
      });
    }, triggerRef);

    return () => {
      window.removeEventListener("resize", resize);
      gctx.revert();
      frames.forEach((f) => f?.close());
    };
  }, []);

  // "SCROLL NOW" gate fades in, then leaves on the first real scroll.
  useEffect(() => {
    if (gate !== "scroll") return;
    const raf = requestAnimationFrame(() => setGateVisible(true));
    let done = false;
    const onScroll = () => {
      if (done || window.scrollY <= 24) return;
      done = true;
      setGateVisible(false);
      window.setTimeout(() => setGate("gone"), 750);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
    };
  }, [gate]);

  // 30fps timecode, matching the footage.
  useEffect(() => {
    let f = 0;
    const id = window.setInterval(() => {
      f = (f + 1) % (30 * 60 * 60 * 24);
      const p = (n) => String(n).padStart(2, "0");
      const ff = f % 30;
      const ss = Math.floor(f / 30) % 60;
      const mm = Math.floor(f / 1800) % 60;
      const hh = Math.floor(f / 108000) % 24;
      if (timecodeRef.current) timecodeRef.current.textContent = `${p(hh)}:${p(mm)}:${p(ss)}:${p(ff)}`;
    }, 1000 / 30);
    return () => window.clearInterval(id);
  }, []);

  const copyBox = "absolute left-6 top-1/2 z-20 max-w-[calc(100%-48px)] -translate-y-1/2 md:left-14";

  return (
    <div ref={triggerRef} id="top">
      <div ref={pinRef} className="relative h-svh w-full overflow-hidden bg-black">
        <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" aria-hidden="true" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black from-0% via-black/40 via-30% to-transparent to-55%" />
        <div className="pointer-events-none absolute inset-0 bg-black/30 md:hidden" />
        <div className="cam-vignette pointer-events-none absolute inset-0 z-[5]" />
        <div className="cam-scanlines pointer-events-none absolute inset-0 z-[5] opacity-60" />
        <div
          ref={flashRef}
          className="pointer-events-none absolute inset-0 z-[6] opacity-0 mix-blend-screen bg-[radial-gradient(circle_at_66%_55%,rgba(245,225,195,0.9),rgba(212,146,74,0.35)_30%,transparent_60%)]"
        />

        <div className="pointer-events-none absolute inset-0 z-10 font-mono text-muted" aria-hidden="true">
          <div className="hud-grid absolute inset-0 opacity-60" />
          <div className="hud-scan absolute inset-x-0 top-0 h-px bg-accent/15" />

          <div className="absolute inset-x-5 top-[68px] flex items-center justify-between border-t border-white/10 pt-2 text-[9px] tracking-[0.25em] text-muted md:inset-x-8">
            <span className="flex items-center gap-2">
              <span className="rec-blink inline-block h-2.5 w-2.5 rounded-full bg-[#ff3b30] shadow-[0_0_10px_#ff3b30]" />
              <span className="text-[#ff6b61]">REC</span>
              <span ref={timecodeRef} className="tabular ml-1 text-text">
                00:00:00:00
              </span>
            </span>
            <span className="hidden md:inline">KODEXA HOUSE // SINGLE SHOT POUR</span>
            <span className="tabular">4K · 30FPS · F1.8 · 1/60</span>
          </div>

          <span className="absolute left-5 top-24 h-9 w-9 border-l-2 border-t-2 border-white/60 md:left-8" />
          <span className="absolute right-5 top-24 h-9 w-9 border-r-2 border-t-2 border-white/60 md:right-8" />
          <span className="absolute bottom-20 left-5 h-9 w-9 border-b-2 border-l-2 border-white/60 md:left-8" />
          <span className="absolute bottom-20 right-5 h-9 w-9 border-b-2 border-r-2 border-white/60 md:right-8" />

          <div className="absolute left-8 top-[28%] hidden h-[44%] w-px bg-white/12 md:block">
            {[0, 0.2, 0.4, 0.6, 0.8, 1].map((p) => (
              <span
                key={p}
                className="absolute left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full border border-white/30 bg-bg"
                style={{ top: `${p * 100}%` }}
              />
            ))}
            <div
              ref={railDotRef}
              className="absolute left-1/2 top-0 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent shadow-[0_0_8px_var(--color-accent)]"
            />
          </div>

          <div className="hud-ticks absolute right-5 top-1/2 hidden h-56 w-3 -translate-y-1/2 opacity-80 md:block" />

          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 md:left-[66%]">
            <div className="relative h-44 w-44 md:h-64 md:w-64">
              <span className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-white/12" />
              <span className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-white/12" />
              <span className="absolute left-1/2 top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full border border-accent/70" />
              <span className="absolute left-0 top-0 h-3 w-3 border-l border-t border-accent/50" />
              <span className="absolute right-0 top-0 h-3 w-3 border-r border-t border-accent/50" />
              <span className="absolute bottom-0 left-0 h-3 w-3 border-b border-l border-accent/50" />
              <span className="absolute bottom-0 right-0 h-3 w-3 border-b border-r border-accent/50" />
            </div>
          </div>

          <div className="absolute right-2.5 top-1/2 hidden -translate-y-1/2 [writing-mode:vertical-rl] text-[9px] tracking-[0.4em] text-muted/70 md:block">
            TAKE No.01 · THE HOUSE POUR
          </div>
          <div className="absolute left-2.5 top-1/2 hidden -translate-y-1/2 rotate-180 [writing-mode:vertical-rl] text-[9px] tracking-[0.4em] text-muted/60 md:block">
            SCROLL TO BREW
          </div>

          <div className="absolute inset-x-5 bottom-6 md:inset-x-8">
            <div className="mb-2.5 flex items-end justify-between text-[9px] tracking-[0.25em] text-muted">
              <span className="flex items-center gap-2 border border-white/15 bg-black/60 px-2.5 py-1">
                <span className="hud-blink inline-block h-1.5 w-1.5 rounded-full bg-accent" />
                <span ref={phaseRef} className="text-text">
                  {HERO_BEATS[0].label}
                </span>
              </span>
              <span className="hidden items-center gap-5 md:flex">
                <span>
                  ISO <span className="tabular text-text">640</span>
                </span>
                <span>
                  WB <span className="tabular text-text">3200K</span>
                </span>
                <span>
                  BEAT{" "}
                  <span ref={sectionRef} className="tabular text-accent">
                    01
                  </span>
                  <span className="text-muted/60"> / 06</span>
                </span>
                <span>
                  FRAME{" "}
                  <span ref={frameRef} className="tabular text-accent">
                    000
                  </span>
                  <span ref={frameTotalRef} className="text-muted/60">
                    {" / 200"}
                  </span>
                </span>
                <span className="border border-white/15 bg-black/40 px-2.5 py-1 text-accent">◢ SCRUB ACTIVE</span>
              </span>
            </div>
            <div className="relative h-8">
              <div className="absolute -top-3 inset-x-0 flex justify-between text-[8px] tracking-[0.2em] text-muted/70">
                {["01", "02", "03", "04", "05", "06"].map((n) => (
                  <span key={n}>{n}</span>
                ))}
              </div>
              <div className="hud-hticks-fine absolute bottom-[18px] h-1.5 w-full opacity-50" />
              <div className="hud-hticks-major absolute bottom-1.5 h-5 w-full opacity-90" />
              <div className="hud-hticks absolute bottom-1.5 h-3 w-full opacity-80" />
              <div className="absolute bottom-1.5 h-px w-full bg-white/35" />
              <div
                ref={barRef}
                className="absolute bottom-[5px] h-[3px] w-full origin-left scale-x-0 rounded-full bg-accent shadow-[0_0_16px_3px_var(--color-accent)]"
              />
              <div
                ref={markerRef}
                className="absolute bottom-px left-0 h-3 w-3 -translate-x-1/2 translate-y-1/2 rotate-45 bg-accent shadow-[0_0_18px_5px_var(--color-accent)]"
              />
            </div>
          </div>
        </div>

        <div className={`${copyBox} md:max-w-xl`}>
          <div ref={introRef}>
            <p className="hero-stagger mb-4 font-mono text-[10px] tracking-[0.35em] text-muted md:mb-6 md:text-[11px]">
              ESPRESSO BAR // ROASTERY
            </p>
            <h1 className="hero-stagger font-display text-5xl font-semibold leading-[0.92] tracking-tight text-text md:text-8xl">
              KODEXA
              <br />
              <span className="text-accent">HOUSE</span>
            </h1>
            <p className="hero-stagger mt-6 font-mono text-xs tracking-[0.3em] text-muted md:text-sm">
              ROASTED · PULLED · POURED
            </p>
          </div>
        </div>

        <div ref={beanRef} className={`${copyBox} opacity-0 md:max-w-md`}>
          <p className="font-mono text-[10px] tracking-[0.3em] text-muted md:text-[11px]">03 // THE BEAN</p>
          <h2 className="mt-2 font-display text-4xl font-semibold leading-none tracking-tight text-text md:mt-3 md:text-6xl">
            IT STARTS
            <br />
            <span className="text-accent">WITH ONE</span>
          </h2>
          <p className="mt-6 max-w-xs text-sm leading-relaxed text-muted">
            Every cup begins as a single roasted seed. We roast small batches each week so the beans reach the grinder at
            their best.
          </p>
        </div>

        <div ref={shotRef} className={`${copyBox} opacity-0 md:max-w-md`}>
          <p className="font-mono text-[10px] tracking-[0.3em] text-muted md:text-[11px]">04 // THE SHOT</p>
          <h2 className="mt-2 font-display text-4xl font-semibold leading-none tracking-tight text-text md:mt-3 md:text-6xl">
            DOUBLE
            <br />
            <span className="text-accent">RISTRETTO</span>
          </h2>
          <p className="mt-4 font-mono text-[10px] tracking-[0.3em] text-muted md:mt-5 md:text-[11px]">BREW TEMP:</p>
          <p ref={tempRef} className="tabular font-display text-5xl font-semibold text-accent md:text-7xl">
            93°C
          </p>
          <div className="mt-5 space-y-1.5">
            {SHOT_SPECS.map(([k, v]) => (
              <div key={k} className="flex justify-between gap-6 border-b border-stroke pb-1 font-mono text-[10px] tracking-wider">
                <span className="text-muted">{k}</span>
                <span className="tabular text-text">{v}</span>
              </div>
            ))}
          </div>
        </div>

        <div ref={cupRef} className={`${copyBox} opacity-0 md:max-w-md`}>
          <p className="font-mono text-[10px] tracking-[0.3em] text-muted md:text-[11px]">06 // THE CUP</p>
          <h2 className="mt-2 font-display text-4xl font-semibold leading-none tracking-tight text-text md:mt-3 md:text-6xl">
            SIT DOWN.
            <br />
            <span className="text-accent">STAY A WHILE.</span>
          </h2>
          <p className="mt-6 max-w-xs text-sm leading-relaxed text-muted">
            Poured at the bar, served in a warm cup, and never rushed. Pick your drink below.
          </p>
          <a
            href="#menu"
            className="mt-6 inline-flex items-center gap-3 rounded-full bg-accent px-6 py-3 font-mono text-xs tracking-[0.2em] text-bg"
          >
            SEE THE MENU <span aria-hidden="true">↓</span>
          </a>
        </div>

        {gate !== "gone" && (
          <div className="pointer-events-none absolute inset-0 z-40">
            <div
              className={`absolute inset-0 flex items-center justify-center transition-all duration-700 ease-out ${
                gateVisible ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
              }`}
            >
              <div className="flex flex-col items-center gap-3 rounded-2xl border border-accent/55 bg-black/70 px-6 py-5 shadow-[0_0_70px_rgba(212,146,74,0.35),inset_0_0_30px_rgba(0,0,0,0.6)] md:px-12 md:py-8">
                <p className="font-display text-2xl font-semibold tracking-[0.2em] text-accent [text-shadow:0_0_28px_rgba(212,146,74,0.9)] md:text-4xl md:tracking-[0.35em]">
                  SCROLL NOW
                </p>
                <p className="font-mono text-xs tracking-[0.35em] text-text">SCROLL DOWN TO BREW</p>
                <span className="gate-bounce text-4xl text-accent" aria-hidden="true">
                  ↓
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
