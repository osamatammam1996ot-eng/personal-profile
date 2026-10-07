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
  recommendations: 'recommendations',
  tools: 'tools',
  contact: 'contact'
};

export function Navigation({ isDark, onToggleDark }: NavigationProps) {
  const { lang, toggleLang, isRTL, fontBody, fontHeading, t } = useLanguage();
  const { cmsData } = useCms();

  const activeOrder = cmsData?.sectionOrder || ['hero', 'whyHireMe', 'skills', 'portfolio', 'recommendations', 'tools', 'contact'];
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
    recommendations: 'recommendations',
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
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'glass-nav' : 'bg-transparent'}`}
    >
      <div className="max-w-[1200px] mx-auto px-6 flex items-center justify-between h-[72px]">
        {/* Logo */}
        <motion.button
          onClick={() => scrollTo('#home')}
          className="flex items-center gap-2 group"
          whileHover={{ scale: 1.02 }}
        >
          <div className="relative h-7 flex items-center justify-center">
            <img src="/logo.png" alt="OT Logo" className="h-full w-auto object-contain" />
          </div>
          <span className="text-lg font-semibold transition-colors duration-300 text-foreground">
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
                className={`relative px-4 py-2 rounded-lg transition-colors duration-200 group text-base font-medium ${
                  isActive ? 'text-nav-link-active' : 'text-nav-link-inactive hover:text-foreground'
                }`}
              >
                {link.label}
                <motion.span
                  className="absolute bottom-1 left-4 right-4 h-[2px] rounded-full bg-brand-line"
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
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-[color,background-color,box-shadow] duration-200 bg-brand-accent/10 border border-brand-accent/25 text-brand-accent dark:text-brand-light hover:shadow-glow-soft"
            whileHover={{ scale: 1.06 }}
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
                className={`text-sm font-bold ${isRTL ? 'font-[Inter,sans-serif] tracking-[0.04em]' : 'font-[Cairo,sans-serif] tracking-normal'}`}
              >
                {isRTL ? 'عربي' : 'EN'}
              </motion.span>
            </AnimatePresence>
          </motion.button>

          {/* Dark mode toggle */}
          <motion.button
            onClick={onToggleDark}
            className="w-9 h-9 rounded-xl flex items-center justify-center transition-colors duration-200 bg-foreground/6 text-brand-accent dark:text-brand-light"
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
          >
            {isDark ? <Sun size={17} /> : <Moon size={17} />}
          </motion.button>

          {/* Mobile menu toggle */}
          <button
            className="md:hidden w-9 h-9 rounded-xl flex items-center justify-center bg-foreground/6 text-foreground"
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
            className="md:hidden px-6 pb-4 flex flex-col gap-1 glass-nav"
          >
            {NAV_LINKS.map((link) => (
              <button
                key={link.href}
                onClick={() => scrollTo(link.href)}
                className={`px-4 py-3 rounded-xl transition-colors duration-200 font-medium text-text-dim bg-foreground/4 hover:text-foreground hover:bg-foreground/8 ${isRTL ? 'text-right' : 'text-left'}`}
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