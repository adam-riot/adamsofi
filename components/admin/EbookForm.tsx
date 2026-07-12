"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import slugify from "slugify";
import { upload } from "@vercel/blob/client";
import type { Ebook } from "@/lib/ebooks";

const COVER_EXT: Record<string, string> = { "image/png": "png", "image/jpeg": "jpg", "image/webp": "webp" };

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

  const [coverPct, setCoverPct] = useState(0);
  const [coverErr, setCoverErr] = useState("");
  const [filePct, setFilePct] = useState(0);
  const [fileErr, setFileErr] = useState("");

  function onTitle(v: string) {
    setTitle(v);
    if (!slugTouched) setSlug(slugify(v, { lower: true, strict: true }));
  }

  async function onCoverPick(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (!slug) { setCoverErr("Isi tajuk dahulu (slug diperlukan)."); return; }
    setCoverErr(""); setCoverPct(1);
    try {
      const ext = COVER_EXT[file.type] || "png";
      const blob = await upload(`ebook-covers/${slug}/cover.${ext}`, file, {
        access: "public",
        handleUploadUrl: "/api/ebook/upload-cover",
        onUploadProgress: (p) => setCoverPct(p.percentage),
      });
      setCover(blob.url);
      setCoverPct(0);
    } catch (e) {
      setCoverErr(e instanceof Error ? e.message : "Muat naik gagal.");
      setCoverPct(0);
    }
  }

  async function onFilePick(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (!slug) { setFileErr("Isi tajuk dahulu (slug diperlukan)."); return; }
    setFileErr(""); setFilePct(1);
    try {
      const blob = await upload(`ebook-files/${slug}/ebook.pdf`, file, {
        access: "private",
        handleUploadUrl: "/api/ebook/upload-file",
        onUploadProgress: (p) => setFilePct(p.percentage),
      });
      setFileUrl(blob.pathname);
      setFilePct(0);
    } catch (e) {
      setFileErr(e instanceof Error ? e.message : "Muat naik gagal.");
      setFilePct(0);
    }
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

        <div className="fg">
          <label>Cover Image</label>
          <input type="file" accept="image/png,image/jpeg,image/webp" onChange={onCoverPick} />
          {coverPct > 0 && (
            <div style={{ marginTop: 8, height: 6, background: "var(--panel2)", borderRadius: 4, overflow: "hidden" }}>
              <div style={{ width: `${coverPct}%`, height: "100%", background: "var(--cyan)", transition: "width .2s" }} />
            </div>
          )}
          {coverErr && <p className="nl-err" style={{ marginTop: 8 }}>{coverErr}</p>}
          {cover && (
            <div style={{ marginTop: 10 }}>
              <img src={cover} alt="Cover preview" style={{ maxWidth: 160, borderRadius: 8, display: "block" }} />
              <p style={{ fontSize: 12, color: "var(--mute)", marginTop: 4, wordBreak: "break-all" }}>{cover}</p>
            </div>
          )}
        </div>

        <div className="fg">
          <label>Fail PDF Ebook</label>
          <input type="file" accept="application/pdf" onChange={onFilePick} />
          {filePct > 0 && (
            <div style={{ marginTop: 8, height: 6, background: "var(--panel2)", borderRadius: 4, overflow: "hidden" }}>
              <div style={{ width: `${filePct}%`, height: "100%", background: "var(--cyan)", transition: "width .2s" }} />
            </div>
          )}
          {fileErr && <p className="nl-err" style={{ marginTop: 8 }}>{fileErr}</p>}
          {fileUrl && (
            <p style={{ fontSize: 13, color: "var(--mute)", marginTop: 8 }}>
              ✓ Storage Path: <span style={{ color: "var(--white)", wordBreak: "break-all" }}>{fileUrl}</span>
            </p>
          )}
        </div>

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
