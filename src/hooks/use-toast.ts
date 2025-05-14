
import { toast as sonnerToast, type ToastT, type ToastToDismiss, ExternalToast } from 'sonner';
import { ReactElement, ReactNode, JSXElementConstructor } from 'react';

type Toast = {
  id: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactNode;
  variant?: "default" | "destructive";
};

export function useToast() {
  // Store toast instances to be displayed
  const toasts: Toast[] = [];

  const toast = {
    // Direct pass-through to sonner toast methods
    success: sonnerToast.success,
    error: sonnerToast.error,
    info: sonnerToast.info,
    warning: sonnerToast.warning,
    loading: sonnerToast.loading,
    
    // Custom toast function
    toast: (props: Toast) => {
      sonnerToast(props.title as string, {
        description: props.description,
      });
    },
    
    // For compatibility with older code that expects the toasts array
    toasts
  };

  return toast;
}

// Re-export the toast function for convenience
export { sonnerToast as toast };
