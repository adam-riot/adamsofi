import type { Metadata } from "next";
import { getPublishedEbooks } from "@/lib/ebooks";
import EbookCard from "@/components/ebook/EbookCard";
import { type Locale, isLocale, alternates, seoKeywords } from "@/lib/i18n/config";
import { getDict } from "@/lib/i18n/dictionaries";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : "ms";
  const d = getDict(locale);
  return {
    title: `${d.ebook.eyebrow} - AdamSofi`,
    description: d.ebook.p,
    keywords: seoKeywords[locale],
    alternates: alternates(locale, "/ebook"),
  };
}

export default async function EbookListPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : "ms";
  const dict = getDict(locale);
  const t = dict.ebook;
  const ebooks = await getPublishedEbooks();

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
          {ebooks.length === 0 ? (
            <p style={{ textAlign: "center", color: "var(--mute)", padding: "20px 0 40px" }}>{t.none}</p>
          ) : (
            <div className="blog-grid">
              {ebooks.map((e) => (<EbookCard key={e.id} ebook={e} locale={locale} dict={dict} />))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
