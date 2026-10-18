import { useRef, useCallback, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'motion/react';
// Graded warm (oxblood shadows, bone highlights, crimson rim) to sit in the same world as the 3D avatar
import imgPortrait from '../../assets/why-portrait.webp';
import { useLanguage } from '../../contexts/LanguageContext';
import { useCms } from '../../contexts/CmsContext';

interface WhyHireMeProps {
  isDark: boolean;
}

// ─── Card definitions ─────────────────────────────────────────────────────────
// Each card floats above the portrait at its own slight angle.
const CARDS_VISUAL = [
  { id: 'systems', rotate: -1, delay: 0 },
  { id: 'ai', rotate: -2, delay: 0.08 },
  { id: 'enterprise', rotate: 2, delay: 0.16 },
  { id: 'conversion', rotate: 1.5, delay: 0.24 },
];

// Lift filter for the hovered card (animated by motion, so not a class): mostly a deep
// shadow with a hint of brand. Light mode dims the other cards by fading them
// rather than darkening (darkening turns white cards grey).
const HOVER_LOOK = {
  dark: {
    glow: 'drop-shadow(0 22px 40px rgba(0, 0, 0, 0.55)) drop-shadow(0 0 18px color-mix(in srgb, var(--color-brand) 28%, transparent))',
    sibling: { filter: 'brightness(0.55) saturate(0.7)', opacity: 1 },
  },
  light: {
    glow: 'drop-shadow(0 0 10px color-mix(in srgb, var(--color-brand) 20%, transparent)) drop-shadow(0 10px 22px color-mix(in srgb, var(--color-brand) 12%, transparent))',
    sibling: { filter: 'brightness(1) saturate(0.6)', opacity: 0.6 },
  },
};

// ─── Tilt card ───────────────────────────────────────────────────────────────
type CardWithText = typeof CARDS_VISUAL[0] & { title: string; desc: string };

function TiltCard({ card }: { card: CardWithText; isDark: boolean }) {
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
      {/* Card surface: a solid dark panel, no outline */}
      <div className="relative h-full rounded-2xl overflow-hidden px-6 py-5 bg-surface-raised shadow-tilt">
        <h3 className="m-0 mb-2 font-bold text-lg leading-snug text-text-primary whitespace-normal">
          {card.title}
        </h3>

        <p className="m-0 text-base leading-relaxed text-text-muted">
          {card.desc}
        </p>
      </div>
    </motion.div>
  );
}

// ─── Cards row with hover state ──────────────────────────────────────────────
function CardsRow({ isDark }: { isDark: boolean }) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const look = isDark ? HOVER_LOOK.dark : HOVER_LOOK.light;
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
              ? { y: -22, scale: 1.07, zIndex: 30, filter: look.glow, opacity: 1 }
              : isSibling
              ? { y: [0, -10 - i * 3, 0, -6 - i * 2, 0], scale: 0.94, zIndex: 1, ...look.sibling }
              : { y: [0, -10 - i * 3, 0, -6 - i * 2, 0], scale: 1, zIndex: 1, filter: 'brightness(1) saturate(1)', opacity: 1 }
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
            <div className="relative z-[2] flex flex-1">
              <TiltCard card={card} isDark={isDark} />
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

// ── Main export ────────────────────────────────────────────────────────────
export function WhyHireMe({ isDark }: WhyHireMeProps) {
  const { fontHeading, isRTL, lang } = useLanguage();
  const { cmsData } = useCms();

  const word1 = cmsData.whyHireMe.word1[lang] || (lang === 'en' ? 'Why' : 'لماذا');
  const word2 = cmsData.whyHireMe.word2[lang] || (lang === 'en' ? 'Hire' : 'توظيف');
  const word3 = cmsData.whyHireMe.word3[lang] || (lang === 'en' ? 'Me' : 'أنا');

  return (
    <section
      id="why-me"
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
            className="font-bold text-[clamp(2rem,4vw,3.25rem)] leading-none tracking-tighter flex gap-[0.14em] items-baseline flex-wrap justify-center"
            
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
              className="relative w-full overflow-clip pb-[35%]"
            >
              <img
                src={imgPortrait.src}
                alt="Osama Tammam"
                className="portrait-img"
              />
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