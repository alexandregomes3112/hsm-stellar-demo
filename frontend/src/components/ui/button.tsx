import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { motion } from 'framer-motion';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 touch-manipulation relative overflow-hidden',
  {
    variants: {
      variant: {
        default: 
          'bg-primary text-primary-foreground hover:bg-primary/90 active:bg-primary/95 shadow-sm hover:shadow-md active:shadow-sm hover:-translate-y-0.5 active:translate-y-0',
        destructive:
          'bg-destructive text-destructive-foreground hover:bg-destructive/90 active:bg-destructive/95 shadow-sm hover:shadow-destructive/25 hover:-translate-y-0.5 active:translate-y-0',
        outline:
          'border border-input bg-background hover:bg-accent hover:text-accent-foreground active:bg-accent/90 shadow-sm hover:shadow-md hover:border-primary/30 hover:-translate-y-0.5 active:translate-y-0',
        secondary:
          'bg-secondary text-secondary-foreground hover:bg-secondary/80 active:bg-secondary/90 shadow-sm hover:shadow-md hover:-translate-y-0.5 active:translate-y-0',
        ghost: 
          'hover:bg-accent hover:text-accent-foreground active:bg-accent/90 hover:-translate-y-0.5 active:translate-y-0',
        link: 
          'text-primary underline-offset-4 hover:underline active:text-primary/80',
        gradient:
          'bg-gradient-to-r from-primary to-primary/80 text-primary-foreground hover:from-primary/90 hover:to-primary/70 shadow-md hover:shadow-lg hover:shadow-primary/25 hover:-translate-y-0.5 active:translate-y-0',
        success:
          'bg-success text-success-foreground hover:bg-success/90 active:bg-success/95 shadow-sm hover:shadow-success/25 hover:-translate-y-0.5 active:translate-y-0',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-8 rounded-md px-3 text-xs',
        lg: 'h-12 rounded-lg px-8 text-base',
        xl: 'h-14 rounded-lg px-10 text-lg',
        icon: 'h-10 w-10',
        'icon-sm': 'h-8 w-8 rounded-md',
        'icon-lg': 'h-12 w-12 rounded-lg',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
  animated?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, loading = false, animated = true, children, disabled, ...props }, ref) => {
    const isDisabled = disabled || loading;
    
    const content = (
      <>
        {loading && (
          <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
        )}
        {children}
        {/* Shimmer effect overlay */}
        <div className="absolute inset-0 -top-px bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 -translate-x-full group-hover:animate-shimmer" />
      </>
    );

    const motionProps = animated ? {
      whileHover: isDisabled ? {} : { scale: 1.02 },
      whileTap: isDisabled ? {} : { scale: 0.98 },
      transition: { type: "spring", stiffness: 400, damping: 17 }
    } : {};

    if (asChild) {
      return (
        <Slot className={cn(buttonVariants({ variant, size }), 'group', className)}>
          {children}
        </Slot>
      );
    }

    if (animated) {
      return (
        <motion.button 
          className={cn(buttonVariants({ variant, size }), 'group', className)} 
          ref={ref} 
          disabled={isDisabled}
          {...motionProps}
          {...(props as any)}
        >
          {content}
        </motion.button>
      );
    }

    return (
      <button 
        className={cn(buttonVariants({ variant, size }), 'group', className)} 
        ref={ref} 
        disabled={isDisabled}
        {...props}
      >
        {content}
      </button>
    );
  },
);
Button.displayName = 'Button';

export { Button, buttonVariants };
