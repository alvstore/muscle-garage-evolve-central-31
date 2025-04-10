
import React from 'react';
import TrainerTaskPage from '@/pages/trainers/TrainerTaskPage';

export const trainerRoutes = [
  {
    path: '/trainers',
    element: <TrainerTaskPage />
  },
  {
    path: '/trainers/tasks',
    element: <TrainerTaskPage />
  }
];
