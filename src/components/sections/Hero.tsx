import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { HexGrid } from '../shared/HexGrid';
import { ArrowRight, Mail } from 'lucide-react';
import avatarImg from '../../assets/2d14d34cc2c291f0d8b60d9b13506b1995d59f5f.png';
import lightAvatarImg from '../../assets/ef9cb82bf32c8b9e3dfe70e9c1705569056e55ee.png';
import { useLanguage } from '../../contexts/LanguageContext';
import { useCms } from '../../contexts/CmsContext';
import { Button } from '../ui/button';
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
      className="relative flex flex-col items-center justify-center min-h-[100vh] overflow-hidden px-6 bg-hero-bg transition-[background] duration-[0.4s] ease-[ease]"
    >
      <HexGrid isDark={dark} />

      <div className="absolute inset-0 z-10 pointer-events-none hero-overlay" />

      {/* Overlay layer requested by user */}
      <div className="absolute inset-0 z-[15] pointer-events-none bg-overlay" />

      {/* Vignette layer */}
      <div className="absolute inset-0 z-[16] pointer-events-none bg-vignette" />

      {/* Decorative 3D Shape */}
      <DecorativeShape
        shape="icosahedron"
        position="bottom-left"
        size={330}
        rotationOffset={[0.1, 0.2, 0]}
        isDark={dark}
      />

      <div className="relative z-20 flex flex-col items-center text-center px-6 w-full max-w-[780px] mx-auto py-24">
        {/* Dynamic Rendering of Elements */}
        {(cmsData.hero.elementOrder || ['avatar', 'label', 'headline', 'roles', 'desc', 'ctas']).map((id, renderIndex) => {
          const delay = 0.1 + (renderIndex * 0.08);

          if (id === 'avatar' && cmsData.hero.showAvatar !== false) {
            return (
              <motion.div
                key="hero-avatar"
                initial={{ opacity: 0, scale: 0.88, y: -16 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.75, ease: [0.4, 0, 0.2, 1] }}
                className="mb-[clamp(28px,4vh,44px)] shrink-0 w-[280px] sm:w-[320px] md:w-[26vw] md:min-w-[240px] md:max-w-[320px]"
              >
                <img
                  src={dark ? "https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExYnhtMHpidGVkY205d3l3MjVhZ3lxbHo1N3Y0M2tjMW1hNGZiZ3dmbSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9cw/xrYXNJcnSJkhB02STp/giphy.gif" : (typeof lightAvatarImg === 'string' ? lightAvatarImg : (lightAvatarImg as any).src)}
                  alt="Osama Tammam"
                  className={`w-full h-auto max-w-[480px] block ${dark ? '-mb-[15%] [clip-path:inset(0_0_20px_0)]' : ''}`}
                />
              </motion.div>
            );
          }

          if (id === 'label' && cmsData.hero.showLabel !== false) {
            return (
              <motion.p
                key={`label-${heroLabel}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay, ease: [0.4, 0, 0.2, 1] }}
                className={`text-sm font-normal mb-[18px] text-text-faint ${isRTL ? 'tracking-[0.06em]' : 'tracking-[0.16em]'}`}
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
                className="font-heading mb-6 leading-tight tracking-tight"
              >
                <span className="block font-bold text-[clamp(2.5rem,5vw,4rem)] text-text-primary">
                  {heroHeadline1}
                </span>
                <span className="block font-bold text-[clamp(2.5rem,5vw,4rem)] text-text-primary">
                  {heroHeadline2}
                </span>
              </motion.h1>
            );
          }

          if (id === 'roles') {
            return (
              <motion.div
                key="hero-roles"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay, ease: [0.4, 0, 0.2, 1] }}
                className="mb-6"
              >
                <span className={`roles-badge ${dark ? 'roles-badge-dark' : 'roles-badge-light'}`}>
                  <span className="relative inline-flex items-center justify-center">
                    <span className="ping-dot-outer" />
                    <span className="ping-dot-inner" />
                  </span>
                  <span className={`font-heading font-semibold text-[clamp(1.05rem,2vw,1.4rem)] tracking-[-0.01em] text-foreground ${isRTL ? 'direction-rtl' : 'direction-ltr'}`}>
                    {displayText}
                    <span
                      className={`typing-cursor bg-indigo-light dark:bg-indigo-light ${isRTL ? 'mr-1' : 'ml-1'}`}
                      style={{ opacity: showCursor ? 1 : 0 }}
                    />
                  </span>
                </span>
              </motion.div>
            );
          }

          if (id === 'desc' && cmsData.hero.showDesc !== false) {
            return (
              <motion.p
                key={`desc-${heroDesc}`}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay, ease: [0.4, 0, 0.2, 1] }}
                className="font-body text-lg leading-[1.78] max-w-[540px] mb-6 text-text-muted whitespace-pre-line"
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
                className="flex flex-wrap items-center justify-center gap-3 mb-[52px]"
              >
                <CTAButton onClick={() => scrollToSection('work')}>
                  <span className="flex items-center gap-2">
                    {heroCta1}
                    <ArrowRight size={15} className={`transition-transform duration-200 ${isRTL ? '-scale-x-100' : ''}`} />
                  </span>
                </CTAButton>
                <CTAButton variant="secondary" onClick={() => scrollToSection('contact')}>
                  <span className="flex items-center gap-2">
                    {heroCta2}
                  </span>
                </CTAButton>
              </motion.div>
            );
          }

          return null;
        })}
</div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2"
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