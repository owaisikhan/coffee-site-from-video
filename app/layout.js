import { Bricolage_Grotesque, DM_Sans, JetBrains_Mono } from "next/font/google";
import { siteConfig } from "@/app/_lib/siteConfig";
import "@/app/_styles/globals.css";

const bricolage = Bricolage_Grotesque({ variable: "--font-bricolage", subsets: ["latin"], weight: ["500", "600", "700"] });
const dmSans = DM_Sans({ variable: "--font-dm-sans", subsets: ["latin"], weight: ["400", "500"] });
const jetbrains = JetBrains_Mono({ variable: "--font-jetbrains", subsets: ["latin"], weight: ["400", "500"] });

export const metadata = {
  metadataBase: new URL(siteConfig.url),
  title: `${siteConfig.name} | Espresso bar and roastery`,
  description: siteConfig.description,
  icons: { icon: "/icon.svg" },
  openGraph: { title: siteConfig.name, description: siteConfig.description, images: ["/stills/cup.webp"] },
};

export const viewport = { themeColor: "#0e0a08" };

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${bricolage.variable} ${dmSans.variable} ${jetbrains.variable}`}>
      <body>{children}</body>
    </html>
  );
}
