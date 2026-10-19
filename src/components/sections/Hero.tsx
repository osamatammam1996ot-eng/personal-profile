import { useState, useEffect, useRef } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { HexGrid } from '../shared/HexGrid';
import { ArrowRight, ArrowUpRight, Pause, Play } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useHeroContent } from '../../content/hero';
import { CTAButton } from '../ui/cta-button';
import { IconButton } from '../ui/icon-button';
import { scrollToSection } from '../../lib/scroll';

interface HeroProps {
  isDark: boolean;
}

const AVATAR_SRC = '/avatar-hex.webp';
// First frame of the loop, shown while paused so pausing also resets it
const AVATAR_STILL = '/avatar-hex-still.webp';
const AVATAR_MOTION_KEY = 'avatar-motion';

export function Hero({ isDark }: HeroProps) {
  const { lang, isRTL, t } = useLanguage();
  const {
    label: heroLabel, headline1: heroHeadline1, headline2: heroHeadline2, roles: heroRoles,
    desc: heroDesc, primaryCta: heroCta1, secondaryCta: heroCta2, order, show,
  } = useHeroContent();

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

  // Avatar animation toggle. Visitors' choice is remembered; reduced-motion visitors start paused.
  const reduceMotion = useReducedMotion();
  const [avatarPlaying, setAvatarPlaying] = useState(true);
  const [avatarSrc, setAvatarSrc] = useState(AVATAR_SRC);
  const avatarBlobUrl = useRef<string | null>(null);

  useEffect(() => {
    let saved: string | null = null;
    try { saved = localStorage.getItem(AVATAR_MOTION_KEY); } catch { /* storage blocked */ }
    if (saved === 'paused' || (saved === null && reduceMotion)) setAvatarPlaying(false);
  }, [reduceMotion]);

  useEffect(() => () => {
    if (avatarBlobUrl.current) URL.revokeObjectURL(avatarBlobUrl.current);
  }, []);

  const toggleAvatar = async () => {
    const next = !avatarPlaying;
    try { localStorage.setItem(AVATAR_MOTION_KEY, next ? 'playing' : 'paused'); } catch { /* storage blocked */ }
    if (!next) { setAvatarPlaying(false); return; }
    // Browsers keep an animated image's clock per resource, so a fresh blob URL
    // (from the HTTP cache, no re-download) makes the loop start again at frame 1.
    try {
      const blob = await (await fetch(AVATAR_SRC)).blob();
      if (avatarBlobUrl.current) URL.revokeObjectURL(avatarBlobUrl.current);
      avatarBlobUrl.current = URL.createObjectURL(blob);
      setAvatarSrc(avatarBlobUrl.current);
    } catch {
      setAvatarSrc(AVATAR_SRC);
    }
    setAvatarPlaying(true);
  };

  const avatarToggleLabel = avatarPlaying ? t.hero.pauseAnimation : t.hero.playAnimation;

  const dark = isDark;

  return (
    <section
      id="home"
      className="relative isolate flex flex-col items-center justify-center min-h-[100vh] overflow-hidden px-6 bg-surface transition-[background] duration-[0.4s] ease-[ease]"
    >
      <HexGrid isDark={dark} />

      <div className="absolute inset-0 z-10 pointer-events-none hero-overlay" />

      <div className="absolute inset-0 z-[15] pointer-events-none bg-overlay" />

      {/* Vignette layer */}
      <div className="absolute inset-0 z-[16] pointer-events-none bg-vignette" />

      {/* Editorial split: text on the reading side, avatar on the other.
          Text elements keep the CMS order and visibility toggles; the avatar has its own column. */}
      <div className="relative z-20 w-full max-w-[1200px] mx-auto md:px-4 pt-28 pb-24 grid items-center gap-8 md:gap-12 md:grid-cols-[minmax(0,1.3fr)_minmax(0,0.7fr)]">
        <div className="flex flex-col items-start text-start max-md:order-2">
          {order
            .filter((id) => id !== 'avatar')
            .map((id, renderIndex) => {
          const delay = 0.15 + (renderIndex * 0.08);

          if (id === 'label' && show.label) {
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

          if (id === 'headline' && show.headline) {
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
                    className={`typing-cursor bg-brand-light ${showCursor ? 'opacity-100' : 'opacity-0'} ms-1`}
                  />
                </span>
              </motion.p>
            );
          }

          if (id === 'desc' && show.desc) {
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
                    <ArrowRight size={15} className="transition-transform duration-200 rtl:-scale-x-100" />
                  </span>
                </CTAButton>
                <button
                  type="button"
                  onClick={() => scrollToSection('contact')}
                  className="inline-flex items-center gap-1.5 bg-transparent border-none p-0 cursor-pointer font-semibold text-base text-text-primary hover:text-brand-text transition-colors"
                >
                  {heroCta2}
                  <ArrowUpRight size={16} className="rtl:-scale-x-100" />
                </button>
              </motion.div>
            );
          }

          return null;
            })}
        </div>

        {show.avatar && (
          <motion.div
            key="hero-avatar"
            initial={{ opacity: 0, scale: 0.92, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
            className="relative max-md:order-1 justify-self-start md:justify-self-end w-[220px] sm:w-[280px] md:w-[min(380px,30vw)]"
          >
            {/* Seamless 9s loop, keyed with soft alpha: the glows are additive light, so the grid shows through them.
                The frame leaves ~18% of room around the hex for the glows, so the image overhangs its box:
                the hex lines up with the text edge on phones and fills the column on desktop. */}
            <img
              src={avatarPlaying ? avatarSrc : AVATAR_STILL}
              alt="Osama Tammam"
              width={512}
              height={512}
              className="block h-auto w-[130%] max-w-none pointer-events-none -my-[12%] -ms-[23%] md:-mx-[15%]"
            />
            {/* Sits in the empty corner beside the hex's lower edge, clear of the hands */}
            <IconButton
              tone="glass"
              onClick={toggleAvatar}
              aria-pressed={!avatarPlaying}
              aria-label={avatarToggleLabel}
              title={avatarToggleLabel}
              className="absolute bottom-[2%] end-[-2%] z-10 max-md:size-8"
            >
              {avatarPlaying
                ? <Pause size={14} fill="currentColor" strokeWidth={0} />
                : <Play size={14} fill="currentColor" strokeWidth={0} className="translate-x-px" />}
            </IconButton>
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
          {t.hero.scroll}
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