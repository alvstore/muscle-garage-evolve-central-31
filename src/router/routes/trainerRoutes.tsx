
import React from 'react';
import { RouteObject } from 'react-router-dom';
import PrivateRoute from '@/components/auth/PrivateRoute';

// Add placeholder pages that will be implemented later
const TrainerListPage = () => <div>Trainer List Page</div>;

export const trainerRoutes: RouteObject[] = [
  {
    path: '/trainers',
    element: (
      <PrivateRoute allowedRoles={['admin', 'staff']}>
        <TrainerListPage />
      </PrivateRoute>
    )
  }
];
