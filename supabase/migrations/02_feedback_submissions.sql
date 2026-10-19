-- Visitor feedback inbox ("Add yours" on the What People Say section)
-- Run this in the Supabase SQL Editor (Dashboard → SQL Editor → New Query).

-- Submissions are private until Osama approves them by hand, so this table has
-- RLS on and NO policies: the public anon key can neither read nor write it.
-- Only the server (service role key, which bypasses RLS) inserts, lists and deletes.
CREATE TABLE IF NOT EXISTS feedback_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL CHECK (char_length(name) BETWEEN 2 AND 80),
  comment TEXT NOT NULL CHECK (char_length(comment) BETWEEN 10 AND 1000),
  ip_hash TEXT,            -- salted hash, only used to rate-limit; never the raw IP
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE feedback_submissions ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS feedback_submissions_ip_recent
  ON feedback_submissions (ip_hash, created_at DESC);

-- Security fix for the CMS table: the "Allow service role all" policy had no TO clause,
-- so it applied to every role, including the public anon key. That let anyone overwrite
-- the site content. The service role bypasses RLS anyway, so the policy is not needed.
DROP POLICY IF EXISTS "Allow service role all" ON cms_data;
