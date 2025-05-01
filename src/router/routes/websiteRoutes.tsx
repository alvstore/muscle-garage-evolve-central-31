
import React from 'react';
import { RouteObject } from 'react-router-dom';
import WebsiteManagementPage from '@/pages/website/WebsiteManagementPage';
import PrivateRoute from '@/components/auth/PrivateRoute';

export const websiteRoutes: RouteObject[] = [
  {
    path: '/website',
    element: (
      <PrivateRoute allowedRoles={['admin', 'staff']}>
        <WebsiteManagementPage />
      </PrivateRoute>
    )
  },
  {
    path: '/website/:section',
    element: (
      <PrivateRoute allowedRoles={['admin', 'staff']}>
        <WebsiteManagementPage />
      </PrivateRoute>
    )
  }
];
