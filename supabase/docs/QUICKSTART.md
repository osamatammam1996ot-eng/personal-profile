# Quick Start - Deploy Backend & Connect Frontend

This guide walks you through deploying the Supabase backend and connecting it to your frontend in about 15 minutes.

---

## Prerequisites

✓ Supabase project created (ID: `lajgxkcqnqmgzofshqdg`)
✓ Supabase credentials available
✓ Frontend running locally or deployed

---

## Phase 1: Deploy Supabase Schema (5 minutes)

### 1.1 Get Supabase Credentials

Go to your Supabase project:
1. Visit [https://app.supabase.com](https://app.supabase.com)
2. Select project: **lajgxkcqnqmgzofshqdg**
3. Go to **Settings → API** and copy:
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY` (for admin operations)

### 1.2 Run Migration

Option A: **Via Supabase Dashboard**
1. Go to **SQL Editor**
2. Click **New Query**
3. Paste contents of [supabase/migrations/01_create_content_schema.sql](../migrations/01_create_content_schema.sql)
4. Click **Run**
5. Confirm all tables created successfully

Option B: **Via Supabase CLI** (if installed)
```bash
supabase db push
```

### 1.3 Verify Schema

In Supabase Dashboard:
- Go to **Table Editor**
- Confirm these tables exist:
  - ✓ `sections`
  - ✓ `content`
  - ✓ `images`
  - ✓ `list_items`
  - ✓ `cards`
  - ✓ `card_tags`
  - ✓ `navigation`
  - ✓ `seo_metadata`
  - ✓ `case_studies`
  - ✓ `settings`

---

## Phase 2: Seed Initial Data (3 minutes)

### 2.1 Run Seed Migration

1. Go to **SQL Editor** in Supabase Dashboard
2. Click **New Query**
3. Paste contents of [supabase/migrations/02_seed_content.sql](../migrations/02_seed_content.sql)
4. Click **Run**
5. Confirm all data inserted successfully

### 2.2 Verify Data

In **Table Editor**:
- Open `sections` table
- Should see 8 sections (hero, why_hire_me, skills, portfolio, tools, contact, footer, navigation)
- Open `content` table
- Should see ~40 content rows with EN/AR text

---

## Phase 3: Set Up Frontend Environment (2 minutes)

### 3.1 Create Environment File

Create `.env.local` in project root:

```env
VITE_SUPABASE_URL=https://lajgxkcqnqmgzofshqdg.supabase.co
VITE_SUPABASE_ANON_KEY=<your_anon_key_here>
```

### 3.2 Install Supabase Client

If not already installed:
```bash
npm install @supabase/supabase-js
```

---

## Phase 4: Create Supabase Client (2 minutes)

Create `src/lib/supabase.ts`:

```typescript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

---

## Phase 5: Create CMS Context (3 minutes)

**Status**: Copy from [supabase/docs/frontend_integration_guide.md](frontend_integration_guide.md)

Create `src/app/contexts/CmsContext.tsx` with the code provided in the integration guide.

---

## Phase 6: Update App.tsx (1 minute)

Update `src/app/App.tsx`:

```typescript
import { RouterProvider } from 'react-router-dom';
import { LanguageProvider } from './contexts/LanguageContext';
import { CmsProvider } from './contexts/CmsContext';  // ADD THIS
import { router } from './routes';

export function App() {
  return (
    <LanguageProvider>
      <CmsProvider>                             {/* ADD THIS */}
        <RouterProvider router={router} />
      </CmsProvider>                            {/* ADD THIS */}
    </LanguageProvider>
  );
}
```

---

## Phase 7: Create useCmsSection Hook (2 minutes)

Create `src/app/hooks/useCmsSection.ts` with the code provided in the integration guide.

---

## Phase 8: Refactor First Component (5 minutes)

Start with Hero.tsx. Update to use `useCmsSection`:

```typescript
// Before
import { useLanguage } from '@/app/contexts/LanguageContext';

export function Hero() {
  const { t } = useLanguage();
  return <h1>{t.hero.headline_1}</h1>;
}

// After
import { useCmsSection } from '@/app/hooks/useCmsSection';

export function Hero() {
  const { getField, getList, loading } = useCmsSection('hero');
  
  if (loading) return <div>Loading...</div>;
  
  return <h1>{getField('hero_headline_1')}</h1>;
}
```

---

## Phase 9: Test Backend Connection (3 minutes)

### 9.1 Start Dev Server

```bash
npm run dev
```

### 9.2 Check Browser Console

Open DevTools (F12) → **Console** tab

Should see:
- ✓ No errors
- ✓ CMS data loading
- ✓ Content rendered

Look for:
```javascript
// Should show no errors
console.log(useCms()) // should have content
```

### 9.3 Toggle Language

Click language toggle in navigation
- Content should switch between EN and AR
- RTL direction should apply

---

## Phase 10: Set Up Admin Authentication (5 minutes)

### 10.1 Enable Email Authentication

In Supabase Dashboard:
1. Go to **Authentication → Providers**
2. Enable **Email** (should already be enabled)
3. Go to **Settings → Email Templates**
4. Customize magic link email if desired

### 10.2 Create Admin User

In Supabase Dashboard:
1. Go to **Authentication → Users**
2. Click **Add User**
3. Email: `osama@design` (or your email)
4. Password: Auto-generate
5. Click **Create User**

### 10.3 Add Admin Route

Create `src/app/routes.ts`:

```typescript
import { PortfolioRoot } from './PortfolioRoot';
import { AdminDashboard } from './components/cms/AdminDashboard';
import { AdminAuth } from './components/cms/AdminAuth';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <PortfolioRoot />,
  },
  {
    path: '/admin',
    element: <AdminDashboard />,
  },
  {
    path: '/admin/login',
    element: <AdminAuth />,
  },
  {
    path: '/admin/callback',
    element: <AdminCallback />,
  },
]);
```

---

## Phase 11: Deploy Admin Panel (WIP - Full Implementation)

For now, just verify the route works:
- Visit `http://localhost:5173/admin`
- Should redirect to `/admin/login`

Full admin dashboard implementation will follow in next steps.

---

## Testing Checklist

### Frontend Loading
- [ ] Site loads without errors
- [ ] Console shows no Supabase errors
- [ ] Content renders from backend

### Language Switching
- [ ] English/Arabic toggle works
- [ ] Content switches languages
- [ ] RTL applies for Arabic

### Specific Components
- [ ] Hero section displays content
- [ ] Why Hire Me shows 4 cards
- [ ] Skills shows 3 disciplines with tags
- [ ] Portfolio shows 4 projects
- [ ] Tools shows 6 tools
- [ ] Contact shows email & availability
- [ ] Footer shows copyright
- [ ] Navigation shows menu items

### Image Loading
- [ ] Hero portrait loads
- [ ] All images render with correct aspect ratios
- [ ] Alt text available (check in DevTools)

### Error Handling
- [ ] Graceful fallback if backend is down
- [ ] Loading states visible during fetch
- [ ] No white screens or crashes

---

## Troubleshooting

### Issue: "VITE_SUPABASE_URL is not defined"

**Solution**: 
1. Check `.env.local` exists in project root
2. Restart dev server after creating `.env.local`
3. Confirm variables are set: `echo $VITE_SUPABASE_URL`

### Issue: "Could not connect to Supabase database"

**Solution**:
1. Verify Supabase project is active (green status)
2. Check internet connection
3. Verify credentials are correct in `.env.local`
4. Check RLS policies in Supabase Dashboard → **Authentication → Policies**

### Issue: Content shows in English only, Arabic doesn't work

**Solution**:
1. Check `02_seed_content.sql` ran successfully
2. Verify `content` table has both `text_en` and `text_ar` filled
3. Check LanguageContext is toggling correctly
4. Verify `getField()` is using correct language suffix

### Issue: Images not loading

**Solution**:
1. Check `images` table has rows
2. Verify image URLs are correct (should be `/assets/...`)
3. Check image files exist in public folder
4. Verify aspect ratio is set in database

### Issue: Admin login not working

**Solution**:
1. Verify user created in Supabase Auth
2. Check email is correct
3. Verify magic link email is being sent
4. Check email subject line isn't in spam
5. Try resetting password via Supabase Dashboard

---

## Performance Tips

### 1. Enable Query Caching

After fetching all content, cache it:

```typescript
const cache = await cacheContent(content);
localStorage.setItem('cms_cache', JSON.stringify(cache));
```

### 2. Only Fetch On App Load

Don't refetch on every language change:

```typescript
// useEffect only depends on [] (empty array)
useEffect(() => {
  fetchAllContent();
}, []); // Not [lang]
```

### 3. Lazy Load Images

For components below the fold:

```typescript
<img 
  src={url} 
  loading="lazy" 
  alt={alt}
/>
```

---

## Next Steps

Once backend is connected and tested:

1. **Build Admin Dashboard**
   - [Admin Panel Architecture Guide](admin_panel_architecture.md)
   - Create CmsContext for admin mutations
   - Build BilingualInput component
   - Build section editors (Hero, WhyHireMe, etc.)

2. **Set Up Image Upload**
   - Create storage bucket in Supabase
   - Build ImageUploader component
   - Store image metadata in `images` table

3. **Deploy to Production**
   - Push to GitHub
   - Connect to Vercel/Netlify
   - Set environment variables in deployment platform
   - Run migrations on production database
   - Test live site

---

## Reference Files

- **Schema**: [supabase/migrations/01_create_content_schema.sql](../migrations/01_create_content_schema.sql)
- **Seed Data**: [supabase/migrations/02_seed_content.sql](../migrations/02_seed_content.sql)
- **Example Queries**: [supabase/docs/example_queries.sql](./example_queries.sql)
- **Frontend Integration**: [supabase/docs/frontend_integration_guide.md](./frontend_integration_guide.md)
- **Admin Panel**: [supabase/docs/admin_panel_architecture.md](./admin_panel_architecture.md)

---

## Support

For issues or questions:
1. Check **Troubleshooting** section above
2. Review [Frontend Integration Guide](frontend_integration_guide.md)
3. Check Supabase docs: https://supabase.com/docs
4. Check browser console for error messages

