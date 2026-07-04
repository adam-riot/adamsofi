import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/admin/", "/demos/leads/"] },
    sitemap: "https://adamsofi.com/sitemap.xml",
  };
}
