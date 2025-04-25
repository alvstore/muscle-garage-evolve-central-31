
import React from 'react';
import { RouteObject } from 'react-router-dom';
import TrainerDashboard from '@/pages/dashboard/TrainerDashboard';
import TrainerClassesPage from '@/pages/trainers/TrainerClassesPage';
import TrainerPage from '@/pages/trainers/TrainerPage';
import TrainerMemberProgressPage from '@/pages/trainers/TrainerMemberProgressPage';
import TrainerAllocationPage from '@/pages/trainers/TrainerAllocationPage';
import TrainerAnnouncementPage from '@/pages/trainers/TrainerAnnouncementPage';

export const trainerRoutes: RouteObject[] = [
  {
    path: '/trainers/dashboard',
    element: <TrainerDashboard />
  },
  {
    path: '/trainers/classes',
    element: <TrainerClassesPage />
  },
  {
    path: '/trainers/members',
    element: <TrainerMemberProgressPage />
  },
  {
    path: '/trainers/allocation',
    element: <TrainerAllocationPage />
  },
  {
    path: '/trainers/announcements',
    element: <TrainerAnnouncementPage />
  },
  {
    path: '/trainers/management',
    element: <TrainerPage />
  }
];
