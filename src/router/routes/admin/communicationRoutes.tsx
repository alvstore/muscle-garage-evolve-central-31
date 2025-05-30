
import React from 'react';
import { RouteObject } from 'react-router-dom';
import PrivateRoute from '@/components/auth/PrivateRoute';
import AnnouncementPage from '@/pages/communication/AnnouncementPage';
import FeedbackPage from '@/pages/communication/FeedbackPage';
import ReminderPage from '@/pages/communication/ReminderPage';
import MotivationalPage from '@/pages/communication/MotivationalPage';
import TaskManagerPage from '@/pages/communication/TaskManagerPage';

export const adminCommunicationRoutes: RouteObject[] = [
  {
    path: '/communication/announcements',
    element: (
      <PrivateRoute allowedRoles={['admin', 'staff']}>
        <AnnouncementPage />
      </PrivateRoute>
    )
  },
  {
    path: '/communication/feedback',
    element: (
      <PrivateRoute allowedRoles={['admin', 'staff']}>
        <FeedbackPage />
      </PrivateRoute>
    )
  },
  {
    path: '/communication/reminders',
    element: (
      <PrivateRoute allowedRoles={['admin', 'staff']}>
        <ReminderPage />
      </PrivateRoute>
    )
  },
  {
    path: '/communication/motivational',
    element: (
      <PrivateRoute allowedRoles={['admin', 'staff']}>
        <MotivationalPage />
      </PrivateRoute>
    )
  },
  {
    path: '/communication/tasks',
    element: (
      <PrivateRoute allowedRoles={['admin', 'staff']}>
        <TaskManagerPage />
      </PrivateRoute>
    )
  }
];
