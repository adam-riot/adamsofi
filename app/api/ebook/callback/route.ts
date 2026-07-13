import { NextResponse } from "next/server";
import { get, put } from "@vercel/blob";
import { sql, hasDb } from "@/lib/db";
import { verifySignature } from "@/lib/billplz";
import { resend, hasResend, NEWSLETTER_FROM, ebookDeliveryEmail } from "@/lib/resend";
import { SITE_URL } from "@/lib/demos";
import { watermarkPdf } from "@/lib/watermark";

const FILES_TOKEN = process.env.EBOOK_FILES_BLOB_READ_WRITE_TOKEN_READ_WRITE_TOKEN;

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

    const ebooks = await sql!`SELECT title, file_url FROM ebooks WHERE id = ${order.ebook_id} LIMIT 1`;
    const ebookTitle = ebooks[0]?.title || "Ebook";
    const masterPath = ebooks[0]?.file_url as string | undefined;
    const serial = `AS-${String(order.download_token).slice(0, 8).toUpperCase()}`;

    // Generate a per-buyer watermarked copy so resold copies are traceable.
    // Any failure here falls back to delivering the unwatermarked master —
    // a paying customer should never be blocked by this side-feature.
    if (masterPath && FILES_TOKEN) {
      try {
        const master = await get(masterPath, { access: "private", token: FILES_TOKEN });
        if (master?.stream) {
          const bytes = new Uint8Array(await new Response(master.stream).arrayBuffer());
          const watermarked = await watermarkPdf(bytes, { buyerEmail: order.buyer_email, serial });
          const dest = `orders/${order.id}.pdf`;
          const blob = await put(dest, Buffer.from(watermarked), {
            access: "private", token: FILES_TOKEN, contentType: "application/pdf", allowOverwrite: true,
          });
          await sql!`UPDATE ebook_orders SET delivered_file_path = ${blob.pathname} WHERE id = ${order.id}`;
        }
      } catch (e) {
        console.error("watermarking failed, will deliver master file instead", e);
      }
    }

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
