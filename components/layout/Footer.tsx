import Link from "next/link";
import Logo from "@/components/Logo";
import { WHATSAPP, EMAIL } from "@/lib/demos";
import { lhref, type Locale } from "@/lib/i18n/config";
import type { Dict } from "@/lib/i18n/dictionaries";

export default function Footer({ locale, dict }: { locale: Locale; dict: Dict }) {
  return (
    <footer>
      <div className="wrap">
        <div className="foot-grid">
          <div className="foot-col" style={{ maxWidth: 280 }}>
            <div style={{ marginBottom: 12 }}><Logo href={lhref(locale, "/")} /></div>
            <p>{dict.footer.tagline}</p>
          </div>
          <div className="foot-col">
            <h4>{dict.footer.pautan}</h4>
            <Link href={lhref(locale, "/")}>{dict.nav.home}</Link>
            <Link href={lhref(locale, "/servis")}>{dict.footer.servisHarga}</Link>
            <Link href={lhref(locale, "/portfolio")}>{dict.nav.portfolio}</Link>
            <Link href={lhref(locale, "/blog")}>{dict.nav.blog}</Link>
            <Link href={lhref(locale, "/hubungi")}>{dict.nav.hubungi}</Link>
          </div>
          <div className="foot-col">
            <h4>{dict.footer.hubungi}</h4>
            <a href={`https://wa.me/${WHATSAPP}`}>WhatsApp: 018-2399476</a>
            <a href="#">Threads: @mhmd.adam44</a>
            <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
          </div>
        </div>
        <div className="foot-bot">
          <span>{dict.footer.rights}</span>
          <span>{dict.footer.builtIn}</span>
        </div>
      </div>
    </footer>
  );
}
