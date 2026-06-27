import Link from "next/link";
import type { Metadata } from "next";
import ScrollReveal from "@/components/ui/ScrollReveal";
import FAQ from "@/components/ui/FAQ";
import { type Locale, isLocale, lhref, alternates } from "@/lib/i18n/config";
import { getDict } from "@/lib/i18n/dictionaries";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : "ms";
  const d = getDict(locale);
  return { title: d.servis.eyebrow, description: d.servis.p, alternates: alternates(locale, "/servis") };
}

export default async function ServisPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : "ms";
  const t = getDict(locale).servis;
  const hubungi = lhref(locale, "/hubungi");

  return (
    <>
      <header className="phero">
        <div className="wrap">
          <span className="eyebrow">{t.eyebrow}</span>
          <h1>{t.h1a} <span className="g">{t.h1g}</span>{t.h1b}</h1>
          <p>{t.p}</p>
        </div>
      </header>

      <section style={{ paddingTop: 20 }}>
        <div className="wrap">
          <div className="plans">
            {t.plans.map((p, idx) => (
              <ScrollReveal key={p.name} direction="scale">
                <div className={`plan ${idx === 1 ? "pop" : ""}`}>
                  {idx === 1 && <div className="rb">{t.popular}</div>}
                  <div className="pn">{p.name}</div>
                  <div className="amt">{p.price}</div>
                  <div className="pp">{p.note}</div>
                  <ul>
                    {p.feats.map((f) => {
                      const [label, on] = f as [string, boolean];
                      return (
                        <li key={label} className={on ? "" : "off"}>
                          <span className={on ? "c" : "x"}>{on ? "✓" : "✕"}</span> {label}
                        </li>
                      );
                    })}
                  </ul>
                  <Link href={hubungi} className={`btn ${idx === 1 ? "btn-pri" : "btn-gho"}`}>{p.cta}</Link>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <section className="pf-sec">
        <div className="wrap">
          <ScrollReveal className="sec-head">
            <span className="eyebrow">{t.addonEyebrow}</span>
            <h2>{t.addonH2}</h2>
          </ScrollReveal>
          <div className="addons">
            {t.addons.map((a) => {
              const [h, d, pr] = a as [string, string, string];
              return (
                <div className="addon" key={h}>
                  <div className="l"><h3>{h}</h3><p>{d}</p></div>
                  <div className="pr">{pr}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section>
        <div className="wrap">
          <ScrollReveal className="sec-head">
            <span className="eyebrow">{t.maintEyebrow}</span>
            <h2>{t.maintH2}</h2>
          </ScrollReveal>
          <div className="plans">
            {t.maint.map((m) => (
              <ScrollReveal key={m.name}>
                <div className="plan">
                  <div className="pn">{m.name}</div>
                  <div className="amt">{m.price}<small>/mo</small></div>
                  <div className="pp">{m.note}</div>
                  <ul>{m.feats.map((f) => (<li key={f}><span className="c">✓</span> {f}</li>))}</ul>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <section className="pf-sec">
        <div className="wrap">
          <ScrollReveal className="sec-head">
            <span className="eyebrow">{t.faqEyebrow}</span>
            <h2>{t.faqH2}</h2>
          </ScrollReveal>
          <ScrollReveal><FAQ items={t.faq} /></ScrollReveal>
        </div>
      </section>

      <section className="final">
        <div className="wrap">
          <ScrollReveal className="final-box" direction="scale">
            <div className="inner">
              <h2>{t.finalA} <span className="g">{t.finalG}</span>{t.finalB}</h2>
              <p>{t.finalP}</p>
              <Link href={hubungi} className="btn btn-pri" style={{ fontSize: 16, padding: "15px 30px" }}>{getDict(locale).common.hubungiKami}</Link>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
