"use client";

import { useState } from "react";

export default function NewsletterBox() {
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
      if (res.ok && json.success) {
        setState("ok");
        setMsg("✅ Terima kasih! Semak email anda.");
      } else {
        setState("err");
        setMsg(json.error || "Gagal subscribe. Cuba lagi.");
      }
    } catch {
      setState("err");
      setMsg("Gagal subscribe. Cuba lagi.");
    }
  }

  return (
    <div className="newsletter-box">
      <span className="eyebrow">Newsletter</span>
      <h3>Dapat tips website &amp; bisnes terus ke inbox</h3>
      <p>Artikel baru, tips praktikal, dan update — tiada spam.</p>
      {state === "ok" ? (
        <div className="nl-ok">{msg}</div>
      ) : (
        <form onSubmit={submit} className="nl-form">
          <input
            type="text"
            placeholder="Nama (pilihan)"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="email"
            placeholder="Emel anda"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button type="submit" className="btn btn-pri" disabled={state === "loading"}>
            {state === "loading" ? "Menghantar..." : "Subscribe →"}
          </button>
          {state === "err" && <p className="nl-err">{msg}</p>}
        </form>
      )}
    </div>
  );
}
