-- ============================================================================
-- SEED DATA - Initial content from current frontend
-- ============================================================================

-- ============================================================================
-- 1. INSERT SECTIONS
-- ============================================================================
INSERT INTO sections (key, label_en, label_ar, display_order, is_visible) VALUES
  ('navigation', 'Navigation', 'التنقل', 0, true),
  ('hero', 'Hero', 'البطل', 1, true),
  ('why_hire_me', 'Why Hire Me', 'لماذا توظفني', 2, true),
  ('skills', 'Skills', 'المهارات', 3, true),
  ('portfolio', 'Portfolio', 'المحفظة', 4, true),
  ('tools', 'Tools', 'الأدوات', 5, true),
  ('contact', 'Contact', 'اتصال', 6, true),
  ('footer', 'Footer', 'التذييل', 7, true)
ON CONFLICT(key) DO NOTHING;

-- ============================================================================
-- 2. INSERT NAVIGATION ITEMS
-- ============================================================================
INSERT INTO navigation (label_en, label_ar, link, display_order, is_visible) VALUES
  ('Home', 'الرئيسية', '#home', 0, true),
  ('Why Me', 'لماذا أنا', '#why-me', 1, true),
  ('Skills', 'المهارات', '#skills', 2, true),
  ('Work', 'الأعمال', '#work', 3, true),
  ('Tools', 'الأدوات', '#tools', 4, true),
  ('Contact', 'اتصال', '#contact', 5, true)
ON CONFLICT DO NOTHING;

-- ============================================================================
-- 3. INSERT HERO SECTION CONTENT
-- ============================================================================
INSERT INTO content (section_id, field_key, text_en, text_ar, content_type, display_order) VALUES
  ((SELECT id FROM sections WHERE key = 'hero'), 'hero_label', 'Osama Tammam · Cairo', 'أسامة تمام · القاهرة', 'heading', 0),
  ((SELECT id FROM sections WHERE key = 'hero'), 'hero_headline_1', 'Making hard products', 'صنع منتجات صعبة', 'heading', 1),
  ((SELECT id FROM sections WHERE key = 'hero'), 'hero_headline_2', 'feel inevitable.', 'لا غنى عنها.', 'heading', 2),
  ((SELECT id FROM sections WHERE key = 'hero'), 'hero_description', 'Seven years building products for teams that couldn''t afford to ship the wrong thing. I work closest to the problem when the stakes are highest.', 'سبع سنوات من بناء المنتجات للفرق التي لا تستطيع شحن الشيء الخاطئ. أعمل بأقرب ما يكون إلى المشكلة عندما تكون الرهانات أعلى.', 'paragraph', 3),
  ((SELECT id FROM sections WHERE key = 'hero'), 'hero_cta_primary', 'See my work', 'شاهد أعمالي', 'button', 4),
  ((SELECT id FROM sections WHERE key = 'hero'), 'hero_cta_secondary', 'Let''s talk', 'دعنا نتحدث', 'button', 5),
  ((SELECT id FROM sections WHERE key = 'hero'), 'hero_scroll_hint', 'Scroll', 'اسحب للأسفل', 'label', 6)
ON CONFLICT DO NOTHING;

-- ============================================================================
-- 4. INSERT HERO ROLES (LIST ITEMS)
-- ============================================================================
INSERT INTO list_items (section_id, list_key, item_text_en, item_text_ar, display_order) VALUES
  ((SELECT id FROM sections WHERE key = 'hero'), 'hero_roles', 'Senior UX Designer', 'مصمم تجربة المستخدم الأول', 0),
  ((SELECT id FROM sections WHERE key = 'hero'), 'hero_roles', 'Senior UI Designer', 'مصمم الواجهة الأول', 1),
  ((SELECT id FROM sections WHERE key = 'hero'), 'hero_roles', 'AI Product Designer', 'مصمم المنتجات بالذكاء الاصطناعي', 2)
ON CONFLICT DO NOTHING;

-- ============================================================================
-- 5. INSERT WHY HIRE ME SECTION
-- ============================================================================
INSERT INTO content (section_id, field_key, text_en, text_ar, content_type, display_order) VALUES
  ((SELECT id FROM sections WHERE key = 'why_hire_me'), 'whm_heading', 'Why Hire Me', 'لماذا توظفني', 'heading', 0)
ON CONFLICT DO NOTHING;

-- ============================================================================
-- 6. INSERT WHY HIRE ME CARDS
-- ============================================================================
INSERT INTO cards (section_id, card_key, title_en, title_ar, description_en, description_ar, display_order) VALUES
  ((SELECT id FROM sections WHERE key = 'why_hire_me'), 'whm_card_1', 'Systems Thinking', 'التفكير المنظومي', 'Scalable design systems and component libraries that maintain consistency as your product grows across teams.', 'أنظمة تصميم قابلة للتوسع ومكتبات مكونات تحافظ على الاتساق مع نمو منتجك عبر الفرق.', 0),
  ((SELECT id FROM sections WHERE key = 'why_hire_me'), 'whm_card_2', 'AI-Driven Process', 'عملية مدفوعة بالذكاء الاصطناعي', 'Leveraging cutting-edge AI tools to accelerate ideation, validate designs, and surface insights that manual research misses.', 'الاستفادة من أدوات الذكاء الاصطناعي المتقدمة لتسريع التوليد والتحقق من الأفكار وحل المشاكل التي قد تفتقدها البحوث اليدوية.', 1),
  ((SELECT id FROM sections WHERE key = 'why_hire_me'), 'whm_card_3', 'Enterprise-Grade Execution', 'تنفيذ بمستوى المؤسسات', 'From complex SaaS dashboards to multi-platform enterprise tools — polished, production-ready, every time.', 'من لوحات معلومات SaaS المعقدة إلى أدوات المؤسسات متعددة المنصات - مصقولة وجاهزة للإنتاج في كل مرة.', 2),
  ((SELECT id FROM sections WHERE key = 'why_hire_me'), 'whm_card_4', 'Conversion-Focused UX', 'تجربة مستخدم موجهة نحو التحويل', 'Every decision rooted in psychology and business metrics — crafting flows that turn visitors into loyal users.', 'كل قرار مستند إلى السيكولوجيا والمقاييس التجارية - صياغة تدفقات تحول الزوار إلى مستخدمين مخلصين.', 3)
ON CONFLICT DO NOTHING;

-- ============================================================================
-- 7. INSERT SKILLS SECTION
-- ============================================================================
INSERT INTO content (section_id, field_key, text_en, text_ar, content_type, display_order) VALUES
  ((SELECT id FROM sections WHERE key = 'skills'), 'skills_label', 'Craft', 'الحرفة', 'label', 0),
  ((SELECT id FROM sections WHERE key = 'skills'), 'skills_heading_1', 'Seven years.', 'سبع سنوات.', 'heading', 1),
  ((SELECT id FROM sections WHERE key = 'skills'), 'skills_heading_2', 'Three disciplines.', 'ثلاث تخصصات.', 'heading', 2),
  ((SELECT id FROM sections WHERE key = 'skills'), 'skills_description', 'Not a list of tools I''ve opened once. This is how I actually spend my time — the things I can lead, the methods I reach for first, the work I take responsibility for end-to-end.', 'ليست قائمة بالأدوات التي فتحتها مرة واحدة. هذا هو كيف أنفق وقتي بالفعل - الأشياء التي يمكنني قيادتها، والطرق التي أستخدمها أولاً، والعمل الذي أتحمل المسؤولية عنه من البداية إلى النهاية.', 'paragraph', 3)
ON CONFLICT DO NOTHING;

-- ============================================================================
-- 8. INSERT SKILLS DISCIPLINE CARDS
-- ============================================================================
INSERT INTO cards (section_id, card_key, title_en, title_ar, tagline_en, tagline_ar, display_order) VALUES
  ((SELECT id FROM sections WHERE key = 'skills'), 'skill_discipline_1', 'Research & Understanding', 'البحث والفهم', 'I start by figuring out what question I''m actually trying to answer.', 'أبدأ بمعرفة ما هو السؤال الذي أحاول الإجابة عليه في الواقع.', 0),
  ((SELECT id FROM sections WHERE key = 'skills'), 'skill_discipline_2', 'Design & Systems', 'التصميم والأنظمة', 'I build for the designer who comes after me, not just the sprint I''m in.', 'أبني للمصمم الذي يأتي بعدي، وليس فقط للسباق الذي أنا فيه.', 1),
  ((SELECT id FROM sections WHERE key = 'skills'), 'skill_discipline_3', 'Prototyping & Delivery', 'النماذج الأولية والتسليم', 'A prototype I can''t hand to a developer isn''t done.', 'النموذج الأولي الذي لا يمكنني وضعه في يدي المطور لم ينته بعد.', 2)
ON CONFLICT DO NOTHING;

-- ============================================================================
-- 9. INSERT SKILL TAGS
-- ============================================================================
INSERT INTO card_tags (card_id, tag_text_en, tag_text_ar, display_order)
SELECT c.id, 'User Interviews', 'المقابلات مع المستخدمين', 0 FROM cards c WHERE c.card_key = 'skill_discipline_1'
UNION ALL
SELECT c.id, 'Usability Testing', 'اختبار سهولة الاستخدام', 1 FROM cards c WHERE c.card_key = 'skill_discipline_1'
UNION ALL
SELECT c.id, 'Journey Mapping', 'رسم خرائط الرحلة', 2 FROM cards c WHERE c.card_key = 'skill_discipline_1'
UNION ALL
SELECT c.id, 'Heuristic Evaluation', 'التقييم الاستكشافي', 3 FROM cards c WHERE c.card_key = 'skill_discipline_1'
UNION ALL
SELECT c.id, 'Design Tokens', 'رموز التصميم', 0 FROM cards c WHERE c.card_key = 'skill_discipline_2'
UNION ALL
SELECT c.id, 'Component Libraries', 'مكتبات المكونات', 1 FROM cards c WHERE c.card_key = 'skill_discipline_2'
UNION ALL
SELECT c.id, 'Dark/Light Theming', 'المواضيع الداكنة والفاتحة', 2 FROM cards c WHERE c.card_key = 'skill_discipline_2'
UNION ALL
SELECT c.id, 'Advanced Figma', 'فيجما المتقدمة', 0 FROM cards c WHERE c.card_key = 'skill_discipline_3'
UNION ALL
SELECT c.id, 'Framer', 'فرايمر', 1 FROM cards c WHERE c.card_key = 'skill_discipline_3'
UNION ALL
SELECT c.id, 'Micro-interactions', 'التفاعلات الدقيقة', 2 FROM cards c WHERE c.card_key = 'skill_discipline_3'
ON CONFLICT DO NOTHING;

-- ============================================================================
-- 10. INSERT PORTFOLIO SECTION
-- ============================================================================
INSERT INTO content (section_id, field_key, text_en, text_ar, content_type, display_order) VALUES
  ((SELECT id FROM sections WHERE key = 'portfolio'), 'portfolio_heading_1', 'Products I helped', 'المنتجات التي ساعدت في', 'heading', 0),
  ((SELECT id FROM sections WHERE key = 'portfolio'), 'portfolio_heading_2', 'go from stuck to shipped.', 'الانتقال من الأعطال إلى الشحن.', 'heading', 1),
  ((SELECT id FROM sections WHERE key = 'portfolio'), 'portfolio_description', 'Not concepts. Not mockups. Real products, real constraints, real results.', 'ليست مفاهيم. ليست نماذج أولية. منتجات حقيقية، قيود حقيقية، نتائج حقيقية.', 'paragraph', 2)
ON CONFLICT DO NOTHING;

-- ============================================================================
-- 11. INSERT CASE STUDIES
-- ============================================================================
INSERT INTO case_studies (key, title_en, title_ar, description_en, description_ar, display_order) VALUES
  ('nexus_analytics', 'Nexus Analytics', 'نيكسس أناليتكس', 'End-to-end redesign of a B2B SaaS analytics suite — reducing cognitive load by 40% and boosting user activation by 28% through AI-assisted UX strategy.', 'إعادة تصميم شاملة لمجموعة تطبيقات تحليلات SaaS B2B - تقليل الحمل المعرفي بنسبة 40٪ وزيادة تفعيل المستخدمين بنسبة 28٪ من خلال استراتيجية تجربة المستخدم بمساعدة الذكاء الاصطناعي.', 0),
  ('orion_enterprise', 'Orion Enterprise', 'أوريون إنتربرايز', 'Comprehensive design system and UX overhaul for a Fortune 500 enterprise productivity platform — serving 50,000+ daily active users across 12 product areas.', 'نظام تصميم شامل وتحديث تجربة المستخدم لمنصة إنتاجية للمؤسسات في قائمة Fortune 500 - تخدم 50000+ مستخدم نشط يومياً عبر 12 منطقة منتج.', 1),
  ('luminous_platform', 'Luminous AI', 'لومينوس إيه آي', 'From zero to launch — product design for an AI-powered content generation platform. Shipped in 8 weeks with a 4.8/5 user satisfaction score.', 'من الصفر إلى الإطلاق - تصميم المنتج لمنصة توليد المحتوى المدعومة بالذكاء الاصطناعي. تم الشحن في 8 أسابيع بدرجة رضا المستخدمين 4.8 من 5.', 2),
  ('healthbridge_clinic', 'HealthBridge', 'هيلثبريدج', 'Patient-centric UX for a healthcare management app — accessibility-first design serving diverse user demographics, resulting in 65% reduction in support tickets.', 'تجربة المستخدم الموجهة للمريض لتطبيق إدارة الرعاية الصحية - تصميم يركز على الوصول يخدم التركيبة السكانية المتنوعة للمستخدمين، مما أسفر عن تقليل 65٪ في تذاكر الدعم.', 3)
ON CONFLICT(key) DO NOTHING;

-- ============================================================================
-- 12. INSERT TOOLS SECTION
-- ============================================================================
INSERT INTO content (section_id, field_key, text_en, text_ar, content_type, display_order) VALUES
  ((SELECT id FROM sections WHERE key = 'tools'), 'tools_title', 'My Arsenal!', 'أسلحتي!', 'heading', 0),
  ((SELECT id FROM sections WHERE key = 'tools'), 'tools_label', 'Stack', 'المجموعة', 'label', 1),
  ((SELECT id FROM sections WHERE key = 'tools'), 'tools_description', 'Twelve tools. One cohesive workflow.', 'اثنا عشر أداة. سير عمل واحد متماسك.', 'paragraph', 2)
ON CONFLICT DO NOTHING;

-- ============================================================================
-- 13. INSERT TOOLS CARDS
-- ============================================================================
INSERT INTO cards (section_id, card_key, title_en, title_ar, description_en, description_ar, display_order) VALUES
  ((SELECT id FROM sections WHERE key = 'tools'), 'tool_card_1', 'Figma', 'فيجما', 'Primary environment for UI systems, components and interactive prototypes.', 'البيئة الأساسية لأنظمة، والمكونات والنماذج الأولية التفاعلية.', 0),
  ((SELECT id FROM sections WHERE key = 'tools'), 'tool_card_2', 'Framer', 'فرايمر', 'Turning static designs into production-ready animated web experiences.', 'تحويل التصاميم الثابتة إلى تجارب ويب متحركة جاهزة للإنتاج.', 1),
  ((SELECT id FROM sections WHERE key = 'tools'), 'tool_card_3', 'Lottie', 'لوتي', 'Micro-interactions, loading states and brand animation sequences.', 'التفاعلات الدقيقة، حالات التحميل وسلاسل الرسوم المتحركة للعلامة التجارية.', 2),
  ((SELECT id FROM sections WHERE key = 'tools'), 'tool_card_4', 'Midjourney', 'ميدجورني', 'Ideation and moodboarding with generative visuals for design direction.', 'توليد الأفكار واللوحات المزاجية بالمرئيات التوليدية لاتجاه التصميم.', 3),
  ((SELECT id FROM sections WHERE key = 'tools'), 'tool_card_5', 'ChatGPT', 'تشات جي بي تي', 'Research, copywriting and rapid UX strategy ideation.', 'البحث والكتابة والتفكير السريع في استراتيجية تجربة المستخدم.', 4),
  ((SELECT id FROM sections WHERE key = 'tools'), 'tool_card_6', 'Notion', 'نوشن', 'Design documentation, project wikis and client-facing deliverable hubs.', 'توثيق التصميم، ويكي المشاريع ومراكز التسليمات الموجهة للعملاء.', 5)
ON CONFLICT DO NOTHING;

-- ============================================================================
-- 14. INSERT CONTACT SECTION
-- ============================================================================
INSERT INTO content (section_id, field_key, text_en, text_ar, content_type, display_order) VALUES
  ((SELECT id FROM sections WHERE key = 'contact'), 'contact_availability', 'Open to new work · Replies within 24h', 'مفتوح للعمل الجديد · يرد خلال 24 ساعة', 'label', 0),
  ((SELECT id FROM sections WHERE key = 'contact'), 'contact_headline_1', 'Got a problem', 'لديك مشكلة', 'heading', 1),
  ((SELECT id FROM sections WHERE key = 'contact'), 'contact_headline_2', 'worth solving?', 'تستحق الحل؟', 'heading', 2),
  ((SELECT id FROM sections WHERE key = 'contact'), 'contact_headline_3', 'Let''s talk about it.', 'دعنا نتحدث عن الأمر.', 'heading', 3),
  ((SELECT id FROM sections WHERE key = 'contact'), 'contact_body', 'I take on a small number of projects at a time — enough to give each one real attention. If you have something that needs clarity, a product stuck between good and great, or an idea you haven''t been able to articulate yet, that''s exactly the kind of thing I like to work on.', 'أتولى عدداً صغيراً من المشاريع في المرة الواحدة - بما يكفي للاهتمام الحقيقي بكل منها. إذا كان لديك شيء يحتاج إلى وضوح، أو منتج عالق بين الجيد والرائع، أو فكرة لم تتمكن من التعبير عنها بعد، فهذا بالضبط نوع الأشياء التي أحب العمل عليها.', 'paragraph', 4),
  ((SELECT id FROM sections WHERE key = 'contact'), 'contact_note', 'No pitch decks needed. Just tell me what you''re working on and where it''s breaking down.', 'لا حاجة إلى عروض الملعب. فقط أخبرني بما تعمل عليه وأين ينقطع.', 'label', 5),
  ((SELECT id FROM sections WHERE key = 'contact'), 'contact_email', 'hello@osama.design', 'hello@osama.design', 'label', 6),
  ((SELECT id FROM sections WHERE key = 'contact'), 'contact_signoff_1', 'Based in Egypt · Works with clients worldwide.', 'يقع في مصر · يعمل مع العملاء في جميع أنحاء العالم.', 'label', 7),
  ((SELECT id FROM sections WHERE key = 'contact'), 'contact_signoff_2', 'No agencies. No middlemen. Just me.', 'لا وكالات. لا وسطاء. أنا فقط.', 'label', 8)
ON CONFLICT DO NOTHING;

-- ============================================================================
-- 15. INSERT FOOTER SECTION
-- ============================================================================
INSERT INTO content (section_id, field_key, text_en, text_ar, content_type, display_order) VALUES
  ((SELECT id FROM sections WHERE key = 'footer'), 'footer_copyright', '© 2026 Osama Tammam. All rights reserved.', '© 2026 أسامة تمام. جميع الحقوق محفوظة.', 'label', 0)
ON CONFLICT DO NOTHING;

-- ============================================================================
-- 16. INSERT FOOTER LINKS
-- ============================================================================
INSERT INTO list_items (section_id, list_key, item_text_en, item_text_ar, display_order) VALUES
  ((SELECT id FROM sections WHERE key = 'footer'), 'footer_links', 'Home', 'الرئيسية', 0),
  ((SELECT id FROM sections WHERE key = 'footer'), 'footer_links', 'Portfolio', 'المحفظة', 1),
  ((SELECT id FROM sections WHERE key = 'footer'), 'footer_links', 'About', 'حول', 2),
  ((SELECT id FROM sections WHERE key = 'footer'), 'footer_links', 'Contact', 'اتصال', 3)
ON CONFLICT DO NOTHING;

-- ============================================================================
-- 17. INSERT IMAGES
-- ============================================================================
INSERT INTO images (section_id, key, image_url, alt_text_en, alt_text_ar, aspect_ratio, display_order) VALUES
  ((SELECT id FROM sections WHERE key = 'hero'), 'hero_portrait', '/assets/e31509a0541824cfeda89ddabf83753388778df0.png', 'Osama Tammam portrait', 'صورة أسامة تمام', '1:1', 0)
ON CONFLICT(key) DO NOTHING;

-- ============================================================================
-- 18. INSERT DEFAULT SETTINGS
-- ============================================================================
INSERT INTO settings (setting_key, setting_value, setting_type, description) VALUES
  ('site_title_en', 'Osama Tammam - Product Designer', 'text', 'Website title in English'),
  ('site_title_ar', 'أسامة تمام - مصمم المنتجات', 'text', 'Website title in Arabic'),
  ('site_description_en', 'Full-stack product designer. 7 years. 3 disciplines. 50+ projects.', 'text', 'Website meta description in English'),
  ('site_description_ar', 'مصمم منتجات شامل. 7 سنوات. 3 تخصصات. 50+ مشروع.', 'text', 'Website meta description in Arabic'),
  ('enable_animations', 'true', 'boolean', 'Enable fancy animations'),
  ('enable_dark_mode', 'true', 'boolean', 'Enable dark/light mode toggle')
ON CONFLICT(setting_key) DO NOTHING;
