
import { useEffect } from 'react';

/**
 * A hook to handle document visibility changes without causing full page refreshes
 * @param onVisibilityChange Optional callback for visibility change events
 */
export const useVisibilityChange = (
  onVisibilityChange?: (isVisible: boolean) => void
) => {
  useEffect(() => {
    const handleVisibilityChange = () => {
      const isVisible = document.visibilityState === 'visible';
      
      // Call custom handler if provided
      if (onVisibilityChange) {
        onVisibilityChange(isVisible);
      }
    };

    // Add event listener
    document.addEventListener('visibilitychange', handleVisibilityChange, false);

    // Clean up
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [onVisibilityChange]);
};
