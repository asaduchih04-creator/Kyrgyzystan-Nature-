import { navigation } from "@/content/home";
import { PillLink } from "@/components/ui/PillLink";

export function NavigationLinks({ footer = false }: { footer?: boolean }) {
  return <nav aria-label="Негизги навигация" className="navigation-links">{navigation.map((item, index) => <PillLink key={item.href} {...item} variant={footer ? index === 0 ? "solid" : "outline" : "glass"}>{item.label}</PillLink>)}</nav>;
}
