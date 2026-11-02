'use client';

import type { PointerEvent } from 'react';
import { motion, useAnimate, useReducedMotion } from 'motion/react';
import { ArrowDown } from 'lucide-react';
import { useResumeContent } from '../../content/resume';

/* Springs and timings for the island */
const ISLAND_SPRING = { type: 'spring', stiffness: 380, damping: 24 } as const;
const ENTRY_DELAY_S = 1.2;
/* Arrow drops out of the bottom of the button, then falls back in from the top */
const ARROW_DROP = { y: [0, 26, -26, 0] };
const ARROW_DROP_TIMING = { duration: 0.75, times: [0, 0.45, 0.46, 1], ease: 'easeInOut' as const };

/**
 * Floating glass "dynamic island" pinned to the bottom of the page that downloads
 * the resume uploaded in the admin panel. Hidden while no resume is set.
 */
export function ResumeIsland() {
  const resume = useResumeContent();
  const reduceMotion = useReducedMotion();
  const [arrowRef, animateArrow] = useAnimate<HTMLSpanElement>();

  if (!resume) return null;

  // Feeds the highlight that follows the pointer across the island
  const trackGlow = (e: PointerEvent<HTMLAnchorElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty('--glow-x', `${((e.clientX - rect.left) / rect.width) * 100}%`);
  };

  const playArrowDrop = () => {
    if (!reduceMotion) animateArrow(arrowRef.current, ARROW_DROP, ARROW_DROP_TIMING);
  };

  return (
    // Entry (rises in once) lives on the wrapper so its delay never slows the hover spring
    <motion.div
      initial={reduceMotion ? false : { y: 96, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ ...ISLAND_SPRING, delay: ENTRY_DELAY_S }}
      className="pointer-events-none fixed inset-x-0 bottom-[max(1.25rem,env(safe-area-inset-bottom))] z-[100] flex justify-center px-4"
    >
      <motion.a
        href={resume.href}
        download={resume.fileName}
        onPointerMove={trackGlow}
        onClick={playArrowDrop}
        whileHover={reduceMotion ? undefined : { scale: 1.05 }}
        whileTap={reduceMotion ? undefined : { scale: 0.96 }}
        transition={ISLAND_SPRING}
        className="group pointer-events-auto relative isolate flex items-center gap-3 overflow-hidden rounded-full border border-text-primary/15 bg-surface-glass py-1.5 ps-5 pe-1.5 text-sm font-semibold text-text-primary shadow-island backdrop-blur-xl backdrop-saturate-150 outline-none transition-[gap,padding,box-shadow,border-color,color] duration-500 hover:gap-4 hover:ps-6 hover:border-brand-light/40 hover:text-on-brand hover:shadow-island-hover focus-visible:ring-2 focus-visible:ring-brand md:text-base"
      >
        {/* Colour layers: flowing brand fill + pointer-follow highlight, both fade in on hover */}
        <span aria-hidden className="resume-island-fill absolute inset-0 -z-10 opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-focus-visible:opacity-100" />
        <span aria-hidden className="resume-island-glow absolute inset-0 -z-10 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        {/* Glass edge highlight */}
        <span aria-hidden className="absolute inset-x-6 top-0 -z-10 h-px bg-linear-to-r from-transparent via-text-primary/40 to-transparent" />

        <span className="whitespace-nowrap">{resume.label}</span>

        {/* Download icon: the arrow drops through the tray on click */}
        <span
          aria-hidden
          className="relative grid size-9 shrink-0 place-items-center overflow-hidden rounded-full bg-brand text-on-brand transition-colors duration-500 group-hover:bg-on-brand group-hover:text-brand md:size-10"
        >
          <span className="transition-transform duration-300 group-hover:translate-y-0.5">
            <span ref={arrowRef} className="block">
              <ArrowDown className="size-4 md:size-[18px]" strokeWidth={2.5} />
            </span>
          </span>
          <span className="absolute bottom-[9px] h-0.5 w-3.5 rounded-full bg-current transition-transform duration-300 group-hover:scale-x-125 md:bottom-[10px]" />
        </span>
      </motion.a>
    </motion.div>
  );
}
