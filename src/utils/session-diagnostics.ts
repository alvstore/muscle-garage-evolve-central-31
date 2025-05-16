
import { supabase } from '@/integrations/supabase/client';

// Only use in development for debugging
export const enableSessionDiagnostics = () => {
  if (process.env.NODE_ENV !== 'development') return;
  
  // Monitor visibility changes
  document.addEventListener('visibilitychange', () => {
    console.log('Visibility changed:', document.visibilityState);
    
    if (document.visibilityState === 'visible') {
      // Log session status when tab becomes visible again
      supabase.auth.getSession().then(({ data }) => {
        console.log('Session status on tab focus:', {
          hasSession: !!data.session,
          expiresAt: data.session?.expires_at
        });
      });
    }
  });
  
  // Monitor storage events which might indicate session changes
  window.addEventListener('storage', (event) => {
    if (event.key?.includes('supabase.auth')) {
      console.log('Auth storage changed:', event.key);
    }
  });
  
  console.log('Session diagnostics enabled');
};
