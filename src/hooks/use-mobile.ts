
import { useState, useEffect } from 'react';

export const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Initial check
    const checkForMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkForMobile();
    
    // Add event listener for window resize
    window.addEventListener('resize', checkForMobile);
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', checkForMobile);
    };
  }, []);

  return isMobile;
};
