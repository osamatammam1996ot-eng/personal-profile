import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from './utils';

const tagVariants = cva('inline-flex items-center rounded-full border px-3 py-1 text-sm font-medium', {
  variants: {
    tone: {
      /** On surfaces (tool card) */
      brand: 'bg-brand/10 border-brand/20 text-brand-text',
      /** Over photos (project cards) */
      media: 'bg-on-media/10 border-on-media/20 text-on-media backdrop-blur-md',
    },
  },
  defaultVariants: { tone: 'brand' },
});

type TagProps = React.ComponentProps<'span'> & VariantProps<typeof tagVariants>;

/** Non-interactive label chip for categories and skills. */
function Tag({ tone, className, ...props }: TagProps) {
  return <span className={cn(tagVariants({ tone }), className)} {...props} />;
}

export { Tag, tagVariants };
