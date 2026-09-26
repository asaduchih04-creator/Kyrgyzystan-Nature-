import { hoves, monsieur, alexandra } from "@/lib/fonts";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { HeroSection } from "@/components/home/HeroSection";
import { WelcomeSection } from "@/components/home/WelcomeSection";
import { AboutSection } from "@/components/home/AboutSection";
import { NatureSection } from "@/components/home/NatureSection";
import { ContactInvitation } from "@/components/home/ContactInvitation";
import { HomepageMotion } from "@/components/motion/HomepageMotion";

export default function HomePage() {
  return <div className={`desktop-homepage ${hoves.variable} ${monsieur.variable} ${alexandra.variable}`}><SiteHeader /><main><HeroSection /><WelcomeSection /><AboutSection /><NatureSection /><ContactInvitation /></main><SiteFooter /><HomepageMotion /></div>;
}
