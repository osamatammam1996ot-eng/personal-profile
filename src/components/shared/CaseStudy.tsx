import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ArrowLeft, ArrowUpRight, ChevronRight, Play, Maximize2, ZoomIn } from 'lucide-react';
import { DecorativeShape } from './DecorativeShape';
import { useCms } from '../../contexts/CmsContext';
import { useLanguage } from '../../contexts/LanguageContext';

interface CaseStudyProps {
  projectId: number;
  projectTitle: string;
  onClose: () => void;
}

const ACCENT = 'var(--brand)';
const ACCENT2 = 'var(--brand-hover)';
const BG = 'var(--background)';
const BG2 = 'var(--surface)';

const IMG_RESEARCH = `https://images.unsplash.com/photo-1565687950692-520fa91191d0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1c2VyJTIwcmVzZWFyY2glMjBzdGlja3klMjBub3RlcyUyMHdoaXRlYm9hcmQlMjB0ZWFtfGVufDF8fHx8MTc3NDYzNDk2Mnww&ixlib=rb-4.1.0&q=80&w=1080`;
const IMG_WIREFRAME = `https://images.unsplash.com/photo-1715528233539-5fe70a4e0d71?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxVWCUyMHdpcmVmcmFtZSUyMHNrZXRjaGVzJTIwcGFwZXIlMjBsb3clMjBmaWRlbGl0eXxlbnwxfHx8fDE3NzQ2MzQ5NjF8MA&ixlib=rb-4.1.0&q=80&w=1080`;

function SectionLabel({ children }: { children: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 32 }}>
      <span style={{
         fontWeight: 700, fontSize: '0.7rem',
        letterSpacing: '0.18em', textTransform: 'uppercase' as const,
        color: ACCENT, opacity: 0.9,
      }}>{children}</span>
      <div style={{ flex: 1, height: 1, background: 'linear-gradient(to right,rgba(99,102,241,0.4),transparent)' }} />
    </div>
  );
}

function GlowDot() {
  return (
    <div style={{
      width: 8, height: 8, borderRadius: '50%', flexShrink: 0, marginTop: 6,
      background: ACCENT, boxShadow: `0 0 12px ${ACCENT}`,
    }} />
  );
}

export function CaseStudy({ projectId, onClose }: CaseStudyProps) {
  const { cmsData } = useCms();
  const { lang } = useLanguage();
  
  const rawData = cmsData.caseStudies.find(c => c.id === projectId);
  
  const t = (val: any) => (val && typeof val === 'object' && ('en' in val || 'ar' in val)) ? val[lang] || val.en || '' : val;
  const toArr = (val: any) => Array.isArray(val) ? val : (typeof val === 'string' ? val.split(',').map(s=>s.trim()).filter(Boolean) : []);
  const toArrDot = (val: any) => Array.isArray(val) ? val : (typeof val === 'string' ? val.split('.').map(s=>s.trim()).filter(Boolean) : []);
  
  const data = rawData ? {
    ...rawData,
    title: t(rawData?.title),
    tagline: t(rawData?.tagline),
    meta: {
      role: t(rawData?.meta?.role),
      timeline: t(rawData?.meta?.timeline),
      team: t(rawData?.meta?.team),
      industry: t(rawData?.meta?.industry),
    },
    metrics: (rawData?.metrics || []).map(m => ({ value: m.value, label: t(m.label), sub: t(m.sub) })),
    problem: {
      narrative: t(rawData?.problem?.narrative),
      painPoints: (rawData?.problem?.painPoints || []).map(p => ({ icon: p.icon, title: t(p.title), desc: t(p.desc) }))
    },
    research: {
      methods: toArr(t(rawData?.research?.methods)),
      insights: (rawData?.research?.insights || []).map(i => ({ id: i.id, quote: t(i.quote), author: t(i.author), theme: t(i.theme) })),
      findings: toArr(t(rawData?.research?.findings))
    },
    process: {
      steps: (rawData?.process?.steps || []).map(s => ({ phase: s.phase, title: t(s.title), duration: t(s.duration), desc: t(s.desc) })),
      tradeoffs: (rawData?.process?.tradeoffs || []).map(t2 => ({ decision: t(t2.decision), rationale: t(t2.rationale) }))
    },
    solution: {
      screens: (rawData?.solution?.screens || []).map(s => ({ title: t(s.title), desc: t(s.desc), image: s.image, callouts: toArr(t(s.callouts)), align: s.align }))
    },
    screenshots: (rawData?.screenshots || []).map(s => ({ image: s.image, caption: t(s.caption), tag: t(s.tag) })),
    video: rawData?.video ? {
      url: rawData.video.url || '',
      youtubeId: rawData.video.youtubeId || '',
      title: t(rawData.video.title),
      desc: t(rawData.video.desc),
      duration: rawData.video.duration || ''
    } : { url: '', youtubeId: '', title: '', desc: '', duration: '' },
    results: rawData?.results ? {
      metrics: (rawData.results.metrics || []).map(m => ({ value: m.value, label: t(m.label), sub: t(m.sub) })),
      quote: rawData.results.quote ? { text: t(rawData.results.quote.text), author: t(rawData.results.quote.author), role: t(rawData.results.quote.role) } : { text: '', author: '', role: '' }
    } : { metrics: [], quote: { text: '', author: '', role: '' } },
    reflection: rawData?.reflection ? {
      summary: t(rawData.reflection.summary),
      lessons: toArrDot(t(rawData.reflection.lessons)),
      next: toArrDot(t(rawData.reflection.next))
    } : { summary: '', lessons: [], next: [] },
    settings: rawData?.settings || { showProblem: true, showResearch: true, showProcess: true, showSolution: true, showMedia: true, showResults: true, showReflection: true },
    labels: rawData?.labels ? {
      overview: t(rawData.labels.overview),
      problem: t(rawData.labels.problem),
      research: t(rawData.labels.research),
      process: t(rawData.labels.process),
      solution: t(rawData.labels.solution),
      media: t(rawData.labels.media),
      results: t(rawData.labels.results),
      reflection: t(rawData.labels.reflection)
    } : { overview: 'Overview', problem: 'The Problem', research: 'Research & Discovery', process: 'Design Process', solution: 'The Solution', media: 'Walkthrough', results: 'Results & Impact', reflection: 'Reflection' }
  } : null as any;

  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeStep, setActiveStep] = useState(0);
  const [lightbox, setLightbox] = useState<{ src: string; caption: string } | null>(null);
  const [videoPlaying, setVideoPlaying] = useState(false);
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains('dark'));
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains('dark'));
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  // Guard against missing data
  if (!data || !data.process || !Array.isArray(data.process.tradeoffs)) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{ position: 'fixed', inset: 0, zIndex: 200, background: BG, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        <button
          onClick={onClose}
          style={{
            position: 'fixed', top: 32, right: 32, zIndex: 205,
            width: 40, height: 40, borderRadius: 8,
            background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.3)',
            color: 'var(--brand)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 20
          }}
        >
          ✕
        </button>
        <div style={{ color: 'var(--text-primary)',  textAlign: 'center' }}>
          <p>Case study data not found</p>
        </div>
      </motion.div>
    );
  }

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { setLightbox(null); setVideoPlaying(false); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const onScroll = () => {
      const p = el.scrollTop / (el.scrollHeight - el.clientHeight);
      setScrollProgress(Math.min(p, 1));
    };
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => el.removeEventListener('scroll', onScroll);
  }, []);

  if (!data) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      style={{ position: 'fixed', inset: 0, zIndex: 200, background: BG, overflow: 'hidden' }}
    >
        {/* Decorative 3D shape */}
        <DecorativeShape
          shape="torusKnot"
          position="top-right"
          size={460}
          cropAmount={22}
          rotationOffset={[0.2, 0.4, -0.3]}
          isDark={isDark}
        />

        {/* Scroll progress bar */}
        <motion.div
          style={{
            position: 'fixed', top: 0, left: 0, right: 0, height: 2, zIndex: 210,
            background: `linear-gradient(to right,${ACCENT},${ACCENT2})`,
            transformOrigin: 'left', scaleX: scrollProgress,
          }}
        />

        {/* Top bar */}
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 205, height: 60,
          background: 'var(--surface-glass)', backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(99,102,241,0.1)',
          display: 'flex', alignItems: 'center', padding: '0 32px', gap: 16,
        }}>
          <motion.button
            onClick={onClose}
            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.25)',
              borderRadius: 10, padding: '8px 16px', color: 'var(--brand)', cursor: 'pointer',
               fontWeight: 500, fontSize: '0.82rem',
            }}
          >
            <ArrowLeft size={14} /> Back to Work
          </motion.button>
          <div style={{ flex: 1 }} />
          <span style={{  fontWeight: 600, fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            {data.title}
          </span>
          <motion.button
            onClick={onClose}
            whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
            style={{
              width: 36, height: 36, borderRadius: 10,
              background: 'var(--surface-elevated)', border: '1px solid var(--border-default)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', color: 'var(--text-secondary)',
            }}
          >
            <X size={16} />
          </motion.button>
        </div>

        {/* Scrollable content */}
        <div ref={scrollRef} style={{ height: '100vh', overflowY: 'auto', overflowX: 'hidden' }}>
          <div style={{ paddingTop: 60 }}>

            {/* ═══════════════════════════════════════════════════ HERO */}
            <section style={{
              position: 'relative', minHeight: '92vh',
              display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
              padding: 'clamp(40px,6vw,80px)', paddingBottom: 80, overflow: 'hidden',
            }}>
              <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
                <div style={{
                  position: 'absolute', inset: 0,
                  backgroundImage: `linear-gradient(rgba(99,102,241,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(99,102,241,0.04) 1px,transparent 1px)`,
                  backgroundSize: '60px 60px',
                }} />
                <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(ellipse 80% 60% at 50% 100%,rgba(99,102,241,0.12),transparent)` }} />
                <div style={{
                  position: 'absolute', top: '20%', right: '10%', width: 400, height: 400, borderRadius: '50%',
                  background: `radial-gradient(circle,rgba(139,92,246,0.08),transparent 70%)`, filter: 'blur(40px)',
                }} />
              </div>

              <div style={{ position: 'relative', zIndex: 1, maxWidth: 1100, margin: '0 auto', width: '100%' }}>
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
                  style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 32 }}>
                  <div style={{ padding: '6px 14px', borderRadius: 100, background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.3)' }}>
                    <span style={{  fontWeight: 600, fontSize: '0.72rem', color: 'var(--brand)', letterSpacing: '0.1em', textTransform: 'uppercase' as const }}>Case Study</span>
                  </div>
                  <div style={{ width: 40, height: 1, background: 'rgba(99,102,241,0.4)' }} />
                  <span style={{  fontSize: '0.8rem', color: 'var(--border-strong)', letterSpacing: '0.04em' }}>{data.meta.industry}</span>
                </motion.div>

                <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.2 }}
                  style={{  fontWeight: 700, fontSize: 'clamp(2.8rem,7vw,6rem)', lineHeight: 1.05, letterSpacing: '-0.03em', color: 'var(--text-primary)', margin: '0 0 24px', maxWidth: 900 }}>
                  {data.title}
                </motion.h1>

                <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.35 }}
                  style={{  fontWeight: 400, fontSize: 'clamp(1rem,1.6vw,1.25rem)', color: 'var(--text-muted)', lineHeight: 1.6, maxWidth: 640, margin: '0 0 56px' }}>
                  {data.tagline}
                </motion.p>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.5 }}
                  style={{ display: 'flex', gap: 24, flexWrap: 'wrap' as const, alignItems: 'stretch' }}>
                  {/* Metadata */}
                  <div style={{ display: 'flex', background: 'var(--surface-elevated)', border: '1px solid var(--border-default)', borderRadius: 16, overflow: 'hidden', flex: '0 0 auto' }}>
                    {[{ label: 'Role', value: data.meta.role }, { label: 'Timeline', value: data.meta.timeline }, { label: 'Team', value: data.meta.team }].map((item, i, arr) => (
                      <div key={item.label} style={{ padding: '20px 28px', borderRight: i < arr.length - 1 ? '1px solid var(--border-default)' : 'none' }}>
                        <div style={{  fontSize: '0.68rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase' as const, color: 'var(--border-strong)', marginBottom: 6 }}>{item.label}</div>
                        <div style={{  fontWeight: 600, fontSize: '0.88rem', color: 'var(--text-primary)' }}>{item.value}</div>
                      </div>
                    ))}
                  </div>
                  {/* Metrics */}
                  <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' as const }}>
                    {(data?.metrics || []).map((m: any, i: number) => (
                      <motion.div key={m.label} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.55 + i * 0.07 }}
                        style={{ padding: '20px 24px', borderRadius: 16, background: 'color-mix(in srgb, var(--color-brand) 8%, transparent)', border: '1px solid color-mix(in srgb, var(--color-brand) 30%, transparent)', boxShadow: '0 4px 24px color-mix(in srgb, var(--color-brand) 10%, transparent)', minWidth: 110 }}>
                        <div style={{  fontWeight: 700, fontSize: 'clamp(1.4rem,2.5vw,1.9rem)', background: 'var(--brand-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', lineHeight: 1.1 }}>{m.value}</div>
                        <div style={{  fontSize: '0.72rem', color: 'var(--text-secondary)', marginTop: 4, fontWeight: 500 }}>{m.label}</div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </div>

              <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
                style={{ position: 'absolute', bottom: 32, left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, color: 'var(--border-strong)' }}>
                <span style={{  fontSize: '0.65rem', letterSpacing: '0.1em', textTransform: 'uppercase' as const }}>Scroll</span>
                <div style={{ width: 1, height: 32, background: 'linear-gradient(to bottom,var(--border-strong),transparent)' }} />
              </motion.div>
            </section>

            <div style={{ height: 1, background: 'linear-gradient(to right,transparent,rgba(99,102,241,0.3),rgba(139,92,246,0.3),transparent)', margin: '0 clamp(24px,5vw,80px)' }} />

            {/* ═══════════════════════════════════════════════ PROBLEM */}
            {data.settings.showProblem && (
<section style={{ padding: 'clamp(60px,8vw,120px) clamp(24px,6vw,80px)', background: BG }}>
              <div style={{ maxWidth: 1100, margin: '0 auto' }}>
                <SectionLabel>01 — The Problem</SectionLabel>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: 64 }}>
                  <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: '-80px' }} transition={{ duration: 0.7 }}>
                    <h2 style={{  fontWeight: 700, fontSize: 'clamp(1.8rem,3vw,2.8rem)', lineHeight: 1.15, letterSpacing: '-0.025em', color: 'var(--text-primary)', margin: '0 0 28px' }}>
                      The interface was{' '}<span style={{ color: ACCENT }}>getting in the way.</span>
                    </h2>
                    <p style={{  fontSize: '1.05rem', lineHeight: 1.8, color: 'var(--text-muted)', margin: 0 }}>{data.problem.narrative}</p>
                    <div style={{ marginTop: 40, display: 'flex', flexDirection: 'column', gap: 16 }}>
                      {(data?.research?.findings || []).map((f: any, i: number) => (
                        <motion.div key={i} initial={{ opacity: 0, x: -16 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                          <GlowDot />
                          <span style={{  fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{f}</span>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    {(data?.problem?.painPoints || []).map((p: any, i: number) => (
                      <motion.div key={p.title} initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: '-60px' }} transition={{ delay: i * 0.08, duration: 0.5 }}
                        whileHover={{ x: 4 }}
                        style={{ padding: '20px 24px', borderRadius: 14, background: 'var(--surface-elevated)', border: '1px solid var(--border-default)', display: 'flex', gap: 18, alignItems: 'flex-start', cursor: 'default', transition: 'all 0.2s ease' }}>
                        <span style={{ fontSize: '1.2rem', opacity: 0.7, flexShrink: 0 }}>{p.icon}</span>
                        <div>
                          <div style={{  fontWeight: 600, fontSize: '0.92rem', color: 'var(--text-primary)', marginBottom: 4 }}>{p.title}</div>
                          <div style={{  fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{p.desc}</div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </section>
)}

            {/* ═══════════════════════════════════════════════ RESEARCH */}
            {data.settings.showResearch && (
<section style={{ padding: 'clamp(60px,8vw,120px) clamp(24px,6vw,80px)', background: BG2 }}>
              <div style={{ maxWidth: 1100, margin: '0 auto' }}>
                <SectionLabel>02 — Research & Insights</SectionLabel>
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' as const, marginBottom: 60 }}>
                  {(data?.research?.methods || []).map((m: any, i: number) => (
                    <motion.span key={m} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }}
                      style={{ padding: '8px 16px', borderRadius: 100,  fontWeight: 500, fontSize: '0.78rem', color: 'var(--brand)', background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)' }}>
                      {m}
                    </motion.span>
                  ))}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 20, marginBottom: 64 }}>
                  {(data?.research?.insights || []).map((ins: any, i: number) => (
                    <motion.div key={ins.id} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-60px' }} transition={{ delay: i * 0.1, duration: 0.6 }}
                      style={{ padding: '28px 28px 24px', borderRadius: 18, background: 'rgba(99,102,241,0.05)', border: '1px solid rgba(99,102,241,0.15)', position: 'relative', overflow: 'hidden' }}>
                      <div style={{ position: 'absolute', top: 12, right: 20,  fontSize: '5rem', lineHeight: 1, color: 'rgba(99,102,241,0.08)', userSelect: 'none' as const }}>"</div>
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '3px 10px', borderRadius: 100, background: 'rgba(99,102,241,0.15)', marginBottom: 18 }}>
                        <span style={{  fontWeight: 700, fontSize: '0.65rem', color: ACCENT, letterSpacing: '0.08em' }}>{ins.id}</span>
                        <div style={{ width: 1, height: 10, background: 'rgba(99,102,241,0.3)' }} />
                        <span style={{  fontWeight: 500, fontSize: '0.65rem', color: 'rgba(165,180,252,0.7)', letterSpacing: '0.06em', textTransform: 'uppercase' as const }}>{ins.theme}</span>
                      </div>
                      <blockquote style={{  fontStyle: 'italic', fontSize: '0.92rem', lineHeight: 1.7, color: 'var(--text-secondary)', margin: '0 0 20px' }}>{ins.quote}</blockquote>
                      <div style={{  fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 500 }}>— {ins.author}</div>
                    </motion.div>
                  ))}
                </div>

                {data.research.insights.length > 0 && (
                  <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}
                    style={{ borderRadius: 20, overflow: 'hidden', border: '1px solid var(--border-default)', position: 'relative', height: 340 }}>
                    <img src={IMG_RESEARCH} alt="Research session" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.65 }} />
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right,var(--surface),transparent)', display: 'flex', alignItems: 'center', padding: '0 48px' }}>
                      <div>
                        <div style={{  fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase' as const, color: ACCENT, marginBottom: 12 }}>From the Field</div>
                        <p style={{  fontWeight: 600, fontSize: 'clamp(1rem,2vw,1.5rem)', color: 'var(--text-primary)', lineHeight: 1.4, maxWidth: 480, margin: 0 }}>{data.research.insights[0].quote}</p>
                        <div style={{ marginTop: 16,  fontSize: '0.82rem', color: 'var(--text-secondary)' }}>— {data.research.insights[0].author}</div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            </section>
)}

            {/* ═══════════════════════════════════════════ DESIGN PROCESS */}
            <section style={{ padding: 'clamp(60px,8vw,120px) clamp(24px,6vw,80px)', background: BG }}>
              <div style={{ maxWidth: 1100, margin: '0 auto' }}>
                <SectionLabel>03 — Design Process</SectionLabel>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: 60, marginBottom: 80 }}>
                  <div>
                    <h2 style={{  fontWeight: 700, fontSize: 'clamp(1.6rem,2.8vw,2.4rem)', lineHeight: 1.2, letterSpacing: '-0.025em', color: 'var(--text-primary)', margin: '0 0 16px' }}>
                      Every decision was<br /><span style={{ color: ACCENT2 }}>evidence-backed.</span>
                    </h2>
                    <p style={{  fontSize: '0.95rem', color: 'rgba(255,255,255,0.5)', lineHeight: 1.7, margin: 0 }}>
                      A structured 5-phase process that balanced velocity with rigor — moving fast where the path was clear, slowing down where evidence was thin.
                    </p>
                  </div>
                  <motion.div initial={{ opacity: 0, scale: 0.96 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
                    style={{ borderRadius: 16, overflow: 'hidden', border: '1px solid var(--border-default)', height: 200, flexShrink: 0 }}>
                    <img src={IMG_WIREFRAME} alt="Wireframes" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.8 }} />
                  </motion.div>
                </div>

                {/* Timeline steps */}
                <div style={{ position: 'relative' }}>
                  <div style={{ position: 'absolute', left: 27, top: 0, bottom: 0, width: 1, background: 'linear-gradient(to bottom,rgba(99,102,241,0.5),rgba(139,92,246,0.2),transparent)' }} />
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                    {(data?.process?.steps || []).map((step: any, i: number) => (
                      <motion.div key={step.phase}
                        initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: '-40px' }} transition={{ delay: i * 0.08, duration: 0.5 }}
                        onViewportEnter={() => setActiveStep(i)}
                        style={{ display: 'flex', gap: 32, paddingBottom: 40 }}>
                        <div style={{
                          width: 56, height: 56, borderRadius: '50%', flexShrink: 0,
                          background: activeStep >= i ? `linear-gradient(135deg,${ACCENT},${ACCENT2})` : 'var(--border-default)',
                          border: `2px solid ${activeStep >= i ? 'transparent' : 'var(--border-default)'}`,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          boxShadow: activeStep >= i ? `0 0 24px rgba(99,102,241,0.4)` : 'none', transition: 'all 0.4s ease',
                        }}>
                          <span style={{  fontWeight: 700, fontSize: '0.75rem', color: activeStep >= i ? 'var(--text-primary)' : 'var(--border-strong)' }}>{step.phase}</span>
                        </div>
                        <div style={{ paddingTop: 12, flex: 1 }}>
                          <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 8 }}>
                            <h3 style={{  fontWeight: 700, fontSize: '1.15rem', color: 'var(--text-primary)', margin: 0 }}>{step.title}</h3>
                            <span style={{  fontSize: '0.75rem', color: ACCENT, fontWeight: 600, opacity: 0.8 }}>{step.duration}</span>
                          </div>
                          <p style={{  fontSize: '0.88rem', color: 'rgba(255,255,255,0.5)', lineHeight: 1.7, margin: 0 }}>{step.desc}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Trade-offs */}
                <div style={{ marginTop: 20 }}>
                  <h3 style={{  fontWeight: 700, fontSize: '1rem', color: 'var(--text-secondary)', letterSpacing: '0.06em', marginBottom: 20 }}>Key Trade-offs</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    {(data.process?.tradeoffs || []).map((item: any, i: number) => {
                      if (!item || !item.decision) return null;
                      return (
                        <motion.div key={i} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                          style={{ padding: '20px 24px', borderRadius: 14, background: 'rgba(139,92,246,0.05)', border: '1px solid rgba(139,92,246,0.15)', display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '0 20px' }}>
                          <div style={{ gridRow: '1 / 3', display: 'flex', alignItems: 'flex-start', paddingTop: 3 }}><ChevronRight size={14} color={ACCENT2} /></div>
                          <div style={{  fontWeight: 600, fontSize: '0.88rem', color: '#c4b5fd', marginBottom: 6 }}>{item.decision}</div>
                          <div style={{  fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{item.rationale}</div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </section>

            {/* ═══════════════════════════════════════════════ SOLUTION */}
            {data.settings.showSolution && (
<section style={{ padding: 'clamp(60px,8vw,120px) clamp(24px,6vw,80px)', background: BG2 }}>
              <div style={{ maxWidth: 1100, margin: '0 auto' }}>
                <SectionLabel>04 — The Solution</SectionLabel>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 100 }}>
                  {(data?.solution?.screens || []).map((screen: any, i: number) => (
                    <motion.div key={screen.title}
                      initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-80px' }} transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
                      style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 52, alignItems: 'center' }}>
                      {/* Conditionally reorder image/text based on align */}
                      {screen.align === 'right' ? (
                        <>
                          <ScreenText screen={screen} index={i} total={data.solution.screens.length} />
                          <ScreenImage screen={screen} index={i} total={data.solution.screens.length} />
                        </>
                      ) : (
                        <>
                          <ScreenImage screen={screen} index={i} total={data.solution.screens.length} />
                          <ScreenText screen={screen} index={i} total={data.solution.screens.length} />
                        </>
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>
            </section>
)}

            {/* ══════════════════════════════════════════════ SCREENSHOTS */}
            <section style={{ padding: 'clamp(60px,8vw,120px) clamp(24px,6vw,80px)', background: BG }}>
              <div style={{ maxWidth: 1100, margin: '0 auto' }}>
                <SectionLabel>05 — Screenshots</SectionLabel>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 48, flexWrap: 'wrap' as const, gap: 16 }}>
                  <h2 style={{  fontWeight: 700, fontSize: 'clamp(1.6rem,2.8vw,2.4rem)', lineHeight: 1.15, letterSpacing: '-0.025em', color: 'var(--text-primary)', margin: 0 }}>
                    Every screen,{' '}<span style={{ color: ACCENT }}>intentional.</span>
                  </h2>
                  <span style={{  fontSize: '0.8rem', color: 'var(--border-strong)', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <ZoomIn size={13} /> Click any image to expand
                  </span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))', gap: 16 }}>
                  {(data?.screenshots || []).map((shot: any, i: number) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 24 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: '-40px' }}
                      transition={{ delay: i * 0.07, duration: 0.5 }}
                      onClick={() => setLightbox({ src: shot.image, caption: shot.caption })}
                      whileHover={{ scale: 1.02, y: -4 }}
                      style={{
                        position: 'relative', borderRadius: 16, overflow: 'hidden', cursor: 'zoom-in',
                        border: '1px solid rgba(99,102,241,0.15)',
                        boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
                        aspectRatio: i % 3 === 0 ? '16/10' : '4/3',
                        transition: 'box-shadow 0.3s ease',
                      }}
                    >
                      <img src={shot.image} alt={shot.caption} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top,rgba(6,6,15,0.9) 0%,rgba(6,6,15,0.1) 55%,transparent 100%)' }} />
                      {/* Expand icon */}
                      <div style={{
                        position: 'absolute', top: 12, right: 12, width: 32, height: 32, borderRadius: 8,
                        background: 'rgba(99,102,241,0.85)', backdropFilter: 'blur(8px)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        <Maximize2 size={14} color="var(--text-primary)" />
                      </div>
                      {/* Caption */}
                      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '16px 14px 14px' }}>
                        <div style={{ marginBottom: 5 }}>
                          <span style={{
                            padding: '2px 8px', borderRadius: 6,
                            background: 'rgba(99,102,241,0.3)', border: '1px solid rgba(99,102,241,0.4)',
                             fontWeight: 700, fontSize: '0.6rem',
                            color: 'var(--brand)', letterSpacing: '0.08em', textTransform: 'uppercase' as const,
                          }}>{shot.tag}</span>
                        </div>
                        <p style={{  fontSize: '0.78rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.4 }}>{shot.caption}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </section>

            {/* ═══════════════════════════════════════════════════ VIDEO */}
            <section style={{ padding: 'clamp(60px,8vw,120px) clamp(24px,6vw,80px)', background: BG2 }}>
              <div style={{ maxWidth: 1100, margin: '0 auto' }}>
                <SectionLabel>06 — Video Walkthrough</SectionLabel>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 56, alignItems: 'center' }}>
                  {/* Text */}
                  <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 20, padding: '6px 14px', borderRadius: 100, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)' }}>
                      <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#ef4444', boxShadow: '0 0 8px #ef4444' }} />
                      <span style={{  fontWeight: 600, fontSize: '0.72rem', color: '#fca5a5', letterSpacing: '0.08em', textTransform: 'uppercase' as const }}>Video</span>
                    </div>
                    <h2 style={{  fontWeight: 700, fontSize: 'clamp(1.6rem,2.8vw,2.4rem)', lineHeight: 1.15, letterSpacing: '-0.025em', color: 'var(--text-primary)', margin: '0 0 20px' }}>
                      {data.video.title}
                    </h2>
                    <p style={{  fontSize: '0.95rem', lineHeight: 1.75, color: 'var(--text-muted)', margin: '0 0 28px' }}>
                      {data.video.desc}
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Play size={12} color={ACCENT} style={{ marginLeft: 1 }} />
                      </div>
                      <span style={{  fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 500 }}>Duration: {data.video.duration}</span>
                    </div>
                  </motion.div>

                  {/* Player */}
                  <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.1 }} style={{ position: 'relative' }}>
                    <div style={{
                      position: 'relative', borderRadius: 20, overflow: 'hidden',
                      border: '1px solid rgba(99,102,241,0.25)',
                      boxShadow: '0 24px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(99,102,241,0.08)',
                      aspectRatio: '16/9', background: '#000',
                    }}>
                      {videoPlaying ? (
                        <iframe
                          src={`https://www.youtube-nocookie.com/embed/${data.video.youtubeId}?autoplay=1&rel=0&modestbranding=1`}
                          title={data.video.title}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          style={{ width: '100%', height: '100%', border: 'none', display: 'block' }}
                        />
                      ) : (
                        <div onClick={() => setVideoPlaying(true)} style={{ width: '100%', height: '100%', cursor: 'pointer', position: 'relative', background: '#08080f' }}>
                          <img
                            src={`https://img.youtube.com/vi/${data.video.youtubeId}/maxresdefault.jpg`}
                            alt={data.video.title}
                            style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.45, display: 'block' }}
                            onError={(e) => { (e.target as HTMLImageElement).style.opacity = '0'; }}
                          />
                          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 80% 80% at 50% 50%, rgba(99,102,241,0.1), rgba(6,6,15,0.65))' }} />
                          <div style={{
                            position: 'absolute', inset: 0, opacity: 0.25,
                            backgroundImage: `linear-gradient(rgba(99,102,241,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.2) 1px, transparent 1px)`,
                            backgroundSize: '40px 40px',
                          }} />
                          <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 18 }}>
                            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} style={{
                              width: 76, height: 76, borderRadius: '50%',
                              background: `linear-gradient(135deg,${ACCENT},${ACCENT2})`,
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              boxShadow: `0 0 0 14px rgba(99,102,241,0.12), 0 8px 40px rgba(99,102,241,0.55)`,
                            }}>
                              <Play size={30} color="var(--text-primary)" style={{ marginLeft: 3 }} />
                            </motion.div>
                            <div style={{ textAlign: 'center' }}>
                              <div style={{  fontWeight: 600, fontSize: '0.9rem', color: 'rgba(255,255,255,0.9)', marginBottom: 4 }}>Play Walkthrough</div>
                              <div style={{  fontSize: '0.73rem', color: 'var(--text-muted)' }}>{data.video.duration} · YouTube</div>
                            </div>
                          </div>
                          <div style={{ position: 'absolute', bottom: 14, right: 14, padding: '4px 10px', borderRadius: 6, background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)' }}>
                            <span style={{  fontWeight: 700, fontSize: '0.72rem', color: 'var(--text-primary)' }}>{data.video.duration}</span>
                          </div>
                        </div>
                      )}
                    </div>
                    {/* Glow */}
                    <div style={{ position: 'absolute', bottom: -24, left: '10%', right: '10%', height: 40, background: `radial-gradient(ellipse,rgba(99,102,241,0.3),transparent 70%)`, filter: 'blur(14px)', pointerEvents: 'none' }} />
                  </motion.div>
                </div>
              </div>
            </section>

            {/* ═══════════════════════════════════════════════ RESULTS */}
            {data.settings.showResults && (
<section style={{ padding: 'clamp(60px,8vw,120px) clamp(24px,6vw,80px)', background: BG, position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: 'radial-gradient(ellipse 70% 50% at 50% 50%,rgba(99,102,241,0.07),transparent)' }} />
              <div style={{ maxWidth: 1100, margin: '0 auto', position: 'relative' }}>
                <SectionLabel>07 — Results</SectionLabel>
                <h2 style={{  fontWeight: 700, fontSize: 'clamp(2rem,4vw,3.5rem)', lineHeight: 1.1, letterSpacing: '-0.03em', color: 'var(--text-primary)', margin: '0 0 60px' }}>
                  Measured.<br />
                  <span style={{ background: `linear-gradient(135deg,${ACCENT},${ACCENT2},#06b6d4)`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Meaningful.</span>
                </h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(160px,1fr))', gap: 20, marginBottom: 64 }}>
                  {(data?.results?.metrics || []).map((m: any, i: number) => (
                    <motion.div key={m.label} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-40px' }} transition={{ delay: i * 0.07, duration: 0.5 }}
                      whileHover={{ y: -4, boxShadow: '0 16px 48px rgba(99,102,241,0.2)' }}
                      style={{ padding: '28px 24px', borderRadius: 18, background: 'rgba(99,102,241,0.06)', border: '1px solid rgba(99,102,241,0.15)', transition: 'all 0.25s ease', cursor: 'default' }}>
                      <div style={{  fontWeight: 700, fontSize: 'clamp(1.8rem,3vw,2.5rem)', lineHeight: 1.1, background: `linear-gradient(135deg,${ACCENT},${ACCENT2})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', marginBottom: 8 }}>{m.value}</div>
                      <div style={{  fontWeight: 600, fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: 4 }}>{m.label}</div>
                      <div style={{  fontSize: '0.72rem', color: 'var(--border-strong)' }}>{m.sub}</div>
                    </motion.div>
                  ))}
                </div>
                <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}
                  style={{ padding: 'clamp(32px,4vw,52px)', borderRadius: 24, background: 'linear-gradient(135deg,rgba(99,102,241,0.1),rgba(139,92,246,0.06))', border: '1px solid rgba(99,102,241,0.25)', position: 'relative', overflow: 'hidden' }}>
                  <div style={{ position: 'absolute', top: -20, right: 40,  fontSize: '10rem', lineHeight: 1, color: 'rgba(99,102,241,0.06)', userSelect: 'none' as const }}>"</div>
                  <blockquote style={{  fontWeight: 600, fontSize: 'clamp(1.1rem,2.5vw,1.6rem)', lineHeight: 1.5, color: 'var(--text-primary)', margin: '0 0 24px', position: 'relative', maxWidth: 800 }}>{data.results.quote.text}</blockquote>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <div style={{ width: 40, height: 40, borderRadius: '50%', background: `linear-gradient(135deg,${ACCENT},${ACCENT2})`, display: 'flex', alignItems: 'center', justifyContent: 'center',  fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)' }}>{data.results.quote.author.charAt(0)}</div>
                    <div>
                      <div style={{  fontWeight: 700, fontSize: '0.88rem', color: 'var(--brand)' }}>{data.results.quote.author}</div>
                      <div style={{  fontSize: '0.78rem', color: 'var(--text-muted)' }}>{data.results.quote.role}</div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </section>
)}

            {/* ═══════════════════════════════════════════════ REFLECTION */}
            {data.settings.showReflection && (
<section style={{ padding: 'clamp(60px,8vw,120px) clamp(24px,6vw,80px)', background: BG2 }}>
              <div style={{ maxWidth: 1100, margin: '0 auto' }}>
                <SectionLabel>08 — Reflection</SectionLabel>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 64 }}>
                  <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
                    <h2 style={{  fontWeight: 700, fontSize: 'clamp(1.6rem,2.8vw,2.2rem)', lineHeight: 1.2, letterSpacing: '-0.025em', color: 'var(--text-primary)', margin: '0 0 24px' }}>
                      What I'd do<br /><span style={{ color: ACCENT2 }}>differently.</span>
                    </h2>
                    <p style={{  fontSize: '0.98rem', lineHeight: 1.8, color: 'var(--text-muted)', margin: 0 }}>{data.reflection.summary}</p>
                  </motion.div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>
                    <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.1 }}>
                      <h3 style={{  fontWeight: 700, fontSize: '0.78rem', color: ACCENT, letterSpacing: '0.12em', marginBottom: 18 }}>Lessons Learned</h3>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                        {(data?.reflection?.lessons || []).map((l: any, i: number) => (
                          <div key={i} style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                            <GlowDot /><span style={{  fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{l}</span>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                    <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.2 }}>
                      <h3 style={{  fontWeight: 700, fontSize: '0.78rem', color: ACCENT2, letterSpacing: '0.12em', marginBottom: 18 }}>Next Iteration</h3>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                        {(data?.reflection?.next || []).map((n: any, i: number) => (
                          <div key={i} style={{ display: 'flex', gap: 14, alignItems: 'flex-start', padding: '12px 16px', borderRadius: 10, background: 'rgba(139,92,246,0.06)', border: '1px solid rgba(139,92,246,0.12)' }}>
                            <ArrowUpRight size={13} color={ACCENT2} style={{ flexShrink: 0, marginTop: 3 }} />
                            <span style={{  fontSize: '0.85rem', color: 'rgba(196,181,253,0.75)', lineHeight: 1.5 }}>{n}</span>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  </div>
                </div>
              </div>
            </section>
)}

            {/* Footer CTA */}
            <section style={{ padding: 'clamp(60px,8vw,100px) clamp(24px,6vw,80px)', background: BG, textAlign: 'center', borderTop: '1px solid rgba(99,102,241,0.1)' }}>
              <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
                <p style={{  fontSize: '0.78rem', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase' as const, color: ACCENT, marginBottom: 20 }}>Interested in working together?</p>
                <h2 style={{  fontWeight: 700, fontSize: 'clamp(2rem,4vw,3rem)', lineHeight: 1.15, letterSpacing: '-0.03em', color: 'var(--text-primary)', margin: '0 0 36px' }}>
                  Let's build something <span style={{ color: ACCENT2 }}>remarkable.</span>
                </h2>
                <motion.button onClick={onClose} whileHover={{ scale: 1.04, boxShadow: '0 16px 48px rgba(99,102,241,0.4)' }} whileTap={{ scale: 0.97 }}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '16px 36px', borderRadius: 14, background: `linear-gradient(135deg,${ACCENT},${ACCENT2})`, border: 'none', cursor: 'pointer',  fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)' }}>
                  View More Work <ArrowUpRight size={16} />
                </motion.button>
              </motion.div>
            </section>

          </div>
        </div>

        {/* ═══════════════════════════ LIGHTBOX */}
        <AnimatePresence>
          {lightbox && (
            <motion.div
              key="lightbox"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.22 }}
              onClick={() => setLightbox(null)}
              style={{
                position: 'fixed', inset: 0, zIndex: 400,
                background: 'rgba(0,0,0,0.93)', backdropFilter: 'blur(20px)',
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                padding: 24, cursor: 'zoom-out',
              }}
          >
            <motion.div
              initial={{ scale: 0.88, opacity: 0, y: 24 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.88, opacity: 0, y: 24 }}
              transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
              onClick={(e) => e.stopPropagation()}
              style={{ position: 'relative', maxWidth: 1040, width: '100%', cursor: 'default' }}
            >
              <img
                src={lightbox.src}
                alt={lightbox.caption}
                style={{ width: '100%', borderRadius: 18, display: 'block', boxShadow: '0 40px 120px rgba(0,0,0,0.85)', border: '1px solid rgba(99,102,241,0.2)' }}
              />
              {/* Caption */}
              <div style={{
                position: 'absolute', bottom: 0, left: 0, right: 0,
                padding: '24px 24px 20px',
                borderRadius: '0 0 18px 18px',
                background: 'linear-gradient(to top, rgba(6,6,15,0.96) 0%, rgba(6,6,15,0.5) 60%, transparent 100%)',
              }}>
                <p style={{  fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0 }}>{lightbox.caption}</p>
              </div>
              {/* Close */}
              <button
                onClick={() => setLightbox(null)}
                style={{
                  position: 'absolute', top: -14, right: -14,
                  width: 38, height: 38, borderRadius: '50%',
                  background: `linear-gradient(135deg,${ACCENT},${ACCENT2})`,
                  border: 'none', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 4px 20px rgba(99,102,241,0.55)',
                }}
              >
                <X size={16} color="var(--text-primary)" />
              </button>
            </motion.div>
            <p style={{  fontSize: '0.7rem', color: 'var(--border-strong)', marginTop: 20 }}>
              Press Esc or click outside to close
            </p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
  );
}

// ─── Sub-components for solution screens ─────────────────────────────────────
function ScreenImage({ screen, index, total }: { screen: { title: string; image: string }; index: number; total: number }) {
  return (
    <div style={{ borderRadius: 20, overflow: 'hidden', border: '1px solid rgba(99,102,241,0.2)', boxShadow: '0 24px 80px rgba(0,0,0,0.5),0 0 40px rgba(99,102,241,0.08)', position: 'relative', aspectRatio: '16/10' }}>
      <img src={screen.image} alt={screen.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg,rgba(99,102,241,0.1),transparent)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', top: 16, left: 16, padding: '4px 10px', borderRadius: 8, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(10px)', border: '1px solid var(--border-default)',  fontWeight: 700, fontSize: '0.68rem', color: 'var(--text-secondary)', letterSpacing: '0.06em' }}>
        {String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
      </div>
    </div>
  );
}

function ScreenText({ screen, index, total }: { screen: { title: string; desc: string; callouts: string[] }; index: number; total: number }) {
  return (
    <div>
      <div style={{ display: 'inline-flex', marginBottom: 20, padding: '4px 12px', borderRadius: 100, background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)',  fontWeight: 600, fontSize: '0.68rem', color: '#6366f1', letterSpacing: '0.1em', textTransform: 'uppercase' as const }}>
        Solution {index + 1}
      </div>
      <h3 style={{  fontWeight: 700, fontSize: 'clamp(1.4rem,2.5vw,2rem)', lineHeight: 1.2, letterSpacing: '-0.02em', color: 'var(--text-primary)', margin: '0 0 20px' }}>{screen.title}</h3>
      <p style={{  fontSize: '0.95rem', lineHeight: 1.75, color: 'var(--text-muted)', margin: '0 0 28px' }}>{screen.desc}</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {screen.callouts.map((c) => (
          <div key={c} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#8b5cf6', boxShadow: '0 0 8px #8b5cf6', flexShrink: 0 }} />
            <span style={{  fontSize: '0.82rem', color: 'rgba(165,180,252,0.8)', fontWeight: 500 }}>{c}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
