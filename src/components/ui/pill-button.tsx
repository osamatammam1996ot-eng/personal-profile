import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from './utils';

const pillButtonVariants = cva(
  'inline-flex items-center gap-2 rounded-full border px-5 py-2.5 text-sm font-semibold cursor-pointer outline-none ' +
    'transition-colors focus-visible:ring-2 focus-visible:ring-brand [&_svg]:shrink-0',
  {
    variants: {
      tone: {
        /** Frosted, for actions floating over a section ("Add yours") */
        glass:
          'bg-surface-glass backdrop-blur-md border-text-primary/15 text-text-primary hover:border-brand/60 hover:text-brand-text',
        /** Brand outline, for quieter inline actions ("Request full portfolio") */
        outline: 'bg-transparent border-brand/40 text-text-primary hover:bg-brand/10',
      },
    },
    defaultVariants: { tone: 'outline' },
  },
);

type PillButtonProps = React.ComponentProps<'button'> & VariantProps<typeof pillButtonVariants>;

/** Small rounded secondary action with optional icon. The big primary action is CTAButton. */
function PillButton({ tone, className, type = 'button', ...props }: PillButtonProps) {
  return <button type={type} className={cn(pillButtonVariants({ tone }), className)} {...props} />;
}

export { PillButton, pillButtonVariants };
