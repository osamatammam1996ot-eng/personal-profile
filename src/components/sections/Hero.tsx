import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { HexGrid } from '../shared/HexGrid';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useCms } from '../../contexts/CmsContext';
import { CTAButton } from '../ui/cta-button';
import { DecorativeShape } from '../shared/DecorativeShape';

interface HeroProps {
  isDark: boolean;
}

export function Hero({ isDark }: HeroProps) {
  const { lang, isRTL, fontHeading, fontBody } = useLanguage();
  const { cmsData } = useCms();

  const heroLabel = cmsData.hero.label[lang] || (lang === 'en' ? 'Osama Tammam · Cairo' : 'أسامة تمام · القاهرة');
  const heroHeadline1 = cmsData.hero.headline1[lang] || (lang === 'en' ? 'Making hard products' : 'جعل المنتجات الصعبة');
  const heroHeadline2 = cmsData.hero.headline2[lang] || (lang === 'en' ? 'feel inevitable.' : 'تبدو حتمية.');
  const heroRoles = cmsData.hero.roles[lang]?.length
    ? cmsData.hero.roles[lang]
    : (lang === 'en'
      ? ['Senior UX Designer', 'Senior UI Designer', 'AI Product Designer']
      : ['مصمم UX كبير', 'مصمم UI كبير', 'مصمم منتجات AI']);
  const heroDesc = cmsData.hero.desc[lang] || (lang === 'en'
    ? "Seven years building products for teams that couldn't afford to ship the wrong thing."
    : 'سبع سنوات لبناء منتجات للفِرق التي لم تستطع تحمل تكاليف شحن الشيء الخاطئ.');
  const heroCta1 = cmsData.hero.cta1[lang] || (lang === 'en' ? 'See my work' : 'شاهد عملي');
  const heroCta2 = cmsData.hero.cta2[lang] || (lang === 'en' ? "Let's talk" : 'هيا نتحدث');
  const heroScroll = lang === 'en' ? 'Scroll' : 'مرر';

  const [displayText, setDisplayText] = useState('');
  const [textIndex, setTextIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showCursor, setShowCursor] = useState(true);

  // Reset typing when language or roles change
  useEffect(() => {
    setDisplayText('');
    setTextIndex(0);
    setCharIndex(0);
    setIsDeleting(false);
  }, [lang, heroRoles]);

  useEffect(() => {
    const roles = heroRoles;
    const current = roles[textIndex % roles.length];
    if (!isDeleting && charIndex < current.length) {
      const timer = setTimeout(() => { setDisplayText(current.slice(0, charIndex + 1)); setCharIndex(c => c + 1); }, 68);
      return () => clearTimeout(timer);
    } else if (!isDeleting && charIndex === current.length) {
      const timer = setTimeout(() => setIsDeleting(true), 1800);
      return () => clearTimeout(timer);
    } else if (isDeleting && charIndex > 0) {
      const timer = setTimeout(() => { setDisplayText(current.slice(0, charIndex - 1)); setCharIndex(c => c - 1); }, 36);
      return () => clearTimeout(timer);
    } else if (isDeleting && charIndex === 0) {
      setIsDeleting(false);
      setTextIndex(i => (i + 1) % roles.length);
    }
  }, [charIndex, isDeleting, textIndex, heroRoles]);

  useEffect(() => {
    const iv = setInterval(() => setShowCursor(c => !c), 530);
    return () => clearInterval(iv);
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const dark = isDark;

  return (
    <section
      id="home"
      className="relative isolate flex flex-col items-center justify-center min-h-[100vh] overflow-hidden px-6 bg-surface transition-[background] duration-[0.4s] ease-[ease]"
    >
      <HexGrid isDark={dark} />

      <div className="absolute inset-0 z-10 pointer-events-none hero-overlay" />

      {/* Overlay layer requested by user */}
      <div className="absolute inset-0 z-[15] pointer-events-none bg-overlay" />

      {/* Vignette layer */}
      <div className="absolute inset-0 z-[16] pointer-events-none bg-vignette" />

      {/* Decorative 3D Shape — on the avatar's side so it never sits under the text */}
      <DecorativeShape
        shape="icosahedron"
        position={isRTL ? 'bottom-left' : 'bottom-right'}
        size={330}
        rotationOffset={[0.1, 0.2, 0]}
        isDark={dark}
      />

      {/* Editorial split: text on the reading side, avatar on the other.
          Text elements keep the CMS order and visibility toggles; the avatar has its own column. */}
      <div className="relative z-20 w-full max-w-[1200px] mx-auto md:px-4 pt-28 pb-24 grid items-center gap-8 md:gap-12 md:grid-cols-[minmax(0,1.3fr)_minmax(0,0.7fr)]">
        <div className="flex flex-col items-start text-start max-md:order-2">
          {(cmsData.hero.elementOrder || ['avatar', 'label', 'headline', 'roles', 'desc', 'ctas'])
            .filter((id) => id !== 'avatar')
            .map((id, renderIndex) => {
          const delay = 0.15 + (renderIndex * 0.08);

          if (id === 'label' && cmsData.hero.showLabel !== false) {
            return (
              <motion.p
                key={`label-${heroLabel}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay, ease: [0.4, 0, 0.2, 1] }}
                className={`m-0 mb-5 text-sm font-normal text-text-faint ${isRTL ? 'tracking-[0.06em]' : 'tracking-[0.16em]'}`}
              >
                {heroLabel}
              </motion.p>
            );
          }

          if (id === 'headline' && cmsData.hero.showHeadline !== false) {
            return (
              <motion.h1
                key={`h1-${heroHeadline1}`}
                initial={{ opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.75, delay, ease: [0.4, 0, 0.2, 1] }}
                className="m-0 mb-7 font-heading font-bold text-[clamp(2.5rem,4.5vw,4rem)] leading-[1.08] tracking-[-0.03em] text-text-primary"
              >
                <span className="block text-balance text-wave">{heroHeadline1}</span>
                <span className="block text-balance">{heroHeadline2}</span>
              </motion.h1>
            );
          }

          if (id === 'roles') {
            return (
              <motion.p
                key="hero-roles"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay, ease: [0.4, 0, 0.2, 1] }}
                className="m-0 mb-6 flex min-h-[1.75em] items-center gap-2.5 font-heading font-semibold text-[clamp(1.05rem,1.6vw,1.25rem)] text-text-secondary"
              >
                <span aria-hidden="true" className="size-2 shrink-0 rounded-full bg-brand" />
                <span className={isRTL ? 'direction-rtl' : 'direction-ltr'}>
                  {displayText}
                  <span
                    className={`typing-cursor bg-brand-light ${showCursor ? 'opacity-100' : 'opacity-0'} ${isRTL ? 'mr-1' : 'ml-1'}`}
                  />
                </span>
              </motion.p>
            );
          }

          if (id === 'desc' && cmsData.hero.showDesc !== false) {
            return (
              <motion.p
                key={`desc-${heroDesc}`}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay, ease: [0.4, 0, 0.2, 1] }}
                className="m-0 mb-9 font-body text-lg leading-[1.75] max-w-[520px] text-text-muted whitespace-pre-line"
              >
                {heroDesc}
              </motion.p>
            );
          }

          if (id === 'ctas') {
            return (
              <motion.div
                key="hero-ctas"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay, ease: [0.4, 0, 0.2, 1] }}
                className="flex flex-wrap items-center gap-x-7 gap-y-4"
              >
                <CTAButton onClick={() => scrollToSection('work')}>
                  <span className="flex items-center gap-2">
                    {heroCta1}
                    <ArrowRight size={15} className={`transition-transform duration-200 ${isRTL ? '-scale-x-100' : ''}`} />
                  </span>
                </CTAButton>
                <button
                  type="button"
                  onClick={() => scrollToSection('contact')}
                  className="inline-flex items-center gap-1.5 bg-transparent border-none p-0 cursor-pointer font-semibold text-base text-text-primary hover:text-brand-text transition-colors"
                >
                  {heroCta2}
                  <ArrowUpRight size={16} className={isRTL ? '-scale-x-100' : ''} />
                </button>
              </motion.div>
            );
          }

          return null;
            })}
        </div>

        {cmsData.hero.showAvatar !== false && (
          <motion.div
            key="hero-avatar"
            initial={{ opacity: 0, scale: 0.92, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
            className="max-md:order-1 justify-self-start md:justify-self-end w-[220px] sm:w-[280px] md:w-[min(380px,30vw)]"
          >
            {/* The animated webp has hard 1-bit alpha with a dark fringe, which looks
                jagged on the light background: erode the alpha by 1px and soften it. */}
            <svg width="0" height="0" className="absolute" aria-hidden="true">
              <filter id="avatar-smooth-edge" colorInterpolationFilters="sRGB">
                <feMorphology in="SourceAlpha" operator="erode" radius="1" result="eroded" />
                <feGaussianBlur in="eroded" stdDeviation="0.8" result="soft" />
                <feComposite in="SourceGraphic" in2="soft" operator="in" />
              </filter>
            </svg>
            {/* -mt-[20%]: the top ~21% of the image is transparent padding above the head */}
            <img
              src="/avatar-oxblood.webp"
              alt="Osama Tammam"
              className="w-full h-auto block -mt-[20%] -mb-[15%] [clip-path:inset(0_0_20px_0)] [filter:url(#avatar-smooth-edge)]"
            />
          </motion.div>
        )}
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="hero-scroll absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4 }}
      >
        <p className="font-body text-xs tracking-widest text-text-faint">
          {heroScroll}
        </p>
        <motion.div
          className="w-px h-9 scroll-indicator-line"
          animate={{ scaleY: [0.3, 1, 0.3], opacity: [0.4, 1, 0.4] }}
          transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
        />
      </motion.div>
    </section>
  );
}