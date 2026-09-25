"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/app/_lib/gsap";
import { ADD_ONS, BASE_PRICE, SELECT_DRINK_EVENT, SIZES } from "@/app/_lib/content";
import { price, siteConfig, whatsappLink } from "@/app/_lib/siteConfig";
import { WhatsAppIcon } from "@/app/_components/ui/WhatsAppIcon";

const addOnPrice = (p) => (p === 0 ? "FREE" : `+${price(p)}`);

export function Build() {
  const [size, setSize] = useState("s");
  const [addOns, setAddOns] = useState(new Set());
  const [drink, setDrink] = useState(null);
  const totalRef = useRef(null);
  const previewRef = useRef(null);
  const previewImgRef = useRef(null);
  const captionRef = useRef(null);

  // A drink handed over from the menu.
  useEffect(() => {
    const onSelect = (e) => {
      setDrink(e.detail);
      if (previewImgRef.current)
        gsap.fromTo(previewImgRef.current, { opacity: 0, scale: 1.08 }, { opacity: 1, scale: 1, duration: 0.7, ease: "power2.out" });
      if (captionRef.current)
        gsap.fromTo(captionRef.current, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.5, ease: "power2.out", delay: 0.15 });
      if (totalRef.current)
        gsap.fromTo(
          totalRef.current,
          { scale: 1.4, color: "#ffd9a8", textShadow: "0 0 50px rgba(255,200,130,1)" },
          { scale: 1, color: "#d4924a", textShadow: "none", duration: 0.6, ease: "power2.out", delay: 0.2 },
        );
    };
    window.addEventListener(SELECT_DRINK_EVENT, onSelect);
    return () => window.removeEventListener(SELECT_DRINK_EVENT, onSelect);
  }, []);

  const current = SIZES.find((s) => s.id === size);
  const addOnTotal = [...addOns].reduce((sum, id) => sum + (ADD_ONS.find((a) => a.id === id)?.price ?? 0), 0);
  const base = drink ? drink.price : BASE_PRICE;
  const total = base + current.extra + addOnTotal;

  const orderMessage = [
    `Hi ${siteConfig.name}, I'd like to order:`,
    `${drink ? drink.name : "A custom cup"} (${current.name}, ${current.desc})`,
    ...[...addOns].map((id) => `+ ${ADD_ONS.find((a) => a.id === id).label}`),
    `Total: ${price(total)}`,
  ].join("\n");

  // Fly an add-on thumbnail into the total, then flash the total.
  const flyToTotal = (button, addOn, target) => {
    const img = button.querySelector("img");
    const totalEl = totalRef.current;
    if (!img || !totalEl) return;
    const a = img.getBoundingClientRect();
    const b = target ?? totalEl.getBoundingClientRect();
    const S = 88;
    const left = a.left + a.width / 2 - S / 2;
    const top = a.top + a.height / 2 - S / 2;
    const chip = document.createElement("div");
    chip.style.cssText = `position:fixed;pointer-events:none;z-index:9999;left:${left}px;top:${top}px;width:${S}px;height:${S}px;border-radius:16px;overflow:hidden;border:2px solid #d4924a;box-shadow:0 0 24px rgba(212,146,74,0.95),0 0 56px rgba(212,146,74,0.5);`;
    chip.innerHTML = `<img src="${addOn.img}" alt="" style="width:100%;height:100%;object-fit:cover;" />`;
    document.body.appendChild(chip);
    gsap
      .timeline()
      .to(chip, { x: b.left + b.width / 2 - left - S / 2, y: b.top + b.height / 2 - top - S / 2, ease: "power2.inOut", duration: 0.65 })
      .to(chip, {
        scale: 0,
        opacity: 0,
        duration: 0.18,
        ease: "power3.in",
        onComplete: () => {
          chip.remove();
          gsap.fromTo(
            totalEl,
            { scale: 1, color: "#d4924a", textShadow: "none" },
            {
              scale: 1.45,
              color: "#ffd9a8",
              textShadow: "0 0 50px rgba(255,200,130,1), 0 0 100px rgba(212,146,74,0.9)",
              duration: 0.18,
              ease: "power2.out",
              yoyo: true,
              repeat: 1,
              onComplete: () => {
                gsap.set(totalEl, { clearProps: "all" });
              },
            },
          );
        },
      });
  };

  // Giant glowing size letter bursting out of the preview.
  const burstLetter = (id) => {
    const box = previewRef.current;
    if (!box) return;
    const r = box.getBoundingClientRect();
    const el = document.createElement("div");
    el.setAttribute("aria-hidden", "true");
    el.style.cssText = `position:fixed;pointer-events:none;z-index:9999;left:${r.left + r.width / 2}px;top:${r.top + r.height / 2}px;transform:translate(-50%,-50%);font-family:var(--font-display);font-size:${Math.min(r.width, r.height) * 0.75}px;font-weight:700;line-height:1;color:#ffd9a8;text-shadow:0 0 60px rgba(255,200,130,1),0 0 120px rgba(212,146,74,0.9),0 0 220px rgba(212,146,74,0.6);`;
    el.textContent = SIZES.find((s) => s.id === id).label;
    document.body.appendChild(el);
    gsap.fromTo(
      el,
      { scale: 0.1, opacity: 0 },
      {
        scale: 1.05,
        opacity: 1,
        duration: 0.2,
        ease: "power3.out",
        onComplete: () => {
          gsap.to(el, { scale: 2.5, opacity: 0, duration: 0.45, ease: "power2.in", onComplete: () => el.remove() });
        },
      },
    );
  };

  const chooseSize = (id) => {
    setSize(id);
    if (window.innerWidth < 768 && previewRef.current) {
      const header = document.querySelector("header")?.offsetHeight ?? 60;
      window.scrollTo({ top: previewRef.current.getBoundingClientRect().top + window.scrollY - header, behavior: "smooth" });
      setTimeout(() => burstLetter(id), 680);
    } else burstLetter(id);
  };

  const toggleAddOn = (id, e) => {
    const button = e.currentTarget;
    const addOn = ADD_ONS.find((a) => a.id === id);
    if (!addOns.has(id)) {
      if (window.innerWidth < 768 && totalRef.current) {
        const r = totalRef.current.getBoundingClientRect();
        const offset = r.top - window.innerHeight * 0.5;
        gsap.to(window, { duration: 0.65, ease: "power2.inOut", scrollTo: { y: window.scrollY + offset, autoKill: false } });
        flyToTotal(button, addOn, { left: r.left, top: r.top - offset, width: r.width, height: r.height });
      } else flyToTotal(button, addOn);
    }
    setAddOns((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <section id="build" className="scroll-mt-16 bg-surface px-6 py-12 md:px-12 md:py-28">
      <div className="mx-auto max-w-[1300px]">
        <div className="mb-8 border-b border-stroke pb-6 md:mb-16 md:pb-8">
          <p className="font-mono text-[11px] tracking-[0.3em] text-muted">INTERACTIVE // YOUR CUP</p>
          <h2 className="mt-2 font-display text-4xl font-semibold tracking-tight text-text md:text-6xl">
            <span className="text-accent">{"// 02."}</span> BUILD YOUR CUP
          </h2>
        </div>

        <div className="grid gap-8 md:grid-cols-[45%_55%] md:gap-12">
          <div className="order-2 flex flex-col gap-8 md:order-1 md:gap-10">
            <div>
              <div className="mb-4 flex items-center justify-between md:mb-5">
                <p className="font-mono text-[11px] tracking-[0.3em] text-muted">
                  {drink ? "STEP 1 · DRINK SELECTED ↓" : "STEP 1 · CHOOSE SIZE"}
                </p>
                {drink && (
                  <button onClick={() => setDrink(null)} className="py-2 font-mono text-[10px] tracking-[0.2em] text-accent/80 transition-colors hover:text-accent">
                    × CLEAR DRINK
                  </button>
                )}
              </div>
              <div className="grid grid-cols-3 gap-2 md:gap-4">
                {SIZES.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => chooseSize(s.id)}
                    aria-pressed={size === s.id}
                    className={`flex flex-col overflow-hidden rounded-xl border transition-all duration-200 md:rounded-2xl ${
                      size === s.id ? "border-accent bg-accent/10" : "border-stroke bg-bg hover:border-muted"
                    }`}
                  >
                    <div className="relative h-24 w-full overflow-hidden bg-black md:h-48">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={s.img} alt="" loading="lazy" className="h-full w-full object-cover transition-transform duration-500 hover:scale-105" />
                      <div className="absolute inset-0 bg-gradient-to-t from-bg via-transparent to-transparent opacity-60" />
                      <span
                        className={`absolute left-2 top-2 font-display text-lg font-semibold leading-none md:left-3 md:top-3 md:text-2xl ${
                          size === s.id ? "text-accent" : "text-text"
                        }`}
                      >
                        {s.label}
                      </span>
                    </div>
                    <div className="p-2 text-left md:p-3">
                      <p className="font-mono text-[9px] tracking-[0.15em] text-muted md:tracking-[0.2em]">{s.name}</p>
                      <p className="mt-0.5 hidden font-mono text-[9px] tracking-wider text-muted/80 md:block">{s.desc}</p>
                      <p className={`mt-1 font-display text-xs font-semibold md:mt-2 md:text-base ${size === s.id ? "text-accent" : "text-text"}`}>
                        {s.extra === 0 ? "INCLUDED" : `+${price(s.extra)}`}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="mb-4 font-mono text-[11px] tracking-[0.3em] text-muted md:mb-5">STEP 2 · ADD EXTRAS</p>
              <div className="grid grid-cols-2 gap-2 md:gap-3">
                {ADD_ONS.map((a) => {
                  const on = addOns.has(a.id);
                  return (
                    <button
                      key={a.id}
                      onClick={(e) => toggleAddOn(a.id, e)}
                      aria-pressed={on}
                      className={`group flex items-center gap-2.5 rounded-xl border px-3 py-3 text-left transition-all duration-200 md:gap-4 md:rounded-2xl md:px-4 md:py-4 ${
                        on ? "border-accent/60 bg-accent/10 shadow-[0_0_16px_rgba(212,146,74,0.18)]" : "border-stroke bg-bg hover:border-accent/30"
                      }`}
                    >
                      <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-lg md:h-20 md:w-20 md:rounded-xl">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={a.img} alt="" loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
                        {on && (
                          <div className="absolute inset-0 flex items-center justify-center bg-accent/50">
                            <span className="font-display text-sm font-semibold text-bg md:text-xl">✓</span>
                          </div>
                        )}
                      </div>
                      <div className="flex min-w-0 flex-1 flex-col gap-0.5 md:flex-row md:items-center md:justify-between">
                        <span className={`truncate font-mono text-[9px] leading-tight tracking-[0.1em] md:text-[11px] md:tracking-[0.15em] ${on ? "text-text" : "text-muted"}`}>
                          {a.label}
                        </span>
                        <span className={`font-display text-[11px] font-semibold md:ml-2 md:text-sm ${on ? "text-accent" : "text-muted"}`}>
                          {addOnPrice(a.price)}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="order-1 flex flex-col overflow-hidden rounded-2xl border border-stroke bg-bg md:order-2">
            <div id="build-preview" ref={previewRef} className="relative min-h-[300px] flex-1 overflow-hidden md:min-h-[440px]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                ref={previewImgRef}
                src={drink ? drink.img : "/stills/pour.webp"}
                alt={drink ? drink.name.toLowerCase() : "espresso pouring into a cup"}
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-bg/85 via-transparent to-transparent" />
              {drink ? (
                <div ref={captionRef} className="absolute bottom-4 left-5 right-5 md:bottom-5 md:left-6 md:right-6">
                  <p className="mb-1 font-mono text-[10px] tracking-[0.3em] text-accent">SELECTED DRINK</p>
                  <p className="font-display text-xl font-semibold tracking-tight text-text md:text-2xl">{drink.name}</p>
                  <div className="mt-1.5 flex flex-wrap gap-1.5 md:mt-2 md:gap-2">
                    {drink.badges.map((b) => (
                      <span key={b} className="rounded border border-accent/30 bg-accent/10 px-2 py-0.5 font-mono text-[9px] tracking-[0.15em] text-accent">
                        {b}
                      </span>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="absolute bottom-5 left-6 font-mono text-[10px] tracking-[0.3em] text-muted">PICK A DRINK FROM THE MENU, OR BUILD YOUR OWN</p>
              )}
            </div>

            <div className="mt-4 space-y-2 border-t border-stroke px-5 pt-4 md:mt-6 md:px-8 md:pt-6">
              <div className="flex justify-between font-mono text-[10px] tracking-[0.25em] text-text">
                <span>{drink ? drink.name : "HOUSE CUP"}</span>
                <span>{price(base)}</span>
              </div>
              {current.extra > 0 && (
                <div className="flex justify-between font-mono text-[10px] tracking-[0.25em] text-muted">
                  <span>{current.name}</span>
                  <span>+{price(current.extra)}</span>
                </div>
              )}
              {[...addOns].map((id) => {
                const a = ADD_ONS.find((x) => x.id === id);
                return (
                  <div key={id} className="flex justify-between font-mono text-[10px] tracking-[0.25em] text-muted">
                    <span>{a.label}</span>
                    <span>{addOnPrice(a.price)}</span>
                  </div>
                );
              })}
              <div className="mt-1 h-px bg-stroke" />
            </div>

            <div className="mt-4 px-5 pb-5 md:mt-6 md:px-8 md:pb-8">
              <div className="flex items-end justify-between">
                <p className="font-mono text-[11px] tracking-[0.3em] text-muted">TOTAL</p>
                <p ref={totalRef} className="font-display text-4xl font-semibold text-accent md:text-5xl">
                  {price(total)}
                </p>
              </div>
              <a
                href={whatsappLink(orderMessage)}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 flex w-full items-center justify-center gap-3 rounded-xl bg-accent py-4 font-mono text-sm tracking-[0.25em] text-bg transition-all duration-300 hover:brightness-110 active:scale-[0.98] md:mt-5 md:py-5"
              >
                <WhatsAppIcon className="h-5 w-5" />
                ORDER ON WHATSAPP
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
