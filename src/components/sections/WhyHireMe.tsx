import { useRef, useCallback, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform, MotionValue } from 'motion/react';
import svgPaths from '../../imports/svg-nh6weynufu';
import imgPortrait from '../../assets/e31509a0541824cfeda89ddabf83753388778df0.png';
import { useLanguage } from '../../contexts/LanguageContext';
import { useCms } from '../../contexts/CmsContext';
import { DecorativeShape } from '../shared/DecorativeShape';
import { Button } from '../ui/button';

interface WhyHireMeProps {
  isDark: boolean;
}

// ─── Card definitions ─────────────────────────────────────────────────────────
const CARDS_VISUAL = [
  {
    id: 'systems',
    iconGrad: 'linear-gradient(135deg, #06B6D4 0%, #6366F1 100%)',
    iconShadow: 'rgba(6,182,212,0.26)',
    ambientStop: 'rgba(6,182,212,0.08)',
    accentLine: 'rgba(6,182,212,0.4)',
    rotate: -1,
    renderIcon: () => (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <g clipPath="url(#c1)">
          <path d={svgPaths.p1a3b4700} stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.p3c552480} stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.p174f7d00} stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.p310deb70} stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d="M10 10V6.66667" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
        <defs><clipPath id="c1"><rect width="20" height="20" fill="white" /></clipPath></defs>
      </svg>
    ),
    delay: 0,
    glow: '#06B6D4',
  },
  {
    id: 'ai',
    iconGrad: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
    iconShadow: 'rgba(99,102,241,0.26)',
    ambientStop: 'rgba(99,102,241,0.08)',
    accentLine: 'color-mix(in srgb, var(--color-brand) 40%, transparent)',
    rotate: -2,
    renderIcon: () => (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <g clipPath="url(#c2)">
          <path d={svgPaths.p17e613c0} stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.p3d61d240} stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.p20534e00} stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.p392fc080} stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.p3fbca400} stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.p1c1c7100} stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.p240a1800} stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.p162c4500} stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.pc0a4800} stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
        <defs><clipPath id="c2"><rect width="20" height="20" fill="white" /></clipPath></defs>
      </svg>
    ),
    delay: 0.08,
    glow: '#8B5CF6',
  },
  {
    id: 'enterprise',
    iconGrad: 'linear-gradient(135deg, #A78BFA 0%, #06B6D4 100%)',
    iconShadow: 'rgba(167,139,250,0.26)',
    ambientStop: 'rgba(167,139,250,0.08)',
    accentLine: 'rgba(167,139,250,0.4)',
    rotate: 2,
    renderIcon: () => (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d={svgPaths.p25fc4100} stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
      </svg>
    ),
    delay: 0.16,
    glow: '#A78BFA',
  },
  {
    id: 'conversion',
    iconGrad: 'linear-gradient(135deg, #8B5CF6 0%, #A78BFA 100%)',
    iconShadow: 'rgba(139,92,246,0.26)',
    ambientStop: 'rgba(139,92,246,0.08)',
    accentLine: 'rgba(139,92,246,0.4)',
    rotate: 1.5,
    renderIcon: () => (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d={svgPaths.p3c797180} stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        <path d={svgPaths.p3ac0b600} stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
      </svg>
    ),
    delay: 0.24,
    glow: '#8B5CF6',
  },
];

// ─── Floating SVG decorations ─────────────────────────────────────────────────

function AnchorPointSvg() {
  return (
    <svg width="62" height="62" viewBox="0 0 62 62" fill="none">
      {/* dashed lines */}
      <line x1="4" y1="31" x2="28" y2="31" stroke="#6366F1" strokeOpacity="0.38" strokeWidth="1" strokeDasharray="3 3" />
      <line x1="34" y1="31" x2="58" y2="31" stroke="#6366F1" strokeOpacity="0.38" strokeWidth="1" strokeDasharray="3 3" />
      {/* centre diamond */}
      <rect x="27.5" y="27.5" width="7" height="7" rx="0" fill="#6366F1" fillOpacity="0.1" stroke="#6366F1" strokeOpacity="0.65" strokeWidth="1.5" transform="rotate(45 31 31)" />
      {/* end circles */}
      <path d={svgPaths.p3a962880} fill="#6366F1" fillOpacity="0.1" stroke="#6366F1" strokeOpacity="0.65" strokeWidth="1.5" transform="translate(0.25 23.5)" />
      <path d={svgPaths.p3a962880} fill="#6366F1" fillOpacity="0.1" stroke="#6366F1" strokeOpacity="0.65" strokeWidth="1.5" transform="translate(53.25 23.5)" />
    </svg>
  );
}

function BezierSvg() {
  return (
    <svg width="108" height="68" viewBox="0 0 108 68" fill="none">
      <path d={svgPaths.p3b7cfe96} stroke="#8B5CF6" strokeOpacity="0.52" strokeWidth="1.5" transform="scale(1.156) translate(-0.3 14.8)" />
      {/* anchor circles */}
      <path d={svgPaths.p1f8c1310} fill="#8B5CF6" fillOpacity="0.08" stroke="#8B5CF6" strokeOpacity="0.7" strokeWidth="1.5" transform="translate(3.5 48.5)" />
      <path d={svgPaths.p1f8c1310} fill="#8B5CF6" fillOpacity="0.08" stroke="#8B5CF6" strokeOpacity="0.7" strokeWidth="1.5" transform="translate(95 48.5)" />
      {/* control point lines */}
      <path d={svgPaths.p4ae0400} stroke="#8B5CF6" strokeDasharray="3 3" strokeOpacity="0.3" transform="scale(0.42) translate(20 8)" />
      <path d={svgPaths.p38601780} stroke="#8B5CF6" strokeDasharray="3 3" strokeOpacity="0.3" transform="scale(0.42) translate(195 8)" />
      {/* control point dots */}
      <path d={svgPaths.p969ae00} fill="#8B5CF6" fillOpacity="0.75" transform="translate(23 5)" />
      <path d={svgPaths.p969ae00} fill="#8B5CF6" fillOpacity="0.75" transform="translate(79 5)" />
    </svg>
  );
}

function FigmaCursorSvg() {
  return (
    <svg width="28" height="36" viewBox="0 0 28 36" fill="none">
      <path d={svgPaths.p16b8ea00} fill="#06B6D4" fillOpacity="0.1" stroke="#06B6D4" strokeLinejoin="round" strokeOpacity="0.78" strokeWidth="1.5" />
    </svg>
  );
}

function GridSvg() {
  return (
    <svg width="54" height="54" viewBox="0 0 54 54" fill="none">
      {[0, 13.5, 27, 40.5, 54].map(y => (
        <line key={`h${y}`} x1="0" y1={y} x2="54" y2={y} stroke="#6366F1" strokeOpacity="0.32" strokeWidth="0.8" />
      ))}
      {[0, 13.5, 27, 40.5, 54].map(x => (
        <line key={`v${x}`} x1={x} y1="0" x2={x} y2="54" stroke="#6366F1" strokeOpacity="0.32" strokeWidth="0.8" />
      ))}
      <rect x="20.5" y="20.5" width="13" height="13" fill="#6366F1" fillOpacity="0.1" stroke="#6366F1" strokeOpacity="0.52" />
    </svg>
  );
}

function DiamondSvg() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <rect x="4" y="4" width="12" height="12" fill="#A78BFA" fillOpacity="0.12" stroke="#A78BFA" strokeOpacity="0.78" strokeWidth="1.5" transform="rotate(45 10 10)" />
    </svg>
  );
}

function SmallDotsSvg() {
  return (
    <svg width="36" height="8" viewBox="0 0 36 8" fill="none">
      <circle cx="4" cy="4" r="2.5" fill="#6366F1" fillOpacity="0.45" />
      <circle cx="18" cy="4" r="2.5" fill="#6366F1" fillOpacity="0.28" />
      <circle cx="32" cy="4" r="2.5" fill="#6366F1" fillOpacity="0.15" />
    </svg>
  );
}

const FLOATS = [
  { id: 'anchor',   SVG: AnchorPointSvg, left: '4.2%',  top: '18.8%', depth: 0.7,  dur: 6,   del: 0    },
  { id: 'cursor1',  SVG: FigmaCursorSvg, left: '83.3%', top: '46.6%', depth: 1.1,  dur: 7,   del: 2    },
  { id: 'grid',     SVG: GridSvg,        left: '3.1%',  top: '72.8%', depth: 0.55, dur: 9,   del: 0.5  },
  { id: 'diamond1', SVG: DiamondSvg,     left: '51.2%', top: '3.8%',  depth: 0.9,  dur: 5,   del: 1.8  },
  { id: 'diamond2', SVG: DiamondSvg,     left: '88.4%', top: '63%',   depth: 0.65, dur: 7.5, del: 3    },
  { id: 'dots',     SVG: SmallDotsSvg,   left: '3.4%',  top: '5.2%',  depth: 0.5,  dur: 10,  del: 0.8  },
  { id: 'cursor2',  SVG: FigmaCursorSvg, left: '6.8%',  top: '87%',   depth: 1,    dur: 6.5, del: 1.5  },
];

// ─── Floating element ────────────────────────────────────────────────────────
interface FloatProps {
  SVG: React.ComponentType;
  left: string;
  top: string;
  depth: number;
  dur: number;
  del: number;
  smX: MotionValue<number>;
  smY: MotionValue<number>;
}

function FloatEl({ SVG, left, top, depth, dur, del, smX, smY }: FloatProps) {
  const px = useTransform(smX, v => v * depth * 0.4);
  const py = useTransform(smY, v => v * depth * 0.4);
  return (
    <motion.div
      className="absolute pointer-events-none select-none"
      style={{ left, top, x: px, y: py, opacity: 0.68 }}
    >
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ repeat: Infinity, duration: dur, ease: 'easeInOut', delay: del }}
      >
        <SVG />
      </motion.div>
    </motion.div>
  );
}

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
        className="relative rounded-2xl overflow-hidden px-[21px] pt-[20px] pb-[24px] min-h-[200px] bg-surface-elevated border border-brand/15 dark:border-white/10 shadow-[0_8px_32px_rgba(99,102,241,0.1),inset_0_1px_0_rgba(255,255,255,0.9)] dark:shadow-[0_8px_40px_rgba(0,0,0,0.38),inset_0_1px_0_rgba(255,255,255,0.04)]"
      >
        {/* Ambient radial glow */}
        <div
          className="absolute inset-0 pointer-events-none rounded-2xl"
          style={{
            background: `radial-gradient(circle at 28% 22%, ${card.ambientStop} 0%, transparent 62%)`,
          }}
        />

        {/* Icon badge */}
        <div
          className="relative flex items-center justify-center rounded-[14px] mb-[18px]"
          style={{
            width: 45,
            height: 45,
            background: card.iconGrad,
            boxShadow: `0 4px 18px ${card.iconShadow}`,
            flexShrink: 0,
          }}
        >
          <Icon />
        </div>

        {/* Title */}
        <h3
          className="font-bold text-[14.72px] text-text-primary leading-[19.136px] mb-2 whitespace-normal"
          
        >
          {card.title}
        </h3>

        {/* Body */}
        <p
          className="text-[12.16px] text-text-secondary leading-[20.064px] m-0"
          
        >
          {card.desc}
        </p>

        {/* Bottom shimmer line */}
        <div
          className="absolute bottom-0 left-0 right-0 pointer-events-none"
          style={{
            height: 6,
            background: `linear-gradient(90deg, transparent 0%, ${card.accentLine} 50%, transparent 100%)`,
          }}
        />
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
              ? { y: -22, scale: 1.07, zIndex: 30, filter: `drop-shadow(0 0 32px ${card.glow}dd) drop-shadow(0 18px 48px ${card.glow}66)` }
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
            style={{ display: 'flex', flex: 1, position: 'relative' }}
          >
            {/* Glow halo */}
            <motion.div
              aria-hidden
              animate={{ opacity: isHovered ? 1 : 0, scale: isHovered ? 1 : 0.65 }}
              transition={{ duration: 0.45, ease: 'easeOut' }}
              style={{
                position: 'absolute', inset: -22, borderRadius: 32, zIndex: 0, pointerEvents: 'none',
                background: `radial-gradient(ellipse 85% 75% at 50% 65%, ${card.glow}55 0%, transparent 68%)`,
                filter: 'blur(14px)',
              }}
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
              style={{
                position: 'absolute', inset: -5, borderRadius: 24, zIndex: 0, pointerEvents: 'none',
                backgroundImage: `conic-gradient(from 0deg, transparent 60%, ${card.glow}bb 80%, ${card.glow}ff 90%, transparent 100%)`,
                padding: 1.5,
                WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                WebkitMaskComposite: 'xor',
                maskComposite: 'exclude',
              }}
            />
            <div style={{ position: 'relative', zIndex: 2, display: 'flex', flex: 1 }}>
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
    <div className="absolute inset-0 pointer-events-none select-none" style={{ zIndex: 4 }}>
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

  const word1 = cmsData.whyHireMe.word1[lang] || (lang === 'en' ? 'WHY' : 'لماذا');
  const word2 = cmsData.whyHireMe.word2[lang] || (lang === 'en' ? 'HIRE' : 'توظيف');
  const word3 = cmsData.whyHireMe.word3[lang] || (lang === 'en' ? 'ME' : 'أنا');

  const onMouseMove = useCallback((e: React.MouseEvent<HTMLElement>) => {
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
      {/* ── Background grid overlay ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: [
            `linear-gradient(color-mix(in srgb, var(--color-brand) 5%, transparent) 1px, transparent 1px)`,
            `linear-gradient(90deg, color-mix(in srgb, var(--color-brand) 5%, transparent) 1px, transparent 1px)`,
          ].join(', '),
          backgroundSize: '60px 60px',
          WebkitMaskImage: 'radial-gradient(ellipse 90% 80% at 50% 35%, black 0%, transparent 70%)',
          maskImage: 'radial-gradient(ellipse 90% 80% at 50% 35%, black 0%, transparent 70%)',
        }}
      />

      {/* ── Ambient glow blobs ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: isDark
            ? [
                'radial-gradient(ellipse 70% 50% at 50% 30%, rgba(99,102,241,0.12) 0%, transparent 60%)',
                'radial-gradient(ellipse 40% 40% at 18% 22%, rgba(139,92,246,0.08) 0%, transparent 55%)',
                'radial-gradient(ellipse 40% 30% at 82% 22%, rgba(6,182,212,0.06) 0%, transparent 55%)',
              ].join(', ')
            : [
                'radial-gradient(ellipse 70% 50% at 50% 30%, rgba(99,102,241,0.08) 0%, transparent 60%)',
                'radial-gradient(ellipse 40% 40% at 18% 22%, rgba(139,92,246,0.05) 0%, transparent 55%)',
                'radial-gradient(ellipse 40% 30% at 82% 22%, rgba(6,182,212,0.04) 0%, transparent 55%)',
              ].join(', '),
        }}
      />

      {/* ── Floating decorations ── */}
      {FLOATS.map(f => (
        <FloatEl key={f.id} {...f} smX={smX} smY={smY} />
      ))}

      {/* Decorative 3D shape — bottom-left */}
      <DecorativeShape
        shape="octahedron"
        position="bottom-left"
        size={460}
        cropAmount={28}
        rotationOffset={[0.5, -0.2, 0.4]}
        isDark={isDark}
      />

      {/* ── CONTENT ─ */}
      <div
        className="relative w-full flex flex-col items-center"
        style={{ paddingTop: '10vh', paddingBottom: 0 }}
      >

        {/* ── BIG TITLE ── */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
          className="select-none text-center mb-[7vh]"
        >
          <div
            className="font-bold text-[clamp(2rem,5vw,4.5rem)] leading-none tracking-tighter flex gap-[0.14em] items-baseline flex-wrap justify-center"
            
          >
            <span className="text-text-primary">{word1}</span>
            <span className="text-brand dark:drop-shadow-[0_0_60px_rgba(99,102,241,0.55)] drop-shadow-[0_0_40px_rgba(99,102,241,0.25)]">
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
          className="relative w-full flex justify-center"
          style={{
            marginTop: '2vh',
            maxWidth: 1380,
            alignSelf: 'center',
          }}
        >
          {/* Portrait glow cloud */}
          <div
            className="absolute bottom-0 left-1/2 -translate-x-1/2 pointer-events-none"
            style={{
              width: '60%',
              height: '55%',
              background: 'radial-gradient(ellipse 70% 70% at 50% 80%, rgba(99,102,241,0.38) 0%, rgba(139,92,246,0.18) 45%, transparent 70%)',
              filter: 'blur(28px)',
              zIndex: 1,
            }}
          />

          {/* Portrait image container — aspect matches Figma 1380:450 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 1, ease: [0.4, 0, 0.2, 1], delay: 0.1 }}
            className="relative w-full"
            style={{ zIndex: 2 }}
          >
            <div
              className="relative w-full overflow-hidden"
              style={{ paddingBottom: '35%' }}
            >
              <img
                src={imgPortrait}
                alt="Osama Tammam"
                style={{
                  position: 'absolute',
                  width: '101.3%',
                  left: '-0.64%',
                  top: '-2%',
                  height: '140%',
                  objectFit: 'cover',
                  objectPosition: 'top center',
                  display: 'block',
                  WebkitMaskImage: [
                    'radial-gradient(ellipse 55% 95% at 50% 10%, black 20%, rgba(0,0,0,0.7) 45%, transparent 70%)',
                  ].join(', '),
                  maskImage: [
                    'radial-gradient(ellipse 55% 95% at 50% 10%, black 20%, rgba(0,0,0,0.7) 45%, transparent 70%)',
                  ].join(', '),
                  filter: 'brightness(1.08) contrast(1.04) saturate(1.05)',
                }}
              />
              <EyeOverlay smX={smX} smY={smY} />
            </div>
          </motion.div>
        </div>
      </div>

      {/* ── Bottom fade into next section ── */}
      <div
        className="absolute bottom-0 left-0 right-0 pointer-events-none"
        style={{
          height: 200,
          background: `linear-gradient(to bottom, transparent 0%, color-mix(in srgb, var(--color-surface) 60%, transparent) 40%, var(--color-surface) 100%)`,
          zIndex: 10,
        }}
      />
    </section>
  );
}