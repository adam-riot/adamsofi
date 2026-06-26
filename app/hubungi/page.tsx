import type { Metadata } from "next";
import ScrollReveal from "@/components/ui/ScrollReveal";
import HubungiForm from "@/components/hubungi/HubungiForm";
import { WHATSAPP, EMAIL } from "@/lib/demos";

export const metadata: Metadata = {
  title: "Hubungi",
  description: "Hubungi AdamSofi untuk website bisnes anda. Konsultasi percuma tanpa komitmen, respons dalam 24 jam. WhatsApp 018-2399476.",
  alternates: { canonical: "/hubungi" },
};

export default function HubungiPage() {
  return (
    <>
      <header className="phero">
        <div className="wrap">
          <span className="eyebrow">Hubungi</span>
          <h1>Jom mula <span className="g">projek anda</span>.</h1>
          <p>Isi borang ini atau WhatsApp kami terus. Konsultasi percuma, tanpa komitmen.</p>
        </div>
      </header>

      <section style={{ paddingTop: 30 }}>
        <div className="wrap">
          <div className="contact-grid">
            <ScrollReveal><HubungiForm /></ScrollReveal>
            <ScrollReveal>
              <div className="info-card hl">
                <div className="ic">💬</div>
                <h3>WhatsApp Terus</h3>
                <div className="big">+60 18-239 9476</div>
                <a href={`https://wa.me/${WHATSAPP}`} className="btn btn-wa" target="_blank" rel="noopener" style={{ width: "100%", justifyContent: "center" }}>Chat Sekarang →</a>
              </div>
              <div className="info-card">
                <div className="ic">📧</div><h3>Email</h3>
                <a href={`mailto:${EMAIL}`} className="mail">{EMAIL}</a>
              </div>
              <div className="info-card">
                <div className="ic">⏰</div><h3>Waktu Respons</h3>
                <p><b>Isnin–Jumaat:</b> 9am–6pm</p>
                <p><b>Sabtu:</b> 10am–2pm</p>
                <p style={{ marginTop: 8 }}>Respons biasanya dalam masa 24 jam.</p>
              </div>
              <div className="info-card">
                <div className="ic">🎯</div><h3>Konsultasi Percuma</h3>
                <p>Tiada komitmen. Kami dengar keperluan anda dan cadangkan penyelesaian terbaik.</p>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>
    </>
  );
}
