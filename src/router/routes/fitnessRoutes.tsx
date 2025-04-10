
import React from 'react';
import WorkoutPlansPage from '@/pages/fitness/WorkoutPlansPage';
import FitnessPlanPage from '@/pages/fitness/FitnessPlanPage';
import DietPlanPage from '@/pages/fitness/DietPlanPage';

export const fitnessRoutes = [
  {
    path: '/fitness-plans',
    element: <FitnessPlanPage />
  },
  {
    path: '/fitness/workout-plans',
    element: <WorkoutPlansPage />
  },
  {
    path: '/fitness/diet-plans',
    element: <DietPlanPage />
  }
];
