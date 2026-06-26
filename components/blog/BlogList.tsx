"use client";

import { useMemo, useState } from "react";
import type { Article } from "@/lib/blog";
import { BLOG_CATEGORIES } from "@/lib/blog";
import ArticleCard from "./ArticleCard";

export default function BlogList({ articles }: { articles: Article[] }) {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("Semua");

  const filtered = useMemo(() => {
    return articles.filter((a) => {
      const matchCat = cat === "Semua" || a.category === cat;
      const matchQ = !q || a.title.toLowerCase().includes(q.toLowerCase());
      return matchCat && matchQ;
    });
  }, [articles, q, cat]);

  return (
    <>
      <div className="blog-controls">
        <input
          className="blog-search"
          placeholder="🔍 Cari artikel..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <div className="tabs">
          {BLOG_CATEGORIES.map((c) => (
            <button key={c} className={`tab ${cat === c ? "active" : ""}`} onClick={() => setCat(c)}>
              {c}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <p style={{ textAlign: "center", color: "var(--mute)", padding: "40px 0" }}>
          Tiada artikel dijumpai.
        </p>
      ) : (
        <div className="blog-grid">
          {filtered.map((a) => (<ArticleCard key={a.id} article={a} />))}
        </div>
      )}
    </>
  );
}
