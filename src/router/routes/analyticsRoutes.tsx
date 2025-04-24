
import React from 'react';
import { RouteObject } from 'react-router-dom';
import PrivateRoute from '@/components/auth/PrivateRoute';
import AnalyticsDashboardPage from '@/pages/analytics/AnalyticsDashboardPage';
import ReportsDashboard from '@/pages/reports/ReportsDashboard';

export const analyticsRoutes: RouteObject[] = [
  {
    path: '/analytics',
    element: (
      <PrivateRoute allowedRoles={['admin', 'staff']}>
        <AnalyticsDashboardPage />
      </PrivateRoute>
    )
  },
  {
    path: '/reports',
    element: (
      <PrivateRoute allowedRoles={['admin', 'staff']}>
        <ReportsDashboard />
      </PrivateRoute>
    )
  }
];
