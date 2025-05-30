
import React from 'react';
import { RouteObject } from 'react-router-dom';
import PrivateRoute from '@/components/auth/PrivateRoute';

// Member pages
import MembersListPage from '@/pages/members/MembersListPage';
import NewMemberPage from '@/pages/members/NewMemberPage';
import MemberProfilePage from '@/pages/members/MemberProfilePage';
import MemberProgressPage from '@/pages/members/MemberProgressPage';
import EditMemberPage from '@/pages/members/EditMemberPage';

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
  // Route for admin prefix
  {
    path: '/admin/members/:id',
    element: (
      <PrivateRoute allowedRoles={['admin', 'staff', 'trainer']}>
        <MemberProfilePage />
      </PrivateRoute>
    )
  },
  // Route for member progress
  {
    path: '/members/progress/:id',
    element: (
      <PrivateRoute allowedRoles={['admin', 'staff', 'trainer', 'member']}>
        <MemberProgressPage />
      </PrivateRoute>
    )
  },
  // Extra routes for different URL patterns
  {
    path: '/members/:branchId/:id',
    element: (
      <PrivateRoute allowedRoles={['admin', 'staff', 'trainer']}>
        <MemberProfilePage />
      </PrivateRoute>
    )
  },
  {
    path: '/members/:id/profile',
    element: (
      <PrivateRoute allowedRoles={['admin', 'staff', 'trainer']}>
        <MemberProfilePage />
      </PrivateRoute>
    )
  },
  {
    path: '/members/:id/progress',
    element: (
      <PrivateRoute allowedRoles={['admin', 'staff', 'trainer', 'member']}>
        <MemberProgressPage />
      </PrivateRoute>
    )
  },
  {
    path: '/members/:id/edit',
    element: (
      <PrivateRoute allowedRoles={['admin', 'staff']}>
        <EditMemberPage />
      </PrivateRoute>
    )
  }
];
