"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowser } from "@/lib/supabase-browser";

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr(""); setLoading(true);
    try {
      const supabase = createSupabaseBrowser();
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) { setErr(error.message); setLoading(false); return; }
      router.push("/admin");
      router.refresh();
    } catch {
      setErr("Login gagal. Pastikan Supabase dikonfigurasi.");
      setLoading(false);
    }
  }

  return (
    <div className="admin-login">
      <form className="admin-login-card" onSubmit={submit}>
        <div className="logo" style={{ justifyContent: "center", marginBottom: 8 }}>
          <span className="mk"><span className="gd" /><span className="ag">&lt;</span><span className="ax">A</span><span className="ag r">&gt;</span></span>
          <span className="word">adam<span className="g">sofi</span><span className="pd">.</span></span>
        </div>
        <h1>Admin Login</h1>
        <div className="fg"><label>Emel</label><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required /></div>
        <div className="fg"><label>Kata Laluan</label><input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required /></div>
        <button type="submit" className="btn btn-pri" disabled={loading} style={{ width: "100%", justifyContent: "center" }}>
          {loading ? "Log masuk..." : "Log Masuk →"}
        </button>
        {err && <p className="nl-err" style={{ marginTop: 12, textAlign: "center" }}>{err}</p>}
      </form>
    </div>
  );
}
