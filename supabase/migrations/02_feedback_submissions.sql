-- Visitor feedback inbox ("Add yours") + lock down writes to the content table.
-- Run in the Supabase SQL Editor (Dashboard → SQL Editor → New query): click into the editor,
-- press Ctrl+A so nothing is partially selected, then Run. Safe to run more than once.
-- The last statement prints a short report; all three columns should read true.

-- 1. Feedback inbox. Submissions stay private until Osama approves them by hand, so RLS is on
--    with NO policies: the public anon key can't read or write. Only the server (service role,
--    which bypasses RLS) inserts, lists and deletes.
CREATE TABLE IF NOT EXISTS public.feedback_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL CHECK (char_length(name) BETWEEN 2 AND 80),
  comment TEXT NOT NULL CHECK (char_length(comment) BETWEEN 10 AND 1000),
  ip_hash TEXT,            -- salted hash, only used to rate-limit; never the raw IP
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE public.feedback_submissions ENABLE ROW LEVEL SECURITY;
CREATE INDEX IF NOT EXISTS feedback_submissions_ip_recent
  ON public.feedback_submissions (ip_hash, created_at DESC);

-- 2. Content table: the public may read it, only the server may change it.
ALTER TABLE public.cms_data ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  -- keep (or create) the public read policy first, so the site never loses its content
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'cms_data' AND cmd = 'SELECT'
  ) THEN
    CREATE POLICY "Allow public read" ON public.cms_data FOR SELECT USING (true);
  END IF;
END $$;

DO $$
DECLARE p RECORD;
BEGIN
  -- drop every policy that allows writing (INSERT/UPDATE/DELETE/ALL); the service role
  -- bypasses RLS anyway, and a policy without a TO clause also applies to the public key
  FOR p IN
    SELECT policyname FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'cms_data' AND cmd <> 'SELECT'
  LOOP
    EXECUTE format('DROP POLICY %I ON public.cms_data', p.policyname);
  END LOOP;
END $$;

-- 3. Make the API see the new table right away
NOTIFY pgrst, 'reload schema';

-- Report: all three should be true
SELECT
  EXISTS (SELECT 1 FROM information_schema.tables
          WHERE table_schema = 'public' AND table_name = 'feedback_submissions') AS feedback_table_exists,
  (SELECT relrowsecurity FROM pg_class WHERE oid = 'public.cms_data'::regclass) AS content_rls_on,
  NOT EXISTS (SELECT 1 FROM pg_policies
              WHERE schemaname = 'public' AND tablename = 'cms_data' AND cmd <> 'SELECT') AS content_write_locked;
