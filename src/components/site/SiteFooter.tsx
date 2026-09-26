import Image from "next/image";
import { introduction } from "@/content/home";
import { BrandEmblem, BrandWordmark } from "./Brand";
import { NavigationLinks } from "./NavigationLinks";

export function SiteFooter() {
  return <footer className="site-footer"><div className="footer-top"><BrandEmblem footer /><NavigationLinks footer /><BrandWordmark /></div><div className="footer-bottom"><div className="footer-title"><Image src="/images/typography/footer-title.png" width={2012} height={372} alt="Кыргызстан Табияты" className="typography-image" unoptimized /></div><p className="footer-description">{introduction}</p></div></footer>;
}
