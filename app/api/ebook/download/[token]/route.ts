import { NextResponse } from "next/server";
import { sql, hasDb } from "@/lib/db";

export async function GET(_req: Request, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  if (!hasDb || !token) {
    return new NextResponse("Order not found or payment not completed.", { status: 404 });
  }

  const rows = await sql!`
    SELECT o.status, e.file_url
    FROM ebook_orders o JOIN ebooks e ON e.id = o.ebook_id
    WHERE o.download_token = ${token} LIMIT 1`;
  const row = rows[0];

  if (!row || row.status !== "paid") {
    return new NextResponse("Order not found or payment not completed.", { status: 404 });
  }

  return NextResponse.redirect(row.file_url, { status: 302 });
}
