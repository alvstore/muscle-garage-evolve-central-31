
import { RouteObject } from 'react-router-dom';
import { adminDashboardRoutes } from './routes/admin/dashboardRoutes';
import { profileRoutes } from './routes/admin/profileRoutes';
import { financeRoutes } from './routes/admin/financeRoutes';
import { settingsRoutes } from './routes/admin/settingsRoutes';
import { websiteRoutes } from './routes/admin/websiteRoutes';
import { adminMembershipRoutes } from './routes/admin/membershipRoutes';
import AdminLayout from '@/layouts/AdminLayout';
import SystemBackupPage from '@/pages/admin/SystemBackupPage';

const AdminRoutes: RouteObject = {
  path: '/',
  element: <AdminLayout />,
  children: [
    ...adminDashboardRoutes,
    ...profileRoutes,
    ...financeRoutes,
    ...settingsRoutes,
    ...websiteRoutes,
    ...adminMembershipRoutes,
    {
      path: '/system-backup',
      element: <SystemBackupPage />
    },
  ],
};

export default AdminRoutes;
