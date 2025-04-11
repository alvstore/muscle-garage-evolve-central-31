
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
import ReportsPage from '@/pages/reports/ReportsPage';
import ClassPage from '@/pages/classes/ClassPage';

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
import { attendanceRoutes } from './routes/attendanceRoutes';
import { memberProfileRoutes } from './routes/memberProfileRoutes';

export const appRoutes: RouteObject[] = [
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/',
    element: <Index />
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
            path: '/dashboard',
            element: <Dashboard />
          },
          {
            path: '/dashboard/overview',
            element: <Dashboard />
          },
          {
            path: '/reports',
            element: <ReportsPage />
          },
          {
            path: '/classes',
            element: <ClassPage />
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
          ...attendanceRoutes,
          ...memberProfileRoutes,
        ]
      }
    ]
  },
  {
    path: '*',
    element: <NotFound />
  }
];
