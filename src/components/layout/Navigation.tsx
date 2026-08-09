import { useState, useEffect } from 'react';
import { Sun, Moon, Menu, X, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useCms } from '../../contexts/CmsContext';

interface NavigationProps {
  isDark: boolean;
  onToggleDark: () => void;
}

// Map CMS keys to actual DOM IDs used on the page
const CMS_TO_DOM_IDS: Record<string, string> = {
  hero: 'home',
  whyHireMe: 'why-me',
  skills: 'skills',
  portfolio: 'work',
  tools: 'tools',
  contact: 'contact'
};

export function Navigation({ isDark, onToggleDark }: NavigationProps) {
  const { lang, toggleLang, isRTL, fontBody, fontHeading, t } = useLanguage();
  const { cmsData } = useCms();

  const activeOrder = cmsData?.sectionOrder || ['hero', 'whyHireMe', 'skills', 'portfolio', 'tools', 'contact'];
  const SECTION_IDS = activeOrder
    .filter(k => cmsData?.sections[k as keyof typeof cmsData.sections])
    .map(k => CMS_TO_DOM_IDS[k])
    .filter(Boolean);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState(SECTION_IDS[0] || 'home');
  const [menuOpen, setMenuOpen] = useState(false);

  const CMS_TO_LABEL_KEY: Record<string, keyof typeof t.nav> = {
    hero: 'home',
    whyHireMe: 'whyMe',
    skills: 'skills',
    portfolio: 'work',
    tools: 'tools',
    contact: 'contact'
  };

  const NAV_LINKS = activeOrder
    .filter(k => k !== 'footer' && CMS_TO_DOM_IDS[k] && cmsData?.sections[k as keyof typeof cmsData.sections])
    .map(k => ({
      label: t.nav[CMS_TO_LABEL_KEY[k]],
      href: `#${CMS_TO_DOM_IDS[k]}`
    }));

  useEffect(() => {
    const detect = () => {
      setScrolled(window.scrollY > 20);

      if (SECTION_IDS.length === 0) return;

      const nearBottom = window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 80;
      if (nearBottom) {
        setActiveSection(SECTION_IDS[SECTION_IDS.length - 1]);
        return;
      }

      const threshold = window.innerHeight * 0.4;
      for (const id of [...SECTION_IDS].reverse()) {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= threshold) {
            setActiveSection(id);
            return;
          }
        }
      }
      setActiveSection(SECTION_IDS[0] || 'home');
    };

    detect();
    window.addEventListener('scroll', detect, { passive: true });
    return () => window.removeEventListener('scroll', detect);
  }, [lang, SECTION_IDS.join(',')]);

  const scrollTo = (href: string) => {
    const id = href.slice(1);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
    setMenuOpen(false);
  };

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        background: scrolled
          ? isDark ? 'rgba(8,8,16,0.85)' : 'rgba(245,245,250,0.85)'
          : 'transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        boxShadow: scrolled ? (isDark ? '0 1px 0 rgba(255,255,255,0.06)' : '0 1px 0 rgba(0,0,0,0.08)') : 'none',
      }}
    >
      <div className="max-w-[1200px] mx-auto px-6 flex items-center justify-between h-[72px]">
        {/* Logo */}
        <motion.button
          onClick={() => scrollTo('#home')}
          className="flex items-center gap-2 group"
          whileHover={{ scale: 1.02 }}
        >
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-sm"
            style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)' }}
          >
            <span style={{  fontWeight: 700 }}>OT</span>
          </div>
          <span
            className={`transition-colors duration-300 ${isDark ? 'text-white' : 'text-gray-900'}`}
            style={{  fontWeight: 600, fontSize: '1rem' }}
          >
            {isRTL ? 'أسامة تمام' : 'Osama Tammam'}
          </span>
        </motion.button>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map((link) => {
            const isActive = activeSection === link.href.slice(1);
            return (
              <button
                key={link.href}
                onClick={() => scrollTo(link.href)}
                className="relative px-4 py-2 rounded-lg transition-colors duration-200 group"
                style={{
                  
                  fontWeight: 500,
                  fontSize: '0.9rem',
                  color: isActive
                    ? isDark ? '#a5b4fc' : '#6366f1'
                    : isDark ? 'rgba(255,255,255,0.65)' : 'rgba(0,0,0,0.55)',
                }}
              >
                {link.label}
                <motion.span
                  className="absolute bottom-1 left-4 right-4 h-[2px] rounded-full"
                  style={{ background: 'linear-gradient(90deg,#6366f1,#8b5cf6)' }}
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: isActive ? 1 : 0 }}
                  transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
                />
              </button>
            );
          })}
        </div>

        {/* Right controls */}
        <div className="flex items-center gap-2">
          {/* Language toggle */}
          <motion.button
            onClick={toggleLang}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-colors duration-200"
            style={{
              background: isDark ? 'rgba(99,102,241,0.12)' : 'rgba(99,102,241,0.08)',
              border: isDark ? '1px solid rgba(99,102,241,0.3)' : '1px solid rgba(99,102,241,0.2)',
              color: isDark ? '#a5b4fc' : '#6366f1',
            }}
            whileHover={{ scale: 1.06, boxShadow: '0 0 16px rgba(99,102,241,0.3)' }}
            whileTap={{ scale: 0.95 }}
            title={isRTL ? 'Switch to English' : 'التبديل إلى العربية'}
          >
            <Globe size={13} strokeWidth={2} />
            <AnimatePresence mode="wait">
              <motion.span
                key={isRTL ? 'en' : 'ar'}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.18 }}
                style={{
                  fontFamily: isRTL ? 'Inter, sans-serif' : 'Cairo, sans-serif',
                  fontWeight: 700,
                  fontSize: '0.78rem',
                  letterSpacing: isRTL ? '0.04em' : 0,
                }}
              >
                {isRTL ? 'عربي' : 'EN'}
              </motion.span>
            </AnimatePresence>
          </motion.button>

          {/* Dark mode toggle */}
          <motion.button
            onClick={onToggleDark}
            className="w-9 h-9 rounded-xl flex items-center justify-center transition-colors duration-200"
            style={{
              background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)',
              color: isDark ? '#a5b4fc' : '#6366f1',
            }}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
          >
            {isDark ? <Sun size={17} /> : <Moon size={17} />}
          </motion.button>

          {/* Mobile menu toggle */}
          <button
            className="md:hidden w-9 h-9 rounded-xl flex items-center justify-center"
            style={{
              background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)',
              color: isDark ? '#fff' : '#111',
            }}
            onClick={() => setMenuOpen(o => !o)}
          >
            {menuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="md:hidden px-6 pb-4 flex flex-col gap-1"
            style={{
              background: isDark ? 'rgba(8,8,16,0.95)' : 'rgba(245,245,250,0.95)',
              backdropFilter: 'blur(20px)',
            }}
          >
            {NAV_LINKS.map((link) => (
              <button
                key={link.href}
                onClick={() => scrollTo(link.href)}
                className="px-4 py-3 rounded-xl transition-colors duration-200"
                style={{
                  
                  fontWeight: 500,
                  color: isDark ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.7)',
                  background: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)',
                  textAlign: isRTL ? 'right' : 'left',
                }}
              >
                {link.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}