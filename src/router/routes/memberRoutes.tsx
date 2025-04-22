
import React from 'react';
import { RouteObject } from 'react-router-dom';
import PrivateRoute from '@/components/auth/PrivateRoute';

// Member pages
import MembersListPage from '@/pages/members/MembersListPage';
import NewMemberPage from '@/pages/members/NewMemberPage';
import MemberProfilePage from '@/pages/members/MemberProfilePage';
import MemberProgressPage from '@/pages/members/MemberProgressPage';

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
    path: '/members/progress/:id',
    element: (
      <PrivateRoute allowedRoles={['admin', 'staff', 'trainer', 'member']}>
        <MemberProgressPage />
      </PrivateRoute>
    )
  },
  // Member-specific profile routes
  {
    path: '/profile',
    element: (
      <PrivateRoute allowedRoles={['member']}>
        <MemberProfilePage />
      </PrivateRoute>
    )
  },
  {
    path: '/payments',
    element: (
      <PrivateRoute allowedRoles={['member']}>
        <MemberProfilePage />
      </PrivateRoute>
    )
  },
  {
    path: '/attendance',
    element: (
      <PrivateRoute allowedRoles={['member']}>
        <MemberProgressPage />
      </PrivateRoute>
    )
  },
  {
    path: '/bookings',
    element: (
      <PrivateRoute allowedRoles={['member']}>
        <MemberProfilePage />
      </PrivateRoute>
    )
  }
];
