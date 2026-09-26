import Image from "next/image";
import { destinations } from "@/content/home";
import { LocationLabel } from "@/components/ui/LocationLabel";

export function NatureSection() {
  return <section id="nature" className="nature" aria-labelledby="nature-title">
    <div className="section-meta nature-meta"><span>since 2026</span><span className="nature-meta-brand"><Image src="/icons/dot-meta.svg" width={8} height={8} alt="" />Kyrgyzystan nature</span><span>Based in Maebashi,Japan</span></div>
    <h2 id="nature-title">Kыргызстан табияти. Жаратылышты ач, өзүндү тап</h2>
    <div className="nature-composition"><ul className="destination-controls" aria-label="Аймактар">{destinations.map(item => <li key={item.label}><button type="button" aria-pressed={item.selected} aria-disabled="true" aria-describedby="destination-availability" className={`destination-pill${item.selected ? " is-selected" : ""}`} style={{ width: item.width }}><span>{item.label}</span><Image src={`/icons/dot-${item.selected ? "white" : "green"}.svg`} alt="" width={12} height={12} /></button></li>)}</ul><p id="destination-availability" className="sr-only">Аймактардын сүрөттөрү жана маалыматы даярдала элек. Тандоо азырынча жеткиликсиз.</p>
    <p className="scroll-label">Төмөн жылдырыңыз<Image src="/icons/arrow.svg" width={8} height={26} alt="" /></p>
    <div className="destination-stack">{[{w:292,h:136},{w:564,h:264},{w:836,h:392},{w:1068,h:500}].map((size,index)=><div key={index} className={`destination-layer destination-layer--${index+1}`}><Image src={`/images/nature/layer-${index+1}.png`} width={size.w} height={size.h} alt="" unoptimized /></div>)}<LocationLabel className="destination-badge" badge>Ала-Арча капчыгайы</LocationLabel><p className="destination-description">1976-жылы улуттук парк болуп түзүлгөн, Бишкек шаарына жакын жайгашкан кооз тоо аймагы.</p></div>
    </div>
  </section>;
}
