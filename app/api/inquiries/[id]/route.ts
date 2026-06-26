import { NextResponse } from "next/server";
import { sql, hasDb } from "@/lib/db";
import { isAdmin } from "@/lib/session";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!hasDb) return NextResponse.json({ error: "DB belum dikonfigurasi." }, { status: 503 });
  const { id } = await params;
  const { status } = await req.json();
  if (!["new", "contacted", "closed"].includes(status)) {
    return NextResponse.json({ error: "Status tidak sah." }, { status: 400 });
  }
  await sql!`UPDATE inquiries SET status = ${status} WHERE id = ${id}`;
  return NextResponse.json({ success: true });
}
