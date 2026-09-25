import { CRAFT_TILES } from "@/app/_lib/content";

export function Craft() {
  return (
    <section id="craft" className="scroll-mt-16 bg-bg px-6 py-24 md:px-16">
      <div className="mb-14 flex items-end justify-between gap-8 border-b border-stroke pb-6">
        <div>
          <p className="mb-2 font-mono text-xs tracking-[0.25em] text-accent">{"// 05. THE CRAFT"}</p>
          <h2 className="font-display text-3xl font-semibold uppercase tracking-tight text-text md:text-5xl">
            Ten steps.
            <br className="md:hidden" /> One cup.
          </h2>
        </div>
        <p className="hidden max-w-xs text-right text-sm leading-relaxed text-muted md:block">
          From the roasted bean to the last drop, every step is done by hand at the bar, in front of you.
        </p>
      </div>
      <div className="grid grid-cols-2 gap-2 md:grid-cols-3 md:gap-3">
        {CRAFT_TILES.map((t) => (
          <div
            key={t.id}
            className={`group relative h-44 overflow-hidden rounded-sm bg-surface md:h-64 ${t.span === 2 ? "col-span-2" : "col-span-1"}`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={t.img}
              alt={t.label.toLowerCase()}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent opacity-85 transition-opacity duration-500 group-hover:opacity-100" />
            <div className="absolute bottom-0 left-0 p-4 md:p-5">
              <p className="mb-1 font-mono text-[10px] tracking-[0.2em] text-accent md:text-xs">{t.label}</p>
              <p className="text-[11px] tracking-wide text-text/75 md:text-xs">{t.sub}</p>
            </div>
            <div className="absolute right-3 top-3 h-4 w-4 border-r border-t border-accent/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          </div>
        ))}
      </div>
      <div className="mt-14 flex items-center gap-6 border-t border-stroke pt-6">
        <span className="font-mono text-[10px] tracking-[0.25em] text-muted">ROASTED · GROUND · PULLED · POURED</span>
        <div className="h-px flex-1 bg-stroke" />
        <span className="font-mono text-[10px] tracking-[0.2em] text-accent/80">KODEXA HOUSE</span>
      </div>
    </section>
  );
}
