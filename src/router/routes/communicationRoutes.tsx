
import React from 'react';
import { RouteObject } from 'react-router-dom';
import PrivateRoute from '@/components/auth/PrivateRoute';

// Communication pages
import FeedbackPage from '@/pages/communication/FeedbackPage';
import AnnouncementPage from '@/pages/communication/AnnouncementPage';
import ReminderPage from '@/pages/communication/ReminderPage';
import MotivationalPage from '@/pages/communication/MotivationalPage';
import TrainerNotificationsPage from '@/pages/communication/TrainerNotificationsPage';

export const communicationRoutes: RouteObject[] = [
  {
    path: '/communication/feedback',
    element: (
      <PrivateRoute>
        <FeedbackPage />
      </PrivateRoute>
    )
  },
  {
    path: '/communication/announcements',
    element: (
      <PrivateRoute>
        <AnnouncementPage />
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
      <PrivateRoute allowedRoles={['admin', 'staff', 'trainer']}>
        <MotivationalPage />
      </PrivateRoute>
    )
  },
  {
    path: '/communication/notifications',
    element: (
      <PrivateRoute allowedRoles={['admin', 'staff', 'trainer', 'member']}>
        <TrainerNotificationsPage />
      </PrivateRoute>
    )
  }
];
