"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import slugify from "slugify";
import ArticleEditor from "./ArticleEditor";
import type { Article } from "@/lib/blog";

const CATS = ["Teknologi", "Bisnes Online", "Tips Website", "Tutorial", "Umum"];

export default function ArticleForm({ initial }: { initial?: Article }) {
  const router = useRouter();
  const editing = Boolean(initial);
  const [title, setTitle] = useState(initial?.title ?? "");
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(Boolean(initial));
  const [category, setCategory] = useState(initial?.category ?? "Umum");
  const [tags, setTags] = useState((initial?.tags ?? []).join(", "));
  const [excerpt, setExcerpt] = useState(initial?.excerpt ?? "");
  const [cover, setCover] = useState(initial?.cover_url ?? "");
  const [content, setContent] = useState(initial?.content ?? "");
  const [lang, setLang] = useState(initial?.lang ?? "ms");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  function onTitle(v: string) {
    setTitle(v);
    if (!slugTouched) setSlug(slugify(v, { lower: true, strict: true }));
  }

  async function save(status: "draft" | "published") {
    setErr(""); setBusy(true);
    const payload = {
      title, slug, category, excerpt, cover_url: cover, content, status, lang,
      tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
    };
    try {
      const res = await fetch(editing ? `/api/blog/${initial!.id}` : "/api/blog", {
        method: editing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (res.ok && json.success) {
        router.push("/admin/artikel");
        router.refresh();
      } else { setErr(json.error || "Gagal simpan."); setBusy(false); }
    } catch { setErr("Ralat rangkaian."); setBusy(false); }
  }

  return (
    <div>
      <h1 className="admin-h1">{editing ? "Edit Artikel" : "Tulis Artikel Baru"}</h1>
      <div className="admin-panel">
        <div className="fg"><label>Tajuk</label><input value={title} onChange={(e) => onTitle(e.target.value)} placeholder="Tajuk artikel" /></div>
        <div className="row2">
          <div className="fg"><label>Slug</label><input value={slug} onChange={(e) => { setSlug(e.target.value); setSlugTouched(true); }} /></div>
          <div className="fg"><label>Kategori</label><select value={category} onChange={(e) => setCategory(e.target.value)}>{CATS.map((c) => <option key={c}>{c}</option>)}</select></div>
        </div>
        <div className="row2">
          <div className="fg"><label>Tags (pisah dengan koma)</label><input value={tags} onChange={(e) => setTags(e.target.value)} placeholder="website, bisnes" /></div>
          <div className="fg"><label>Bahasa</label><select value={lang} onChange={(e) => setLang(e.target.value)}><option value="ms">Bahasa Melayu</option><option value="en">English</option><option value="zh">中文</option></select></div>
        </div>
        <div className="fg"><label>Cover Image URL</label><input value={cover} onChange={(e) => setCover(e.target.value)} placeholder="https://..." /></div>
        <div className="fg"><label>Excerpt</label><textarea value={excerpt} onChange={(e) => setExcerpt(e.target.value)} placeholder="Ringkasan pendek..." style={{ minHeight: 70 }} /></div>
        <div className="fg"><label>Kandungan</label><ArticleEditor value={content} onChange={setContent} /></div>
        {err && <p className="nl-err" style={{ marginBottom: 12 }}>{err}</p>}
        <div className="admin-actions">
          <button className="btn btn-gho" disabled={busy} onClick={() => save("draft")}>Simpan Draft</button>
          <button className="btn btn-pri" disabled={busy} onClick={() => save("published")}>{busy ? "..." : "Publish Sekarang"}</button>
        </div>
      </div>
    </div>
  );
}
