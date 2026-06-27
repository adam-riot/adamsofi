"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { lhref, type Locale } from "@/lib/i18n/config";
import type { Dict } from "@/lib/i18n/dictionaries";

export default function Hero({ locale, dict }: { locale: Locale; dict: Dict }) {
  const heroRef = useRef<HTMLElement>(null);
  const t = dict.home;

  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const y = window.scrollY;
          if (y < 900) {
            hero.style.setProperty("--py", `${y * 0.4}px`);
            hero.style.setProperty("--pyg", `${y * 0.25}px`);
          }
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="hero" ref={heroRef}>
      <div className="grid-bg" />
      <div className="blob b1 float-1" />
      <div className="blob b2 float-2" />
      <div className="blob b3 float-3" />
      <div className="wrap">
        <span className="chip reveal-up in"><span className="pulse" /> {t.chip}</span>
        <h1 className="reveal-up in" style={{ transitionDelay: "0s" }}>
          {t.h1a} <span className="g">{t.h1g}</span><br />{t.h1b}
        </h1>
        <p className="reveal-up in" style={{ transitionDelay: ".15s" }}>{t.heroP}</p>
        <div className="hero-cta reveal-up in" style={{ transitionDelay: ".3s" }}>
          <Link href={lhref(locale, "/hubungi")} className="btn btn-pri">{t.ctaPrimary}</Link>
          <Link href={lhref(locale, "/portfolio")} className="btn btn-gho">{t.ctaSecondary}</Link>
        </div>
        <div className="hero-meta reveal-up in" style={{ transitionDelay: ".45s" }}>
          <div className="hm"><span className="i">⚡</span> {t.meta1}</div>
          <div className="hm"><span className="i">📱</span> <b>{t.meta2a}</b>{t.meta2b}</div>
          <div className="hm"><span className="i">🎁</span> {t.meta3}</div>
        </div>
      </div>
    </header>
  );
}
