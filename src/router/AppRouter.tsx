
import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { appRoutes } from './appRoutes';
import { supabase } from '@/integrations/supabase/client';

// Create the router with all defined routes
const router = createBrowserRouter(appRoutes);

export default function AppRouter() {
  // When the app loads, set up auth listener to fetch the session
  React.useEffect(() => {
    // Always check the session on initial load
    const checkSession = async () => {
      try {
        await supabase.auth.getSession();
      } catch (error) {
        console.error("Error checking session:", error);
      }
    };
    
    checkSession();
  }, []);
  
  // Provide access to the router throughout the application
  return <RouterProvider router={router} />;
}
