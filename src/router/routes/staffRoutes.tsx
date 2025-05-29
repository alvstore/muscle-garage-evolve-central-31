
import React from 'react';
import { RouteObject } from 'react-router-dom';
import PrivateRoute from '@/components/auth/PrivateRoute';
import StaffListPage from '@/pages/staff/StaffListPage';
import StaffEditPage from '@/pages/staff/StaffEditPage';
import StaffDietPlansPage from '@/pages/staff/StaffDietPlansPage';

export const staffRoutes: RouteObject[] = [
  {
    path: 'staff',
    element: (
      <PrivateRoute allowedRoles={['admin', 'staff']}>
        <StaffListPage />
      </PrivateRoute>
    )
  },
  {
    path: 'staff/list',
    element: (
      <PrivateRoute allowedRoles={['admin', 'staff']}>
        <StaffListPage />
      </PrivateRoute>
    )
  },
  {
    path: 'staff/edit/:id',
    element: (
      <PrivateRoute allowedRoles={['admin', 'staff']}>
        <StaffEditPage />
      </PrivateRoute>
    )
  },
  {
    path: 'fitness/diet-plans',
    element: (
      <PrivateRoute allowedRoles={['admin', 'staff']}>
        <StaffDietPlansPage />
      </PrivateRoute>
    )
  }
];
