
import React from 'react';
import { RouteObject } from 'react-router-dom';
import PrivateRoute from '@/components/auth/PrivateRoute';

// Settings pages
import SettingsPage from '@/pages/settings/SettingsPage';
import IntegrationsPage from '@/pages/settings/IntegrationsPage';
import HikvisionIntegrationPage from '@/pages/settings/HikvisionIntegrationPage';
import HikvisionPartnerPage from '@/pages/settings/HikvisionPartnerPage';

export const settingsRoutes: RouteObject[] = [
  {
    path: '/settings',
    element: (
      <PrivateRoute allowedRoles={['admin']}>
        <SettingsPage />
      </PrivateRoute>
    )
  },
  {
    path: '/settings/integrations',
    element: (
      <PrivateRoute allowedRoles={['admin']}>
        <IntegrationsPage />
      </PrivateRoute>
    )
  },
  {
    path: '/settings/integrations/hikvision',
    element: (
      <PrivateRoute allowedRoles={['admin']}>
        <HikvisionIntegrationPage />
      </PrivateRoute>
    )
  },
  {
    path: '/settings/integrations/hikvision-partner',
    element: (
      <PrivateRoute allowedRoles={['admin']}>
        <HikvisionPartnerPage />
      </PrivateRoute>
    )
  }
];
