import { createClient } from "@supabase/supabase-js";

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE = process.env.SUPABASE_SERVICE_ROLE_KEY;

export const hasServiceRole = Boolean(URL && SERVICE);

/**
 * Service-role Supabase client — bypasses RLS. SERVER ONLY.
 * Never import this into a client component.
 */
export function createSupabaseAdmin() {
  if (!URL || !SERVICE) {
    throw new Error("Supabase service role env not configured");
  }
  return createClient(URL, SERVICE, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
