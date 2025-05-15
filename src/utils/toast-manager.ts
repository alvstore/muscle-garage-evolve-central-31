// Simple toast management utility

type ToastVariant = 'default' | 'success' | 'warning' | 'error' | 'destructive';

interface ToastOptions {
  title?: string;
  description: string;
  variant?: ToastVariant;
  duration?: number;
}

export const toast = {
  default: (description: string, title?: string, duration?: number) => {
    showToast({ title, description, variant: 'default', duration });
  },
  success: (description: string, title?: string, duration?: number) => {
    showToast({ title, description, variant: 'success', duration });
  },
  warning: (description: string, title?: string, duration?: number) => {
    showToast({ title, description, variant: 'warning', duration });
  },
  error: (description: string, title?: string, duration?: number) => {
    showToast({ title, description, variant: 'error', duration });
  },
  destructive: (description: string, title?: string, duration?: number) => {
    showToast({ title, description, variant: 'destructive', duration });
  }
};

// Internal function to show the toast
function showToast(options: ToastOptions) {
  // This is a placeholder that will be defined when the component is loaded
  // The actual implementation comes from useToast from shadcn/ui
  if (typeof window !== 'undefined') {
    const event = new CustomEvent('show-toast', { detail: options });
    window.dispatchEvent(event);
  }
}
