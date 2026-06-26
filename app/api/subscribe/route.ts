import { NextResponse } from "next/server";
import { createSupabaseAdmin, hasServiceRole } from "@/lib/supabase-admin";
import { resend, hasResend, NEWSLETTER_FROM, welcomeEmail } from "@/lib/resend";

const isEmail = (s: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);

export async function POST(req: Request) {
  try {
    const { email, name } = await req.json();
    if (!email || !isEmail(email)) {
      return NextResponse.json({ error: "Emel tidak sah." }, { status: 400 });
    }
    if (!hasServiceRole) {
      return NextResponse.json({ error: "Newsletter belum dikonfigurasi." }, { status: 503 });
    }

    const supabase = createSupabaseAdmin();
    const clean = String(email).toLowerCase().trim();

    const { data: existing } = await supabase
      .from("subscribers").select("id, status").eq("email", clean).maybeSingle();

    if (existing) {
      if (existing.status === "unsubscribed") {
        await supabase.from("subscribers")
          .update({ status: "active", unsubscribed_at: null }).eq("id", existing.id);
      }
      return NextResponse.json({ success: true, already: true });
    }

    const { error } = await supabase
      .from("subscribers").insert({ email: clean, name: name || null });
    if (error) {
      return NextResponse.json({ error: "Gagal subscribe." }, { status: 500 });
    }

    if (hasResend && resend) {
      await resend.emails.send({
        from: NEWSLETTER_FROM,
        to: clean,
        subject: "Selamat datang ke newsletter AdamSofi! 🎉",
        html: welcomeEmail(name),
      }).catch(() => {});
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Ralat pelayan." }, { status: 500 });
  }
}
