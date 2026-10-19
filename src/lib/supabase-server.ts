import { createClient } from '@supabase/supabase-js';

// Server-only Supabase access, shared by the server actions.
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

/** Public client (anon key, row-level security applies): reading published content. */
export function getReadClient() {
  return url && anonKey ? createClient(url, anonKey, { auth: { persistSession: false } }) : null;
}

/** Privileged client (service role, bypasses row-level security): admin writes, uploads, the feedback inbox. */
export function getAdminClient() {
  return url && serviceKey ? createClient(url, serviceKey, { auth: { persistSession: false } }) : null;
}
