
import React from 'react';
import { RouteObject } from 'react-router-dom';
import TrainerPage from '@/pages/trainers/TrainerPage';
import TrainerClassesPage from '@/pages/trainers/TrainerClassesPage';
import TrainerMemberProgressPage from '@/pages/trainers/TrainerMemberProgressPage';
import TrainerAllocationPage from '@/pages/trainers/TrainerAllocationPage';
import TrainerMemberAllocationPage from '@/pages/trainers/TrainerMemberAllocationPage';
import TrainerAnnouncementPage from '@/pages/communication/TrainerAnnouncementPage';

// Placeholder components for routes that don't have specific page components yet
const PlaceholderPage = () => <div className="p-6"><h1 className="text-2xl font-bold mb-4">Coming Soon</h1><p>This feature is currently under development.</p></div>;

const TrainerAttendancePage = () => <PlaceholderPage />;
const TrainerPTPlansPage = () => <PlaceholderPage />;
const TrainerWorkoutPlansPage = () => <PlaceholderPage />;
const TrainerWorkoutAssignmentsPage = () => <PlaceholderPage />;
const TrainerDietPlansPage = () => <PlaceholderPage />;
const TrainerTasksPage = () => <PlaceholderPage />;
const TrainerProfilePage = () => <PlaceholderPage />;

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
    path: '/trainers/allocate/:id',
    element: <TrainerMemberAllocationPage />
  },
  {
    path: '/trainers/announcements',
    element: <TrainerAnnouncementPage />
  },
  {
    path: '/trainers/management',
    element: <TrainerPage />
  },
  // Add missing routes from trainerNavigation.tsx
  {
    path: '/trainers/attendance',
    element: <TrainerAttendancePage />
  },
  {
    path: '/trainers/pt-plans',
    element: <TrainerPTPlansPage />
  },
  {
    path: '/trainers/workout-plans',
    element: <TrainerWorkoutPlansPage />
  },
  {
    path: '/trainers/workout-assignments',
    element: <TrainerWorkoutAssignmentsPage />
  },
  {
    path: '/trainers/diet-plans',
    element: <TrainerDietPlansPage />
  },
  {
    path: '/trainers/member-progress',
    element: <TrainerMemberProgressPage />
  },
  {
    path: '/trainers/tasks',
    element: <TrainerTasksPage />
  },
  {
    path: '/trainers/profile',
    element: <TrainerProfilePage />
  }
];
