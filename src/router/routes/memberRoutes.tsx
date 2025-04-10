
import React from 'react';
import MembershipPage from '@/pages/membership/MembershipPage';
import MembersListPage from '@/pages/members/MembersListPage';
import NewMemberPage from '@/pages/members/NewMemberPage';

export const memberRoutes = [
  {
    path: '/memberships',
    element: <MembershipPage />
  },
  {
    path: '/members',
    element: <MembersListPage />
  },
  {
    path: '/members/new',
    element: <NewMemberPage />
  }
];
