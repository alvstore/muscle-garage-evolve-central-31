
import React from 'react';
import { Navigate, RouteObject } from 'react-router-dom';
import PrivateRoute from '@/components/auth/PrivateRoute';
import DashboardLayout from '@/layouts/DashboardLayout';
import WebsiteLayout from '@/layouts/WebsiteLayout';

// Pages
import Index from '@/pages/Index';
import NotFound from '@/pages/NotFound';
import Login from '@/pages/auth/Login';
import ForgotPassword from '@/pages/auth/ForgotPassword';
import ResetPassword from '@/pages/auth/ResetPassword';
import Unauthorized from '@/pages/auth/Unauthorized';
import Dashboard from '@/pages/dashboard/Dashboard';
import RealTimeDashboardPage from '@/pages/dashboard/RealTimeDashboardPage';

// Import website routes
import { websiteRoutes } from './routes/websiteRoutes';

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
import { profileRoutes } from './routes/admin/profileRoutes';

// Ensure all route groups are properly typed as RouteObject arrays
const typedMemberRoutes = memberRoutes as RouteObject[];
const typedFitnessRoutes = fitnessRoutes as RouteObject[];
const typedTrainerRoutes = trainerRoutes as RouteObject[];
const typedCommunicationRoutes = communicationRoutes as RouteObject[];
const typedCrmRoutes = crmRoutes as RouteObject[];
const typedMarketingRoutes = marketingRoutes as RouteObject[];
const typedFinanceRoutes = financeRoutes as RouteObject[];
const typedSettingsRoutes = settingsRoutes as RouteObject[];
const typedMiscRoutes = miscRoutes as RouteObject[];
const typedStaffRoutes = staffRoutes as RouteObject[];
const typedAdminRoutes = adminRoutes as RouteObject[];
const typedBranchRoutes = branchRoutes as RouteObject[];
const typedAnalyticsRoutes = analyticsRoutes as RouteObject[];
const typedClassRoutes = classRoutes as RouteObject[];
const typedWebsiteRoutes = websiteRoutes as RouteObject[];
const typedProfileRoutes = profileRoutes as RouteObject[];

export const appRoutes: RouteObject[] = [
  // Public website routes
  ...typedWebsiteRoutes,
  
  // Auth routes
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
          ...typedMemberRoutes,
          ...typedFitnessRoutes,
          ...typedTrainerRoutes,
          ...typedCommunicationRoutes,
          ...typedCrmRoutes,
          ...typedMarketingRoutes,
          ...typedFinanceRoutes,
          ...typedSettingsRoutes,
          ...typedMiscRoutes,
          ...typedStaffRoutes,
          ...typedAdminRoutes,
          ...typedBranchRoutes,
          ...typedAnalyticsRoutes,
          ...typedClassRoutes,
          ...typedProfileRoutes,
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
