"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { locales, localeNames, lhref, defaultLocale, type Locale } from "@/lib/i18n/config";

export default function LanguageSwitcher({ locale }: { locale: Locale }) {
  const pathname = usePathname() || "/";
  // Strip the active locale prefix to get the bare path, then re-localise.
  const bare = locale === defaultLocale
    ? pathname
    : pathname.replace(new RegExp(`^/${locale}`), "") || "/";

  return (
    <div className="lang-switch" role="group" aria-label="Language">
      {locales.map((l) => (
        <Link
          key={l}
          href={lhref(l, bare)}
          hrefLang={l}
          className={l === locale ? "active" : ""}
        >
          {localeNames[l]}
        </Link>
      ))}
    </div>
  );
}
