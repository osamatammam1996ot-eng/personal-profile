import { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useCms } from '../contexts/CmsContext';

interface PortfolioProps {
  isDark: boolean;
  onCursorChange: (visible: boolean, x: number, y: number) => void;
  onViewCase: (projectId: number, projectTitle: string) => void;
}

const PROJECTS_STATIC = [
  {
    id: 1,
    title: 'Nexus Analytics Platform',
    tags: ['SaaS', 'AI', 'Data Viz', 'B2B'],
    image: 'https://images.unsplash.com/photo-1575388902449-6bca946ad549?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxTYWFTJTIwZGFzaGJvYXJkJTIwVUklMjBkZXNpZ24lMjBkYXJrJTIwYXBwfGVufDF8fHx8MTc3NDEwMzQxOHww&ixlib=rb-4.1.0&q=80&w=1080',
    accent: '#6366f1',
    grad: 'linear-gradient(135deg,rgba(99,102,241,0.8),rgba(139,92,246,0.5))',
  },
  {
    id: 2,
    title: 'Orion Enterprise Suite',
    tags: ['Enterprise', 'Design System', 'SaaS', 'Scale'],
    image: 'https://images.unsplash.com/photo-1763568258367-1c52beb60be7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbnRlcnByaXNlJTIwc29mdHdhcmUlMjBpbnRlcmZhY2UlMjBwcm9kdWN0aXZpdHl8ZW58MXx8fHwxNzc0MTAzNDE5fDA&ixlib=rb-4.1.0&q=80&w=1080',
    accent: '#8b5cf6',
    grad: 'linear-gradient(135deg,rgba(139,92,246,0.8),rgba(167,139,250,0.5))',
  },
  {
    id: 3,
    title: 'Lumina AI Product',
    tags: ['AI Product', 'Startup', 'Product Strategy'],
    image: 'https://images.unsplash.com/photo-1591381287254-b3349c60bf9b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxBSSUyMG1hY2hpbmUlMjBsZWFybmluZyUyMHByb2R1Y3QlMjBpbnRlcmZhY2UlMjBmdXR1cmlzdGljfGVufDF8fHx8MTc3NDEwMzQxOXww&ixlib=rb-4.1.0&q=80&w=1080',
    accent: '#06b6d4',
    grad: 'linear-gradient(135deg,rgba(6,182,212,0.8),rgba(99,102,241,0.5))',
  },
  {
    id: 4,
    title: 'HealthBridge Mobile App',
    tags: ['Mobile', 'Healthcare', 'Accessibility', 'UX Research'],
    image: 'https://images.unsplash.com/photo-1767449441925-737379bc2c4d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2JpbGUlMjBhcHAlMjBVWCUyMGRlc2lnbiUyMGhlYWx0aGNhcmV8ZW58MXx8fHwxNzc0MTAzNDIwfDA&ixlib=rb-4.1.0&q=80&w=1080',
    accent: '#a78bfa',
    grad: 'linear-gradient(135deg,rgba(167,139,250,0.8),rgba(139,92,246,0.5))',
  },
];

function ProjectCard({
  project,
  desc,
  projectLabel,
  viewCaseLabel,
  isDark,
  index,
  onCursorChange,
  onViewCase,
}: {
  project: typeof PROJECTS_STATIC[0];
  desc: string;
  projectLabel: string;
  viewCaseLabel: string;
  isDark: boolean;
  index: number;
  onCursorChange: (visible: boolean, x: number, y: number) => void;
  onViewCase: (projectId: number, projectTitle: string) => void;
}) {
  const { lang, fontHeading, fontBody, isRTL } = useLanguage();
  const sectionRef = useRef<HTMLDivElement>(null);
  const [parallaxOffset, setParallaxOffset] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const center = rect.top + rect.height / 2 - window.innerHeight / 2;
      setParallaxOffset(center * 0.12);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const dark = isDark;

  // In LTR: even=row (image left), odd=row-reverse (image right)
  // In RTL: dir=rtl on <html> means flex-row starts from the RIGHT,
  //         so same logic naturally mirrors: even=image right, odd=image left
  const isReversed = index % 2 !== 0;

  const projectNum = isRTL
    ? String(project.id).replace(/\d/g, d => '٠٢٣٤٥٦٧٨٩'[+d]).padStart(2, '٠')
    : String(project.id).padStart(2, '0');

  return (
    <motion.div
      ref={sectionRef}
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
      // Use flex instead of grid + direction tricks so RTL dir="rtl" handles the mirroring
      style={{
        display: 'flex',
        flexDirection: isReversed ? 'row-reverse' : 'row',
        gap: '3rem',
        alignItems: 'center',
        flexWrap: 'wrap',
      }}
    >
      {/* ── Image ── */}
      <div
        style={{
          position: 'relative',
          overflow: 'hidden',
          borderRadius: '1rem',
          aspectRatio: '16/10',
          flex: '1 1 340px',
          cursor: 'none',
        }}
        onMouseMove={(e) => onCursorChange(true, e.clientX, e.clientY)}
        onMouseLeave={() => onCursorChange(false, 0, 0)}
      >
        <div
          style={{ width: '100%', height: '100%', transform: `translateY(${parallaxOffset}px)`, transition: 'transform 0.1s linear' }}
        >
          <img
            src={project.image}
            alt={project.title}
            style={{ width: '100%', objectFit: 'cover', height: '110%', marginTop: '-5%', transition: 'transform 0.7s ease' }}
          />
        </div>
        {/* Hover overlay */}
        <div
          className="group-hover:opacity-100"
          style={{ position: 'absolute', inset: 0, opacity: 0, background: project.grad, borderRadius: '1rem', transition: 'opacity 0.5s ease' }}
        />
        {/* Corner tag — uses insetInlineStart so it auto-flips in RTL */}
        <div
          style={{
            position: 'absolute',
            top: 16,
            insetInlineStart: 16,
            padding: '6px 12px',
            borderRadius: '0.5rem',
            background: 'rgba(0,0,0,0.5)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255,255,255,0.1)',
          }}
        >
          <span style={{ fontFamily: fontBody, fontWeight: 500, fontSize: '0.75rem', color: '#fff' }}>
            {projectLabel} {projectNum}
          </span>
        </div>
      </div>

      {/* ── Text ── */}
      <div
        style={{
          flex: '1 1 300px',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.25rem',
          // Text alignment follows the HTML dir attribute — no override needed
        }}
      >
        {/* Tags */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
          {project.tags.map((tag) => (
            <span
              key={tag}
              style={{
                padding: '4px 12px',
                borderRadius: '9999px',
                fontSize: '0.75rem',
                background: dark ? 'rgba(99,102,241,0.12)' : 'rgba(99,102,241,0.08)',
                border: `1px solid ${dark ? 'rgba(99,102,241,0.25)' : 'rgba(99,102,241,0.2)'}`,
                color: dark ? '#a5b4fc' : '#6366f1',
                fontFamily: 'Inter, sans-serif',
                fontWeight: 500,
              }}
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Title — product names stay in English */}
        <h3
          style={{
            fontFamily: fontHeading,
            fontWeight: 700,
            fontSize: 'clamp(1.5rem,2.5vw,2rem)',
            color: dark ? '#f0f0ff' : '#0f0f1e',
            letterSpacing: '-0.02em',
            lineHeight: 1.2,
            margin: 0,
          }}
        >
          {project.title}
        </h3>

        {/* Description */}
        <p
          style={{
            fontFamily: fontBody,
            fontWeight: 400,
            fontSize: '0.95rem',
            color: dark ? 'rgba(255,255,255,0.55)' : 'rgba(0,0,0,0.55)',
            lineHeight: 1.75,
            margin: 0,
          }}
        >
          {desc}
        </p>

        <div style={{ height: 1, background: dark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.07)' }} />

        {/* CTA */}
        <motion.button
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontFamily: fontBody,
            fontWeight: 600,
            fontSize: '0.9rem',
            color: dark ? '#a5b4fc' : '#6366f1',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: 0,
            // Align to the inline-start so it sits at the text edge in both LTR and RTL
            alignSelf: 'flex-start',
          }}
          whileHover={{ x: isRTL ? -4 : 4 }}
          transition={{ duration: 0.2 }}
          onClick={() => onViewCase(project.id, project.title)}
        >
          {isRTL && (
            <ArrowUpRight
              size={16}
              style={{ transform: 'scaleX(-1)', flexShrink: 0 }}
            />
          )}
          {viewCaseLabel}
          {!isRTL && <ArrowUpRight size={16} style={{ flexShrink: 0 }} />}
        </motion.button>
      </div>
    </motion.div>
  );
}

export function Portfolio({ isDark, onCursorChange, onViewCase }: PortfolioProps) {
  const { lang, fontHeading, fontBody } = useLanguage();
  const { cmsData, content } = useCms();
  const dark = isDark;

  const portfolioLabel = lang === 'en' ? 'Selected Work' : 'الأعمال المختارة';
  const portfolioHeading1 = lang === 'en' ? 'Products I helped' : 'المنتجات التي ساعدت بها';
  const portfolioHeading2 = lang === 'en' ? 'go from stuck to shipped.' : 'من محطة إلى الشحن';
  const projectLabel = lang === 'en' ? 'Project' : 'مشروع';
  const viewCaseLabel = lang === 'en' ? 'View Case' : 'عرض الحالة';
  const caseStudiesLabel =
    content.portfolio?.fields?.[`caseStudiesLabel_${lang}`] ||
    (lang === 'en' ? 'Case Studies' : 'دراسات الحالة');

  const projects = (cmsData.projects || [])
    .filter((project) => project.visible)
    .map((project, idx) => ({
      id: project.id,
      title: project.title[lang] || project.title.en,
      tags: project.tags[lang] || [],
      image: project.image || PROJECTS_STATIC[idx % PROJECTS_STATIC.length].image,
      accent: project.accent || ['#6366f1', '#8b5cf6', '#06b6d4', '#a78bfa'][idx % 4],
      grad: `linear-gradient(135deg,${project.accent || ['#6366f1', '#8b5cf6', '#06b6d4', '#a78bfa'][idx % 4]}cc,${project.accent || ['#6366f1', '#8b5cf6', '#06b6d4', '#a78bfa'][idx % 4]}80)`,
      desc: project.desc[lang] || project.desc.en,
    }));

  const fallbackProjects = PROJECTS_STATIC.map((project, idx) => ({
    ...project,
    desc: lang === 'en' ? `Case study ${idx + 1} description` : `وصف دراسة الحالة ${idx + 1}`,
  }));

  const renderedProjects = projects.length ? projects : fallbackProjects;

  return (
    <section
      id="work"
      className="relative w-full py-24 md:py-32 overflow-hidden"
      style={{ background: dark ? '#0c0c18' : '#eeeef6' }}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: dark
            ? 'radial-gradient(circle at 50% 0%, rgba(99,102,241,0.1) 0%, transparent 60%)'
            : 'radial-gradient(circle at 50% 0%, rgba(99,102,241,0.07) 0%, transparent 60%)',
        }}
      />

      <div className="relative max-w-[1200px] mx-auto px-6 md:px-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
          className="text-center mb-20"
        >
          <span
            className="inline-block px-4 py-1.5 rounded-full text-sm mb-4"
            style={{
              background: dark ? 'rgba(99,102,241,0.15)' : 'rgba(99,102,241,0.1)',
              border: `1px solid ${dark ? 'rgba(99,102,241,0.3)' : 'rgba(99,102,241,0.25)'}`,
              color: dark ? '#a5b4fc' : '#6366f1',
              fontFamily: fontBody,
              fontWeight: 500,
            }}
          >
            {caseStudiesLabel}
          </span>
          <h2
            className="mt-2"
            style={{
              fontFamily: fontHeading,
              fontWeight: 700,
              fontSize: 'clamp(2rem,4vw,3.25rem)',
              color: dark ? '#f0f0ff' : '#0f0f1e',
              letterSpacing: '-0.02em',
              lineHeight: 1.15,
            }}
          >
            {portfolioLabel}
          </h2>
        </motion.div>

        {/* Projects */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6rem' }}>
          {renderedProjects.map((project, index) => (
            <ProjectCard
              key={project.id}
              project={project}
              desc={project.desc ?? ''}
              projectLabel={projectLabel}
              viewCaseLabel={viewCaseLabel}
              isDark={dark}
              index={index}
              onCursorChange={onCursorChange}
              onViewCase={onViewCase}
            />
          ))}
        </div>
      </div>
    </section>
  );
}