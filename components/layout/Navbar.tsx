"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import Logo from "@/components/Logo";
import LanguageSwitcher from "@/components/layout/LanguageSwitcher";
import { lhref, type Locale } from "@/lib/i18n/config";
import type { Dict } from "@/lib/i18n/dictionaries";

export default function Navbar({ locale, dict }: { locale: Locale; dict: Dict }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const links = [
    { href: lhref(locale, "/servis"), label: dict.nav.servis },
    { href: lhref(locale, "/portfolio"), label: dict.nav.portfolio },
    { href: lhref(locale, "/blog"), label: dict.nav.blog },
    { href: lhref(locale, "/hubungi"), label: dict.nav.hubungi },
  ];
  const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/");

  return (
    <nav>
      <div className="wrap nav-inner">
        <Logo href={lhref(locale, "/")} />
        <div className="navlinks">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className={isActive(l.href) ? "active" : ""}>
              {l.label}
            </Link>
          ))}
        </div>
        <div className="nav-right">
          <LanguageSwitcher locale={locale} />
          <Link href={lhref(locale, "/hubungi")} className="btn btn-pri nav-cta">{dict.nav.cta}</Link>
        </div>
        <button className="nav-toggle" aria-label="Menu" aria-expanded={open} onClick={() => setOpen((v) => !v)}>
          <span /><span /><span />
        </button>
      </div>
      {open && (
        <div className="nav-mobile">
          {links.map((l) => (
            <Link key={l.href} href={l.href} onClick={() => setOpen(false)}>{l.label}</Link>
          ))}
          <Link href={lhref(locale, "/hubungi")} className="btn btn-pri" onClick={() => setOpen(false)}>{dict.nav.cta}</Link>
          <LanguageSwitcher locale={locale} />
        </div>
      )}
    </nav>
  );
}
