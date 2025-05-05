
import React from 'react';
import { RouteObject } from 'react-router-dom';
import PrivateRoute from '@/components/auth/PrivateRoute';
import ClassSchedulePage from '@/pages/classes/ClassSchedulePage'; 
import ClassDetailsPage from '@/pages/classes/ClassDetailsPage';
import ClassAttendancePage from '@/pages/classes/ClassAttendancePage';
import ClassTypesPage from '@/pages/classes/ClassTypesPage';

export const classRoutes: RouteObject[] = [
  {
    path: '/classes',
    element: (
      <PrivateRoute>
        <ClassSchedulePage />
      </PrivateRoute>
    )
  },
  {
    path: '/classes/details/:id',
    element: (
      <PrivateRoute>
        <ClassDetailsPage />
      </PrivateRoute>
    )
  },
  {
    path: '/classes/attendance/:id',
    element: (
      <PrivateRoute>
        <ClassAttendancePage />
      </PrivateRoute>
    )
  },
  {
    path: '/classes/types',
    element: (
      <PrivateRoute allowedRoles={['admin', 'staff']}>
        <ClassTypesPage />
      </PrivateRoute>
    )
  }
];
