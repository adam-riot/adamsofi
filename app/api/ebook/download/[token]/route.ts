import { NextResponse } from "next/server";
import { get } from "@vercel/blob";
import { sql, hasDb } from "@/lib/db";

// Private store ("ebook-files") — custom token, not the default BLOB_READ_WRITE_TOKEN.
const FILES_TOKEN = process.env.EBOOK_FILES_BLOB_READ_WRITE_TOKEN_READ_WRITE_TOKEN;

export async function GET(_req: Request, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  if (!hasDb || !token) {
    return new NextResponse("Order not found or payment not completed.", { status: 404 });
  }

  const rows = await sql!`
    SELECT o.status, e.file_url, e.title
    FROM ebook_orders o JOIN ebooks e ON e.id = o.ebook_id
    WHERE o.download_token = ${token} LIMIT 1`;
  const row = rows[0];

  if (!row || row.status !== "paid") {
    return new NextResponse("Order not found or payment not completed.", { status: 404 });
  }

  if (!FILES_TOKEN) {
    return new NextResponse("Storage belum dikonfigurasi.", { status: 503 });
  }

  // file_url holds a storage path in the private "ebook-files" store (e.g. "ebook-files/slug/ebook.pdf"),
  // not a public URL — the blob is only readable server-side via get(), never exposed directly.
  const result = await get(row.file_url, { access: "private", token: FILES_TOKEN });
  if (result?.statusCode !== 200) {
    return new NextResponse("File not found.", { status: 404 });
  }

  const filename = `${String(row.title).replace(/[^a-z0-9]+/gi, "-").toLowerCase()}.pdf`;
  return new NextResponse(result.stream, {
    headers: {
      "Content-Type": result.blob.contentType || "application/pdf",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "X-Content-Type-Options": "nosniff",
      "Cache-Control": "private, no-store",
    },
  });
}
