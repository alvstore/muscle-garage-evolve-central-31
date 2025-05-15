
import { toast as sonnerToast } from 'sonner';

// Simplified toast interface for components that expect the shadcn/ui toast API
export function useToast() {
  return {
    toast: (props: any) => {
      const { title, description, variant, ...rest } = props;
      
      if (variant === 'destructive') {
        return sonnerToast.error(title, {
          description,
          ...rest
        });
      }
      
      return sonnerToast(title, {
        description,
        ...rest
      });
    }
  };
}

// Export a compatible toast function 
export const toast = {
  // Standard toast
  (title: string, options?: any) {
    return sonnerToast(title, options);
  },
  
  // Variants
  success(title: string, options?: any) {
    return sonnerToast.success(title, options);
  },
  
  error(title: string, options?: any) {
    return sonnerToast.error(title, options);
  },
  
  warning(title: string, options?: any) {
    return sonnerToast(title, {
      style: { backgroundColor: '#fff7ed', borderColor: '#fdba74' },
      ...options
    });
  },
  
  info(title: string, options?: any) {
    return sonnerToast.info(title, options);
  },
  
  // For components expecting shadcn/ui toast API
  destructive(title: string, options?: any) {
    return sonnerToast.error(title, options);
  }
};

export default { useToast, toast };
