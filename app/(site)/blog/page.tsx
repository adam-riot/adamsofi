import type { Metadata } from "next";
import ScrollReveal from "@/components/ui/ScrollReveal";
import BlogList from "@/components/blog/BlogList";
import NewsletterBox from "@/components/blog/NewsletterBox";
import { getPublishedArticles } from "@/lib/articles";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Blog & Artikel",
  description: "Tips website, bisnes online, dan tutorial praktikal untuk usahawan Malaysia - dari AdamSofi.",
  alternates: { canonical: "/blog" },
};

export default async function BlogPage() {
  const articles = await getPublishedArticles();
  return (
    <>
      <header className="phero">
        <div className="wrap">
          <span className="eyebrow">Blog &amp; Artikel</span>
          <h1>Tips website &amp; <span className="g">bisnes online</span>.</h1>
          <p>Panduan praktikal untuk usahawan Malaysia bawa bisnes ke online.</p>
        </div>
      </header>

      <section style={{ paddingTop: 30 }}>
        <div className="wrap">
          {articles.length === 0 ? (
            <p style={{ textAlign: "center", color: "var(--mute)", padding: "20px 0 40px" }}>
              Artikel akan datang tak lama lagi. Subscribe untuk dapat update!
            </p>
          ) : (
            <BlogList articles={articles} />
          )}
          <div style={{ maxWidth: 760, margin: "60px auto 0" }}>
            <ScrollReveal><NewsletterBox /></ScrollReveal>
          </div>
        </div>
      </section>
    </>
  );
}
