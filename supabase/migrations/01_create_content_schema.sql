-- ============================================================================
-- SUPABASE SCHEMA FOR PORTFOLIO BACKEND
-- ============================================================================
-- Fresh, clean backend design for dynamic content management
-- Supports bilingual content (English + Arabic) for all text
-- ============================================================================

-- ============================================================================
-- 1. SECTIONS TABLE - Defines website sections
-- ============================================================================
CREATE TABLE IF NOT EXISTS sections (
  id BIGSERIAL PRIMARY KEY,
  key TEXT UNIQUE NOT NULL, -- 'hero', 'why_hire_me', 'skills', 'portfolio', 'tools', 'contact', 'footer', 'navigation'
  label_en TEXT NOT NULL,
  label_ar TEXT NOT NULL,
  display_order INT NOT NULL DEFAULT 0,
  is_visible BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================================
-- 2. CONTENT TABLE - Main content storage (bilingual)
-- ============================================================================
CREATE TABLE IF NOT EXISTS content (
  id BIGSERIAL PRIMARY KEY,
  section_id BIGINT NOT NULL REFERENCES sections(id) ON DELETE CASCADE,
  field_key TEXT NOT NULL, -- e.g., 'hero_headline_1', 'hero_description', 'cta_button'
  text_en TEXT,
  text_ar TEXT,
  display_order INT DEFAULT 0,
  is_visible BOOLEAN DEFAULT true,
  content_type TEXT DEFAULT 'text', -- 'text', 'heading', 'button', 'label', 'paragraph'
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(section_id, field_key)
);

-- ============================================================================
-- 3. IMAGES TABLE - Manage all website images
-- ============================================================================
CREATE TABLE IF NOT EXISTS images (
  id BIGSERIAL PRIMARY KEY,
  section_id BIGINT REFERENCES sections(id) ON DELETE SET NULL,
  key TEXT UNIQUE NOT NULL, -- e.g., 'hero_portrait', 'case_study_nexus'
  image_url TEXT NOT NULL,
  alt_text_en TEXT,
  alt_text_ar TEXT,
  aspect_ratio TEXT NOT NULL DEFAULT '16:9', -- '1:1', '16:9', '4:5', '3:2', etc.
  width INT,
  height INT,
  file_size INT,
  mime_type TEXT,
  display_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================================
-- 4. ARRAYS/LISTS TABLE - For dynamic arrays (roles, skills tags, etc.)
-- ============================================================================
CREATE TABLE IF NOT EXISTS list_items (
  id BIGSERIAL PRIMARY KEY,
  section_id BIGINT NOT NULL REFERENCES sections(id) ON DELETE CASCADE,
  list_key TEXT NOT NULL, -- e.g., 'hero_roles', 'skills_tags', 'tools_list'
  item_text_en TEXT NOT NULL,
  item_text_ar TEXT NOT NULL,
  display_order INT NOT NULL DEFAULT 0,
  is_visible BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================================
-- 5. CARDS TABLE - For card-based content (WhyHireMe, Disciplines, etc.)
-- ============================================================================
CREATE TABLE IF NOT EXISTS cards (
  id BIGSERIAL PRIMARY KEY,
  section_id BIGINT NOT NULL REFERENCES sections(id) ON DELETE CASCADE,
  card_key TEXT NOT NULL, -- e.g., 'why_hire_me_card_1', 'skills_discipline_1'
  title_en TEXT NOT NULL,
  title_ar TEXT NOT NULL,
  description_en TEXT,
  description_ar TEXT,
  tagline_en TEXT,
  tagline_ar TEXT,
  image_url TEXT,
  display_order INT NOT NULL DEFAULT 0,
  is_visible BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(section_id, card_key)
);

-- ============================================================================
-- 6. CARD TAGS TABLE - Tags within cards (e.g., skill tags, tool categories)
-- ============================================================================
CREATE TABLE IF NOT EXISTS card_tags (
  id BIGSERIAL PRIMARY KEY,
  card_id BIGINT NOT NULL REFERENCES cards(id) ON DELETE CASCADE,
  tag_text_en TEXT NOT NULL,
  tag_text_ar TEXT NOT NULL,
  display_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================================
-- 7. NAVIGATION TABLE - Menu items
-- ============================================================================
CREATE TABLE IF NOT EXISTS navigation (
  id BIGSERIAL PRIMARY KEY,
  label_en TEXT NOT NULL,
  label_ar TEXT NOT NULL,
  link TEXT,
  display_order INT NOT NULL DEFAULT 0,
  is_visible BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================================
-- 8. SEO TABLE - SEO metadata (future-proofing)
-- ============================================================================
CREATE TABLE IF NOT EXISTS seo_metadata (
  id BIGSERIAL PRIMARY KEY,
  section_id BIGINT REFERENCES sections(id) ON DELETE CASCADE,
  title_en TEXT,
  title_ar TEXT,
  description_en TEXT,
  description_ar TEXT,
  keywords_en TEXT,
  keywords_ar TEXT,
  og_image_url TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================================
-- 9. CASE STUDIES TABLE - Portfolio case study content
-- ============================================================================
CREATE TABLE IF NOT EXISTS case_studies (
  id BIGSERIAL PRIMARY KEY,
  key TEXT UNIQUE NOT NULL, -- 'nexus_analytics', 'orion_enterprise', etc.
  title_en TEXT NOT NULL,
  title_ar TEXT NOT NULL,
  description_en TEXT,
  description_ar TEXT,
  image_url TEXT,
  image_aspect_ratio TEXT DEFAULT '16:9',
  content_en TEXT, -- Detailed case study content
  content_ar TEXT,
  display_order INT NOT NULL DEFAULT 0,
  is_visible BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================================
-- 10. SETTINGS TABLE - Global app settings
-- ============================================================================
CREATE TABLE IF NOT EXISTS settings (
  id BIGSERIAL PRIMARY KEY,
  setting_key TEXT UNIQUE NOT NULL,
  setting_value TEXT,
  setting_type TEXT DEFAULT 'text', -- 'text', 'number', 'boolean', 'json'
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================================
CREATE INDEX idx_content_section ON content(section_id);
CREATE INDEX idx_content_field_key ON content(field_key);
CREATE INDEX idx_list_items_section ON list_items(section_id);
CREATE INDEX idx_list_items_key ON list_items(list_key);
CREATE INDEX idx_cards_section ON cards(section_id);
CREATE INDEX idx_card_tags_card ON card_tags(card_id);
CREATE INDEX idx_images_section ON images(section_id);
CREATE INDEX idx_images_key ON images(key);
CREATE INDEX idx_navigation_order ON navigation(display_order);

-- ============================================================================
-- ENABLE ROW LEVEL SECURITY (for admin access control)
-- ============================================================================
ALTER TABLE sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE content ENABLE ROW LEVEL SECURITY;
ALTER TABLE images ENABLE ROW LEVEL SECURITY;
ALTER TABLE list_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE card_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE navigation ENABLE ROW LEVEL SECURITY;
ALTER TABLE case_studies ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- RLS POLICIES - Allow admin access (adjust based on your auth)
-- ============================================================================
-- For now, allow all authenticated users (adjust as needed)
CREATE POLICY "Allow authenticated read" ON sections FOR SELECT USING (true);
CREATE POLICY "Allow authenticated read" ON content FOR SELECT USING (true);
CREATE POLICY "Allow authenticated read" ON images FOR SELECT USING (true);
CREATE POLICY "Allow authenticated read" ON list_items FOR SELECT USING (true);
CREATE POLICY "Allow authenticated read" ON cards FOR SELECT USING (true);
CREATE POLICY "Allow authenticated read" ON card_tags FOR SELECT USING (true);
CREATE POLICY "Allow authenticated read" ON navigation FOR SELECT USING (true);
CREATE POLICY "Allow authenticated read" ON case_studies FOR SELECT USING (true);
CREATE POLICY "Allow authenticated read" ON settings FOR SELECT USING (true);

-- Admin modifications (optional - enable after setting up auth)
-- CREATE POLICY "Allow admin modify" ON content FOR ALL USING (auth.role() = 'admin');
