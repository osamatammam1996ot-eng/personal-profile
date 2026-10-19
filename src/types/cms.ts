// Bilingual helper type
export type Bilingual<T = string> = { en: T; ar: T };

export interface CmsSections {
  hero: boolean;
  logoMarquee: boolean;
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
  showAvatar?: boolean;
  showLabel?: boolean;
  showHeadline?: boolean;
  showDesc?: boolean;
  elementOrder?: string[];
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
  meetingAction?: Bilingual;
  showMeetingAction?: boolean;
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

export interface CmsLogo {
  id: string;
  visible: boolean;
  name: string;
  url: string;
  href?: string;
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
  logoMarquee: CmsLogo[];
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

// Default CMS data
export const DEFAULT_CMS_DATA: CmsData = {
  sectionOrder: ['hero', 'logoMarquee', 'whyHireMe', 'skills', 'portfolio', 'recommendations', 'tools', 'contact', 'footer'],
  sections: {
    hero: true,
    logoMarquee: true,
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
    headline2: { en: 'feel inevitable.', ar: '\u0625\u0644\u0649 \u062a\u062c\u0631\u0628\u0628\u0629 \u0644\u0627 \u0645\u0641\u0631 \u0645\u0646\u0647\u0627.' },
    roles: { en: ['Senior UX Designer', 'Senior UI Designer', 'AI Product Designer'], ar: ['\u0645\u0635\u0645\u0645 UX \u0623\u0648\u0644', '\u0645\u0635\u0645\u0645 UI \u0623\u0648\u0644', '\u0645\u0635\u0645\u0645 \u0645\u0646\u062a\u062c\u0627\u062a AI'] },
    desc: { en: "Seven years building products for teams that couldn't afford to ship the wrong thing.\nI work closest to the problem when the stakes are highest.", ar: '\u0633\u0628\u0639 \u0633\u0646\u0648\u0627\u062a \u0645\u0646 \u0628\u0646\u0627\u0621 \u0627\u0644\u0645\u0646\u062a\u062c\u0627\u062a \u0644\u0641\u0631\u0642 \u0644\u0645 \u062a\u0643\u0646 \u062a\u062a\u062d\u0645\u0644 \u0627\u0644\u062e\u0637\u0623 \u0641\u064a \u0627\u0644\u0642\u0631\u0627\u0631.\n\u0623\u0643\u0648\u0646 \u0623\u0642\u0631\u0628 \u0644\u0644\u0645\u0634\u0643\u0644\u0629 \u062d\u064a\u0646 \u062a\u0643\u0648\u0646 \u0627\u0644\u0645\u062e\u0627\u0637\u0631 \u0641\u064a \u0623\u0639\u0644\u0627\u0647\u0627.' },
    cta1: { en: 'See my work', ar: '\u0634\u0627\u0647\u062f \u0623\u0639\u0645\u0627\u0644\u064a' },
    cta2: { en: "Let's talk", ar: '\u0644\u0646\u062a\u062d\u062f\u062b' },
    showAvatar: true,
    showLabel: true,
    showHeadline: true,
    showDesc: true,
    elementOrder: ['avatar', 'label', 'headline', 'roles', 'desc', 'ctas'],
  },
  logoMarquee: [
    { id: '1', visible: true, name: 'ServeBig', url: 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg' },
    { id: '2', visible: true, name: 'SEHA', url: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg' },
    { id: '3', visible: true, name: 'realize', url: 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg' },
    { id: '4', visible: true, name: 'Royal Commission', url: 'https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg' }
  ],
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
        title: { en: 'Enterprise-Grade Execution', ar: '\u062a\u0646\u0641\u064a\u0630 \u0628\u0645\u0639\u0627\u0644\u064a\u0631 \u0627\u0644\u0645\u0624\u0633\u0633\u0627\u062a' },
        desc: { en: 'From complex SaaS dashboards to multi-platform enterprise tools \u2014 polished, production-ready, every time.', ar: '\u0645\u0646 \u0644\u0648\u062d\u0627\u062a SaaS \u0627\u0644\u0645\u0639\u0642\u062f\u0629 \u0625\u0644\u0649 \u0623\u062f\u0648\u0627\u062a \u0627\u0644\u0645\u0624\u0633\u0633\u0627\u062a \u0645\u062a\u0639\u062f\u062f\u0629 \u0627\u0644\u0645\u0646\u0635\u0627\u062a \u2014 \u0645\u0635\u0642\u0648\u0644\u0629 \u0648\u062c\u0627\u0647\u0632\u0629 \u0644\u0644\u0625\u0646\u062a\u0627\u062c \u0641\u064a \u0643\u0644 \u0645\u0631\u0629.' },
      },
      {
        title: { en: 'Conversion-Focused UX', ar: '\u062a\u062c\u0631\u0628\u0629 \u0645\u0633\u062a\u062e\u062f\u0645 \u062a\u062d\u0642\u0642 \u0627\u0644\u062a\u062d\u0648\u0644' },
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
      { name: 'Figma', abbr: 'Fi', cat: { en: 'Design & Prototyping', ar: 'التصميم والنماذج' }, desc: { en: 'Primary environment for UI systems, components and interactive prototypes.', ar: 'Primary environment for UI systems, components and interactive prototypes.' }, tags: { en: ['UI Design','Components','Proto'], ar: ['UI Design','Components','Proto'] }, rgb: [0.62,0.28,1.00], glow: 'var(--color-brand)', proficiency: 98 },
      { name: 'Framer', abbr: 'Fr', cat: { en: 'Motion & Web', ar: 'الحركة والويب' }, desc: { en: 'Turning static designs into production-ready animated web experiences.', ar: 'Turning static designs into production-ready animated web experiences.' }, tags: { en: ['Animation','CMS','Web'], ar: ['Animation','CMS','Web'] }, rgb: [0.05,0.60,1.00], glow: 'var(--color-brand)', proficiency: 85 },
      { name: 'After Effects', abbr: 'Ae', cat: { en: 'Motion Graphics', ar: 'رسوم متحركة' }, desc: { en: 'Micro-interactions, loading states and brand animation sequences.', ar: 'Micro-interactions, loading states and brand animation sequences.' }, tags: { en: ['Motion','Lottie','Brand'], ar: ['Motion','Lottie','Brand'] }, rgb: [0.55,0.22,0.95], glow: 'var(--color-brand)', proficiency: 80 },
      { name: 'Midjourney', abbr: 'Mj', cat: { en: 'AI Imagery', ar: 'صور الذكاء الاصطناعي' }, desc: { en: 'Ideation and moodboarding with generative visuals for design direction.', ar: 'Ideation and moodboarding with generative visuals for design direction.' }, tags: { en: ['AI Art','Moodboard','Concept'], ar: ['AI Art','Moodboard','Concept'] }, rgb: [0.10,0.75,0.65], glow: 'var(--color-brand)', proficiency: 78 },
      { name: 'ChatGPT', abbr: 'Gp', cat: { en: 'AI Collaboration', ar: 'تعاون الذكاء الاصطناعي' }, desc: { en: 'Research, copywriting and rapid UX strategy ideation.', ar: 'Research, copywriting and rapid UX strategy ideation.' }, tags: { en: ['Research','Copy','Strategy'], ar: ['Research','Copy','Strategy'] }, rgb: [0.25,0.80,0.42], glow: 'var(--color-brand)', proficiency: 88 },
      { name: 'Notion', abbr: 'No', cat: { en: 'Docs & Planning', ar: 'المستندات والتخطيط' }, desc: { en: 'Design documentation, project wikis and client-facing deliverable hubs.', ar: 'Design documentation, project wikis and client-facing deliverable hubs.' }, tags: { en: ['Docs','Wiki','Delivery'], ar: ['Docs','Wiki','Delivery'] }, rgb: [0.75,0.75,0.90], glow: 'var(--color-brand)', proficiency: 90 },
      { name: 'Jira', abbr: 'Ji', cat: { en: 'Project Management', ar: 'إدارة المشاريع' }, desc: { en: 'Sprint planning and cross-functional collaboration with engineering.', ar: 'Sprint planning and cross-functional collaboration with engineering.' }, tags: { en: ['Agile','Sprints','Backlog'], ar: ['Agile','Sprints','Backlog'] }, rgb: [0.10,0.42,1.00], glow: 'var(--color-brand)', proficiency: 82 },
      { name: 'Photoshop', abbr: 'Ps', cat: { en: 'Image Editing', ar: 'تعديل الصور' }, desc: { en: 'Pixel-perfect compositing, retouching and visual asset production.', ar: 'Pixel-perfect compositing, retouching and visual asset production.' }, tags: { en: ['Compositing','Assets','Photo'], ar: ['Compositing','Assets','Photo'] }, rgb: [0.18,0.55,1.00], glow: 'var(--color-brand)', proficiency: 85 },
      { name: 'Illustrator', abbr: 'Ai', cat: { en: 'Vector & Icons', ar: 'أيقونات وفيكتور' }, desc: { en: 'Icon systems, custom illustrations and scalable brand marks.', ar: 'Icon systems, custom illustrations and scalable brand marks.' }, tags: { en: ['Icons','Vectors','Brand'], ar: ['Icons','Vectors','Brand'] }, rgb: [1.00,0.55,0.10], glow: 'var(--color-brand)', proficiency: 80 },
      { name: 'Mobbin', abbr: 'Mb', cat: { en: 'User Research', ar: 'بحث المستخدم' }, desc: { en: 'Discover real patterns in how users navigate — before a single line ships.', ar: 'Discover real patterns in how users navigate — before a single line ships.' }, tags: { en: ['Testing','Usability','UX'], ar: ['Testing','Usability','UX'] }, rgb: [1.00,0.30,0.50], glow: 'var(--color-brand)', proficiency: 75 },
      { name: 'Lottie', abbr: 'Lo', cat: { en: 'Animation Export', ar: 'تصدير الرسوم' }, desc: { en: 'Lightweight JSON animations for seamless developer handoff.', ar: 'Lightweight JSON animations for seamless developer handoff.' }, tags: { en: ['Export','JSON','Handoff'], ar: ['Export','JSON','Handoff'] }, rgb: [1.00,0.84,0.10], glow: 'var(--color-brand)', proficiency: 78 },
      { name: 'Webflow', abbr: 'Wf', cat: { en: 'No-Code Web', ar: 'ويب بدون كود' }, desc: { en: 'Visual web building with production-ready HTML & CSS output.', ar: 'Visual web building with production-ready HTML & CSS output.' }, tags: { en: ['Web','CMS','CSS'], ar: ['Web','CMS','CSS'] }, rgb: [0.35,0.65,1.00], glow: 'var(--color-brand)', proficiency: 75 },
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
    meetingAction: { en: "Prefer a quick call? Let's find a time that works for you.", ar: 'تفضل مكالمة سريعة؟ دعنا نجد وقتًا يناسبك.' },
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
      accent: 'var(--color-brand)'
    },
    
    {
      id: 2,
      visible: true,
      title: { en: 'Orion Enterprise', ar: '\u0623\u0648\u0631\u064a\u0648\u0646 \u0625\u0646\u062a\u0631\u0628\u0631\u0627\u064a\u0632' },
      image: '',
      tags: { en: ['Enterprise', 'Design System', 'Fortune 500', 'Multi-platform'], ar: ['\u0645\u0624\u0633\u0633\u0627\u062a', '\u0646\u0638\u0627\u0645 \u062a\u0635\u0645\u064a\u0645', 'Fortune 500', '\u0645\u062a\u0639\u062f\u062f \u0627\u0644\u0645\u0646\u0635\u0627\u062a'] },
      desc: { en: 'Comprehensive design system and UX overhaul for a Fortune 500 enterprise productivity platform \u2014 serving 50,000+ daily active users across 12 product areas.', ar: '\u0646\u0638\u0627\u0645 \u062a\u0635\u0645\u064a\u0645 \u0634\u0627\u0645\u0644 \u0648\u062a\u062d\u062f\u064a\u062b UX \u0644\u0645\u0646\u0635\u0629 \u0625\u0646\u062a\u0627\u062c\u064a\u0629 \u0644\u0645\u0624\u0633\u0633\u0629 Fortune 500 \u2014 \u062a\u062e\u062f\u0645 \u0623\u0643\u062b\u0631 \u0645\u0646 50,000 \u0645\u0633\u062a\u062e\u062f\u0645 \u0646\u0634\u0637 \u064a\u0648\u0645\u064a\u0627\u064b.' },
      accent: 'var(--color-brand)',
    },
    {
      id: 3,
      visible: true,
      title: { en: 'Lumina AI', ar: '\u0644\u0648\u0645\u064a\u0646\u0627 \u0625\u064a\u0647 \u0622\u064a' },
      image: '',
      tags: { en: ['AI', 'Product Design', 'Zero-to-Launch', 'Content Platform'], ar: ['\u0630\u0643\u0627\u0621 \u0627\u0635\u0637\u0646\u0627\u0639\u064a', '\u062a\u0635\u0645\u064a\u0645 \u0645\u0646\u062a\u062c', '\u0645\u0646 \u0627\u0644\u0635\u0641\u0631', '\u0645\u0646\u0635\u0629 \u0645\u062d\u062a\u0648\u0649'] },
      desc: { en: 'From zero to launch \u2014 product design for an AI-powered content generation platform. Shipped in 8 weeks with a 4.8/5 user satisfaction score.', ar: '\u0645\u0646 \u0627\u0644\u0635\u0641\u0631 \u062d\u062a\u0649 \u0627\u0644\u0625\u0637\u0644\u0627\u0642 \u2014 \u062a\u0635\u0645\u064a\u0645 \u0645\u0646\u062a\u062c \u0644\u0645\u0646\u0635\u0629 \u0625\u0646\u0634\u0627\u0621 \u0645\u062d\u062a\u0648\u0649 \u0628\u0627\u0644\u0630\u0643\u0627\u0621 \u0627\u0644\u0627\u0635\u0637\u0646\u0627\u0639\u064a. \u0623\u0637\u0644\u0642 \u062e\u0644\u0627\u0644 8 \u0623\u0633\u0627\u0628\u064a\u0639 \u0628\u062f\u0631\u062c\u0629 \u0631\u0636\u0627 4.8/5.' },
      accent: 'var(--color-brand)',
    },
    {
      id: 4,
      visible: true,
      title: { en: 'HealthBridge', ar: '\u0647\u064a\u0644\u062b\u0628\u0631\u064a\u062f\u062c' },
      image: '',
      tags: { en: ['Healthcare', 'Mobile App', 'Accessibility', 'Patient UX'], ar: ['\u0631\u0639\u0627\u064a\u0629 \u0635\u062d\u064a\u0629', '\u062a\u0637\u0628\u064a\u0642 \u0645\u062d\u0645\u0648\u0644', '\u0625\u0645\u0643\u0627\u0646\u064a\u0629 \u0627\u0644\u0648\u0635\u0648\u0644', '\u062a\u062c\u0631\u0628\u0629 \u0627\u0644\u0645\u0631\u064a\u0636'] },
      desc: { en: 'Patient-centric UX for a healthcare management app \u2014 accessibility-first design serving diverse user demographics, resulting in 65% reduction in support tickets.', ar: '\u062a\u062c\u0631\u0628\u0629 \u0645\u0633\u062a\u062e\u062f\u0645 \u0645\u062a\u0645\u062d\u0648\u0631\u0629 \u062d\u0648\u0644 \u0627\u0644\u0645\u0631\u064a\u0636 \u0644\u062a\u0637\u0628\u064a\u0642 \u0625\u062f\u0627\u0631\u0629 \u0627\u0644\u0631\u0639\u0627\u064a\u0629 \u0627\u0644\u0635\u062d\u064a\u0629 \u2014 \u062a\u0635\u0645\u064a\u0645 \u0625\u0645\u0643\u0627\u0646\u064a\u0629 \u0627\u0644\u0648\u0635\u0648\u0644 \u0623\u0648\u0644\u0627\u064b \u0645\u0645\u0627 \u0623\u062f\u0649 \u0625\u0644\u0649 \u062a\u0642\u0644\u064a\u0644 \u062a\u0630\u0627\u0643\u0631 \u0627\u0644\u062f\u0639\u0645 65\u066a.' },
      accent: 'var(--color-brand)',
    },
  ],
  caseStudies: [
    {
      id: 1, visible: true,
      title: { en: 'Nexus Analytics', ar: '\u0646\u064a\u0643\u0633\u0633 \u0623\u0646\u0627\u0644\u064a\u062a\u0643\u0633' },
      media: [],
    },
    {
      id: 2, visible: true,
      title: { en: 'Orion Enterprise', ar: '\u0623\u0648\u0631\u064a\u0648\u0646 \u0625\u0646\u062a\u0631\u0628\u0631\u0627\u064a\u0632' },
      media: [],
    },
    {
      id: 3, visible: true,
      title: { en: 'Lumina AI', ar: '\u0644\u0648\u0645\u064a\u0646\u0627 \u0625\u064a\u0647 \u0622\u064a' },
      media: [],
    },
    {
      id: 4, visible: true,
      title: { en: 'HealthBridge', ar: '\u0647\u064a\u0644\u062b\u0628\u0631\u064a\u062f\u062c' },
      media: [],
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
