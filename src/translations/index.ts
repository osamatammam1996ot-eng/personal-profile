export type Lang = 'en' | 'ar';

// Fixed interface copy. CMS content (cmsData) wins wherever it exists;
// the hero/whyHireMe/tools/contact/footer entries are its built-in fallbacks.
const en = {
  nav: {
    home: 'Home',
    whyMe: 'Why Me',
    skills: 'Skills',
    work: 'Work',
    recommendations: 'Recommendations',
    tools: 'Tools',
    contact: 'Contact',
    brand: 'Osama Tammam',
    langLabel: 'EN',
    switchLang: 'التبديل إلى العربية',
    openMenu: 'Open menu',
    closeMenu: 'Close menu',
    lightMode: 'Switch to light mode',
    darkMode: 'Switch to dark mode',
  },

  hero: {
    label: 'Osama Tammam · Cairo',
    headline1: 'Making hard products',
    headline2: 'feel inevitable.',
    roles: ['Senior UX Designer', 'Senior UI Designer', 'AI Product Designer'],
    desc: "Seven years building products for teams that couldn't afford to ship the wrong thing.",
    cta1: 'See my work',
    cta2: "Let's talk",
    scroll: 'Scroll',
    playAnimation: 'Play animation',
    pauseAnimation: 'Pause animation',
  },

  whyHireMe: {
    word1: 'Why',
    word2: 'Hire',
    word3: 'Me',
    cards: [
      {
        title: 'Systems Thinking',
        desc: 'Scalable design systems and component libraries that maintain consistency as your product grows across teams.',
      },
      {
        title: 'AI-Driven Process',
        desc: 'Leveraging cutting-edge AI tools to accelerate ideation, validate designs, and surface insights that manual research misses.',
      },
      {
        title: 'Enterprise-Grade Execution',
        desc: 'From complex SaaS dashboards to multi-platform enterprise tools — polished, production-ready, every time.',
      },
      {
        title: 'Conversion-Focused UX',
        desc: 'Every decision rooted in psychology and business metrics — crafting flows that turn visitors into loyal users.',
      },
    ],
  },

  skills: {
    label: 'Craft',
    intro: 'Intro',
    scrollHint: 'Scroll to explore',
    heading1: 'Seven years.',
    heading2: 'Three disciplines.',
    desc: "Not a list of tools I've opened once. This is how I actually spend my time — the things I can lead, the methods I reach for first, the work I take responsibility for end-to-end.",
    disciplines: [
      {
        title: 'Research &\nUnderstanding',
        tagline: "I start by figuring out what question I'm actually trying to answer.",
        tags: ['User Interviews', 'Usability Testing', 'Journey Mapping', 'Heuristic Evaluation', 'Affinity Diagrams', 'Research Synthesis', 'Stakeholder Alignment', 'Competitive Analysis'],
      },
      {
        title: 'Design &\nSystems',
        tagline: "I build for the designer who comes after me, not just the sprint I'm in.",
        tags: ['Design Tokens', 'Component Libraries', 'Dark / Light Theming', 'Figma Governance', 'Responsive Grids', 'Multi-team Systems', 'Documentation', 'Accessibility'],
      },
      {
        title: 'Prototyping\n& Delivery',
        tagline: "A prototype I can't hand to a developer isn't done.",
        tags: ['Advanced Figma', 'Framer', 'Micro-interactions', 'Developer Handoff', 'Motion Design', 'AI-Augmented Workflow', 'Midjourney', 'ChatGPT Integration'],
      },
    ],
  },

  portfolio: {
    title: 'Selected Work',
    desc: 'A selection of apps, platforms and dashboards I designed end to end.',
    request: 'Request full portfolio',
    fallbackDesc: (n: number) => `Case study ${n} description`,
  },

  caseStudy: {
    close: 'Close case study',
    prev: 'Previous media',
    next: 'Next media',
  },

  recommendations: {
    title: 'What People Say',
    sub: "A few words from the people I've built, solved, and collaborated with.",
    keep: 'Keep scrolling',
    add: 'Add yours',
  },

  feedback: {
    title: 'Add your feedback',
    sub: "Worked with Osama? Share a few words. He reads every one before it's published.",
    name: 'Your name',
    namePh: 'e.g. Sarah Ahmed',
    comment: 'Your feedback',
    commentPh: 'What was it like working together?',
    cancel: 'Cancel',
    send: 'Send',
    sending: 'Sending…',
    close: 'Close',
    thanks: (n: string) => `Thank you, ${n}!`,
    sent: "Your feedback reached Osama. Once he approves it, it'll be published here.",
    invalid: 'Please add your name and at least a sentence (10+ characters).',
    rate_limited: "You've sent a few already. Please try again in an hour.",
    unavailable: "Couldn't send right now. Please try again later.",
  },

  tools: {
    title: 'My Arsenal!',
    desc: 'Twelve tools. One cohesive workflow.',
    clickHint: 'Click any card to explore',
    prevTool: 'Previous tool',
    nextTool: 'Next tool',
  },

  contact: {
    availability: 'Available for new projects',
    headline: ['Got a problem', 'worth solving?', "Let's talk about it."],
    body: "I help product and engineering teams turn complex problems into intuitive digital experiences. Whether you have a clear roadmap or just an idea, I'd love to hear about it and explore how we can build something impactful together.",
    meetingAction: "Prefer a quick call? Let's find a time that works for you.",
    emailLabel: 'EMAIL ME',
    copyEmail: 'Copy email address',
    copied: 'Copied!',
    note: ['I typically respond within 24 hours.', 'Looking forward to connecting!'],
  },

  footer: {
    copyright: '© 2026 Osama Tammam. All rights reserved.',
    links: ['Home', 'Work', 'About', 'Contact'],
  },

  errorBoundary: {
    title: "Something didn't load right.",
    body: 'A reload usually fixes it.',
    reload: 'Reload',
  },
};

const ar: typeof en = {
  nav: {
    home: 'الرئيسية',
    whyMe: 'لماذا أنا',
    skills: 'المهارات',
    work: 'الأعمال',
    recommendations: 'التوصيات',
    tools: 'الأدوات',
    contact: 'تواصل',
    brand: 'أسامة تمام',
    langLabel: 'عربي',
    switchLang: 'Switch to English',
    openMenu: 'فتح القائمة',
    closeMenu: 'إغلاق القائمة',
    lightMode: 'التبديل إلى الوضع الفاتح',
    darkMode: 'التبديل إلى الوضع الداكن',
  },

  hero: {
    label: 'أسامة تمام · القاهرة',
    headline1: 'جعل المنتجات الصعبة',
    headline2: 'تبدو حتمية.',
    roles: ['مصمم UX كبير', 'مصمم UI كبير', 'مصمم منتجات AI'],
    desc: 'سبع سنوات لبناء منتجات للفِرق التي لم تستطع تحمل تكاليف شحن الشيء الخاطئ.',
    cta1: 'شاهد عملي',
    cta2: 'هيا نتحدث',
    scroll: 'مرر',
    playAnimation: 'تشغيل الحركة',
    pauseAnimation: 'إيقاف الحركة',
  },

  whyHireMe: {
    word1: 'لماذا',
    word2: 'توظيف',
    word3: 'أنا',
    cards: [
      {
        title: 'التفكير النظامي',
        desc: 'أنظمة تصميم قابلة للتوسع ومكتبات مكونات تحافظ على الاتساق مع نمو المنتج عبر الفِرق.',
      },
      {
        title: 'عملية مدفوعة بالذكاء الاصطناعي',
        desc: 'الاستفادة من أحدث أدوات الذكاء الاصطناعي لتسريع الأفكار والتحقق من التصاميم والحصول على رؤى تفتقدها الأبحاث اليدوية.',
      },
      {
        title: 'التنفيذ على مستوى المؤسسة',
        desc: 'من لوحات معلومات SaaS المعقدة إلى الأدوات متعددة المنصات للمؤسسات — مصقولة وجاهزة للإنتاج في كل مرة.',
      },
      {
        title: 'UX المركزة على التحويل',
        desc: 'كل قرار متجذر في علم النفس والمقاييس التجارية — حرفة تحويل الزوار إلى مستخدمين مخلصين.',
      },
    ],
  },

  skills: {
    label: '\u0627\u0644\u062d\u0631\u0641\u0629',
    intro: 'مقدمة',
    scrollHint: 'مرّر للاستكشاف',
    heading1: '\u0633\u0628\u0639 \u0633\u0646\u0648\u0627\u062a.',
    heading2: '\u062b\u0644\u0627\u062b\u0629 \u062a\u062e\u0635\u0635\u0627\u062a.',
    desc: '\u0644\u064a\u0633\u062a \u0642\u0627\u0626\u0645\u0629 \u0628\u0623\u062f\u0648\u0627\u062a \u0641\u062a\u062d\u062a\u0647\u0627 \u0645\u0631\u0629 \u0648\u0627\u062d\u062f\u0629. \u0647\u0630\u0647 \u0647\u064a \u0643\u064a\u0641\u064a\u0629 \u0642\u0636\u0627\u0621 \u0648\u0642\u062a\u064a \u0641\u0639\u0644\u064a\u0627\u064b \u2014 \u0645\u0627 \u0623\u0642\u0648\u062f\u0647\u060c \u0648\u0627\u0644\u0623\u0633\u0627\u0644\u064a\u0628 \u0627\u0644\u062a\u064a \u0623\u0628\u062f\u0623 \u0628\u0647\u0627\u060c \u0648\u0627\u0644\u0639\u0645\u0644 \u0627\u0644\u0630\u064a \u0623\u062a\u062d\u0645\u0644 \u0645\u0633\u0624\u0648\u0644\u064a\u062a\u0647 \u0645\u0646 \u0627\u0644\u0628\u062f\u0627\u064a\u0629 \u0644\u0644\u0646\u0647\u0627\u064a\u0629.',
    disciplines: [
      {
        title: '\u0627\u0644\u0628\u062d\u062b\n\u0648\u0627\u0644\u0641\u0647\u0645',
        tagline: '\u0623\u0628\u062f\u0623 \u0628\u062a\u062d\u062f\u064a\u062f \u0627\u0644\u0633\u0624\u0627\u0644 \u0627\u0644\u0630\u064a \u0623\u0633\u0639\u0649 \u062d\u0642\u0627\u064b \u0644\u0644\u0625\u062c\u0627\u0628\u0629 \u0639\u0646\u0647.',
        tags: ['\u0645\u0642\u0627\u0628\u0644\u0627\u062a \u0627\u0644\u0645\u0633\u062a\u062e\u062f\u0645\u064a\u0646', '\u0627\u062e\u062a\u0628\u0627\u0631 \u0642\u0627\u0628\u0644\u064a\u0629 \u0627\u0644\u0627\u0633\u062a\u062e\u062f\u0627\u0645', '\u0631\u0633\u0645 \u062e\u0631\u0627\u0626\u0637 \u0627\u0644\u0631\u062d\u0644\u0629', '\u0627\u0644\u062a\u0642\u064a\u064a\u0645 \u0627\u0644\u0627\u0633\u062a\u0643\u0634\u0627\u0641\u064a', '\u0645\u062e\u0637\u0637\u0627\u062a \u0627\u0644\u062a\u0642\u0627\u0631\u0628', '\u062a\u0631\u0643\u064a\u0628 \u0627\u0644\u0628\u062d\u0648\u062b', '\u0645\u0648\u0627\u0621\u0645\u0629 \u0623\u0635\u062d\u0627\u0628 \u0627\u0644\u0645\u0635\u0644\u062d\u0629', '\u0627\u0644\u062a\u062d\u0644\u064a\u0644 \u0627\u0644\u062a\u0646\u0627\u0641\u0633\u064a'],
      },
      {
        title: '\u0627\u0644\u062a\u0635\u0645\u064a\u0645\n\u0648\u0627\u0644\u0623\u0646\u0638\u0645\u0629',
        tagline: '\u0623\u0628\u0646\u064a \u0644\u0644\u0645\u0635\u0645\u0645 \u0627\u0644\u0630\u064a \u0633\u064a\u0623\u062a\u064a \u0628\u0639\u062f\u064a\u060c \u0644\u0627 \u0641\u0642\u0637 \u0644\u0644\u0633\u0628\u0631\u064a\u0646\u062a \u0627\u0644\u062d\u0627\u0644\u064a.',
        tags: ['\u0631\u0645\u0648\u0632 \u0627\u0644\u062a\u0635\u0645\u064a\u0645', '\u0645\u0643\u062a\u0628\u0627\u062a \u0627\u0644\u0645\u0643\u0648\u0646\u0627\u062a', '\u0627\u0644\u0633\u0645\u0627\u062a \u0627\u0644\u0641\u0627\u062a\u062d\u0629 \u0648\u0627\u0644\u062f\u0627\u0643\u0646\u0629', '\u062d\u0648\u0643\u0645\u0629 Figma', '\u0627\u0644\u0634\u0628\u0643\u0627\u062a \u0627\u0644\u0645\u062a\u062c\u0627\u0648\u0628\u0629', '\u0623\u0646\u0638\u0645\u0629 \u0645\u062a\u0639\u062f\u062f\u0629 \u0627\u0644\u0641\u0631\u0642', '\u0627\u0644\u062a\u0648\u062b\u064a\u0642', '\u0625\u0645\u0643\u0627\u0646\u064a\u0629 \u0627\u0644\u0648\u0635\u0648\u0644'],
      },
      {
        title: '\u0627\u0644\u0646\u0645\u0627\u0630\u062c \u0627\u0644\u0623\u0648\u0644\u064a\u0629\n\u0648\u0627\u0644\u062a\u0633\u0644\u064a\u0645',
        tagline: '\u0627\u0644\u0646\u0645\u0648\u0630\u062c \u0627\u0644\u0630\u064a \u0644\u0627 \u0623\u0633\u062a\u0637\u064a\u0639 \u062a\u0633\u0644\u064a\u0645\u0647 \u0644\u0644\u0645\u0637\u0648\u0651\u0631 \u0644\u064a\u0633 \u062c\u0627\u0647\u0632\u0627\u064b \u0628\u0639\u062f.',
        tags: ['Figma \u0627\u0644\u0645\u062a\u0642\u062f\u0645\u0629', 'Framer', '\u0627\u0644\u062a\u0641\u0627\u0639\u0644\u0627\u062a \u0627\u0644\u062f\u0642\u064a\u0642\u0629', '\u062a\u0633\u0644\u064a\u0645 \u0627\u0644\u0645\u0637\u0648\u0651\u0631\u064a\u0646', '\u062a\u0635\u0645\u064a\u0645 \u0627\u0644\u062d\u0631\u0643\u0629', '\u0633\u064a\u0631 \u0639\u0645\u0644 \u0628\u0640 AI', 'Midjourney', '\u062a\u0643\u0627\u0645\u0644 ChatGPT'],
      },
    ],
  },

  portfolio: {
    title: 'الأعمال المختارة',
    desc: 'مجموعة من التطبيقات والمنصات ولوحات التحكم التي صممتها من البداية للنهاية.',
    request: 'طلب معرض الأعمال الكامل',
    fallbackDesc: (n: number) => `وصف دراسة الحالة ${n}`,
  },

  caseStudy: {
    close: 'إغلاق دراسة الحالة',
    prev: 'الوسائط السابقة',
    next: 'الوسائط التالية',
  },

  recommendations: {
    title: 'ماذا يقولون',
    sub: 'بعض الكلمات ممن عملت، وبنيت، وتعاونت معهم.',
    keep: 'استمر في التمرير',
    add: 'أضف رأيك',
  },

  feedback: {
    title: 'أضف رأيك',
    sub: 'عملت مع أسامة؟ شاركنا بكلمات قليلة. يقرأ كل رأي قبل نشره.',
    name: 'اسمك',
    namePh: 'مثال: سارة أحمد',
    comment: 'رأيك',
    commentPh: 'كيف كانت تجربة العمل معًا؟',
    cancel: 'إلغاء',
    send: 'إرسال',
    sending: 'جارٍ الإرسال…',
    close: 'إغلاق',
    thanks: (n: string) => `شكرًا، ${n}!`,
    sent: 'وصل رأيك إلى أسامة. سيُنشر هنا بعد موافقته.',
    invalid: 'يرجى كتابة اسمك وجملة واحدة على الأقل (10 أحرف أو أكثر).',
    rate_limited: 'أرسلت عدة آراء بالفعل. حاول مرة أخرى بعد ساعة.',
    unavailable: 'تعذّر الإرسال الآن. حاول لاحقًا.',
  },

  tools: {
    title: 'ترسانتي!',
    desc: 'اثنا عشر أداة. سير عمل متماسك واحد.',
    clickHint: 'انقر على أي بطاقة للاستكشاف',
    prevTool: 'الأداة السابقة',
    nextTool: 'الأداة التالية',
  },

  contact: {
    availability: 'متاح لمشاريع جديدة',
    headline: ['هل لديك مشكلة تستحق الحل؟ دعنا نتحدث.'],
    body: 'أنا أساعد فرق المنتج والهندسة على تحويل المشاكل المعقدة إلى تجارب رقمية بديهية.',
    meetingAction: 'تفضل مكالمة سريعة؟ دعنا نجد وقتًا يناسبك.',
    emailLabel: 'البريد الإلكتروني',
    copyEmail: 'نسخ البريد الإلكتروني',
    copied: 'تم النسخ!',
    note: ['أرد عادة خلال 24 ساعة. أتطلع للتواصل معك!'],
  },

  footer: {
    copyright: '© 2026 أسامة تمام. جميع الحقوق محفوظة.',
    links: ['الرئيسية', 'الأعمال', 'عني', 'تواصل'],
  },

  errorBoundary: {
    title: 'حدث خطأ أثناء التحميل.',
    body: 'إعادة تحميل الصفحة تحل المشكلة عادةً.',
    reload: 'إعادة التحميل',
  },
};

export const translations: Record<Lang, typeof en> = { en, ar };

export type Translations = typeof en;
