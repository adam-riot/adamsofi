import { createSupabaseServer, hasSupabase } from "./supabase-server";
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

async function countWhere(table: string, col?: string, val?: string) {
  if (!hasSupabase) return 0;
  try {
    const supabase = await createSupabaseServer();
    let q = supabase.from(table).select("*", { count: "exact", head: true });
    if (col && val) q = q.eq(col, val);
    const { count } = await q;
    return count ?? 0;
  } catch { return 0; }
}

export async function getDashboardData() {
  const [artPub, artDraft, subActive, subUnsub, inqNew, inqTotal] = await Promise.all([
    countWhere("articles", "status", "published"),
    countWhere("articles", "status", "draft"),
    countWhere("subscribers", "status", "active"),
    countWhere("subscribers", "status", "unsubscribed"),
    countWhere("inquiries", "status", "new"),
    countWhere("inquiries"),
  ]);

  // page views last 7 days
  const days: { day: string; count: number }[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(); d.setDate(d.getDate() - i);
    days.push({ day: d.toISOString().slice(0, 10), count: 0 });
  }
  if (hasSupabase) {
    try {
      const supabase = await createSupabaseServer();
      const since = new Date(); since.setDate(since.getDate() - 6); since.setHours(0, 0, 0, 0);
      const { data } = await supabase.from("page_views").select("created_at").gte("created_at", since.toISOString());
      (data ?? []).forEach((r: { created_at: string }) => {
        const key = r.created_at.slice(0, 10);
        const slot = days.find((x) => x.day === key);
        if (slot) slot.count++;
      });
    } catch { /* noop */ }
  }

  const recentInquiries = await listInquiries(5);
  const recentSubscribers = await listSubscribers(5);

  return {
    articles: { published: artPub, draft: artDraft },
    subscribers: { active: subActive, unsubscribed: subUnsub },
    inquiries: { new: inqNew, total: inqTotal },
    views7: days,
    recentInquiries, recentSubscribers,
  };
}

export async function listArticles(): Promise<Article[]> {
  if (!hasSupabase) return [];
  try {
    const supabase = await createSupabaseServer();
    const { data } = await supabase.from("articles").select("*").order("updated_at", { ascending: false });
    return (data as Article[]) ?? [];
  } catch { return []; }
}

export async function getArticleById(id: string): Promise<Article | null> {
  if (!hasSupabase) return null;
  try {
    const supabase = await createSupabaseServer();
    const { data } = await supabase.from("articles").select("*").eq("id", id).maybeSingle();
    return (data as Article) ?? null;
  } catch { return null; }
}

export async function listSubscribers(limit?: number): Promise<Subscriber[]> {
  if (!hasSupabase) return [];
  try {
    const supabase = await createSupabaseServer();
    let q = supabase.from("subscribers").select("*").order("subscribed_at", { ascending: false });
    if (limit) q = q.limit(limit);
    const { data } = await q;
    return (data as Subscriber[]) ?? [];
  } catch { return []; }
}

export async function listInquiries(limit?: number): Promise<Inquiry[]> {
  if (!hasSupabase) return [];
  try {
    const supabase = await createSupabaseServer();
    let q = supabase.from("inquiries").select("*").order("created_at", { ascending: false });
    if (limit) q = q.limit(limit);
    const { data } = await q;
    return (data as Inquiry[]) ?? [];
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
  if (hasSupabase) {
    try {
      const supabase = await createSupabaseServer();
      const { count } = await supabase.from("page_views").select("*", { count: "exact", head: true });
      totalViews = count ?? 0;
      const { data } = await supabase.from("page_views").select("page");
      const tally: Record<string, number> = {};
      (data ?? []).forEach((r: { page: string }) => { tally[r.page] = (tally[r.page] || 0) + 1; });
      Object.entries(tally).sort((a, b) => b[1] - a[1]).slice(0, 5)
        .forEach(([page, c]) => topPages.push({ page, count: c }));
    } catch { /* noop */ }
  }

  return { topArticles, byPakej, totalViews, topPages, inquiries };
}
