import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/session";
import { deliverEbook } from "@/lib/deliverEbook";

export async function POST(req: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { orderId } = await req.json();
  if (!orderId) return NextResponse.json({ error: "orderId diperlukan." }, { status: 400 });

  const result = await deliverEbook(orderId);
  if (!result.success) return NextResponse.json({ error: result.error }, { status: 400 });
  return NextResponse.json({ success: true });
}
