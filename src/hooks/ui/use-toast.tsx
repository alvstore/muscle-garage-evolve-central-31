
import { useToast as useToastShadcn } from "@/components/ui/use-toast";
import { Toast as ToastShadcn } from "@/components/ui/use-toast";

export type ToastMessage = string | React.ReactNode;

export interface ToastProps {
  title?: string;
  description?: ToastMessage;
  variant?: 'default' | 'destructive';
  duration?: number;
}

export function useToast() {
  const { toast: toastShadcn } = useToastShadcn();

  // Helper function to create toast with consistent formatting
  const createToast = (
    message: ToastMessage,
    title?: string,
    variant: 'default' | 'destructive' = 'default',
    duration: number = 5000
  ) => {
    toastShadcn({
      title: title,
      description: message,
      variant: variant,
      duration: duration,
    });
  };
  
  // Basic toast methods
  const toast = {
    default: (message: ToastMessage, title?: string, duration?: number) => 
      createToast(message, title, 'default', duration),
    
    success: (message: ToastMessage, title?: string, duration?: number) => 
      createToast(message, title || 'Success', 'default', duration),
    
    warning: (message: ToastMessage, title?: string, duration?: number) => 
      createToast(message, title || 'Warning', 'default', duration),
    
    error: (message: ToastMessage, title?: string, duration?: number) => 
      createToast(message, title || 'Error', 'destructive', duration),
    
    destructive: (message: ToastMessage, title?: string, duration?: number) => 
      createToast(message, title, 'destructive', duration),
      
    info: (message: ToastMessage, title?: string, duration?: number) => 
      createToast(message, title || 'Information', 'default', duration),
  };

  // Also expose the original toast function for more complex cases
  return { toast, ...toastShadcn };
}
