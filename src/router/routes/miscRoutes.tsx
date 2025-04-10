
import React from 'react';
import ClassPage from '@/pages/classes/ClassPage';
import AttendancePage from '@/pages/attendance/AttendancePage';

export const miscRoutes = [
  {
    path: '/classes',
    element: <ClassPage />
  },
  {
    path: '/attendance',
    element: <AttendancePage />
  }
];
