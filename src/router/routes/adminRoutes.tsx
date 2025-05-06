
import React from 'react';
import { AppRoute } from '@/types/route';
import AdminDashboard from '@/pages/dashboard/AdminDashboard';
import SystemBackupPage from '@/pages/admin/SystemBackupPage';
import UserManagementPage from '@/pages/admin/UserManagementPage';
import TrainerPage from '@/pages/trainers/TrainerPage';
import WebsiteManagementPage from '@/pages/website/WebsiteManagementPage';
import { 
  LayoutDashboard, 
  Users, 
  Archive,
  Globe,
  Dumbbell
} from 'lucide-react';

export const adminRoutes: AppRoute[] = [
  {
    path: '/admin/dashboard',
    element: <AdminDashboard />,
    meta: {
      title: 'Admin Dashboard',
      breadcrumb: 'Dashboard',
      permission: 'view_dashboard',
      icon: <LayoutDashboard className="h-5 w-5" />
    }
  },
  {
    path: '/admin/backup',
    element: <SystemBackupPage />,
    meta: {
      title: 'System Backup',
      breadcrumb: 'System Backup',
      permission: 'manage_settings',
      icon: <Archive className="h-5 w-5" />
    }
  },
  {
    path: '/system-backup',
    element: <SystemBackupPage />,
    meta: {
      title: 'System Backup & Restore',
      breadcrumb: 'System Backup',
      permission: 'manage_settings',
      hideInNav: true
    }
  },
  {
    path: '/admin/user-management',
    element: <UserManagementPage />,
    meta: {
      title: 'User Management',
      breadcrumb: 'User Management',
      permission: 'manage_staff',
      icon: <Users className="h-5 w-5" />
    }
  },
  {
    path: '/trainer-management',
    element: <TrainerPage />,
    meta: {
      title: 'Trainer Management',
      breadcrumb: 'Trainers',
      permission: 'manage_trainers',
      icon: <Dumbbell className="h-5 w-5" />
    }
  },
  {
    path: '/website',
    element: <WebsiteManagementPage />,
    meta: {
      title: 'Website Management',
      breadcrumb: 'Website',
      permission: 'manage_website',
      icon: <Globe className="h-5 w-5" />
    }
  },
  {
    path: '/website/:section',
    element: <WebsiteManagementPage />,
    meta: {
      title: 'Website Management',
      breadcrumb: 'Website',
      permission: 'manage_website',
      hideInNav: true
    }
  }
];
