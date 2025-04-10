
import React from 'react';
import { RouteObject } from 'react-router-dom';
import PrivateRoute from '@/components/auth/PrivateRoute';

// Import fitness pages
import BodyMeasurementPage from '@/pages/fitness/BodyMeasurementPage';
import DietPlanPage from '@/pages/fitness/DietPlanPage';
import FitnessPlanPage from '@/pages/fitness/FitnessPlanPage';
import FitnessProgressPage from '@/pages/fitness/FitnessProgressPage';
import WorkoutPlansPage from '@/pages/fitness/WorkoutPlansPage';

export const fitnessRoutes: RouteObject[] = [
  {
    path: '/fitness/body-measurements',
    element: (
      <PrivateRoute allowedRoles={['admin', 'trainer', 'member']}>
        <BodyMeasurementPage />
      </PrivateRoute>
    )
  },
  {
    path: '/fitness/diet-plans',
    element: (
      <PrivateRoute allowedRoles={['admin', 'trainer', 'member']}>
        <DietPlanPage />
      </PrivateRoute>
    )
  },
  {
    path: '/fitness/fitness-plans',
    element: (
      <PrivateRoute allowedRoles={['admin', 'trainer']}>
        <FitnessPlanPage />
      </PrivateRoute>
    )
  },
  {
    path: '/fitness/progress',
    element: (
      <PrivateRoute allowedRoles={['admin', 'trainer', 'member']}>
        <FitnessProgressPage />
      </PrivateRoute>
    )
  },
  {
    path: '/fitness/workout-plans',
    element: (
      <PrivateRoute allowedRoles={['admin', 'trainer', 'member']}>
        <WorkoutPlansPage />
      </PrivateRoute>
    )
  }
];
