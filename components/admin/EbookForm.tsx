"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import slugify from "slugify";
import type { Ebook } from "@/lib/ebooks";

export default function EbookForm({ initial }: { initial?: Ebook }) {
  const router = useRouter();
  const editing = Boolean(initial);
  const [title, setTitle] = useState(initial?.title ?? "");
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(Boolean(initial));
  const [description, setDescription] = useState(initial?.description ?? "");
  const [cover, setCover] = useState(initial?.cover_url ?? "");
  const [fileUrl, setFileUrl] = useState(initial?.file_url ?? "");
  const [price, setPrice] = useState(initial ? (initial.price / 100).toFixed(2) : "");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  function onTitle(v: string) {
    setTitle(v);
    if (!slugTouched) setSlug(slugify(v, { lower: true, strict: true }));
  }

  async function save(status: "draft" | "published") {
    setErr(""); setBusy(true);
    const payload = {
      title, slug, description, cover_url: cover, file_url: fileUrl,
      price: Math.round(Number(price) * 100), status,
    };
    try {
      const res = await fetch(editing ? `/api/ebook/${initial!.id}` : "/api/ebook", {
        method: editing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (res.ok && json.success) {
        router.push("/admin/ebook");
        router.refresh();
      } else { setErr(json.error || "Gagal simpan."); setBusy(false); }
    } catch { setErr("Ralat rangkaian."); setBusy(false); }
  }

  return (
    <div>
      <h1 className="admin-h1">{editing ? "Edit Ebook" : "Tambah Ebook Baru"}</h1>
      <div className="admin-panel">
        <div className="fg"><label>Tajuk</label><input value={title} onChange={(e) => onTitle(e.target.value)} placeholder="Tajuk ebook" /></div>
        <div className="row2">
          <div className="fg"><label>Slug</label><input value={slug} onChange={(e) => { setSlug(e.target.value); setSlugTouched(true); }} /></div>
          <div className="fg"><label>Harga (RM)</label><input type="number" min="0" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="29.00" /></div>
        </div>
        <div className="fg"><label>Cover Image URL</label><input value={cover} onChange={(e) => setCover(e.target.value)} placeholder="https://..." /></div>
        <div className="fg"><label>Fail PDF URL</label><input value={fileUrl} onChange={(e) => setFileUrl(e.target.value)} placeholder="https://... (Vercel Blob / Google Drive / dsb)" /></div>
        <div className="fg"><label>Penerangan</label><textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Penerangan jualan ringkas..." style={{ minHeight: 120 }} /></div>
        {err && <p className="nl-err" style={{ marginBottom: 12 }}>{err}</p>}
        <div className="admin-actions">
          <button className="btn btn-gho" disabled={busy} onClick={() => save("draft")}>Simpan Draft</button>
          <button className="btn btn-pri" disabled={busy} onClick={() => save("published")}>{busy ? "..." : "Publish Sekarang"}</button>
        </div>
      </div>
    </div>
  );
}
