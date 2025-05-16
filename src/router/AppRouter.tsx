
import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { appRoutes } from './appRoutes';
import { PermissionsProvider } from '@/hooks/permissions/use-permissions-manager';

// Create the router with all defined routes
const router = createBrowserRouter(appRoutes);

export default function AppRouter() {
  // Removed redundant auth listener as it's now handled in AuthStateProvider
  
  // Provide permissions context and router
  return (
    <PermissionsProvider>
      <RouterProvider router={router} />
    </PermissionsProvider>
  );
}
