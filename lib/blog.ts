// Client-safe blog types & constants (no server-only imports here).

export type Article = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  cover_url: string | null;
  category: string;
  tags: string[];
  status: "draft" | "published";
  views: number;
  published_at: string | null;
  created_at: string;
  updated_at: string;
};

export const BLOG_CATEGORIES = ["Semua", "Teknologi", "Bisnes Online", "Tips Website", "Tutorial", "Umum"];
