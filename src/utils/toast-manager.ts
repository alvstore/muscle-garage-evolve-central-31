
import { toast as sonnerToast, ToastOptions } from 'sonner';

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
