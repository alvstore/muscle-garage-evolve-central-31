
import React from 'react';
import { RouteObject } from 'react-router-dom';
import PrivateRoute from '@/components/auth/PrivateRoute';
import ClassPage from '@/pages/classes/ClassPage';
import ClassTypesPage from '@/pages/classes/ClassTypesPage';

export const adminClassRoutes: RouteObject[] = [
  {
    path: '/classes',
    element: (
      <PrivateRoute allowedRoles={['admin', 'staff']}>
        <ClassPage />
      </PrivateRoute>
    )
  },
  {
    path: '/classes/types',
    element: (
      <PrivateRoute allowedRoles={['admin', 'staff']}>
        <ClassTypesPage />
      </PrivateRoute>
    )
  }
];
