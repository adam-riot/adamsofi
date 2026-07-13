import { NextResponse } from "next/server";
import { sql, hasDb } from "@/lib/db";
import { verifySignature } from "@/lib/billplz";
import { deliverEbook } from "@/lib/deliverEbook";

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

    await deliverEbook(order.id);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Ralat pelayan." }, { status: 500 });
  }
}
