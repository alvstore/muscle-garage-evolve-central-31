
import React from 'react';
import { Navigate, RouteObject } from 'react-router-dom';
import PrivateRoute from '@/components/auth/PrivateRoute';
import RoleBasedRoute from '@/components/auth/RoleBasedRoute';
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
import AdminDashboard from '@/pages/dashboard/AdminDashboard';
import StaffDashboard from '@/pages/dashboard/StaffDashboard';
import TrainerDashboard from '@/pages/dashboard/TrainerDashboard';
import MemberDashboard from '@/pages/dashboard/MemberDashboard';
import NavigateToRoleDashboard from '@/components/auth/NavigateToRoleDashboard';

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
import { branchRoutes } from './routes/branchRoutes';
import { analyticsRoutes } from './routes/analyticsRoutes';
import { classRoutes } from './routes/classRoutes';

// Import remaining admin routes
import { adminDashboardRoutes } from './routes/admin/dashboardRoutes';
import { adminMembershipRoutes } from './routes/admin/membershipRoutes';
import { adminWebsiteRoutes } from './routes/admin/websiteRoutes';
import { profileRoutes } from './routes/admin/profileRoutes';

// Combine all admin routes
const adminRoutes: RouteObject[] = [
  ...(adminDashboardRoutes || []),
  ...(adminMembershipRoutes || []),
  ...(adminWebsiteRoutes || []),
  ...(profileRoutes || [])
];

// Ensure all route groups are properly typed as RouteObject arrays
const typedMemberRoutes = (memberRoutes as unknown) as RouteObject[];
const typedFitnessRoutes = (fitnessRoutes as unknown) as RouteObject[];
const typedTrainerRoutes = (trainerRoutes as unknown) as RouteObject[];
const typedCommunicationRoutes = (communicationRoutes as unknown) as RouteObject[];
const typedCrmRoutes = (crmRoutes as unknown) as RouteObject[];
const typedMarketingRoutes = (marketingRoutes as unknown) as RouteObject[];
const typedFinanceRoutes = (financeRoutes as unknown) as RouteObject[];
const typedSettingsRoutes = (settingsRoutes as unknown) as RouteObject[];
const typedMiscRoutes = (miscRoutes as unknown) as RouteObject[];
const typedStaffRoutes = (staffRoutes as unknown) as RouteObject[];
const typedAdminRoutes = (adminRoutes as unknown) as RouteObject[];
const typedBranchRoutes = (branchRoutes as unknown) as RouteObject[];
const typedAnalyticsRoutes = (analyticsRoutes as unknown) as RouteObject[];
const typedClassRoutes = (classRoutes as unknown) as RouteObject[];

// Public routes (no authentication required)
const publicRoutes: RouteObject[] = [
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
  // Public website routes can be added here if needed
];

// Protected routes (require authentication)
const protectedRoutes: RouteObject = {
  path: '/dashboard',
  element: (
    <PrivateRoute>
      <DashboardLayout />
    </PrivateRoute>
  ),
  children: [
    // Redirect to role-specific dashboard
    {
      index: true,
      element: <NavigateToRoleDashboard />
    },
    
    // Role-based dashboard routes
    {
      path: 'admin',
      element: (
        <RoleBasedRoute allowedRoles={['admin']}>
          <AdminDashboard />
        </RoleBasedRoute>
      )
    },
    {
      path: 'staff',
      element: (
        <RoleBasedRoute allowedRoles={['staff']}>
          <StaffDashboard />
        </RoleBasedRoute>
      )
    },
    {
      path: 'trainer',
      element: (
        <RoleBasedRoute allowedRoles={['trainer']}>
          <TrainerDashboard />
        </RoleBasedRoute>
      )
    },
    {
      path: 'member',
      element: (
        <RoleBasedRoute allowedRoles={['member']}>
          <MemberDashboard />
        </RoleBasedRoute>
      )
    },
    
    // Legacy routes for backward compatibility
    {
      path: 'overview',
      element: <Navigate to="/dashboard" replace />
    },
    {
      path: 'realtime',
      element: <RealTimeDashboardPage />
    },
    
    // Feature routes
    ...typedMemberRoutes,
    ...typedFitnessRoutes,
    ...typedCrmRoutes,
    ...typedCommunicationRoutes,
    ...typedMarketingRoutes,
    ...typedFinanceRoutes,
    ...typedSettingsRoutes,
    ...typedMiscRoutes,
    ...typedStaffRoutes,
    ...typedAdminRoutes,
    ...typedBranchRoutes,
    ...typedAnalyticsRoutes,
    ...typedClassRoutes,
    
    // Catch-all route for dashboard
    {
      path: '*',
      element: <Navigate to="/dashboard/overview" replace />
    }
  ]
};

export const appRoutes: RouteObject[] = [
  // Redirect root to dashboard
  {
    path: '/',
    element: <Navigate to="/dashboard" replace />
  },
  ...publicRoutes,
  protectedRoutes,
  // 404 route (must be last)
  {
    path: '*',
    element: <NotFound />
  }
];
