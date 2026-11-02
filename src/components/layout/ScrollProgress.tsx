'use client';

import { motion, useReducedMotion, useScroll, useSpring, useTransform, useVelocity } from 'motion/react';
import { useLanguage } from '../../contexts/LanguageContext';

/* The fill trails the scroll position slightly, so it glides instead of stepping */
const FILL_SPRING = { stiffness: 140, damping: 26, mass: 0.4 };
const GLOW_SPRING = { stiffness: 200, damping: 30 };
/* Scroll speed (page lengths per second) at which the tip glows brightest */
const FAST_SCROLL = 0.6;
/* Fades in over the first bit of scrolling, so the header is clean at the very top */
const FADE_IN_UNTIL = 0.02;

/**
 * Reading-progress line along the bottom edge of the header. It fills from the
 * start edge (right in Arabic) as the page scrolls, with a glowing tip that
 * flares while scrolling fast. Transform/opacity only: no re-renders, no layout.
 */
export function ScrollProgress() {
  const { isRTL } = useLanguage();
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const smoothProgress = useSpring(scrollYProgress, FILL_SPRING);
  const progress = reduceMotion ? scrollYProgress : smoothProgress;

  // A full-width bar slid in from the start edge
  const x = useTransform(progress, (p) => `${(isRTL ? 1 : -1) * (1 - p) * 100}%`);
  // A function, not a [0, 0.02] -> [0, 1] range: motion hands range transforms of scroll
  // progress to the browser's scroll timeline, which stretched this fade over the whole page
  const trackOpacity = useTransform(scrollYProgress, (p) => Math.min(p / FADE_IN_UNTIL, 1));

  const speed = useSpring(
    useTransform(useVelocity(scrollYProgress), (v) => Math.min(Math.abs(v) / FAST_SCROLL, 1)),
    GLOW_SPRING,
  );
  const tipScale = useTransform(speed, [0, 1], [1, 1.9]);
  const tipOpacity = useTransform(speed, [0, 1], [0.6, 1]);

  return (
    <div aria-hidden className="pointer-events-none relative h-0">
      <motion.div
        style={{ opacity: trackOpacity }}
        className="absolute inset-x-0 bottom-0 h-[3px] overflow-x-clip bg-text-primary/5"
      >
        <motion.div style={{ x }} className="scroll-progress-fill relative h-full">
          <motion.span
            style={reduceMotion ? undefined : { scale: tipScale, opacity: tipOpacity }}
            className="scroll-progress-tip absolute end-0 top-1/2 size-3.5 -translate-y-1/2 rounded-full ltr:translate-x-1/2 rtl:-translate-x-1/2"
          />
        </motion.div>
      </motion.div>
    </div>
  );
}
