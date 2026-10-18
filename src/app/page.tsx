"use client";

import { useState, useEffect, useLayoutEffect, type ReactNode } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Navigation } from '../components/layout/Navigation';
import { Hero } from '../components/sections/Hero';
import { WhyHireMe } from '../components/sections/WhyHireMe';
import { Skills } from '../components/sections/Skills';
import { Portfolio } from '../components/sections/Portfolio';
import { Tools } from '../components/sections/Tools';
import { Recommendations } from '../components/sections/Recommendations';
import { Contact } from '../components/sections/Contact';
import { Footer } from '../components/layout/Footer';
import { LogoMarquee } from '../components/sections/LogoMarquee';
import { CaseStudy } from '../components/shared/CaseStudy';
import { CustomCursor } from '../components/shared/CustomCursor';
import { LanguageProvider, useLanguage } from '../contexts/LanguageContext';
import { useCms } from '../contexts/CmsContext';
import { ErrorBoundary } from '../components/layout/ErrorBoundary';
import { LIGHT_MODE_ENABLED } from '../config/features';

export default function Home({ initialCaseStudy = null }: { initialCaseStudy?: { id: number; title: string } | null } = {}) {
  const [isDark, setIsDark] = useState(true);
  const [themeLoaded, setThemeLoaded] = useState(false);
  const [caseStudy, setCaseStudy] = useState<{ id: number; title: string } | null>(initialCaseStudy);
  const { isRTL, fontBody } = useLanguage();
  const { cmsData, loading, error } = useCms();

  useEffect(() => {
    // While light mode is disabled, ignore any saved preference and stay dark.
    const savedTheme = LIGHT_MODE_ENABLED ? localStorage.getItem('ot_theme') : null;
    if (savedTheme) {
      setIsDark(savedTheme === 'dark');
    }
    setThemeLoaded(true);
  }, []);

  // Layout effect so the theme class is on <html> before child effects run —
  // canvas/WebGL sections read color tokens from it when isDark changes.
  useLayoutEffect(() => {
    if (themeLoaded && LIGHT_MODE_ENABLED) {
      localStorage.setItem('ot_theme', isDark ? 'dark' : 'light');
    }
    document.documentElement.classList.toggle('dark', isDark);
  }, [isDark, themeLoaded]);

  // The page falls back to built-in content when the CMS can't be reached; visitors don't need to know.
  useEffect(() => {
    if (error) console.error('CMS error, using fallback content:', error);
  }, [error]);

  useEffect(() => {
    // When the section order changes, DOM nodes are reordered.
    // We must refresh ScrollTrigger so it recalculates all trigger offsets.
    import('gsap/ScrollTrigger').then(({ ScrollTrigger }) => {
      // Small timeout to ensure React has flushed the DOM updates
      setTimeout(() => {
        ScrollTrigger.refresh();
      }, 100);
    });
  }, [cmsData.sectionOrder]);

  const handleViewCase = (projectId: number, projectTitle: string) => {
    setCaseStudy({ id: projectId, title: projectTitle });
  };

  const handleCloseCase = () => {
    setCaseStudy(null);
  };

  return (
    <div
      id="app-wrapper"
      dir={isRTL ? 'rtl' : 'ltr'}
      className="min-h-screen bg-surface transition-colors duration-400 overflow-clip portfolio-mode"
    >
      {/* Global custom cursor */}
      <CustomCursor />

      <Navigation isDark={isDark} onToggleDark={() => setIsDark(d => !d)} />

      <main>
        {(cmsData.sectionOrder || ['hero', 'logoMarquee', 'whyHireMe', 'skills', 'portfolio', 'tools', 'contact', 'footer']).map(id => {
          if (!cmsData.sections[id as keyof typeof cmsData.sections]) return null;

          let section: ReactNode;
          switch(id) {
            case 'hero': section = <Hero isDark={isDark} />; break;
            case 'logoMarquee': section = <LogoMarquee isDark={isDark} />; break;
            case 'whyHireMe': section = <WhyHireMe isDark={isDark} />; break;
            case 'skills': section = <Skills isDark={isDark} />; break;
            case 'portfolio': section = <Portfolio isDark={isDark} onViewCase={handleViewCase} />; break;
            case 'tools': section = <Tools isDark={isDark} />; break;
            case 'recommendations': section = <Recommendations isDark={isDark} />; break;
            case 'contact': section = <Contact isDark={isDark} />; break;
            case 'footer': section = <Footer isDark={isDark} />; break;
            default: return null;
          }
          // One section failing (e.g. a device that refuses WebGL) drops only that section, never the page
          return <ErrorBoundary key={id} fallback={null}>{section}</ErrorBoundary>;
        })}
      </main>

      {/* Case Study overlay */}
      <AnimatePresence>
        {caseStudy && (
          <CaseStudy
            key={caseStudy.id}
            projectId={caseStudy.id}
            projectTitle={caseStudy.title}
            onClose={handleCloseCase}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
