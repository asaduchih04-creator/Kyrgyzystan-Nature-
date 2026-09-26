import Image from "next/image";

export function LocationLabel({ children, className = "", badge = false }: { children: React.ReactNode; className?: string; badge?: boolean }) {
  return <div className={`location-label ${className}`}><Image src={badge ? "/icons/map-pin-badge.svg" : "/icons/map-pin.svg"} width={24} height={24} alt="" /><span>{children}</span></div>;
}
