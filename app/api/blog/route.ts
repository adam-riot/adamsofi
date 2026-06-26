import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import slugify from "slugify";
import { createSupabaseServer, hasSupabase } from "@/lib/supabase-server";
import { broadcastArticle } from "@/lib/broadcast";

export async function POST(req: Request) {
  if (!hasSupabase) return NextResponse.json({ error: "Supabase belum dikonfigurasi." }, { status: 503 });
  const supabase = await createSupabaseServer();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const b = await req.json();
    const slug = (b.slug?.trim() || slugify(b.title || "", { lower: true, strict: true })).slice(0, 120);
    const publishing = b.status === "published";

    const { data, error } = await supabase.from("articles").insert({
      title: b.title,
      slug,
      excerpt: b.excerpt || null,
      content: b.content || "",
      cover_url: b.cover_url || null,
      category: b.category || "Umum",
      tags: Array.isArray(b.tags) ? b.tags : [],
      status: b.status || "draft",
      published_at: publishing ? new Date().toISOString() : null,
    }).select("*").single();

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });

    revalidatePath("/blog");
    revalidatePath("/");
    if (publishing) {
      revalidatePath(`/blog/${slug}`);
      await broadcastArticle(data);
    }
    return NextResponse.json({ success: true, article: data });
  } catch {
    return NextResponse.json({ error: "Ralat pelayan." }, { status: 500 });
  }
}
