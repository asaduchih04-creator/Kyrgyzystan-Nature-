import Image from "next/image";
import { LocationLabel } from "@/components/ui/LocationLabel";
import { PillLink } from "@/components/ui/PillLink";

export function ContactInvitation() {
  return <section className="contact-invitation" aria-labelledby="invitation-title"><Image src="/images/home/contact-invitation.png" alt="" fill sizes="1440px" className="invitation-photo" unoptimized /><div className="invitation-overlay" /><div className="invitation-content"><div className="section-meta"><LocationLabel>Соң-Көл, Нарын облусу</LocationLabel><span>Based in Maebashi,Japan</span></div><h2 id="invitation-title" className="invitation-heading"><span className="sr-only">Жаңы сапарга даярсызбы?</span><span aria-hidden="true" className="invitation-initial">Ж</span><span aria-hidden="true" className="invitation-line-one">аңы сапарга </span><span aria-hidden="true" className="invitation-line-two">даярсызбы?</span></h2><div className="invitation-cta"><PillLink href="/contact" width={236}>Биз менен байланыш</PillLink></div></div></section>;
}
