
import React from 'react';
import ClassPage from '@/pages/classes/ClassPage';
import AttendancePage from '@/pages/attendance/AttendancePage';
import InventoryPage from '@/pages/inventory/InventoryPage';
import ReportsPage from '@/pages/reports/ReportsPage';

export const miscRoutes = [
  {
    path: '/classes',
    element: <ClassPage />
  },
  {
    path: '/attendance',
    element: <AttendancePage />
  },
  {
    path: '/inventory',
    element: <InventoryPage />
  },
  {
    path: '/reports',
    element: <ReportsPage />
  }
];
