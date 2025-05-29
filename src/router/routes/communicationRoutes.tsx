
import React from 'react';
import { RouteObject } from 'react-router-dom';
import PrivateRoute from '@/components/auth/PrivateRoute';

// Communication pages
import FeedbackPage from '@/pages/communication/FeedbackPage';
import AnnouncementPage from '@/pages/communication/AnnouncementPage';
import ReminderPage from '@/pages/communication/ReminderPage';
import MotivationalPage from '@/pages/communication/MotivationalPage';
import NotificationsPage from '@/pages/communication/NotificationsPage';
import TaskManagerPage from '@/pages/communication/TaskManagerPage';

export const communicationRoutes: RouteObject[] = [
  {
    path: 'notifications',
    element: (
      <PrivateRoute allowedRoles={['admin', 'staff', 'trainer', 'member']}>
        <NotificationsPage />
      </PrivateRoute>
    )
  },
  {
    path: 'feedback',
    element: (
      <PrivateRoute>
        <FeedbackPage />
      </PrivateRoute>
    )
  },
  {
    path: 'announcements',
    element: (
      <PrivateRoute>
        <AnnouncementPage />
      </PrivateRoute>
    )
  },
  {
    path: 'reminders',
    element: (
      <PrivateRoute allowedRoles={['admin', 'staff']}>
        <ReminderPage />
      </PrivateRoute>
    )
  },
  {
    path: 'motivational',
    element: (
      <PrivateRoute allowedRoles={['admin', 'staff', 'trainer']}>
        <MotivationalPage />
      </PrivateRoute>
    )
  },
  {
    path: 'notifications',
    element: (
      <PrivateRoute allowedRoles={['admin', 'staff', 'trainer', 'member']}>
        <NotificationsPage />
      </PrivateRoute>
    )
  },
  {
    path: 'tasks',
    element: (
      <PrivateRoute allowedRoles={['admin', 'staff', 'trainer']}>
        <TaskManagerPage />
      </PrivateRoute>
    )
  }
];
