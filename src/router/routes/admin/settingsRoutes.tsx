
import React from 'react';
import { RouteObject } from 'react-router-dom';
import PrivateRoute from '@/components/auth/PrivateRoute';
import SettingsPage from '@/pages/settings/SettingsPage';
import IntegrationSettingsPage from '@/pages/settings/IntegrationSettingsPage';
import PaymentSettingsPage from '@/pages/settings/PaymentSettingsPage';

export const settingsRoutes: RouteObject[] = [
  {
    path: '/settings',
    element: (
      <PrivateRoute allowedRoles={['admin', 'staff']}>
        <SettingsPage />
      </PrivateRoute>
    )
  },
  {
    path: '/settings/integrations',
    element: (
      <PrivateRoute allowedRoles={['admin']}>
        <IntegrationSettingsPage />
      </PrivateRoute>
    )
  },
  {
    path: '/settings/payment',
    element: (
      <PrivateRoute allowedRoles={['admin']}>
        <PaymentSettingsPage />
      </PrivateRoute>
    )
  }
];
