import { NextResponse } from "next/server";
import { sql, hasDb } from "@/lib/db";
import { createBill, hasBillplz } from "@/lib/billplz";
import { SITE_URL } from "@/lib/demos";
import { lhref, isLocale, defaultLocale } from "@/lib/i18n/config";

const isEmail = (s: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);

export async function POST(req: Request) {
  if (!hasDb) return NextResponse.json({ error: "DB belum dikonfigurasi." }, { status: 503 });
  if (!hasBillplz) return NextResponse.json({ error: "Billplz belum dikonfigurasi." }, { status: 503 });

  try {
    const b = await req.json();
    const ebookId = String(b.ebookId || "");
    const name = String(b.name || "").trim();
    const email = String(b.email || "").trim().toLowerCase();
    const phone = b.phone ? String(b.phone).trim() : null;
    const locale = typeof b.locale === "string" && isLocale(b.locale) ? b.locale : defaultLocale;

    if (!name || !isEmail(email) || !ebookId) {
      return NextResponse.json({ error: "Sila lengkapkan nama dan emel yang sah." }, { status: 400 });
    }

    const ebooks = await sql!`SELECT * FROM ebooks WHERE id = ${ebookId} AND status = 'published' LIMIT 1`;
    const ebook = ebooks[0];
    if (!ebook) return NextResponse.json({ error: "Ebook tidak dijumpai." }, { status: 404 });

    const orders = await sql!`
      INSERT INTO ebook_orders (ebook_id, buyer_name, buyer_email, buyer_phone, amount)
      VALUES (${ebookId}, ${name}, ${email}, ${phone}, ${ebook.price})
      RETURNING *`;
    const order = orders[0];

    const redirectUrl = `${SITE_URL}${lhref(locale, `/ebook/${ebook.slug}/terima-kasih`)}?order=${order.id}`;
    const bill = await createBill({
      name, email, mobile: phone || undefined,
      amount: ebook.price,
      description: `Ebook: ${ebook.title}`.slice(0, 200),
      referenceId: order.id,
      callbackUrl: `${SITE_URL}/api/ebook/callback`,
      redirectUrl,
    });

    await sql!`UPDATE ebook_orders SET billplz_bill_id = ${bill.id} WHERE id = ${order.id}`;

    return NextResponse.json({ success: true, url: bill.url });
  } catch (e) {
    console.error("ebook checkout failed", e);
    return NextResponse.json({ error: "Ralat pelayan. Sila cuba lagi." }, { status: 500 });
  }
}
