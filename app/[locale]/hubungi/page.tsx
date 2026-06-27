import type { Metadata } from "next";
import ScrollReveal from "@/components/ui/ScrollReveal";
import HubungiForm from "@/components/hubungi/HubungiForm";
import { WHATSAPP, EMAIL } from "@/lib/demos";
import { type Locale, isLocale, alternates } from "@/lib/i18n/config";
import { getDict } from "@/lib/i18n/dictionaries";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : "ms";
  const d = getDict(locale);
  return { title: d.hubungi.eyebrow, description: d.hubungi.p, alternates: alternates(locale, "/hubungi") };
}

export default async function HubungiPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : "ms";
  const dict = getDict(locale);
  const t = dict.hubungi;

  return (
    <>
      <header className="phero">
        <div className="wrap">
          <span className="eyebrow">{t.eyebrow}</span>
          <h1>{t.h1a} <span className="g">{t.h1g}</span>{t.h1b}</h1>
          <p>{t.p}</p>
        </div>
      </header>

      <section style={{ paddingTop: 30 }}>
        <div className="wrap">
          <div className="contact-grid">
            <ScrollReveal><HubungiForm dict={dict} /></ScrollReveal>
            <ScrollReveal>
              <div className="info-card hl">
                <div className="ic">💬</div>
                <h3>{t.infoWa}</h3>
                <div className="big">+60 18-239 9476</div>
                <a href={`https://wa.me/${WHATSAPP}`} className="btn btn-wa" target="_blank" rel="noopener" style={{ width: "100%", justifyContent: "center" }}>{t.infoWaBtn}</a>
              </div>
              <div className="info-card">
                <div className="ic">📧</div><h3>{t.infoEmail}</h3>
                <a href={`mailto:${EMAIL}`} className="mail">{EMAIL}</a>
              </div>
              <div className="info-card">
                <div className="ic">⏰</div><h3>{t.infoHours}</h3>
                <p><b>{t.hoursWeekday}</b> {t.hoursWeekdayV}</p>
                <p><b>{t.hoursSat}</b> {t.hoursSatV}</p>
                <p style={{ marginTop: 8 }}>{t.hoursNote}</p>
              </div>
              <div className="info-card">
                <div className="ic">🎯</div><h3>{t.infoFree}</h3>
                <p>{t.infoFreeP}</p>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>
    </>
  );
}
