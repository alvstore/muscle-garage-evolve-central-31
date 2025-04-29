import React from 'react';
import { RouteObject } from 'react-router-dom';
import PrivateRoute from '@/components/auth/PrivateRoute';
import TrainerPage from '@/pages/trainers/TrainerPage';
import TrainerPTPlansPage from '@/pages/trainers/TrainerPTPlansPage';

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
    path: '/trainers/pt-plans',
    element: (
      <PrivateRoute allowedRoles={['admin', 'staff', 'trainer']}>
        <TrainerPTPlansPage />
      </PrivateRoute>
    )
  }
];