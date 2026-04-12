# Frontend Integration Guide - Connecting to Supabase Backend

## Overview

This guide documents how to convert the current **static frontend** to a **dynamic backend-driven frontend** while maintaining the exact same component structure and visual design.

**Goal**: Replace hardcoded `translations` in [LanguageContext.tsx](../../src/app/contexts/LanguageContext.tsx) with real-time data fetching from Supabase.

---

## Architecture Changes

### Current State (Static)
```
App.tsx
└── LanguageContext (provides translations object)
    └── Components (use hardcoded t.hero.headline, etc.)
        └── Rendered HTML
```

### New State (Dynamic)
```
App.tsx
└── LanguageContext (language selection only)
└── CmsContext (NEW - handles data fetching)
    └── Components (use useCms() hook to fetch data)
        └── Rendered HTML
```

---

## Step-by-Step Integration

### Step 1: Create CmsContext.tsx

**Purpose**: Manages all data fetching from Supabase backend
**Responsibilities**: 
- Fetch content on app load
- Cache data in memory
- Provide hooks for components
- Handle errors gracefully

```typescript
// src/app/contexts/CmsContext.tsx

import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

type ContentData = {
  [sectionKey: string]: {
    fields: Record<string, string>;
    lists: Record<string, string[]>;
    cards: Array<any>;
    images: Record<string, any>;
  };
};

type CmsContextType = {
  content: ContentData;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
};

const CmsContext = createContext<CmsContextType | undefined>(undefined);

export function CmsProvider({ children }: { children: React.ReactNode }) {
  const [content, setContent] = useState<ContentData>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchAllContent = async () => {
    setLoading(true);
    setError(null);

    try {
      // Fetch all sections
      const { data: sections } = await supabase
        .from('sections')
        .select('*');

      const allContent: ContentData = {};

      // For each section, fetch its content
      for (const section of sections || []) {
        const { data: contentRows } = await supabase
          .from('content')
          .select('*')
          .eq('section_id', section.id)
          .order('display_order');

        const { data: cards } = await supabase
          .from('cards')
          .select('*, card_tags(*)')
          .eq('section_id', section.id)
          .order('display_order');

        const { data: listItems } = await supabase
          .from('list_items')
          .select('*')
          .eq('section_id', section.id)
          .order('display_order');

        const { data: images } = await supabase
          .from('images')
          .select('*')
          .eq('section_id', section.id)
          .order('display_order');

        // Format into structure
        allContent[section.key] = {
          fields: formatContentFields(contentRows),
          lists: formatListItems(listItems),
          cards: cards || [],
          images: formatImages(images),
        };
      }

      setContent(allContent);
    } catch (err) {
      setError(err as Error);
      console.error('Failed to fetch CMS content:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllContent();

    // Subscribe to real-time changes
    const subscription = supabase
      .channel('content_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'content' }, () => {
        fetchAllContent();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'cards' }, () => {
        fetchAllContent();
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <CmsContext.Provider value={{ content, loading, error, refetch: fetchAllContent }}>
      {children}
    </CmsContext.Provider>
  );
}

export function useCms() {
  const context = useContext(CmsContext);
  if (!context) {
    throw new Error('useCms must be used within CmsProvider');
  }
  return context;
}

// Helper functions to format data
function formatContentFields(rows: any[]): Record<string, string> {
  const fields: Record<string, string> = {};
  rows?.forEach(row => {
    // Store both EN and AR with language suffix
    if (row.text_en) fields[`${row.field_key}_en`] = row.text_en;
    if (row.text_ar) fields[`${row.field_key}_ar`] = row.text_ar;
  });
  return fields;
}

function formatListItems(rows: any[]): Record<string, string[]> {
  const lists: Record<string, string[]> = {};
  rows?.forEach(row => {
    if (!lists[row.list_key]) {
      lists[row.list_key] = [];
    }
    lists[row.list_key].push({
      en: row.item_text_en,
      ar: row.item_text_ar,
    });
  });
  return lists;
}

function formatImages(rows: any[]): Record<string, any> {
  const images: Record<string, any> = {};
  rows?.forEach(row => {
    images[row.key] = {
      url: row.image_url,
      alt_en: row.alt_text_en,
      alt_ar: row.alt_text_ar,
      aspectRatio: row.aspect_ratio,
      width: row.width,
      height: row.height,
    };
  });
  return images;
}
```

### Step 2: Update App.tsx

Add CmsProvider wrapper:

```typescript
// src/app/App.tsx

import { RouterProvider } from 'react-router-dom';
import { LanguageProvider } from './contexts/LanguageContext';
import { CmsProvider } from './contexts/CmsContext';
import { router } from './routes';

export function App() {
  return (
    <LanguageProvider>
      <CmsProvider>
        <RouterProvider router={router} />
      </CmsProvider>
    </LanguageProvider>
  );
}
```

### Step 3: Create useCmsSection Hook

**Purpose**: Makes it easy for components to fetch one section's data

```typescript
// src/app/hooks/useCmsSection.ts

import { useCms } from '@/app/contexts/CmsContext';
import { useLanguage } from '@/app/contexts/LanguageContext';

export function useCmsSection(sectionKey: string) {
  const { content, loading } = useCms();
  const { lang } = useLanguage();

  const sectionData = content[sectionKey];

  if (loading || !sectionData) {
    return {
      loading: true,
      error: null,
      // Provide empty structure to prevent errors
      fields: {},
      lists: {},
      cards: [],
      images: {},
      getField: () => '',
      getList: () => [],
      getImage: () => null,
    };
  }

  // Helper to get field in current language
  const getField = (fieldKey: string): string => {
    const langSuffix = lang === 'ar' ? '_ar' : '_en';
    return sectionData.fields[`${fieldKey}${langSuffix}`] || '';
  };

  // Helper to get list in current language
  const getList = (listKey: string): string[] => {
    const items = sectionData.lists[listKey] || [];
    return items.map(item => (lang === 'ar' ? item.ar : item.en));
  };

  // Helper to get bilingual list (both languages)
  const getListBilingual = (listKey: string): Array<{ en: string; ar: string }> => {
    return sectionData.lists[listKey] || [];
  };

  // Helper to get cards in current language
  const getCards = () => {
    return sectionData.cards.map(card => ({
      id: card.id,
      title: lang === 'ar' ? card.title_ar : card.title_en,
      description: lang === 'ar' ? card.description_ar : card.description_en,
      tagline: lang === 'ar' ? card.tagline_ar : card.tagline_en,
      tags: card.card_tags?.map(tag => lang === 'ar' ? tag.tag_text_ar : tag.tag_text_en) || [],
      originalData: card, // Keep original for edits
    }));
  };

  // Helper to get image
  const getImage = (imageKey: string): any => {
    return sectionData.images[imageKey] || null;
  };

  return {
    loading: false,
    error: null,
    fields: sectionData.fields,
    lists: sectionData.lists,
    cards: sectionData.cards,
    images: sectionData.images,
    getField,
    getList,
    getListBilingual,
    getCards,
    getImage,
  };
}
```

---

## Refactoring Components

### Example 1: Hero.tsx

**Before (Static):**
```typescript
export function Hero() {
  const { t } = useLanguage();
  
  return (
    <section id="hero" className="hero">
      <div className="hero-content">
        <span className="label">{t.hero.label}</span>
        <h1>
          {t.hero.headline_1}
          <br />
          {t.hero.headline_2}
        </h1>
        <p className="description">{t.hero.description}</p>
        
        <div className="roles">
          {t.hero.roles.map((role, i) => (
            <span key={i}>{role}</span>
          ))}
        </div>

        <div className="ctas">
          <button>{t.hero.cta_primary}</button>
          <button>{t.hero.cta_secondary}</button>
        </div>
      </div>

      <div className="hero-media">
        <img src={heroImage} alt="Osama" />
      </div>
    </section>
  );
}
```

**After (Dynamic):**
```typescript
import { useCmsSection } from '@/app/hooks/useCmsSection';

export function Hero() {
  const { getField, getList, getImage, loading } = useCmsSection('hero');

  if (loading) return <HeroSkeleton />;

  const portrait = getImage('hero_portrait');

  return (
    <section id="hero" className="hero">
      <div className="hero-content">
        <span className="label">{getField('hero_label')}</span>
        <h1>
          {getField('hero_headline_1')}
          <br />
          {getField('hero_headline_2')}
        </h1>
        <p className="description">{getField('hero_description')}</p>
        
        <div className="roles">
          {getList('hero_roles').map((role, i) => (
            <span key={i}>{role}</span>
          ))}
        </div>

        <div className="ctas">
          <button>{getField('hero_cta_primary')}</button>
          <button>{getField('hero_cta_secondary')}</button>
        </div>
      </div>

      <div className="hero-media">
        {portrait && (
          <img 
            src={portrait.url} 
            alt={portrait[`alt_${lang}`]}
            style={{
              aspectRatio: portrait.aspectRatio,
              width: '100%',
            }}
          />
        )}
      </div>
    </section>
  );
}

function HeroSkeleton() {
  return (
    <section className="hero">
      <Skeleton className="h-96 w-full" />
      <Skeleton className="h-96 w-full" />
    </section>
  );
}
```

### Example 2: WhyHireMe.tsx

**Before (Static):**
```typescript
export function WhyHireMe() {
  const { t } = useLanguage();

  return (
    <section className="why-hire-me">
      <h2>{t.whyHireMe.heading}</h2>

      <div className="cards">
        {t.whyHireMe.cards.map((card) => (
          <div key={card.id} className="card">
            <h3>{card.title}</h3>
            <p>{card.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
```

**After (Dynamic):**
```typescript
import { useCmsSection } from '@/app/hooks/useCmsSection';

export function WhyHireMe() {
  const { getField, getCards, loading } = useCmsSection('why_hire_me');

  if (loading) return <WhyHireMeSkeleton />;

  const cards = getCards();

  return (
    <section className="why-hire-me">
      <h2>{getField('whm_heading')}</h2>

      <div className="cards">
        {cards.map((card) => (
          <div key={card.id} className="card">
            <h3>{card.title}</h3>
            <p>{card.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
```

### Example 3: Skills.tsx

**Before (Static):**
```typescript
export function Skills() {
  const { t } = useLanguage();

  return (
    <section className="skills">
      <h1>
        {t.skills.heading_1}
        <br />
        {t.skills.heading_2}
      </h1>
      <p>{t.skills.description}</p>

      <div className="disciplines">
        {t.skills.disciplines.map((discipline) => (
          <div key={discipline.id} className="discipline">
            <h3>{discipline.title}</h3>
            <p>{discipline.tagline}</p>
            <div className="tags">
              {discipline.tags.map((tag, i) => (
                <span key={i} className="tag">{tag}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
```

**After (Dynamic):**
```typescript
import { useCmsSection } from '@/app/hooks/useCmsSection';

export function Skills() {
  const { getField, getCards, loading } = useCmsSection('skills');

  if (loading) return <SkillsSkeleton />;

  const disciplines = getCards();

  return (
    <section className="skills">
      <h1>
        {getField('skills_heading_1')}
        <br />
        {getField('skills_heading_2')}
      </h1>
      <p>{getField('skills_description')}</p>

      <div className="disciplines">
        {disciplines.map((discipline) => (
          <div key={discipline.id} className="discipline">
            <h3>{discipline.title}</h3>
            <p>{discipline.tagline}</p>
            <div className="tags">
              {discipline.tags.map((tag, i) => (
                <span key={i} className="tag">{tag}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
```

### Example 4: Contact.tsx

**Before (Static):**
```typescript
export function Contact() {
  const { t } = useLanguage();

  return (
    <section id="contact" className="contact">
      <span className="availability">{t.contact.availability}</span>
      <h1>
        {t.contact.headline_1}
        <br />
        {t.contact.headline_2}
        <br />
        {t.contact.headline_3}
      </h1>
      <p>{t.contact.body}</p>
      <p className="note">{t.contact.note}</p>
      <a href={`mailto:${t.contact.email}`}>{t.contact.email}</a>
    </section>
  );
}
```

**After (Dynamic):**
```typescript
import { useCmsSection } from '@/app/hooks/useCmsSection';

export function Contact() {
  const { getField, loading } = useCmsSection('contact');

  if (loading) return <ContactSkeleton />;

  const email = getField('contact_email');

  return (
    <section id="contact" className="contact">
      <span className="availability">{getField('contact_availability')}</span>
      <h1>
        {getField('contact_headline_1')}
        <br />
        {getField('contact_headline_2')}
        <br />
        {getField('contact_headline_3')}
      </h1>
      <p>{getField('contact_body')}</p>
      <p className="note">{getField('contact_note')}</p>
      <a href={`mailto:${email}`}>{email}</a>
    </section>
  );
}
```

---

## Simplifying LanguageContext

**Current LanguageContext:**
- Provides 350+ lines of hardcoded translations
- Manages language selection
- Used by every component

**New LanguageContext:**
- Only manages language selection (en/ar)
- Component styles for RTL support
- Removed translation object

```typescript
// src/app/contexts/LanguageContext.tsx (SIMPLIFIED)

import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'en' | 'ar';

type LanguageContextType = {
  lang: Language;
  setLang: (lang: Language) => void;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Language>('en');

  useEffect(() => {
    // Apply language to DOM
    const html = document.documentElement;
    html.lang = lang;
    html.dir = lang === 'ar' ? 'rtl' : 'ltr';
    html.classList.toggle('rtl', lang === 'ar');

    // Save to localStorage
    localStorage.setItem('language', lang);
  }, [lang]);

  return (
    <LanguageContext.Provider value={{ lang, setLang }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
}
```

---

## Error Handling Strategy

### 1. Fallback Content

If backend is down, show cached data or hardcoded fallback:

```typescript
// src/lib/fallbackContent.ts

export const FALLBACK_CONTENT = {
  hero: {
    fields: {
      hero_label_en: "Osama Tammam · Cairo",
      hero_headline_1_en: "Making hard products",
      // ... etc
    }
  }
  // ... all sections
};

// In CmsContext
const fetchAllContent = async () => {
  try {
    // attempt fetch...
  } catch (err) {
    console.warn('Backend failed, using fallback content');
    setContent(FALLBACK_CONTENT);
  }
};
```

### 2. Loading States

Each component should have a skeleton/loading state:

```typescript
// Shared skeleton component
export function SectionSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-12 w-3/4" />
      <Skeleton className="h-6 w-full" />
      <Skeleton className="h-6 w-5/6" />
    </div>
  );
}
```

### 3. Error Boundaries

Wrap components to catch errors:

```typescript
// src/app/components/ErrorBoundary.tsx

export function ErrorBoundary({ children, fallback }) {
  const [error, setError] = useState(null);

  useEffect(() => {
    const handler = (err) => setError(err);
    window.addEventListener("error", handler);
    return () => window.removeEventListener("error", handler);
  }, []);

  if (error) {
    return fallback || <div>Something went wrong</div>;
  }

  return children;
}
```

---

## Migration Checklist

- [ ] Create `CmsContext.tsx` with Supabase fetching
- [ ] Create `useCmsSection.ts` hook
- [ ] Update `App.tsx` to wrap with CmsProvider
- [ ] Update `Hero.tsx` to use `useCmsSection`
- [ ] Update `WhyHireMe.tsx` to use `useCmsSection`
- [ ] Update `Skills.tsx` to use `useCmsSection`
- [ ] Update `Portfolio.tsx` to use `useCmsSection`
- [ ] Update `Tools.tsx` to use `useCmsSection`
- [ ] Update `Contact.tsx` to use `useCmsSection`
- [ ] Update `Footer.tsx` to use `useCmsSection`
- [ ] Update `Navigation.tsx` to use `useCmsSection`
- [ ] Simplify `LanguageContext.tsx`
- [ ] Create skeleton components for each section
- [ ] Create fallback content file
- [ ] Test all components locally
- [ ] Test with real Supabase backend

---

## Real-Time Updates (Optional – Bonus)

The CmsContext already subscribes to Supabase real-time events. This means:

1. Admin changes content via dashboard
2. Your database updates
3. Supabase broadcasts change event via real-time channel
4. CmsContext refetches data
5. Components automatically re-render with new content

**No manual refresh needed!**

---

## Performance Considerations

### Current Issue
- Loading all sections at once on app load

### Optimization Ideas

**Option 1: Lazy Load Sections**
```typescript
const useCmsSection = (sectionKey: string) => {
  const [sectionData, setSectionData] = useState(null);
  
  useEffect(() => {
    // Only fetch this section when component mounts
    fetchSection(sectionKey);
  }, [sectionKey]);
};
```

**Option 2: Service Worker Caching**
```typescript
// Cache frequently-accessed sections (hero, contact)
// Serve from cache, update in background
```

**Option 3: Image Optimization**
```typescript
// Use Next.js Image or similar for:
// - Lazy loading
// - Responsive sizing
// - WebP conversion
```

---

## Testing Strategy

### Unit Tests

```typescript
// useCmsSection.test.ts

describe('useCmsSection', () => {
  it('should fetch hero section data', async () => {
    const { result } = renderHook(() => useCmsSection('hero'));
    
    await waitFor(() => {
      expect(result.current.getField('hero_label')).toBe('Osama Tammam · Cairo');
    });
  });

  it('should return data in correct language', async () => {
    const { result } = renderHook(() => useCmsSection('hero'));
    
    act(() => {
      result.current.setLang('ar');
    });

    await waitFor(() => {
      expect(result.current.getField('hero_label')).toContain('أسامة');
    });
  });
});
```

### Integration Tests

```typescript
// Hero.integration.test.ts

describe('Hero Component', () => {
  it('should render with backend data', async () => {
    render(<Hero />);
    
    await waitFor(() => {
      expect(screen.getByText('Making hard products')).toBeInTheDocument();
    });
  });

  it('should show loading state initially', () => {
    render(<Hero />);
    expect(screen.getByTestId('hero-skeleton')).toBeInTheDocument();
  });

  it('should switch languages', async () => {
    const { rerender } = render(<Hero />);
    
    await waitFor(() => {
      expect(screen.getByText('Making hard products')).toBeInTheDocument();
    });

    // Switch to Arabic
    // ... simulate language change
    // rerender(<Hero />);
    
    // expect(screen.getByText('صنع منتجات صعبة')).toBeInTheDocument();
  });
});
```

---

## Deployment Checklist

- [ ] Supabase tables created and populated
- [ ] RLS policies configured correctly
- [ ] Frontend environment variables set (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY)
- [ ] CmsContext and hooks deployed
- [ ] All components refactored to use new system
- [ ] Error handling tested
- [ ] Fallback content verified
- [ ] Real-time updates working
- [ ] Performance acceptable
- [ ] Admin panel working
- [ ] Magic link email sent/received
- [ ] Content editable from admin dashboard
- [ ] Changes reflected on live site within seconds

