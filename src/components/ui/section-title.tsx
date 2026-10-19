import { motion, type HTMLMotionProps } from 'motion/react';
import { cn } from './utils';

/**
 * The one heading style every section uses, so section titles can't drift apart.
 * It's a motion.h2, so callers can pass entrance animations directly.
 */
export function SectionTitle({ className, ...props }: HTMLMotionProps<'h2'>) {
  return (
    <motion.h2
      className={cn('m-0 font-bold text-[clamp(2rem,4vw,3.25rem)] text-text-primary tracking-[-0.02em] leading-[1.15]', className)}
      {...props}
    />
  );
}
