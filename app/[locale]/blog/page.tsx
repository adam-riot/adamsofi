import type { Metadata } from "next";
import ScrollReveal from "@/components/ui/ScrollReveal";
import BlogList from "@/components/blog/BlogList";
import NewsletterBox from "@/components/blog/NewsletterBox";
import { getPublishedArticles } from "@/lib/articles";
import { type Locale, isLocale, alternates } from "@/lib/i18n/config";
import { getDict } from "@/lib/i18n/dictionaries";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : "ms";
  const d = getDict(locale);
  return { title: d.blog.eyebrow, description: d.blog.p, alternates: alternates(locale, "/blog") };
}

export default async function BlogPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : "ms";
  const dict = getDict(locale);
  const t = dict.blog;
  const articles = await getPublishedArticles(locale);

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
          {articles.length === 0 ? (
            <p style={{ textAlign: "center", color: "var(--mute)", padding: "20px 0 40px" }}>{t.comingSoon}</p>
          ) : (
            <BlogList articles={articles} locale={locale} dict={dict} />
          )}
          <div style={{ maxWidth: 760, margin: "60px auto 0" }}>
            <ScrollReveal><NewsletterBox dict={dict} /></ScrollReveal>
          </div>
        </div>
      </section>
    </>
  );
}
