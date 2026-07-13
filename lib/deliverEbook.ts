import { get, put } from "@vercel/blob";
import { sql } from "./db";
import { watermarkPdf } from "./watermark";
import { resend, hasResend, NEWSLETTER_FROM, ebookDeliveryEmail } from "./resend";
import { SITE_URL } from "./demos";

const FILES_TOKEN = process.env.EBOOK_FILES_BLOB_READ_WRITE_TOKEN_READ_WRITE_TOKEN;

/**
 * Generates a fresh watermarked copy from the ebook's CURRENT master file and
 * emails the buyer a download link. Used both right after payment and for
 * manual re-delivery (e.g. sending an updated edition to a past buyer).
 * Falls back to the master file if watermarking fails — delivery must not
 * be blocked by this side-feature.
 */
export async function deliverEbook(orderId: string): Promise<{ success: boolean; error?: string }> {
  const orders = await sql!`SELECT * FROM ebook_orders WHERE id = ${orderId} LIMIT 1`;
  const order = orders[0];
  if (!order) return { success: false, error: "Pesanan tidak dijumpai." };
  if (order.status !== "paid") return { success: false, error: "Pesanan belum dibayar." };

  const ebooks = await sql!`SELECT title, file_url FROM ebooks WHERE id = ${order.ebook_id} LIMIT 1`;
  const ebookTitle = ebooks[0]?.title || "Ebook";
  const masterPath = ebooks[0]?.file_url as string | undefined;
  const serial = `AS-${String(order.download_token).slice(0, 8).toUpperCase()}`;

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

  return { success: true };
}
