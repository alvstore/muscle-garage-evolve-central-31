
import React from 'react';
import { RouteObject } from 'react-router-dom';
import PrivateRoute from '@/components/auth/PrivateRoute';
import FitnessPlanPage from '@/pages/fitness/FitnessPlanPage';
import WorkoutPlanPage from '@/pages/fitness/WorkoutPlanPage';
import DietPlanPage from '@/pages/fitness/DietPlanPage';
import MemberProgressPage from '@/pages/fitness/MemberProgressPage';

export const fitnessRoutes: RouteObject[] = [
  {
    path: '/fitness-plans',
    element: (
      <PrivateRoute allowedRoles={['admin', 'staff', 'trainer']}>
        <FitnessPlanPage />
      </PrivateRoute>
    )
  },
  {
    path: '/fitness/workout-plans',
    element: (
      <PrivateRoute allowedRoles={['admin', 'staff', 'trainer']}>
        <WorkoutPlanPage />
      </PrivateRoute>
    )
  },
  {
    path: '/fitness/diet-plans',
    element: (
      <PrivateRoute allowedRoles={['admin', 'staff', 'trainer']}>
        <DietPlanPage />
      </PrivateRoute>
    )
  },
  {
    path: '/fitness/progress',
    element: (
      <PrivateRoute allowedRoles={['admin', 'staff', 'trainer']}>
        <MemberProgressPage />
      </PrivateRoute>
    )
  }
];
