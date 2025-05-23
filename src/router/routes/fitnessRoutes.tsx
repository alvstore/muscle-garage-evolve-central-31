import React from 'react';
import { RouteObject } from 'react-router-dom';
import PrivateRoute from '@/components/auth/PrivateRoute';

// Fitness pages
import FitnessPlanPage from '@/pages/fitness/FitnessPlanPage';
import FitnessProgressPage from '@/pages/fitness/FitnessProgressPage';
import DietPlanPage from '@/pages/fitness/DietPlanPage';
import WorkoutPlansPage from '@/pages/fitness/WorkoutPlansPage';
import ClassPage from '@/pages/classes/ClassPage';
import MembershipPage from '@/pages/membership/MembershipPage';
import AttendancePage from '@/pages/attendance/AttendancePage';

// Admin/Staff specific pages - reusing trainer components but with different permissions
import TrainerWorkoutPlansPage from '@/pages/trainers/TrainerWorkoutPlansPage';
import TrainerDietPlansPage from '@/pages/trainers/TrainerDietPlansPage';

export const fitnessRoutes: RouteObject[] = [
  {
    path: '/fitness-plans',
    element: (
      <PrivateRoute allowedRoles={['admin', 'staff', 'trainer', 'member']}>
        <FitnessPlanPage />
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
  {
    path: '/fitness/diet',
    element: (
      <PrivateRoute allowedRoles={['admin', 'staff', 'trainer', 'member']}>
        <DietPlanPage />
      </PrivateRoute>
    )
  },
  {
    path: '/fitness/workout-plans',
    element: (
      <PrivateRoute allowedRoles={['admin', 'staff', 'trainer', 'member']}>
        <WorkoutPlansPage />
      </PrivateRoute>
    )
  },
  {
    path: '/classes',
    element: (
      <PrivateRoute>
        <ClassPage />
      </PrivateRoute>
    )
  },
  {
    path: '/membership',
    element: (
      <PrivateRoute>
        <MembershipPage />
      </PrivateRoute>
    )
  },
  {
    path: '/memberships',
    element: (
      <PrivateRoute>
        <MembershipPage />
      </PrivateRoute>
    )
  },
  {
    path: '/attendance',
    element: (
      <PrivateRoute>
        <AttendancePage />
      </PrivateRoute>
    )
  },
  {
    path: '/admin/workout-plans',
    element: (
      <PrivateRoute allowedRoles={['admin', 'staff']}>
        <TrainerWorkoutPlansPage />
      </PrivateRoute>
    )
  },
  {
    path: '/admin/diet-plans',
    element: (
      <PrivateRoute allowedRoles={['admin', 'staff']}>
        <TrainerDietPlansPage />
      </PrivateRoute>
    )
  },
  {
    path: '/fitness/workout-plans',
    element: (
      <PrivateRoute allowedRoles={['admin', 'staff', 'trainer', 'member']}>
        <WorkoutPlansPage />
      </PrivateRoute>
    )
  },
  {
    path: '/fitness/diet',
    element: (
      <PrivateRoute allowedRoles={['admin', 'staff', 'trainer', 'member']}>
        <DietPlanPage />
      </PrivateRoute>
    )
  }
];
