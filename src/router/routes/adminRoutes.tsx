
import React from 'react';
import { AppRoute } from '@/types/route';
import AdminDashboard from '@/pages/dashboard/AdminDashboard';
import SystemBackupPage from '@/pages/admin/SystemBackupPage';
import UserManagementPage from '@/pages/admin/UserManagementPage';
import TrainerList from '@/pages/trainers/index';
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
    path: '/dashboard/admin',
    element: <AdminDashboard />,
    meta: {
      title: 'Admin Dashboard',
      breadcrumb: 'Dashboard',
      permission: 'view:dashboard',
      icon: <LayoutDashboard className="h-5 w-5" />
    }
  },
  {
    path: '/admin/backup',
    element: <SystemBackupPage />,
    meta: {
      title: 'System Backup',
      breadcrumb: 'Backup',
      permission: 'edit:settings',
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
      breadcrumb: 'Users',
      permission: 'view:staff',
      icon: <Users className="h-5 w-5" />
    }
  },
  {
    path: '/trainer-management',
    element: <TrainerList />,
    meta: {
      title: 'Trainer Management',
      breadcrumb: 'Trainers',
      permission: 'view:trainers',
      icon: <Dumbbell className="h-5 w-5" />
    }
  },
  {
    path: '/website',
    element: <WebsiteManagementPage />,
    meta: {
      title: 'Website Management',
      breadcrumb: 'Website',
      permission: 'edit:settings',
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
