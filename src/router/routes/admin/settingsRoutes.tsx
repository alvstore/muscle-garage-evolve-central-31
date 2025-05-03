
import React from 'react';
import { RouteObject } from 'react-router-dom';
import PrivateRoute from '@/components/auth/PrivateRoute';
import UnifiedSettingsPage from '@/pages/settings/UnifiedSettingsPage';

export const settingsRoutes: RouteObject[] = [
  {
    path: '/settings',
    element: (
      <PrivateRoute allowedRoles={['admin', 'staff']}>
        <UnifiedSettingsPage />
      </PrivateRoute>
    )
  }
];
