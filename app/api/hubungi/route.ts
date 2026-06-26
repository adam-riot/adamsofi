import { NextResponse } from "next/server";
import { sql, hasDb } from "@/lib/db";
import { resend, hasResend, NEWSLETTER_FROM, CONTACT_TO, inquiryEmail } from "@/lib/resend";

export async function POST(req: Request) {
  try {
    const b = await req.json();
    const { nama, whatsapp, email, bisnes, pakej, addons = [], penerangan } = b || {};
    if (!nama || !whatsapp || !email || !bisnes || !pakej) {
      return NextResponse.json({ error: "Sila lengkapkan semua medan wajib." }, { status: 400 });
    }
    const addonsArr: string[] = Array.isArray(addons) ? addons : [];

    if (hasDb) {
      await sql!`
        INSERT INTO inquiries (nama, whatsapp, email, bisnes, pakej, addons, penerangan)
        VALUES (${nama}, ${whatsapp}, ${email}, ${bisnes}, ${pakej}, ${addonsArr}, ${penerangan || null})`;
    }

    if (hasResend && resend) {
      await resend.emails.send({
        from: NEWSLETTER_FROM, to: CONTACT_TO, replyTo: email,
        subject: `Inquiry Baru - ${pakej} dari ${bisnes}`,
        html: inquiryEmail({ nama, whatsapp, email, bisnes, pakej, addons: addonsArr, penerangan }),
      }).catch(() => {});
    }
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Ralat pelayan." }, { status: 500 });
  }
}
