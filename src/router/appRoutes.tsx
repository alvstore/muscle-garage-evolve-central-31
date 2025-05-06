
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
import { classRoutes } from './routes/classRoutes';

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
  
  // Dashboard route with redirect
  {
    path: '/dashboard',
    element: <Navigate to="/dashboard/overview" replace />
  },
  
  // Protected routes
  {
    element: <PrivateRoute />,
    children: [
      {
        element: <DashboardLayout />,
        children: [
          // Dashboard routes
          {
            path: '/dashboard/overview',
            element: <Dashboard />
          },
          {
            path: '/dashboard/realtime',
            element: <RealTimeDashboardPage />
          },
          
          // Include all route groups - these should be organized by feature domain
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
          ...classRoutes,
        ]
      }
    ]
  },
  
  // 404 route
  {
    path: '*',
    element: <NotFound />
  }
];
