"use client";

import { useEffect, useState } from "react";
import { NAV } from "@/app/_lib/content";
import { Brand } from "@/app/_components/layout/Brand";

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // The phone menu closes on the first scroll after it opens.
  useEffect(() => {
    if (!open) return;
    const close = () => setOpen(false);
    window.addEventListener("scroll", close, { once: true, passive: true });
    return () => window.removeEventListener("scroll", close);
  }, [open]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        scrolled || open ? "border-b border-stroke bg-bg/95" : "bg-transparent"
      }`}
    >
      <nav className="mx-auto flex max-w-[1400px] items-center justify-between px-6 py-4 md:px-10">
        <Brand />
        <ul className="hidden items-center gap-7 lg:flex">
          {NAV.map((item) => (
            <li key={item.href}>
              <a href={item.href} className="font-mono text-[11px] tracking-[0.15em] text-muted transition-colors hover:text-text">
                {item.label}
              </a>
            </li>
          ))}
        </ul>
        <button
          onClick={() => setOpen((v) => !v)}
          className="-mr-2 flex h-11 w-11 flex-col items-center justify-center gap-[5px] lg:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          <span className={`block h-px w-5 bg-text transition-all duration-300 ${open ? "translate-y-[6px] rotate-45" : ""}`} />
          <span className={`block h-px w-5 bg-text transition-all duration-300 ${open ? "opacity-0" : ""}`} />
          <span className={`block h-px w-5 bg-text transition-all duration-300 ${open ? "-translate-y-[6px] -rotate-45" : ""}`} />
        </button>
        <a
          href="#visit"
          className="hidden rounded-full border border-accent/50 px-4 py-2 font-mono text-[11px] tracking-[0.2em] text-accent transition-colors hover:bg-accent hover:text-bg lg:inline-block"
        >
          BOOK A TABLE
        </a>
      </nav>
      <div className={`overflow-hidden transition-all duration-500 ease-in-out lg:hidden ${open ? "max-h-[32rem]" : "max-h-0"}`}>
        <ul className="flex flex-col border-t border-stroke px-6 pb-6 pt-4">
          {NAV.map((item) => (
            <li key={item.href}>
              <a
                href={item.href}
                onClick={() => setOpen(false)}
                className="flex items-center gap-4 py-3.5 font-mono text-[13px] tracking-[0.15em] text-muted transition-colors hover:text-accent"
              >
                <span className="h-px w-4 bg-accent/40" />
                {item.label}
              </a>
            </li>
          ))}
          <li className="mt-3">
            <a
              href="#visit"
              onClick={() => setOpen(false)}
              className="block rounded-xl bg-accent py-3.5 text-center font-mono text-xs tracking-[0.25em] text-bg"
            >
              BOOK A TABLE
            </a>
          </li>
        </ul>
      </div>
    </header>
  );
}
