import React from 'react';
import { PermissionsProvider } from '@/hooks/permissions/use-permissions-manager';
import { AuthProvider } from '@/hooks/auth/use-auth';
import { BranchProvider } from '@/hooks/settings/use-branches';
import { createAppRouter, CustomRouterProvider } from './createRouter';

// Create the router instance with all future flags enabled
const router = createAppRouter();

export default function AppRouter() {
  return (
    <AuthProvider>
      <BranchProvider>
        <PermissionsProvider>
          <CustomRouterProvider router={router} />
        </PermissionsProvider>
      </BranchProvider>
    </AuthProvider>
  );
}
