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

// ── Content-Security-Policy ──
function strictCsp(nonce: string): string {
  return [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'`,
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://api.fontshare.com",
    "img-src 'self' data: https:",
    "font-src 'self' https://fonts.gstatic.com https://cdn.fontshare.com",
    "connect-src 'self'",
    "frame-src 'self'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "upgrade-insecure-requests",
  ].join("; ");
}

// The 10 demo sites are static HTML with inline <script>/<style> that cannot be
// nonce'd, so they get a relaxed policy. They are first-party, framed only by us.
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
  const path = req.nextUrl.pathname;

  // Admin auth gate (unchanged behaviour)
  if (path.startsWith("/admin")) {
    const valid = await verify(req.cookies.get(AUTH_COOKIE)?.value);
    if (path !== "/admin/login" && !valid) return NextResponse.redirect(new URL("/admin/login", req.url));
    if (path === "/admin/login" && valid) return NextResponse.redirect(new URL("/admin", req.url));
  }

  // Static demo HTML: relaxed CSP so their inline scripts keep working.
  if (path.startsWith("/demos/") && path.endsWith(".html")) {
    const res = NextResponse.next();
    res.headers.set("Content-Security-Policy", demoCsp());
    return res;
  }

  // Strict nonce-based CSP for everything else.
  const nonce = btoa(crypto.randomUUID());
  const csp = strictCsp(nonce);

  // Pass the CSP (with nonce) on the request so Next.js applies the nonce to its
  // own <script> tags; expose the nonce via x-nonce for our inline JSON-LD.
  const requestHeaders = new Headers(req.headers);
  requestHeaders.set("x-nonce", nonce);
  requestHeaders.set("Content-Security-Policy", csp);

  const res = NextResponse.next({ request: { headers: requestHeaders } });
  // ── ROLLBACK: if the CSP breaks production, comment out the next line and redeploy. ──
  res.headers.set("Content-Security-Policy", csp);
  return res;
}

export const config = {
  // Run on all routes except Next internals and the favicon (per CSP best practice).
  matcher: [
    {
      source: "/((?!_next/static|_next/image|favicon.svg).*)",
    },
  ],
};
