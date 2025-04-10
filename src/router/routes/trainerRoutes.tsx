
import React from 'react';
import TrainerTaskPage from '@/pages/trainers/TrainerTaskPage';
import TrainerPage from '@/pages/trainers/TrainerPage';

export const trainerRoutes = [
  {
    path: '/trainers',
    element: <TrainerPage />
  },
  {
    path: '/trainers/tasks',
    element: <TrainerTaskPage />
  }
];
