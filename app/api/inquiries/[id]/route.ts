import { NextResponse } from "next/server";
import { createSupabaseServer, hasSupabase } from "@/lib/supabase-server";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!hasSupabase) return NextResponse.json({ error: "Supabase belum dikonfigurasi." }, { status: 503 });
  const { id } = await params;
  const supabase = await createSupabaseServer();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { status } = await req.json();
  if (!["new", "contacted", "closed"].includes(status)) {
    return NextResponse.json({ error: "Status tidak sah." }, { status: 400 });
  }
  const { error } = await supabase.from("inquiries").update({ status }).eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ success: true });
}
