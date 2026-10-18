import { useRef, useState, useCallback } from 'react';
import { motion, useScroll, useTransform, useReducedMotion, type MotionValue } from 'motion/react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useCms } from '../../contexts/CmsContext';
import type { CmsRecommendation } from '../../types/cms';
import { MessageSquarePlus } from 'lucide-react';
import { FeedbackDialog } from '../shared/FeedbackDialog';

interface RecommendationsProps {
  isDark: boolean;
}

const initials = (name: string) =>
  name.split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]).join('').toUpperCase();

function FeedbackCard({ rec, lang, animate }: { rec: CmsRecommendation; lang: 'en' | 'ar'; animate: boolean }) {
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
        “{rec.comment[lang]}”
      </p>

      <div className="mt-10 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="inline-flex size-12 shrink-0 items-center justify-center rounded-full bg-text-primary text-surface text-sm font-bold">
            {initials(rec.name)}
          </span>
          <span className="font-bold text-text-primary">{rec.name}</span>
        </div>
        <span className="text-base font-medium text-brand-text">{rec.position[lang]}</span>
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

export function Recommendations(_props: RecommendationsProps) {
  const { cmsData } = useCms();
  const recs = cmsData.recommendations?.filter((r) => r.visible) || [];
  if (!cmsData.sections.recommendations || recs.length === 0) return null;
  // Scroll-linked hooks live in the child so they only run when the section is rendered.
  return <RecommendationsContent recs={recs} />;
}

function RecommendationsContent({ recs }: { recs: CmsRecommendation[] }) {
  const { lang } = useLanguage();
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

  const t = lang === 'en'
    ? { title: 'What People Say', sub: "A few words from the people I've built, solved, and collaborated with.", keep: 'Keep scrolling', add: 'Add yours' }
    : { title: 'ماذا يقولون', sub: 'بعض الكلمات ممن عملت، وبنيت، وتعاونت معهم.', keep: 'استمر في التمرير', add: 'أضف رأيك' };

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
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="m-0 font-bold text-[clamp(2rem,4vw,3.25rem)] text-text-primary tracking-[-0.02em] leading-[1.15]"
            >
              {t.title}
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="m-0 mt-3 text-text-secondary text-base md:text-lg max-w-xl"
            >
              {t.sub}
            </motion.p>
            <motion.button
              ref={addBtnRef}
              type="button"
              onClick={() => setFeedbackOpen(true)}
              aria-haspopup="dialog"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-6 inline-flex items-center gap-2 rounded-full cursor-pointer px-5 py-2.5 bg-surface-glass backdrop-blur-md border border-text-primary/15 text-sm font-semibold text-text-primary hover:border-brand/60 hover:text-brand-text transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
            >
              <MessageSquarePlus size={16} className="rtl:-scale-x-100" />
              {t.add}
            </motion.button>
          </div>
          {recs.length > 1 && (
            <div className="hidden md:flex items-center gap-3 text-sm text-text-muted">
              <ScrollRing progress={listProgress} />
              {t.keep}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_auto] gap-x-10">
          <div ref={listRef} className="flex flex-col gap-10 md:gap-14">
            {recs.map((rec) => (
              <FeedbackCard key={rec.id} rec={rec} lang={lang} animate={!reduceMotion} />
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
