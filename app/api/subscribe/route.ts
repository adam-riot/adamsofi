import { NextResponse } from "next/server";
import { sql, hasDb } from "@/lib/db";
import { resend, hasResend, NEWSLETTER_FROM, welcomeEmail } from "@/lib/resend";

const isEmail = (s: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);

export async function POST(req: Request) {
  try {
    const { email, name } = await req.json();
    if (!email || !isEmail(email)) {
      return NextResponse.json({ error: "Emel tidak sah." }, { status: 400 });
    }
    if (!hasDb) {
      return NextResponse.json({ error: "Newsletter belum dikonfigurasi." }, { status: 503 });
    }

    const clean = String(email).toLowerCase().trim();
    const existing = await sql!`SELECT id, status FROM subscribers WHERE email = ${clean} LIMIT 1`;

    if (existing[0]) {
      if (existing[0].status === "unsubscribed") {
        await sql!`UPDATE subscribers SET status = 'active', unsubscribed_at = NULL WHERE id = ${existing[0].id}`;
      }
      return NextResponse.json({ success: true, already: true });
    }

    await sql!`INSERT INTO subscribers (email, name) VALUES (${clean}, ${name || null})`;

    if (hasResend && resend) {
      await resend.emails.send({
        from: NEWSLETTER_FROM, to: clean,
        subject: "Selamat datang ke newsletter AdamSofi! 🎉",
        html: welcomeEmail(name),
      }).catch(() => {});
    }
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Ralat pelayan." }, { status: 500 });
  }
}
