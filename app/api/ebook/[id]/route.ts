import { NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import slugify from "slugify";
import { sql, hasDb } from "@/lib/db";
import { isAdmin } from "@/lib/session";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!hasDb) return NextResponse.json({ error: "DB belum dikonfigurasi." }, { status: 503 });
  const { id } = await params;

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
      UPDATE ebooks SET
        title = ${title}, slug = ${slug}, description = ${description},
        cover_url = ${b.cover_url || null}, file_url = ${fileUrl}, price = ${price},
        status = ${b.status || "draft"}
      WHERE id = ${id} RETURNING *`;
    const ebook = rows[0];
    if (!ebook) return NextResponse.json({ error: "Tidak dijumpai." }, { status: 404 });

    revalidateTag("ebooks");
    revalidatePath("/ebook"); revalidatePath(`/ebook/${slug}`);
    return NextResponse.json({ success: true, ebook });
  } catch (e) {
    const msg = e instanceof Error && /unique/i.test(e.message) ? "Slug sudah wujud." : "Ralat pelayan.";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!hasDb) return NextResponse.json({ error: "DB belum dikonfigurasi." }, { status: 503 });
  const { id } = await params;
  await sql!`DELETE FROM ebooks WHERE id = ${id}`;
  revalidateTag("ebooks");
  revalidatePath("/ebook");
  return NextResponse.json({ success: true });
}
