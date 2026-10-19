import * as React from 'react';
import { motion } from 'motion/react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from './utils';

const iconButtonVariants = cva(
  'inline-flex shrink-0 items-center justify-center rounded-full border cursor-pointer outline-none ' +
    'transition-[color,background-color,border-color,transform] duration-200 ' +
    'focus-visible:ring-2 focus-visible:ring-brand disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      tone: {
        /** Frosted chip floating over content (hero avatar play/pause) */
        glass:
          'bg-surface-glass backdrop-blur-md border-text-primary/15 text-text-secondary shadow-[0_4px_16px_rgb(0_0_0/0.35)] ' +
          'hover:text-text-primary hover:border-text-primary/30',
        /** Brand-tinted control (carousel arrows) */
        brand: 'bg-brand/5 border-brand/20 text-text-primary hover:bg-brand/20 hover:border-brand hover:scale-[1.08]',
        /** Over photos and video (case study viewer) */
        media: 'bg-scrim/50 backdrop-blur-md border-on-media/10 text-on-media hover:bg-on-media/10',
        /** No chrome until hovered (dialog close, copy) */
        ghost: 'bg-transparent border-transparent text-text-muted hover:text-text-primary hover:bg-text-primary/5',
        /** Header toolbar: squarer, quiet fill */
        toolbar: 'rounded-xl bg-foreground/6 border-transparent text-foreground',
      },
      size: {
        sm: 'size-9',
        md: 'size-10',
        lg: 'size-11',
        xl: 'size-12 md:size-14',
      },
    },
    defaultVariants: { tone: 'ghost', size: 'sm' },
  },
);

type IconButtonProps = React.ComponentProps<'button'> &
  VariantProps<typeof iconButtonVariants> & {
    /** Icon-only, so the label is what screen readers announce */
    'aria-label': string;
  };

/** Round, icon-only button. Pass the icon as the child. */
function IconButton({ tone, size, className, type = 'button', ...props }: IconButtonProps) {
  return <button type={type} className={cn(iconButtonVariants({ tone, size }), className)} {...props} />;
}

/** IconButton that also takes motion props (whileHover, initial, …) */
const MotionIconButton = motion.create(IconButton);

export { IconButton, MotionIconButton, iconButtonVariants };
