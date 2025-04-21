
import React from 'react';
import { RouteObject } from 'react-router-dom';
import PrivateRoute from '@/components/auth/PrivateRoute';
import StaffListPage from '@/pages/staff/StaffListPage';

export const staffRoutes: RouteObject[] = [
  {
    path: '/staff',
    element: (
      <PrivateRoute allowedRoles={['admin', 'staff']}>
        <StaffListPage />
      </PrivateRoute>
    )
  },
  {
    path: '/staff/list',
    element: (
      <PrivateRoute allowedRoles={['admin', 'staff']}>
        <StaffListPage />
      </PrivateRoute>
    )
  }
];
