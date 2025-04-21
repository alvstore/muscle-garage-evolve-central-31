
import React from 'react';
import { RouteObject } from 'react-router-dom';
import PrivateRoute from '@/components/auth/PrivateRoute';
import FrontPagesManager from '@/pages/frontpages/FrontPagesManager';

export const websiteRoutes: RouteObject[] = [
  {
    path: '/website',
    element: (
      <PrivateRoute allowedRoles={['admin', 'staff']}>
        <FrontPagesManager />
      </PrivateRoute>
    )
  },
  {
    path: '/website/pages',
    element: (
      <PrivateRoute allowedRoles={['admin', 'staff']}>
        <FrontPagesManager />
      </PrivateRoute>
    )
  }
];
