"use client";

import { useState } from "react";
import type { Dict } from "@/lib/i18n/dictionaries";
import type { Locale } from "@/lib/i18n/config";

export default function EbookBuyForm({ ebookId, locale, dict }: { ebookId: string; locale: Locale; dict: Dict }) {
  const t = dict.ebook.form;
  const [state, setState] = useState<"idle" | "loading" | "err">("idle");
  const [err, setErr] = useState("");

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const name = String(fd.get("name") || "").trim();
    const email = String(fd.get("email") || "").trim();
    if (!name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErr(t.errFill); setState("err"); return;
    }
    setState("loading"); setErr("");
    try {
      const res = await fetch("/api/ebook/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ebookId, name, email, phone: fd.get("whatsapp") || undefined, locale }),
      });
      const json = await res.json();
      if (res.ok && json.success && json.url) {
        window.location.href = json.url;
      } else { setState("err"); setErr(json.error || t.err); }
    } catch { setState("err"); setErr(t.err); }
  }

  return (
    <form className="form-card" onSubmit={submit}>
      <div className="fg"><label>{t.nama} <span className="req">*</span></label><input name="name" required /></div>
      <div className="fg"><label>{t.email} <span className="req">*</span></label><input name="email" type="email" required /></div>
      <div className="fg"><label>{t.whatsapp}</label><input name="whatsapp" type="tel" placeholder="0123456789" /></div>
      <button type="submit" className="btn btn-pri" disabled={state === "loading"} style={{ width: "100%" }}>
        {state === "loading" ? t.sending : t.submit}
      </button>
      {state === "err" && <p className="nl-err" style={{ marginTop: 12 }}>{err}</p>}
      <p style={{ marginTop: 14, fontSize: 13, color: "var(--mute)", textAlign: "center" }}>{t.note}</p>
    </form>
  );
}
