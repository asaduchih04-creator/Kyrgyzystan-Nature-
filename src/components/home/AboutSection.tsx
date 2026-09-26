import Image from "next/image";
import { LocationLabel } from "@/components/ui/LocationLabel";

export function AboutSection() {
  return <section id="about" className="about" aria-labelledby="about-title"><div className="about-photo" aria-hidden="true"><Image src="/images/home/about.png" fill sizes="1440px" alt="" unoptimized /></div><div className="about-overlay" />
    <div className="about-content"><div className="section-meta"><span>since 2026</span><span>Based in Maebashi,Japan</span></div>
    <h2 id="about-title" className="about-heading"><Image src="/images/typography/about-title.png" width={1756} height={308} alt="Кыргызстан — табият менен жолугушкан жер." className="typography-image" unoptimized /></h2>
    <p className="about-description">Бул жерге келген ар бир адам табият менен толук гармонияны сезип, күнүмдүк жашоодон алыстап, чыныгы эс алууну таба алат.</p>
    <div className="about-bottom"><LocationLabel>Ала-Арча капчыгайы</LocationLabel><p>Тоолордун тынчтыгын сезип, таза абадан ырахат алыңыз. Бул саякат сиз үчүн өзгөчө тажрыйба болот.</p></div></div>
  </section>;
}
