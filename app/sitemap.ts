import type { MetadataRoute } from "next";
import { demos } from "@/lib/demos";
import { getPublishedArticles } from "@/lib/articles";
import { getPublishedEbooks } from "@/lib/ebooks";
import { locales, lhref } from "@/lib/i18n/config";

const BASE = "https://adamsofi.com";

// Query the DB at request time so newly published articles/ebooks appear immediately.
export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPaths = ["/", "/servis", "/portfolio", "/blog", "/ebook", "/hubungi"];
  const out: MetadataRoute.Sitemap = [];

  for (const locale of locales) {
    for (const p of staticPaths) {
      out.push({ url: `${BASE}${lhref(locale, p)}`, changeFrequency: "weekly", priority: p === "/" ? 1 : 0.8 });
    }
    for (const d of demos) {
      out.push({ url: `${BASE}${lhref(locale, `/demos/${d.slug}`)}`, changeFrequency: "yearly", priority: 0.5 });
    }
    const articles = await getPublishedArticles(locale);
    for (const a of articles) {
      out.push({ url: `${BASE}${lhref(locale, `/blog/${a.slug}`)}`, lastModified: a.updated_at, changeFrequency: "monthly", priority: 0.7 });
    }
    const ebooks = await getPublishedEbooks();
    for (const e of ebooks) {
      out.push({ url: `${BASE}${lhref(locale, `/ebook/${e.slug}`)}`, lastModified: e.updated_at, changeFrequency: "monthly", priority: 0.7 });
    }
  }
  return out;
}
