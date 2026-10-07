import { useRef, useCallback, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform, MotionValue } from 'motion/react';
import svgPaths from '../../imports/svg-nh6weynufu';
import imgPortrait from '../../assets/e31509a0541824cfeda89ddabf83753388778df0.png';
import { useLanguage } from '../../contexts/LanguageContext';
import { useCms } from '../../contexts/CmsContext';
import { Button } from '../ui/button';

interface WhyHireMeProps {
  isDark: boolean;
}

// ─── Card definitions ─────────────────────────────────────────────────────────
const CARDS_VISUAL = [
  {
    id: 'systems',
    rotate: -1,
    renderIcon: () => (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <g clipPath="url(#c1)">
          <path d={svgPaths.p1a3b4700} stroke="var(--color-on-brand)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.p3c552480} stroke="var(--color-on-brand)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.p174f7d00} stroke="var(--color-on-brand)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.p310deb70} stroke="var(--color-on-brand)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d="M10 10V6.66667" stroke="var(--color-on-brand)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
        <defs><clipPath id="c1"><rect width="20" height="20" /></clipPath></defs>
      </svg>
    ),
    delay: 0,
  },
  {
    id: 'ai',
    rotate: -2,
    renderIcon: () => (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <g clipPath="url(#c2)">
          <path d={svgPaths.p17e613c0} stroke="var(--color-on-brand)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.p3d61d240} stroke="var(--color-on-brand)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.p20534e00} stroke="var(--color-on-brand)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.p392fc080} stroke="var(--color-on-brand)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.p3fbca400} stroke="var(--color-on-brand)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.p1c1c7100} stroke="var(--color-on-brand)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.p240a1800} stroke="var(--color-on-brand)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.p162c4500} stroke="var(--color-on-brand)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.pc0a4800} stroke="var(--color-on-brand)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
        <defs><clipPath id="c2"><rect width="20" height="20" /></clipPath></defs>
      </svg>
    ),
    delay: 0.08,
  },
  {
    id: 'enterprise',
    rotate: 2,
    renderIcon: () => (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d={svgPaths.p25fc4100} stroke="var(--color-on-brand)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
      </svg>
    ),
    delay: 0.16,
  },
  {
    id: 'conversion',
    rotate: 1.5,
    renderIcon: () => (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d={svgPaths.p3c797180} stroke="var(--color-on-brand)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        <path d={svgPaths.p3ac0b600} stroke="var(--color-on-brand)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
      </svg>
    ),
    delay: 0.24,
  },
];

// Lift-and-glow filter for the hovered card (animated by motion, so not a class)
const HOVER_GLOW = 'drop-shadow(0 0 32px color-mix(in srgb, var(--color-brand) 86%, transparent)) drop-shadow(0 18px 48px color-mix(in srgb, var(--color-brand) 40%, transparent))';

// ─── Tilt card ───────────────────────────────────────────────────────────────
type CardWithText = typeof CARDS_VISUAL[0] & { title: string; desc: string };

function TiltCard({ card, isDark }: { card: CardWithText; isDark: boolean }) {
  const { fontHeading, fontBody } = useLanguage();
  const ref = useRef<HTMLDivElement>(null);
  const rotX = useMotionValue(0);
  const rotY = useMotionValue(0);
  const sX = useSpring(rotX, { stiffness: 300, damping: 28 });
  const sY = useSpring(rotY, { stiffness: 300, damping: 28 });

  const onMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (typeof window !== 'undefined' && window.matchMedia("(hover: none)").matches) return;
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    rotX.set(((e.clientY - r.top - r.height / 2) / (r.height / 2)) * -6);
    rotY.set(((e.clientX - r.left - r.width / 2) / (r.width / 2)) * 6);
  }, [rotX, rotY]);

  const onLeave = useCallback(() => { rotX.set(0); rotY.set(0); }, [rotX, rotY]);

  const Icon = card.renderIcon;

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      initial={{ opacity: 0, y: 36 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.65, ease: [0.4, 0, 0.2, 1], delay: card.delay }}
      whileHover={{ scale: 1.04, zIndex: 20 }}
      style={{
        rotate: card.rotate,
        rotateX: sX,
        rotateY: sY,
        transformPerspective: 800,
        transformStyle: 'preserve-3d',
      }}
      className="relative flex-1 min-w-0 cursor-default"
    >
      {/* Card surface */}
      <div
        className="relative rounded-2xl overflow-hidden px-[21px] pt-[20px] pb-[24px] min-h-[200px] bg-surface-elevated border border-brand/15 dark:border-border-default/70 shadow-tilt"
      >
        {/* Ambient radial glow */}
        <div className="absolute inset-0 pointer-events-none rounded-2xl why-card-ambient" />

        {/* Icon badge */}
        <div className="relative flex items-center justify-center shrink-0 size-[45px] rounded-[14px] mb-[18px] why-card-icon">
          <Icon />
        </div>

        {/* Title */}
        <h3
          className="font-bold text-lg text-text-primary leading-[19.136px] mb-2 whitespace-normal"
          
        >
          {card.title}
        </h3>

        {/* Body */}
        <p
          className="text-base text-text-secondary leading-[20.064px] m-0"
          
        >
          {card.desc}
        </p>

        {/* Bottom shimmer line */}
        <div className="absolute bottom-0 left-0 right-0 h-1.5 pointer-events-none why-card-shimmer" />
      </div>
    </motion.div>
  );
}

// ─── Cards row with hover state ──────────────────────────────────────────────
function CardsRow({ isDark }: { isDark: boolean }) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const { lang } = useLanguage();
  const { cmsData } = useCms();

  const fallbackTitles = lang === 'en'
    ? ['Systems Thinking', 'AI-Driven Process', 'Enterprise-Grade Execution', 'Conversion-Focused UX']
    : ['التفكير النظامي', 'عملية مدفوعة بالذكاء الاصطناعي', 'التنفيذ على مستوى المؤسسة', 'UX المركزة على التحويل'];

  const fallbackDescs = lang === 'en'
    ? [
        'Scalable design systems and component libraries that maintain consistency as your product grows across teams.',
        'Leveraging cutting-edge AI tools to accelerate ideation, validate designs, and surface insights that manual research misses.',
        'From complex SaaS dashboards to multi-platform enterprise tools — polished, production-ready, every time.',
        'Every decision rooted in psychology and business metrics — crafting flows that turn visitors into loyal users.',
      ]
    : [
        'أنظمة تصميم قابلة للتوسع ومكتبات مكونات تحافظ على الاتساق مع نمو المنتج عبر الفِرق.',
        'الاستفادة من أحدث أدوات الذكاء الاصطناعي لتسريع الأفكار والتحقق من التصاميم والحصول على رؤى تفتقدها الأبحاث اليدوية.',
        'من لوحات معلومات SaaS المعقدة إلى الأدوات متعددة المنصات للمؤسسات — مصقولة وجاهزة للإنتاج في كل مرة.',
        'كل قرار متجذر في علم النفس والمقاييس التجارية — حرفة تحويل الزوار إلى مستخدمين مخلصين.',
      ];

  const CARDS = CARDS_VISUAL.map((v, i) => {
    const title = cmsData.whyHireMe.cards[i]?.title?.[lang] || fallbackTitles[i] || v.id;
    const desc = cmsData.whyHireMe.cards[i]?.desc?.[lang] || fallbackDescs[i] || '';
    return { ...v, title, desc };
  });
  return (
    <div className="flex flex-col sm:flex-row gap-5 items-stretch justify-center">
      {CARDS.map((card, i) => {
        const isHovered = hoveredId === card.id;
        const isSibling = hoveredId !== null && !isHovered;
        return (
          <motion.div
            key={card.id}
            onHoverStart={() => setHoveredId(card.id)}
            onHoverEnd={() => setHoveredId(null)}
            animate={isHovered
              ? { y: -22, scale: 1.07, zIndex: 30, filter: HOVER_GLOW }
              : isSibling
              ? { y: [0, -10 - i * 3, 0, -6 - i * 2, 0], scale: 0.94, zIndex: 1, filter: 'brightness(0.55) saturate(0.7)' }
              : { y: [0, -10 - i * 3, 0, -6 - i * 2, 0], scale: 1, zIndex: 1, filter: 'brightness(1) saturate(1)' }
            }
            transition={isHovered
              ? { duration: 0.38, ease: [0.34, 1.56, 0.64, 1] }
              : {
                  scale: { duration: 0.3, ease: 'easeOut' },
                  filter: { duration: 0.3 },
                  y: { duration: 5 + i * 1.2, repeat: Infinity, ease: 'easeInOut', delay: i * 0.7 },
                }
            }
            className="relative flex flex-1"
          >
            {/* Glow halo */}
            <motion.div
              aria-hidden
              animate={{ opacity: isHovered ? 1 : 0, scale: isHovered ? 1 : 0.65 }}
              transition={{ duration: 0.45, ease: 'easeOut' }}
              className="absolute -inset-[22px] rounded-[32px] z-0 pointer-events-none why-card-halo"
            />
            {/* Spinning conic ring */}
            <motion.div
              aria-hidden
              animate={{
                opacity: isHovered ? 1 : 0,
                scale: isHovered ? 1 : 0.8,
                rotate: 360,
              }}
              transition={{
                opacity: { duration: 0.3 },
                scale: { duration: 0.38, ease: [0.34, 1.56, 0.64, 1] },
                rotate: { duration: 7, repeat: Infinity, ease: 'linear' },
              }}
              className="absolute -inset-[5px] rounded-3xl z-0 pointer-events-none why-card-ring"
            />
            <div className="relative z-[2] flex flex-1">
              <TiltCard card={card} isDark={isDark} />
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

// ─── Eye tracking ────────────────────────────────────────────────────────────
function EyeOverlay({ smX, smY }: { smX: MotionValue<number>; smY: MotionValue<number> }) {
  const rawPX = useTransform(smX, [-36, 36], [-3, 3]);
  const rawPY = useTransform(smY, [-36, 36], [-1.8, 1.8]);
  const px = useSpring(rawPX, { stiffness: 55, damping: 14 });
  const py = useSpring(rawPY, { stiffness: 55, damping: 14 });
  const catchX = useTransform(px, v => v * -0.5);
  const catchY = useTransform(py, v => v * -0.5);

  // Approximate iris centres as % of the portrait image
  // New close-up photo: eyes with glasses sit at ~50-54% from image top,
  // left eye ~38% from left, right eye ~59% from left
  const eyes = [
    { left: '38%', top: '52%' },
    { left: '59%', top: '50%' },
  ];

  return (
    <div className="absolute inset-0 pointer-events-none select-none z-[4]">
      {eyes.map((eye, i) => (
        null
      ))}
    </div>
  );
}

// ── Main export ────────────────────────────────────────────────────────────
export function WhyHireMe({ isDark }: WhyHireMeProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const smX = useSpring(rawX, { stiffness: 48, damping: 18 });
  const smY = useSpring(rawY, { stiffness: 48, damping: 18 });
  const { fontHeading, isRTL, lang } = useLanguage();
  const { cmsData } = useCms();

  const word1 = cmsData.whyHireMe.word1[lang] || (lang === 'en' ? 'Why' : 'لماذا');
  const word2 = cmsData.whyHireMe.word2[lang] || (lang === 'en' ? 'Hire' : 'توظيف');
  const word3 = cmsData.whyHireMe.word3[lang] || (lang === 'en' ? 'Me' : 'أنا');

  const onMouseMove = useCallback((e: React.MouseEvent<HTMLElement>) => {
    if (typeof window !== 'undefined' && window.matchMedia("(hover: none)").matches) return;
    const rect = sectionRef.current?.getBoundingClientRect();
    if (!rect) return;
    rawX.set(((e.clientX - rect.left) / rect.width - 0.5) * 72);
    rawY.set(((e.clientY - rect.top) / rect.height - 0.5) * 72);
  }, [rawX, rawY]);

  return (
    <section
      ref={sectionRef}
      id="why-me"
      onMouseMove={onMouseMove}
      className="relative w-full bg-surface transition-colors duration-300 overflow-hidden"
    >
      {/* ── CONTENT ─ */}
      <div className="relative w-full flex flex-col items-center pt-[10vh] pb-0">

        {/* ── BIG TITLE ── */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
          className="select-none text-center mb-[7vh]"
        >
          <div
            className="font-bold text-[clamp(2.5rem,5vw,4rem)] leading-none tracking-tighter flex gap-[0.14em] items-baseline flex-wrap justify-center"
            
          >
            <span className="text-text-primary">{word1}</span>
            <span className="text-text-primary">
              {word2}
            </span>
            {word3 && <span className="text-text-primary">{word3}</span>}
          </div>
        </motion.div>

        {/* ── CARDS ROW ── */}
        <div
          className="w-full max-w-[1200px] mx-auto px-6 md:px-10"
        >
          <CardsRow isDark={isDark} />
        </div>

        {/* ── PORTRAIT ── */}
        <div
          className="relative w-full flex justify-center mt-[2vh] max-w-[1380px] self-center"
        >
          {/* Portrait glow cloud */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 pointer-events-none w-[60%] h-[55%] z-[1] why-portrait-glow" />

          {/* Portrait image container — aspect matches Figma 1380:450 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 1, ease: [0.4, 0, 0.2, 1], delay: 0.1 }}
            className="relative w-full z-[2]"
          >
            <div
              className="relative w-full overflow-hidden pb-[35%]"
            >
              <img
                src={typeof imgPortrait === 'string' ? imgPortrait : (imgPortrait as any).src}
                alt="Osama Tammam"
                className="portrait-img"
              />
              <EyeOverlay smX={smX} smY={smY} />
            </div>
          </motion.div>
        </div>
      </div>

      {/* ── Bottom fade into next section ── */}
      <div
        className="absolute bottom-0 left-0 right-0 pointer-events-none h-[200px] section-fade-bottom z-10"
      />
    </section>
  );
}