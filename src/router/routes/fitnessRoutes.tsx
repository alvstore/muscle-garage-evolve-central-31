
import React from 'react';
import { RouteObject } from 'react-router-dom';
import PrivateRoute from '@/components/auth/PrivateRoute';

// Fitness pages
import FitnessPlanPage from '@/pages/fitness/FitnessPlanPage';
import WorkoutPlansPage from '@/pages/fitness/WorkoutPlansPage';
import DietPlansPage from '@/pages/fitness/DietPlansPage';
import FitnessProgressPage from '@/pages/fitness/FitnessProgressPage';

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
  {
    path: '/fitness/progress',
    element: (
      <PrivateRoute allowedRoles={['admin', 'staff', 'trainer', 'member']}>
        <FitnessProgressPage />
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
  },
  {
    path: '/my-workouts',
    element: (
      <PrivateRoute allowedRoles={['member']}>
        <WorkoutPlansPage />
      </PrivateRoute>
    )
  },
  {
    path: '/my-diet',
    element: (
      <PrivateRoute allowedRoles={['member']}>
        <DietPlansPage />
      </PrivateRoute>
    )
  }
];
