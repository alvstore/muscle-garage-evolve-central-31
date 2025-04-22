
import React from 'react';
import { RouteObject } from 'react-router-dom';
import PrivateRoute from '@/components/auth/PrivateRoute';
import FitnessPlanPage from '@/pages/fitness/FitnessPlanPage';
import MemberProgressPage from '@/pages/members/MemberProgressPage';
import WorkoutPlansPage from '@/pages/fitness/WorkoutPlansPage';
import AdminDietPlansPage from '@/pages/admin/AdminDietPlansPage';
import FitnessProgressPage from '@/pages/fitness/FitnessProgressPage';

export const adminFitnessRoutes: RouteObject[] = [
  {
    path: '/fitness-plans',
    element: (
      <PrivateRoute allowedRoles={['admin', 'staff']}>
        <FitnessPlanPage />
      </PrivateRoute>
    )
  },
  {
    path: '/members/progress',
    element: (
      <PrivateRoute allowedRoles={['admin', 'staff']}>
        <MemberProgressPage />
      </PrivateRoute>
    )
  },
  {
    path: '/fitness/progress',
    element: (
      <PrivateRoute allowedRoles={['admin', 'staff']}>
        <FitnessProgressPage />
      </PrivateRoute>
    )
  },
  {
    path: '/fitness/workout-plans',
    element: (
      <PrivateRoute allowedRoles={['admin', 'staff']}>
        <WorkoutPlansPage />
      </PrivateRoute>
    )
  },
  {
    path: '/admin/diet-plans',
    element: (
      <PrivateRoute allowedRoles={['admin']}>
        <AdminDietPlansPage />
      </PrivateRoute>
    )
  }
];
