# Supabase Backend Documentation

Complete backend design for bilingual portfolio website content management system.

---

## 📋 Documentation Structure

### Getting Started
- **[QUICKSTART.md](./QUICKSTART.md)** — Deploy backend + connect frontend in 15 minutes

### Technical Guides
- **[example_queries.sql](./example_queries.sql)** — All SQL queries for frontend integration (20+ queries)
- **[frontend_integration_guide.md](./frontend_integration_guide.md)** — How to refactor components to use backend data
- **[admin_panel_architecture.md](./admin_panel_architecture.md)** — Complete admin dashboard design & components

### Schema
- **[../migrations/01_create_content_schema.sql](../migrations/01_create_content_schema.sql)** — Database schema migration (10 tables)
- **[../migrations/02_seed_content.sql](../migrations/02_seed_content.sql)** — Initial content seed data

---

## 🏗️ System Architecture

### Overview

```
┌─────────────────────────────────────────────────────────┐
│                    Frontend (React)                     │
│  Hero | WhyHireMe | Skills | Portfolio | Tools | Contact│
└─────────────────────────────────────────────────────────┘
                         ↓ (fetch)
┌─────────────────────────────────────────────────────────┐
│              CmsContext (React Context)                  │
│  Fetches data from Supabase on app load                 │
│  Real-time subscriptions for live updates              │
│  Provides data via useCmsSection() hook                │
└─────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────┐
│         Supabase Database (PostgreSQL)                  │
│  • sections, content, cards, images, etc.              │
│  • RLS policies (read for all, admin only modify)      │
│  • Real-time subscriptions enabled                     │
└─────────────────────────────────────────────────────────┘
```

### Data Flow

1. **App Loads** → CmsContext fetches all content from Supabase
2. **Component Mounts** → Uses `useCmsSection()` hook to get data
3. **User Changes Language** → Components re-render with translated content
4. **Admin Edits Content** → Updates database via admin panel
5. **Database Changes** → Real-time event broadcasts to all clients
6. **CmsContext Refetches** → Components automatically update (no refresh needed)

---

## 📊 Database Schema

### 10 Tables

#### 1. `sections` — Website sections
```sql
Columns: id, key (hero, why_hire_me, skills, etc.)
         label_en, label_ar, display_order, is_visible
Purpose: Logical grouping of content
```

#### 2. `content` — Main text/field storage (bilingual)
```sql
Columns: id, section_id, field_key, text_en, text_ar,
         content_type (text, heading, paragraph),
         display_order, is_visible
Purpose: All website text content in EN and AR
```

#### 3. `cards` — Structured card content
```sql
Columns: id, section_id, card_key, title_en/ar, 
         description_en/ar, tagline_en/ar,
         display_order, is_visible
Purpose: Why Hire Me cards, Skill disciplines, Tool cards, etc.
```

#### 4. `card_tags` — Tags within cards
```sql
Columns: id, card_id, tag_text_en, tag_text_ar, display_order
Purpose: Skill tags, tool categories, etc.
```

#### 5. `images` — Image metadata
```sql
Columns: id, section_id, key, image_url, alt_text_en/ar,
         aspect_ratio, width, height, display_order
Purpose: Store image paths + metadata (aspect ratio, alt text)
```

#### 6. `list_items` — Dynamic arrays
```sql
Columns: id, section_id, list_key, item_text_en/ar, 
         display_order, is_visible
Purpose: Hero roles, Footer links, etc. (arrays of items)
```

#### 7. `navigation` — Menu items
```sql
Columns: id, label_en, label_ar, link, display_order, is_visible
Purpose: Navigation menu items
```

#### 8. `case_studies` — Portfolio projects
```sql
Columns: id, key, title_en/ar, description_en/ar,
         display_order
Purpose: Portfolio case studies
```

#### 9. `seo_metadata` — SEO fields (future-proofing)
```sql
Columns: id, section_id, meta_key, value_en, value_ar
Purpose: Page titles, descriptions, meta tags, etc.
```

#### 10. `settings` — Global application settings
```sql
Columns: id, setting_key, setting_value, setting_type,
         description
Purpose: Site title, feature flags, theme settings, etc.
```

---

## 🌍 Bilingual Support

### Design Pattern

Every content table has **both** English and Arabic columns:
- `text_en` / `text_ar` (content table)
- `title_en` / `title_ar` (cards table)
- `alt_text_en` / `alt_text_ar` (images table)
- etc.

### Frontend Language Handling

```typescript
// useCmsSection hook handles language logic
const getField = (fieldKey: string): string => {
  const langSuffix = lang === 'ar' ? '_ar' : '_en';
  return data.fields[`${fieldKey}${langSuffix}`] || '';
};

// Component just calls
<h1>{getField('hero_headline_1')}</h1>
// Returns "Making hard products" (EN) or "صنع منتجات صعبة" (AR)
```

### RTL Support

LanguageContext applies RTL styles globally:
```typescript
document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
document.documentElement.classList.toggle('rtl', lang === 'ar');
```

---

## 🔐 Security & Permissions

### Authentication
- **Method**: Supabase Auth with Magic Links
- **Allowed Users**: `osama@design` only (hardcoded)
- **Session**: JWT token, auto-refresh

### Row Level Security (RLS)

```sql
-- Public can read all content
CREATE POLICY "Allow public read"
  ON content FOR SELECT
  USING (is_visible = true);

-- Only osama can modify
CREATE POLICY "Admin only modify"
  ON content FOR UPDATE
  USING (auth.uid() = 'OSAMA_UID');
```

**Key Security Principle**: 
- ✅ Frontend can READ all content freely (no auth needed to view site)
- ✅ Only admin can WRITE/MODIFY (admin dashboard requires magic link)
- ✅ All changes logged in audit trail

---

## 📱 Content Editing

### Admin Dashboard Features

1. **Section Tabs** — Navigate between hero, skills, portfolio, etc.
2. **Bilingual Inputs** — Edit EN and AR side by side
3. **Real-Time Preview** — See changes live as you type
4. **Drag-to-Reorder** — Reorder items, cards, roles
5. **Image Upload** — Upload to Supabase Storage
6. **Change History** — Audit log shows who changed what when
7. **Soft Delete** — Hide items without permanently deleting

### Content Categories

#### Settings
- Site title (EN/AR)
- Site description (EN/AR)
- Enable/disable animations

#### Navigation
- Menu items (6 items)
- Links and labels in both languages

#### Hero Section
- Label, headlines, description, CTAs
- Hero portrait image
- Dynamic roles list (3 items)

#### Why Hire Me Section
- 4 cards with titles and descriptions

#### Skills Section
- Heading, description
- 3 skill disciplines with 4 tags each

#### Portfolio Section
- Heading, description
- 4 case studies

#### Tools Section
- Title, description
- 6 tool cards with descriptions

#### Contact Section
- Headlines, body text, email, availability
- 2 signoff lines

#### Footer Section
- Copyright text
- Links list

---

## 🚀 Deployment Steps

### 1. Create Schema (5 min)
```bash
# Paste 01_create_content_schema.sql into Supabase SQL Editor
# Click Run
```

### 2. Seed Initial Data (3 min)
```bash
# Paste 02_seed_content.sql into Supabase SQL Editor
# Click Run
```

### 3. Set Environment Variables (2 min)
Create `.env.local`:
```
VITE_SUPABASE_URL=https://lajgxkcqnqmgzofshqdg.supabase.co
VITE_SUPABASE_ANON_KEY=<your_key>
```

### 4. Create Supabase Client (2 min)
Create `src/lib/supabase.ts` — see [Frontend Integration Guide](./frontend_integration_guide.md)

### 5. Add CmsContext (5 min)
Create `src/app/contexts/CmsContext.tsx` — see [Frontend Integration Guide](./frontend_integration_guide.md)

### 6. Refactor Components (10 min each)
Update each component to use `useCmsSection()` — see [Frontend Integration Guide](./frontend_integration_guide.md)

### 7. Build Admin Panel (TBD)
See [Admin Panel Architecture](./admin_panel_architecture.md)

---

## 📊 Example: Fetching Content

### Frontend Code
```typescript
import { useCmsSection } from '@/app/hooks/useCmsSection';

export function Hero() {
  const { getField, getList, loading } = useCmsSection('hero');

  if (loading) return <Skeleton />;

  return (
    <section>
      <h1>{getField('hero_headline_1')}</h1>
      <ul>
        {getList('hero_roles').map(role => <li key={role}>{role}</li>)}
      </ul>
    </section>
  );
}
```

### Database Query (behind the scenes)
```sql
-- Fetch all hero content
SELECT field_key, text_en, text_ar, content_type, display_order
FROM content
WHERE section_id = (SELECT id FROM sections WHERE key = 'hero')
ORDER BY display_order;

-- Fetch hero roles
SELECT item_text_en, item_text_ar, display_order
FROM list_items
WHERE section_id = (SELECT id FROM sections WHERE key = 'hero')
  AND list_key = 'hero_roles'
ORDER BY display_order;
```

---

## 🔄 Real-Time Updates

### How It Works

1. Admin changes content in dashboard
2. `UPDATE content SET text_en = '...'` in database
3. Supabase broadcasts real-time event to all clients
4. CmsContext receives event → refetches content
5. Components re-render with new data
6. **No manual refresh needed!**

### Configure Real-Time Subscriptions

```typescript
// CmsContext automatically subscribes
const subscription = supabase
  .channel('content_changes')
  .on('postgres_changes', { event: '*', schema: 'public', table: 'content' }, () => {
    fetchAllContent(); // Refetch when content changes
  })
  .subscribe();
```

---

## 📊 Performance Considerations

### Current Approach
- **Load all sections on app load** — Simple, ~10 API calls
- **Cache in memory** — No additional requests during session
- **Real-time updates** — Instant changes without refresh

### Optimizations (Optional Future)

1. **Lazy Load Sections** — Only fetch visible section when component mounts
2. **Service Worker Cache** — Save to offline cache, update in background
3. **Image Optimization** — Use CDN, WebP, responsive sizes
4. **Database Indexes** — Already added on frequently-queried columns

---

## 🧪 Testing Checklist

### Database
- [ ] All 10 tables created
- [ ] Seed data inserted (40+ rows)
- [ ] RLS policies active
- [ ] Foreign key relationships working

### Frontend
- [ ] Environment variables set
- [ ] Supabase client initialized
- [ ] CmsContext loads on app startup
- [ ] Components render content from backend
- [ ] Language toggle switches content
- [ ] Images load with correct aspect ratios

### Admin Panel
- [ ] Magic link login works
- [ ] Content editor displays all sections
- [ ] Bilingual inputs save correctly
- [ ] Changes appear on live site within seconds
- [ ] Drag-to-reorder works
- [ ] Image upload functional

---

## 📚 Files Reference

### Migrations
- `migrations/01_create_content_schema.sql` — Database schema
- `migrations/02_seed_content.sql` — Initial content

### Documentation
- `docs/QUICKSTART.md` — 15-minute deployment guide
- `docs/example_queries.sql` — 20+ SQL query examples
- `docs/frontend_integration_guide.md` — Component refactoring guide
- `docs/admin_panel_architecture.md` — Admin dashboard design

### Frontend Code (To Create)
- `src/lib/supabase.ts` — Supabase client
- `src/app/contexts/CmsContext.tsx` — Data fetching context
- `src/app/hooks/useCmsSection.ts` — Main content hook
- `src/app/contexts/LanguageContext.tsx` — Simplified (language selection only)

---

## 🎯 Next Steps

### Immediate (Today)
1. ✅ Deploy schema to Supabase (DONE - file created)
2. ✅ Seed initial data (DONE - file created)
3. Create `.env.local` with credentials
4. Create `src/lib/supabase.ts` client
5. Create `src/app/contexts/CmsContext.tsx`
6. Test with Hero component

### Short Term (This Week)
7. Refactor all components to use `useCmsSection()` hook
8. Create admin auth system
9. Build admin dashboard MVP
10. Test with live content edits

### Medium Term (Next Week)
11. Optimize images (CDN, responsive sizes)
12. Add error handling and fallbacks
13. Deploy to production
14. Set up monitoring/logging

### Long Term (Future)
15. Build image upload system
16. Add audit logging
17. Create content versioning/rollback
18. Add analytics tracking
19. Implement cache warming

---

## 🆘 Getting Help

### Troubleshooting
1. Check [QUICKSTART.md](./QUICKSTART.md) — Troubleshooting section
2. Review [Frontend Integration Guide](./frontend_integration_guide.md) — Common issues
3. Check browser console for error messages
4. Verify `.env.local` has correct credentials

### Documentation
- Supabase Docs: https://supabase.com/docs
- React Docs: https://react.dev
- TypeScript Docs: https://www.typescriptlang.org/docs

### Support
- Check database schema in Supabase Dashboard
- Review SQL migrations for comments and explanations
- Look at example queries for common patterns

---

## 📝 Summary

This backend design provides:

✅ **Clean Database Schema** — 10 tables, fully normalized, bilingual throughout
✅ **Initial Content** — All website content pre-populated in EN/AR
✅ **Admin Dashboard** — Architecture designed for full CMS functionality
✅ **Frontend Hooks** — Simple React hooks for component integration
✅ **Real-Time Updates** — Changes appear instantly without refresh
✅ **Security** — RLS policies, magic link auth, audit trails
✅ **Documentation** — Complete guides, SQL examples, deployment steps

**Time to Production**: ~2-4 hours from scratch

