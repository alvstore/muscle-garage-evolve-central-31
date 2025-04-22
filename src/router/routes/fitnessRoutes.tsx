
import React from 'react';
import { RouteObject } from 'react-router-dom';
import PrivateRoute from '@/components/auth/PrivateRoute';

// Fitness pages
import FitnessPlanPage from '@/pages/fitness/FitnessPlanPage';
import WorkoutPlansPage from '@/pages/fitness/WorkoutPlansPage';
import DietPlansPage from '@/pages/fitness/DietPlansPage';

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
        <WorkoutPlansPage />
      </PrivateRoute>
    )
  },
  {
    path: '/fitness/diet-plans',
    element: (
      <PrivateRoute allowedRoles={['admin', 'staff', 'trainer']}>
        <DietPlansPage />
      </PrivateRoute>
    )
  },
  // Member-specific fitness routes
  {
    path: '/my-plans',
    element: (
      <PrivateRoute allowedRoles={['member']}>
        <FitnessPlanPage />
      </PrivateRoute>
    )
  }
];
