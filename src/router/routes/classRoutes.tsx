import React, { lazy, Suspense } from 'react';
import { RouteObject } from 'react-router-dom';
import PrivateRoute from '@/components/auth/PrivateRoute';
import { Calendar, ListChecks, Info, Users, Tag, Plus, List, BookOpen } from 'lucide-react';
import { AppRoute } from '@/types/route';

// Use lazy loading to break circular dependencies
const ClassPage = lazy(() => import('@/pages/classes/ClassPage'));
const ClassSchedulePage = lazy(() => import('@/pages/classes/ClassSchedulePage'));
const ClassDetailsPage = lazy(() => import('@/pages/classes/ClassDetailsPage'));
const ClassAttendancePage = lazy(() => import('@/pages/classes/ClassAttendancePage'));
const ClassTypesPage = lazy(() => import('@/pages/classes/ClassTypesPage'));
const ClassCreatePage = lazy(() => import('@/pages/classes/ClassCreatePage'));
const ClassListPage = lazy(() => import('@/pages/classes/ClassListPage'));
const ClassBookingsPage = lazy(() => import('@/pages/classes/ClassBookingsPage'));

// Loading component
const LoadingComponent = () => <div className="p-4">Loading...</div>;

export const classRoutes: AppRoute[] = [
  {
    path: '/classes',
    element: (
      <PrivateRoute allowedRoles={['admin', 'staff', 'trainer']}>
        <Suspense fallback={<LoadingComponent />}>
          <ClassPage />
        </Suspense>
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
    path: '/classes/list',
    element: (
      <PrivateRoute allowedRoles={['admin', 'staff', 'trainer']}>
        <Suspense fallback={<LoadingComponent />}>
          <ClassListPage />
        </Suspense>
      </PrivateRoute>
    ),
    meta: {
      title: 'Class List',
      breadcrumb: 'Class List',
      permission: 'view_classes',
      icon: <List className="h-5 w-5" />
    }
  },
  {
    path: '/classes/bookings',
    element: (
      <PrivateRoute allowedRoles={['admin', 'staff', 'trainer']}>
        <Suspense fallback={<LoadingComponent />}>
          <ClassBookingsPage />
        </Suspense>
      </PrivateRoute>
    ),
    meta: {
      title: 'Class Bookings',
      breadcrumb: 'Bookings',
      permission: 'view_classes',
      icon: <BookOpen className="h-5 w-5" />
    }
  },
  {
    path: '/classes/schedule',
    element: (
      <PrivateRoute allowedRoles={['admin', 'staff', 'trainer', 'member']}>
        <Suspense fallback={<LoadingComponent />}>
          <ClassSchedulePage />
        </Suspense>
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
        <Suspense fallback={<LoadingComponent />}>
          <ClassDetailsPage />
        </Suspense>
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
        <Suspense fallback={<LoadingComponent />}>
          <ClassAttendancePage />
        </Suspense>
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
        <Suspense fallback={<LoadingComponent />}>
          <ClassTypesPage />
        </Suspense>
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
        <Suspense fallback={<LoadingComponent />}>
          <ClassCreatePage />
        </Suspense>
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
        <Suspense fallback={<LoadingComponent />}>
          <ClassCreatePage />
        </Suspense>
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
