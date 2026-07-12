import { NextResponse, type NextRequest } from "next/server";

// ── Admin session check (self-contained, edge-safe; no local imports) ──
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

function strictCsp(nonce: string): string {
  return [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'`,
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://api.fontshare.com",
    "img-src 'self' data: https:",
    "font-src 'self' https://fonts.gstatic.com https://cdn.fontshare.com",
    "connect-src 'self' https://*.public.blob.vercel-storage.com https://*.private.blob.vercel-storage.com",
    "frame-src 'self'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "upgrade-insecure-requests",
  ].join("; ");
}

function demoCsp(): string {
  return [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline'",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://api.fontshare.com",
    "img-src 'self' data: https:",
    "font-src 'self' https://fonts.gstatic.com https://cdn.fontshare.com data:",
    "connect-src 'self'",
    "object-src 'none'",
    "base-uri 'self'",
    "frame-ancestors 'self'",
  ].join("; ");
}

export async function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;

  // 1. Static demo HTML: relaxed CSP (inline scripts can't be nonce'd).
  if (pathname.startsWith("/demos/") && pathname.endsWith(".html")) {
    const res = NextResponse.next();
    res.headers.set("Content-Security-Policy", demoCsp());
    return res;
  }

  // 2. Static files (cover images, sitemap.xml, robots.txt, og-image, etc.): pass through.
  if (/\.[^/]+$/.test(pathname)) {
    return NextResponse.next();
  }

  const nonce = btoa(crypto.randomUUID());
  const csp = strictCsp(nonce);

  // 3. Admin: auth gate + strict CSP, no locale handling.
  if (pathname.startsWith("/admin")) {
    const valid = await verify(req.cookies.get(AUTH_COOKIE)?.value);
    if (pathname !== "/admin/login" && !valid) return NextResponse.redirect(new URL("/admin/login", req.url));
    if (pathname === "/admin/login" && valid) return NextResponse.redirect(new URL("/admin", req.url));
    const h = new Headers(req.headers);
    h.set("x-nonce", nonce);
    h.set("Content-Security-Policy", csp);
    const res = NextResponse.next({ request: { headers: h } });
    res.headers.set("Content-Security-Policy", csp);
    return res;
  }

  // 4. Locale handling. Default (ms) is served prefix-free via internal rewrite.
  const locale = pathname === "/en" || pathname.startsWith("/en/") ? "en"
    : pathname === "/zh" || pathname.startsWith("/zh/") ? "zh" : "ms";

  const h = new Headers(req.headers);
  h.set("x-nonce", nonce);
  h.set("x-locale", locale);
  h.set("Content-Security-Policy", csp);

  let res: NextResponse;
  if (locale === "ms") {
    // bare path -> render the [locale] tree as ms without changing the URL
    res = NextResponse.rewrite(new URL(`/ms${pathname}${search}`, req.url), { request: { headers: h } });
  } else {
    res = NextResponse.next({ request: { headers: h } });
  }
  // ── ROLLBACK: if the CSP breaks production, comment out the next line and redeploy. ──
  res.headers.set("Content-Security-Policy", csp);
  return res;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.svg|api).*)"],
};
