"use client";

import { useState, useEffect } from 'react';
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

export default function Home({ initialCaseStudy = null }: { initialCaseStudy?: { id: number; title: string } | null } = {}) {
  const [isDark, setIsDark] = useState(true);
  const [themeLoaded, setThemeLoaded] = useState(false);
  const [caseStudy, setCaseStudy] = useState<{ id: number; title: string } | null>(initialCaseStudy);
  const { isRTL, fontBody } = useLanguage();
  const { cmsData, loading, error } = useCms();

  useEffect(() => {
    const savedTheme = localStorage.getItem('ot_theme');
    if (savedTheme) {
      setIsDark(savedTheme === 'dark');
    }
    setThemeLoaded(true);
  }, []);

  useEffect(() => {
    if (themeLoaded) {
      localStorage.setItem('ot_theme', isDark ? 'dark' : 'light');
    }
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'F12') {
        e.preventDefault();
      }
      if (e.ctrlKey && e.shiftKey && ['i', 'I', 'j', 'J', 'c', 'C'].includes(e.key)) {
        e.preventDefault();
      }
      if (e.ctrlKey && ['u', 'U', 's', 'S'].includes(e.key)) {
        e.preventDefault();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isDark]);

  useEffect(() => {
    document.body.style.margin = '0';
    document.body.style.padding = '0';
    document.body.style.overflowX = 'clip';
  }, []);

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

      {error && (
        <div className="p-4 bg-danger text-white text-center font-medium">
          CMS Error: {error.message}
        </div>
      )}

      <Navigation isDark={isDark} onToggleDark={() => setIsDark(d => !d)} />

      <main>
        {(cmsData.sectionOrder || ['hero', 'logoMarquee', 'whyHireMe', 'skills', 'portfolio', 'tools', 'contact', 'footer']).map(id => {
          if (!cmsData.sections[id as keyof typeof cmsData.sections]) return null;
          
          switch(id) {
            case 'hero': return <Hero key={id} isDark={isDark} />;
            case 'logoMarquee': return <LogoMarquee key={id} isDark={isDark} />;
            case 'whyHireMe': return <WhyHireMe key={id} isDark={isDark} />;
            case 'skills': return <Skills key={id} isDark={isDark} />;
            case 'portfolio': return <Portfolio key={id} isDark={isDark} onViewCase={handleViewCase} />;
            case 'tools': return <Tools key={id} isDark={isDark} />;
            case 'recommendations': return <Recommendations key={id} isDark={isDark} />;
            case 'contact': return <Contact key={id} isDark={isDark} />;
            case 'footer': return <Footer key={id} isDark={isDark} />;
            default: return null;
          }
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
