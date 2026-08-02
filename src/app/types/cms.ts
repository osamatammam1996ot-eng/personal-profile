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
    timeline: Bilingual;
    team: Bilingual;
    industry: Bilingual;
  };
  metrics: Array<{ value: string; label: Bilingual; sub: Bilingual }>;
  problem: {
    narrative: Bilingual;
    painPoints: Array<{ icon: string; title: Bilingual; desc: Bilingual }>;
  };
  research: {
    methods: Bilingual<string[]>;
    insights: Array<{ id: string; quote: Bilingual; author: Bilingual; theme: Bilingual }>;
    findings: Bilingual<string[]>;
  };
  process: {
    steps: Array<{ phase: string; title: Bilingual; duration: Bilingual; desc: Bilingual }>;
    tradeoffs: Array<{ decision: Bilingual; rationale: Bilingual }>;
  };
  solution: {
    screens: Array<{ title: Bilingual; desc: Bilingual; image: string; callouts: Bilingual<string[]>; align: string }>;
  };
  screenshots: Array<{ image: string; caption: Bilingual; tag: Bilingual }>;
  video: {
    url: string;
    youtubeId: string;
    aspectRatio: string;
    title: Bilingual;
    desc: Bilingual;
    duration: string;
  };
  results: {
    metrics: Array<{ value: string; label: Bilingual; sub: Bilingual }>;
    quote: { text: Bilingual; author: Bilingual; role: Bilingual };
  };
  reflection: {
    summary: Bilingual;
    lessons: Bilingual<string[]>;
    next: Bilingual<string[]>;
  };
  settings: {
    showProblem: boolean;
    showResearch: boolean;
    showProcess: boolean;
    showSolution: boolean;
    showMedia: boolean;
    showResults: boolean;
    showReflection: boolean;
  };
  labels: {
    overview: Bilingual;
    problem: Bilingual;
    research: Bilingual;
    process: Bilingual;
    solution: Bilingual;
    media: Bilingual;
    results: Bilingual;
    reflection: Bilingual;
  };
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
  global: CmsGlobal;
  updatedAt: string;
}

// Type aliases
export type CmsDataRaw = CmsData;
export type CmsCaseStudyRaw = CmsCaseStudy;

// Default CMS data
export const DEFAULT_CMS_DATA: any = {
  sectionOrder: ['hero', 'whyHireMe', 'skills', 'portfolio', 'tools', 'contact', 'footer'],
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
    label: { en: 'Osama Tammam\u00a0\u00b7\u00a0Cairo', ar: '\u0623\u0633\u0627\u0645\u0629 \u062a\u0645\u0627\u0645\u00a0\u00b7\u00a0\u0627\u0644\u0642\u0627\u0647\u0631\u0629' },
    headline1: { en: 'Making hard products', ar: '\u062a\u062d\u0648\u064a\u0644 \u0627\u0644\u0645\u0646\u062a\u062c\u0627\u062a \u0627\u0644\u0635\u0639\u0628\u0629' },
    headline2: { en: 'feel inevitable.', ar: '\u0625\u0644\u0649 \u062a\u062c\u0631\u0628\u0629 \u0644\u0627 \u0645\u0641\u0631 \u0645\u0646\u0647\u0627.' },
    roles: { en: ['Senior UX Designer', 'Senior UI Designer', 'AI Product Designer'], ar: ['\u0645\u0635\u0645\u0645 UX \u0623\u0648\u0644', '\u0645\u0635\u0645\u0645 UI \u0623\u0648\u0644', '\u0645\u0635\u0645\u0645 \u0645\u0646\u062a\u062c\u0627\u062a AI'] },
    desc: { en: "Seven years building products for teams that couldn't afford to ship the wrong thing.\nI work closest to the problem when the stakes are highest.", ar: '\u0633\u0628\u0639 \u0633\u0646\u0648\u0627\u062a \u0645\u0646 \u0628\u0646\u0627\u0621 \u0627\u0644\u0645\u0646\u062a\u062c\u0627\u062a \u0644\u0641\u0631\u0642 \u0644\u0645 \u062a\u0643\u0646 \u062a\u062a\u062d\u0645\u0644 \u0627\u0644\u062e\u0637\u0623 \u0641\u064a \u0627\u0644\u0642\u0631\u0627\u0631.\n\u0623\u0643\u0648\u0646 \u0623\u0642\u0631\u0628 \u0644\u0644\u0645\u0634\u0643\u0644\u0629 \u062d\u064a\u0646 \u062a\u0643\u0648\u0646 \u0627\u0644\u0645\u062e\u0627\u0637\u0631 \u0641\u064a \u0623\u0639\u0644\u0627\u0647\u0627.' },
    cta1: { en: 'See my work', ar: '\u0634\u0627\u0647\u062f \u0623\u0639\u0645\u0627\u0644\u064a' },
    cta2: { en: "Let's talk", ar: '\u0644\u0646\u062a\u062d\u062f\u062b' },
  },
  whyHireMe: {
    word1: { en: 'WHY', ar: '\u0644\u0645\u0627\u0630\u0627' },
    word2: { en: 'HIRE', ar: '\u062a\u062e\u062a\u0627\u0631\u0646\u064a' },
    word3: { en: 'ME', ar: '' },
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
    title: { en: 'My Arsenal!', ar: '\u062a\u0631\u0633\u0627\u0646\u062a\u064a!' },
    desc: { en: 'Twelve tools. One cohesive workflow.', ar: '\u0627\u062b\u0646\u0627 \u0639\u0634\u0631\u0629 \u0623\u062f\u0627\u0629. \u0633\u064a\u0631 \u0639\u0645\u0644 \u0645\u062a\u0643\u0627\u0645\u0644.' },
    clickHint: { en: 'Click any card to explore', ar: '\u0627\u0646\u0642\u0631 \u0639\u0644\u0649 \u0623\u064a \u0628\u0637\u0627\u0642\u0629 \u0644\u0644\u0627\u0633\u062a\u0643\u0634\u0627\u0641' },
    proficiency: { en: 'Proficiency', ar: '\u0627\u0644\u0625\u062a\u0642\u0627\u0646' },
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
      heroImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=2000',
      meta: { role: { en: 'Lead UX/UI Designer', ar: 'مصمم UX/UI رئيسي' }, timeline: { en: '6 months', ar: '6 أشهر' }, team: { en: '3 designers, 8 engineers', ar: '3 مصممين، 8 مهندسين' }, industry: { en: 'Technology / SaaS', ar: 'تكنولوجيا / SaaS' } },
      metrics: [
        { value: '-40%', label: { en: 'Cognitive Load Reduction', ar: 'تقليل التحميل المعرفي' }, sub: { en: 'measured via task time', ar: 'تم قياسه عبر وقت المهمة' } },
        { value: '+28%', label: { en: 'User Activation', ar: 'تفعيل المستخدمين' }, sub: { en: 'within first 30 days', ar: 'خلال أول 30 يوم' } },
        { value: '4.6/5', label: { en: 'Satisfaction Score', ar: 'درجة الرضا' }, sub: { en: 'from 500+ users', ar: 'من 500+ مستخدم' } },
      ],
      problem: {
        narrative: { en: 'Nexus Analytics was powerful but overwhelming. Users struggled to find key metrics, leading to high churn rates and support tickets. The goal was to simplify the interface without losing advanced functionality.', ar: 'كانت تحليلات نيكسس قوية ولكنها مربكة. عانى المستخدمون في العثور على المقاييس الرئيسية، مما أدى إلى ارتفاع معدلات التوقف وتذاكر الدعم. كان الهدف هو تبسيط الواجهة دون فقدان الوظائف المتقدمة.' },
        painPoints: [
          { icon: 'target', title: { en: 'Information Overload', ar: 'عبء المعلومات' }, desc: { en: 'Too many data points on the main dashboard', ar: 'العديد من نقاط البيانات في لوحة القيادة' } },
          { icon: 'users', title: { en: 'Steep Learning Curve', ar: 'منحنى تعلم حاد' }, desc: { en: 'New users required 2 weeks of onboarding', ar: 'احتاج المستخدمون الجدد إلى أسبوعين من التدريب' } }
        ]
      },
      research: {
        methods: { en: ['User Interviews', 'Heatmaps', 'A/B Testing'], ar: ['مقابلات المستخدمين', 'الخرائط الحرارية', 'اختبار أ/ب'] },
        insights: [
          { id: '1', quote: { en: "I just need to see my daily sales, I don't care about the rest.", ar: "أحتاج فقط إلى رؤية مبيعاتي اليومية، لا أهتم بالباقي." }, author: { en: 'Marketing Manager', ar: 'مدير التسويق' }, theme: { en: 'Customization', ar: 'التخصيص' } },
          { id: '2', quote: { en: "The charts are too small to read on my laptop.", ar: "المخططات صغيرة جدا للقراءة على حاسوبي." }, author: { en: 'Sales Lead', ar: 'قائد المبيعات' }, theme: { en: 'Accessibility', ar: 'إمكانية الوصول' } }
        ],
        findings: { en: [], ar: [] }
      },
      process: {
        steps: [
          { phase: 'Discovery', title: { en: 'Mapping the Journey', ar: 'رسم الرحلة' }, duration: { en: '2 weeks', ar: 'أسبوعين' }, desc: { en: 'We mapped out the 5 core user personas and their daily tasks.', ar: 'حددنا 5 شخصيات أساسية للمستخدمين ومهامهم اليومية.' } },
          { phase: 'Ideation', title: { en: 'Wireframing', ar: 'رسم الهياكل' }, duration: { en: '3 weeks', ar: '3 أسابيع' }, desc: { en: 'Created low-fidelity wireframes to test structural changes quickly.', ar: 'أنشأنا هياكل سلكية منخفضة الدقة لاختبار التغييرات الهيكلية بسرعة.' } }
        ],
        tradeoffs: [
          { decision: { en: 'Removed the sidebar widget', ar: 'إزالة أداة الشريط الجانبي' }, rationale: { en: 'It took up 20% of screen real estate but was used by only 5% of users.', ar: 'كانت تشغل 20% من مساحة الشاشة ولكن استخدمها 5% فقط.' } }
        ]
      },
      solution: {
        screens: [
          { title: { en: 'Modular Dashboard', ar: 'لوحة قيادة معيارية' }, desc: { en: 'Users can now drag and drop the widgets they care about most.', ar: 'يمكن للمستخدمين الآن سحب وإفلات الأدوات التي يهتمون بها أكثر.' }, image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=2000', callouts: { en: ['Draggable widgets', 'Auto-saving layouts'], ar: ['أدوات قابلة للسحب', 'حفظ التخطيطات تلقائيا'] }, align: 'left' }
        ]
      },
      video: {
        url: 'https://cdn.coverr.co/videos/coverr-a-man-typing-on-a-laptop-5271/1080p.mp4',
        youtubeId: '',
        aspectRatio: '16:9',
        title: { en: 'Dashboard Walkthrough', ar: 'جولة في لوحة القيادة' },
        desc: { en: 'A quick look at the new customizable features.', ar: 'نظرة سريعة على الميزات الجديدة القابلة للتخصيص.' },
        duration: '1:30'
      },
      screenshots: [
        { image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1000', caption: { en: 'Analytics View', ar: 'عرض التحليلات' }, tag: { en: 'Web', ar: 'ويب' } },
        { image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=1000', caption: { en: 'Mobile App', ar: 'تطبيق الهاتف' }, tag: { en: 'iOS', ar: 'نظام iOS' } }
      ],
      results: {
        metrics: [
          { value: '+40%', label: { en: 'Engagement', ar: 'التفاعل' }, sub: { en: 'MoM Growth', ar: 'نمو شهري' } }
        ],
        quote: { text: { en: "The new dashboard changed how our team works. We save hours every week.", ar: "غيرت اللوحة الجديدة طريقة عمل فريقنا. نوفر ساعات كل أسبوع." }, author: { en: 'Sarah J.', ar: 'سارة ج.' }, role: { en: 'VP of Operations', ar: 'نائب الرئيس للعمليات' } }
      },
      reflection: {
        summary: { en: 'Looking back, I would have involved engineering earlier to validate the modular drag-and-drop system, which took longer than expected to build.', ar: 'بالنظر إلى الوراء، كنت سأشرك الهندسة في وقت مبكر للتحقق من صحة النظام المعياري.' },
        lessons: { en: ['Test complex interactions early', 'Don\'t assume user technical literacy'], ar: ['اختبر التفاعلات المعقدة مبكرا', 'لا تفترض معرفة المستخدم التقنية'] },
        next: { en: ['Implement dark mode', 'Add custom charting options'], ar: ['تنفيذ الوضع الداكن', 'إضافة خيارات تخطيط مخصصة'] }
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
      }
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
  ],
  global: {
    seoTitle: 'Osama Tammam \u2014 Senior UX/UI & AI Product Designer',
    seoDescription: 'Seven years building products for teams that couldn\u2019t afford to ship the wrong thing. Senior UX/UI Designer & AI Product Designer based in Cairo, Egypt.',
    ownerName: 'Osama Tammam',
    ownerEmail: 'osamatammam1996ot.eng@gmail.com',
    footerTagline: 'Making hard products feel inevitable.',
  },
  updatedAt: new Date().toISOString(),
};
