"use client";

import { WHATSAPP } from "@/lib/demos";

/** WhatsApp deep-link with prefilled text + click beacon (reuses /api/view). */
export default function WaLink({
  source,
  text,
  className = "btn btn-wa",
  style,
  children,
}: {
  /** where the click came from, stored as page `wa:<source>` in page_views */
  source: string;
  /** prefilled WhatsApp message */
  text: string;
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
}) {
  const href = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(text)}`;
  const track = () => {
    try {
      const body = new Blob([JSON.stringify({ page: `wa:${source}` })], { type: "application/json" });
      navigator.sendBeacon("/api/view", body);
    } catch { /* tracking must never block the click */ }
  };
  return (
    <a href={href} className={className} style={style} target="_blank" rel="noopener" onClick={track}>
      {children}
    </a>
  );
}
