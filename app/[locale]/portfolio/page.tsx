import Link from "next/link";
import type { Metadata } from "next";
import ScrollReveal from "@/components/ui/ScrollReveal";
import PortfolioGrid from "@/components/portfolio/PortfolioGrid";
import { type Locale, isLocale, lhref, alternates } from "@/lib/i18n/config";
import { getDict } from "@/lib/i18n/dictionaries";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : "ms";
  const d = getDict(locale);
  return { title: d.portfolio.eyebrow, description: d.portfolio.p, alternates: alternates(locale, "/portfolio") };
}

export default async function PortfolioPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : "ms";
  const dict = getDict(locale);
  const t = dict.portfolio;

  return (
    <>
      <header className="phero">
        <div className="wrap">
          <span className="eyebrow">{t.eyebrow}</span>
          <h1>{t.h1a} <span className="g">{t.h1g}</span> {t.h1b}</h1>
          <p>{t.p}</p>
        </div>
      </header>

      <section style={{ paddingTop: 30 }}>
        <div className="wrap">
          <ScrollReveal className="sec-head">
            <span className="eyebrow">{t.featEyebrow}</span>
            <h2>{t.featH2}</h2>
          </ScrollReveal>
          <ScrollReveal>
            <div className="feat">
              <div className="feat-inner">
                <div className="feat-glow" />
                <div className="feat-grid">
                  <div className="feat-shot"><div className="mock">Code<span>Cikgu</span></div></div>
                  <div className="feat-body">
                    <span className="feat-tag">{t.featTag}</span>
                    <h2>CodeCikgu.com</h2>
                    <div className="feat-sub">{t.featSub}</div>
                    <div className="feat-meta">{t.featMeta}</div>
                    <div className="feat-stack">
                      {["Next.js 15", "TypeScript", "TailwindCSS", "Neon", "Vercel"].map((s) => (<span key={s}>{s}</span>))}
                    </div>
                    <div className="feat-status">{t.featStatus}</div>
                    <a href="https://codecikgu.com" target="_blank" rel="noopener" className="btn btn-pri">{t.featBtn}</a>
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <section className="pf-sec">
        <div className="wrap">
          <ScrollReveal className="sec-head">
            <h2>{t.gridH2}</h2>
            <p>{t.gridP}</p>
          </ScrollReveal>
          <PortfolioGrid locale={locale} dict={dict} />
        </div>
      </section>

      <section className="final">
        <div className="wrap">
          <ScrollReveal className="final-box" direction="scale">
            <div className="inner">
              <h2>{t.finalA} <span className="g">{t.finalG}</span>{t.finalB}</h2>
              <p>{dict.common.konsultasiPercuma}</p>
              <Link href={lhref(locale, "/hubungi")} className="btn btn-pri" style={{ fontSize: 16, padding: "15px 30px" }}>{dict.common.hubungiKami}</Link>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
