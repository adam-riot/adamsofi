import { unstable_cache } from "next/cache";
import { sql, hasDb } from "./db";
import type { Article } from "./blog";

export type { Article };

// Cached reads: the render stays dynamic (for the CSP nonce) but the DB is only
// hit on a cache miss, so cross-region Neon latency is off the hot path.
// Invalidated via revalidateTag("articles") on publish/update/delete.

export const getPublishedArticles = unstable_cache(
  async (lang = "ms"): Promise<Article[]> => {
    if (!hasDb) return [];
    try {
      const rows = await sql!`
        SELECT * FROM articles WHERE status = 'published' AND lang = ${lang}
        ORDER BY published_at DESC NULLS LAST`;
      return rows as Article[];
    } catch { return []; }
  },
  ["published-articles"],
  { revalidate: 300, tags: ["articles"] }
);

export const getArticle = unstable_cache(
  async (slug: string): Promise<Article | null> => {
    if (!hasDb) return null;
    try {
      const rows = await sql!`
        SELECT * FROM articles WHERE slug = ${slug} AND status = 'published' LIMIT 1`;
      return (rows[0] as Article) ?? null;
    } catch { return null; }
  },
  ["article-by-slug"],
  { revalidate: 300, tags: ["articles"] }
);

export const getRelatedArticles = unstable_cache(
  async (category: string, excludeSlug: string, lang = "ms", limit = 3): Promise<Article[]> => {
    if (!hasDb) return [];
    try {
      const rows = await sql!`
        SELECT * FROM articles
        WHERE status = 'published' AND category = ${category} AND lang = ${lang} AND slug <> ${excludeSlug}
        ORDER BY published_at DESC LIMIT ${limit}`;
      return rows as Article[];
    } catch { return []; }
  },
  ["related-articles"],
  { revalidate: 300, tags: ["articles"] }
);
