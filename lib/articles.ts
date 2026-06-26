import { createSupabaseServer, hasSupabase } from "./supabase-server";
import type { Article } from "./blog";

export type { Article };

/** Published articles (public). Returns [] if Supabase not configured. */
export async function getPublishedArticles(): Promise<Article[]> {
  if (!hasSupabase) return [];
  try {
    const supabase = await createSupabaseServer();
    const { data, error } = await supabase
      .from("articles")
      .select("*")
      .eq("status", "published")
      .order("published_at", { ascending: false });
    if (error) return [];
    return (data as Article[]) ?? [];
  } catch {
    return [];
  }
}

export async function getArticle(slug: string): Promise<Article | null> {
  if (!hasSupabase) return null;
  try {
    const supabase = await createSupabaseServer();
    const { data } = await supabase
      .from("articles")
      .select("*")
      .eq("slug", slug)
      .eq("status", "published")
      .maybeSingle();
    return (data as Article) ?? null;
  } catch {
    return null;
  }
}

export async function getRelatedArticles(category: string, excludeSlug: string, limit = 3) {
  if (!hasSupabase) return [];
  try {
    const supabase = await createSupabaseServer();
    const { data } = await supabase
      .from("articles")
      .select("*")
      .eq("status", "published")
      .eq("category", category)
      .neq("slug", excludeSlug)
      .limit(limit);
    return (data as Article[]) ?? [];
  } catch {
    return [];
  }
}
