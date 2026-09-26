import Link from "next/link";

export function PillLink({ href, children, width, variant = "glass" }: { href: string; children: React.ReactNode; width: number; variant?: "glass" | "solid" | "outline" }) {
  return <Link href={href} className={`pill pill--${variant}`} style={{ width }}>{children}</Link>;
}
