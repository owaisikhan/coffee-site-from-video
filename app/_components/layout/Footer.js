import { siteConfig } from "@/app/_lib/siteConfig";
import { Brand } from "@/app/_components/layout/Brand";

export function Footer() {
  const links = [
    { label: "INSTAGRAM", href: siteConfig.instagram },
    { label: "TIKTOK", href: siteConfig.tiktok },
    { label: "BOOK A TABLE", href: "#visit" },
    { label: "MENU", href: "#menu" },
  ];
  return (
    <footer className="border-t border-stroke bg-bg">
      <div className="mx-auto flex max-w-[1200px] flex-col items-center justify-between gap-5 px-6 py-8 md:flex-row md:px-12">
        <Brand />
        <div className="flex flex-wrap justify-center gap-x-5 gap-y-2 font-mono text-[11px] tracking-[0.15em] text-muted md:gap-6">
          {links.map((l) => (
            <a key={l.label} href={l.href} className="py-2 transition-colors hover:text-text">
              {l.label}
            </a>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75 motion-reduce:animate-none" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
          </span>
          <span className="font-mono text-[11px] tracking-[0.15em] text-muted">{siteConfig.hoursShort}</span>
        </div>
      </div>
    </footer>
  );
}
