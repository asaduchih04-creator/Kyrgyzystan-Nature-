import Image from "next/image";
import { introduction } from "@/content/home";
import { LocationLabel } from "@/components/ui/LocationLabel";
import { NavigationLinks } from "@/components/site/NavigationLinks";

export function HeroSection() {
  return <section className="hero" aria-label="Нарын мамлекеттик коругу">
    <div className="hero-photo" aria-hidden="true"><Image src="/images/home/hero.png" alt="" fill sizes="1440px" preload unoptimized /></div>
    <div className="hero-overlay" />
    <div className="hero-content"><p className="hero-introduction">{introduction}</p><div className="hero-bottom"><LocationLabel>{"Нарын  мамлекеттик  коругу"}</LocationLabel><NavigationLinks /><p className="hero-credit">Асадулла жана<br />{"       Нурсултан жасалган."}</p></div></div>
  </section>;
}
