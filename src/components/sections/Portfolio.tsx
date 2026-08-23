import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'motion/react';
import { ArrowUpRight, ArrowRight } from 'lucide-react';
import { DecorativeShape } from '../shared/DecorativeShape';
import { useLanguage } from '../../contexts/LanguageContext';
import { useCms } from '../../contexts/CmsContext';
import { Button } from '../ui/button';

interface PortfolioProps {
  isDark: boolean;
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
  onViewCase,
}: {
  project: typeof PROJECTS_STATIC[0];
  desc: string;
  projectLabel: string;
  viewCaseLabel: string;
  isDark: boolean;
  index: number;
  onViewCase: (projectId: number, projectTitle: string) => void;
}) {
  const { lang, fontHeading, fontBody, isRTL } = useLanguage();

  const dark = isDark;

  // In LTR: even=row (image left), odd=row-reverse (image right)
  // In RTL: dir=rtl on <html> means flex-row starts from the RIGHT,
  //         so same logic naturally mirrors: even=image right, odd=image left
  const isReversed = index % 2 !== 0;

  const projectNum = isRTL
    ? String(project.id).replace(/\d/g, d => '٠١٢٣٤٥٦٧٨٩'[+d]).padStart(2, '٠')
    : String(project.id).padStart(2, '0');

  return (
    <motion.div
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
      className={`flex flex-wrap items-center gap-12 ${isReversed ? 'flex-row-reverse' : 'flex-row'}`}
    >
      {/* ── Image ── */}
      <div
        onClick={() => onViewCase(project.id, project.title)}
        className="relative overflow-hidden rounded-2xl aspect-[16/10] flex-1 min-w-[340px] cursor-none group"
        onMouseEnter={() => window.dispatchEvent(new CustomEvent('portfolioHover', { detail: true }))}
        onMouseLeave={() => window.dispatchEvent(new CustomEvent('portfolioHover', { detail: false }))}
      >
        <div className="w-full h-full relative">
          <Image
            src={project.image}
            alt={project.title}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            priority={index < 2}
            className="object-cover transition-transform duration-700 scale-110"
          />
        </div>
        {/* Hover overlay */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity duration-500"
          style={{ background: project.grad }}
        />
        {/* Corner tag — auto-flips in RTL */}
        <div className="absolute top-4 start-4 px-3 py-1.5 rounded-lg max-md:bg-black/80 max-md:backdrop-blur-none md:bg-black/50 md:backdrop-blur-md border border-white/10">
          <span className="font-medium text-sm text-white" >
            {projectLabel} {projectNum}
          </span>
        </div>
      </div>

      {/* ── Text ── */}
      <div className="flex-1 min-w-[300px] flex flex-col gap-5">
        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 rounded-full text-sm font-medium bg-brand/10 border border-brand/20 text-brand dark:text-[#a5b4fc]"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Title */}
        <h3
          className="font-bold text-[clamp(1.5rem,2.5vw,2rem)] text-text-primary tracking-tight leading-tight m-0"
          
        >
          {project.title}
        </h3>

        {/* Description */}
        <p
          className="text-lg text-text-secondary leading-relaxed m-0"
          
        >
          {desc}
        </p>

        <div className="h-px w-full bg-border-default" />

        <motion.button
          onClick={() => onViewCase(project.id, project.title)}
          className="inline-flex items-center gap-2 font-semibold text-base text-brand hover:text-brand-hover transition-colors bg-transparent border-none cursor-pointer p-0 self-start"
          
          whileHover={{ x: isRTL ? -4 : 4 }}
          transition={{ duration: 0.2 }}
        >
          {isRTL && (
            <ArrowUpRight
              size={16}
              className="shrink-0 -scale-x-100"
            />
          )}
          {viewCaseLabel}
          {!isRTL && <ArrowUpRight size={16} className="shrink-0" />}
        </motion.button>
      </div>
    </motion.div>
  );
}

export function Portfolio({ isDark, onViewCase }: PortfolioProps) {
  const { lang, fontHeading, fontBody } = useLanguage();
  const { cmsData, content } = useCms();
  const dark = isDark;

  const portfolioLabel = lang === 'en' ? 'Selected Work' : 'الأعمال المختارة';
  const projectLabel = lang === 'en' ? 'Project' : 'مشروع';
  const viewCaseLabel = lang === 'en' ? 'View Case Study' : 'عرض المشروع';
  const caseStudiesLabel =
    content.portfolio?.fields?.[`caseStudiesLabel_${lang}`] ||
    (lang === 'en' ? 'Case Studies' : 'دراسات الحالة');

  const projects = (cmsData.projects || [])
    .filter((project) => project.visible)
    .map((project, idx) => ({
      id: project.id,
      title: project.title?.[lang] || project.title?.en || '',
      tags: project.tags?.[lang] || project.tags?.en || [],
      image: project.image || PROJECTS_STATIC[idx % PROJECTS_STATIC.length].image,
      accent: project.accent || ['#6366f1', '#8b5cf6', '#06b6d4', '#a78bfa'][idx % 4],
      grad: `linear-gradient(135deg,${project.accent || ['#6366f1', '#8b5cf6', '#06b6d4', '#a78bfa'][idx % 4]}cc,${project.accent || ['#6366f1', '#8b5cf6', '#06b6d4', '#a78bfa'][idx % 4]}80)`,
      desc: project.desc?.[lang] || project.desc?.en || '',
    }));

  const fallbackProjects = PROJECTS_STATIC.map((project, idx) => ({
    ...project,
    desc: lang === 'en' ? `Case study ${idx + 1} description` : `وصف دراسة الحالة ${idx + 1}`,
  }));

  const renderedProjects = projects.length ? projects : fallbackProjects;

  return (
    <section
      id="work"
      className="relative w-full py-24 md:py-32 bg-surface transition-colors duration-300"
    >
      <div
        className="absolute inset-0 pointer-events-none opacity-5 dark:opacity-10"
        style={{
          backgroundImage: 'radial-gradient(circle at 50% 0%, var(--color-brand) 0%, transparent 60%)'
        }}
      />

      {/* Decorative 3D shape — bottom-right */}
      <DecorativeShape
        shape="octahedron"
        position="bottom-right"
        size={500}
        cropAmount={30}
        rotationOffset={[-0.3, 0.8, 0.15]}
        isDark={dark}
      />

      <div className="relative z-10 w-full max-w-[1200px] mx-auto px-6 md:px-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
          className="text-center mb-20"
        >

          <h2
            className="mt-2 font-bold text-[clamp(2rem,4vw,3.25rem)] text-text-primary tracking-tight leading-[1.15]"
            
          >
            {portfolioLabel}
          </h2>
        </motion.div>

        {/* Projects */}
        <div className="flex flex-col gap-24">
          {renderedProjects.map((project, index) => (
            <ProjectCard
              key={project.id}
              project={project}
              desc={project.desc ?? ''}
              projectLabel={projectLabel}
              viewCaseLabel={viewCaseLabel}
              isDark={dark}
              index={index}
              onViewCase={onViewCase}
            />
          ))}
        </div>

        {/* CTA: Request Full Portfolio */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
          className="flex justify-center mt-24"
        >
          <Button
            onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
            className="relative flex items-center gap-2 px-7 py-6 rounded-xl text-white font-body font-semibold text-base hover:scale-[1.04] transition-all"
            style={{
              background: 'var(--brand-gradient)',
            }}
          >
            {lang === 'en' ? 'Request full portfolio' : 'طلب معرض الأعمال الكامل'}
            <ArrowRight size={15} className={`transition-transform duration-200 ${lang === 'ar' ? '-scale-x-100' : ''}`} />
          </Button>
        </motion.div>
      </div>
    </section>
  );
}