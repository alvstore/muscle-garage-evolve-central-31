
import React from 'react';
import { RouteObject } from 'react-router-dom';
import AdminDashboard from '@/pages/dashboard/AdminDashboard';
import BranchManagementPage from '@/pages/settings/BranchManagementPage';
import SystemBackupPage from '@/pages/admin/SystemBackupPage';
import UserManagementPage from '@/pages/admin/UserManagementPage';
import RolePermissionsPage from '@/pages/admin/RolePermissionsPage';
import TrainerPage from '@/pages/trainers/TrainerPage';
import WebsiteManagementPage from '@/pages/website/WebsiteManagementPage';

export const adminRoutes: RouteObject[] = [
  {
    path: '/admin/dashboard',
    element: <AdminDashboard />
  },
  {
    path: '/admin/backup',
    element: <SystemBackupPage />
  },
  {
    path: '/trainer-management',
    element: <TrainerPage />
  },
  {
    path: '/admin/user-management',
    element: <UserManagementPage />
  },
  {
    path: '/admin/roles-permissions',
    element: <RolePermissionsPage />
  },
  {
    path: '/admin/branch-management',
    element: <BranchManagementPage />
  },
  {
    path: '/website',
    element: <WebsiteManagementPage />
  },
  {
    path: '/website/:section',
    element: <WebsiteManagementPage />
  }
];
