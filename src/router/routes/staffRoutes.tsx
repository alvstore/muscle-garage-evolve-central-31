
import React from 'react';
import { RouteObject } from 'react-router-dom';
import PrivateRoute from '@/components/auth/PrivateRoute';
import StaffListPage from '@/pages/staff/StaffListPage';
import TrainersListPage from '@/pages/trainers/TrainersListPage';
import TrainerProfilePage from '@/pages/trainers/TrainerProfilePage';

export const staffRoutes: RouteObject[] = [
  {
    path: '/staff',
    element: (
      <PrivateRoute allowedRoles={['admin', 'staff']}>
        <StaffListPage />
      </PrivateRoute>
    )
  },
  {
    path: '/trainers',
    element: (
      <PrivateRoute allowedRoles={['admin', 'staff']}>
        <TrainersListPage />
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
  }
];
