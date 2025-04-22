
import React from 'react';
import { RouteObject } from 'react-router-dom';
import PrivateRoute from '@/components/auth/PrivateRoute';
import MembersListPage from '@/pages/members/MembersListPage';
import MembershipPage from '@/pages/membership/MembershipPage';

export const adminMembershipRoutes: RouteObject[] = [
  {
    path: '/members',
    element: (
      <PrivateRoute allowedRoles={['admin', 'staff']}>
        <MembersListPage />
      </PrivateRoute>
    )
  },
  {
    path: '/memberships',
    element: (
      <PrivateRoute allowedRoles={['admin', 'staff']}>
        <MembershipPage />
      </PrivateRoute>
    )
  }
];
