export interface CaseStudyData {
  title: string;
  tagline: string;
  meta: { role: string; timeline: string; team: string; industry: string };
  metrics: { value: string; label: string }[];
  problem: { narrative: string; painPoints: { icon: string; title: string; desc: string }[] };
  research: {
    methods: string[];
    insights: { id: string; quote: string; author: string; theme: string }[];
    findings: string[];
  };
  process: {
    steps: { phase: string; title: string; duration: string; desc: string }[];
    tradeoffs: { decision: string; rationale: string }[];
  };
  solution: { screens: { title: string; desc: string; image: string; callouts: string[]; align: string }[] };
  screenshots: { image: string; caption: string; tag: string }[];
  video: { youtubeId: string; title: string; desc: string; duration: string };
  results: { metrics: { value: string; label: string; sub: string }[]; quote: { text: string; author: string; role: string } };
  reflection: { summary: string; lessons: string[]; next: string[] };
}

const IMG_DATA_VIZ = `https://images.unsplash.com/photo-1770012977129-19f856a1f935?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYXRhJTIwdmlzdWFsaXphdGlvbiUyMGludGVyZmFjZSUyMGRhcmslMjBzY3JlZW58ZW58MXx8fHwxNzc0NjM0OTYxfDA&ixlib=rb-4.1.0&q=80&w=1080`;
const IMG_DESIGN_SYS = `https://images.unsplash.com/photo-1720962158789-9389a4f399da?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9kdWN0JTIwZGVzaWduJTIwc3lzdGVtJTIwY29tcG9uZW50cyUyMGRhcmslMjBVSXxlbnwxfHx8fDE3NzQ2MzQ5NjN8MA&ixlib=rb-4.1.0&q=80&w=1080`;
const IMG_DARK_WEB = `https://images.unsplash.com/photo-1702479744062-1880502275b1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaW5pbWFsJTIwZGFyayUyMHdlYiUyMGFwcGxpY2F0aW9uJTIwaW50ZXJmYWNlJTIwc2NyZWVufGVufDF8fHx8MTc3NDYzNDk2OXww&ixlib=rb-4.1.0&q=80&w=1080`;

// New screenshot images
const IMG_SS1 = `https://images.unsplash.com/photo-1636777530577-a075553f4520?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYXJrJTIwVUklMjBtb2JpbGUlMjBhcHAlMjBzY3JlZW4lMjBtb2NrdXAlMjBkZXNpZ258ZW58MXx8fHwxNzc0NjM3OTYwfDA&ixlib=rb-4.1.0&q=80&w=1080`;
const IMG_SS2 = `https://images.unsplash.com/photo-1610736311554-fc17d5c43de8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbmFseXRpY3MlMjBkYXNoYm9hcmQlMjBkYXJrJTIwbW9uaXRvciUyMGRlc2t0b3B8ZW58MXx8fHwxNzc0NjM3OTYwfDA&ixlib=rb-4.1.0&q=80&w=1080`;
const IMG_SS3 = `https://images.unsplash.com/photo-1622050756792-5b1180bbb873?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9kdWN0JTIwVUklMjBzY3JlZW5zaG90JTIwZGFyayUyMGludGVyZmFjZSUyMGxhcHRvcHxlbnwxfHx8fDE3NzQ2Mzc5NjF8MA&ixlib=rb-4.1.0&q=80&w=1080`;
const IMG_SS4 = `https://images.unsplash.com/photo-1663153203126-08bbadc178ad?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2JpbGUlMjBhcHAlMjBkYXJrJTIwc2NyZWVuJTIwaGVhbHRoY2FyZSUyMGRlc2lnbnxlbnwxfHx8fDE3NzQ2Mzc5NjF8MA&ixlib=rb-4.1.0&q=80&w=1080`;
const IMG_SS5 = `https://images.unsplash.com/photo-1593358185687-129b6eedb3aa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1c2VyJTIwaW50ZXJmYWNlJTIwZGVzaWduJTIwc3lzdGVtJTIwY29tcG9uZW50cyUyMGdyaWR8ZW58MXx8fHwxNzc0NjM3OTYyfDA&ixlib=rb-4.1.0&q=80&w=1080`;

export const CASE_DATA: Record<number, CaseStudyData> = {
  1: {
    title: `Nexus Analytics Platform`,
    tagline: `Redesigning how enterprise data teams make decisions — cutting time-to-insight by 35%.`,
    meta: {
      role: `Lead Product Designer`,
      timeline: `8 Months`,
      team: `3 Designers · 6 Engineers · 2 PMs`,
      industry: `B2B SaaS / Analytics`,
    },
    metrics: [
      { value: `+22%`, label: `Feature Adoption` },
      { value: `−35%`, label: `Task Completion Time` },
      { value: `+18pts`, label: `NPS Score Lift` },
      { value: `−40%`, label: `Support Tickets` },
    ],
    problem: {
      narrative: `Data analysts at Fortune 500 companies were spending over 60% of their time navigating tool-switching friction, rebuilding context after each session, and waiting for reports to load. Nexus had the raw data — but the interface was a graveyard of tables and modals that made insight impossible at speed.`,
      painPoints: [
        { icon: `⊘`, title: `Cognitive Overload`, desc: `Dashboards with 40+ metrics competing for attention simultaneously.` },
        { icon: `◷`, title: `Context Collapse`, desc: `No persistent memory between sessions — users restarted every workflow.` },
        { icon: `↯`, title: `Collaboration Dead Ends`, desc: `Insights lived in silos. Sharing required manual export chains.` },
        { icon: `▵`, title: `Trust Deficit`, desc: `Inconsistent data formatting eroded confidence in the platform.` },
      ],
    },
    research: {
      methods: [`In-depth Interviews`, `Contextual Inquiry`, `Usability Testing`, `Analytics Heatmaps`, `Diary Studies`],
      insights: [
        { id: `I-01`, quote: `"I know the answer is in here somewhere — I just can't find it before the meeting starts."`, author: `Senior Data Analyst, Finance Co.`, theme: `Discovery Friction` },
        { id: `I-02`, quote: `"Every Monday I rebuild the same 3 views. It's 45 minutes I'll never get back."`, author: `BI Manager, Retail Enterprise`, theme: `Repetitive Workflows` },
        { id: `I-03`, quote: `"When numbers look wrong, I stop trusting everything else on the page."`, author: `VP Analytics, SaaS Scale-up`, theme: `Data Trust` },
      ],
      findings: [
        `Users scan for exceptions, not summaries — the info hierarchy was inverted.`,
        `78% of sessions started with the same 3 views, yet none were saved by default.`,
        `Mobile usage during exec meetings was unsupported despite 34% of logins.`,
      ],
    },
    process: {
      steps: [
        { phase: `01`, title: `Discover`, duration: `6 wks`, desc: `Embedded with 12 analyst teams. Shadowed real workflows. Mapped every friction point across 8 user archetypes.` },
        { phase: `02`, title: `Define`, duration: `2 wks`, desc: `Synthesized 340+ interview notes into a Jobs-To-Be-Done framework. Prioritized 3 core problem spaces with measurable success criteria.` },
        { phase: `03`, title: `Diverge`, duration: `3 wks`, desc: `Generated 60+ concepts across 4 design sprints. Tested lo-fi prototypes with 18 users. Killed 3 directions we loved based on evidence.` },
        { phase: `04`, title: `Converge`, duration: `4 wks`, desc: `Narrowed to 1 direction. Built hi-fi prototype. Ran 2 rounds of moderated testing. Iterated on 22 specific pain points before handoff.` },
        { phase: `05`, title: `Deliver`, duration: `8 wks`, desc: `Partnered with engineering daily. Shipped in 3 progressive releases. Monitored adoption weekly with a live metrics dashboard.` },
      ],
      tradeoffs: [
        { decision: `Simplified the dashboard from 40 widgets to 8 prioritized signals`, rationale: `Power users resisted, but task completion improved 35% — we shipped a "power mode" toggle as a bridge.` },
        { decision: `Dropped offline mode from v1 scope`, rationale: `Reduced engineering complexity by 6 weeks while covering 98% of real use cases — deferred to Q3.` },
      ],
    },
    solution: {
      screens: [
        { title: `Intelligent Home Dashboard`, desc: `A context-aware entry point that surfaces the 3 most relevant datasets based on your role, time of day, and recent activity — eliminating the blank-canvas problem.`, image: IMG_DATA_VIZ, callouts: [`Persistent context sidebar`, `Role-adaptive layout`, `Exception-first hierarchy`], align: `left` },
        { title: `Saved View System`, desc: `One-click view persistence with collaborative annotations. Teams can now share exact mental models, not just raw data — turning individual insight into organizational memory.`, image: IMG_DESIGN_SYS, callouts: [`Snapshot versioning`, `Inline team comments`, `Shared ownership model`], align: `right` },
        { title: `Data Trust Layer`, desc: `A system-wide consistency audit surfaced on every metric — showing data source, freshness, and confidence level inline. Users stopped questioning the data and started using it.`, image: IMG_DARK_WEB, callouts: [`Source provenance badge`, `Freshness indicator`, `Confidence scoring`], align: `left` },
      ],
    },
    screenshots: [
      { image: IMG_SS2, caption: `Home dashboard — context-aware, role-adaptive entry point`, tag: `Dashboard` },
      { image: IMG_SS1, caption: `Mobile view — executive summary during on-the-go meetings`, tag: `Mobile` },
      { image: IMG_DATA_VIZ, caption: `Real-time data visualization with exception-first hierarchy`, tag: `Data Viz` },
      { image: IMG_SS3, caption: `Saved views panel — one-click workspace persistence`, tag: `Views` },
      { image: IMG_DESIGN_SYS, caption: `Collaboration layer — inline annotations and shared ownership`, tag: `Collab` },
      { image: IMG_DARK_WEB, caption: `Data trust indicators — source provenance and freshness`, tag: `Trust` },
    ],
    video: {
      youtubeId: `O6_CQKGWWIQ`,
      title: `Product Demo — Nexus Analytics Platform`,
      desc: `A walkthrough of the redesigned analytics experience, showing the context-aware dashboard, saved view system, and the data trust layer in action with a real enterprise dataset.`,
      duration: `4:32`,
    },
    results: {
      metrics: [
        { value: `+22%`, label: `Feature adoption`, sub: `3 months post-launch` },
        { value: `−35%`, label: `Task time reduction`, sub: `Measured vs. baseline` },
        { value: `+18pts`, label: `NPS improvement`, sub: `From 31 → 49` },
        { value: `−40%`, label: `Support ticket volume`, sub: `Navigation-related issues` },
        { value: `4.7×`, label: `Saved views created`, sub: `vs. previous period` },
        { value: `93%`, label: `User retention`, sub: `90-day cohort` },
      ],
      quote: { text: `This is the first time the platform actually feels like it was built for how we work — not how someone thought we work.`, author: `Sarah K.`, role: `Director of Analytics, Fortune 500 Retail` },
    },
    reflection: {
      summary: `The most important shift in this project wasn't a design decision — it was learning to make the business case for slowing down. Early pressure to ship features fast was redirected into a 6-week research sprint that changed the entire product direction. That investment returned a 35% efficiency gain and measurably improved trust in the platform.`,
      lessons: [
        `Quantifying research ROI upfront unlocks stakeholder patience for discovery.`,
        `Power users and new users often need the same feature in opposite configurations — design for both with progressive disclosure.`,
        `Data trust is an emotional, not just technical, problem. Designing for confidence requires naming uncertainty explicitly.`,
      ],
      next: [
        `AI-powered anomaly detection surfaced inline with plain-language explanations`,
        `Mobile-first executive view for on-the-go decision-making`,
        `Cross-workspace data federation for multi-product enterprises`,
      ],
    },
  },

  2: {
    title: `Orion Enterprise Suite`,
    tagline: `Building a unified design system that reduced engineering time by 40% and aligned 6 product teams.`,
    meta: {
      role: `Principal Product Designer`,
      timeline: `10 Months`,
      team: `4 Designers · 12 Engineers · 3 PMs`,
      industry: `Enterprise SaaS`,
    },
    metrics: [
      { value: `−40%`, label: `Engineering Time` },
      { value: `+31%`, label: `Design Velocity` },
      { value: `6 Teams`, label: `Unified` },
      { value: `220+`, label: `Components Shipped` },
    ],
    problem: {
      narrative: `Six product teams building on the same platform had diverged into six different visual languages. Every team reinvented the same button, the same modal, the same form — burning thousands of engineering hours and creating a fragmented experience that confused enterprise customers.`,
      painPoints: [
        { icon: `⊘`, title: `Visual Fragmentation`, desc: `Over 80 button variants existed across 6 products with no shared foundation.` },
        { icon: `◷`, title: `Duplicated Build Cost`, desc: `Engineering estimated 40% of UI time spent rebuilding existing patterns.` },
        { icon: `↯`, title: `Broken Cross-sell`, desc: `Users navigating between products faced jarring context switches.` },
        { icon: `▵`, title: `Brand Erosion`, desc: `No single team owned the visual identity — so no one did.` },
      ],
    },
    research: {
      methods: [`Design Audit`, `Stakeholder Interviews`, `Component Inventory`, `Token Mapping`, `Engineering Surveys`],
      insights: [
        { id: `I-01`, quote: `"We shipped the same dropdown component 4 times last quarter. None of them work the same way."`, author: `Senior Engineer, Platform Team`, theme: `Build Duplication` },
        { id: `I-02`, quote: `"I can't tell which product I'm in anymore. The UI keeps shifting on me."`, author: `Enterprise Customer, Finance`, theme: `User Disorientation` },
        { id: `I-03`, quote: `"Design reviews take 3x longer because we're arguing about which version is canonical."`, author: `Product Manager, Growth`, theme: `Decision Friction` },
      ],
      findings: [
        `80+ button variants identified across 6 products in a 3-day component audit.`,
        `Engineering spent 38% of sprint capacity on UI components with no shared foundation.`,
        `Cross-product navigation NPS was 22 points lower than single-product NPS.`,
      ],
    },
    process: {
      steps: [
        { phase: `01`, title: `Audit`, duration: `4 wks`, desc: `Inventoried every component across 6 products. Built a visual map of divergence. Quantified duplication cost in engineering hours.` },
        { phase: `02`, title: `Foundation`, duration: `6 wks`, desc: `Established token architecture, typography scale, color system, and spacing grid. Socialized with all 6 teams for buy-in.` },
        { phase: `03`, title: `Core System`, duration: `10 wks`, desc: `Built 60 foundational components. Shipped in 3 tiers: primitives → patterns → templates.` },
        { phase: `04`, title: `Migration`, duration: `8 wks`, desc: `Worked with each team to migrate existing UIs. Created migration guides and office hours. Tracked adoption weekly.` },
        { phase: `05`, title: `Governance`, duration: `4 wks`, desc: `Established contribution model, change management process, and quarterly design system reviews.` },
      ],
      tradeoffs: [
        { decision: `Chose token-based theming over hard-coded values from day one`, rationale: `Added 3 weeks of setup cost but enabled white-labeling for enterprise customers — unlocked a new revenue tier.` },
        { decision: `Maintained backward compatibility for 6 months`, rationale: `Slowed adoption of new patterns but prevented team disruption during critical shipping periods.` },
      ],
    },
    solution: {
      screens: [
        { title: `Token Architecture`, desc: `A semantic token system with 3 tiers — global, alias, and component — enabling theming, white-labeling, and consistent dark/light mode across all products.`, image: IMG_DESIGN_SYS, callouts: [`3-tier token hierarchy`, `Theme-ready architecture`, `Figma + code parity`], align: `left` },
        { title: `Component Library`, desc: `220+ components built with accessibility baked in, comprehensive documentation, and live interactive examples — reducing onboarding time from weeks to days.`, image: IMG_DATA_VIZ, callouts: [`WCAG 2.1 AA compliant`, `Interactive Storybook docs`, `Automated visual regression`], align: `right` },
        { title: `Cross-Product Navigation`, desc: `A unified shell layer that persists brand identity across product boundaries — users now move between modules without losing spatial orientation.`, image: IMG_DARK_WEB, callouts: [`Persistent global shell`, `Context-aware sidebar`, `Breadcrumb continuity`], align: `left` },
      ],
    },
    screenshots: [
      { image: IMG_SS5, caption: `Component library overview — 220+ production-ready components`, tag: `Library` },
      { image: IMG_DESIGN_SYS, caption: `Token architecture — semantic 3-tier hierarchy in Figma`, tag: `Tokens` },
      { image: IMG_SS2, caption: `Unified shell — cross-product navigation layer`, tag: `Navigation` },
      { image: IMG_SS3, caption: `Dark mode — full token-driven theme switching`, tag: `Theming` },
      { image: IMG_DATA_VIZ, caption: `Storybook integration — live interactive documentation`, tag: `Docs` },
      { image: IMG_DARK_WEB, caption: `Accessibility audit — 100% WCAG 2.1 AA across all components`, tag: `A11y` },
    ],
    video: {
      youtubeId: `mWqsKFqHtLo`,
      title: `Design System Deep Dive — Orion Enterprise Suite`,
      desc: `A comprehensive tour of the Orion design system — from token architecture and component anatomy to the migration process and governance model that unified 6 product teams.`,
      duration: `6:15`,
    },
    results: {
      metrics: [
        { value: `−40%`, label: `Engineering UI time`, sub: `Measured sprint velocity` },
        { value: `+31%`, label: `Design velocity`, sub: `Features shipped/quarter` },
        { value: `220+`, label: `Components live`, sub: `Across all 6 products` },
        { value: `−22pts`, label: `Cross-product NPS gap`, sub: `Closed from −22 to 0` },
        { value: `6`, label: `Teams unified`, sub: `On single design language` },
        { value: `100%`, label: `Accessibility pass rate`, sub: `WCAG 2.1 AA` },
      ],
      quote: { text: `The design system didn't just save time — it changed how we make decisions. We ship with confidence now.`, author: `James R.`, role: `VP Engineering, Orion` },
    },
    reflection: {
      summary: `A design system is never just a component library — it's a change management problem. The hardest part wasn't building the components; it was building the trust that made teams want to use them. Investing in documentation, office hours, and migration support was as important as the Figma work.`,
      lessons: [
        `Adoption is a design problem. The system that nobody uses is worthless no matter how good it is.`,
        `Token naming is a UX problem — if engineers can't guess the right token, the system fails at the moment of use.`,
        `Governance is a product in itself — design it with the same rigor as user-facing features.`,
      ],
      next: [
        `AI-assisted component suggestion in design tools`,
        `Real-time component usage analytics`,
        `Self-serve theming portal for enterprise customers`,
      ],
    },
  },

  3: {
    title: `Lumina AI Product`,
    tagline: `Designing the onboarding that reduced AI complexity from 3 weeks to 48 hours for non-technical users.`,
    meta: {
      role: `Product Design Lead`,
      timeline: `6 Months`,
      team: `2 Designers · 4 Engineers · 1 PM`,
      industry: `AI / Startup`,
    },
    metrics: [
      { value: `−85%`, label: `Onboarding Time` },
      { value: `+44%`, label: `7-day Retention` },
      { value: `−60%`, label: `Support Load` },
      { value: `2.3×`, label: `Trial Conversion` },
    ],
    problem: {
      narrative: `Lumina's AI product was powerful but incomprehensible. Non-technical users — the primary target market — were dropping out within the first session because the product spoke in machine learning jargon and offered no path from "I don't understand this" to "I'm getting value."`,
      painPoints: [
        { icon: `⊘`, title: `Jargon Barrier`, desc: `Onboarding assumed ML literacy that most users didn't have.` },
        { icon: `◷`, title: `Value Delay`, desc: `Users had to invest 3+ weeks before seeing their first meaningful output.` },
        { icon: `↯`, title: `Trust Gap`, desc: `AI recommendations came with no explanation — users rejected them instinctively.` },
        { icon: `▵`, title: `Setup Abandonment`, desc: `67% of users abandoned during initial configuration — before using the product.` },
      ],
    },
    research: {
      methods: [`Activation Funnel Analysis`, `Exit Interviews`, `Think-Aloud Testing`, `Competitive Audit`, `Concept Testing`],
      insights: [
        { id: `I-01`, quote: `"I have no idea what it's asking me to do. What is a 'training corpus'?"`, author: `Marketing Manager, SMB`, theme: `Jargon Confusion` },
        { id: `I-02`, quote: `"I set it up but I never knew if it was working. There was no feedback."`, author: `Operations Lead, Non-profit`, theme: `Progress Ambiguity` },
        { id: `I-03`, quote: `"Why is it recommending this? If I don't understand why, I'm not going to trust it."`, author: `Business Analyst, Healthcare`, theme: `Explainability Need` },
      ],
      findings: [
        `67% abandonment at first configuration step — the moment jargon peaked.`,
        `Users who saw a result within 10 minutes had 3× higher 30-day retention.`,
        `Trust in AI recommendations correlated with explanation clarity, not accuracy.`,
      ],
    },
    process: {
      steps: [
        { phase: `01`, title: `Diagnose`, duration: `3 wks`, desc: `Mapped the full onboarding funnel. Identified 8 abandonment spikes. Correlated UI moments with drop-off data.` },
        { phase: `02`, title: `Reframe`, duration: `2 wks`, desc: `Rewrote every UI string to eliminate ML jargon. Defined a "10-minute value moment" as the North Star metric.` },
        { phase: `03`, title: `Prototype`, duration: `4 wks`, desc: `Built 3 onboarding models. Tested with 24 non-technical users. Measured time-to-first-value for each.` },
        { phase: `04`, title: `Refine`, duration: `3 wks`, desc: `Iterated on the winning model through 4 rounds of testing. Added explainability layer to AI outputs.` },
        { phase: `05`, title: `Ship`, duration: `3 wks`, desc: `Shipped in 2 phases. Monitored activation funnel daily. Responded to drop-offs with targeted interventions within 48 hours.` },
      ],
      tradeoffs: [
        { decision: `Simplified configuration to 3 questions from 24`, rationale: `Sacrificed granular control for 85% reduction in abandonment — power settings available post-activation.` },
        { decision: `Prioritized explanation over speed in AI outputs`, rationale: `Added 200ms latency to show reasoning — but trust scores increased 34%.` },
      ],
    },
    solution: {
      screens: [
        { title: `Guided First Run`, desc: `A 3-step setup that replaces technical configuration with plain-language goal setting — users describe what they want, not how to achieve it. First meaningful output in under 10 minutes.`, image: IMG_DATA_VIZ, callouts: [`Goal-first framing`, `Jargon-free language`, `Progress transparency`], align: `left` },
        { title: `Explainable AI Layer`, desc: `"Why did it recommend this?" is now a first-class question. Every AI recommendation surfaces plain-language reasoning, confidence level, and the ability to override with one tap.`, image: IMG_DESIGN_SYS, callouts: [`Reasoning transparency`, `Confidence indicator`, `One-tap override`], align: `right` },
        { title: `Value Momentum Dashboard`, desc: `A real-time feed of outcomes the AI has generated — turning abstract system activity into tangible business value. Users can see their ROI growing before they finish their first week.`, image: IMG_DARK_WEB, callouts: [`Outcome feed`, `ROI accumulator`, `Action suggestions`], align: `left` },
      ],
    },
    screenshots: [
      { image: IMG_SS1, caption: `Guided onboarding — 3-step plain-language setup flow`, tag: `Onboarding` },
      { image: IMG_DATA_VIZ, caption: `AI recommendation card with plain-language reasoning`, tag: `AI Layer` },
      { image: IMG_SS3, caption: `Value momentum feed — ROI accumulation in real time`, tag: `Dashboard` },
      { image: IMG_DESIGN_SYS, caption: `Confidence scoring system — visual trust indicators`, tag: `Trust` },
      { image: IMG_SS2, caption: `Override flow — one-tap AI suggestion control`, tag: `Control` },
      { image: IMG_DARK_WEB, caption: `Progress transparency — setup completion states`, tag: `Progress` },
    ],
    video: {
      youtubeId: `9bZkp7q19f0`,
      title: `User Testing Session — Lumina AI Onboarding`,
      desc: `A composite of moderated usability testing sessions showing non-technical users navigating the redesigned onboarding — from first touch to first meaningful AI output in under 10 minutes.`,
      duration: `5:48`,
    },
    results: {
      metrics: [
        { value: `−85%`, label: `Onboarding time`, sub: `3 weeks → 48 hours` },
        { value: `+44%`, label: `7-day retention`, sub: `Activation cohort` },
        { value: `2.3×`, label: `Trial-to-paid conversion`, sub: `vs. previous quarter` },
        { value: `−60%`, label: `Support ticket volume`, sub: `Onboarding-related` },
        { value: `10 min`, label: `Time to first value`, sub: `From 3+ weeks` },
        { value: `+34%`, label: `AI recommendation trust`, sub: `Post-explanation layer` },
      ],
      quote: { text: `I finally understood what it was doing for me. I went from confused to paying customer in one afternoon.`, author: `Elena M.`, role: `Operations Manager, E-commerce` },
    },
    reflection: {
      summary: `The biggest unlock was reframing the design problem. We weren't designing an AI interface — we were designing a confidence-building experience for people unfamiliar with AI. That mental model shift changed every decision from UI copy to feature prioritization.`,
      lessons: [
        `Explainability is a feature, not a footnote — users trust what they understand.`,
        `"10 minutes to value" is a design constraint as powerful as any technical requirement.`,
        `Jargon is a power dynamic problem — using it excludes the people who need your product most.`,
      ],
      next: [
        `Personalized onboarding paths based on user role and industry`,
        `In-product learning moments tied to feature discovery`,
        `AI confidence calibration based on user feedback loops`,
      ],
    },
  },

  4: {
    title: `HealthBridge Mobile App`,
    tagline: `Making chronic care management accessible for 60+ users — driving 89% medication adherence.`,
    meta: {
      role: `UX Design Lead`,
      timeline: `9 Months`,
      team: `2 Designers · 5 Engineers · 1 Clinical Advisor`,
      industry: `Healthcare / Mobile`,
    },
    metrics: [
      { value: `89%`, label: `Med Adherence Rate` },
      { value: `+52%`, label: `Accessibility Score` },
      { value: `−70%`, label: `Missed Appointments` },
      { value: `4.8★`, label: `App Store Rating` },
    ],
    problem: {
      narrative: `Patients managing chronic conditions were using 3-5 disconnected apps and a paper calendar to coordinate their care. Older users — the demographic with highest healthcare need — were being failed by interfaces designed for younger, tech-native users.`,
      painPoints: [
        { icon: `⊘`, title: `Fragmentation`, desc: `Care coordination spread across 5+ disconnected apps and paper systems.` },
        { icon: `◷`, title: `Accessibility Gap`, desc: `Interfaces built for tech-native users excluded the patients who needed them most.` },
        { icon: `↯`, title: `Adherence Collapse`, desc: `Complex medication schedules led to 43% non-adherence in the pilot group.` },
        { icon: `▵`, title: `Caregiver Blindspot`, desc: `Family caregivers had no visibility into patient compliance or upcoming needs.` },
      ],
    },
    research: {
      methods: [`Home Visits`, `Caregiver Interviews`, `Clinical Expert Sessions`, `Cognitive Walkthrough`, `Accessibility Audit`],
      insights: [
        { id: `I-01`, quote: `"I have six apps, three doctors, and a notebook. Keeping up with all of it is its own health problem."`, author: `Patient, 71, Managing Diabetes + Hypertension`, theme: `System Overload` },
        { id: `I-02`, quote: `"My mother won't use the app because the text is too small and the buttons feel fragile."`, author: `Adult Caregiver, 48`, theme: `Physical Accessibility` },
        { id: `I-03`, quote: `"Patients forget their medications not because they don't care — but because the system makes it easy to forget."`, author: `Clinical Pharmacist, Partner Hospital`, theme: `Adherence Friction` },
      ],
      findings: [
        `73% of users over 65 had abandoned at least one health app due to usability issues.`,
        `Caregivers were the hidden primary user — often managing care on behalf of patients.`,
        `Medication reminders were most effective when tied to existing daily rituals, not arbitrary times.`,
      ],
    },
    process: {
      steps: [
        { phase: `01`, title: `Immerse`, duration: `5 wks`, desc: `Conducted 18 home visits with patients and caregivers. Observed real care routines. Built empathy maps for 4 distinct user archetypes.` },
        { phase: `02`, title: `Define`, duration: `2 wks`, desc: `Established clinical compliance requirements with partner hospital. Defined accessibility standards exceeding WCAG 2.1 AA.` },
        { phase: `03`, title: `Design`, duration: `6 wks`, desc: `Designed with patients in the room. Tested prototypes with 30+ users aged 55-82. Iterated every week based on direct feedback.` },
        { phase: `04`, title: `Validate`, duration: `4 wks`, desc: `Ran a 6-week pilot with 80 patients. Monitored adherence data daily. Refined 14 interaction patterns based on real usage.` },
        { phase: `05`, title: `Launch`, duration: `4 wks`, desc: `Phased rollout with onboarding support. Caregiver dashboard launched in parallel. Achieved 89% medication adherence in month one.` },
      ],
      tradeoffs: [
        { decision: `Used large tap targets (56dp minimum) exceeding mobile standards`, rationale: `Increased visual footprint but reduced missed-tap errors by 67% for users 65+.` },
        { decision: `Removed advanced features from primary navigation`, rationale: `Power users complained initially but task completion for primary flows improved 48%.` },
      ],
    },
    solution: {
      screens: [
        { title: `Simplified Care Hub`, desc: `One screen that replaces 5 apps — today's medications, upcoming appointments, and care messages in a single, distraction-free view with typography optimized for low-vision users.`, image: IMG_DATA_VIZ, callouts: [`Large tap targets (56dp+)`, `High-contrast mode`, `Voice confirmation`], align: `left` },
        { title: `Ritual-Based Reminders`, desc: `Smart reminders that learn user routines and suggest medication times tied to existing habits — morning coffee, evening news — achieving 89% adherence through behavioral design.`, image: IMG_DESIGN_SYS, callouts: [`Habit-stacking framework`, `Gentle escalation pattern`, `Caregiver notification sync`], align: `right` },
        { title: `Caregiver Dashboard`, desc: `A parallel view designed for family caregivers — real-time adherence status, appointment alerts, and care coordination tools that respect patient privacy while enabling active support.`, image: IMG_DARK_WEB, callouts: [`Role-scoped access`, `Gentle alert system`, `Privacy-first design`], align: `left` },
      ],
    },
    screenshots: [
      { image: IMG_SS4, caption: `Care hub — single unified screen replacing 5 separate apps`, tag: `Home` },
      { image: IMG_SS1, caption: `Medication view — large tap targets with voice confirmation`, tag: `Medications` },
      { image: IMG_DESIGN_SYS, caption: `Reminder system — ritual-based habit-stacking pattern`, tag: `Reminders` },
      { image: IMG_SS2, caption: `Caregiver dashboard — privacy-first real-time monitoring`, tag: `Caregiver` },
      { image: IMG_DARK_WEB, caption: `Accessibility audit — 56dp+ targets, high-contrast mode`, tag: `Accessibility` },
      { image: IMG_SS3, caption: `Appointment management — calendar with alert escalation`, tag: `Calendar` },
    ],
    video: {
      youtubeId: `K_h4nGYLMts`,
      title: `Field Study — HealthBridge in Real Homes`,
      desc: `Clips from the 18 home visit sessions showing real patients using HealthBridge — including first-time setup, daily medication flow, and caregiver coordination in authentic care environments.`,
      duration: `7:20`,
    },
    results: {
      metrics: [
        { value: `89%`, label: `Medication adherence`, sub: `30-day pilot cohort` },
        { value: `+52%`, label: `Accessibility score`, sub: `vs. previous app` },
        { value: `−70%`, label: `Missed appointments`, sub: `Pilot group vs. control` },
        { value: `4.8★`, label: `App Store rating`, sub: `60-day post-launch` },
        { value: `94%`, label: `Task completion rate`, sub: `Primary care flows` },
        { value: `3.2×`, label: `Caregiver engagement`, sub: `vs. patient-only apps` },
      ],
      quote: { text: `For the first time, I feel in control of my own health. My daughter can check in without me having to call her every day.`, author: `Margaret L.`, role: `Patient, 74 — Diabetes Management` },
    },
    reflection: {
      summary: `Designing for healthcare accessibility taught me that good UX is sometimes a matter of physical safety. Designing with patients present — not just for them — was the most important methodological shift. The clinical partnership also revealed that adherence is a behavioral design problem as much as a medical one.`,
      lessons: [
        `Accessibility is not a checklist — it's a continuous co-design practice with the people who need it.`,
        `Caregivers are often the primary user, even when they're not the stated audience.`,
        `Behavioral design and interface design are the same discipline when the stakes are this high.`,
      ],
      next: [
        `Predictive health alerts using wearable data integration`,
        `Multi-language support for non-English-speaking patient communities`,
        `Clinical dashboard for care teams to monitor population health at scale`,
      ],
    },
  },
};