import { useState, useCallback } from 'react';
import type { ToastProps } from '@/components/ui/toast';

let toastCounter = 0;

export function useToast() {
  const [toasts, setToasts] = useState<ToastProps[]>([]);

  const toast = useCallback((props: Omit<ToastProps, 'id' | 'onClose'>) => {
    const id = `toast-${toastCounter++}`;
    const newToast: ToastProps = { ...props, id };

    setToasts(prev => [...prev, newToast]);

    return id;
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const success = useCallback(
    (title: string, description?: string) => {
      return toast({ title, description, variant: 'success' });
    },
    [toast],
  );

  const error = useCallback(
    (title: string, description?: string) => {
      return toast({ title, description, variant: 'error' });
    },
    [toast],
  );

  const warning = useCallback(
    (title: string, description?: string) => {
      return toast({ title, description, variant: 'warning' });
    },
    [toast],
  );

  const info = useCallback(
    (title: string, description?: string) => {
      return toast({ title, description, variant: 'info' });
    },
    [toast],
  );

  return {
    toasts,
    toast,
    success,
    error,
    warning,
    info,
    removeToast,
  };
}
