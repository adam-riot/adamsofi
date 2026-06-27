import Link from "next/link";
import type { Article } from "@/lib/blog";
import { formatDate, readingTime } from "@/lib/utils";
import { lhref, type Locale } from "@/lib/i18n/config";
import type { Dict } from "@/lib/i18n/dictionaries";

export default function ArticleCard({ article, locale, dict }: { article: Article; locale: Locale; dict: Dict }) {
  return (
    <Link href={lhref(locale, `/blog/${article.slug}`)} className="acard">
      <div className="acard-cover" style={article.cover_url ? { backgroundImage: `url(${article.cover_url})` } : undefined}>
        {!article.cover_url && <span className="acard-mono">&lt;/&gt;</span>}
        <span className="acard-cat">{article.category}</span>
      </div>
      <div className="acard-body">
        <h3>{article.title}</h3>
        <p>{article.excerpt}</p>
        <div className="acard-meta">
          <span>{formatDate(article.published_at)}</span>
          <span>·</span>
          <span>{readingTime(article.content)} {dict.blog.minRead}</span>
        </div>
        <span className="acard-link">{dict.blog.readArticle}</span>
      </div>
    </Link>
  );
}
