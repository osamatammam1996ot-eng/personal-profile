import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { motion, useScroll, useTransform, useSpring, useMotionValue } from 'motion/react';
import { ChevronRight } from 'lucide-react';
import { PillButton } from '../ui/pill-button';
import { SectionTitle } from '../ui/section-title';
import { Tag } from '../ui/tag';
import { scrollToSection } from '../../lib/scroll';
import { useLanguage } from '../../contexts/LanguageContext';
import { useProjects, type Project } from '../../content/portfolio';

interface PortfolioProps {
  onViewCase: (projectId: number, projectTitle: string) => void;
}


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
            <Tag key={tag} tone="media">{tag}</Tag>
          ))}
        </div>
      </div>
    </button>
  );
}

export function Portfolio({ onViewCase }: PortfolioProps) {
  const { isRTL, t } = useLanguage();
  const renderedProjects = useProjects();

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

  // ── Sideways input (desktop/tablet) ──
  // The cards sit side by side, so people try to scroll them sideways. Trackpad side-swipes,
  // shift+wheel, tilt wheels, tablet swipes and the left/right arrow keys all drive the same
  // page scroll that vertical scrolling does, so both stay in sync. "Forward" follows the
  // reading direction: right in English, left in Arabic. Phones already swipe the row natively.
  const isRTLRef = useRef(isRTL);
  useEffect(() => { isRTLRef.current = isRTL; }, [isRTL]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || distance <= 0) return;

    const pinned = () => {
      const r = section.getBoundingClientRect();
      return r.top <= 2 && r.bottom >= window.innerHeight - 2;
    };
    // Move along the section by `forward` px (positive = next cards), kept inside the section
    const advance = (forward: number, behavior: ScrollBehavior = 'instant' as ScrollBehavior) => {
      const top = section.getBoundingClientRect().top + window.scrollY;
      const y = Math.min(top + distance, Math.max(top, window.scrollY + forward));
      if (Math.abs(y - window.scrollY) >= 0.5) window.scrollTo({ top: y, behavior });
    };
    // A physical sideways movement (positive = towards the right): next cards are to the right
    // in English and to the left in Arabic
    const move = (dx: number, behavior?: ScrollBehavior) => advance(isRTLRef.current ? -dx : dx, behavior);

    const onWheel = (e: WheelEvent) => {
      const scale = e.deltaMode === 1 ? 40 : 1;
      if (e.shiftKey) {
        // Shift + mouse wheel: wheel down = next cards in either language, however the browser
        // reports it (some turn it into deltaX, some keep deltaY)
        const amount = e.deltaX || e.deltaY;
        if (!amount || !pinned()) return;
        e.preventDefault();
        advance(amount * scale);
        return;
      }
      if (!e.deltaX || Math.abs(e.deltaX) <= Math.abs(e.deltaY) || !pinned()) return; // mostly vertical: native
      e.preventDefault(); // also keeps the browser's back/forward swipe from firing here
      move(e.deltaX * scale);
    };

    // Tablets: a mostly-sideways swipe moves the row, with a little momentum after release
    let startX = 0, startY = 0, lastX = 0, lastT = 0, velocity = 0, sideways: boolean | null = null, glide = 0;
    const onTouchStart = (e: TouchEvent) => {
      cancelAnimationFrame(glide);
      const t = e.touches[0];
      startX = lastX = t.clientX; startY = t.clientY; lastT = performance.now();
      velocity = 0; sideways = null;
    };
    const onTouchMove = (e: TouchEvent) => {
      const t = e.touches[0];
      if (sideways === null) {
        const mx = Math.abs(t.clientX - startX), my = Math.abs(t.clientY - startY);
        if (mx < 8 && my < 8) return;
        sideways = mx > my && pinned();
      }
      if (!sideways) return;
      e.preventDefault();
      const now = performance.now();
      const step = lastX - t.clientX; // finger moving left = content moving left = towards the right
      velocity = step / Math.max(1, now - lastT);
      lastX = t.clientX; lastT = now;
      move(step);
    };
    const onTouchEnd = () => {
      if (!sideways) return;
      let v = velocity * 16;
      const tick = () => {
        if (Math.abs(v) < 0.5) return;
        move(v);
        v *= 0.92;
        glide = requestAnimationFrame(tick);
      };
      glide = requestAnimationFrame(tick);
    };

    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
      const t = e.target as HTMLElement | null;
      if (t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName))) return;
      if (!pinned()) return;
      e.preventDefault();
      move((e.key === 'ArrowRight' ? 1 : -1) * window.innerWidth * 0.45, 'smooth');
    };

    section.addEventListener('wheel', onWheel, { passive: false });
    section.addEventListener('touchstart', onTouchStart, { passive: true });
    section.addEventListener('touchmove', onTouchMove, { passive: false });
    section.addEventListener('touchend', onTouchEnd, { passive: true });
    window.addEventListener('keydown', onKey);
    return () => {
      cancelAnimationFrame(glide);
      section.removeEventListener('wheel', onWheel);
      section.removeEventListener('touchstart', onTouchStart);
      section.removeEventListener('touchmove', onTouchMove);
      section.removeEventListener('touchend', onTouchEnd);
      window.removeEventListener('keydown', onKey);
    };
  }, [distance]);

  return (
    <section
      id="work"
      ref={sectionRef}
      className="relative w-full bg-surface transition-colors duration-300 max-md:py-24 md:h-[calc(100vh+var(--work-scroll))] md:touch-pan-y"
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
            <SectionTitle className="mt-auto">{t.portfolio.title}</SectionTitle>
            <p className="m-0 mt-auto text-base text-text-secondary leading-relaxed">{t.portfolio.desc}</p>
            <PillButton tone="outline" onClick={() => scrollToSection('contact')} className="mt-6 self-start">
              {t.portfolio.request}
              <ChevronRight size={16} className="rtl:-scale-x-100" />
            </PillButton>
          </div>

          {renderedProjects.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} onViewCase={onViewCase} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
