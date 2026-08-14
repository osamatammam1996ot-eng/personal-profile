// Bilingual helper type
export type Bilingual<T = string> = { en: T; ar: T };

export interface CmsSections {
  hero: boolean;
  whyHireMe: boolean;
  skills: boolean;
  portfolio: boolean;
  tools: boolean;
  recommendations: boolean;
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

export interface CmsCaseStudyMedia {
  id: string;
  type: 'image' | 'video';
  url: string;
}

export interface CmsCaseStudyMedia {
  id: string;
  type: 'image' | 'video';
  url: string;
}

export interface CmsCaseStudy {
  id: number;
  visible: boolean;
  title: Bilingual;
  media: CmsCaseStudyMedia[];
}

export interface CmsRecommendation {
  id: string;
  visible: boolean;
  name: string;
  position: Bilingual;
  comment: Bilingual;
  avatar: string;
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

export interface CmsToolItem {
  name: string;
  abbr: string;
  cat: Bilingual;
  desc: Bilingual;
  tags: Bilingual<string[]>;
  rgb: [number, number, number];
  glow: string;
  proficiency: number;
}

export interface CmsTools {
  title: Bilingual;
  desc: Bilingual;
  clickHint: Bilingual;
  proficiency: Bilingual;
  toolsList: CmsToolItem[];
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
  sectionOrder: string[];
  sections: CmsSections;
  hero: CmsHero;
  whyHireMe: CmsWhyHireMe;
  skills: CmsSkills;
  tools: CmsTools;
  footer: CmsFooter;
  contact: CmsContact;
  projects: CmsProject[];
  caseStudies: CmsCaseStudy[];
  recommendations: CmsRecommendation[];
  global: CmsGlobal;
  updatedAt: string;
}

// Type aliases
export type CmsDataRaw = CmsData;
export type CmsCaseStudyRaw = CmsCaseStudy;

// Default CMS data
export const DEFAULT_CMS_DATA: any = {
  sectionOrder: ['hero', 'whyHireMe', 'skills', 'portfolio', 'recommendations', 'tools', 'contact', 'footer'],
  sections: {
    hero: true,
    whyHireMe: true,
    skills: true,
    portfolio: true,
    tools: true,
    recommendations: true,
    contact: true,
    footer: true,
  },
  hero: {
    label: { en: 'Osama Tammam\u00a0\u00b7\u00a0Cairo', ar: '\u0623\u0633\u0627\u0645\u0629 \u062a\u0645\u0627\u0645\u00a0\u00b7\u00a0\u0627\u0644\u0642\u0627\u0647\u0631\u0629' },
    headline1: { en: 'Making hard products', ar: '\u062a\u062d\u0648\u064a\u0644 \u0627\u0644\u0645\u0646\u062a\u062c\u0627\u062a \u0627\u0644\u0635\u0639\u0628\u0629' },
    headline2: { en: 'feel inevitable.', ar: '\u0625\u0644\u0649 \u062a\u062c\u0631\u0628\u0629 \u0644\u0627 \u0645\u0641\u0631 \u0645\u0646\u0647\u0627.' },
    roles: { en: ['Senior UX Designer', 'Senior UI Designer', 'AI Product Designer'], ar: ['\u0645\u0635\u0645\u0645 UX \u0623\u0648\u0644', '\u0645\u0635\u0645\u0645 UI \u0623\u0648\u0644', '\u0645\u0635\u0645\u0645 \u0645\u0646\u062a\u062c\u0627\u062a AI'] },
    desc: { en: "Seven years building products for teams that couldn't afford to ship the wrong thing.\nI work closest to the problem when the stakes are highest.", ar: '\u0633\u0628\u0639 \u0633\u0646\u0648\u0627\u062a \u0645\u0646 \u0628\u0646\u0627\u0621 \u0627\u0644\u0645\u0646\u062a\u062c\u0627\u062a \u0644\u0641\u0631\u0642 \u0644\u0645 \u062a\u0643\u0646 \u062a\u062a\u062d\u0645\u0644 \u0627\u0644\u062e\u0637\u0623 \u0641\u064a \u0627\u0644\u0642\u0631\u0627\u0631.\n\u0623\u0643\u0648\u0646 \u0623\u0642\u0631\u0628 \u0644\u0644\u0645\u0634\u0643\u0644\u0629 \u062d\u064a\u0646 \u062a\u0643\u0648\u0646 \u0627\u0644\u0645\u062e\u0627\u0637\u0631 \u0641\u064a \u0623\u0639\u0644\u0627\u0647\u0627.' },
    cta1: { en: 'See my work', ar: '\u0634\u0627\u0647\u062f \u0623\u0639\u0645\u0627\u0644\u064a' },
    cta2: { en: "Let's talk", ar: '\u0644\u0646\u062a\u062d\u062f\u062b' },
  },
  whyHireMe: {
    word1: { en: 'Why', ar: 'لماذا' },
    word2: { en: 'Hire', ar: 'تختارني' },
    word3: { en: 'Me', ar: '' },
    cards: [
      {
        title: { en: 'Systems Thinking', ar: '\u0627\u0644\u062a\u0641\u0643\u064a\u0631 \u0627\u0644\u0645\u0646\u0638\u0648\u0645\u064a' },
        desc: { en: 'Scalable design systems and component libraries that maintain consistency as your product grows across teams.', ar: '\u0623\u0646\u0638\u0645\u0629 \u062a\u0635\u0645\u064a\u0645 \u0642\u0627\u0628\u0644\u0629 \u0644\u0644\u062a\u0637\u0648\u0631 \u0648\u0645\u0643\u062a\u0628\u0627\u062a \u0645\u0643\u0648\u0646\u0627\u062a \u062a\u062d\u0627\u0641\u0638 \u0639\u0644\u0649 \u0627\u0644\u0627\u062a\u0633\u0627\u0642 \u0645\u0639 \u0646\u0645\u0648 \u0645\u0646\u062a\u062c\u0643 \u0639\u0628\u0631 \u0627\u0644\u0641\u0631\u0642.' },
      },
      {
        title: { en: 'AI-Driven Process', ar: '\u0627\u0644\u0639\u0645\u0644\u064a\u0629 \u0627\u0644\u0645\u062f\u0641\u0648\u0639\u0629 \u0628\u0627\u0644\u0630\u0643\u0627\u0621 \u0627\u0644\u0627\u0635\u0637\u0646\u0627\u0639\u064a' },
        desc: { en: 'Leveraging cutting-edge AI tools to accelerate ideation, validate designs, and surface insights that manual research misses.', ar: '\u062a\u0648\u0638\u064a\u0641 \u0623\u062d\u062f\u062b \u0623\u062f\u0648\u0627\u062a \u0627\u0644\u0630\u0643\u0627\u0621 \u0627\u0644\u0627\u0635\u0637\u0646\u0627\u0639\u064a \u0644\u062a\u0633\u0631\u064a\u0639 \u0627\u0644\u0623\u0641\u0643\u0627\u0631 \u0648\u0627\u0644\u062a\u062d\u0642\u0642 \u0645\u0646 \u0627\u0644\u062a\u0635\u0627\u0645\u064a\u0645 \u0648\u0627\u0633\u062a\u062e\u0631\u0627\u062c \u0631\u0624\u0649 \u064a\u0641\u0648\u062a\u0647\u0627 \u0627\u0644\u0628\u062d\u062b \u0627\u0644\u062a\u0642\u0644\u064a\u062f\u064a.' },
      },
      {
        title: { en: 'Enterprise-Grade Execution', ar: '\u062a\u0646\u0641\u064a\u0630 \u0628\u0645\u0639\u0627\u064a\u064a\u0631 \u0627\u0644\u0645\u0624\u0633\u0633\u0627\u062a' },
        desc: { en: 'From complex SaaS dashboards to multi-platform enterprise tools \u2014 polished, production-ready, every time.', ar: '\u0645\u0646 \u0644\u0648\u062d\u0627\u062a SaaS \u0627\u0644\u0645\u0639\u0642\u062f\u0629 \u0625\u0644\u0649 \u0623\u062f\u0648\u0627\u062a \u0627\u0644\u0645\u0624\u0633\u0633\u0627\u062a \u0645\u062a\u0639\u062f\u062f\u0629 \u0627\u0644\u0645\u0646\u0635\u0627\u062a \u2014 \u0645\u0635\u0642\u0648\u0644\u0629 \u0648\u062c\u0627\u0647\u0632\u0629 \u0644\u0644\u0625\u0646\u062a\u0627\u062c \u0641\u064a \u0643\u0644 \u0645\u0631\u0629.' },
      },
      {
        title: { en: 'Conversion-Focused UX', ar: '\u062a\u062c\u0631\u0628\u0629 \u0645\u0633\u062a\u062e\u062f\u0645 \u062a\u062d\u0642\u0642 \u0627\u0644\u062a\u062d\u0648\u064a\u0644' },
        desc: { en: 'Every decision rooted in psychology and business metrics \u2014 crafting flows that turn visitors into loyal users.', ar: '\u0643\u0644 \u0642\u0631\u0627\u0631 \u0645\u0628\u0646\u064a \u0639\u0644\u0649 \u0639\u0644\u0645 \u0627\u0644\u0646\u0641\u0633 \u0648\u0645\u0642\u0627\u064a\u064a\u0633 \u0627\u0644\u0639\u0645\u0644 \u2014 \u0645\u0633\u0627\u0631\u0627\u062a \u062a\u062d\u0648\u0651\u0644 \u0627\u0644\u0632\u0648\u0627\u0631 \u0625\u0644\u0649 \u0645\u0633\u062a\u062e\u062f\u0645\u064a\u0646 \u0645\u062e\u0644\u0635\u064a\u0646.' },
      },
    ],
  },
  skills: {
    heading1: { en: 'Seven years.', ar: '\u0633\u0628\u0639 \u0633\u0646\u0648\u0627\u062a.' },
    heading2: { en: 'Three disciplines.', ar: '\u062b\u0644\u0627\u062b\u0629 \u062a\u062e\u0635\u0635\u0627\u062a.' },
    desc: { en: "Not a list of tools I've opened once. This is how I actually spend my time \u2014 the things I can lead, the methods I reach for first, the work I take responsibility for end-to-end.", ar: '\u0644\u064a\u0633\u062a \u0642\u0627\u0626\u0645\u0629 \u0628\u0623\u062f\u0648\u0627\u062a \u0641\u062a\u062d\u062a\u0647\u0627 \u0645\u0631\u0629 \u0648\u0627\u062d\u062f\u0629. \u0647\u0630\u0647 \u0647\u064a \u0643\u064a\u0641\u064a\u0629 \u0642\u0636\u0627\u0621 \u0648\u0642\u062a\u064a \u0641\u0639\u0644\u064a\u0627\u064b \u2014 \u0645\u0627 \u0623\u0642\u0648\u062f\u0647\u060c \u0648\u0627\u0644\u0623\u0633\u0627\u0644\u064a\u0628 \u0627\u0644\u062a\u064a \u0623\u0628\u062f\u0623 \u0628\u0647\u0627\u060c \u0648\u0627\u0644\u0639\u0645\u0644 \u0627\u0644\u0630\u064a \u0623\u062a\u062d\u0645\u0644 \u0645\u0633\u0624\u0648\u0644\u064a\u062a\u0647 \u0645\u0646 \u0627\u0644\u0628\u062f\u0627\u064a\u0629 \u0644\u0644\u0646\u0647\u0627\u064a\u0629.' },
    disciplines: [
      {
        title: { en: 'Research &\nUnderstanding', ar: '\u0627\u0644\u0628\u062d\u062b\n\u0648\u0627\u0644\u0641\u0647\u0645' },
        tagline: { en: "I start by figuring out what question I'm actually trying to answer.", ar: '\u0623\u0628\u062f\u0623 \u0628\u062a\u062d\u062f\u064a\u062f \u0627\u0644\u0633\u0624\u0627\u0644 \u0627\u0644\u0630\u064a \u0623\u0633\u0639\u0649 \u062d\u0642\u0627\u064b \u0644\u0644\u0625\u062c\u0627\u0628\u0629 \u0639\u0646\u0647.' },
        tags: { en: ['User Interviews', 'Usability Testing', 'Journey Mapping', 'Heuristic Evaluation', 'Affinity Diagrams', 'Research Synthesis', 'Stakeholder Alignment', 'Competitive Analysis'], ar: ['\u0645\u0642\u0627\u0628\u0644\u0627\u062a \u0627\u0644\u0645\u0633\u062a\u062e\u062f\u0645\u064a\u0646', '\u0627\u062e\u062a\u0628\u0627\u0631 \u0642\u0627\u0628\u0644\u064a\u0629 \u0627\u0644\u0627\u0633\u062a\u062e\u062f\u0627\u0645', '\u0631\u0633\u0645 \u062e\u0631\u0627\u0626\u0637 \u0627\u0644\u0631\u062d\u0644\u0629', '\u0627\u0644\u062a\u0642\u064a\u064a\u0645 \u0627\u0644\u0627\u0633\u062a\u0643\u0634\u0627\u0641\u064a', '\u0645\u062e\u0637\u0637\u0627\u062a \u0627\u0644\u062a\u0642\u0627\u0631\u0628', '\u062a\u0631\u0643\u064a\u0628 \u0627\u0644\u0628\u062d\u0648\u062b', '\u0645\u0648\u0627\u0621\u0645\u0629 \u0623\u0635\u062d\u0627\u0628 \u0627\u0644\u0645\u0635\u0644\u062d\u0629', '\u0627\u0644\u062a\u062d\u0644\u064a\u0644 \u0627\u0644\u062a\u0646\u0627\u0641\u0633\u064a'] },
      },
      {
        title: { en: 'Design &\nSystems', ar: '\u0627\u0644\u062a\u0635\u0645\u064a\u0645\n\u0648\u0627\u0644\u0623\u0646\u0638\u0645\u0629' },
        tagline: { en: "I build for the designer who comes after me, not just the sprint I'm in.", ar: '\u0623\u0628\u0646\u064a \u0644\u0644\u0645\u0635\u0645\u0645 \u0627\u0644\u0630\u064a \u0633\u064a\u0623\u062a\u064a \u0628\u0639\u062f\u064a\u060c \u0644\u0627 \u0641\u0642\u0637 \u0644\u0644\u0633\u0628\u0631\u064a\u0646\u062a \u0627\u0644\u062d\u0627\u0644\u064a.' },
        tags: { en: ['Design Tokens', 'Component Libraries', 'Dark / Light Theming', 'Figma Governance', 'Responsive Grids', 'Multi-team Systems', 'Documentation', 'Accessibility'], ar: ['\u0631\u0645\u0648\u0632 \u0627\u0644\u062a\u0635\u0645\u064a\u0645', '\u0645\u0643\u062a\u0628\u0627\u062a \u0627\u0644\u0645\u0643\u0648\u0646\u0627\u062a', '\u0627\u0644\u0633\u0645\u0627\u062a \u0627\u0644\u0641\u0627\u062a\u062d\u0629 \u0648\u0627\u0644\u062f\u0627\u0643\u0646\u0629', '\u062d\u0648\u0643\u0645\u0629 Figma', '\u0627\u0644\u0634\u0628\u0643\u0627\u062a \u0627\u0644\u0645\u062a\u062c\u0627\u0648\u0628\u0629', '\u0623\u0646\u0638\u0645\u0629 \u0645\u062a\u0639\u062f\u062f\u0629 \u0627\u0644\u0641\u0631\u0642', '\u0627\u0644\u062a\u0648\u062b\u064a\u0642', '\u0625\u0645\u0643\u0627\u0646\u064a\u0629 \u0627\u0644\u0648\u0635\u0648\u0644'] },
      },
      {
        title: { en: 'Prototyping\n& Delivery', ar: '\u0627\u0644\u0646\u0645\u0627\u0630\u062c \u0627\u0644\u0623\u0648\u0644\u064a\u0629\n\u0648\u0627\u0644\u062a\u0633\u0644\u064a\u0645' },
        tagline: { en: "A prototype I can't hand to a developer isn't done.", ar: '\u0627\u0644\u0646\u0645\u0648\u0630\u062c \u0627\u0644\u0630\u064a \u0644\u0627 \u0623\u0633\u062a\u0637\u064a\u0639 \u062a\u0633\u0644\u064a\u0645\u0647 \u0644\u0644\u0645\u0637\u0648\u0651\u0631 \u0644\u064a\u0633 \u062c\u0627\u0647\u0632\u0627\u064b \u0628\u0639\u062f.' },
        tags: { en: ['Advanced Figma', 'Framer', 'Micro-interactions', 'Developer Handoff', 'Motion Design', 'AI-Augmented Workflow', 'Midjourney', 'ChatGPT Integration'], ar: ['Figma \u0627\u0644\u0645\u062a\u0642\u062f\u0645\u0629', 'Framer', '\u0627\u0644\u062a\u0641\u0627\u0639\u0644\u0627\u062a \u0627\u0644\u062f\u0642\u064a\u0642\u0629', '\u062a\u0633\u0644\u064a\u0645 \u0627\u0644\u0645\u0637\u0648\u0651\u0631\u064a\u0646', '\u062a\u0635\u0645\u064a\u0645 \u0627\u0644\u062d\u0631\u0643\u0629', '\u0633\u064a\u0631 \u0639\u0645\u0644 \u0628\u0640 AI', 'Midjourney', '\u062a\u0643\u0627\u0645\u0644 ChatGPT'] },
      },
    ],
  },
  tools: {
    title: { en: 'My Arsenal!', ar: 'ترسانتي!' },
    desc: { en: 'Twelve tools. One cohesive workflow.', ar: 'اثنا عشرة أداة. سير عمل متكامل.' },
    clickHint: { en: 'Click any card to explore', ar: 'انقر على أي بطاقة للاستكشاف' },
    proficiency: { en: 'Proficiency', ar: 'الإتقان' },
    toolsList: [
      { name: 'Figma', abbr: 'Fi', cat: { en: 'Design & Prototyping', ar: 'التصميم والنماذج' }, desc: { en: 'Primary environment for UI systems, components and interactive prototypes.', ar: 'Primary environment for UI systems, components and interactive prototypes.' }, tags: { en: ['UI Design','Components','Proto'], ar: ['UI Design','Components','Proto'] }, rgb: [0.62,0.28,1.00], glow: '#a855f7', proficiency: 98 },
      { name: 'Framer', abbr: 'Fr', cat: { en: 'Motion & Web', ar: 'الحركة والويب' }, desc: { en: 'Turning static designs into production-ready animated web experiences.', ar: 'Turning static designs into production-ready animated web experiences.' }, tags: { en: ['Animation','CMS','Web'], ar: ['Animation','CMS','Web'] }, rgb: [0.05,0.60,1.00], glow: '#0ea5e9', proficiency: 85 },
      { name: 'After Effects', abbr: 'Ae', cat: { en: 'Motion Graphics', ar: 'رسوم متحركة' }, desc: { en: 'Micro-interactions, loading states and brand animation sequences.', ar: 'Micro-interactions, loading states and brand animation sequences.' }, tags: { en: ['Motion','Lottie','Brand'], ar: ['Motion','Lottie','Brand'] }, rgb: [0.55,0.22,0.95], glow: '#818cf8', proficiency: 80 },
      { name: 'Midjourney', abbr: 'Mj', cat: { en: 'AI Imagery', ar: 'صور الذكاء الاصطناعي' }, desc: { en: 'Ideation and moodboarding with generative visuals for design direction.', ar: 'Ideation and moodboarding with generative visuals for design direction.' }, tags: { en: ['AI Art','Moodboard','Concept'], ar: ['AI Art','Moodboard','Concept'] }, rgb: [0.10,0.75,0.65], glow: '#14b8a6', proficiency: 78 },
      { name: 'ChatGPT', abbr: 'Gp', cat: { en: 'AI Collaboration', ar: 'تعاون الذكاء الاصطناعي' }, desc: { en: 'Research, copywriting and rapid UX strategy ideation.', ar: 'Research, copywriting and rapid UX strategy ideation.' }, tags: { en: ['Research','Copy','Strategy'], ar: ['Research','Copy','Strategy'] }, rgb: [0.25,0.80,0.42], glow: '#22c55e', proficiency: 88 },
      { name: 'Notion', abbr: 'No', cat: { en: 'Docs & Planning', ar: 'المستندات والتخطيط' }, desc: { en: 'Design documentation, project wikis and client-facing deliverable hubs.', ar: 'Design documentation, project wikis and client-facing deliverable hubs.' }, tags: { en: ['Docs','Wiki','Delivery'], ar: ['Docs','Wiki','Delivery'] }, rgb: [0.75,0.75,0.90], glow: '#cbd5e1', proficiency: 90 },
      { name: 'Jira', abbr: 'Ji', cat: { en: 'Project Management', ar: 'إدارة المشاريع' }, desc: { en: 'Sprint planning and cross-functional collaboration with engineering.', ar: 'Sprint planning and cross-functional collaboration with engineering.' }, tags: { en: ['Agile','Sprints','Backlog'], ar: ['Agile','Sprints','Backlog'] }, rgb: [0.10,0.42,1.00], glow: '#3b82f6', proficiency: 82 },
      { name: 'Photoshop', abbr: 'Ps', cat: { en: 'Image Editing', ar: 'تعديل الصور' }, desc: { en: 'Pixel-perfect compositing, retouching and visual asset production.', ar: 'Pixel-perfect compositing, retouching and visual asset production.' }, tags: { en: ['Compositing','Assets','Photo'], ar: ['Compositing','Assets','Photo'] }, rgb: [0.18,0.55,1.00], glow: '#60a5fa', proficiency: 85 },
      { name: 'Illustrator', abbr: 'Ai', cat: { en: 'Vector & Icons', ar: 'أيقونات وفيكتور' }, desc: { en: 'Icon systems, custom illustrations and scalable brand marks.', ar: 'Icon systems, custom illustrations and scalable brand marks.' }, tags: { en: ['Icons','Vectors','Brand'], ar: ['Icons','Vectors','Brand'] }, rgb: [1.00,0.55,0.10], glow: '#f97316', proficiency: 80 },
      { name: 'Mobbin', abbr: 'Mb', cat: { en: 'User Research', ar: 'بحث المستخدم' }, desc: { en: 'Discover real patterns in how users navigate — before a single line ships.', ar: 'Discover real patterns in how users navigate — before a single line ships.' }, tags: { en: ['Testing','Usability','UX'], ar: ['Testing','Usability','UX'] }, rgb: [1.00,0.30,0.50], glow: '#f43f5e', proficiency: 75 },
      { name: 'Lottie', abbr: 'Lo', cat: { en: 'Animation Export', ar: 'تصدير الرسوم' }, desc: { en: 'Lightweight JSON animations for seamless developer handoff.', ar: 'Lightweight JSON animations for seamless developer handoff.' }, tags: { en: ['Export','JSON','Handoff'], ar: ['Export','JSON','Handoff'] }, rgb: [1.00,0.84,0.10], glow: '#eab308', proficiency: 78 },
      { name: 'Webflow', abbr: 'Wf', cat: { en: 'No-Code Web', ar: 'ويب بدون كود' }, desc: { en: 'Visual web building with production-ready HTML & CSS output.', ar: 'Visual web building with production-ready HTML & CSS output.' }, tags: { en: ['Web','CMS','CSS'], ar: ['Web','CMS','CSS'] }, rgb: [0.35,0.65,1.00], glow: '#38bdf8', proficiency: 75 },
    ]
  },
  footer: {
    copyright: { en: '\u00a9 2026 Osama Tammam. All rights reserved.', ar: '\u00a9 \u0662\u0660\u0662\u0666 \u0623\u0633\u0627\u0645\u0629 \u062a\u0645\u0627\u0645. \u062c\u0645\u064a\u0639 \u0627\u0644\u062d\u0642\u0648\u0642 \u0645\u062d\u0641\u0648\u0638\u0629.' },
    links: { en: ['Home', 'Portfolio', 'About', 'Contact'], ar: ['\u0627\u0644\u0631\u0626\u064a\u0633\u064a\u0629', '\u0627\u0644\u0645\u0634\u0627\u0631\u064a\u0639', '\u0639\u0646\u064a', '\u062a\u0648\u0627\u0635\u0644'] },
  },
  contact: {
    email: 'osamatammam1996ot.eng@gmail.com',
    availability: { en: 'Open to new work\u00a0\u00b7\u00a0Replies within 24h', ar: '\u0645\u062a\u0627\u062d \u0644\u0644\u0645\u0634\u0627\u0631\u064a\u0639 \u0627\u0644\u062c\u062f\u064a\u062f\u0629\u00a0\u00b7\u00a0\u064a\u0631\u062f \u062e\u0644\u0627\u0644 \u0662\u0664 \u0633\u0627\u0639\u0629' },
    headline1: { en: 'Got a problem', ar: '\u0644\u062f\u064a\u0643 \u062a\u062d\u062f\u064d' },
    headline2: { en: 'worth solving?', ar: '\u064a\u0633\u062a\u062d\u0642 \u0627\u0644\u062d\u0644\u061f' },
    headline3: { en: "Let's talk about it.", ar: '\u0644\u0646\u062a\u062d\u062f\u062b \u0639\u0646\u0647.' },
    body: { en: "I take on a small number of projects at a time \u2014 enough to give each one real attention. If you have something that needs clarity, a product stuck between good and great, or an idea you haven't been able to articulate yet, that's exactly the kind of thing I like to work on.", ar: '\u0623\u062a\u0648\u0644\u0649 \u0639\u062f\u062f\u0627\u064b \u0645\u062d\u062f\u0648\u062f\u0627\u064b \u0645\u0646 \u0627\u0644\u0645\u0634\u0627\u0631\u064a\u0639 \u0641\u064a \u0622\u0646\u064d \u0648\u0627\u062d\u062f \u2014 \u0645\u0627 \u064a\u0643\u0641\u064a \u0644\u0645\u0646\u062d \u0643\u0644\u064d \u0645\u0646\u0647\u0627 \u0627\u0647\u062a\u0645\u0627\u0645\u0627\u064b \u062d\u0642\u064a\u0642\u064a\u0627\u064b. \u0625\u0646 \u0643\u0627\u0646 \u0644\u062f\u064a\u0643 \u0645\u0627 \u064a\u062d\u062a\u0627\u062c \u0625\u0644\u0649 \u0648\u0636\u0648\u062d\u060c \u0623\u0648 \u0645\u0646\u062a\u062c \u0628\u064a\u0646 \u0627\u0644\u062c\u064a\u062f \u0648\u0627\u0644\u0631\u0627\u0626\u0639\u060c \u0623\u0648 \u0641\u0643\u0631\u0629 \u0644\u0645 \u062a\u0633\u062a\u0637\u0639 \u0635\u064a\u0627\u063a\u062a\u0647\u0627 \u0628\u0639\u062f\u060c \u0641\u0647\u0630\u0627 \u0628\u0627\u0644\u0636\u0628\u0637 \u0645\u0627 \u0623\u062d\u0628 \u0627\u0644\u0639\u0645\u0644 \u0639\u0644\u064a\u0647.' },
    note: { en: "No pitch decks needed. Just tell me what you're working on and where it's breaking down.", ar: '\u0644\u0627 \u062a\u062d\u062a\u0627\u062c \u0625\u0644\u0649 \u0639\u0631\u0648\u0636 \u062a\u0642\u062f\u064a\u0645\u064a\u0629. \u0641\u0642\u0637 \u0623\u062e\u0628\u0631\u0646\u064a \u0628\u0645\u0627 \u062a\u0639\u0645\u0644 \u0639\u0644\u064a\u0647 \u0648\u0623\u064a\u0646 \u062a\u0639\u062b\u0651\u0631.' },
    signoff1: { en: 'Based in Egypt\u00a0\u00b7\u00a0Works with clients worldwide.', ar: '\u0645\u0642\u064a\u0645 \u0641\u064a \u0645\u0635\u0631\u00a0\u00b7\u00a0\u064a\u0639\u0645\u0644 \u0645\u0639 \u0639\u0645\u0644\u0627\u0621 \u062d\u0648\u0644 \u0627\u0644\u0639\u0627\u0644\u0645.' },
    signoff2: { en: 'No agencies. No middlemen. Just me.', ar: '\u0644\u0627 \u0648\u0643\u0627\u0644\u0627\u062a. \u0644\u0627 \u0648\u0633\u0637\u0627\u0621. \u0623\u0646\u0627 \u0641\u0642\u0637.' },
    emailLabel: { en: 'Email', ar: '\u0627\u0644\u0628\u0631\u064a\u062f \u0627\u0644\u0625\u0644\u0643\u062a\u0631\u0648\u0646\u064a' },
    socials: {
      whatsapp: '',
      linkedin: 'https://linkedin.com/in/osamatammam',
      behance: 'https://behance.net/osamatammam',
      facebook: '',
    },
  },
  projects: [
    
    {
      id: 1, visible: true,
      title: { en: 'Nexus Analytics', ar: 'نيكسس أناليتكس' },
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=2000',
      tags: { en: ['SaaS', 'AI', 'Data Viz', 'B2B'], ar: ['SaaS', 'AI', 'بيانات', 'B2B'] },
      desc: { en: 'Advanced data analytics dashboard for B2B SaaS platforms.', ar: 'لوحة تحليلات بيانات متقدمة لمنصات SaaS B2B.' },
      accent: '#6366f1'
    },
    
    {
      id: 2,
      visible: true,
      title: { en: 'Orion Enterprise', ar: '\u0623\u0648\u0631\u064a\u0648\u0646 \u0625\u0646\u062a\u0631\u0628\u0631\u0627\u064a\u0632' },
      image: '',
      tags: { en: ['Enterprise', 'Design System', 'Fortune 500', 'Multi-platform'], ar: ['\u0645\u0624\u0633\u0633\u0627\u062a', '\u0646\u0638\u0627\u0645 \u062a\u0635\u0645\u064a\u0645', 'Fortune 500', '\u0645\u062a\u0639\u062f\u062f \u0627\u0644\u0645\u0646\u0635\u0627\u062a'] },
      desc: { en: 'Comprehensive design system and UX overhaul for a Fortune 500 enterprise productivity platform \u2014 serving 50,000+ daily active users across 12 product areas.', ar: '\u0646\u0638\u0627\u0645 \u062a\u0635\u0645\u064a\u0645 \u0634\u0627\u0645\u0644 \u0648\u062a\u062d\u062f\u064a\u062b UX \u0644\u0645\u0646\u0635\u0629 \u0625\u0646\u062a\u0627\u062c\u064a\u0629 \u0644\u0645\u0624\u0633\u0633\u0629 Fortune 500 \u2014 \u062a\u062e\u062f\u0645 \u0623\u0643\u062b\u0631 \u0645\u0646 50,000 \u0645\u0633\u062a\u062e\u062f\u0645 \u0646\u0634\u0637 \u064a\u0648\u0645\u064a\u0627\u064b.' },
      accent: '#8b5cf6',
    },
    {
      id: 3,
      visible: true,
      title: { en: 'Lumina AI', ar: '\u0644\u0648\u0645\u064a\u0646\u0627 \u0625\u064a\u0647 \u0622\u064a' },
      image: '',
      tags: { en: ['AI', 'Product Design', 'Zero-to-Launch', 'Content Platform'], ar: ['\u0630\u0643\u0627\u0621 \u0627\u0635\u0637\u0646\u0627\u0639\u064a', '\u062a\u0635\u0645\u064a\u0645 \u0645\u0646\u062a\u062c', '\u0645\u0646 \u0627\u0644\u0635\u0641\u0631', '\u0645\u0646\u0635\u0629 \u0645\u062d\u062a\u0648\u0649'] },
      desc: { en: 'From zero to launch \u2014 product design for an AI-powered content generation platform. Shipped in 8 weeks with a 4.8/5 user satisfaction score.', ar: '\u0645\u0646 \u0627\u0644\u0635\u0641\u0631 \u062d\u062a\u0649 \u0627\u0644\u0625\u0637\u0644\u0627\u0642 \u2014 \u062a\u0635\u0645\u064a\u0645 \u0645\u0646\u062a\u062c \u0644\u0645\u0646\u0635\u0629 \u0625\u0646\u0634\u0627\u0621 \u0645\u062d\u062a\u0648\u0649 \u0628\u0627\u0644\u0630\u0643\u0627\u0621 \u0627\u0644\u0627\u0635\u0637\u0646\u0627\u0639\u064a. \u0623\u0637\u0644\u0642 \u062e\u0644\u0627\u0644 8 \u0623\u0633\u0627\u0628\u064a\u0639 \u0628\u062f\u0631\u062c\u0629 \u0631\u0636\u0627 4.8/5.' },
      accent: '#06b6d4',
    },
    {
      id: 4,
      visible: true,
      title: { en: 'HealthBridge', ar: '\u0647\u064a\u0644\u062b\u0628\u0631\u064a\u062f\u062c' },
      image: '',
      tags: { en: ['Healthcare', 'Mobile App', 'Accessibility', 'Patient UX'], ar: ['\u0631\u0639\u0627\u064a\u0629 \u0635\u062d\u064a\u0629', '\u062a\u0637\u0628\u064a\u0642 \u0645\u062d\u0645\u0648\u0644', '\u0625\u0645\u0643\u0627\u0646\u064a\u0629 \u0627\u0644\u0648\u0635\u0648\u0644', '\u062a\u062c\u0631\u0628\u0629 \u0627\u0644\u0645\u0631\u064a\u0636'] },
      desc: { en: 'Patient-centric UX for a healthcare management app \u2014 accessibility-first design serving diverse user demographics, resulting in 65% reduction in support tickets.', ar: '\u062a\u062c\u0631\u0628\u0629 \u0645\u0633\u062a\u062e\u062f\u0645 \u0645\u062a\u0645\u062d\u0648\u0631\u0629 \u062d\u0648\u0644 \u0627\u0644\u0645\u0631\u064a\u0636 \u0644\u062a\u0637\u0628\u064a\u0642 \u0625\u062f\u0627\u0631\u0629 \u0627\u0644\u0631\u0639\u0627\u064a\u0629 \u0627\u0644\u0635\u062d\u064a\u0629 \u2014 \u062a\u0635\u0645\u064a\u0645 \u0625\u0645\u0643\u0627\u0646\u064a\u0629 \u0627\u0644\u0648\u0635\u0648\u0644 \u0623\u0648\u0644\u0627\u064b \u0645\u0645\u0627 \u0623\u062f\u0649 \u0625\u0644\u0649 \u062a\u0642\u0644\u064a\u0644 \u062a\u0630\u0627\u0643\u0631 \u0627\u0644\u062f\u0639\u0645 65\u066a.' },
      accent: '#10b981',
    },
  ],
  caseStudies: [
    {
      id: 1, visible: true,
      title: { en: 'Nexus Analytics', ar: '\u0646\u064a\u0643\u0633\u0633 \u0623\u0646\u0627\u0644\u064a\u062a\u0643\u0633' },
      tagline: { en: 'Redesigning a B2B SaaS analytics suite to reduce cognitive load and boost activation', ar: '\u0625\u0639\u0627\u062f\u0629 \u062a\u0635\u0645\u064a\u0645 \u062d\u0632\u0645\u0629 \u062a\u062d\u0644\u064a\u0644\u0627\u062a SaaS \u0644\u062a\u0642\u0644\u064a\u0644 \u0627\u0644\u062a\u062d\u0645\u064a\u0644 \u0627\u0644\u0645\u0639\u0631\u0641\u064a \u0648\u0632\u064a\u0627\u062f\u0629 \u0627\u0644\u062a\u0641\u0639\u064a\u0644' },
      heroImage: '',
      meta: { role: { en: 'Lead UX/UI Designer', ar: '\u0645\u0635\u0645\u0645 UX/UI \u0631\u0626\u064a\u0633\u064a' }, timeline: { en: '6 months', ar: '6 أشهر' }, team: { en: '3 designers, 8 engineers', ar: '3 \u0645\u0635\u0645\u0645\u064a\u0646\u060c 8 \u0645\u0647\u0646\u062f\u0633\u064a\u0646' }, industry: { en: 'Technology / SaaS', ar: '\u062a\u0643\u0646\u0648\u0644\u0648\u062c\u064a\u0627 / SaaS' } },
      metrics: [
        { value: '-40%', label: { en: 'Cognitive Load Reduction', ar: 'تقليل التحميل المعرفي' }, sub: { en: '', ar: '' } },
        { value: '+28%', label: { en: 'User Activation', ar: 'تفعيل المستخدمين' }, sub: { en: '', ar: '' } },
        { value: '4.6/5', label: { en: 'Satisfaction Score', ar: 'درجة الرضا' }, sub: { en: '', ar: '' } },
      ],
      problem: { narrative: { en: '', ar: '' }, painPoints: [] },
      research: { methods: { en: [], ar: [] }, insights: [], findings: { en: [], ar: [] } },
      process: { steps: [], tradeoffs: [] },
      solution: { screens: [] },
      screenshots: [],
      video: { url: '', youtubeId: '', aspectRatio: '16/9', title: { en: '', ar: '' }, desc: { en: '', ar: '' }, duration: '' },
      results: { metrics: [], quote: { text: { en: '', ar: '' }, author: { en: '', ar: '' }, role: { en: '', ar: '' } } },
      reflection: { summary: { en: '', ar: '' }, lessons: { en: [], ar: [] }, next: { en: [], ar: [] } },
      settings: { showProblem: true, showResearch: true, showProcess: true, showSolution: true, showMedia: true, showResults: true, showReflection: true },
      labels: {
        overview: { en: 'Overview', ar: 'نظرة عامة' },
        problem: { en: 'The Problem', ar: 'المشكلة' },
        research: { en: 'Research & Discovery', ar: 'البحث والاكتشاف' },
        process: { en: 'Design Process', ar: 'عملية التصميم' },
        solution: { en: 'The Solution', ar: 'الحل' },
        media: { en: 'Walkthrough', ar: 'جولة' },
        results: { en: 'Results & Impact', ar: 'النتائج والأثر' },
        reflection: { en: 'Reflection', ar: 'تأملات' }
      },
    },
    {
      id: 2, visible: true,
      title: { en: 'Orion Enterprise', ar: '\u0623\u0648\u0631\u064a\u0648\u0646 \u0625\u0646\u062a\u0631\u0628\u0631\u0627\u064a\u0632' },
      tagline: { en: 'Design system and UX overhaul for a Fortune 500 enterprise productivity platform', ar: '\u0646\u0638\u0627\u0645 \u062a\u0635\u0645\u064a\u0645 \u0648\u062a\u062d\u062f\u064a\u062b UX \u0644\u0645\u0646\u0635\u0629 \u0625\u0646\u062a\u0627\u062c\u064a\u0629 \u0644\u0645\u0624\u0633\u0633\u0629 Fortune 500' },
      heroImage: '',
      meta: { role: { en: 'Senior Product Designer', ar: '\u0645\u0635\u0645\u0645 \u0645\u0646\u062a\u062c\u0627\u062a \u0623\u0648\u0644' }, timeline: { en: '8 months', ar: '8 أشهر' }, team: { en: '5 designers, 20+ engineers', ar: '5 \u0645\u0635\u0645\u0645\u064a\u0646\u060c 20+ \u0645\u0647\u0646\u062f\u0633' }, industry: { en: 'Enterprise Software', ar: '\u0628\u0631\u0645\u062c\u064a\u0627\u062a \u0627\u0644\u0645\u0624\u0633\u0633\u0627\u062a' } },
      metrics: [
        { value: '50K+', label: { en: 'Daily Active Users', ar: 'مستخدم نشط يومياً' }, sub: { en: '', ar: '' } },
        { value: '12', label: { en: 'Product Areas Unified', ar: 'منطقة منتج موحدة' }, sub: { en: '', ar: '' } },
        { value: '-35%', label: { en: 'Design Debt Reduction', ar: 'تقليل ديون التصميم' }, sub: { en: '', ar: '' } },
      ],
      problem: {
        narrative: { en: 'Orion\'s ecosystem consisted of 12 acquired products that looked and behaved differently. This fragmentation caused severe workflow friction for enterprise users who had to context-switch across platforms, resulting in high training costs.', ar: 'تألف نظام أوريون البيئي من 12 منتجاً مستحوذاً تبدو وتتصرف بشكل مختلف تماماً. أدى هذا التفتت إلى احتكاك شديد في سير العمل للمستخدمين.' },
        painPoints: [
          { icon: 'component', title: { en: 'Inconsistent UI', ar: 'واجهة غير متسقة' }, desc: { en: '15 different button styles and 8 navigation patterns', ar: '15 نمط أزرار مختلف و8 أنماط تنقل' } },
          { icon: 'timer', title: { en: 'Workflow Friction', ar: 'احتكاك سير العمل' }, desc: { en: 'Users took 40% longer to complete cross-app tasks', ar: 'استغرق إكمال المهام وقتاً أطول بنسبة 40%' } }
        ]
      },
      research: {
        methods: { en: ['UI Audit', 'Stakeholder Workshops'], ar: ['تدقيق الواجهة', 'ورش عمل أصحاب المصلحة'] },
        insights: [
          { id: '1', quote: { en: 'I feel like I have to learn a new software every time I switch modules.', ar: 'أشعر وكأنني أتعلم برنامجاً جديداً في كل مرة أبدل فيها الوحدات.' }, author: { en: 'Enterprise User', ar: 'مستخدم مؤسسة' }, theme: { en: 'Consistency', ar: 'الاتساق' } }
        ],
        findings: { en: [], ar: [] }
      },
      process: {
        steps: [
          { phase: 'Audit', title: { en: 'Component Inventory', ar: 'جرد المكونات' }, duration: { en: '3 weeks', ar: '3 أسابيع' }, desc: { en: 'Cataloged over 800 divergent components to identify baseline patterns.', ar: 'جرد أكثر من 800 مكون مختلف لتحديد الأنماط الأساسية.' } },
          { phase: 'Design', title: { en: 'Token Architecture', ar: 'هيكلة الرموز' }, duration: { en: '4 weeks', ar: '4 أسابيع' }, desc: { en: 'Established a semantic design token system to unify colors, typography, and spacing.', ar: 'إنشاء نظام رموز تصميم دلالي لتوحيد الألوان والطباعة.' } }
        ],
        tradeoffs: [
          { decision: { en: 'Gradual Rollout', ar: 'إطلاق تدريجي' }, rationale: { en: 'We rolled out updates modularly to avoid disrupting enterprise workflows abruptly.', ar: 'أطلقنا التحديثات تدريجياً لتجنب تعطيل سير عمل المؤسسة.' } }
        ]
      },
      solution: {
        screens: [
          { title: { en: 'Unified Component Library', ar: 'مكتبة مكونات موحدة' }, desc: { en: 'A centralized Figma library linked to React components, enforcing strict brand guidelines.', ar: 'مكتبة Figma مركزية مرتبطة بمكونات React لفرض إرشادات العلامة التجارية.' }, image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=2000', callouts: { en: ['Semantic tokens', 'Dark mode support'], ar: ['رموز دلالية', 'دعم الوضع الداكن'] }, align: 'left' }
        ]
      },
      screenshots: [
        { image: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&q=80&w=1000', caption: { en: 'Documentation Portal', ar: 'بوابة التوثيق' }, tag: { en: 'Web', ar: 'ويب' } }
      ],
      video: { url: '', youtubeId: '', aspectRatio: '16/9', title: { en: '', ar: '' }, desc: { en: '', ar: '' }, duration: '' },
      results: {
        metrics: [
          { value: '3x', label: { en: 'Faster Prototyping', ar: 'نماذج أولية أسرع' }, sub: { en: 'For the design team', ar: 'لفريق التصميم' } }
        ],
        quote: { text: { en: 'The new system finally makes our suite feel like a single, premium product.', ar: 'النظام الجديد يجعل حزمتنا تبدو أخيراً كمنتج واحد متميز.' }, author: { en: 'VP of Product', ar: 'نائب رئيس المنتج' }, role: { en: 'Stakeholder', ar: 'صاحب المصلحة' } }
      },
      reflection: {
        summary: { en: 'Establishing governance early was critical. A design system is only as good as the adoption process supporting it.', ar: 'كان تأسيس الحوكمة مبكراً أمراً بالغ الأهمية. نظام التصميم جيد بقدر عملية الاعتماد التي تدعمه.' },
        lessons: { en: ['Documentation is UX', 'Developer advocacy matters'], ar: ['التوثيق هو تجربة مستخدم', 'دعم المطورين مهم'] },
        next: { en: ['Automate token sync to code', 'Expand motion guidelines'], ar: ['أتمتة مزامنة الرموز إلى الكود', 'توسيع إرشادات الحركة'] }
      },
      settings: { showProblem: true, showResearch: true, showProcess: true, showSolution: true, showMedia: true, showResults: true, showReflection: true },
      labels: {
        overview: { en: 'Overview', ar: 'نظرة عامة' },
        problem: { en: 'The Problem', ar: 'المشكلة' },
        research: { en: 'Research & Discovery', ar: 'البحث والاكتشاف' },
        process: { en: 'Design Process', ar: 'عملية التصميم' },
        solution: { en: 'The Solution', ar: 'الحل' },
        media: { en: 'Walkthrough', ar: 'جولة' },
        results: { en: 'Results & Impact', ar: 'النتائج والأثر' },
        reflection: { en: 'Reflection', ar: 'تأملات' }
      },
    },
    {
      id: 3, visible: true,
      title: { en: 'Lumina AI', ar: '\u0644\u0648\u0645\u064a\u0646\u0627 \u0625\u064a\u0647 \u0622\u064a' },
      tagline: { en: 'Zero-to-launch product design for an AI-powered content generation platform', ar: '\u062a\u0635\u0645\u064a\u0645 \u0645\u0646\u062a\u062c \u0645\u0646 \u0627\u0644\u0635\u0641\u0631 \u0644\u0645\u0646\u0635\u0629 \u0625\u0646\u0634\u0627\u0621 \u0645\u062d\u062a\u0648\u0649 \u0628\u0627\u0644\u0630\u0643\u0627\u0621 \u0627\u0644\u0627\u0635\u0637\u0646\u0627\u0639\u064a' },
      heroImage: '',
      meta: { role: { en: 'Product Designer (Solo)', ar: '\u0645\u0635\u0645\u0645 \u0645\u0646\u062a\u062c (\u0645\u0646\u0641\u0631\u062f)' }, timeline: { en: '8 weeks', ar: '8 أسابيع' }, team: { en: '1 designer, 4 engineers', ar: '\u0645\u0635\u0645\u0645 \u0648\u0627\u062d\u062f\u060c 4 \u0645\u0647\u0646\u062f\u0633\u064a\u0646' }, industry: { en: 'AI / Content', ar: '\u0627\u0644\u0630\u0643\u0627\u0621 \u0627\u0644\u0627\u0635\u0637\u0646\u0627\u0639\u064a / \u0627\u0644\u0645\u062d\u062a\u0648\u0649' } },
      metrics: [
        { value: '4.8/5', label: { en: 'User Satisfaction', ar: 'رضا المستخدمين' }, sub: { en: '', ar: '' } },
        { value: '8 wks', label: { en: 'Time to Launch', ar: 'وقت الإطلاق' }, sub: { en: '', ar: '' } },
        { value: '+62%', label: { en: 'Retention Rate', ar: 'معدل الاحتفاظ' }, sub: { en: '', ar: '' } },
      ],
      problem: {
        narrative: { en: 'The AI content generation space is crowded with complex, developer-focused tools. Lumina needed to stand out by offering an intuitive, consumer-grade experience for marketers without sacrificing advanced prompt controls.', ar: 'مجال إنشاء المحتوى بالذكاء الاصطناعي مزدحم بأدوات معقدة. احتاجت لومينا إلى التميز من خلال تقديم تجربة بديهية للمسوقين دون التضحية بعناصر التحكم المتقدمة.' },
        painPoints: [
          { icon: 'wand', title: { en: 'Prompt Engineering', ar: 'هندسة الأوامر' }, desc: { en: 'Marketers struggled to write effective AI prompts', ar: 'عانى المسوقون في كتابة أوامر فعالة' } },
          { icon: 'layout', title: { en: 'Cluttered Workspaces', ar: 'مساحات عمل فوضوية' }, desc: { en: 'Competitor tools felt like IDEs rather than writing apps', ar: 'بدت أدوات المنافسين كبيئات تطوير بدلاً من تطبيقات كتابة' } }
        ]
      },
      research: {
        methods: { en: ['Competitor Analysis', 'User Testing'], ar: ['تحليل المنافسين', 'اختبار المستخدم'] },
        insights: [
          { id: '1', quote: { en: 'I just want to write. If I have to tweak 10 sliders before generating text, I\'ll just do it myself.', ar: 'أريد فقط أن أكتب. إذا كان علي تعديل 10 أشرطة قبل الإنشاء، فسأفعل ذلك بنفسي.' }, author: { en: 'Content Marketer', ar: 'مسوق محتوى' }, theme: { en: 'Simplicity', ar: 'البساطة' } }
        ],
        findings: { en: [], ar: [] }
      },
      process: {
        steps: [
          { phase: 'Ideation', title: { en: 'Rapid Prototyping', ar: 'نماذج أولية سريعة' }, duration: { en: '2 weeks', ar: 'أسبوعين' }, desc: { en: 'Created 5 distinct interaction models for the AI assistant and tested them with target users.', ar: 'تم إنشاء 5 نماذج تفاعل مختلفة للمساعد واختبارها مع المستخدمين.' } },
          { phase: 'Refinement', title: { en: 'Micro-interactions', ar: 'تفاعلات دقيقة' }, duration: { en: '2 weeks', ar: 'أسبوعين' }, desc: { en: 'Designed subtle animations to make the AI generation process feel magical rather than mechanical.', ar: 'تصميم رسوم متحركة دقيقة لجعل عملية الإنشاء تبدو سحرية.' } }
        ],
        tradeoffs: [
          { decision: { en: 'Hidden Advanced Controls', ar: 'إخفاء عناصر التحكم المتقدمة' }, rationale: { en: 'Prioritized a clean default view, moving advanced prompt tuning behind an "Expert Mode" toggle.', ar: 'إعطاء الأولوية لعرض نظيف، ونقل الضبط المتقدم خلف زر "الوضع الاحترافي".' } }
        ]
      },
      solution: {
        screens: [
          { title: { en: 'The Magic Canvas', ar: 'لوحة قماشية سحرية' }, desc: { en: 'A distraction-free writing environment where AI suggestions seamlessly blend into the user\'s flow.', ar: 'بيئة كتابة خالية من المشتتات حيث تمتزج اقتراحات الذكاء الاصطناعي بسلاسة.' }, image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=2000', callouts: { en: ['Inline AI suggestions', 'Context-aware prompts'], ar: ['اقتراحات مضمنة', 'أوامر مدركة للسياق'] }, align: 'right' }
        ]
      },
      screenshots: [
        { image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=1000', caption: { en: 'AI Writing Interface', ar: 'واجهة الكتابة' }, tag: { en: 'Desktop', ar: 'سطح المكتب' } }
      ],
      video: { url: '', youtubeId: '', aspectRatio: '16/9', title: { en: '', ar: '' }, desc: { en: '', ar: '' }, duration: '' },
      results: {
        metrics: [
          { value: '10K+', label: { en: 'Beta Signups', ar: 'تسجيلات تجريبية' }, sub: { en: 'In first month', ar: 'في الشهر الأول' } }
        ],
        quote: { text: { en: 'It feels less like a tool and more like a co-writer.', ar: 'يبدو كأنه كاتب مساعد أكثر من كونه مجرد أداة.' }, author: { en: 'Beta Tester', ar: 'مختبر للنسخة التجريبية' }, role: { en: 'Copywriter', ar: 'كاتب نصوص' } }
      },
      reflection: {
        summary: { en: 'Designing for AI requires a careful balance between user agency and automation. Trust is built through transparency.', ar: 'يتطلب التصميم للذكاء الاصطناعي توازناً دقيقاً بين تحكم المستخدم والأتمتة.' },
        lessons: { en: ['Loading states are critical for AI', 'Default to simplicity'], ar: ['حالات التحميل مهمة جداً', 'الاعتماد على البساطة افتراضياً'] },
        next: { en: ['Voice input features', 'Custom AI personas'], ar: ['ميزات الإدخال الصوتي', 'شخصيات ذكاء اصطناعي مخصصة'] }
      },
      settings: { showProblem: true, showResearch: true, showProcess: true, showSolution: true, showMedia: true, showResults: true, showReflection: true },
      labels: {
        overview: { en: 'Overview', ar: 'نظرة عامة' },
        problem: { en: 'The Problem', ar: 'المشكلة' },
        research: { en: 'Research & Discovery', ar: 'البحث والاكتشاف' },
        process: { en: 'Design Process', ar: 'عملية التصميم' },
        solution: { en: 'The Solution', ar: 'الحل' },
        media: { en: 'Walkthrough', ar: 'جولة' },
        results: { en: 'Results & Impact', ar: 'النتائج والأثر' },
        reflection: { en: 'Reflection', ar: 'تأملات' }
      },
    },
    {
      id: 4, visible: true,
      title: { en: 'HealthBridge', ar: '\u0647\u064a\u0644\u062b\u0628\u0631\u064a\u062f\u062c' },
      tagline: { en: 'Accessibility-first healthcare management app for diverse patient demographics', ar: '\u062a\u0637\u0628\u064a\u0642 \u0625\u062f\u0627\u0631\u0629 \u0627\u0644\u0631\u0639\u0627\u064a\u0629 \u0627\u0644\u0635\u062d\u064a\u0629 \u0628\u0625\u0645\u0643\u0627\u0646\u064a\u0629 \u0648\u0635\u0648\u0644 \u0623\u0648\u0644\u0627\u064b' },
      heroImage: '',
      meta: { role: { en: 'Lead UX Designer', ar: '\u0645\u0635\u0645\u0645 UX \u0631\u0626\u064a\u0633\u064a' }, timeline: { en: '7 months', ar: '7 أشهر' }, team: { en: '2 designers, 6 engineers', ar: '\u0645\u0635\u0645\u0645\u0627\u0646\u060c 6 \u0645\u0647\u0646\u062f\u0633\u064a\u0646' }, industry: { en: 'Healthcare', ar: '\u0627\u0644\u0631\u0639\u0627\u064a\u0629 \u0627\u0644\u0635\u062d\u064a\u0629' } },
      metrics: [
        { value: '-65%', label: { en: 'Support Tickets', ar: 'تذاكر الدعم' }, sub: { en: '', ar: '' } },
        { value: '98%', label: { en: 'WCAG Compliance', ar: 'امتثال WCAG' }, sub: { en: '', ar: '' } },
        { value: '+45%', label: { en: 'Task Completion', ar: 'إكمال المهام' }, sub: { en: '', ar: '' } },
      ],
      problem: {
        narrative: { en: 'Elderly patients were consistently abandoning the appointment booking flow. The existing app was cluttered, lacked contrast, and relied heavily on complex gestures, making it inaccessible to our primary demographic.', ar: 'كان المرضى المسنون يتخلون باستمرار عن عملية حجز المواعيد. كان التطبيق الحالي فوضوياً، وافتقر إلى التباين، واعتمد على إيماءات معقدة.' },
        painPoints: [
          { icon: 'eye', title: { en: 'Poor Accessibility', ar: 'ضعف إمكانية الوصول' }, desc: { en: 'Small touch targets and low-contrast text', ar: 'أهداف لمس صغيرة ونص منخفض التباين' } },
          { icon: 'calendar', title: { en: 'Complex Booking', ar: 'حجز معقد' }, desc: { en: '7 steps required to book a basic checkup', ar: '7 خطوات مطلوبة لحجز فحص أساسي' } }
        ]
      },
      research: {
        methods: { en: ['Accessibility Audit', 'In-person Testing'], ar: ['تدقيق إمكانية الوصول', 'اختبار شخصي'] },
        insights: [
          { id: '1', quote: { en: 'I can\'t read these gray dates, and I\'m afraid of tapping the wrong thing.', ar: 'لا أستطيع قراءة هذه التواريخ الرمادية، وأخشى النقر على شيء خاطئ.' }, author: { en: 'Patient (68)', ar: 'مريض (68)' }, theme: { en: 'Confidence', ar: 'الثقة' } }
        ],
        findings: { en: [], ar: [] }
      },
      process: {
        steps: [
          { phase: 'Redesign', title: { en: 'Inclusive UI', ar: 'واجهة شاملة' }, duration: { en: '4 weeks', ar: '4 أسابيع' }, desc: { en: 'Increased minimum touch targets to 48px and ensured AA compliance for all typography and contrast ratios.', ar: 'زيادة الحد الأدنى لأهداف اللمس وضمان الامتثال لـ AA.' } },
          { phase: 'Testing', title: { en: 'Validation', ar: 'التحقق' }, duration: { en: '2 weeks', ar: 'أسبوعين' }, desc: { en: 'Conducted usability sessions with patients aged 60+ to validate the simplified flow.', ar: 'إجراء جلسات قابلية الاستخدام مع مرضى تجاوزوا الـ 60 عاماً.' } }
        ],
        tradeoffs: [
          { decision: { en: 'Linear Navigation', ar: 'تنقل خطي' }, rationale: { en: 'Abandoned modern swipe gestures in favor of clear, explicit "Next" and "Back" buttons.', ar: 'التخلي عن إيماءات التمرير الحديثة لصالح أزرار "التالي" و"السابق" الصريحة.' } }
        ]
      },
      solution: {
        screens: [
          { title: { en: 'Accessible Booking Flow', ar: 'مسار حجز يسهل الوصول إليه' }, desc: { en: 'A streamlined, step-by-step process with large typography, high contrast, and unmistakable primary actions.', ar: 'عملية مبسطة خطوة بخطوة مع طباعة كبيرة وتباين عالٍ.' }, image: 'https://images.unsplash.com/photo-1576091160550-2173ff9e594b?auto=format&fit=crop&q=80&w=2000', callouts: { en: ['High contrast UI', 'Large touch targets'], ar: ['واجهة تباين عالي', 'أهداف لمس كبيرة'] }, align: 'left' }
        ]
      },
      screenshots: [
        { image: 'https://images.unsplash.com/photo-1576091160550-2173ff9e594b?auto=format&fit=crop&q=80&w=1000', caption: { en: 'Appointment Screen', ar: 'شاشة الموعد' }, tag: { en: 'Mobile', ar: 'هاتف' } }
      ],
      video: { url: '', youtubeId: '', aspectRatio: '16/9', title: { en: '', ar: '' }, desc: { en: '', ar: '' }, duration: '' },
      results: {
        metrics: [
          { value: '+85%', label: { en: 'Booking Success Rate', ar: 'معدل نجاح الحجز' }, sub: { en: 'Among seniors', ar: 'بين كبار السن' } }
        ],
        quote: { text: { en: 'For the first time, I booked my appointment without asking my daughter for help.', ar: 'لأول مرة، حجزت موعدي دون طلب المساعدة من ابنتي.' }, author: { en: 'Patient (72)', ar: 'مريض (72)' }, role: { en: 'User', ar: 'مستخدم' } }
      },
      reflection: {
        summary: { en: 'Good design is accessible design. Removing friction for impaired users actually improved the experience for everyone.', ar: 'التصميم الجيد هو تصميم يسهل الوصول إليه. إزالة العقبات حسّن التجربة للجميع.' },
        lessons: { en: ['Never sacrifice clarity for aesthetics', 'Test with extreme users'], ar: ['لا تضحي بالوضوح من أجل الجماليات', 'اختبر مع مستخدمين من شرائح مختلفة'] },
        next: { en: ['Implement voice feedback', 'Add multi-language support'], ar: ['تنفيذ ردود فعل صوتية', 'إضافة دعم متعدد اللغات'] }
      },
      settings: { showProblem: true, showResearch: true, showProcess: true, showSolution: true, showMedia: true, showResults: true, showReflection: true },
      labels: {
        overview: { en: 'Overview', ar: 'نظرة عامة' },
        problem: { en: 'The Problem', ar: 'المشكلة' },
        research: { en: 'Research & Discovery', ar: 'البحث والاكتشاف' },
        process: { en: 'Design Process', ar: 'عملية التصميم' },
        solution: { en: 'The Solution', ar: 'الحل' },
        media: { en: 'Walkthrough', ar: 'جولة' },
        results: { en: 'Results & Impact', ar: 'النتائج والأثر' },
        reflection: { en: 'Reflection', ar: 'تأملات' }
      },
    },
  ],
  global: {
    seoTitle: 'Osama Tammam \u2014 Product Designer',
    seoDescription: 'Senior UX/UI Designer based in Cairo, crafting hard products into inevitable experiences.',
    ownerName: 'Osama Tammam',
    ownerEmail: 'hello@osamatammam.com',
    footerTagline: 'Made with passion and precision.',
  },
  recommendations: [
    {
      id: 'rec-1',
      visible: true,
      name: 'Sarah Jenkins',
      position: { en: 'CTO at Nexus', ar: 'الرئيس التنفيذي للتكنولوجيا في نكسس' },
      comment: { 
        en: 'Osama completely transformed our platform. His attention to detail, both in aesthetic design and technical architecture, resulted in an interface our users actually love to use.', 
        ar: 'قام أسامة بتحويل منصتنا بالكامل. اهتمامه بالتفاصيل، سواء في التصميم الجمالي أو البنية التقنية، أدى إلى واجهة يحب مستخدمونا استخدامها حقًا.' 
      },
      avatar: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=2000'
    },
    {
      id: 'rec-2',
      visible: true,
      name: 'Michael Chen',
      position: { en: 'VP of Product, Orion', ar: 'نائب رئيس المنتج، أوريون' },
      comment: { 
        en: 'Working with Osama was a masterclass in modern UI development. He seamlessly bridged the gap between our design system and robust React components.', 
        ar: 'كان العمل مع أسامة بمثابة درس رئيسي في تطوير واجهة المستخدم الحديثة. لقد نجح في سد الفجوة بين نظام التصميم لدينا ومكونات React القوية.' 
      },
      avatar: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=2000'
    },
    {
      id: 'rec-3',
      visible: true,
      name: 'Elena Rostova',
      position: { en: 'Design Lead, Lumina AI', ar: 'قائد التصميم، لومينا للذكاء الاصطناعي' },
      comment: { 
        en: 'I rarely see engineers with such a strong eye for design. Osama perfectly translated our futuristic aesthetic into performant, smooth web experiences.', 
        ar: 'نادرًا ما أرى مهندسين لديهم مثل هذه العين القوية للتصميم. قام أسامة بترجمة جمالياتنا المستقبلية بشكل مثالي إلى تجارب ويب سلسة وعالية الأداء.' 
      },
      avatar: 'https://images.unsplash.com/photo-1555421689-491a97ff2040?auto=format&fit=crop&q=80&w=2000'
    }
  ],
  updatedAt: new Date().toISOString(),
};
