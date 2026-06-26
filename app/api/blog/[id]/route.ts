import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import slugify from "slugify";
import { createSupabaseServer, hasSupabase } from "@/lib/supabase-server";
import { broadcastArticle } from "@/lib/broadcast";

async function requireUser() {
  const supabase = await createSupabaseServer();
  const { data: { user } } = await supabase.auth.getUser();
  return { supabase, user };
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!hasSupabase) return NextResponse.json({ error: "Supabase belum dikonfigurasi." }, { status: 503 });
  const { id } = await params;
  const { supabase, user } = await requireUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const b = await req.json();
    const { data: current } = await supabase.from("articles").select("status, published_at, slug").eq("id", id).maybeSingle();
    const slug = (b.slug?.trim() || slugify(b.title || "", { lower: true, strict: true })).slice(0, 120);
    const becomingPublished = b.status === "published" && current?.status !== "published";

    const update: Record<string, unknown> = {
      title: b.title, slug, excerpt: b.excerpt || null, content: b.content || "",
      cover_url: b.cover_url || null, category: b.category || "Umum",
      tags: Array.isArray(b.tags) ? b.tags : [], status: b.status || "draft",
    };
    if (becomingPublished) update.published_at = new Date().toISOString();

    const { data, error } = await supabase.from("articles").update(update).eq("id", id).select("*").single();
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });

    revalidatePath("/blog");
    revalidatePath("/");
    revalidatePath(`/blog/${slug}`);
    if (becomingPublished) await broadcastArticle(data);

    return NextResponse.json({ success: true, article: data });
  } catch {
    return NextResponse.json({ error: "Ralat pelayan." }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!hasSupabase) return NextResponse.json({ error: "Supabase belum dikonfigurasi." }, { status: 503 });
  const { id } = await params;
  const { supabase, user } = await requireUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { error } = await supabase.from("articles").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  revalidatePath("/blog");
  return NextResponse.json({ success: true });
}
