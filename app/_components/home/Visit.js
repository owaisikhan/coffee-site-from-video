"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, prefersReducedMotion } from "@/app/_lib/gsap";
import { TIMES } from "@/app/_lib/content";
import { siteConfig, whatsappLink } from "@/app/_lib/siteConfig";
import { WhatsAppIcon } from "@/app/_components/ui/WhatsAppIcon";

const WEEKDAYS = ["M", "T", "W", "T", "F", "S", "S"];
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

const formatDate = (v) => {
  if (!v) return "";
  const [y, m, d] = v.split("-");
  return `${Number(d)} ${MONTHS[Number(m) - 1]} ${y}`;
};

function Chevron({ d }) {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={d} />
    </svg>
  );
}

function Calendar({ value, onChange }) {
  const today = new Date();
  const [view, setView] = useState({ year: today.getFullYear(), month: today.getMonth() });
  const days = new Date(view.year, view.month + 1, 0).getDate();
  const lead = (new Date(view.year, view.month, 1).getDay() + 6) % 7; // Monday-first
  const cells = [...Array(lead).fill(null), ...Array.from({ length: days }, (_, i) => i + 1)];
  while (cells.length % 7 !== 0) cells.push(null);

  const selected = value ? new Date(`${value}T00:00:00`) : null;
  const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const isPast = (d) => new Date(view.year, view.month, d) < startOfToday;
  const isToday = (d) => view.year === today.getFullYear() && view.month === today.getMonth() && d === today.getDate();
  const isSelected = (d) =>
    !!selected && selected.getFullYear() === view.year && selected.getMonth() === view.month && selected.getDate() === d;
  const atCurrentMonth = view.year === today.getFullYear() && view.month === today.getMonth();

  const navBtn =
    "flex h-10 w-10 items-center justify-center rounded-xl border border-stroke text-muted transition-colors hover:border-accent hover:text-accent disabled:opacity-30";

  return (
    <div className="w-full">
      <div className="mb-3 flex items-center justify-between md:mb-4">
        <button
          type="button"
          aria-label="Previous month"
          disabled={atCurrentMonth}
          onClick={() => setView((v) => (v.month === 0 ? { year: v.year - 1, month: 11 } : { ...v, month: v.month - 1 }))}
          className={navBtn}
        >
          <Chevron d="M9 2L4 7l5 5" />
        </button>
        <span className="font-mono text-sm tracking-[0.2em] text-text">
          {MONTHS[view.month].toUpperCase()} {view.year}
        </span>
        <button
          type="button"
          aria-label="Next month"
          onClick={() => setView((v) => (v.month === 11 ? { year: v.year + 1, month: 0 } : { ...v, month: v.month + 1 }))}
          className={navBtn}
        >
          <Chevron d="M5 2l5 5-5 5" />
        </button>
      </div>
      <div className="mb-1 grid grid-cols-7 gap-1 md:mb-2">
        {WEEKDAYS.map((d, i) => (
          <div key={i} className="text-center font-mono text-[10px] tracking-[0.15em] text-muted">
            {d}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {cells.map((d, i) => (
          <button
            key={i}
            type="button"
            disabled={!d || isPast(d)}
            aria-label={d ? `${d} ${MONTHS[view.month]}` : undefined}
            aria-pressed={d ? isSelected(d) : undefined}
            onClick={() => d && onChange(`${view.year}-${String(view.month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`)}
            className={`aspect-square rounded-lg font-mono text-xs transition-all duration-150 md:rounded-xl md:text-sm ${
              !d
                ? ""
                : isSelected(d)
                  ? "bg-accent font-medium text-bg shadow-[0_0_16px_rgba(212,146,74,0.6)]"
                  : isToday(d)
                    ? "border border-accent text-accent hover:bg-accent/20"
                    : isPast(d)
                      ? "cursor-not-allowed text-muted/30 line-through"
                      : "text-text/80 hover:bg-surface hover:text-text"
            }`}
          >
            {d || ""}
          </button>
        ))}
      </div>
    </div>
  );
}

const slotClass = (active) =>
  `min-h-11 rounded-xl border py-3 font-mono text-xs tracking-wider transition-all duration-200 ${
    active ? "border-accent bg-accent font-medium text-bg shadow-[0_0_20px_rgba(212,146,74,0.45)]" : "border-stroke bg-surface text-muted hover:border-accent/50 hover:text-text"
  }`;

const inputClass =
  "w-full rounded-2xl border border-stroke bg-surface px-5 py-4 text-base font-medium text-text transition-all focus:border-accent focus:shadow-[0_0_0_3px_rgba(212,146,74,0.15)] focus:outline-none md:text-sm";

export function Visit() {
  const ref = useRef(null);
  const headRef = useRef(null);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [guests, setGuests] = useState(2);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [sent, setSent] = useState(false);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.from(headRef.current.children, {
        opacity: 0,
        y: 50,
        stagger: 0.12,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: { trigger: ref.current, start: "top 85%", once: true },
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  const ready = Boolean(date && time && name.trim() && phone.trim());
  const guestWord = guests === 1 ? "guest" : "guests";
  const message = `Hi ${siteConfig.name}, I'd like to book a table.\nName: ${name.trim()}\nDate: ${formatDate(date)}\nTime: ${time}\nGuests: ${guests}\nPhone: ${phone.trim()}`;

  const submit = (e) => {
    e.preventDefault();
    if (!ready) return;
    window.open(whatsappLink(message), "_blank", "noopener,noreferrer");
    setSent(true);
  };

  return (
    <section ref={ref} id="visit" className="relative scroll-mt-16 overflow-hidden bg-surface px-6 py-28 md:px-12 md:py-40">
      <span className="pointer-events-none absolute left-6 top-6 h-14 w-14 border-l border-t border-accent/30 md:left-14 md:top-14" />
      <span className="pointer-events-none absolute bottom-6 right-6 h-14 w-14 border-b border-r border-accent/30 md:bottom-14 md:right-14" />
      <div className="mx-auto max-w-[1100px]">
        <div ref={headRef} className="mb-16 text-center">
          <p className="font-mono text-[11px] tracking-[0.4em] text-accent">BOOK A TABLE · KODEXA HOUSE</p>
          <h2 className="mt-5 font-display text-[clamp(3rem,9vw,8rem)] font-semibold uppercase leading-none tracking-tight text-text">
            SAVE
            <br />
            <span className="text-accent">YOUR SEAT</span>
          </h2>
          <p className="mx-auto mt-6 max-w-sm text-sm leading-relaxed text-muted">{siteConfig.hours}. Walk-ins welcome, booking keeps a table for you.</p>
          <div className="mx-auto mt-8 h-px w-20 bg-accent/40" />
        </div>

        {sent ? (
          <div className="flex flex-col items-center gap-6 rounded-3xl border border-accent/30 bg-bg/60 px-6 py-20 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full border border-accent bg-accent/10 text-accent">
              <WhatsAppIcon className="h-8 w-8" />
            </div>
            <h3 className="font-display text-2xl font-semibold tracking-tight text-text md:text-4xl">YOUR MESSAGE IS READY</h3>
            <p className="max-w-sm text-sm leading-relaxed text-muted">
              Press send in WhatsApp and we will confirm your table, {name.trim()}.
              <br />
              <span className="text-accent">
                {formatDate(date)} · {time} · {guests} {guestWord}
              </span>
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <a
                href={whatsappLink(message)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 items-center gap-2 rounded-full bg-accent px-6 py-2.5 font-mono text-[11px] tracking-[0.2em] text-bg"
              >
                <WhatsAppIcon /> OPEN WHATSAPP AGAIN
              </a>
              <button
                onClick={() => {
                  setSent(false);
                  setDate("");
                  setTime("");
                  setName("");
                  setPhone("");
                  setGuests(2);
                }}
                className="min-h-11 rounded-full border border-stroke px-6 py-2.5 font-mono text-[11px] tracking-[0.2em] text-muted transition-colors hover:border-accent hover:text-accent"
              >
                NEW BOOKING
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={submit} className="flex flex-col gap-6">
            <div className="rounded-3xl border border-stroke bg-bg/70 p-5 md:p-12">
              <div className="grid gap-10 lg:grid-cols-2">
                <div className="flex flex-col gap-8">
                  <div>
                    <p className="mb-4 font-mono text-[10px] tracking-[0.35em] text-accent">01 · PICK A DATE</p>
                    <div className="rounded-2xl border border-stroke bg-surface p-4 md:p-5">
                      <Calendar value={date} onChange={setDate} />
                    </div>
                  </div>
                  <div>
                    <p className="mb-4 font-mono text-[10px] tracking-[0.35em] text-accent">02 · HOW MANY</p>
                    <div className="flex h-[60px] items-center justify-between rounded-2xl border border-stroke bg-surface px-3">
                      <button
                        type="button"
                        aria-label="Fewer guests"
                        onClick={() => setGuests((g) => Math.max(1, g - 1))}
                        className="h-11 w-11 font-display text-2xl text-muted transition-colors hover:text-accent active:scale-90"
                      >
                        −
                      </button>
                      <div className="text-center" aria-live="polite">
                        <span className="font-display text-3xl font-semibold text-text">{guests}</span>
                        <span className="ml-2 font-mono text-xs tracking-widest text-muted">{guestWord.toUpperCase()}</span>
                      </div>
                      <button
                        type="button"
                        aria-label="More guests"
                        onClick={() => setGuests((g) => Math.min(12, g + 1))}
                        className="h-11 w-11 font-display text-2xl text-muted transition-colors hover:text-accent active:scale-90"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-8">
                  <div>
                    <p className="mb-4 font-mono text-[10px] tracking-[0.35em] text-accent">03 · PICK A TIME</p>
                    <div className="flex flex-col gap-3">
                      <p className="font-mono text-[10px] tracking-[0.3em] text-muted">MORNING</p>
                      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                        {TIMES.slice(0, 4).map((t) => (
                          <button key={t} type="button" aria-pressed={time === t} onClick={() => setTime(t)} className={slotClass(time === t)}>
                            {t}
                          </button>
                        ))}
                      </div>
                      <p className="mt-1 font-mono text-[10px] tracking-[0.3em] text-muted">AFTERNOON</p>
                      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                        {TIMES.slice(4, 8).map((t) => (
                          <button key={t} type="button" aria-pressed={time === t} onClick={() => setTime(t)} className={slotClass(time === t)}>
                            {t}
                          </button>
                        ))}
                      </div>
                      <p className="mt-1 font-mono text-[10px] tracking-[0.3em] text-muted">EVENING</p>
                      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                        {TIMES.slice(8).map((t) => (
                          <button key={t} type="button" aria-pressed={time === t} onClick={() => setTime(t)} className={slotClass(time === t)}>
                            {t}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-4">
                    <p className="font-mono text-[10px] tracking-[0.35em] text-accent">04 · YOUR DETAILS</p>
                    <label className="sr-only" htmlFor="visit-name">
                      Your name
                    </label>
                    <input id="visit-name" type="text" autoComplete="name" placeholder="e.g. Sara Ahmed" value={name} onChange={(e) => setName(e.target.value)} className={inputClass} required />
                    <label className="sr-only" htmlFor="visit-phone">
                      Phone number
                    </label>
                    <input id="visit-phone" type="tel" autoComplete="tel" placeholder="e.g. 0300 1234567" value={phone} onChange={(e) => setPhone(e.target.value)} className={inputClass} required />
                  </div>
                </div>
              </div>
            </div>

            {(date || time || guests !== 2) && (
              <div className="flex items-center gap-4 rounded-2xl border border-accent/20 bg-accent/5 px-6 py-4">
                <span className="h-2 w-2 flex-shrink-0 rounded-full bg-accent" />
                <p className="font-mono text-[11px] tracking-[0.25em] text-muted">
                  {date && <span className="text-text">{formatDate(date)}</span>}
                  {date && time && <span className="mx-3 text-accent/70">·</span>}
                  {time && <span className="text-text">{time}</span>}
                  {(date || time) && <span className="mx-3 text-accent/70">·</span>}
                  <span className="text-text">
                    {guests} {guestWord.toUpperCase()}
                  </span>
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={!ready}
              className={`flex w-full items-center justify-center gap-3 rounded-2xl py-6 font-mono text-sm tracking-[0.3em] transition-all duration-300 md:text-base ${
                ready
                  ? "border border-accent bg-accent text-bg hover:shadow-[0_0_60px_rgba(212,146,74,0.5)] active:scale-[0.99]"
                  : "cursor-not-allowed border border-stroke bg-surface/40 text-muted/70"
              }`}
            >
              <WhatsAppIcon className="h-5 w-5" />
              BOOK ON WHATSAPP
            </button>
            <p className="text-center font-mono text-[10px] tracking-[0.2em] text-muted">
              {ready ? "Opens WhatsApp with your booking filled in" : "Pick a date and time and add your name and phone"}
            </p>
          </form>
        )}
      </div>
    </section>
  );
}
