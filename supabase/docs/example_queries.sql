-- ============================================================================
-- EXAMPLE QUERIES - Frontend Integration Reference
-- ============================================================================
-- These queries show how the frontend will fetch content from the backend
-- Each corresponds to a React hook or data fetch pattern
-- ============================================================================

-- ============================================================================
-- 1. FETCH SECTION CONTENT (by section key + language)
-- ============================================================================
-- Usage: For any section, get all its bilingual fields
-- Example: GET /api/sections/hero?lang=en or /api/sections/hero?lang=ar

SELECT 
  field_key,
  CASE 
    WHEN $1 = 'ar' THEN text_ar 
    ELSE text_en 
  END as content,
  content_type,
  display_order
FROM content
WHERE section_id = (SELECT id FROM sections WHERE key = $2)
ORDER BY display_order ASC;

-- Result:
-- field_key           | content                                    | content_type | display_order
-- hero_label          | Osama Tammam · Cairo                      | heading      | 0
-- hero_headline_1     | Making hard products                       | heading      | 1
-- hero_headline_2     | feel inevitable.                           | heading      | 2
-- hero_description    | Seven years building products...           | paragraph    | 3
-- ...

-- ============================================================================
-- 2. FETCH NAVIGATION ITEMS (both languages)
-- ============================================================================
-- Usage: For navigation menu - fetch all items in one query
-- Example: GET /api/navigation

SELECT 
  link,
  label_en,
  label_ar,
  display_order
FROM navigation
WHERE is_visible = true
ORDER BY display_order ASC;

-- Result:
-- link    | label_en    | label_ar     | display_order
-- #home   | Home        | الرئيسية      | 0
-- #why-me | Why Me      | لماذا أنا    | 1
-- #skills | Skills      | المهارات     | 2
-- ...

-- ============================================================================
-- 3. FETCH IMAGE WITH METADATA
-- ============================================================================
-- Usage: When rendering images, get alt text and aspect ratio
-- Example: GET /api/images/hero_portrait

SELECT 
  key,
  image_url,
  alt_text_en,
  alt_text_ar,
  aspect_ratio,
  width,
  height
FROM images
WHERE key = $1;

-- Result:
-- key            | image_url                      | alt_text_en          | alt_text_ar      | aspect_ratio | width | height
-- hero_portrait  | /assets/e31509a0541824cfed... | Osama Tammam portrait | صورة أسامة تمام | 1:1          | 400   | 400

-- ============================================================================
-- 4. FETCH LIST ITEMS (dynamic arrays like hero_roles, skill_tags)
-- ============================================================================
-- Usage: For sections with dynamic lists
-- Example: GET /api/sections/hero/lists/hero_roles?lang=en

SELECT 
  CASE 
    WHEN $2 = 'ar' THEN item_text_ar 
    ELSE item_text_en 
  END as item,
  display_order
FROM list_items
WHERE section_id = (SELECT id FROM sections WHERE key = $3)
  AND list_key = $1
  AND is_visible = true
ORDER BY display_order ASC;

-- Result (for hero_roles):
-- item
-- Senior UX Designer
-- Senior UI Designer
-- AI Product Designer

-- ============================================================================
-- 5. FETCH CARDS (structured content like why_hire_me cards)
-- ============================================================================
-- Usage: For card-based sections
-- Example: GET /api/sections/why_hire_me/cards?lang=en

SELECT 
  c.id,
  c.card_key,
  CASE 
    WHEN $2 = 'ar' THEN c.title_ar 
    ELSE c.title_en 
  END as title,
  CASE 
    WHEN $2 = 'ar' THEN c.description_ar 
    ELSE c.description_en 
  END as description,
  c.display_order
FROM cards c
WHERE c.section_id = (SELECT id FROM sections WHERE key = $1)
  AND c.is_visible = true
ORDER BY c.display_order ASC;

-- Result (for why_hire_me cards):
-- id | card_key    | title              | description                    | display_order
-- 1  | whm_card_1  | Systems Thinking   | Scalable design systems...     | 0
-- 2  | whm_card_2  | AI-Driven Process  | Leveraging cutting-edge AI...  | 1
-- ...

-- ============================================================================
-- 6. FETCH CARD WITH TAGS
-- ============================================================================
-- Usage: When rendering a card with tags
-- Example: GET /api/cards/skill_discipline_1/tags?lang=en

SELECT 
  c.title_en,
  c.title_ar,
  CASE 
    WHEN $2 = 'ar' THEN c.tagline_ar 
    ELSE c.tagline_en 
  END as tagline,
  ARRAY_AGG(json_build_object(
    'tag', CASE WHEN $2 = 'ar' THEN ct.tag_text_ar ELSE ct.tag_text_en END,
    'order', ct.display_order
  ) ORDER BY ct.display_order) as tags
FROM cards c
LEFT JOIN card_tags ct ON c.id = ct.card_id
WHERE c.card_key = $1
GROUP BY c.id, c.title_en, c.title_ar, c.tagline_en, c.tagline_ar;

-- Result (for skill_discipline_1):
-- title_en | title_ar | tagline | tags
--          |          |         | [{"tag": "User Interviews", "order": 0}, {"tag": "Usability Testing", "order": 1}, ...]

-- ============================================================================
-- 7. FETCH CASE STUDY (portfolio projects)
-- ============================================================================
-- Usage: When user clicks on portfolio project
-- Example: GET /api/case-studies/nexus_analytics?lang=en

SELECT 
  key,
  CASE 
    WHEN $2 = 'ar' THEN title_ar 
    ELSE title_en 
  END as title,
  CASE 
    WHEN $2 = 'ar' THEN description_ar 
    ELSE description_en 
  END as description,
  display_order
FROM case_studies
WHERE key = $1;

-- Result:
-- key             | title            | description                          | display_order
-- nexus_analytics | Nexus Analytics  | End-to-end redesign of a B2B SaaS... | 0

-- ============================================================================
-- 8. FETCH ALL SECTIONS (for admin dashboard)
-- ============================================================================
-- Usage: Admin needs to know all sections to build editor tabs
-- Example: GET /api/admin/sections

SELECT 
  id,
  key,
  label_en,
  label_ar,
  display_order,
  is_visible
FROM sections
ORDER BY display_order ASC;

-- Result:
-- id | key            | label_en | label_ar | display_order | is_visible
-- 1  | navigation     | Navigation | التنقل | 0 | true
-- 2  | hero           | Hero     | البطل    | 1 | true
-- 3  | why_hire_me    | Why Hire Me | لماذا توظفني | 2 | true
-- ...

-- ============================================================================
-- 9. FETCH SECTION FOR EDITING (admin)
-- ============================================================================
-- Usage: When admin opens a section in the CMS for editing
-- Example: GET /api/admin/sections/hero/edit

SELECT 
  c.id,
  c.field_key,
  c.text_en,
  c.text_ar,
  c.content_type,
  c.display_order,
  c.is_visible
FROM content c
WHERE c.section_id = (SELECT id FROM sections WHERE key = $1)
ORDER BY c.display_order ASC;

-- Result:
-- id | field_key | text_en | text_ar | content_type | display_order | is_visible
-- 1 | hero_label | Osama Tammam · Cairo | أسامة تمام · القاهرة | heading | 0 | true
-- 2 | hero_headline_1 | Making hard products | صنع منتجات صعبة | heading | 1 | true
-- ...

-- ============================================================================
-- 10. FETCH SETTINGS (for theme/feature flags)
-- ============================================================================
-- Usage: On app load, fetch global settings
-- Example: GET /api/settings

SELECT 
  setting_key,
  setting_value,
  setting_type
FROM settings
WHERE setting_type != 'description';

-- Result:
-- setting_key | setting_value | setting_type
-- site_title_en | Osama Tammam - Product Designer | text
-- enable_animations | true | boolean
-- enable_dark_mode | true | boolean

-- ============================================================================
-- MUTATION EXAMPLES (POST/PUT/DELETE)
-- ============================================================================

-- ============================================================================
-- 11. UPDATE SECTION CONTENT (admin)
-- ============================================================================
-- Usage: Admin saves changes to a field
-- Example: PUT /api/admin/content/{id}

UPDATE content
SET 
  text_en = $1,
  text_ar = $2,
  updated_at = NOW()
WHERE id = $3
RETURNING id, field_key, text_en, text_ar, updated_at;

-- ============================================================================
-- 12. UPDATE CARD (admin)
-- ============================================================================
-- Usage: Admin edits why_hire_me card
-- Example: PUT /api/admin/cards/{id}

UPDATE cards
SET 
  title_en = $1,
  title_ar = $2,
  description_en = $3,
  description_ar = $4,
  updated_at = NOW()
WHERE id = $5
RETURNING id, card_key, title_en, title_ar, description_en, description_ar, updated_at;

-- ============================================================================
-- 13. CREATE NEW LIST ITEM (admin)
-- ============================================================================
-- Usage: Admin adds new hero role, skill tag, etc.
-- Example: POST /api/admin/list-items

INSERT INTO list_items (section_id, list_key, item_text_en, item_text_ar, display_order, is_visible)
VALUES ($1, $2, $3, $4, $5, true)
RETURNING id, item_text_en, item_text_ar, display_order;

-- ============================================================================
-- 14. DELETE LIST ITEM (admin)
-- ============================================================================
-- Usage: Admin removes a role, tag, etc.
-- Example: DELETE /api/admin/list-items/{id}

DELETE FROM list_items
WHERE id = $1
RETURNING id;

-- ============================================================================
-- 15. REORDER ITEMS (admin)
-- ============================================================================
-- Usage: Admin drag-to-reorder list items
-- Example: PUT /api/admin/list-items/{id}/reorder

UPDATE list_items
SET display_order = $1, updated_at = NOW()
WHERE id = $2
RETURNING id, display_order;

-- ============================================================================
-- 16. UPLOAD IMAGE (admin)
-- ============================================================================
-- Usage: Admin uploads new image, we store metadata
-- Note: File upload is separate (to Supabase Storage)

INSERT INTO images (section_id, key, image_url, alt_text_en, alt_text_ar, aspect_ratio, width, height)
VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
RETURNING id, key, image_url, aspect_ratio;

-- ============================================================================
-- 17. TOGGLE VISIBILITY (admin)
-- ============================================================================
-- Usage: Admin hides/shows a section or item without deleting it

UPDATE content
SET is_visible = NOT is_visible, updated_at = NOW()
WHERE id = $1
RETURNING id, is_visible;

-- Or for list items:
UPDATE list_items
SET is_visible = NOT is_visible, updated_at = NOW()
WHERE id = $1
RETURNING id, is_visible;

-- ============================================================================
-- COMPLEX QUERIES FOR ADVANCED USE CASES
-- ============================================================================

-- ============================================================================
-- 18. FETCH FULL HERO SECTION (all data at once for efficient loading)
-- ============================================================================
-- Usage: GET /api/sections/hero/full?lang=en
-- Returns all fields, images, lists in one query

WITH hero_section AS (
  SELECT id FROM sections WHERE key = 'hero'
)
SELECT 
  'content' as type,
  json_agg(json_build_object(
    'field_key', field_key,
    'content', CASE WHEN $1 = 'ar' THEN text_ar ELSE text_en END,
    'type', content_type
  ) ORDER BY display_order) as data
FROM content
WHERE section_id IN (SELECT id FROM hero_section)

UNION ALL

SELECT 
  'image' as type,
  json_agg(json_build_object(
    'key', key,
    'url', image_url,
    'alt', CASE WHEN $1 = 'ar' THEN alt_text_ar ELSE alt_text_en END,
    'aspectRatio', aspect_ratio
  )) as data
FROM images
WHERE section_id IN (SELECT id FROM hero_section)

UNION ALL

SELECT 
  'roles' as type,
  json_agg(json_build_object(
    'text', CASE WHEN $1 = 'ar' THEN item_text_ar ELSE item_text_en END
  ) ORDER BY display_order) as data
FROM list_items
WHERE section_id IN (SELECT id FROM hero_section) AND list_key = 'hero_roles';

-- ============================================================================
-- 19. FETCH SKILLS SECTION WITH CARDS AND TAGS (full discipline data)
-- ============================================================================
-- Usage: GET /api/sections/skills/full?lang=en

WITH skills_section AS (
  SELECT id FROM sections WHERE key = 'skills'
),
content_data AS (
  SELECT 
    'content' as type,
    json_agg(json_build_object(
      'field_key', field_key,
      'content', CASE WHEN $1 = 'ar' THEN text_ar ELSE text_en END,
      'type', content_type
    ) ORDER BY display_order) as data
  FROM content
  WHERE section_id IN (SELECT id FROM skills_section)
),
cards_data AS (
  SELECT 
    'cards' as type,
    json_agg(json_build_object(
      'id', c.id,
      'title', CASE WHEN $1 = 'ar' THEN c.title_ar ELSE c.title_en END,
      'tagline', CASE WHEN $1 = 'ar' THEN c.tagline_ar ELSE c.tagline_en END,
      'tags', COALESCE(json_agg(
        json_build_object(
          'text', CASE WHEN $1 = 'ar' THEN ct.tag_text_ar ELSE ct.tag_text_en END
        )
        ORDER BY ct.display_order
      ) FILTER (WHERE ct.id IS NOT NULL), '[]'::json)
    ) ORDER BY c.display_order) as data
  FROM cards c
  LEFT JOIN card_tags ct ON c.id = ct.card_id
  WHERE c.section_id IN (SELECT id FROM skills_section)
  GROUP BY c.id, c.title_en, c.title_ar, c.tagline_en, c.tagline_ar, c.display_order
)
SELECT 'skills' as section, json_object_agg(type, data) as full_data
FROM (
  SELECT * FROM content_data
  UNION ALL
  SELECT * FROM cards_data
) combined;

-- ============================================================================
-- 20. AUDIT LOG (see what changed and when)
-- ============================================================================
-- Usage: Admin dashboard audit trail
-- Note: Requires trigger-based audit table (suggested next migration)

-- CREATE TABLE audit_log (
--   id BIGSERIAL PRIMARY KEY,
--   table_name TEXT NOT NULL,
--   record_id BIGINT NOT NULL,
--   action TEXT NOT NULL, -- 'INSERT', 'UPDATE', 'DELETE'
--   old_value JSONB,
--   new_value JSONB,
--   changed_by TEXT NOT NULL,
--   changed_at TIMESTAMP DEFAULT NOW()
-- );

SELECT 
  table_name,
  action,
  old_value,
  new_value,
  changed_by,
  changed_at
FROM audit_log
ORDER BY changed_at DESC
LIMIT 50;

-- ============================================================================
-- FRONTEND HOOK SIGNATURES
-- ============================================================================
-- Based on these queries, the frontend should have hooks like:

-- useSection('hero', 'en')
--   → fetches all content fields for section + images + lists
--   → returns { fields: {}, images: {}, lists: {} }

-- useNavigation('en')
--   → fetches navigation items
--   → returns [{ link, label, order }]

-- useCaseStudies('en')
--   → fetches all case studies
--   → returns [{ key, title, description, order }]

-- useSettings()
--   → fetches global settings
--   → returns { site_title, enable_animations, ... }

-- useImage(key)
--   → fetches image metadata
--   → returns { url, alt_en, alt_ar, aspectRatio, width, height }

-- useSectionEdit(sectionKey)
--   → for admin panel: fetches editable content
--   → returns [ { field_key, text_en, text_ar, type, order, id } ]

-- updateContent(id, text_en, text_ar)
--   → mutation for admin save
--   → returns updated record

-- deleteListItem(id)
--   → mutation for admin delete list item
--   → returns { success, deleted_id }
