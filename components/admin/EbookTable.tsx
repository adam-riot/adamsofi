"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Ebook } from "@/lib/ebooks";
import { formatDate, formatRM } from "@/lib/utils";

export default function EbookTable({ ebooks }: { ebooks: Ebook[] }) {
  const router = useRouter();
  const [busy, setBusy] = useState<string | null>(null);

  async function toggle(e: Ebook) {
    setBusy(e.id);
    await fetch(`/api/ebook/${e.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: e.title, slug: e.slug, description: e.description,
        cover_url: e.cover_url, file_url: e.file_url, price: e.price,
        status: e.status === "published" ? "draft" : "published",
      }),
    });
    setBusy(null);
    router.refresh();
  }

  async function remove(e: Ebook) {
    if (!confirm(`Padam "${e.title}"?`)) return;
    setBusy(e.id);
    await fetch(`/api/ebook/${e.id}`, { method: "DELETE" });
    setBusy(null);
    router.refresh();
  }

  if (ebooks.length === 0) return <p className="admin-empty">Tiada ebook lagi. Tambah yang pertama!</p>;

  return (
    <table className="admin-table">
      <thead><tr><th>Tajuk</th><th>Harga</th><th>Status</th><th>Tarikh</th><th></th></tr></thead>
      <tbody>
        {ebooks.map((e) => (
          <tr key={e.id}>
            <td>{e.title}</td>
            <td>{formatRM(e.price)}</td>
            <td><span className={`badge-st ${e.status === "published" ? "st-pub" : "st-draft"}`}>{e.status}</span></td>
            <td>{formatDate(e.updated_at)}</td>
            <td className="row-actions">
              <Link href={`/admin/ebook/${e.id}`}>Edit</Link>
              <button disabled={busy === e.id} onClick={() => toggle(e)}>
                {e.status === "published" ? "Unpublish" : "Publish"}
              </button>
              <button disabled={busy === e.id} className="danger" onClick={() => remove(e)}>Padam</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
