import { NextResponse, type NextRequest } from "next/server";

// Self-contained, edge-safe session check (no local imports → no bundler issues).
const AUTH_COOKIE = "as_admin";
const SECRET = process.env.AUTH_SECRET || "dev-insecure-secret-change-me";
const enc = new TextEncoder();

async function verify(token: string | undefined): Promise<boolean> {
  if (!token) return false;
  const [payload, sig] = token.split(".");
  if (!payload || !sig) return false;
  const key = await crypto.subtle.importKey(
    "raw", enc.encode(SECRET), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]
  );
  const sigBuf = await crypto.subtle.sign("HMAC", key, enc.encode(payload));
  let expect = "";
  for (const b of new Uint8Array(sigBuf)) expect += String.fromCharCode(b);
  expect = btoa(expect).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  if (expect !== sig) return false;
  try {
    const json = JSON.parse(atob(payload.replace(/-/g, "+").replace(/_/g, "/")));
    return typeof json.exp === "number" && Date.now() < json.exp;
  } catch {
    return false;
  }
}

export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const valid = await verify(req.cookies.get(AUTH_COOKIE)?.value);

  if (path.startsWith("/admin") && path !== "/admin/login" && !valid) {
    return NextResponse.redirect(new URL("/admin/login", req.url));
  }
  if (path === "/admin/login" && valid) {
    return NextResponse.redirect(new URL("/admin", req.url));
  }
  return NextResponse.next();
}

export const config = { matcher: ["/admin/:path*"] };
