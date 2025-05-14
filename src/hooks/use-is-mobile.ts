
import { useState, useEffect } from 'react';

export function useIsMobile(breakpoint = 768): boolean {
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    // Check if window is defined (for SSR)
    if (typeof window !== 'undefined') {
      const checkIfMobile = () => {
        setIsMobile(window.innerWidth < breakpoint);
      };
      
      // Initial check
      checkIfMobile();
      
      // Add event listener
      window.addEventListener('resize', checkIfMobile);
      
      // Clean up
      return () => window.removeEventListener('resize', checkIfMobile);
    }
    
    return undefined;
  }, [breakpoint]);

  return isMobile;
}
