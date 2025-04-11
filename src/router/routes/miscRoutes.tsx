
import React from 'react';
import { RouteObject } from 'react-router-dom';
import PrivateRoute from '@/components/auth/PrivateRoute';

// Miscellaneous pages
import InventoryPage from '@/pages/inventory/InventoryPage';
import FrontPagesManager from '@/pages/frontpages/FrontPagesManager';
import BranchesPage from '@/pages/branches/BranchesPage';
import ReportsPage from '@/pages/reports/ReportsPage';

export const miscRoutes: RouteObject[] = [
  {
    path: '/inventory',
    element: (
      <PrivateRoute allowedRoles={['admin', 'staff']}>
        <InventoryPage />
      </PrivateRoute>
    )
  },
  {
    path: '/frontpages',
    element: (
      <PrivateRoute allowedRoles={['admin']}>
        <FrontPagesManager />
      </PrivateRoute>
    )
  },
  {
    path: '/branches',
    element: (
      <PrivateRoute allowedRoles={['admin']}>
        <BranchesPage />
      </PrivateRoute>
    )
  },
  {
    path: '/reports',
    element: (
      <PrivateRoute allowedRoles={['admin', 'staff', 'trainer']}>
        <ReportsPage />
      </PrivateRoute>
    )
  }
];
