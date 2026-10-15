import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { motion, useScroll, useTransform, useSpring, useMotionValue } from 'motion/react';
import { ChevronRight } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useCms } from '../../contexts/CmsContext';

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
    accent: 'var(--color-brand)',
  },
  {
    id: 2,
    title: 'Orion Enterprise Suite',
    tags: ['Enterprise', 'Design System', 'SaaS', 'Scale'],
    image: 'https://images.unsplash.com/photo-1763568258367-1c52beb60be7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbnRlcnByaXNlJTIwc29mdHdhcmUlMjBpbnRlcmZhY2UlMjBwcm9kdWN0aXZpdHl8ZW58MXx8fHwxNzc0MTAzNDE5fDA&ixlib=rb-4.1.0&q=80&w=1080',
    accent: 'var(--color-brand)',
  },
  {
    id: 3,
    title: 'Lumina AI Product',
    tags: ['AI Product', 'Startup', 'Product Strategy'],
    image: 'https://images.unsplash.com/photo-1591381287254-b3349c60bf9b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxBSSUyMG1hY2hpbmUlMjBsZWFybmluZyUyMHByb2R1Y3QlMjBpbnRlcmZhY2UlMjBmdXR1cmlzdGljfGVufDF8fHx8MTc3NDEwMzQxOXww&ixlib=rb-4.1.0&q=80&w=1080',
    accent: 'var(--color-brand)',
  },
  {
    id: 4,
    title: 'HealthBridge Mobile App',
    tags: ['Mobile', 'Healthcare', 'Accessibility', 'UX Research'],
    image: 'https://images.unsplash.com/photo-1767449441925-737379bc2c4d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2JpbGUlMjBhcHAlMjBVWCUyMGRlc2lnbiUyMGhlYWx0aGNhcmV8ZW58MXx8fHwxNzc0MTAzNDIwfDA&ixlib=rb-4.1.0&q=80&w=1080',
    accent: 'var(--color-brand)',
  },
];

type Project = typeof PROJECTS_STATIC[0] & { desc: string };

const pillButton =
  'inline-flex items-center gap-2 self-start rounded-full border px-5 py-2.5 text-sm font-semibold transition-colors cursor-pointer';

function ProjectCard({
  project,
  index,
  onViewCase,
}: {
  project: Project;
  index: number;
  onViewCase: (projectId: number, projectTitle: string) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onViewCase(project.id, project.title)}
      onMouseEnter={() => window.dispatchEvent(new CustomEvent('portfolioHover', { detail: true }))}
      onMouseLeave={() => window.dispatchEvent(new CustomEvent('portfolioHover', { detail: false }))}
      className="group relative h-full w-[85vw] md:w-auto md:aspect-[3/2] shrink-0 snap-center overflow-hidden rounded-3xl text-start cursor-none border-none p-0 bg-surface-raised"
    >
      <Image
        src={project.image}
        alt=""
        fill
        sizes="(max-width: 768px) 85vw, 60vw"
        priority={index < 2}
        className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-scrim/80 via-scrim/15 to-transparent" />

      <div className="absolute inset-x-0 bottom-0 p-6 md:p-8">
        <h3 className="m-0 font-bold text-[clamp(1.5rem,2.4vw,2.25rem)] text-on-media tracking-tight leading-tight">
          {project.title}
        </h3>
        <div className="mt-4 flex flex-wrap gap-2">
          {project.tags.slice(0, 4).map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-on-media/20 bg-on-media/10 backdrop-blur-md px-3 py-1 text-sm font-medium text-on-media"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </button>
  );
}

export function Portfolio({ onViewCase }: PortfolioProps) {
  const { lang, isRTL } = useLanguage();
  const { cmsData } = useCms();

  const projects: Project[] = (cmsData.projects || [])
    .filter((project) => project.visible)
    .map((project, idx) => ({
      id: project.id,
      title: project.title?.[lang] || project.title?.en || '',
      tags: project.tags?.[lang] || project.tags?.en || [],
      image: project.image || PROJECTS_STATIC[idx % PROJECTS_STATIC.length].image,
      accent: project.accent || 'var(--color-brand)',
      desc: project.desc?.[lang] || project.desc?.en || '',
    }));

  const fallbackProjects: Project[] = PROJECTS_STATIC.map((project, idx) => ({
    ...project,
    desc: lang === 'en' ? `Case study ${idx + 1} description` : `وصف دراسة الحالة ${idx + 1}`,
  }));

  const renderedProjects = projects.length ? projects : fallbackProjects;

  const t = lang === 'en'
    ? {
        title: 'Selected Work',
        desc: 'A selection of apps, platforms and dashboards I designed end to end.',
        request: 'Request full portfolio',
      }
    : {
        title: 'الأعمال المختارة',
        desc: 'مجموعة من التطبيقات والمنصات ولوحات التحكم التي صممتها من البداية للنهاية.',
        request: 'طلب معرض الأعمال الكامل',
      };

  const scrollToContact = () => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });

  // ── Pinned horizontal scroll (desktop) ──
  // The section is as tall as the sideways distance the track needs to travel;
  // while it is pinned, vertical scroll progress slides the track horizontally.
  const sectionRef = useRef<HTMLElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [distance, setDistance] = useState(0);

  useEffect(() => {
    const desktopMq = window.matchMedia('(min-width: 768px)');
    const measure = () => {
      if (!trackRef.current || !viewportRef.current) return;
      setDistance(desktopMq.matches
        ? Math.max(0, trackRef.current.offsetWidth - viewportRef.current.clientWidth)
        : 0);
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (trackRef.current) ro.observe(trackRef.current);
    if (viewportRef.current) ro.observe(viewportRef.current);
    return () => ro.disconnect();
  }, [renderedProjects.length]);

  // The section's height changes once measured: let GSAP-pinned sections recalculate.
  useEffect(() => {
    import('gsap/ScrollTrigger').then(({ ScrollTrigger }) => ScrollTrigger.refresh());
  }, [distance]);

  // Distance and direction live in motion values so the scroll mapping always sees the latest ones.
  const distanceMV = useMotionValue(0);
  const directionMV = useMotionValue(isRTL ? 1 : -1);
  useEffect(() => { distanceMV.set(distance); }, [distance, distanceMV]);
  useEffect(() => { directionMV.set(isRTL ? 1 : -1); }, [isRTL, directionMV]);

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end end'] });
  const rawX = useTransform(
    [scrollYProgress, distanceMV, directionMV],
    ([p, d, dir]: number[]) => dir * p * d,
  );
  const x = useSpring(rawX, { stiffness: 260, damping: 40, mass: 0.4 });

  return (
    <section
      id="work"
      ref={sectionRef}
      className="relative w-full bg-surface transition-colors duration-300 max-md:py-24 md:h-[calc(100vh+var(--work-scroll))]"
      style={{ '--work-scroll': `${distance}px` } as React.CSSProperties}
    >
      <div
        ref={viewportRef}
        className="md:sticky md:top-0 md:h-screen md:flex md:items-center md:pt-[72px] md:overflow-hidden max-md:overflow-x-auto max-md:snap-x max-md:snap-mandatory max-md:[scrollbar-width:none]"
      >
        <motion.div
          ref={trackRef}
          style={{
            x,
            paddingInline: 'max(1.5rem, calc((100vw - 1200px) / 2 + 2.5rem))',
          }}
          className="flex w-max gap-5 md:gap-6 h-[460px] md:h-[min(64vh,600px)]"
        >
          {/* Intro card */}
          <div className="h-full w-[80vw] md:w-[340px] shrink-0 snap-center flex flex-col rounded-3xl border border-border-default bg-surface-card p-7 md:p-8">
            <h2 className="m-0 mt-auto font-bold text-[clamp(2rem,4vw,3.25rem)] text-text-primary tracking-[-0.02em] leading-[1.15]">
              {t.title}
            </h2>
            <p className="m-0 mt-auto text-base text-text-secondary leading-relaxed">{t.desc}</p>
            <button
              type="button"
              onClick={scrollToContact}
              className={`${pillButton} mt-6 border-brand/40 bg-transparent text-text-primary hover:bg-brand/10`}
            >
              {t.request}
              <ChevronRight size={16} className={isRTL ? '-scale-x-100' : ''} />
            </button>
          </div>

          {renderedProjects.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} onViewCase={onViewCase} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
