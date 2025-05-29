
import React from 'react';
import { RouteObject } from 'react-router-dom';
import PrivateRoute from '@/components/auth/PrivateRoute';
import BranchesPage from '@/pages/branches/BranchesPage';
import BranchStaffPage from '@/pages/branches/BranchStaffPage';
import BranchMembersPage from '@/pages/branches/BranchMembersPage';
import BranchDetailsPage from '@/pages/branches/BranchDetailsPage';
import BranchSettingsPage from '@/pages/branches/BranchSettingsPage';

export const branchRoutes: RouteObject[] = [
  {
    path: 'branches',
    element: (
      <PrivateRoute allowedRoles={['admin', 'staff']}>
        <BranchesPage />
      </PrivateRoute>
    )
  },
  {
    path: 'branches/:id',
    element: (
      <PrivateRoute allowedRoles={['admin', 'staff']}>
        <BranchDetailsPage />
      </PrivateRoute>
    )
  },
  {
    path: 'branches/:id/staff',
    element: (
      <PrivateRoute allowedRoles={['admin', 'staff']}>
        <BranchStaffPage />
      </PrivateRoute>
    )
  },
  {
    path: 'branches/:id/members',
    element: (
      <PrivateRoute allowedRoles={['admin', 'staff']}>
        <BranchMembersPage />
      </PrivateRoute>
    )
  },
  {
    path: 'branches/:id/settings',
    element: (
      <PrivateRoute allowedRoles={['admin', 'staff']}>
        <BranchSettingsPage />
      </PrivateRoute>
    )
  }
];
