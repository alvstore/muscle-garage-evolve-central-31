
import React from 'react';
import { Navigate, RouteObject } from 'react-router-dom';
import PrivateRoute from '@/components/auth/PrivateRoute';
import DashboardLayout from '@/components/layout/DashboardLayout';

// Pages
import Index from '@/pages/Index';
import NotFound from '@/pages/NotFound';
import Login from '@/pages/auth/Login';
import Unauthorized from '@/pages/auth/Unauthorized';
import Dashboard from '@/pages/dashboard/Dashboard';
import RealTimeDashboardPage from '@/pages/dashboard/RealTimeDashboardPage';

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

// Load the public website
import PublicWebsite from '@/pages/website/PublicWebsite';

export const appRoutes: RouteObject[] = [
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/',
    element: <PublicWebsite />
  },
  {
    path: '/dashboard',
    element: <Navigate to="/dashboard/overview" replace />
  },
  {
    path: '/unauthorized',
    element: <Unauthorized />
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
        ]
      }
    ]
  },
  {
    path: '*',
    element: <NotFound />
  }
];
