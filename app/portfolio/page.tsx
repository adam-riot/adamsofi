import Link from "next/link";
import type { Metadata } from "next";
import ScrollReveal from "@/components/ui/ScrollReveal";
import PortfolioGrid from "@/components/portfolio/PortfolioGrid";

export const metadata: Metadata = {
  title: "Portfolio",
  description: "Projek featured CodeCikgu + 10 demo website untuk pelbagai industri di Malaysia. Lihat kualiti kerja AdamSofi.",
  alternates: { canonical: "/portfolio" },
};

export default function PortfolioPage() {
  return (
    <>
      <header className="phero">
        <div className="wrap">
          <span className="eyebrow">Portfolio</span>
          <h1>Hasil kerja yang <span className="g">bercakap</span>.</h1>
          <p>Dari platform pembelajaran sebenar ke demo website pelbagai industri — inilah kualiti yang anda boleh harapkan.</p>
        </div>
      </header>

      {/* FEATURED */}
      <section style={{ paddingTop: 30 }}>
        <div className="wrap">
          <ScrollReveal className="sec-head" >
            <span className="eyebrow">🏆 Projek Featured</span>
            <h2>Projek sebenar yang sedang live</h2>
          </ScrollReveal>
          <ScrollReveal>
            <div className="feat">
              <div className="feat-inner">
                <div className="feat-glow" />
                <div className="feat-grid">
                  <div className="feat-shot"><div className="mock">Code<span>Cikgu</span></div></div>
                  <div className="feat-body">
                    <span className="feat-tag">⭐ Featured Project</span>
                    <h2>CodeCikgu.com</h2>
                    <div className="feat-sub">Platform Pembelajaran KSSM Sains Komputer Gamifikasi</div>
                    <div className="feat-meta"><b>160</b> soalan kuiz · <b>Sistem tutoring</b> · <b>PDF download</b> · <b>Admin dashboard</b></div>
                    <div className="feat-stack">
                      {["Next.js 15", "TypeScript", "TailwindCSS", "Supabase", "Vercel"].map((s) => (<span key={s}>{s}</span>))}
                    </div>
                    <div className="feat-status">✅ Status: Live</div>
                    <a href="https://codecikgu.com" target="_blank" rel="noopener" className="btn btn-pri">Lawati codecikgu.com →</a>
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* DEMO GRID */}
      <section className="pf-sec">
        <div className="wrap">
          <ScrollReveal className="sec-head">
            <h2>Demo Websites</h2>
            <p>Contoh kerja untuk pelbagai industri. Klik untuk lihat demo penuh.</p>
          </ScrollReveal>
          <PortfolioGrid />
        </div>
      </section>

      <section className="final">
        <div className="wrap">
          <ScrollReveal className="final-box" direction="scale">
            <div className="inner">
              <h2>Nak website macam ni untuk <span className="g">bisnes anda</span>?</h2>
              <p>Konsultasi percuma, tanpa komitmen.</p>
              <Link href="/hubungi" className="btn btn-pri" style={{ fontSize: 16, padding: "15px 30px" }}>Hubungi Kami →</Link>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
