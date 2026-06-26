import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const hasSupabase = Boolean(URL && ANON);

/**
 * Server-side Supabase client bound to the request cookies (for auth/session).
 * Use in Server Components, Route Handlers, and middleware-adjacent code.
 */
export async function createSupabaseServer() {
  const cookieStore = await cookies();
  return createServerClient(URL!, ANON!, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet: { name: string; value: string; options?: Record<string, unknown> }[]) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            cookieStore.set(name, value, options as any)
          );
        } catch {
          // setAll called from a Server Component — safe to ignore,
          // middleware refreshes the session.
        }
      },
    },
  });
}
