-- Removes leftovers from the site's first version. Nothing in the current site reads them,
-- but they are still publicly readable through the API and hold old placeholder text.
-- Run in the Supabase SQL Editor. Safe to run more than once. THIS DELETES DATA:
-- the tables below and two sample rows in cms_data. The live content (row `main`),
-- the feedback inbox and the images are not touched.
DROP TABLE IF EXISTS
  public.card_tags, public.cards, public.list_items, public.images, public.content,
  public.navigation, public.seo_metadata, public.case_studies, public.settings,
  public.sections, public.audit_log, public.kv_store_f7b587fc
  CASCADE;

DELETE FROM public.cms_data WHERE id IN ('hero', 'features');

NOTIFY pgrst, 'reload schema';

-- Report: only the tables the site uses should be listed (cms_data, feedback_submissions, login_attempts)
SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name;
