import { NextResponse } from "next/server";
import { createSupabaseAdmin, hasServiceRole } from "@/lib/supabase-admin";
import { resend, hasResend, NEWSLETTER_FROM, CONTACT_TO, inquiryEmail } from "@/lib/resend";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { nama, whatsapp, email, bisnes, pakej, addons = [], penerangan } = body || {};

    if (!nama || !whatsapp || !email || !bisnes || !pakej) {
      return NextResponse.json({ error: "Sila lengkapkan semua medan wajib." }, { status: 400 });
    }

    if (hasServiceRole) {
      const supabase = createSupabaseAdmin();
      await supabase.from("inquiries").insert({
        nama, whatsapp, email, bisnes, pakej,
        addons: Array.isArray(addons) ? addons : [],
        penerangan: penerangan || null,
      });
    }

    if (hasResend && resend) {
      await resend.emails.send({
        from: NEWSLETTER_FROM,
        to: CONTACT_TO,
        replyTo: email,
        subject: `Inquiry Baru — ${pakej} dari ${bisnes}`,
        html: inquiryEmail({ nama, whatsapp, email, bisnes, pakej, addons, penerangan }),
      }).catch(() => {});
    }

    // If neither storage nor email is configured, still succeed gracefully
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Ralat pelayan." }, { status: 500 });
  }
}
