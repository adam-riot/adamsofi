"use client";

import { useMemo, useState } from "react";
import type { Article } from "@/lib/blog";
import ArticleCard from "./ArticleCard";
import type { Locale } from "@/lib/i18n/config";
import type { Dict } from "@/lib/i18n/dictionaries";

export default function BlogList({ articles, locale, dict }: { articles: Article[]; locale: Locale; dict: Dict }) {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState(0); // index into dict.blog.categories; 0 = all
  const cats = dict.blog.categories;
  // Category filter compares against the article's stored category (canonical),
  // which matches the BM category names; index 0 is "all".
  const canonicalCats = ["", "Teknologi", "Bisnes Online", "Tips Website", "Tutorial", "Umum"];

  const filtered = useMemo(() => {
    return articles.filter((a) => {
      const matchCat = cat === 0 || a.category === canonicalCats[cat];
      const matchQ = !q || a.title.toLowerCase().includes(q.toLowerCase());
      return matchCat && matchQ;
    });
  }, [articles, q, cat]);

  return (
    <>
      <div className="blog-controls">
        <input className="blog-search" placeholder={dict.blog.search} value={q} onChange={(e) => setQ(e.target.value)} />
        <div className="tabs">
          {cats.map((c, i) => (
            <button key={c} className={`tab ${cat === i ? "active" : ""}`} onClick={() => setCat(i)}>{c}</button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <p style={{ textAlign: "center", color: "var(--mute)", padding: "40px 0" }}>{dict.blog.none}</p>
      ) : (
        <div className="blog-grid">
          {filtered.map((a) => (<ArticleCard key={a.id} article={a} locale={locale} dict={dict} />))}
        </div>
      )}
    </>
  );
}
