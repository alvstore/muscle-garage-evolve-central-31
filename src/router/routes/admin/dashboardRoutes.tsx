
import React from 'react';
import { RouteObject } from 'react-router-dom';
import PrivateRoute from '@/components/auth/PrivateRoute';
import AdminDashboard from '@/pages/dashboard/AdminDashboard';
import SystemBackupPage from '@/pages/admin/SystemBackupPage';

export const adminDashboardRoutes: RouteObject[] = [
  {
    path: '/',
    element: (
      <PrivateRoute allowedRoles={['admin', 'staff']}>
        <AdminDashboard />
      </PrivateRoute>
    )
  },
  {
    path: '/system-backup',
    element: (
      <PrivateRoute allowedRoles={['admin']}>
        <SystemBackupPage />
      </PrivateRoute>
    )
  }
];
