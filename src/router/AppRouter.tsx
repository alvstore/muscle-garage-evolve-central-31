
import React, { useEffect } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { appRoutes } from './appRoutes';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/use-auth';

// Create the router with all defined routes
const router = createBrowserRouter(appRoutes);

export default function AppRouter() {
  const { isAuthenticated } = useAuth();
  
  // When the app loads, set up auth listener to fetch the session
  useEffect(() => {
    // Always check the session on initial load
    const checkSession = async () => {
      try {
        console.log("Checking initial session");
        const { data, error } = await supabase.auth.getSession();
        if (error) {
          console.error("Session check error:", error);
        }
        console.log("Initial session check complete, authenticated:", !!data.session);
      } catch (error) {
        console.error("Error checking session:", error);
      }
    };
    
    checkSession();
  }, []);
  
  // Provide access to the router throughout the application
  return <RouterProvider router={router} />;
}

// Implement a more robust PrivateRoute component
const PrivateRoute = ({ element, requiredRoles, ...rest }) => {
  const { user, userRole, isLoading } = useAuth();
  
  // Show loading indicator while auth state is being determined
  if (isLoading) {
    return <LoadingScreen message="Checking access permissions..." />;
  }
  
  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/login" state={{ from: rest.location }} replace />;
  }
  
  // Check if user has required role
  const hasRequiredRole = requiredRoles.includes(userRole || user.role);
  
  if (!hasRequiredRole) {
    return <Navigate to="/unauthorized" replace />;
  }
  
  return element;
};
