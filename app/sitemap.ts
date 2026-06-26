import type { MetadataRoute } from "next";
import { demos } from "@/lib/demos";
import { getPublishedArticles } from "@/lib/articles";

const BASE = "https://adamsofi.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const articles = await getPublishedArticles();

  const staticPages: MetadataRoute.Sitemap = [
    { url: `${BASE}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${BASE}/servis`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/portfolio`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/blog`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE}/hubungi`, changeFrequency: "monthly", priority: 0.8 },
  ];

  const demoPages: MetadataRoute.Sitemap = demos.map((d) => ({
    url: `${BASE}/demos/${d.slug}`,
    changeFrequency: "yearly",
    priority: 0.5,
  }));

  const articlePages: MetadataRoute.Sitemap = articles.map((a) => ({
    url: `${BASE}/blog/${a.slug}`,
    lastModified: a.updated_at,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...staticPages, ...demoPages, ...articlePages];
}
