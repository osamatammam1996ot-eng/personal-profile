import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { HexGrid } from '../shared/HexGrid';
import { ArrowRight, Mail } from 'lucide-react';
import avatarImg from '../../assets/2d14d34cc2c291f0d8b60d9b13506b1995d59f5f.png';
import lightAvatarImg from '../../assets/ef9cb82bf32c8b9e3dfe70e9c1705569056e55ee.png';
import { useLanguage } from '../../contexts/LanguageContext';
import { useCms } from '../../contexts/CmsContext';
import { Button } from '../ui/button';
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
      className="relative flex flex-col items-center justify-center min-h-[100vh] overflow-hidden px-6"
      style={{
        background: dark ? '#0b0822' : '#f5f5fa',
        transition: 'background 0.4s ease',
      }}
    >
      <HexGrid isDark={dark} />

      <div
        className="absolute inset-0 z-10 pointer-events-none"
        style={{
          background: dark
            ? 'radial-gradient(ellipse 72% 85% at 50% 50%, rgba(8,8,16,0.65) 0%, rgba(8,8,16,0.38) 60%, transparent 100%)'
            : 'radial-gradient(ellipse 72% 85% at 50% 50%, rgba(245,245,250,0.68) 0%, rgba(245,245,250,0.32) 60%, transparent 100%)',
        }}
      />

      {/* Decorative 3D Shape */}
      <DecorativeShape
        shape="icosahedron"
        position="bottom-left"
        size={280}
        rotationOffset={[0.1, 0.2, 0]}
        isDark={dark}
      />

      <div className="relative z-20 flex flex-col items-center text-center px-6 w-full max-w-[780px] mx-auto py-24">

        {/* Avatar */}
        <motion.div
          initial={{ opacity: 0, scale: 0.88, y: -16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.75, ease: [0.4, 0, 0.2, 1] }}
          style={{
            marginBottom: 'clamp(28px, 4vh, 44px)',
            flexShrink: 0,
          }}
          className="w-[280px] sm:w-[320px] md:w-[26vw] md:min-w-[240px] md:max-w-[320px]"
        >
          <img
            src={dark
              ? "https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExYnhtMHpidGVkY205d3l3MjVhZ3lxbHo1N3Y0M2tjMW1hNGZiZ3dmbSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9cw/xrYXNJcnSJkhB02STp/giphy.gif"
              : typeof lightAvatarImg === 'string' ? lightAvatarImg : (lightAvatarImg as any).src
            }
            alt="Osama Tammam"
            style={dark
              ? { width: '100%', height: 'auto', maxWidth: '480px', display: 'block', marginBottom: '-15%', clipPath: 'inset(0 0 20px 0)' }
              : { width: '100%', height: 'auto', maxWidth: '480px', display: 'block' }
            }
          />
        </motion.div>

        {/* Pre-label */}
        <motion.p
          key={`label-${heroLabel}`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: [0.4, 0, 0.2, 1] }}
          style={{
            fontFamily: fontBody,
            fontWeight: 400,
            fontSize: '0.76rem',
            letterSpacing: isRTL ? '0.06em' : '0.16em',
            textTransform: 'none',
            color: dark ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.35)',
            marginBottom: '18px',
          }}
        >
          {heroLabel}
        </motion.p>

        {/* Headline */}
        <motion.h1
          key={`h1-${heroHeadline1}`}
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, delay: 0.18, ease: [0.4, 0, 0.2, 1] }}
          className="font-heading mb-6 leading-tight tracking-tight"
        >
          <span className="block font-bold text-[clamp(2.5rem,5vw,4rem)] text-text-primary">
            {heroHeadline1}
          </span>
          <span className="block font-bold text-[clamp(2.5rem,5vw,4rem)] text-text-primary">
            {heroHeadline2}
          </span>
        </motion.h1>

        {/* Typing role pill */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.28, ease: [0.4, 0, 0.2, 1] }}
          style={{ marginBottom: '24px' }}
        >
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              padding: '10px 24px',
              borderRadius: '999px',
              background: dark
                ? 'rgba(99,102,241,0.18)'
                : 'rgba(99,102,241,0.10)',
              border: dark
                ? '1px solid rgba(165,180,252,0.25)'
                : '1px solid rgba(99,102,241,0.22)',
              boxShadow: dark
                ? '0 0 28px rgba(99,102,241,0.22), inset 0 1px 0 rgba(255,255,255,0.06)'
                : '0 0 20px rgba(99,102,241,0.12)',
            }}
          >
            {/* Pulsing dot */}
            <span style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{
                position: 'absolute',
                width: 10, height: 10,
                borderRadius: '50%',
                background: '#6366f1',
                opacity: 0.35,
                animation: 'ping 1.4s cubic-bezier(0,0,0.2,1) infinite',
              }} />
              <span style={{
                width: 7, height: 7,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                boxShadow: '0 0 8px rgba(99,102,241,0.8)',
                display: 'inline-block',
              }} />
            </span>

            <span
              className="font-heading font-semibold text-[clamp(1.05rem,2vw,1.4rem)] bg-[image:var(--brand-gradient)] bg-clip-text text-transparent"
              style={{
                letterSpacing: '-0.01em',
                direction: isRTL ? 'rtl' : 'ltr',
              }}
            >
              {displayText}
              <span
                style={{
                  display: 'inline-block',
                  width: 2.5,
                  height: '0.9em',
                  background: dark ? '#a5b4fc' : '#6366f1',
                  borderRadius: 2,
                  marginLeft: isRTL ? 0 : 4,
                  marginRight: isRTL ? 4 : 0,
                  verticalAlign: 'middle',
                  opacity: showCursor ? 1 : 0,
                  transition: 'opacity 0.1s',
                  boxShadow: '0 0 8px rgba(99,102,241,0.9)',
                }}
              />
            </span>
          </span>

          <style>{`
            @keyframes ping {
              75%, 100% { transform: scale(2); opacity: 0; }
            }
          `}</style>
        </motion.div>

        {/* Description */}
        <motion.p
          key={`desc-${heroDesc}`}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.34, ease: [0.4, 0, 0.2, 1] }}
          className="font-body text-[0.98rem] leading-[1.78] max-w-[540px] mb-6"
          style={{
            color: dark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)',
            whiteSpace: 'pre-line',
          }}
        >
          {heroDesc}
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.42, ease: [0.4, 0, 0.2, 1] }}
          className="flex flex-wrap items-center justify-center gap-3"
          style={{ marginBottom: '52px' }}
        >
          <Button
            onClick={() => scrollToSection('work')}
            className="relative flex items-center gap-2 px-7 py-6 rounded-xl text-white font-body font-semibold text-[0.92rem] hover:scale-[1.04] transition-all"
            style={{
              background: 'var(--brand-gradient)',
            }}
          >
            {heroCta1}
            <ArrowRight size={15} className={`transition-transform duration-200 ${isRTL ? '-scale-x-100' : ''}`} />
          </Button>

          <Button
            onClick={() => scrollToSection('contact')}
            variant="outline"
            className="flex items-center gap-2 px-7 py-6 rounded-xl font-body font-medium text-[0.92rem] border-[rgba(255,255,255,0.14)] hover:scale-[1.04] transition-transform"
            style={{
              background: 'transparent',
              color: dark ? 'rgba(224,224,255,0.85)' : '#0f0f1e',
            }}
          >
            <Mail size={15} />
            {heroCta2}
          </Button>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4 }}
      >
        <p className={`font-body text-[0.68rem] tracking-widest text-text-secondary`} style={{ color: isDark ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.25)' }}>
          {heroScroll}
        </p>
        <motion.div
          style={{
            width: 1,
            height: 36,
            background: 'linear-gradient(to bottom, #6366f1, transparent)',
          }}
          animate={{ scaleY: [0.3, 1, 0.3], opacity: [0.4, 1, 0.4] }}
          transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
        />
      </motion.div>
    </section>
  );
}