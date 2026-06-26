"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";

export default function Hero() {
  const heroRef = useRef<HTMLElement>(null);

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
        <span className="chip reveal-up in">
          <span className="pulse" /> Tempahan dibuka · Siap pantas
        </span>
        <h1 className="reveal-up in" style={{ transitionDelay: "0s" }}>
          Landing page <span className="g">pantas</span>
          <br />untuk bisnes anda.
        </h1>
        <p className="reveal-up in" style={{ transitionDelay: ".15s" }}>
          Website profesional yang menjual - mobile-friendly, terus boleh WhatsApp.
          Berpatutan, laju, tanpa karenah teknikal yang menyusahkan.
        </p>
        <div className="hero-cta reveal-up in" style={{ transitionDelay: ".3s" }}>
          <Link href="/hubungi" className="btn btn-pri">Dapatkan Draft Percuma →</Link>
          <Link href="/portfolio" className="btn btn-gho">Lihat Hasil Kerja</Link>
        </div>
        <div className="hero-meta reveal-up in" style={{ transitionDelay: ".45s" }}>
          <div className="hm"><span className="i">⚡</span> Siap <b>pantas</b></div>
          <div className="hm"><span className="i">📱</span> <b>Mobile</b>-friendly</div>
          <div className="hm"><span className="i">🎁</span> Draft <b>percuma</b> dulu</div>
        </div>
      </div>
    </header>
  );
}
