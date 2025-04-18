
import React from 'react';
import { RouteObject } from 'react-router-dom';
import PrivateRoute from '@/components/auth/PrivateRoute';

// Trainer pages
import TrainerPage from '@/pages/trainers/TrainerPage';
import TrainerAllocationPage from '@/pages/trainers/TrainerAllocationPage';
import TrainerPTPlansPage from '@/pages/trainers/TrainerPTPlansPage';
import TrainerAttendancePage from '@/pages/trainers/TrainerAttendancePage';
import TrainerProfilePage from '@/pages/trainers/TrainerProfilePage';
import TrainerTaskPage from '@/pages/trainers/TrainerTaskPage';

export const trainerRoutes: RouteObject[] = [
  {
    path: '/trainers',
    element: (
      <PrivateRoute allowedRoles={['admin', 'staff']}>
        <TrainerPage />
      </PrivateRoute>
    )
  },
  {
    path: '/trainers/allocation',
    element: (
      <PrivateRoute allowedRoles={['admin', 'staff', 'trainer']}>
        <TrainerAllocationPage />
      </PrivateRoute>
    )
  },
  {
    path: '/trainers/pt-plans',
    element: (
      <PrivateRoute allowedRoles={['admin', 'staff', 'trainer']}>
        <TrainerPTPlansPage />
      </PrivateRoute>
    )
  },
  {
    path: '/trainers/attendance',
    element: (
      <PrivateRoute allowedRoles={['admin', 'staff', 'trainer']}>
        <TrainerAttendancePage />
      </PrivateRoute>
    )
  },
  {
    path: '/trainers/profile',
    element: (
      <PrivateRoute allowedRoles={['admin', 'staff', 'trainer']}>
        <TrainerProfilePage />
      </PrivateRoute>
    )
  },
  {
    path: '/trainers/tasks',
    element: (
      <PrivateRoute allowedRoles={['admin', 'staff', 'trainer']}>
        <TrainerTaskPage />
      </PrivateRoute>
    )
  }
];
