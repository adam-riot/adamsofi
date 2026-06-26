import Link from "next/link";
import Logo from "@/components/Logo";
import { WHATSAPP, EMAIL } from "@/lib/demos";

export default function Footer() {
  return (
    <footer>
      <div className="wrap">
        <div className="foot-grid">
          <div className="foot-col" style={{ maxWidth: 280 }}>
            <div style={{ marginBottom: 12 }}><Logo /></div>
            <p>Landing page pantas &amp; berpatutan untuk bisnes Malaysia.</p>
          </div>
          <div className="foot-col">
            <h4>Pautan</h4>
            <Link href="/">Utama</Link>
            <Link href="/servis">Servis &amp; Harga</Link>
            <Link href="/portfolio">Portfolio</Link>
            <Link href="/blog">Blog</Link>
            <Link href="/hubungi">Hubungi</Link>
          </div>
          <div className="foot-col">
            <h4>Hubungi</h4>
            <a href={`https://wa.me/${WHATSAPP}`}>WhatsApp: 018-2399476</a>
            <a href="#">Threads: @mhmd.adam44</a>
            <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
          </div>
        </div>
        <div className="foot-bot">
          <span>© 2026 AdamSofi. Hak cipta terpelihara.</span>
          <span>Dibina di Malaysia 🇲🇾</span>
        </div>
      </div>
    </footer>
  );
}
