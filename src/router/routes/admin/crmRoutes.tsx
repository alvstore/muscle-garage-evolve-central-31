
import React from 'react';
import { RouteObject } from 'react-router-dom';
import PrivateRoute from '@/components/auth/PrivateRoute';
import LeadsPage from '@/pages/crm/LeadsPage';
import FunnelPage from '@/pages/crm/FunnelPage';
import FollowUpPage from '@/pages/crm/FollowUpPage';

export const adminCrmRoutes: RouteObject[] = [
  {
    path: '/crm/leads',
    element: (
      <PrivateRoute allowedRoles={['admin', 'staff']}>
        <LeadsPage />
      </PrivateRoute>
    )
  },
  {
    path: '/crm/funnel',
    element: (
      <PrivateRoute allowedRoles={['admin', 'staff']}>
        <FunnelPage />
      </PrivateRoute>
    )
  },
  {
    path: '/crm/follow-up',
    element: (
      <PrivateRoute allowedRoles={['admin', 'staff']}>
        <FollowUpPage />
      </PrivateRoute>
    )
  }
];
