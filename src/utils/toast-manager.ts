
import { toast as sonnerToast } from 'sonner';

// Define our own ToastOptions type based on what sonner accepts
type ToastOptions = {
  id?: string;
  duration?: number;
  icon?: React.ReactNode;
  action?: {
    label: string;
    onClick: () => void;
  };
  description?: React.ReactNode;
  promise?: Promise<any>;
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'top-center' | 'bottom-center';
};

// Simple message or object with title/description
type ToastMessage = string | { title: string; description?: string };

// Track shown toasts to prevent duplicates in rapid succession
const recentToasts: Record<string, number> = {};
const TOAST_DEBOUNCE_TIME = 3000; // 3 seconds

export const toast = {
  success: (message: ToastMessage, options?: ToastOptions) => {
    if (typeof message === 'string') {
      if (shouldShowToast(message)) {
        sonnerToast.success(message, options);
      }
    } else {
      if (shouldShowToast(message.title)) {
        sonnerToast.success(message.title, { 
          ...options, 
          description: message.description 
        });
      }
    }
  },
  
  error: (message: ToastMessage, options?: ToastOptions) => {
    if (typeof message === 'string') {
      if (shouldShowToast(message)) {
        sonnerToast.error(message, options);
      }
    } else {
      if (shouldShowToast(message.title)) {
        sonnerToast.error(message.title, { 
          ...options, 
          description: message.description 
        });
      }
    }
  },
  
  warning: (message: ToastMessage, options?: ToastOptions) => {
    if (typeof message === 'string') {
      if (shouldShowToast(message)) {
        sonnerToast.warning(message, options);
      }
    } else {
      if (shouldShowToast(message.title)) {
        sonnerToast.warning(message.title, { 
          ...options, 
          description: message.description 
        });
      }
    }
  },
  
  info: (message: ToastMessage, options?: ToastOptions) => {
    if (typeof message === 'string') {
      if (shouldShowToast(message)) {
        sonnerToast.info(message, options);
      }
    } else {
      if (shouldShowToast(message.title)) {
        sonnerToast.info(message.title, { 
          ...options, 
          description: message.description 
        });
      }
    }
  },
  
  // For raw toast access when needed
  raw: sonnerToast
};

// Helper function to prevent duplicate toasts
function shouldShowToast(message: string): boolean {
  const now = Date.now();
  const key = message.toLowerCase().trim();
  
  if (recentToasts[key] && now - recentToasts[key] < TOAST_DEBOUNCE_TIME) {
    return false;
  }
  
  recentToasts[key] = now;
  
  // Clean up old entries
  Object.keys(recentToasts).forEach(k => {
    if (now - recentToasts[k] > TOAST_DEBOUNCE_TIME) {
      delete recentToasts[k];
    }
  });
  
  return true;
}
