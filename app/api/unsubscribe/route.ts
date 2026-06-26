import { NextResponse } from "next/server";
import { sql, hasDb } from "@/lib/db";
import { SITE_URL } from "@/lib/demos";

export async function GET(req: Request) {
  const token = new URL(req.url).searchParams.get("token");
  if (!token || !hasDb) {
    return NextResponse.redirect(`${SITE_URL}/unsubscribed?ok=0`);
  }
  try {
    await sql!`
      UPDATE subscribers
      SET status = 'unsubscribed', unsubscribed_at = NOW()
      WHERE unsubscribe_token = ${token}`;
    return NextResponse.redirect(`${SITE_URL}/unsubscribed?ok=1`);
  } catch {
    return NextResponse.redirect(`${SITE_URL}/unsubscribed?ok=0`);
  }
}
