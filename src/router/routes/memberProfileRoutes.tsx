
import React from 'react';
import MemberProfilePage from '@/pages/members/MemberProfilePage';
import FitnessProgressPage from '@/pages/fitness/FitnessProgressPage';

export const memberProfileRoutes = [
  {
    path: '/members/profile',
    element: <MemberProfilePage />
  },
  {
    path: '/fitness/progress',
    element: <FitnessProgressPage />
  }
];
