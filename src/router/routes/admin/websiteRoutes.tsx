
import React from 'react';
import { RouteObject } from 'react-router-dom';
import PrivateRoute from '@/components/auth/PrivateRoute';

const WebsiteManagementPage = () => <div>Website Management Page</div>;

export const websiteRoutes: RouteObject[] = [
  {
    path: '/website',
    element: (
      <PrivateRoute allowedRoles={['admin']}>
        <WebsiteManagementPage />
      </PrivateRoute>
    )
  }
];
