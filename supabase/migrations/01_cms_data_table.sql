-- CMS Data Storage Table
-- Run this in the Supabase SQL Editor (Dashboard → SQL Editor → New Query)

-- Create the table
CREATE TABLE IF NOT EXISTS cms_data (
  id TEXT PRIMARY KEY DEFAULT 'main',
  data JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE cms_data ENABLE ROW LEVEL SECURITY;

-- Allow public read access (via anon key)
CREATE POLICY "Allow public read" ON cms_data
  FOR SELECT
  USING (true);

-- No write policy on purpose: the server writes with the service role key, which bypasses
-- row-level security. A policy without a TO clause would apply to the public anon key too.

-- Insert a default empty row so upsert works
INSERT INTO cms_data (id, data) VALUES ('main', '{}'::jsonb)
ON CONFLICT (id) DO NOTHING;
