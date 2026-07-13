export const locales = ["ms", "en", "zh"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "ms";

export const localeNames: Record<Locale, string> = {
  ms: "BM",
  en: "EN",
  zh: "中文",
};

export const localeLabels: Record<Locale, string> = {
  ms: "Bahasa Melayu",
  en: "English",
  zh: "中文",
};

// hreflang codes for <link alternate> / metadata
export const hreflang: Record<Locale, string> = {
  ms: "ms-MY",
  en: "en-MY",
  zh: "zh-MY",
};

export function isLocale(x: string): x is Locale {
  return (locales as readonly string[]).includes(x);
}

/** Build a locale-aware href. Default locale (ms) has no prefix. */
export function lhref(locale: Locale, path: string): string {
  const p = path.startsWith("/") ? path : `/${path}`;
  if (locale === defaultLocale) return p;
  return p === "/" ? `/${locale}` : `/${locale}${p}`;
}

/** Keyword-rich site title per locale (used on the home page). */
export const siteTitle: Record<Locale, string> = {
  ms: "AdamSofi | Web Developer Malaysia - Buat Website Murah & Pantas",
  en: "AdamSofi | Web Developer Malaysia - Affordable, Fast Websites",
  zh: "AdamSofi | 马来西亚网站开发 - 实惠快速建站",
};

/** SEO keywords per locale (targeting web-developer search intent). */
export const seoKeywords: Record<Locale, string[]> = {
  ms: [
    "web developer Malaysia", "buat website", "website murah", "landing page murah", "reka bentuk website",
    "landing page Malaysia", "web design Malaysia", "developer website", "website bisnes",
    "laman web perniagaan", "tukang buat website", "website KL", "AdamSofi",
  ],
  en: [
    "web developer Malaysia", "website design Malaysia", "affordable website", "affordable landing page", "landing page",
    "business website", "web development Malaysia", "freelance web developer", "small business website",
    "web designer KL", "AdamSofi",
  ],
  zh: [
    "马来西亚网站开发", "网站设计", "便宜网站", "落地页", "便宜落地页", "商业网站", "网页开发",
    "自由网站开发者", "中小企业网站", "吉隆坡网页设计", "AdamSofi",
  ],
};

/** Metadata alternates (canonical + hreflang) for a given page path. */
export function alternates(locale: Locale, path: string) {
  const languages: Record<string, string> = {};
  for (const l of locales) languages[hreflang[l]] = lhref(l, path);
  languages["x-default"] = lhref(defaultLocale, path);
  return { canonical: lhref(locale, path), languages };
}
