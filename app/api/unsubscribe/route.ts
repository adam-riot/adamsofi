import { NextResponse } from "next/server";
import { createSupabaseAdmin, hasServiceRole } from "@/lib/supabase-admin";
import { SITE_URL } from "@/lib/demos";

export async function GET(req: Request) {
  const token = new URL(req.url).searchParams.get("token");
  if (!token || !hasServiceRole) {
    return NextResponse.redirect(`${SITE_URL}/unsubscribed?ok=0`);
  }
  try {
    const supabase = createSupabaseAdmin();
    const { data } = await supabase
      .from("subscribers").select("id").eq("unsubscribe_token", token).maybeSingle();
    if (data) {
      await supabase.from("subscribers")
        .update({ status: "unsubscribed", unsubscribed_at: new Date().toISOString() })
        .eq("id", data.id);
    }
    return NextResponse.redirect(`${SITE_URL}/unsubscribed?ok=1`);
  } catch {
    return NextResponse.redirect(`${SITE_URL}/unsubscribed?ok=0`);
  }
}
