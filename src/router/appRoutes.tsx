
import React from 'react';
import { Navigate, RouteObject } from 'react-router-dom';
import PrivateRoute from '@/components/auth/PrivateRoute';
import DashboardLayout from '@/components/layout/DashboardLayout';

// Pages
import Index from '@/pages/Index';
import NotFound from '@/pages/NotFound';
import Login from '@/pages/auth/Login';
import ForgotPassword from '@/pages/auth/ForgotPassword';
import ResetPassword from '@/pages/auth/ResetPassword';
import Unauthorized from '@/pages/auth/Unauthorized';
import Dashboard from '@/pages/dashboard/Dashboard';
import RealTimeDashboardPage from '@/pages/dashboard/RealTimeDashboardPage';
import SystemBackupPage from '@/pages/admin/SystemBackupPage';

// Import route groups
import { memberRoutes } from './routes/memberRoutes';
import { fitnessRoutes } from './routes/fitnessRoutes';
import { trainerRoutes } from './routes/trainerRoutes';
import { communicationRoutes } from './routes/communicationRoutes';
import { crmRoutes } from './routes/crmRoutes';
import { marketingRoutes } from './routes/marketingRoutes';
import { financeRoutes } from './routes/financeRoutes';
import { settingsRoutes } from './routes/settingsRoutes';
import { miscRoutes } from './routes/miscRoutes';
import { staffRoutes } from './routes/staffRoutes';
import { adminRoutes } from './routes/adminRoutes';
import { branchRoutes } from './routes/branchRoutes';
import { analyticsRoutes } from './routes/analyticsRoutes';
import { websiteRoutes } from './routes/admin/websiteRoutes';

// Website page (placeholder)
const WebsitePage = () => <div>Website Management Page</div>;

export const appRoutes: RouteObject[] = [
  // Public routes
  {
    path: '/',
    element: <Index />
  },
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/forgot-password',
    element: <ForgotPassword />
  },
  {
    path: '/reset-password',
    element: <ResetPassword />
  },
  {
    path: '/unauthorized',
    element: <Unauthorized />
  },
  
  // Protected routes
  {
    path: '/dashboard',
    element: <Navigate to="/dashboard/overview" replace />
  },
  {
    element: <PrivateRoute />,
    children: [
      {
        element: <DashboardLayout />,
        children: [
          {
            path: '/dashboard/overview',
            element: <Dashboard />
          },
          {
            path: '/dashboard/realtime',
            element: <RealTimeDashboardPage />
          },
          {
            path: '/system-backup',
            element: <SystemBackupPage />
          },
          {
            path: '/website',
            element: <WebsitePage />
          },
          
          // Include route groups
          ...memberRoutes,
          ...fitnessRoutes,
          ...trainerRoutes,
          ...communicationRoutes,
          ...crmRoutes,
          ...marketingRoutes,
          ...financeRoutes,
          ...settingsRoutes,
          ...miscRoutes,
          ...staffRoutes,
          ...adminRoutes,
          ...branchRoutes,
          ...analyticsRoutes,
          ...websiteRoutes
        ]
      }
    ]
  },
  {
    path: '*',
    element: <NotFound />
  }
];
