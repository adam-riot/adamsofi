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

/** Metadata alternates (canonical + hreflang) for a given page path. */
export function alternates(locale: Locale, path: string) {
  const languages: Record<string, string> = {};
  for (const l of locales) languages[hreflang[l]] = lhref(l, path);
  languages["x-default"] = lhref(defaultLocale, path);
  return { canonical: lhref(locale, path), languages };
}
