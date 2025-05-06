
import React from 'react';
import { AppRoute } from '@/types/route';
import PrivateRoute from '@/components/auth/PrivateRoute';
import ClassPage from '@/pages/classes/ClassPage';
import ClassSchedulePage from '@/pages/classes/ClassSchedulePage';
import ClassDetailsPage from '@/pages/classes/ClassDetailsPage';
import ClassAttendancePage from '@/pages/classes/ClassAttendancePage';
import ClassTypesPage from '@/pages/classes/ClassTypesPage';
import ClassCreatePage from '@/pages/classes/ClassCreatePage';
import { Calendar, ListChecks, Info, Users, Tag, Plus } from 'lucide-react';

export const classRoutes: AppRoute[] = [
  {
    path: '/classes',
    element: (
      <PrivateRoute allowedRoles={['admin', 'staff', 'trainer']}>
        <ClassPage />
      </PrivateRoute>
    ),
    meta: {
      title: 'Classes',
      breadcrumb: 'Classes',
      permission: 'view_classes',
      icon: <Calendar className="h-5 w-5" />
    }
  },
  {
    path: '/classes/schedule',
    element: (
      <PrivateRoute allowedRoles={['admin', 'staff', 'trainer', 'member']}>
        <ClassSchedulePage />
      </PrivateRoute>
    ),
    meta: {
      title: 'Class Schedule',
      breadcrumb: 'Schedule',
      permission: 'view_classes',
      icon: <ListChecks className="h-5 w-5" />
    }
  },
  {
    path: '/classes/:id',
    element: (
      <PrivateRoute allowedRoles={['admin', 'staff', 'trainer']}>
        <ClassDetailsPage />
      </PrivateRoute>
    ),
    meta: {
      title: 'Class Details',
      breadcrumb: 'Class Details',
      permission: 'view_classes',
      icon: <Info className="h-5 w-5" />,
      hideInNav: true
    }
  },
  {
    path: '/classes/attendance/:id',
    element: (
      <PrivateRoute allowedRoles={['admin', 'staff', 'trainer']}>
        <ClassAttendancePage />
      </PrivateRoute>
    ),
    meta: {
      title: 'Class Attendance',
      breadcrumb: 'Attendance',
      permission: 'view_classes',
      icon: <Users className="h-5 w-5" />,
      hideInNav: true
    }
  },
  {
    path: '/classes/types',
    element: (
      <PrivateRoute allowedRoles={['admin', 'staff']}>
        <ClassTypesPage />
      </PrivateRoute>
    ),
    meta: {
      title: 'Class Types',
      breadcrumb: 'Class Types',
      permission: 'manage_classes',
      icon: <Tag className="h-5 w-5" />
    }
  },
  {
    path: '/classes/create',
    element: (
      <PrivateRoute allowedRoles={['admin', 'staff']}>
        <ClassCreatePage />
      </PrivateRoute>
    ),
    meta: {
      title: 'Create Class',
      breadcrumb: 'Create Class',
      permission: 'manage_classes',
      icon: <Plus className="h-5 w-5" />,
      hideInNav: true
    }
  },
  {
    path: '/classes/edit/:id',
    element: (
      <PrivateRoute allowedRoles={['admin', 'staff']}>
        <ClassCreatePage />
      </PrivateRoute>
    ),
    meta: {
      title: 'Edit Class',
      breadcrumb: 'Edit Class',
      permission: 'manage_classes',
      hideInNav: true
    }
  }
];
