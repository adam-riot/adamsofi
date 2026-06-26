import Link from "next/link";
import type { Metadata } from "next";
import ScrollReveal from "@/components/ui/ScrollReveal";
import FAQ from "@/components/ui/FAQ";

export const metadata: Metadata = {
  title: "Servis & Harga",
  description: "Pakej website AdamSofi: Starter RM500, Professional RM1,200, Enterprise RM2,500+. Add-ons & pelan penyelenggaraan untuk bisnes Malaysia.",
  alternates: { canonical: "/servis" },
};

const plans = [
  {
    name: "Starter", price: "RM 500", note: "Siap 5–7 hari · 2x revision", pop: false,
    feats: [
      ["1 halaman", true], ["Domain .com (1 tahun)", true], ["Hosting Cloudflare percuma", true],
      ["SSL + Mobile responsive", true], ["Borang kenalan", true],
      ["WhatsApp integration", false], ["Google Maps", false], ["SEO asas", false],
    ] as [string, boolean][],
    cta: "Pilih Starter", btn: "btn-gho",
  },
  {
    name: "Professional", price: "RM 1,200", note: "Siap 10–14 hari · 5x revision", pop: true,
    feats: [
      ["Sehingga 5 halaman", true], ["Domain .com / .my (1 tahun)", true], ["Hosting setahun termasuk", true],
      ["SSL + Mobile responsive", true], ["Borang kenalan", true],
      ["WhatsApp integration", true], ["Google Maps", true], ["SEO asas", true],
    ] as [string, boolean][],
    cta: "Pilih Professional", btn: "btn-pri",
  },
  {
    name: "Enterprise", price: "RM 2,500+", note: "Siap 21–30 hari · revision tanpa had", pop: false,
    feats: [
      ["Halaman tidak terhad", true], ["Domain + Premium hosting", true], ["WhatsApp + Maps + SEO", true],
      ["E-commerce / sistem booking", true], ["CMS admin panel", true],
      ["Payment gateway", true], ["Training penggunaan", true], ["Sokongan keutamaan", true],
    ] as [string, boolean][],
    cta: "Bincang Projek", btn: "btn-gho",
  },
];

const addons = [
  ["Domain .my / .com.my", "Domain rasmi Malaysia", "RM 80/thn"],
  ["Email Rasmi", "anda@bisnes.com", "RM 120/thn"],
  ["Logo Design", "Logo profesional jenama", "RM 200–400"],
  ["Copywriting", "Teks yang menjual", "RM 150/hlmn"],
  ["Google My Business", "Setup profil Google Maps", "RM 150"],
  ["Facebook Pixel + Analytics", "Tracking untuk iklan", "RM 200"],
  ["Blog / Artikel SEO", "Artikel optimum carian", "RM 100/artikel"],
  ["Terjemahan BM/EN/CN", "Website pelbagai bahasa", "RM 100/bahasa"],
];

const maint = [
  { name: "Basic", price: "RM 80", note: "Untuk website ringkas", feats: ["Hosting & domain renewal", "Backup bulanan", "1 kemas kini kandungan", "Pemantauan uptime"] },
  { name: "Standard", price: "RM 180", note: "Untuk bisnes aktif", feats: ["Semua dalam Basic", "4 kemas kini kandungan", "Backup mingguan", "Laporan prestasi bulanan"] },
  { name: "Premium", price: "RM 350", note: "Untuk bisnes berkembang", feats: ["Semua dalam Standard", "Kemas kini tanpa had", "Sokongan keutamaan", "Optimum SEO berterusan"] },
];

const faq = [
  { q: "Betul ke draft percuma?", a: "Betul. Saya buatkan draft awal dulu tanpa bayaran. Berkenan baru teruskan. Tiada paksaan." },
  { q: "Berapa lama nak siap?", a: "Starter 5–7 hari, Professional 10–14 hari, Enterprise 21–30 hari - bergantung skop." },
  { q: "Macam mana nak bayar?", a: "DuitNow QR atau transfer bank. Biasanya deposit dulu, baki bila siap dan anda puas hati." },
  { q: "Boleh ubah selepas siap?", a: "Setiap pakej ada kuota revision. Selepas tu perubahan kecil boleh dibincang dengan caj minimum." },
];

export default function ServisPage() {
  return (
    <>
      <header className="phero">
        <div className="wrap">
          <span className="eyebrow">Servis &amp; Harga</span>
          <h1>Pilih pakej yang <span className="g">sesuai</span>.</h1>
          <p>Harga jelas, tiada caj tersembunyi. Setiap pakej direka untuk bawa bisnes anda ke online dengan yakin.</p>
        </div>
      </header>

      <section style={{ paddingTop: 20 }}>
        <div className="wrap">
          <div className="plans">
            {plans.map((p) => (
              <ScrollReveal key={p.name} direction="scale">
                <div className={`plan ${p.pop ? "pop" : ""}`}>
                  {p.pop && <div className="rb">Popular</div>}
                  <div className="pn">{p.name}</div>
                  <div className="amt">{p.price}</div>
                  <div className="pp">{p.note}</div>
                  <ul>
                    {p.feats.map(([f, on]) => (
                      <li key={f} className={on ? "" : "off"}>
                        <span className={on ? "c" : "x"}>{on ? "✓" : "✕"}</span> {f}
                      </li>
                    ))}
                  </ul>
                  <Link href="/hubungi" className={`btn ${p.btn}`}>{p.cta}</Link>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <section className="pf-sec">
        <div className="wrap">
          <ScrollReveal className="sec-head">
            <span className="eyebrow">Add-ons</span>
            <h2>Tambah ikut keperluan</h2>
          </ScrollReveal>
          <div className="addons">
            {addons.map(([h, d, pr]) => (
              <div className="addon" key={h}>
                <div className="l"><h3>{h}</h3><p>{d}</p></div>
                <div className="pr">{pr}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section>
        <div className="wrap">
          <ScrollReveal className="sec-head">
            <span className="eyebrow">Penyelenggaraan</span>
            <h2>Pelan maintenance bulanan</h2>
          </ScrollReveal>
          <div className="plans">
            {maint.map((m) => (
              <ScrollReveal key={m.name}>
                <div className="plan">
                  <div className="pn">{m.name}</div>
                  <div className="amt">{m.price}<small>/bln</small></div>
                  <div className="pp">{m.note}</div>
                  <ul>
                    {m.feats.map((f) => (<li key={f}><span className="c">✓</span> {f}</li>))}
                  </ul>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <section className="pf-sec">
        <div className="wrap">
          <ScrollReveal className="sec-head">
            <span className="eyebrow">Soalan Lazim</span>
            <h2>Anda mungkin tertanya</h2>
          </ScrollReveal>
          <ScrollReveal><FAQ items={faq} /></ScrollReveal>
        </div>
      </section>

      <section className="final">
        <div className="wrap">
          <ScrollReveal className="final-box" direction="scale">
            <div className="inner">
              <h2>Tak pasti pakej mana <span className="g">sesuai</span>?</h2>
              <p>Mesej kami untuk konsultasi percuma. Kita bincang keperluan anda.</p>
              <Link href="/hubungi" className="btn btn-pri" style={{ fontSize: 16, padding: "15px 30px" }}>Hubungi Kami →</Link>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
