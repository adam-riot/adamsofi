import { unstable_cache } from "next/cache";
import { sql, hasDb } from "./db";

export type Ebook = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  cover_url: string | null;
  file_url: string;
  price: number; // sen
  status: "draft" | "published";
  created_at: string;
  updated_at: string;
};

// Cached reads, invalidated via revalidateTag("ebooks") on publish/update/delete.
// Mirrors lib/articles.ts.

export const getPublishedEbooks = unstable_cache(
  async (): Promise<Ebook[]> => {
    if (!hasDb) return [];
    try {
      const rows = await sql!`
        SELECT * FROM ebooks WHERE status = 'published' ORDER BY created_at DESC`;
      return rows as Ebook[];
    } catch { return []; }
  },
  ["published-ebooks"],
  { revalidate: 300, tags: ["ebooks"] }
);

export type OrderStatus = { status: "pending" | "paid" | "failed"; ebookTitle: string; downloadToken: string } | null;

/** Not cached — must reflect real-time payment status on the thank-you page. */
export async function getOrderStatus(orderId: string): Promise<OrderStatus> {
  if (!hasDb) return null;
  try {
    const rows = await sql!`
      SELECT o.status, o.download_token, e.title AS ebook_title
      FROM ebook_orders o JOIN ebooks e ON e.id = o.ebook_id
      WHERE o.id = ${orderId} LIMIT 1`;
    const r = rows[0];
    return r ? { status: r.status, ebookTitle: r.ebook_title, downloadToken: r.download_token } : null;
  } catch { return null; }
}

export const getEbookBySlug = unstable_cache(
  async (slug: string): Promise<Ebook | null> => {
    if (!hasDb) return null;
    try {
      const rows = await sql!`
        SELECT * FROM ebooks WHERE slug = ${slug} AND status = 'published' LIMIT 1`;
      return (rows[0] as Ebook) ?? null;
    } catch { return null; }
  },
  ["ebook-by-slug"],
  { revalidate: 300, tags: ["ebooks"] }
);
