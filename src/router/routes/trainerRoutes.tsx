
import React from 'react';
import { RouteObject } from 'react-router-dom';
import TrainerPage from '@/pages/trainers/TrainerPage';
import TrainerClassesPage from '@/pages/trainers/TrainerClassesPage';
import TrainerMemberProgressPage from '@/pages/trainers/TrainerMemberProgressPage';
import TrainerAllocationPage from '@/pages/trainers/TrainerAllocationPage';
import TrainerAnnouncementPage from '@/pages/trainers/TrainerAnnouncementPage';

export const trainerRoutes: RouteObject[] = [
  {
    path: '/trainers',
    element: <TrainerPage />
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
