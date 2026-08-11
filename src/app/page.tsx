"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Navigation } from '../components/layout/Navigation';
import { Hero } from '../components/sections/Hero';
import { WhyHireMe } from '../components/sections/WhyHireMe';
import { Skills } from '../components/sections/Skills';
import { Portfolio } from '../components/sections/Portfolio';
import { Tools } from '../components/sections/Tools';
import { Contact } from '../components/sections/Contact';
import { Footer } from '../components/layout/Footer';
import { CaseStudy } from '../components/shared/CaseStudy';
import { LanguageProvider, useLanguage } from '../contexts/LanguageContext';
import { CmsProvider, useCms } from '../contexts/CmsContext';
import { ErrorBoundary } from '../components/layout/ErrorBoundary';

export default function Home() {
  const [isDark, setIsDark] = useState(true);
  const [cursor, setCursor] = useState({ visible: false, x: 0, y: 0 });
  const [caseStudy, setCaseStudy] = useState<{ id: number; title: string } | null>(null);
  const { isRTL, fontBody } = useLanguage();
  const { cmsData, loading, error } = useCms();

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };

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

    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isDark]);

  useEffect(() => {
    document.documentElement.style.scrollBehavior = 'smooth';
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

  const handleCursorChange = (visible: boolean, x: number, y: number) => {
    setCursor({ visible, x, y });
  };

  const handleViewCase = (projectId: number, projectTitle: string) => {
    setCaseStudy({ id: projectId, title: projectTitle });
  };

  const handleCloseCase = () => {
    setCaseStudy(null);
  };

  return (
    <div
      dir={isRTL ? 'rtl' : 'ltr'}
      className="min-h-screen bg-surface transition-colors duration-400 overflow-clip"
      style={{
        
        cursor: cursor.visible ? 'none' : 'default',
      }}
    >
      {/* Custom cursor for portfolio section */}
      <AnimatePresence>
        {cursor.visible && (
          <motion.div
            key="custom-cursor"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
            className="fixed z-[9999] pointer-events-none flex items-center justify-center rounded-full bg-gradient-to-br from-brand to-brand-hover opacity-90 backdrop-blur-sm shadow-[0_8px_30px_var(--color-brand)]"
            style={{
              left: cursor.x - 40,
              top: cursor.y - 40,
              width: 80,
              height: 80,
            }}
          >
            <span
              className="text-white text-center tracking-wider leading-snug font-semibold text-[0.62rem]"
            >
              View<br />Project
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {error && (
        <div className="p-4 bg-danger text-white text-center font-medium">
          CMS Error: {error.message}
        </div>
      )}

      <Navigation isDark={isDark} onToggleDark={() => setIsDark(d => !d)} />

      <main>
        {(cmsData.sectionOrder || ['hero', 'whyHireMe', 'skills', 'portfolio', 'tools', 'contact', 'footer']).map(id => {
          if (!cmsData.sections[id as keyof typeof cmsData.sections]) return null;
          
          switch(id) {
            case 'hero': return <Hero key={id} isDark={isDark} />;
            case 'whyHireMe': return <WhyHireMe key={id} isDark={isDark} />;
            case 'skills': return <Skills key={id} isDark={isDark} />;
            case 'portfolio': return <Portfolio key={id} isDark={isDark} onCursorChange={handleCursorChange} onViewCase={handleViewCase} />;
            case 'tools': return <Tools key={id} isDark={isDark} />;
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
