import Image from "next/image";
import Link from "next/link";

export function BrandEmblem({ footer = false }: { footer?: boolean }) {
  const size = footer ? "footer" : "header";
  return <Link href="/" aria-label="Башкы бет" className={`brand-emblem brand-emblem--${size}`}><Image className="emblem-left" src={`/brand/${size}-left.svg`} width={footer ? 25.591 : 22} height={footer ? 50.02 : 43} alt="" /><Image className="emblem-right" src={`/brand/${size}-right.svg`} width={footer ? 25.591 : 22} height={footer ? 48.856 : 42} alt="" /><span className="emblem-trademark">TM</span></Link>;
}

export function BrandWordmark() {
  return <Link href="/" className="brand-wordmark">Kyrgyzystan Nature<span>TM</span></Link>;
}
