
import { toast } from '@/utils/toast-manager';
import { useToast as useShadcnToast } from '@/components/ui/use-toast';
import { useEffect } from 'react';

export const useToastManager = () => {
  const { toast: shadowToast } = useShadcnToast();
  
  // Set up the event listener for showing toasts
  useEffect(() => {
    const handleToastEvent = (event: Event) => {
      const options = (event as CustomEvent).detail;
      shadowToast(options);
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
