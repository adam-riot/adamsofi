import "server-only";
import { cookies } from "next/headers";
import { AUTH_COOKIE, verifyToken } from "./auth";

/** True if the current request has a valid admin session cookie. */
export async function isAdmin(): Promise<boolean> {
  const store = await cookies();
  return verifyToken(store.get(AUTH_COOKIE)?.value);
}
