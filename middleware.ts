import { NextResponse, type NextRequest } from "next/server";
import { AUTH_COOKIE, verifyToken } from "@/lib/auth";

export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const valid = await verifyToken(req.cookies.get(AUTH_COOKIE)?.value);

  if (path.startsWith("/admin") && path !== "/admin/login" && !valid) {
    return NextResponse.redirect(new URL("/admin/login", req.url));
  }
  if (path === "/admin/login" && valid) {
    return NextResponse.redirect(new URL("/admin", req.url));
  }
  return NextResponse.next();
}

export const config = { matcher: ["/admin/:path*"] };
