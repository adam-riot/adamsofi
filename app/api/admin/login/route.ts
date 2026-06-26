import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { AUTH_COOKIE, createToken, checkCredentials, authConfigured } from "@/lib/auth";

export async function POST(req: Request) {
  if (!authConfigured) {
    return NextResponse.json({ error: "Admin auth belum dikonfigurasi (ADMIN_PASSWORD / AUTH_SECRET)." }, { status: 503 });
  }
  const { email, password } = await req.json();
  if (!checkCredentials(email || "", password || "")) {
    return NextResponse.json({ error: "Emel atau kata laluan salah." }, { status: 401 });
  }
  const token = await createToken(7);
  const store = await cookies();
  store.set(AUTH_COOKIE, token, {
    httpOnly: true, secure: true, sameSite: "lax", path: "/", maxAge: 60 * 60 * 24 * 7,
  });
  return NextResponse.json({ success: true });
}
