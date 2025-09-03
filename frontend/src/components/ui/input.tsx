import * as React from 'react';
import { motion } from 'framer-motion';

import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  animated?: boolean;
  icon?: React.ReactNode;
  error?: boolean;
  success?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, animated = true, icon, error = false, success = false, ...props }, ref) => {
    const [isFocused, setIsFocused] = React.useState(false);
    
    const inputClassName = cn(
      'flex h-10 w-full rounded-md border border-input/60 bg-background/50 backdrop-blur-sm px-3 py-2 text-sm ring-offset-background transition-all duration-200',
      'file:border-0 file:bg-transparent file:text-sm file:font-medium',
      'placeholder:text-muted-foreground/70',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-offset-1',
      'focus-visible:border-primary/60 focus-visible:bg-background/80',
      'disabled:cursor-not-allowed disabled:opacity-50',
      'hover:border-primary/40 hover:bg-background/60',
      icon && 'pl-10',
      error && 'border-destructive/60 focus-visible:ring-destructive/50',
      success && 'border-success/60 focus-visible:ring-success/50',
      className,
    );

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(true);
      props.onFocus?.(e);
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false);
      props.onBlur?.(e);
    };

    return (
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
            {icon}
          </div>
        )}
        {animated ? (
          <motion.input
            type={type}
            className={inputClassName}
            ref={ref}
            onFocus={handleFocus}
            onBlur={handleBlur}
            whileFocus={{ scale: 1.01 }}
            transition={{ duration: 0.2 }}
            {...(props as any)}
          />
        ) : (
          <input
            type={type}
            className={inputClassName}
            ref={ref}
            onFocus={handleFocus}
            onBlur={handleBlur}
            {...props}
          />
        )}
        {/* Focus indicator */}
        {animated && isFocused && (
          <motion.div
            className="absolute inset-0 rounded-md border-2 border-primary/30 pointer-events-none"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.15 }}
          />
        )}
      </div>
    );
  },
);
Input.displayName = 'Input';

export { Input };
