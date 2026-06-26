import Link from "next/link";
import type { Article } from "@/lib/articles";
import { formatDate, readingTime } from "@/lib/utils";

export default function ArticleCard({ article }: { article: Article }) {
  return (
    <Link href={`/blog/${article.slug}`} className="acard">
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
          <span>{readingTime(article.content)} min baca</span>
        </div>
        <span className="acard-link">Baca Artikel →</span>
      </div>
    </Link>
  );
}
