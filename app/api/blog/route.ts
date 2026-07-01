import { NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import slugify from "slugify";
import { sql, hasDb } from "@/lib/db";
import { isAdmin } from "@/lib/session";
import { broadcastArticle } from "@/lib/broadcast";

export async function POST(req: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!hasDb) return NextResponse.json({ error: "DB belum dikonfigurasi." }, { status: 503 });

  try {
    const b = await req.json();
    const noEm = (s: unknown) => (typeof s === "string" ? s.replace(/—/g, "-") : s);
    const title = noEm(b.title) as string;
    const excerpt = (noEm(b.excerpt) as string) || null;
    const content = (noEm(b.content) as string) || "";
    const category = (noEm(b.category) as string) || "Umum";
    const slug = (b.slug?.trim() || slugify(title || "", { lower: true, strict: true })).slice(0, 120);
    const publishing = b.status === "published";
    const tags: string[] = Array.isArray(b.tags) ? b.tags.map((t: string) => t.replace(/—/g, "-")) : [];

    const lang = ["ms", "en", "zh"].includes(b.lang) ? b.lang : "ms";
    const rows = await sql!`
      INSERT INTO articles (title, slug, excerpt, content, cover_url, category, tags, status, lang, published_at)
      VALUES (${title}, ${slug}, ${excerpt}, ${content}, ${b.cover_url || null},
              ${category}, ${tags}, ${b.status || "draft"}, ${lang},
              ${publishing ? new Date().toISOString() : null})
      RETURNING *`;
    const article = rows[0];

    revalidateTag("articles");
    revalidatePath("/blog"); revalidatePath("/");
    if (publishing) { revalidatePath(`/blog/${slug}`); await broadcastArticle(article as never); }
    return NextResponse.json({ success: true, article });
  } catch (e) {
    const msg = e instanceof Error && /unique/i.test(e.message) ? "Slug sudah wujud." : "Ralat pelayan.";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
