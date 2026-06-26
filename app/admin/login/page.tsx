"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

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
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const json = await res.json();
      if (res.ok && json.success) {
        router.push("/admin");
        router.refresh();
      } else { setErr(json.error || "Login gagal."); setLoading(false); }
    } catch {
      setErr("Login gagal. Cuba lagi."); setLoading(false);
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
