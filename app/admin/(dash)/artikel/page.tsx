import Link from "next/link";
import { listArticles } from "@/lib/admin";
import ArticleTable from "@/components/admin/ArticleTable";

export const dynamic = "force-dynamic";

export default async function AdminArtikel() {
  const articles = await listArticles();
  return (
    <div>
      <div className="admin-head-row">
        <h1 className="admin-h1">Artikel</h1>
        <Link href="/admin/artikel/baru" className="btn btn-pri">Tulis Artikel Baru →</Link>
      </div>
      <div className="admin-panel">
        <ArticleTable articles={articles} />
      </div>
    </div>
  );
}
