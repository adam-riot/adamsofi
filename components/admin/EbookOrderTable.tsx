"use client";

import { useState } from "react";
import type { EbookOrder } from "@/lib/admin";
import { formatDate, formatRM } from "@/lib/utils";

export default function EbookOrderTable({ orders }: { orders: EbookOrder[] }) {
  const [busy, setBusy] = useState<string | null>(null);
  const [result, setResult] = useState<Record<string, "ok" | "err" | undefined>>({});

  async function resend(o: EbookOrder) {
    if (!confirm(`Hantar semula ebook "${o.ebook_title}" kepada ${o.buyer_email}?`)) return;
    setBusy(o.id);
    setResult((r) => ({ ...r, [o.id]: undefined }));
    try {
      const res = await fetch("/api/ebook/resend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId: o.id }),
      });
      const json = await res.json();
      setResult((r) => ({ ...r, [o.id]: res.ok && json.success ? "ok" : "err" }));
    } catch {
      setResult((r) => ({ ...r, [o.id]: "err" }));
    }
    setBusy(null);
  }

  return (
    <table className="admin-table">
      <thead><tr><th>Pembeli</th><th>Ebook</th><th>Jumlah</th><th>Status</th><th>Tarikh</th><th></th></tr></thead>
      <tbody>
        {orders.map((o) => (
          <tr key={o.id}>
            <td>{o.buyer_name}<br /><span style={{ color: "var(--mute)", fontSize: 13 }}>{o.buyer_email}</span></td>
            <td>{o.ebook_title}</td>
            <td>{formatRM(o.amount)}</td>
            <td><span className={`badge-st ${o.status === "paid" ? "st-pub" : "st-draft"}`}>{o.status}</span></td>
            <td>{formatDate(o.paid_at || o.created_at)}</td>
            <td className="row-actions">
              {o.status === "paid" && (
                <button disabled={busy === o.id} onClick={() => resend(o)}>
                  {busy === o.id ? "..." : "Hantar Semula"}
                </button>
              )}
              {result[o.id] === "ok" && <span style={{ color: "var(--green)", fontSize: 13, marginLeft: 8 }}>✓ Dihantar</span>}
              {result[o.id] === "err" && <span className="nl-err" style={{ marginLeft: 8 }}>Gagal</span>}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
