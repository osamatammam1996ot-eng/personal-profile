-- Wrong-password log for the admin login, so password guessing gets locked out
-- (see src/lib/login-guard.ts). Run in the Supabase SQL Editor. Safe to run more than once.
-- RLS is on with NO policies: only the server (service role) can read or write it.
CREATE TABLE IF NOT EXISTS public.login_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ip_hash TEXT NOT NULL,   -- salted hash, never the raw IP
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE public.login_attempts ENABLE ROW LEVEL SECURITY;
CREATE INDEX IF NOT EXISTS login_attempts_recent ON public.login_attempts (created_at DESC, ip_hash);

NOTIFY pgrst, 'reload schema';

-- Report: should read true
SELECT EXISTS (SELECT 1 FROM information_schema.tables
               WHERE table_schema = 'public' AND table_name = 'login_attempts') AS login_attempts_table_exists;
