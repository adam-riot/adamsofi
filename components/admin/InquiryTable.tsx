"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Inquiry } from "@/lib/admin";
import { formatDate } from "@/lib/utils";

export default function InquiryTable({ inquiries }: { inquiries: Inquiry[] }) {
  const router = useRouter();
  const [busy, setBusy] = useState<string | null>(null);

  async function setStatus(id: string, status: string) {
    setBusy(id);
    await fetch(`/api/inquiries/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    setBusy(null);
    router.refresh();
  }

  if (inquiries.length === 0) return <p className="admin-empty">Tiada inquiry lagi.</p>;

  return (
    <table className="admin-table">
      <thead><tr><th>Nama / Bisnes</th><th>Pakej</th><th>Add-ons</th><th>Tarikh</th><th>Status</th><th></th></tr></thead>
      <tbody>
        {inquiries.map((i) => (
          <tr key={i.id}>
            <td><b>{i.nama}</b><br /><span className="muted-sm">{i.bisnes}</span></td>
            <td>{i.pakej}</td>
            <td className="muted-sm">{i.addons.length ? i.addons.join(", ") : "-"}</td>
            <td>{formatDate(i.created_at)}</td>
            <td>
              <select className="st-select" value={i.status} disabled={busy === i.id} onChange={(e) => setStatus(i.id, e.target.value)}>
                <option value="new">new</option>
                <option value="contacted">contacted</option>
                <option value="closed">closed</option>
              </select>
            </td>
            <td className="row-actions">
              <a href={`https://wa.me/${i.whatsapp.replace(/\D/g, "")}`} target="_blank" rel="noopener">WhatsApp</a>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
