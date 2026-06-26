import Link from "next/link";
import Hero from "@/components/home/Hero";
import ScrollReveal from "@/components/ui/ScrollReveal";
import ArticleCard from "@/components/blog/ArticleCard";
import NewsletterBox from "@/components/blog/NewsletterBox";
import { getPublishedArticles } from "@/lib/articles";
import { demos } from "@/lib/demos";

export const revalidate = 300;

const why = [
  { ic: "⚡", h: "Siap Pantas", p: "Landing page siap mengikut pakej — tak payah tunggu berbulan." },
  { ic: "💬", h: "Terus ke WhatsApp", p: "Pelanggan klik satu butang, terus mesej anda. Tiada friction." },
  { ic: "📱", h: "Cantik di Telefon", p: "Majoriti pelanggan guna telefon. Dioptimum untuk skrin kecil dulu." },
  { ic: "🎁", h: "Draft Dulu, Bayar Kemudian", p: "Saya buatkan draft percuma. Berkenan baru teruskan." },
  { ic: "💸", h: "Harga Berpatutan", p: "Pakej jelas bermula serendah RM500. Tiada caj tersembunyi." },
  { ic: "🔧", h: "Mudah Diuruskan", p: "Nak tukar maklumat? Mesej je saya. Anda tak perlu pening kod." },
];

const steps = [
  { n: "1", h: "Mesej Saya", p: "Cerita pasal bisnes anda. Saya tanya beberapa soalan ringkas." },
  { n: "2", h: "Draft Percuma", p: "Saya buatkan draft awal. Anda tengok hasil sebenar tanpa bayar dulu." },
  { n: "3", h: "Ubah Suai", p: "Nak tukar warna, teks, gambar? Bagitahu, saya kemas kini." },
  { n: "4", h: "Live & Siap", p: "Website naik online. Link terus boleh share kat pelanggan." },
];

const testimonials = [
  { q: "Website siap cepat dan nampak profesional. Pelanggan terus WhatsApp dari website.", n: "Aiman, Kafe" },
  { q: "Harga berpatutan, komunikasi mudah. Memang berbaloi untuk bisnes kecil.", n: "Sara, Butik" },
  { q: "Draft percuma dulu buat saya yakin. Hasil akhir lebih cantik dari jangkaan.", n: "Hafiz, Gym" },
];

export default async function HomePage() {
  const articles = (await getPublishedArticles()).slice(0, 3);
  const featuredDemos = demos.slice(0, 3);

  return (
    <>
      <Hero />

      <div className="strip">
        <div className="wrap">
          <span className="lab">Sesuai untuk:</span>
          <div className="tags">
            {["Kafe & Restoran", "Barbershop & Salon", "Klinik", "Gym & Studio", "Tuisyen", "Servis & Tukang"].map((t) => (
              <span className="tg" key={t}>{t}</span>
            ))}
          </div>
        </div>
      </div>

      {/* WHY */}
      <section id="kenapa">
        <div className="wrap">
          <ScrollReveal className="sec-head">
            <span className="eyebrow">Kenapa AdamSofi</span>
            <h2>Senang, laju, berbaloi.</h2>
            <p>Anda fokus jalankan bisnes. Saya uruskan website.</p>
          </ScrollReveal>
          <div className="why">
            {why.map((w, i) => (
              <ScrollReveal key={w.h} className="wcard" delay={i * 80}>
                <div className="ic">{w.ic}</div>
                <h3>{w.h}</h3>
                <p>{w.p}</p>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* PORTFOLIO PREVIEW */}
      <section className="pf-sec">
        <div className="wrap">
          <ScrollReveal className="sec-head">
            <span className="eyebrow">Hasil Kerja</span>
            <h2>Contoh landing page</h2>
            <p>Klik mana-mana untuk lihat demo penuh.</p>
          </ScrollReveal>
          <div className="pf">
            {featuredDemos.map((d, i) => (
              <ScrollReveal key={d.slug} delay={i * 80}>
                <Link href={`/demos/${d.slug}`} className="pcard">
                  <div className={`pthumb ${d.thumb}`}>{d.name}</div>
                  <div className="pmeta">
                    <div className="cat">{d.category}</div>
                    <h3>{d.name}</h3>
                    <p>{d.desc}</p>
                    <div className="v">Lihat demo →</div>
                  </div>
                </Link>
              </ScrollReveal>
            ))}
          </div>
          <div style={{ textAlign: "center", marginTop: 40 }}>
            <Link href="/portfolio" className="btn btn-gho">Lihat Semua Portfolio →</Link>
          </div>
        </div>
      </section>

      {/* PROCESS */}
      <section id="cara">
        <div className="wrap">
          <ScrollReveal className="sec-head">
            <span className="eyebrow">Cara Kerja</span>
            <h2>4 langkah, website siap</h2>
          </ScrollReveal>
          <div className="proc">
            {steps.map((s, i) => (
              <ScrollReveal key={s.n} className="pstep" direction={i % 2 ? "right" : "left"}>
                <div className="n">{s.n}</div>
                <h3>{s.h}</h3>
                <p>{s.p}</p>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* BLOG PREVIEW */}
      {articles.length > 0 && (
        <section className="pf-sec">
          <div className="wrap">
            <ScrollReveal className="sec-head">
              <span className="eyebrow">Blog</span>
              <h2>Artikel terbaru</h2>
              <p>Tips website &amp; bisnes online untuk usahawan Malaysia.</p>
            </ScrollReveal>
            <div className="blog-grid">
              {articles.map((a) => (
                <ArticleCard key={a.id} article={a} />
              ))}
            </div>
            <div style={{ textAlign: "center", marginTop: 40 }}>
              <Link href="/blog" className="btn btn-gho">Lihat Semua Artikel →</Link>
            </div>
          </div>
        </section>
      )}

      {/* NEWSLETTER */}
      <section>
        <div className="wrap" style={{ maxWidth: 760 }}>
          <ScrollReveal><NewsletterBox /></ScrollReveal>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="pf-sec">
        <div className="wrap">
          <ScrollReveal className="sec-head">
            <span className="eyebrow">Testimoni</span>
            <h2>Kata pelanggan</h2>
          </ScrollReveal>
          <div className="why">
            {testimonials.map((t, i) => (
              <ScrollReveal key={t.n} className="wcard" delay={i * 80}>
                <div className="ic">★★★★★</div>
                <p style={{ fontStyle: "italic", marginBottom: 12 }}>&ldquo;{t.q}&rdquo;</p>
                <h3 style={{ fontSize: 15, color: "var(--cyan)" }}>— {t.n}</h3>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="final">
        <div className="wrap">
          <ScrollReveal className="final-box" direction="scale">
            <div className="inner">
              <h2>Jom mula dengan <span className="g">draft percuma</span>.</h2>
              <p>Tiada risiko, tiada komitmen. Mesej saya hari ini.</p>
              <Link href="/hubungi" className="btn btn-pri" style={{ fontSize: 17, padding: "16px 32px" }}>
                💬 Mulakan Projek Anda
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
