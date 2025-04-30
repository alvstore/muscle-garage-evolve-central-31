
import React from 'react';
import { RouteObject } from 'react-router-dom';
import TrainerDashboard from '@/pages/dashboard/TrainerDashboard';
import TrainerClassesPage from '@/pages/trainers/TrainerClassesPage';
import TrainerPage from '@/pages/trainers/TrainerPage';
import TrainerMemberProgressPage from '@/pages/trainers/TrainerMemberProgressPage';
import TrainerAllocationPage from '@/pages/trainers/TrainerAllocationPage';
import TrainerAnnouncementPage from '@/pages/trainers/TrainerAnnouncementPage';
import PrivateRoute from '@/components/auth/PrivateRoute';

export const trainerRoutes: RouteObject[] = [
  {
    path: '/trainer/dashboard',
    element: (
      <PrivateRoute allowedRoles={['trainer']}>
        <TrainerDashboard />
      </PrivateRoute>
    )
  },
  {
    path: '/trainer/classes',
    element: (
      <PrivateRoute allowedRoles={['trainer']}>
        <TrainerClassesPage />
      </PrivateRoute>
    )
  },
  {
    path: '/trainer/members',
    element: (
      <PrivateRoute allowedRoles={['trainer']}>
        <TrainerMemberProgressPage />
      </PrivateRoute>
    )
  },
  {
    path: '/trainer/allocation',
    element: (
      <PrivateRoute allowedRoles={['trainer']}>
        <TrainerAllocationPage />
      </PrivateRoute>
    )
  },
  {
    path: '/trainer/announcements',
    element: (
      <PrivateRoute allowedRoles={['trainer']}>
        <TrainerAnnouncementPage />
      </PrivateRoute>
    )
  },
  {
    path: '/trainer/management',
    element: (
      <PrivateRoute allowedRoles={['trainer']}>
        <TrainerPage />
      </PrivateRoute>
    )
  }
];
