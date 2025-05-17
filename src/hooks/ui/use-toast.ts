import { toast as sonnerToast } from "sonner";

// Define types for our toast system
type ToastType = 'default' | 'success' | 'error' | 'warning' | 'info';

interface ToastOptions {
  action?: React.ReactNode;
  description?: string;
  duration?: number;
}

export function toast(
  message: string | {
    title?: string;
    description?: string;
    variant?: 'default' | 'destructive';
  },
  options?: ToastOptions
) {
  // If message is a string, show a default toast
  if (typeof message === 'string') {
    return sonnerToast(message, options);
  }

  // If message has a variant of destructive, show an error toast
  if (message.variant === 'destructive') {
    return sonnerToast.error(message.title || 'Error', {
      description: message.description,
      ...options,
    });
  }

  // Otherwise show a default toast with title and description
  return sonnerToast(message.title || '', {
    description: message.description,
    ...options,
  });
}

// Add convenience methods that match what various components are expecting
toast.error = (message: string, options?: ToastOptions) => sonnerToast.error(message, options);
toast.success = (message: string, options?: ToastOptions) => sonnerToast.success(message, options);
toast.warning = (message: string, options?: ToastOptions) => sonnerToast.warning(message, options);
toast.info = (message: string, options?: ToastOptions) => sonnerToast.info(message, options);

export function useToast() {
  return {
    toast,
  };
}
