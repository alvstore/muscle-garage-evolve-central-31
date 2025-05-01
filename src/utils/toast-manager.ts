
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

// Track shown toasts to prevent duplicates in rapid succession
const recentToasts: Record<string, number> = {};
const TOAST_DEBOUNCE_TIME = 3000; // 3 seconds

export const toast = {
  success: (message: string, options?: ToastOptions) => {
    if (shouldShowToast(message)) {
      sonnerToast.success(message, options);
    }
  },
  
  error: (message: string, options?: ToastOptions) => {
    if (shouldShowToast(message)) {
      sonnerToast.error(message, options);
    }
  },
  
  warning: (message: string, options?: ToastOptions) => {
    if (shouldShowToast(message)) {
      sonnerToast.warning(message, options);
    }
  },
  
  info: (message: string, options?: ToastOptions) => {
    if (shouldShowToast(message)) {
      sonnerToast.info(message, options);
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
