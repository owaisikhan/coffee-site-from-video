import { Header } from "@/app/_components/layout/Header";
import { Footer } from "@/app/_components/layout/Footer";
import { Hero } from "@/app/_components/home/Hero";
import { Menu } from "@/app/_components/home/Menu";
import { Build } from "@/app/_components/home/Build";
import { House } from "@/app/_components/home/House";
import { Stats } from "@/app/_components/home/Stats";
import { Brew } from "@/app/_components/home/Brew";
import { Craft } from "@/app/_components/home/Craft";
import { Origins } from "@/app/_components/home/Origins";
import { Story } from "@/app/_components/home/Story";
import { Visit } from "@/app/_components/home/Visit";

export default function Home() {
  return (
    <>
      <Header />
      <main className="bg-bg text-text">
        <Hero />
        <Menu />
        <Build />
        <House />
        <Stats />
        <Brew />
        <Craft />
        <Origins />
        <Story />
        <Visit />
      </main>
      <Footer />
    </>
  );
}
