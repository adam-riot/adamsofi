"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Article } from "@/lib/blog";
import { formatDate } from "@/lib/utils";

export default function ArticleTable({ articles }: { articles: Article[] }) {
  const router = useRouter();
  const [busy, setBusy] = useState<string | null>(null);

  async function toggle(a: Article) {
    setBusy(a.id);
    await fetch(`/api/blog/${a.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: a.title, slug: a.slug, excerpt: a.excerpt, content: a.content,
        cover_url: a.cover_url, category: a.category, tags: a.tags,
        status: a.status === "published" ? "draft" : "published",
      }),
    });
    setBusy(null);
    router.refresh();
  }

  async function remove(a: Article) {
    if (!confirm(`Padam "${a.title}"?`)) return;
    setBusy(a.id);
    await fetch(`/api/blog/${a.id}`, { method: "DELETE" });
    setBusy(null);
    router.refresh();
  }

  if (articles.length === 0) return <p className="admin-empty">Tiada artikel lagi. Tulis yang pertama!</p>;

  return (
    <table className="admin-table">
      <thead><tr><th>Tajuk</th><th>Kategori</th><th>Status</th><th>Views</th><th>Tarikh</th><th></th></tr></thead>
      <tbody>
        {articles.map((a) => (
          <tr key={a.id}>
            <td>{a.title}</td>
            <td>{a.category}</td>
            <td><span className={`badge-st ${a.status === "published" ? "st-pub" : "st-draft"}`}>{a.status}</span></td>
            <td>{a.views}</td>
            <td>{formatDate(a.updated_at)}</td>
            <td className="row-actions">
              <Link href={`/admin/artikel/${a.id}`}>Edit</Link>
              <button disabled={busy === a.id} onClick={() => toggle(a)}>
                {a.status === "published" ? "Unpublish" : "Publish"}
              </button>
              <button disabled={busy === a.id} className="danger" onClick={() => remove(a)}>Padam</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
