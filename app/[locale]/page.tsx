import Link from "next/link";
import type { Metadata } from "next";
import Hero from "@/components/home/Hero";
import ScrollReveal from "@/components/ui/ScrollReveal";
import ArticleCard from "@/components/blog/ArticleCard";
import NewsletterBox from "@/components/blog/NewsletterBox";
import { getPublishedArticles } from "@/lib/articles";
import { demos } from "@/lib/demos";
import { headers } from "next/headers";
import { type Locale, isLocale, lhref, alternates, siteTitle, seoKeywords, hreflang } from "@/lib/i18n/config";
import { getDict } from "@/lib/i18n/dictionaries";
import { SITE_URL, WHATSAPP, EMAIL } from "@/lib/demos";
import WaLink from "@/components/ui/WaLink";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : "ms";
  const d = getDict(locale);
  return {
    title: { absolute: siteTitle[locale] },
    description: d.home.heroP,
    keywords: seoKeywords[locale],
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
  const nonce = (await headers()).get("x-nonce") ?? undefined;

  const ld = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${SITE_URL}/#org`,
        name: "AdamSofi",
        url: SITE_URL,
        logo: `${SITE_URL}/favicon.svg`,
        image: `${SITE_URL}/og-image.png`,
        description: t.heroP,
        sameAs: [`https://wa.me/${WHATSAPP}`, "https://www.threads.net/@mhmd.adam44"],
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: SITE_URL,
        name: "AdamSofi",
        inLanguage: hreflang[locale],
        publisher: { "@id": `${SITE_URL}/#org` },
      },
      {
        "@type": "ProfessionalService",
        "@id": `${SITE_URL}/#service`,
        name: "AdamSofi",
        url: lhref(locale, "/"),
        image: `${SITE_URL}/og-image.png`,
        description: t.heroP,
        serviceType: "Web Development",
        priceRange: "RM500 - RM2500+",
        areaServed: { "@type": "Country", name: "Malaysia" },
        knowsAbout: seoKeywords[locale],
        telephone: "+60182399476",
        email: EMAIL,
        address: { "@type": "PostalAddress", addressCountry: "MY", addressRegion: "Selangor" },
        openingHoursSpecification: [
          { "@type": "OpeningHoursSpecification", dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], opens: "09:00", closes: "18:00" },
          { "@type": "OpeningHoursSpecification", dayOfWeek: "Saturday", opens: "10:00", closes: "14:00" },
        ],
        contactPoint: {
          "@type": "ContactPoint",
          contactType: "customer service",
          telephone: "+60182399476",
          email: EMAIL,
          availableLanguage: ["Malay", "English", "Chinese"],
        },
        provider: { "@id": `${SITE_URL}/#org` },
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: "Web Development Packages",
          itemListElement: dict.servis.plans.map((p) => ({
            "@type": "Offer",
            name: p.name,
            price: p.price.replace(/[^0-9]/g, ""),
            priceCurrency: "MYR",
          })),
        },
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" nonce={nonce} dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
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
              <WaLink source="home-final" text={t.waPrefill} style={{ fontSize: 17, padding: "16px 32px" }}>
                {t.finalBtn}
              </WaLink>
              <div style={{ marginTop: 14 }}>
                <Link href={lhref(locale, "/hubungi")} className="btn btn-gho">{t.finalFormBtn}</Link>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
