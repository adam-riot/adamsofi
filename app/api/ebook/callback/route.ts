import { NextResponse } from "next/server";
import { sql, hasDb } from "@/lib/db";
import { verifySignature } from "@/lib/billplz";
import { resend, hasResend, NEWSLETTER_FROM, ebookDeliveryEmail } from "@/lib/resend";
import { SITE_URL } from "@/lib/demos";

// Billplz server-to-server webhook. Source of truth for marking an order paid —
// the redirect_url leg is only used to route the buyer to a thank-you page.
export async function POST(req: Request) {
  if (!hasDb) return NextResponse.json({ error: "DB belum dikonfigurasi." }, { status: 503 });

  const form = await req.formData();
  const fields: Record<string, string> = {};
  form.forEach((value, key) => { fields[key] = String(value); });

  const signature = fields.x_signature;
  if (!signature || !verifySignature(fields, signature)) {
    return NextResponse.json({ error: "Invalid signature." }, { status: 400 });
  }

  const billId = fields.id;
  const paid = fields.paid === "true";
  if (!billId || !paid) return NextResponse.json({ success: true });

  try {
    const rows = await sql!`
      UPDATE ebook_orders SET status = 'paid', paid_at = NOW()
      WHERE billplz_bill_id = ${billId} AND status <> 'paid'
      RETURNING *`;
    const order = rows[0];
    if (!order) return NextResponse.json({ success: true }); // already processed or unknown bill

    const ebooks = await sql!`SELECT title FROM ebooks WHERE id = ${order.ebook_id} LIMIT 1`;
    const ebookTitle = ebooks[0]?.title || "Ebook";
    const downloadUrl = `${SITE_URL}/api/ebook/download/${order.download_token}`;

    if (hasResend && resend) {
      await resend.emails.send({
        from: NEWSLETTER_FROM, to: order.buyer_email,
        subject: `Ebook anda sedia untuk dimuat turun - ${ebookTitle}`,
        html: ebookDeliveryEmail({ name: order.buyer_name, ebookTitle, downloadUrl }),
      }).catch(() => {});
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Ralat pelayan." }, { status: 500 });
  }
}
