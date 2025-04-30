
import React from 'react';
import { RouteObject } from 'react-router-dom';
import PrivateRoute from '@/components/auth/PrivateRoute';

// Member pages
import MembersListPage from '@/pages/members/MembersListPage';
import NewMemberPage from '@/pages/members/NewMemberPage';
import MemberProfilePage from '@/pages/members/MemberProfilePage';
import MemberProgressPage from '@/pages/members/MemberProgressPage';
import MemberEditPage from '@/pages/members/MemberEditPage';

export const memberRoutes: RouteObject[] = [
  {
    path: '/members',
    element: (
      <PrivateRoute allowedRoles={['admin', 'staff', 'trainer']}>
        <MembersListPage />
      </PrivateRoute>
    )
  },
  {
    path: '/members/new',
    element: (
      <PrivateRoute allowedRoles={['admin', 'staff']}>
        <NewMemberPage />
      </PrivateRoute>
    )
  },
  {
    path: '/members/profile',
    element: (
      <PrivateRoute allowedRoles={['admin', 'staff', 'trainer', 'member']}>
        <MemberProfilePage />
      </PrivateRoute>
    )
  },
  {
    path: '/members/:id',
    element: (
      <PrivateRoute allowedRoles={['admin', 'staff', 'trainer']}>
        <MemberProfilePage />
      </PrivateRoute>
    )
  },
  {
    path: '/members/:id/edit',
    element: (
      <PrivateRoute allowedRoles={['admin', 'staff']}>
        <MemberEditPage />
      </PrivateRoute>
    )
  },
  {
    path: '/members/progress/:id',
    element: (
      <PrivateRoute allowedRoles={['admin', 'staff', 'trainer', 'member']}>
        <MemberProgressPage />
      </PrivateRoute>
    )
  }
];
