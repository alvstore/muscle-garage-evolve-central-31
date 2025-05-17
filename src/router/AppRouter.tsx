
import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { appRoutes } from './appRoutes';
import { PermissionsProvider } from '@/hooks/permissions/use-permissions-manager';
import { AuthProvider } from '@/hooks/use-auth';
import { BranchProvider } from '@/hooks/use-branches';

// Create the router with all defined routes
const router = createBrowserRouter(appRoutes);

export default function AppRouter() {
  return (
    <AuthProvider>
      <BranchProvider>
        <PermissionsProvider>
          <RouterProvider router={router} />
        </PermissionsProvider>
      </BranchProvider>
    </AuthProvider>
  );
}
