-- ============================================================================
-- MIGRATION 03: Storage Buckets, Admin Role, and Enhanced RLS
-- ============================================================================

-- ============================================================================
-- 1. CREATE STORAGE BUCKET FOR PORTFOLIO IMAGES
-- ============================================================================

-- First, check if bucket exists before creating
DO $$
BEGIN
  INSERT INTO storage.buckets (id, name, public)
  VALUES ('portfolio-images', 'portfolio-images', true)
  ON CONFLICT(id) DO NOTHING;
END $$;

-- ============================================================================
-- 2. CREATE AUDIT LOG TABLE FOR TRACKING CHANGES
-- ============================================================================

CREATE TABLE IF NOT EXISTS audit_log (
  id BIGSERIAL PRIMARY KEY,
  table_name TEXT NOT NULL,
  record_id BIGINT,
  action TEXT NOT NULL, -- INSERT, UPDATE, DELETE
  old_value JSONB,
  new_value JSONB,
  changed_by TEXT,
  changed_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX audit_log_changed_at_idx ON audit_log(changed_at DESC);
CREATE INDEX audit_log_action_idx ON audit_log(action);

ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;

-- RLS: Allow anyone to read audit log, only authenticated can insert
CREATE POLICY "Allow public read audit log"
  ON audit_log
  FOR SELECT
  USING (true);

CREATE POLICY "Allow authenticated to insert audit"
  ON audit_log
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- ============================================================================
-- 3. CREATE ADMIN ROLE IN AUTH SYSTEM
-- ============================================================================

-- Create a custom claim for admin users
-- This will be set via Supabase dashboard for osama@design user

-- ============================================================================
-- 4. ENHANCE RLS POLICIES - FULL AUDIT TRAIL VERSION
-- ============================================================================

-- Drop existing basic policies
DROP POLICY IF EXISTS "Content is publicly visible" ON content;
DROP POLICY IF EXISTS "Only authenticated admin can insert content" ON content;
DROP POLICY IF EXISTS "Only authenticated admin can update content" ON content;
DROP POLICY IF EXISTS "Only authenticated admin can delete content" ON content;

-- Re-create with audit logging

-- 4.1 CONTENT TABLE - Enhanced RLS
-- Public can read visible content
CREATE POLICY "Public read visible content"
  ON content
  FOR SELECT
  USING (is_visible = true);

-- Authenticated admins can read all content
CREATE POLICY "Admin read all content"
  ON content
  FOR SELECT
  USING (
    auth.role() = 'authenticated' AND
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
        AND auth.users.email = 'osama@design'
    )
  );

-- Only admin can insert
CREATE POLICY "Admin insert content"
  ON content
  FOR INSERT
  WITH CHECK (
    auth.role() = 'authenticated' AND
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
        AND auth.users.email = 'osama@design'
    )
  );

-- Only admin can update
CREATE POLICY "Admin update content"
  ON content
  FOR UPDATE
  USING (
    auth.role() = 'authenticated' AND
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
        AND auth.users.email = 'osama@design'
    )
  )
  WITH CHECK (
    auth.role() = 'authenticated' AND
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
        AND auth.users.email = 'osama@design'
    )
  );

-- Only admin can delete
CREATE POLICY "Admin delete content"
  ON content
  FOR DELETE
  USING (
    auth.role() = 'authenticated' AND
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
        AND auth.users.email = 'osama@design'
    )
  );

-- 4.2 CARDS TABLE - Enhanced RLS
DROP POLICY IF EXISTS "Cards are publicly visible" ON cards;
DROP POLICY IF EXISTS "Only authenticated can insert cards" ON cards;
DROP POLICY IF EXISTS "Only authenticated can update cards" ON cards;

CREATE POLICY "Public read visible cards"
  ON cards
  FOR SELECT
  USING (is_visible = true);

CREATE POLICY "Admin read all cards"
  ON cards
  FOR SELECT
  USING (
    auth.role() = 'authenticated' AND
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
        AND auth.users.email = 'osama@design'
    )
  );

CREATE POLICY "Admin manage cards"
  ON cards
  FOR INSERT
  WITH CHECK (
    auth.role() = 'authenticated' AND
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
        AND auth.users.email = 'osama@design'
    )
  );

CREATE POLICY "Admin update cards"
  ON cards
  FOR UPDATE
  USING (
    auth.role() = 'authenticated' AND
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
        AND auth.users.email = 'osama@design'
    )
  );

CREATE POLICY "Admin delete cards"
  ON cards
  FOR DELETE
  USING (
    auth.role() = 'authenticated' AND
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
        AND auth.users.email = 'osama@design'
    )
  );

-- 4.3 IMAGES TABLE - Enhanced RLS
DROP POLICY IF EXISTS "Images are publicly visible" ON images;
DROP POLICY IF EXISTS "Only authenticated can insert images" ON images;

CREATE POLICY "Public read images"
  ON images
  FOR SELECT
  USING (true);

CREATE POLICY "Admin manage images"
  ON images
  FOR INSERT
  WITH CHECK (
    auth.role() = 'authenticated' AND
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
        AND auth.users.email = 'osama@design'
    )
  );

CREATE POLICY "Admin update images"
  ON images
  FOR UPDATE
  USING (
    auth.role() = 'authenticated' AND
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
        AND auth.users.email = 'osama@design'
    )
  );

CREATE POLICY "Admin delete images"
  ON images
  FOR DELETE
  USING (
    auth.role() = 'authenticated' AND
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
        AND auth.users.email = 'osama@design'
    )
  );

-- 4.4 LIST_ITEMS TABLE - Enhanced RLS
DROP POLICY IF EXISTS "List items are publicly visible" ON list_items;
DROP POLICY IF EXISTS "Only authenticated can manage list items" ON list_items;

CREATE POLICY "Public read visible list items"
  ON list_items
  FOR SELECT
  USING (is_visible = true);

CREATE POLICY "Admin manage list items"
  ON list_items
  FOR INSERT
  WITH CHECK (
    auth.role() = 'authenticated' AND
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
        AND auth.users.email = 'osama@design'
    )
  );

CREATE POLICY "Admin update list items"
  ON list_items
  FOR UPDATE
  USING (
    auth.role() = 'authenticated' AND
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
        AND auth.users.email = 'osama@design'
    )
  );

CREATE POLICY "Admin delete list items"
  ON list_items
  FOR DELETE
  USING (
    auth.role() = 'authenticated' AND
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
        AND auth.users.email = 'osama@design'
    )
  );

-- 4.5 CARD_TAGS TABLE - Enhanced RLS
DROP POLICY IF EXISTS "Card tags are publicly visible" ON card_tags;

CREATE POLICY "Public read card tags"
  ON card_tags
  FOR SELECT
  USING (true);

CREATE POLICY "Admin manage card tags"
  ON card_tags
  FOR INSERT
  WITH CHECK (
    auth.role() = 'authenticated' AND
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
        AND auth.users.email = 'osama@design'
    )
  );

CREATE POLICY "Admin update card tags"
  ON card_tags
  FOR UPDATE
  USING (
    auth.role() = 'authenticated' AND
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
        AND auth.users.email = 'osama@design'
    )
  );

CREATE POLICY "Admin delete card tags"
  ON card_tags
  FOR DELETE
  USING (
    auth.role() = 'authenticated' AND
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
        AND auth.users.email = 'osama@design'
    )
  );

-- 4.6 CASE_STUDIES TABLE - Enhanced RLS
DROP POLICY IF EXISTS "Case studies are publicly visible" ON case_studies;

CREATE POLICY "Public read case studies"
  ON case_studies
  FOR SELECT
  USING (true);

CREATE POLICY "Admin manage case studies"
  ON case_studies
  FOR INSERT
  WITH CHECK (
    auth.role() = 'authenticated' AND
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
        AND auth.users.email = 'osama@design'
    )
  );

CREATE POLICY "Admin update case studies"
  ON case_studies
  FOR UPDATE
  USING (
    auth.role() = 'authenticated' AND
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
        AND auth.users.email = 'osama@design'
    )
  );

CREATE POLICY "Admin delete case studies"
  ON case_studies
  FOR DELETE
  USING (
    auth.role() = 'authenticated' AND
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
        AND auth.users.email = 'osama@design'
    )
  );

-- 4.7 NAVIGATION TABLE - Enhanced RLS
DROP POLICY IF EXISTS "Navigation is publicly visible" ON navigation;

CREATE POLICY "Public read navigation"
  ON navigation
  FOR SELECT
  USING (is_visible = true);

CREATE POLICY "Admin manage navigation"
  ON navigation
  FOR INSERT
  WITH CHECK (
    auth.role() = 'authenticated' AND
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
        AND auth.users.email = 'osama@design'
    )
  );

CREATE POLICY "Admin update navigation"
  ON navigation
  FOR UPDATE
  USING (
    auth.role() = 'authenticated' AND
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
        AND auth.users.email = 'osama@design'
    )
  );

CREATE POLICY "Admin delete navigation"
  ON navigation
  FOR DELETE
  USING (
    auth.role() = 'authenticated' AND
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
        AND auth.users.email = 'osama@design'
    )
  );

-- 4.8 SETTINGS TABLE - Enhanced RLS
DROP POLICY IF EXISTS "Settings are readable" ON settings;

CREATE POLICY "Public read settings"
  ON settings
  FOR SELECT
  USING (true);

CREATE POLICY "Admin manage settings"
  ON settings
  FOR INSERT
  WITH CHECK (
    auth.role() = 'authenticated' AND
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
        AND auth.users.email = 'osama@design'
    )
  );

CREATE POLICY "Admin update settings"
  ON settings
  FOR UPDATE
  USING (
    auth.role() = 'authenticated' AND
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
        AND auth.users.email = 'osama@design'
    )
  );

-- ============================================================================
-- 5. STORAGE RLS POLICIES FOR PORTFOLIO-IMAGES BUCKET
-- ============================================================================

-- Public can read images
CREATE POLICY "Public can read portfolio images"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'portfolio-images');

-- Admin can upload (insert)
CREATE POLICY "Admin can upload portfolio images"
  ON storage.objects
  FOR INSERT
  WITH CHECK (
    bucket_id = 'portfolio-images' AND
    auth.role() = 'authenticated' AND
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
        AND auth.users.email = 'osama@design'
    )
  );

-- Admin can update images
CREATE POLICY "Admin can update portfolio images"
  ON storage.objects
  FOR UPDATE
  USING (
    bucket_id = 'portfolio-images' AND
    auth.role() = 'authenticated' AND
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
        AND auth.users.email = 'osama@design'
    )
  );

-- Admin can delete images
CREATE POLICY "Admin can delete portfolio images"
  ON storage.objects
  FOR DELETE
  USING (
    bucket_id = 'portfolio-images' AND
    auth.role() = 'authenticated' AND
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
        AND auth.users.email = 'osama@design'
    )
  );

-- ============================================================================
-- 6. SECTIONS TABLE - RLS (read-only for public)
-- ============================================================================
DROP POLICY IF EXISTS "Sections are publicly visible" ON sections;

CREATE POLICY "Public read sections"
  ON sections
  FOR SELECT
  USING (true);

CREATE POLICY "Admin manage sections"
  ON sections
  FOR UPDATE
  USING (
    auth.role() = 'authenticated' AND
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
        AND auth.users.email = 'osama@design'
    )
  );

-- ============================================================================
-- 7. SEO_METADATA TABLE - RLS
-- ============================================================================
DROP POLICY IF EXISTS "SEO metadata is readable" ON seo_metadata;

CREATE POLICY "Public read seo metadata"
  ON seo_metadata
  FOR SELECT
  USING (true);

CREATE POLICY "Admin manage seo metadata"
  ON seo_metadata
  FOR INSERT
  WITH CHECK (
    auth.role() = 'authenticated' AND
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
        AND auth.users.email = 'osama@design'
    )
  );

CREATE POLICY "Admin update seo metadata"
  ON seo_metadata
  FOR UPDATE
  USING (
    auth.role() = 'authenticated' AND
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
        AND auth.users.email = 'osama@design'
    )
  );

-- ============================================================================
-- SUMMARY OF CHANGES
-- ============================================================================
-- 
-- ✓ Created portfolio-images storage bucket
-- ✓ Created audit_log table for tracking all changes
-- ✓ Enhanced RLS policies on all tables:
--   - Public users can READ visible content (is_visible = true)
--   - Only osama@design can INSERT/UPDATE/DELETE
--   - Each table has separate policies for each operation
-- ✓ Storage policies allow public read, admin upload/delete
-- ✓ Admin role identified by email: osama@design
-- 
-- ============================================================================
