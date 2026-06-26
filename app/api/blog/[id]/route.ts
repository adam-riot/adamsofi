import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import slugify from "slugify";
import { sql, hasDb } from "@/lib/db";
import { isAdmin } from "@/lib/session";
import { broadcastArticle } from "@/lib/broadcast";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!hasDb) return NextResponse.json({ error: "DB belum dikonfigurasi." }, { status: 503 });
  const { id } = await params;

  try {
    const b = await req.json();
    const cur = await sql!`SELECT status FROM articles WHERE id = ${id} LIMIT 1`;
    const slug = (b.slug?.trim() || slugify(b.title || "", { lower: true, strict: true })).slice(0, 120);
    const becomingPublished = b.status === "published" && cur[0]?.status !== "published";
    const tags: string[] = Array.isArray(b.tags) ? b.tags : [];
    const publishedAt = becomingPublished ? new Date().toISOString() : null;

    const rows = await sql!`
      UPDATE articles SET
        title = ${b.title}, slug = ${slug}, excerpt = ${b.excerpt || null}, content = ${b.content || ""},
        cover_url = ${b.cover_url || null}, category = ${b.category || "Umum"}, tags = ${tags},
        status = ${b.status || "draft"},
        published_at = COALESCE(${publishedAt}, published_at)
      WHERE id = ${id} RETURNING *`;
    const article = rows[0];
    if (!article) return NextResponse.json({ error: "Tidak dijumpai." }, { status: 404 });

    revalidatePath("/blog"); revalidatePath("/"); revalidatePath(`/blog/${slug}`);
    if (becomingPublished) await broadcastArticle(article as never);
    return NextResponse.json({ success: true, article });
  } catch (e) {
    const msg = e instanceof Error && /unique/i.test(e.message) ? "Slug sudah wujud." : "Ralat pelayan.";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!hasDb) return NextResponse.json({ error: "DB belum dikonfigurasi." }, { status: 503 });
  const { id } = await params;
  await sql!`DELETE FROM articles WHERE id = ${id}`;
  revalidatePath("/blog");
  return NextResponse.json({ success: true });
}
