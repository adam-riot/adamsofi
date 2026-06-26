import { sql, hasDb } from "./db";
import type { Article } from "./blog";

export type { Article };

export async function getPublishedArticles(): Promise<Article[]> {
  if (!hasDb) return [];
  try {
    const rows = await sql!`
      SELECT * FROM articles WHERE status = 'published' ORDER BY published_at DESC NULLS LAST`;
    return rows as Article[];
  } catch { return []; }
}

export async function getArticle(slug: string): Promise<Article | null> {
  if (!hasDb) return null;
  try {
    const rows = await sql!`
      SELECT * FROM articles WHERE slug = ${slug} AND status = 'published' LIMIT 1`;
    return (rows[0] as Article) ?? null;
  } catch { return null; }
}

export async function getRelatedArticles(category: string, excludeSlug: string, limit = 3): Promise<Article[]> {
  if (!hasDb) return [];
  try {
    const rows = await sql!`
      SELECT * FROM articles
      WHERE status = 'published' AND category = ${category} AND slug <> ${excludeSlug}
      ORDER BY published_at DESC LIMIT ${limit}`;
    return rows as Article[];
  } catch { return []; }
}
