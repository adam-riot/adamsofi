import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getDemo } from "@/lib/demos";
import { type Locale, isLocale, lhref, alternates } from "@/lib/i18n/config";
import { getDict } from "@/lib/i18n/dictionaries";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale: raw, slug } = await params;
  const locale: Locale = isLocale(raw) ? raw : "ms";
  const demo = getDemo(slug);
  if (!demo) return { title: "Demo" };
  return {
    title: `Demo: ${demo.name}`,
    description: `${demo.category} - ${demo.desc}`,
    alternates: alternates(locale, `/demos/${demo.slug}`),
  };
}

export default async function DemoPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale: raw, slug } = await params;
  const locale: Locale = isLocale(raw) ? raw : "ms";
  const t = getDict(locale).demo;
  const demo = getDemo(slug);
  if (!demo) notFound();

  return (
    <div className="demo-view">
      <div className="demo-banner">
        <div className="wrap demo-banner-inner">
          <div className="demo-banner-l">
            <Link href={lhref(locale, "/portfolio")} className="demo-back">← {t.back}</Link>
            <span className="demo-title">
              {t.titlePrefix} <b>{demo.name}</b>
              <span className="demo-cat">{demo.category}</span>
            </span>
          </div>
          <div className="demo-banner-r">
            <a href={`/demos/${demo.slug}.html`} target="_blank" rel="noopener" className="btn btn-gho demo-open">{t.openTab}</a>
            <Link href={lhref(locale, "/hubungi")} className="btn btn-pri">{t.build}</Link>
          </div>
        </div>
      </div>
      <iframe src={`/demos/${demo.slug}.html`} title={demo.name} className="demo-frame" loading="lazy" />
    </div>
  );
}
