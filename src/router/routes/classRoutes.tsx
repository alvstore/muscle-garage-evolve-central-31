
import React from 'react';
import { RouteObject } from 'react-router-dom';
import PrivateRoute from '@/components/auth/PrivateRoute';
import ClassesPage from '@/pages/classes/ClassesPage';
import ClassSchedulePage from '@/pages/classes/ClassSchedulePage';
import ClassDetailsPage from '@/pages/classes/ClassDetailsPage';
import ClassAttendancePage from '@/pages/classes/ClassAttendancePage';
import ClassTypesPage from '@/pages/classes/ClassTypesPage';
import ClassCreatePage from '@/pages/classes/ClassCreatePage';

export const classRoutes: RouteObject[] = [
  {
    path: '/classes',
    element: (
      <PrivateRoute allowedRoles={['admin', 'staff', 'trainer']}>
        <ClassesPage />
      </PrivateRoute>
    )
  },
  {
    path: '/classes/schedule',
    element: (
      <PrivateRoute allowedRoles={['admin', 'staff', 'trainer', 'member']}>
        <ClassSchedulePage />
      </PrivateRoute>
    )
  },
  {
    path: '/classes/:id',
    element: (
      <PrivateRoute allowedRoles={['admin', 'staff', 'trainer']}>
        <ClassDetailsPage />
      </PrivateRoute>
    )
  },
  {
    path: '/classes/attendance/:id',
    element: (
      <PrivateRoute allowedRoles={['admin', 'staff', 'trainer']}>
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
  },
  {
    path: '/classes/create',
    element: (
      <PrivateRoute allowedRoles={['admin', 'staff']}>
        <ClassCreatePage />
      </PrivateRoute>
    )
  },
  {
    path: '/classes/edit/:id',
    element: (
      <PrivateRoute allowedRoles={['admin', 'staff']}>
        <ClassCreatePage />
      </PrivateRoute>
    )
  }
];
