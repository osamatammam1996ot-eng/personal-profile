// Bilingual helper type
export type Bilingual<T = string> = { en: T; ar: T };

export interface CmsSections {
  hero: boolean;
  whyHireMe: boolean;
  skills: boolean;
  portfolio: boolean;
  tools: boolean;
  contact: boolean;
  footer: boolean;
}

export interface CmsHero {
  label: Bilingual;
  headline1: Bilingual;
  headline2: Bilingual;
  roles: Bilingual<string[]>;
  desc: Bilingual;
  cta1: Bilingual;
  cta2: Bilingual;
}

export interface CmsWhyHireMe {
  word1: Bilingual;
  word2: Bilingual;
  word3: Bilingual;
  cards: Array<{ title: Bilingual; desc: Bilingual }>;
}

export interface CmsContact {
  email: string;
  availability: Bilingual;
  headline1: Bilingual;
  headline2: Bilingual;
  headline3: Bilingual;
  body: Bilingual;
  note: Bilingual;
  signoff1: Bilingual;
  signoff2: Bilingual;
  emailLabel: Bilingual;
  socials: {
    whatsapp: string;
    linkedin: string;
    behance: string;
    facebook: string;
  };
}

export interface CmsProject {
  id: number;
  visible: boolean;
  title: Bilingual;
  image: string;
  tags: Bilingual<string[]>;
  desc: Bilingual;
  accent: string;
}

export interface CmsCaseStudy {
  id: number;
  visible: boolean;
  title: Bilingual;
  tagline: Bilingual;
  heroImage: string;
  meta: {
    role: Bilingual;
    timeline: string;
    team: Bilingual;
    industry: Bilingual;
  };
  metrics: Array<{ value: string; label: Bilingual }>;
}

export interface CmsSkills {
  heading1: Bilingual;
  heading2: Bilingual;
  desc: Bilingual;
  disciplines: Array<{
    title: Bilingual;
    tagline: Bilingual;
    tags: Bilingual<string[]>;
  }>;
}

export interface CmsTools {
  title: Bilingual;
  desc: Bilingual;
  clickHint: Bilingual;
  proficiency: Bilingual;
}

export interface CmsFooter {
  copyright: Bilingual;
  links: Bilingual<string[]>;
}

export interface CmsGlobal {
  seoTitle: string;
  seoDescription: string;
  ownerName: string;
  ownerEmail: string;
  footerTagline: string;
}

export interface CmsData {
  sections: CmsSections;
  hero: CmsHero;
  whyHireMe: CmsWhyHireMe;
  skills: CmsSkills;
  tools: CmsTools;
  footer: CmsFooter;
  contact: CmsContact;
  projects: CmsProject[];
  caseStudies: CmsCaseStudy[];
  global: CmsGlobal;
  updatedAt: string;
}

// Type aliases
export type CmsDataRaw = CmsData;
export type CmsCaseStudyRaw = CmsCaseStudy;

// Default CMS data
export const DEFAULT_CMS_DATA: CmsData = {
  sections: {
    hero: true,
    whyHireMe: true,
    skills: true,
    portfolio: true,
    tools: true,
    contact: true,
    footer: true,
  },
  hero: {
    label: { en: 'Label', ar: 'التسمية' },
    headline1: { en: 'Headline 1', ar: 'العنوان الأول' },
    headline2: { en: 'Headline 2', ar: 'العنوان الثاني' },
    roles: { en: [], ar: [] },
    desc: { en: 'Description', ar: 'الوصف' },
    cta1: { en: 'CTA 1', ar: 'نداء إلى الإجراء 1' },
    cta2: { en: 'CTA 2', ar: 'نداء إلى الإجراء 2' },
  },
  whyHireMe: {
    word1: { en: 'Word 1', ar: 'الكلمة 1' },
    word2: { en: 'Word 2', ar: 'الكلمة 2' },
    word3: { en: 'Word 3', ar: 'الكلمة 3' },
    cards: [],
  },
  skills: {
    heading1: { en: 'Skills', ar: 'المهارات' },
    heading2: { en: 'Expertise', ar: 'الخبرة' },
    desc: { en: 'Description', ar: 'الوصف' },
    disciplines: [],
  },
  tools: {
    title: { en: 'Tools', ar: 'الأدوات' },
    desc: { en: 'Description', ar: 'الوصف' },
    clickHint: { en: 'Click to view', ar: 'انقر للمشاهدة' },
    proficiency: { en: 'Proficiency', ar: 'الكفاءة' },
  },
  footer: {
    copyright: { en: '© 2024', ar: '© 2024' },
    links: { en: [], ar: [] },
  },
  contact: {
    email: 'contact@example.com',
    availability: { en: 'Available', ar: 'متاح' },
    headline1: { en: 'Headline 1', ar: 'العنوان الأول' },
    headline2: { en: 'Headline 2', ar: 'العنوان الثاني' },
    headline3: { en: 'Headline 3', ar: 'العنوان الثالث' },
    body: { en: 'Body text', ar: 'نص الجسم' },
    note: { en: 'Note', ar: 'ملاحظة' },
    signoff1: { en: 'Signoff 1', ar: 'التوقيع 1' },
    signoff2: { en: 'Signoff 2', ar: 'التوقيع 2' },
    emailLabel: { en: 'Your Email', ar: 'بريدك الإلكتروني' },
    socials: {
      whatsapp: '',
      linkedin: '',
      behance: '',
      facebook: '',
    },
  },
  projects: [],
  caseStudies: [
    { id: 1, visible: true, title: { en: 'Nexus Analytics', ar: 'نيكسس أناليتكس' }, tagline: { en: 'Analytics Platform', ar: 'منصة التحليلات' }, heroImage: '', meta: { role: { en: 'Role', ar: 'الدور' }, timeline: '6 months', team: { en: 'Team', ar: 'الفريق' }, industry: { en: 'Tech', ar: 'التكنولوجيا' } }, metrics: [] },
    { id: 2, visible: true, title: { en: 'Orion Enterprise', ar: 'أوريون إنتربرايز' }, tagline: { en: 'Enterprise Suite', ar: 'مجموعة المؤسسات' }, heroImage: '', meta: { role: { en: 'Role', ar: 'الدور' }, timeline: '8 months', team: { en: 'Team', ar: 'الفريق' }, industry: { en: 'Enterprise', ar: 'المؤسسات' } }, metrics: [] },
    { id: 3, visible: true, title: { en: 'Lumina AI', ar: 'لومينا إيه آي' }, tagline: { en: 'AI Product', ar: 'منتج الذكاء الاصطناعي' }, heroImage: '', meta: { role: { en: 'Role', ar: 'الدور' }, timeline: '5 months', team: { en: 'Team', ar: 'الفريق' }, industry: { en: 'AI', ar: 'الذكاء الاصطناعي' } }, metrics: [] },
    { id: 4, visible: true, title: { en: 'HealthBridge', ar: 'هيلثبريدج' }, tagline: { en: 'Mobile Health App', ar: 'تطبيق الصحة المحمول' }, heroImage: '', meta: { role: { en: 'Role', ar: 'الدور' }, timeline: '7 months', team: { en: 'Team', ar: 'الفريق' }, industry: { en: 'Healthcare', ar: 'الصحة' } }, metrics: [] },
  ],
  global: {
    seoTitle: 'Osama Tammam - Portfolio',
    seoDescription: 'Portfolio website',
    ownerName: 'Osama Tammam',
    ownerEmail: 'osama@example.com',
    footerTagline: 'Footer tagline',
  },
  updatedAt: new Date().toISOString(),
};
