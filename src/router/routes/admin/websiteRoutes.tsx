
import React from 'react';
import { RouteObject } from 'react-router-dom';
import PrivateRoute from '@/components/auth/PrivateRoute';
import WebsiteManagementPage from '@/pages/website/WebsiteManagementPage';

export const adminWebsiteRoutes: RouteObject[] = [
  {
    path: 'website',
    element: (
      <PrivateRoute allowedRoles={['admin']}>
        <WebsiteManagementPage />
      </PrivateRoute>
    )
  },
  {
    path: 'website/:section',
    element: (
      <PrivateRoute allowedRoles={['admin']}>
        <WebsiteManagementPage />
      </PrivateRoute>
    )
  }
];
