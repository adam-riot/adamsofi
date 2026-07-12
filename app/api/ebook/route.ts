import { NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import slugify from "slugify";
import { sql, hasDb } from "@/lib/db";
import { isAdmin } from "@/lib/session";

export async function POST(req: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!hasDb) return NextResponse.json({ error: "DB belum dikonfigurasi." }, { status: 503 });

  try {
    const b = await req.json();
    const title = String(b.title || "");
    const description = b.description || null;
    const fileUrl = String(b.file_url || "");
    const price = Math.round(Number(b.price));
    const slug = (b.slug?.trim() || slugify(title, { lower: true, strict: true })).slice(0, 120);

    if (!title || !fileUrl || !Number.isFinite(price) || price <= 0) {
      return NextResponse.json({ error: "Sila lengkapkan tajuk, fail, dan harga (>0)." }, { status: 400 });
    }

    const rows = await sql!`
      INSERT INTO ebooks (title, slug, description, cover_url, file_url, price, status)
      VALUES (${title}, ${slug}, ${description}, ${b.cover_url || null}, ${fileUrl}, ${price}, ${b.status || "draft"})
      RETURNING *`;
    const ebook = rows[0];

    revalidateTag("ebooks");
    revalidatePath("/ebook");
    if (ebook.status === "published") revalidatePath(`/ebook/${slug}`);
    return NextResponse.json({ success: true, ebook });
  } catch (e) {
    const msg = e instanceof Error && /unique/i.test(e.message) ? "Slug sudah wujud." : "Ralat pelayan.";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
