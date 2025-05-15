
// Simple toast management utility

type ToastVariant = 'default' | 'success' | 'warning' | 'error' | 'destructive';

interface ToastOptions {
  title?: string;
  description: string;
  variant?: ToastVariant;
  duration?: number;
}

type ToastMessage = string | { title?: string; description: string };

export const toast = {
  default: (message: ToastMessage, title?: string, duration?: number) => {
    if (typeof message === 'string') {
      showToast({ title, description: message, variant: 'default', duration });
    } else {
      showToast({ title: message.title || title, description: message.description, variant: 'default', duration });
    }
  },
  success: (message: ToastMessage, title?: string, duration?: number) => {
    if (typeof message === 'string') {
      showToast({ title, description: message, variant: 'success', duration });
    } else {
      showToast({ title: message.title || title, description: message.description, variant: 'success', duration });
    }
  },
  warning: (message: ToastMessage, title?: string, duration?: number) => {
    if (typeof message === 'string') {
      showToast({ title, description: message, variant: 'warning', duration });
    } else {
      showToast({ title: message.title || title, description: message.description, variant: 'warning', duration });
    }
  },
  error: (message: ToastMessage, title?: string, duration?: number) => {
    if (typeof message === 'string') {
      showToast({ title, description: message, variant: 'error', duration });
    } else {
      showToast({ title: message.title || title, description: message.description, variant: 'error', duration });
    }
  },
  destructive: (message: ToastMessage, title?: string, duration?: number) => {
    if (typeof message === 'string') {
      showToast({ title, description: message, variant: 'destructive', duration });
    } else {
      showToast({ title: message.title || title, description: message.description, variant: 'destructive', duration });
    }
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
