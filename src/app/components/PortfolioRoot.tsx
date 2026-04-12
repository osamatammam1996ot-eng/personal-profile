import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Navigation } from './Navigation';
import { Hero } from './Hero';
import { WhyHireMe } from './WhyHireMe';
import { Skills } from './Skills';
import { Portfolio } from './Portfolio';
import { Tools } from './Tools';
import { Contact } from './Contact';
import { Footer } from './Footer';
import { CaseStudy } from './CaseStudy';
import { LanguageProvider, useLanguage } from '../contexts/LanguageContext';
import { CmsProvider, useCms } from '../contexts/CmsContext';
import { ErrorBoundary } from './ErrorBoundary';

function AppInner() {
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
  }, [isDark]);

  useEffect(() => {
    document.documentElement.style.scrollBehavior = 'smooth';
    document.body.style.margin = '0';
    document.body.style.padding = '0';
    document.body.style.overflowX = 'hidden';
  }, []);

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
      style={{
        minHeight: '100vh',
        background: isDark ? '#080810' : '#f5f5fa',
        fontFamily: fontBody,
        transition: 'background 0.4s ease',
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
            className="fixed z-[9999] pointer-events-none flex items-center justify-center rounded-full"
            style={{
              left: cursor.x - 40,
              top: cursor.y - 40,
              width: 80,
              height: 80,
              background: 'linear-gradient(135deg,rgba(99,102,241,0.92),rgba(139,92,246,0.92))',
              backdropFilter: 'blur(8px)',
              boxShadow: '0 8px 30px rgba(99,102,241,0.5)',
            }}
          >
            <span
              style={{
                fontFamily: fontBody,
                fontWeight: 600,
                fontSize: '0.62rem',
                color: '#fff',
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
                textAlign: 'center',
                lineHeight: 1.3,
              }}
            >
              View<br />Project
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {error && (
        <div style={{ padding: '16px', background: '#ff4444', color: '#fff', textAlign: 'center' }}>
          CMS Error: {error.message}
        </div>
      )}

      <Navigation isDark={isDark} onToggleDark={() => setIsDark(d => !d)} />

      <main>
        {cmsData.sections.hero && <Hero isDark={isDark} />}
        {cmsData.sections.whyHireMe && <WhyHireMe isDark={isDark} />}
        {cmsData.sections.skills && <Skills isDark={isDark} />}
        {cmsData.sections.portfolio && (
          <Portfolio
            isDark={isDark}
            onCursorChange={handleCursorChange}
            onViewCase={handleViewCase}
          />
        )}
        {cmsData.sections.tools && <Tools isDark={isDark} />}
        {cmsData.sections.contact && <Contact isDark={isDark} />}
      </main>

      {cmsData.sections.footer && <Footer isDark={isDark} />}

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

export function PortfolioRoot() {
  return (
    <ErrorBoundary>
      <LanguageProvider>
        <CmsProvider>
          <AppInner />
        </CmsProvider>
      </LanguageProvider>
    </ErrorBoundary>
  );
}
