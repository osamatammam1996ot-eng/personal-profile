import { useRef, useState, useCallback } from 'react';
import { motion, useScroll, useTransform, useReducedMotion, type MotionValue } from 'motion/react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useTestimonials, type Testimonial } from '../../content/recommendations';
import { MessageSquarePlus } from 'lucide-react';
import { FeedbackDialog } from '../shared/FeedbackDialog';
import { PillButton } from '../ui/pill-button';
import { SectionTitle } from '../ui/section-title';
import { revealUp } from '../../lib/motion';

const initials = (name: string) =>
  name.split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]).join('').toUpperCase();

function FeedbackCard({ rec, animate }: { rec: Testimonial; animate: boolean }) {
  const ref = useRef<HTMLElement>(null);
  // Cards grow to full size and brightness as they rise towards the middle of the screen.
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'center center'] });
  const scale = useTransform(scrollYProgress, [0, 1], [0.9, 1]);
  const opacity = useTransform(scrollYProgress, [0, 1], [0.45, 1]);

  return (
    <motion.article
      ref={ref}
      style={animate ? { scale, opacity } : undefined}
      className="relative rounded-3xl bg-surface-card shadow-raised p-7 md:p-12"
    >
      <p className="m-0 text-lg md:text-2xl font-semibold text-text-primary leading-relaxed">
        “{rec.comment}”
      </p>

      <div className="mt-10 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="inline-flex size-12 shrink-0 items-center justify-center rounded-full bg-text-primary text-surface text-sm font-bold">
            {initials(rec.name)}
          </span>
          <span className="font-bold text-text-primary">{rec.name}</span>
        </div>
        <span className="text-base font-medium text-brand-text">{rec.position}</span>
      </div>

      {/* Accent dot on the bottom edge */}
      <span aria-hidden="true" className="absolute -bottom-1 left-1/2 -translate-x-1/2 size-2 rounded-full bg-brand" />
    </motion.article>
  );
}

function ScrollRing({ progress }: { progress: MotionValue<number> }) {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" className="-rotate-90" aria-hidden="true">
      <circle cx="11" cy="11" r="9" fill="none" strokeWidth="2" className="stroke-text-muted/30" />
      <motion.circle
        cx="11" cy="11" r="9" fill="none" strokeWidth="2" strokeLinecap="round"
        className="stroke-brand"
        style={{ pathLength: progress }}
      />
    </svg>
  );
}

export function Recommendations() {
  const recs = useTestimonials();
  if (recs.length === 0) return null;
  // Scroll-linked hooks live in the child so they only run when the section is rendered.
  return <RecommendationsContent recs={recs} />;
}

function RecommendationsContent({ recs }: { recs: Testimonial[] }) {
  const { t } = useLanguage();
  const reduceMotion = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const addBtnRef = useRef<HTMLButtonElement>(null);
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const closeFeedback = useCallback(() => {
    setFeedbackOpen(false);
    addBtnRef.current?.focus();
  }, []);

  // Progress through the list of cards drives the side bar and the header ring.
  const { scrollYProgress: listProgress } = useScroll({ target: listRef, offset: ['start center', 'end center'] });
  // The background glow drifts across the section while it is on screen.
  const { scrollYProgress: sectionProgress } = useScroll({ target: sectionRef, offset: ['start end', 'end start'] });
  const glowX = useTransform(sectionProgress, [0, 1], ['-40vw', '40vw']);

  return (
    <section
      id="recommendations"
      ref={sectionRef}
      className="relative w-full py-24 md:py-32 overflow-clip bg-surface-raised"
    >
      {/* Drifting brand glow (mirrored in RTL so it drifts the reading direction) */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 rtl:-scale-x-100">
        <motion.div
          style={reduceMotion ? undefined : { x: glowX }}
          className="absolute top-1/4 left-1/2 -translate-x-1/2 size-[50vw] max-w-[720px] max-h-[720px] rounded-full bg-brand opacity-[0.12] blur-[120px]"
        />
      </div>

      <div className="relative z-10 w-full max-w-[1100px] mx-auto px-6 md:px-10">
        {/* Header */}
        <div className="mb-14 md:mb-20 flex flex-wrap items-end justify-between gap-6">
          <div>
            <SectionTitle {...revealUp()}>{t.recommendations.title}</SectionTitle>
            <motion.p {...revealUp(0.1)} className="m-0 mt-3 text-text-secondary text-base md:text-lg max-w-xl">
              {t.recommendations.sub}
            </motion.p>
            <motion.div {...revealUp(0.2)} className="mt-6">
              <PillButton ref={addBtnRef} tone="glass" onClick={() => setFeedbackOpen(true)} aria-haspopup="dialog">
                <MessageSquarePlus size={16} className="rtl:-scale-x-100" />
                {t.recommendations.add}
              </PillButton>
            </motion.div>
          </div>
          {recs.length > 1 && (
            <div className="hidden md:flex items-center gap-3 text-sm text-text-muted">
              <ScrollRing progress={listProgress} />
              {t.recommendations.keep}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_auto] gap-x-10">
          <div ref={listRef} className="flex flex-col gap-10 md:gap-14">
            {recs.map((rec) => (
              <FeedbackCard key={rec.id} rec={rec} animate={!reduceMotion} />
            ))}
          </div>

          {/* Pinned progress bar */}
          {recs.length > 1 && (
            <div className="hidden md:block" aria-hidden="true">
              <div className="sticky top-[45vh] h-24 w-1 overflow-hidden rounded-full bg-text-muted/20">
                <motion.div
                  style={{ scaleY: listProgress }}
                  className="h-full w-full origin-top rounded-full bg-brand"
                />
              </div>
            </div>
          )}
        </div>
      </div>
      <FeedbackDialog open={feedbackOpen} onClose={closeFeedback} />
    </section>
  );
}
