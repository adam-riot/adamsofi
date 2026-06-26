// Lightweight stateless admin auth: HMAC-signed cookie. Edge + Node compatible
// (Web Crypto). No database needed for session checks.

export const AUTH_COOKIE = "as_admin";
const SECRET = process.env.AUTH_SECRET || "dev-insecure-secret-change-me";

const enc = new TextEncoder();

function b64url(bytes: Uint8Array): string {
  let s = "";
  for (const b of bytes) s += String.fromCharCode(b);
  return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

async function hmac(data: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw", enc.encode(SECRET), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(data));
  return b64url(new Uint8Array(sig));
}

/** Create a signed session token valid for `days`. */
export async function createToken(days = 7): Promise<string> {
  const payload = b64url(enc.encode(JSON.stringify({ exp: Date.now() + days * 86400000 })));
  const sig = await hmac(payload);
  return `${payload}.${sig}`;
}

/** Verify token signature + expiry. Safe for middleware (no DB). */
export async function verifyToken(token: string | undefined | null): Promise<boolean> {
  if (!token) return false;
  const [payload, sig] = token.split(".");
  if (!payload || !sig) return false;
  if ((await hmac(payload)) !== sig) return false;
  try {
    const json = JSON.parse(atob(payload.replace(/-/g, "+").replace(/_/g, "/")));
    return typeof json.exp === "number" && Date.now() < json.exp;
  } catch {
    return false;
  }
}

/** Verify a login attempt against env-configured admin credentials. */
export function checkCredentials(email: string, password: string): boolean {
  const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
  if (!ADMIN_PASSWORD) return false;
  const emailOk = !ADMIN_EMAIL || email.trim().toLowerCase() === ADMIN_EMAIL.toLowerCase();
  return emailOk && password === ADMIN_PASSWORD;
}

export const authConfigured = Boolean(process.env.ADMIN_PASSWORD && process.env.AUTH_SECRET);
