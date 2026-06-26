import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import slugify from "slugify";
import { getArticle, getPublishedArticles, getRelatedArticles } from "@/lib/articles";
import { formatDate, readingTime, stripHtml } from "@/lib/utils";
import { SITE_URL } from "@/lib/demos";
import ArticleCard from "@/components/blog/ArticleCard";
import NewsletterBox from "@/components/blog/NewsletterBox";
import ShareButtons from "@/components/blog/ShareButtons";
import ScrollReveal from "@/components/ui/ScrollReveal";

export const revalidate = 300;

export async function generateStaticParams() {
  const articles = await getPublishedArticles();
  return articles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticle(slug);
  if (!article) return { title: "Artikel tidak dijumpai" };
  return {
    title: article.title,
    description: article.excerpt || stripHtml(article.content).slice(0, 150),
    alternates: { canonical: `/blog/${article.slug}` },
    openGraph: {
      type: "article",
      title: article.title,
      description: article.excerpt || "",
      url: `${SITE_URL}/blog/${article.slug}`,
      images: article.cover_url ? [article.cover_url] : ["/og-image.png"],
    },
  };
}

function buildToc(html: string) {
  const toc: { id: string; text: string; level: number }[] = [];
  const out = html.replace(/<h([23])>(.*?)<\/h\1>/g, (_m, lvl: string, inner: string) => {
    const text = stripHtml(inner);
    const id = slugify(text, { lower: true, strict: true });
    toc.push({ id, text, level: Number(lvl) });
    return `<h${lvl} id="${id}">${inner}</h${lvl}>`;
  });
  return { html: out, toc };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await getArticle(slug);
  if (!article) notFound();

  const { html, toc } = buildToc(article.content);
  const related = await getRelatedArticles(article.category, article.slug);
  const url = `${SITE_URL}/blog/${article.slug}`;

  const ld = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.excerpt,
    datePublished: article.published_at,
    dateModified: article.updated_at,
    author: { "@type": "Person", name: "Adam" },
    publisher: { "@type": "Organization", name: "AdamSofi" },
    mainEntityOfPage: url,
    image: article.cover_url || `${SITE_URL}/og-image.png`,
  };

  return (
    <article className="post">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <div className="wrap post-wrap">
        <Link href="/blog" className="post-back">← Semua Artikel</Link>
        <div className="post-head">
          <span className="post-cat">{article.category}</span>
          <h1>{article.title}</h1>
          <div className="post-meta">
            <span>{formatDate(article.published_at)}</span><span>·</span>
            <span>{readingTime(article.content)} min baca</span><span>·</span>
            <span>{article.views} tontonan</span>
          </div>
        </div>

        {article.cover_url && (
          <div className="post-cover">
            <Image src={article.cover_url} alt={article.title} width={1200} height={630} style={{ width: "100%", height: "auto" }} />
          </div>
        )}

        <div className="post-layout">
          {toc.length > 1 && (
            <aside className="post-toc">
              <div className="toc-title">Kandungan</div>
              <ul>
                {toc.map((t) => (
                  <li key={t.id} className={t.level === 3 ? "lvl3" : ""}>
                    <a href={`#${t.id}`}>{t.text}</a>
                  </li>
                ))}
              </ul>
            </aside>
          )}
          <div className="post-content" dangerouslySetInnerHTML={{ __html: html }} />
        </div>

        <ShareButtons url={url} title={article.title} />

        <div className="author-box">
          <div className="author-av">A</div>
          <div>
            <strong>Ditulis oleh Adam</strong>
            <p>Web Developer &amp; Cikgu IT — bantu bisnes Malaysia ke online.</p>
          </div>
        </div>

        <div style={{ margin: "40px 0" }}><NewsletterBox /></div>

        {related.length > 0 && (
          <div className="related">
            <h2 className="sec-head" style={{ marginBottom: 24, fontSize: 26 }}>Artikel berkaitan</h2>
            <div className="blog-grid">
              {related.map((a) => (<ArticleCard key={a.id} article={a} />))}
            </div>
          </div>
        )}

        <ScrollReveal>
          <div style={{ textAlign: "center", marginTop: 40 }}>
            <Link href="/blog" className="btn btn-gho">← Kembali ke Blog</Link>
          </div>
        </ScrollReveal>
      </div>
    </article>
  );
}
