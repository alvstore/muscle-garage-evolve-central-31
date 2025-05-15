
import { toast } from '@/utils/toast-manager';
import { useToast as useShadcnToast } from '@/components/ui/use-toast';
import { useEffect } from 'react';

export const useToast = () => {
  const { toast: shadowToast } = useShadcnToast();
  
  // Set up the event listener for showing toasts
  useEffect(() => {
    const handleToastEvent = (event: Event) => {
      const options = (event as CustomEvent).detail;
      if (typeof options === 'object' && options.description) {
        shadowToast({
          title: options.title,
          description: options.description,
          variant: options.variant,
          duration: options.duration
        });
      } else {
        // Fallback for legacy calls
        shadowToast({
          description: String(options)
        });
      }
    };
    
    window.addEventListener('show-toast', handleToastEvent);
    
    return () => {
      window.removeEventListener('show-toast', handleToastEvent);
    };
  }, [shadowToast]);
  
  return {
    toast
  };
};

// Re-export toast for direct import
export { toast } from '@/utils/toast-manager';
