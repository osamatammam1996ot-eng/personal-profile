"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { translations, Lang, Translations } from '../translations';

interface LanguageContextValue {
  lang: Lang;
  isRTL: boolean;
  t: Translations;
  toggleLang: () => void;
  /** Font family for headings/display text */
  fontHeading: string;
  /** Font family for body text */
  fontBody: string;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>('en');
  const [langLoaded, setLangLoaded] = useState(false);

  useEffect(() => {
    const savedLang = localStorage.getItem('ot_lang') as Lang;
    if (savedLang === 'en' || savedLang === 'ar') {
      setLang(savedLang);
    }
    setLangLoaded(true);
  }, []);

  // Use static translations only - no backend, no dynamic data fetching
  const t = translations[lang];

  const isRTL = lang === 'ar';
  const fontHeading = isRTL ? 'Cairo, sans-serif' : 'Space Grotesk, sans-serif';
  const fontBody = isRTL ? 'Cairo, sans-serif' : 'Inter, sans-serif';

  useEffect(() => {
    if (langLoaded) {
      localStorage.setItem('ot_lang', lang);
    }
    document.documentElement.setAttribute('dir', isRTL ? 'rtl' : 'ltr');
    document.documentElement.setAttribute('lang', lang);
  }, [lang, isRTL, langLoaded]);

  const toggleLang = () => setLang(l => (l === 'en' ? 'ar' : 'en'));

  return (
    <LanguageContext.Provider value={{ lang, isRTL, t, toggleLang, fontHeading, fontBody }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used inside LanguageProvider');
  return ctx;
}
