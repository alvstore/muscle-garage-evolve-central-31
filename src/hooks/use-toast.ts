
import { toast as sonnerToast, type ToastT, type ToastToDismiss, ExternalToast } from 'sonner';
import { ReactElement, ReactNode, JSXElementConstructor } from 'react';
import { v4 as uuidv4 } from 'uuid';

export type Toast = {
  id: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactNode;
  variant?: "default" | "destructive";
};

export function useToast() {
  // Store toast instances to be displayed
  const toasts: Toast[] = [];

  const generateToastId = () => uuidv4();

  const toast = {
    // Direct pass-through to sonner toast methods
    success: (message: string | { title: string; description?: string }) => {
      if (typeof message === 'string') {
        return sonnerToast.success(message);
      } else {
        return sonnerToast.success(message.title, {
          description: message.description
        });
      }
    },
    
    error: (message: string | { title: string; description?: string }) => {
      if (typeof message === 'string') {
        return sonnerToast.error(message);
      } else {
        return sonnerToast.error(message.title, {
          description: message.description
        });
      }
    },
    
    info: (message: string | { title: string; description?: string }) => {
      if (typeof message === 'string') {
        return sonnerToast.info(message);
      } else {
        return sonnerToast.info(message.title, {
          description: message.description
        });
      }
    },
    
    warning: (message: string | { title: string; description?: string }) => {
      if (typeof message === 'string') {
        return sonnerToast.warning(message);
      } else {
        return sonnerToast.warning(message.title, {
          description: message.description
        });
      }
    },
    
    loading: sonnerToast.loading,
    
    // Custom toast function
    toast: (props: Omit<Toast, 'id'>) => {
      const id = generateToastId();
      const toastWithId = { ...props, id };
      sonnerToast(props.title as string, {
        description: props.description,
      });
      return toastWithId;
    },
    
    // For compatibility with older code that expects the toasts array
    toasts
  };

  return toast;
}

// Re-export the toast function for convenience
export { sonnerToast as toast };
