"use client";

import { useState } from "react";
import type { Dict } from "@/lib/i18n/dictionaries";
import WaLink from "@/components/ui/WaLink";

export default function HubungiForm({ dict }: { dict: Dict }) {
  const t = dict.hubungi;
  const [addons, setAddons] = useState<string[]>([]);
  const [state, setState] = useState<"idle" | "loading" | "ok" | "err">("idle");
  const [err, setErr] = useState("");

  const toggle = (a: string) => setAddons((p) => (p.includes(a) ? p.filter((x) => x !== a) : [...p, a]));

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
      else { setState("err"); setErr(json.error || t.errSend); }
    } catch { setState("err"); setErr(t.errSend); }
  }

  if (state === "ok") {
    return (
      <div className="form-card">
        <div className="success-msg" style={{ display: "block" }}>{t.success}</div>
        <div style={{ marginTop: 16, textAlign: "center" }}>
          <WaLink source="form-success" text={t.successWaPrefill}>{t.successWaBtn}</WaLink>
        </div>
      </div>
    );
  }

  return (
    <form className="form-card" onSubmit={submit}>
      <div className="row2">
        <div className="fg"><label>{t.nama} <span className="req">*</span></label><input name="nama" required /></div>
        <div className="fg"><label>{t.whatsapp} <span className="req">*</span></label><input name="whatsapp" type="tel" placeholder="0123456789" required /></div>
      </div>
      <div className="row2">
        <div className="fg"><label>{t.email} <span className="req">*</span></label><input name="email" type="email" required /></div>
        <div className="fg"><label>{t.bisnes} <span className="req">*</span></label><input name="bisnes" required /></div>
      </div>
      <div className="fg">
        <label>{t.pakej} <span className="req">*</span></label>
        <select name="pakej" required defaultValue="">
          <option value="" disabled>{t.pakejPlaceholder}</option>
          {t.pakejOptions.map((p) => (<option key={p}>{p}</option>))}
        </select>
      </div>
      <div className="fg">
        <label>{t.addonsLabel}</label>
        <div className="checks">
          {t.addons.map((a) => (
            <label className="chk" key={a}>
              <input type="checkbox" checked={addons.includes(a)} onChange={() => toggle(a)} /> {a}
            </label>
          ))}
        </div>
      </div>
      <div className="fg">
        <label>{t.penerangan} <span className="req">*</span></label>
        <textarea name="penerangan" placeholder={t.peneranganPh} required />
      </div>
      <button type="submit" className="btn btn-pri" disabled={state === "loading"}>
        {state === "loading" ? t.sending : t.submit}
      </button>
      {state === "err" && <p className="nl-err" style={{ marginTop: 12 }}>{err}</p>}
      <p style={{ marginTop: 14, fontSize: 13, color: "var(--mute)" }}>{t.formTrust}</p>
      <p style={{ marginTop: 6, fontSize: 13, color: "var(--mute)" }}>
        {t.orWa}{" "}
        <WaLink source="form" text={t.formWaPrefill} className="mail">{t.orWaBtn}</WaLink>
      </p>
    </form>
  );
}
