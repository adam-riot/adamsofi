import Link from "next/link";
import type { Metadata } from "next";
import Hero from "@/components/home/Hero";
import ScrollReveal from "@/components/ui/ScrollReveal";
import ArticleCard from "@/components/blog/ArticleCard";
import NewsletterBox from "@/components/blog/NewsletterBox";
import { getPublishedArticles } from "@/lib/articles";
import { demos } from "@/lib/demos";
import { type Locale, isLocale, lhref, alternates } from "@/lib/i18n/config";
import { getDict } from "@/lib/i18n/dictionaries";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : "ms";
  const d = getDict(locale);
  return {
    title: { absolute: `AdamSofi - ${d.home.h1g} ${d.home.h1b}` },
    description: d.home.heroP,
    alternates: alternates(locale, "/"),
  };
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : "ms";
  const dict = getDict(locale);
  const t = dict.home;
  const articles = (await getPublishedArticles(locale)).slice(0, 3);
  const featuredDemos = demos.slice(0, 3);

  return (
    <>
      <Hero locale={locale} dict={dict} />

      <div className="strip">
        <div className="wrap">
          <span className="lab">{t.stripLabel}</span>
          <div className="tags">
            {t.stripTags.map((tag) => (<span className="tg" key={tag}>{tag}</span>))}
          </div>
        </div>
      </div>

      <section id="kenapa">
        <div className="wrap">
          <ScrollReveal className="sec-head">
            <span className="eyebrow">{t.whyEyebrow}</span>
            <h2>{t.whyH2}</h2>
            <p>{t.whyP}</p>
          </ScrollReveal>
          <div className="why">
            {t.why.map((w, i) => (
              <ScrollReveal key={w.h} className="wcard" delay={i * 80}>
                <div className="ic">{w.ic}</div>
                <h3>{w.h}</h3>
                <p>{w.p}</p>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <section className="pf-sec">
        <div className="wrap">
          <ScrollReveal className="sec-head">
            <span className="eyebrow">{t.pfEyebrow}</span>
            <h2>{t.pfH2}</h2>
            <p>{t.pfP}</p>
          </ScrollReveal>
          <div className="pf">
            {featuredDemos.map((demo, i) => (
              <ScrollReveal key={demo.slug} delay={i * 80}>
                <Link href={lhref(locale, `/demos/${demo.slug}`)} className="pcard">
                  <div className={`pthumb ${demo.thumb}`}>{demo.name}</div>
                  <div className="pmeta">
                    <div className="cat">{demo.category}</div>
                    <h3>{demo.name}</h3>
                    <p>{demo.desc}</p>
                    <div className="v">{dict.portfolio.lihatDemo}</div>
                  </div>
                </Link>
              </ScrollReveal>
            ))}
          </div>
          <div style={{ textAlign: "center", marginTop: 40 }}>
            <Link href={lhref(locale, "/portfolio")} className="btn btn-gho">{t.pfLihatSemua}</Link>
          </div>
        </div>
      </section>

      <section id="cara">
        <div className="wrap">
          <ScrollReveal className="sec-head">
            <span className="eyebrow">{t.procEyebrow}</span>
            <h2>{t.procH2}</h2>
          </ScrollReveal>
          <div className="proc">
            {t.steps.map((s, i) => (
              <ScrollReveal key={s.n} className="pstep" direction={i % 2 ? "right" : "left"}>
                <div className="n">{s.n}</div>
                <h3>{s.h}</h3>
                <p>{s.p}</p>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {articles.length > 0 && (
        <section className="pf-sec">
          <div className="wrap">
            <ScrollReveal className="sec-head">
              <span className="eyebrow">{t.blogEyebrow}</span>
              <h2>{t.blogH2}</h2>
              <p>{t.blogP}</p>
            </ScrollReveal>
            <div className="blog-grid">
              {articles.map((a) => (<ArticleCard key={a.id} article={a} locale={locale} dict={dict} />))}
            </div>
            <div style={{ textAlign: "center", marginTop: 40 }}>
              <Link href={lhref(locale, "/blog")} className="btn btn-gho">{t.blogLihatSemua}</Link>
            </div>
          </div>
        </section>
      )}

      <section>
        <div className="wrap" style={{ maxWidth: 760 }}>
          <ScrollReveal><NewsletterBox dict={dict} /></ScrollReveal>
        </div>
      </section>

      <section className="pf-sec">
        <div className="wrap">
          <ScrollReveal className="sec-head">
            <span className="eyebrow">{t.tstEyebrow}</span>
            <h2>{t.tstH2}</h2>
          </ScrollReveal>
          <div className="why">
            {t.testimonials.map((tt, i) => (
              <ScrollReveal key={tt.n} className="wcard" delay={i * 80}>
                <div className="ic">★★★★★</div>
                <p style={{ fontStyle: "italic", marginBottom: 12 }}>&ldquo;{tt.q}&rdquo;</p>
                <h3 style={{ fontSize: 15, color: "var(--cyan)" }}>- {tt.n}</h3>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <section className="final">
        <div className="wrap">
          <ScrollReveal className="final-box" direction="scale">
            <div className="inner">
              <h2>{t.finalA} <span className="g">{t.finalG}</span>{t.finalB}</h2>
              <p>{t.finalP}</p>
              <Link href={lhref(locale, "/hubungi")} className="btn btn-pri" style={{ fontSize: 17, padding: "16px 32px" }}>
                {t.finalBtn}
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
