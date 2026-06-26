"use client";

import { useState } from "react";

const PAKEJ = ["Starter — RM 500", "Professional — RM 1,200", "Enterprise — RM 2,500+", "Belum pasti / Nak tanya dulu"];
const ADDONS = [
  "Domain .my / .com.my (RM80/thn)", "Email Rasmi (RM120/thn)", "Logo Design (RM200–400)",
  "Copywriting (RM150/hlmn)", "Google My Business (RM150)", "Facebook Pixel + Analytics (RM200)",
  "Blog / Artikel SEO (RM100/artikel)", "Terjemahan BM/EN/CN (RM100/bahasa)",
];

export default function HubungiForm() {
  const [addons, setAddons] = useState<string[]>([]);
  const [state, setState] = useState<"idle" | "loading" | "ok" | "err">("idle");
  const [err, setErr] = useState("");

  const toggle = (a: string) =>
    setAddons((p) => (p.includes(a) ? p.filter((x) => x !== a) : [...p, a]));

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState("loading"); setErr("");
    const fd = new FormData(e.currentTarget);
    const payload = {
      nama: fd.get("nama"), whatsapp: fd.get("whatsapp"), email: fd.get("email"),
      bisnes: fd.get("bisnes"), pakej: fd.get("pakej"), penerangan: fd.get("penerangan"), addons,
    };
    try {
      const res = await fetch("/api/hubungi", {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (res.ok && json.success) setState("ok");
      else { setState("err"); setErr(json.error || "Gagal hantar."); }
    } catch { setState("err"); setErr("Gagal hantar. Cuba lagi atau WhatsApp kami."); }
  }

  if (state === "ok") {
    return (
      <div className="form-card">
        <div className="success-msg" style={{ display: "block" }}>
          ✅ <b>Terima kasih!</b> Kami akan hubungi anda dalam masa 24 jam.<br />Semak WhatsApp atau email anda.
        </div>
      </div>
    );
  }

  return (
    <form className="form-card" onSubmit={submit}>
      <div className="row2">
        <div className="fg"><label>Nama Penuh <span className="req">*</span></label><input name="nama" placeholder="Nama anda" required /></div>
        <div className="fg"><label>Nombor WhatsApp <span className="req">*</span></label><input name="whatsapp" type="tel" placeholder="0123456789" required /></div>
      </div>
      <div className="row2">
        <div className="fg"><label>Emel <span className="req">*</span></label><input name="email" type="email" placeholder="anda@email.com" required /></div>
        <div className="fg"><label>Nama Bisnes <span className="req">*</span></label><input name="bisnes" placeholder="Nama bisnes anda" required /></div>
      </div>
      <div className="fg">
        <label>Jenis Pakej <span className="req">*</span></label>
        <select name="pakej" required defaultValue="">
          <option value="" disabled>— Pilih pakej —</option>
          {PAKEJ.map((p) => (<option key={p}>{p}</option>))}
        </select>
      </div>
      <div className="fg">
        <label>Add-ons (pilihan)</label>
        <div className="checks">
          {ADDONS.map((a) => (
            <label className="chk" key={a}>
              <input type="checkbox" checked={addons.includes(a)} onChange={() => toggle(a)} /> {a}
            </label>
          ))}
        </div>
      </div>
      <div className="fg">
        <label>Penerangan Ringkas <span className="req">*</span></label>
        <textarea name="penerangan" placeholder="Cerita sikit tentang bisnes anda dan apa yang anda perlukan..." required />
      </div>
      <button type="submit" className="btn btn-pri" disabled={state === "loading"}>
        {state === "loading" ? "Menghantar..." : "Hantar Permintaan →"}
      </button>
      {state === "err" && <p className="nl-err" style={{ marginTop: 12 }}>{err}</p>}
    </form>
  );
}
