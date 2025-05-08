
import React from 'react';
import { useVisibilityChange } from '@/hooks/use-visibility-change';
import { useToast } from '@/components/ui/use-toast';

interface VisibilityHandlerProps {
  children: React.ReactNode;
}

/**
 * Component to handle document visibility changes without causing full page refreshes
 * Wrap your app or main component with this to prevent unwanted refreshes on tab switches
 */
const VisibilityHandler: React.FC<VisibilityHandlerProps> = ({ children }) => {
  const { toast } = useToast();
  
  useVisibilityChange((isVisible) => {
    console.log('Tab visibility changed:', isVisible ? 'visible' : 'hidden');
    
    // Instead of refreshing, we can implement custom logic here
    // For example, we can refresh data when the user comes back to our tab
    if (isVisible) {
      // Optional: refresh certain data or show welcome back message
      // dispatch(refreshDataAction()) or similar
    }
  });
  
  return <>{children}</>;
};

export default VisibilityHandler;
