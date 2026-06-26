import { NextResponse } from "next/server";
import { sql, hasDb } from "@/lib/db";

/** Lightweight page-view tracker (fire-and-forget from the client). */
export async function POST(req: Request) {
  if (!hasDb) return NextResponse.json({ ok: false });
  try {
    const { page, slug } = await req.json();
    if (!page) return NextResponse.json({ ok: false });
    await sql!`INSERT INTO page_views (page, slug) VALUES (${page}, ${slug || null})`;
    if (slug) {
      await sql!`UPDATE articles SET views = views + 1 WHERE slug = ${slug}`;
    }
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false });
  }
}
