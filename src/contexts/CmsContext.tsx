"use client";
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { translations } from '../translations';
import type { CmsData } from '../types/cms';
import { DEFAULT_CMS_DATA } from '../types/cms';

export type ContentData = {
  [sectionKey: string]: {
    fields: Record<string, string>;
    lists: Record<string, Array<{ en: string; ar: string }>>;
    cards: Array<any>;
    images: Record<string, any>;
    caseStudies: Array<any>;
  };
};

type CmsContextType = {
  content: ContentData;
  cmsData: CmsData;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
  refresh: () => Promise<void>;
};

const CmsContext = createContext<CmsContextType | undefined>(undefined);

const STORAGE_KEY = 'cms:portfolio:v2:local';

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value));
}

function mergeDeep<T>(base: T, override: any): T {
  if (override === undefined || override === null) {
    return clone(base);
  }

  if (Array.isArray(base)) {
    return (Array.isArray(override) ? clone(override) : clone(base)) as T;
  }

  if (typeof base === 'object' && base !== null) {
    const result: Record<string, any> = {};
    const baseObj = base as Record<string, any>;
    const overrideObj = typeof override === 'object' && override !== null ? override : {};

    for (const key of Object.keys(baseObj)) {
      result[key] = mergeDeep(baseObj[key], overrideObj[key]);
    }

    return result as T;
  }

  return (override as T) ?? base;
}

function normalizeCmsData(input: unknown): CmsData {
  const data = mergeDeep(DEFAULT_CMS_DATA, input);
  
  // Migration: ensure logoMarquee is in sectionOrder
  if (data.sectionOrder && !data.sectionOrder.includes('logoMarquee')) {
    const heroIdx = data.sectionOrder.indexOf('hero');
    if (heroIdx !== -1) {
      data.sectionOrder.splice(heroIdx + 1, 0, 'logoMarquee');
    } else {
      data.sectionOrder.splice(1, 0, 'logoMarquee');
    }
  }
  
  return data;
}

function mapCmsDataToLegacyContent(data: CmsData): ContentData {
  const en = translations.en;
  const ar = translations.ar;

  return {
    navigation: {
      fields: {
        home_en: en.nav.home,
        home_ar: ar.nav.home,
        whyMe_en: en.nav.whyMe,
        whyMe_ar: ar.nav.whyMe,
        skills_en: en.nav.skills,
        skills_ar: ar.nav.skills,
        work_en: en.nav.work,
        work_ar: ar.nav.work,
        tools_en: en.nav.tools,
        tools_ar: ar.nav.tools,
        contact_en: en.nav.contact,
        contact_ar: ar.nav.contact,
      },
      lists: {},
      cards: [],
      images: {},
      caseStudies: [],
    },
    hero: {
      fields: {
        label_en: data.hero.label.en,
        label_ar: data.hero.label.ar,
        headline1_en: data.hero.headline1.en,
        headline1_ar: data.hero.headline1.ar,
        headline2_en: data.hero.headline2.en,
        headline2_ar: data.hero.headline2.ar,
        desc_en: data.hero.desc.en,
        desc_ar: data.hero.desc.ar,
        cta1_en: data.hero.cta1.en,
        cta1_ar: data.hero.cta1.ar,
        cta2_en: data.hero.cta2.en,
        cta2_ar: data.hero.cta2.ar,
      },
      lists: {
        roles: data.hero.roles.en.map((_, i) => ({
          en: data.hero.roles.en[i] ?? '',
          ar: data.hero.roles.ar[i] ?? '',
        })),
      },
      cards: [],
      images: {},
      caseStudies: [],
    },
    whyHireMe: {
      fields: {
        word1_en: data.whyHireMe.word1.en,
        word1_ar: data.whyHireMe.word1.ar,
        word2_en: data.whyHireMe.word2.en,
        word2_ar: data.whyHireMe.word2.ar,
        word3_en: data.whyHireMe.word3.en,
        word3_ar: data.whyHireMe.word3.ar,
      },
      lists: {},
      cards: data.whyHireMe.cards.map((card) => ({
        title_en: card.title.en,
        title_ar: card.title.ar,
        desc_en: card.desc.en,
        desc_ar: card.desc.ar,
      })),
      images: {},
      caseStudies: [],
    },
    skills: {
      fields: {
        label_en: en.skills.label,
        label_ar: ar.skills.label,
        heading1_en: data.skills.heading1.en,
        heading1_ar: data.skills.heading1.ar,
        heading2_en: data.skills.heading2.en,
        heading2_ar: data.skills.heading2.ar,
        desc_en: data.skills.desc.en,
        desc_ar: data.skills.desc.ar,
        discipline1_title_en: data.skills.disciplines[0]?.title.en ?? '',
        discipline1_title_ar: data.skills.disciplines[0]?.title.ar ?? '',
        discipline1_tagline_en: data.skills.disciplines[0]?.tagline.en ?? '',
        discipline1_tagline_ar: data.skills.disciplines[0]?.tagline.ar ?? '',
        discipline2_title_en: data.skills.disciplines[1]?.title.en ?? '',
        discipline2_title_ar: data.skills.disciplines[1]?.title.ar ?? '',
        discipline2_tagline_en: data.skills.disciplines[1]?.tagline.en ?? '',
        discipline2_tagline_ar: data.skills.disciplines[1]?.tagline.ar ?? '',
        discipline3_title_en: data.skills.disciplines[2]?.title.en ?? '',
        discipline3_title_ar: data.skills.disciplines[2]?.title.ar ?? '',
        discipline3_tagline_en: data.skills.disciplines[2]?.tagline.en ?? '',
        discipline3_tagline_ar: data.skills.disciplines[2]?.tagline.ar ?? '',
      },
      lists: {
        discipline1_tags: (data.skills.disciplines[0]?.tags.en ?? []).map((_, i) => ({
          en: data.skills.disciplines[0]?.tags.en[i] ?? '',
          ar: data.skills.disciplines[0]?.tags.ar[i] ?? '',
        })),
        discipline2_tags: (data.skills.disciplines[1]?.tags.en ?? []).map((_, i) => ({
          en: data.skills.disciplines[1]?.tags.en[i] ?? '',
          ar: data.skills.disciplines[1]?.tags.ar[i] ?? '',
        })),
        discipline3_tags: (data.skills.disciplines[2]?.tags.en ?? []).map((_, i) => ({
          en: data.skills.disciplines[2]?.tags.en[i] ?? '',
          ar: data.skills.disciplines[2]?.tags.ar[i] ?? '',
        })),
      },
      cards: [],
      images: {},
      caseStudies: [],
    },
    portfolio: {
      fields: {
        label_en: en.portfolio.label,
        label_ar: ar.portfolio.label,
        caseStudiesLabel_en: en.portfolio.caseStudiesLabel,
        caseStudiesLabel_ar: ar.portfolio.caseStudiesLabel,
        heading1_en: en.portfolio.heading1,
        heading1_ar: ar.portfolio.heading1,
        heading2_en: en.portfolio.heading2,
        heading2_ar: ar.portfolio.heading2,
        projectLabel_en: en.portfolio.projectLabel,
        projectLabel_ar: ar.portfolio.projectLabel,
        viewCase_en: en.portfolio.viewCase,
        viewCase_ar: ar.portfolio.viewCase,
      },
      lists: {},
      cards: [],
      images: {},
      caseStudies: data.projects.map((project) => ({
        id: project.id,
        is_visible: project.visible,
        title_en: project.title?.en ?? '',
        title_ar: project.title?.ar ?? '',
        tags_en: (Array.isArray(project.tags?.en) ? project.tags.en : []).join(', '),
        tags_ar: (Array.isArray(project.tags?.ar) ? project.tags.ar : []).join(', '),
        summary_en: project.desc?.en ?? '',
        summary_ar: project.desc?.ar ?? '',
        featured_image_url: project.image ?? '',
      })),
    },
    contact: {
      fields: {
        email_en: data.contact.email,
        email_ar: data.contact.email,
        availability_en: data.contact.availability.en,
        availability_ar: data.contact.availability.ar,
        headline1_en: data.contact.headline1.en,
        headline1_ar: data.contact.headline1.ar,
        headline2_en: data.contact.headline2.en,
        headline2_ar: data.contact.headline2.ar,
        headline3_en: data.contact.headline3.en,
        headline3_ar: data.contact.headline3.ar,
        body_en: data.contact.body.en,
        body_ar: data.contact.body.ar,
        note_en: data.contact.note.en,
        note_ar: data.contact.note.ar,
        signoff1_en: data.contact.signoff1.en,
        signoff1_ar: data.contact.signoff1.ar,
        signoff2_en: data.contact.signoff2.en,
        signoff2_ar: data.contact.signoff2.ar,
        emailLabel_en: data.contact.emailLabel.en,
        emailLabel_ar: data.contact.emailLabel.ar,
        whatsapp_en: data.contact.socials.whatsapp,
        whatsapp_ar: data.contact.socials.whatsapp,
        linkedin_en: data.contact.socials.linkedin,
        linkedin_ar: data.contact.socials.linkedin,
        behance_en: data.contact.socials.behance,
        behance_ar: data.contact.socials.behance,
        facebook_en: data.contact.socials.facebook,
        facebook_ar: data.contact.socials.facebook,
      },
      lists: {},
      cards: [],
      images: {},
      caseStudies: [],
    },
    footer: {
      fields: {
        copyright_en: data.footer.copyright.en,
        copyright_ar: data.footer.copyright.ar,
      },
      lists: {
        links: data.footer.links.en.map((_, i) => ({
          en: data.footer.links.en[i] ?? '',
          ar: data.footer.links.ar[i] ?? '',
        })),
      },
      cards: [],
      images: {},
      caseStudies: [],
    },
    tools: {
      fields: {
        title_en: data.tools.title.en,
        title_ar: data.tools.title.ar,
        desc_en: data.tools.desc.en,
        desc_ar: data.tools.desc.ar,
        clickHint_en: data.tools.clickHint.en,
        clickHint_ar: data.tools.clickHint.ar,
        proficiency_en: data.tools.proficiency.en,
        proficiency_ar: data.tools.proficiency.ar,
      },
      lists: {},
      cards: [],
      images: {},
      caseStudies: [],
    },
  };
}

export function CmsProvider({ children, initialData }: { children: React.ReactNode; initialData?: CmsData | null }) {
  const [cmsData, setCmsData] = useState<CmsData>(() => initialData ? normalizeCmsData(initialData) : clone(DEFAULT_CMS_DATA));
  const [content, setContent] = useState<ContentData>(() => mapCmsDataToLegacyContent(initialData ? normalizeCmsData(initialData) : DEFAULT_CMS_DATA));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const applyCmsData = useCallback((rawData: unknown) => {
    const nextCms = normalizeCmsData(rawData);
    setCmsData(nextCms);
    setContent(mapCmsDataToLegacyContent(nextCms));
    return nextCms;
  }, []);

  const fetchAllContent = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const { getCmsDataAction } = await import('@/app/actions/cms');
      const response = await getCmsDataAction();

      if (response.error) {
        throw new Error(response.error);
      }

      if (response.data) {
        const normalized = applyCmsData(response.data);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
      } else {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          applyCmsData(JSON.parse(saved));
        } else {
          applyCmsData(initialData || DEFAULT_CMS_DATA);
        }
      }
    } catch (fetchError) {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          applyCmsData(JSON.parse(saved));
        } else {
          applyCmsData(initialData || DEFAULT_CMS_DATA);
        }
      } catch {
        applyCmsData(initialData || DEFAULT_CMS_DATA);
      }

      console.warn('CMS fetch failed, using local/default data:', fetchError);
    } finally {
      setLoading(false);
    }
  }, [applyCmsData, initialData]);

  useEffect(() => {
    fetchAllContent();
  }, [fetchAllContent]);

  return (
    <CmsContext.Provider
      value={{
        content,
        cmsData,
        loading,
        error,
        refetch: fetchAllContent,
        refresh: fetchAllContent,
      }}
    >
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
