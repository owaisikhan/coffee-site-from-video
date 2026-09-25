import { siteConfig } from "@/app/_lib/siteConfig";

export function Brand() {
  return (
    <a href="#top" className="flex flex-col leading-none">
      <span className="font-display text-base font-semibold tracking-[0.2em] text-text">KODEXA HOUSE</span>
      <span className="mt-1 font-mono text-[9px] tracking-[0.35em] text-muted uppercase">{siteConfig.tagline}</span>
    </a>
  );
}
