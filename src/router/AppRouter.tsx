
import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { appRoutes } from './appRoutes';
import { supabase } from '@/integrations/supabase/client';
import { PermissionsProvider } from '@/hooks/permissions/use-permissions-manager';

// Create the router with all defined routes
const router = createBrowserRouter(appRoutes);

export default function AppRouter() {
  // When the app loads, set up auth listener to fetch the session
  React.useEffect(() => {
    // Always check the session on initial load
    const checkSession = async () => {
      try {
        await supabase.auth.getSession();
        
        // Set up auth state change listener
        const {
          data: { subscription },
        } = supabase.auth.onAuthStateChange(async (event, session) => {
          // Handle auth state changes if needed
          console.log('Auth state changed:', event);
        });

        // Cleanup subscription on unmount
        return () => {
          subscription.unsubscribe();
        };
      } catch (error) {
        console.error("Error checking session:", error);
      }
    };
    
    checkSession();
  }, []);
  
  // Provide access to the router throughout the application, wrapped with PermissionsProvider
  return (
    <PermissionsProvider>
      <RouterProvider router={router} />
    </PermissionsProvider>
  );
}
