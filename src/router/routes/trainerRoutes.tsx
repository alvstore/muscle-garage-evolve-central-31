
import React from 'react';
import { RouteObject } from 'react-router-dom';
import PrivateRoute from '@/components/auth/PrivateRoute';

// Trainer pages
const TrainerListPage = () => <div>Trainer List Page</div>;
const TrainerProfilePage = () => <div>Trainer Profile Page</div>;
const TrainerSchedulePage = () => <div>Trainer Schedule Page</div>;

export const trainerRoutes: RouteObject[] = [
  {
    path: '/trainers',
    element: (
      <PrivateRoute allowedRoles={['admin', 'staff']}>
        <TrainerListPage />
      </PrivateRoute>
    )
  },
  {
    path: '/trainers/:id',
    element: (
      <PrivateRoute allowedRoles={['admin', 'staff', 'trainer']}>
        <TrainerProfilePage />
      </PrivateRoute>
    )
  },
  {
    path: '/trainers/schedule',
    element: (
      <PrivateRoute allowedRoles={['admin', 'staff', 'trainer']}>
        <TrainerSchedulePage />
      </PrivateRoute>
    )
  }
];
