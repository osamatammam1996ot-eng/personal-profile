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

-- Allow full access via service role key (used by server actions)
CREATE POLICY "Allow service role all" ON cms_data
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Insert a default empty row so upsert works
INSERT INTO cms_data (id, data) VALUES ('main', '{}'::jsonb)
ON CONFLICT (id) DO NOTHING;
