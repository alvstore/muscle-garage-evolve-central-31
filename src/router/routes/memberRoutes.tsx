
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
    path: 'members',
    children: [
      // List all members
      {
        index: true,
        element: (
          <PrivateRoute allowedRoles={['admin', 'staff', 'trainer']}>
            <MembersListPage />
          </PrivateRoute>
        )
      },
      // Create new member
      {
        path: 'new',
        element: (
          <PrivateRoute allowedRoles={['admin', 'staff']}>
            <NewMemberPage />
          </PrivateRoute>
        )
      },
      // Current user's profile
      {
        path: 'profile',
        element: (
          <PrivateRoute allowedRoles={['admin', 'staff', 'trainer', 'member']}>
            <MemberProfilePage />
          </PrivateRoute>
        )
      },
      // Member progress
      {
        path: 'progress/:id',
        element: (
          <PrivateRoute allowedRoles={['admin', 'staff', 'trainer', 'member']}>
            <MemberProgressPage />
          </PrivateRoute>
        )
      },
      // Edit member
      {
        path: ':id/edit',
        element: (
          <PrivateRoute allowedRoles={['admin', 'staff']}>
            <EditMemberPage />
          </PrivateRoute>
        )
      },
      // View member by ID
      {
        path: ':id',
        element: (
          <PrivateRoute allowedRoles={['admin', 'staff', 'trainer']}>
            <MemberProfilePage />
          </PrivateRoute>
        )
      },
      // View member by branch and ID
      {
        path: ':branchId/:id',
        element: (
          <PrivateRoute allowedRoles={['admin', 'staff', 'trainer']}>
            <MemberProfilePage />
          </PrivateRoute>
        )
      }
    ]
  }
];
