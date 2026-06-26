import { sql, hasDb } from "./db";
import type { Article } from "./blog";

export type Subscriber = {
  id: string; email: string; name: string | null;
  status: "active" | "unsubscribed"; subscribed_at: string; unsubscribed_at: string | null;
};
export type Inquiry = {
  id: string; nama: string; whatsapp: string; email: string; bisnes: string;
  pakej: string; addons: string[]; penerangan: string | null;
  status: "new" | "contacted" | "closed"; created_at: string;
};

export async function getDashboardData() {
  const empty = {
    articles: { published: 0, draft: 0 },
    subscribers: { active: 0, unsubscribed: 0 },
    inquiries: { new: 0, total: 0 },
    views7: [] as { day: string; count: number }[],
    recentInquiries: [] as Inquiry[],
    recentSubscribers: [] as Subscriber[],
  };

  const days: { day: string; count: number }[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(); d.setDate(d.getDate() - i);
    days.push({ day: d.toISOString().slice(0, 10), count: 0 });
  }

  if (!hasDb) return { ...empty, views7: days };

  try {
    const [art, subs, inq, views, recentInq, recentSub] = await Promise.all([
      sql!`SELECT status, COUNT(*)::int AS n FROM articles GROUP BY status`,
      sql!`SELECT status, COUNT(*)::int AS n FROM subscribers GROUP BY status`,
      sql!`SELECT status, COUNT(*)::int AS n FROM inquiries GROUP BY status`,
      sql!`SELECT to_char(created_at, 'YYYY-MM-DD') AS day, COUNT(*)::int AS n
           FROM page_views WHERE created_at >= NOW() - INTERVAL '6 days' GROUP BY day`,
      sql!`SELECT * FROM inquiries ORDER BY created_at DESC LIMIT 5`,
      sql!`SELECT * FROM subscribers ORDER BY subscribed_at DESC LIMIT 5`,
    ]);

    const artMap = Object.fromEntries(art.map((r) => [r.status, r.n]));
    const subMap = Object.fromEntries(subs.map((r) => [r.status, r.n]));
    const inqMap = Object.fromEntries(inq.map((r) => [r.status, r.n]));
    views.forEach((r) => { const slot = days.find((x) => x.day === r.day); if (slot) slot.count = r.n; });

    return {
      articles: { published: artMap.published ?? 0, draft: artMap.draft ?? 0 },
      subscribers: { active: subMap.active ?? 0, unsubscribed: subMap.unsubscribed ?? 0 },
      inquiries: { new: inqMap.new ?? 0, total: (inqMap.new ?? 0) + (inqMap.contacted ?? 0) + (inqMap.closed ?? 0) },
      views7: days,
      recentInquiries: recentInq as Inquiry[],
      recentSubscribers: recentSub as Subscriber[],
    };
  } catch { return { ...empty, views7: days }; }
}

export async function listArticles(): Promise<Article[]> {
  if (!hasDb) return [];
  try { return (await sql!`SELECT * FROM articles ORDER BY updated_at DESC`) as Article[]; }
  catch { return []; }
}

export async function getArticleById(id: string): Promise<Article | null> {
  if (!hasDb) return null;
  try { const r = await sql!`SELECT * FROM articles WHERE id = ${id} LIMIT 1`; return (r[0] as Article) ?? null; }
  catch { return null; }
}

export async function listSubscribers(limit?: number): Promise<Subscriber[]> {
  if (!hasDb) return [];
  try {
    const rows = limit
      ? await sql!`SELECT * FROM subscribers ORDER BY subscribed_at DESC LIMIT ${limit}`
      : await sql!`SELECT * FROM subscribers ORDER BY subscribed_at DESC`;
    return rows as Subscriber[];
  } catch { return []; }
}

export async function listInquiries(limit?: number): Promise<Inquiry[]> {
  if (!hasDb) return [];
  try {
    const rows = limit
      ? await sql!`SELECT * FROM inquiries ORDER BY created_at DESC LIMIT ${limit}`
      : await sql!`SELECT * FROM inquiries ORDER BY created_at DESC`;
    return rows as Inquiry[];
  } catch { return []; }
}

export async function getAnalytics() {
  const articles = await listArticles();
  const topArticles = [...articles].sort((a, b) => b.views - a.views).slice(0, 5);
  const inquiries = await listInquiries();
  const byPakej: Record<string, number> = {};
  inquiries.forEach((i) => { byPakej[i.pakej] = (byPakej[i.pakej] || 0) + 1; });

  let totalViews = 0;
  const topPages: { page: string; count: number }[] = [];
  if (hasDb) {
    try {
      const tot = await sql!`SELECT COUNT(*)::int AS n FROM page_views`;
      totalViews = tot[0]?.n ?? 0;
      const tp = await sql!`SELECT page, COUNT(*)::int AS n FROM page_views GROUP BY page ORDER BY n DESC LIMIT 5`;
      tp.forEach((r) => topPages.push({ page: r.page, count: r.n }));
    } catch { /* noop */ }
  }

  return { topArticles, byPakej, totalViews, topPages, inquiries };
}
