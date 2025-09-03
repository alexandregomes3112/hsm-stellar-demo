import * as React from 'react';
import { CheckCircle2, XCircle, AlertCircle, Info, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ToastProps {
  id: string;
  title?: string;
  description?: string;
  variant?: 'default' | 'success' | 'error' | 'warning' | 'info';
  onClose?: (id: string) => void;
}

const variantStyles = {
  default: {
    container: 'bg-background border-border',
    icon: null,
    iconColor: '',
  },
  success: {
    container: 'bg-success/10 border-success/20',
    icon: CheckCircle2,
    iconColor: 'text-success',
  },
  error: {
    container: 'bg-destructive/10 border-destructive/20',
    icon: XCircle,
    iconColor: 'text-destructive',
  },
  warning: {
    container: 'bg-warning/10 border-warning/20',
    icon: AlertCircle,
    iconColor: 'text-warning',
  },
  info: {
    container: 'bg-info/10 border-info/20',
    icon: Info,
    iconColor: 'text-info',
  },
};

export function Toast({ id, title, description, variant = 'default', onClose }: ToastProps) {
  const styles = variantStyles[variant];
  const Icon = styles.icon;

  React.useEffect(() => {
    const timer = setTimeout(() => {
      onClose?.(id);
    }, 5000);

    return () => clearTimeout(timer);
  }, [id, onClose]);

  return (
    <div
      className={cn(
        'pointer-events-auto relative flex w-full items-start gap-3 rounded-lg border p-4 shadow-lg transition-all animate-enter',
        styles.container,
      )}
    >
      {Icon && <Icon className={cn('h-5 w-5 shrink-0', styles.iconColor)} />}

      <div className='flex-1'>
        {title && <div className='text-sm font-semibold'>{title}</div>}
        {description && <div className='mt-1 text-sm opacity-90'>{description}</div>}
      </div>

      <button
        onClick={() => onClose?.(id)}
        className='shrink-0 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2'
      >
        <X className='h-4 w-4' />
        <span className='sr-only'>Fechar</span>
      </button>
    </div>
  );
}

export function ToastContainer({
  toasts,
  onClose,
}: {
  toasts: ToastProps[];
  onClose: (id: string) => void;
}) {
  return (
    <div className='pointer-events-none fixed inset-0 z-[--z-notification] flex items-end justify-center p-4 sm:items-start sm:justify-end'>
      <div className='flex w-full max-w-sm flex-col gap-2'>
        {toasts.map(toast => (
          <Toast key={toast.id} {...toast} onClose={onClose} />
        ))}
      </div>
    </div>
  );
}
