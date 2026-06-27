"use client";

import { useState } from "react";
import type { Dict } from "@/lib/i18n/dictionaries";

export default function NewsletterBox({ dict }: { dict: Dict }) {
  const t = dict.newsletter;
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "ok" | "err">("idle");
  const [msg, setMsg] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setState("loading");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name }),
      });
      const json = await res.json();
      if (res.ok && json.success) { setState("ok"); setMsg(t.ok); }
      else { setState("err"); setMsg(json.error || t.err); }
    } catch {
      setState("err"); setMsg(t.err);
    }
  }

  return (
    <div className="newsletter-box">
      <span className="eyebrow">{t.eyebrow}</span>
      <h3>{t.h3}</h3>
      <p>{t.p}</p>
      {state === "ok" ? (
        <div className="nl-ok">{msg}</div>
      ) : (
        <form onSubmit={submit} className="nl-form">
          <input type="text" placeholder={t.name} value={name} onChange={(e) => setName(e.target.value)} />
          <input type="email" placeholder={t.email} required value={email} onChange={(e) => setEmail(e.target.value)} />
          <button type="submit" className="btn btn-pri" disabled={state === "loading"}>
            {state === "loading" ? t.sending : t.button}
          </button>
          {state === "err" && <p className="nl-err">{msg}</p>}
        </form>
      )}
    </div>
  );
}
