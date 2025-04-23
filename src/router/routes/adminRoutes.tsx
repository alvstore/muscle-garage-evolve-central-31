import React from 'react';
import { RouteObject } from 'react-router-dom';
import { adminDashboardRoutes } from './admin/dashboardRoutes';
import { adminMembershipRoutes } from './admin/membershipRoutes';
import { adminClassRoutes } from './admin/classRoutes';
import { adminFitnessRoutes } from './admin/fitnessRoutes';
import { adminCommunicationRoutes } from './admin/communicationRoutes';
import { adminCrmRoutes } from './admin/crmRoutes';
import { adminWebsiteRoutes } from './admin/websiteRoutes';
import StaffListPage from '@/pages/staff/StaffListPage';
import TrainerPage from '@/pages/trainers/TrainerPage';
import PromoPage from '@/pages/marketing/PromoPage';
import ReferralPage from '@/pages/marketing/ReferralPage';
import InventoryPage from '@/pages/inventory/InventoryPage';
import StorePage from '@/pages/store/StorePage';
import ReportsPage from '@/pages/reports/ReportsPage';
import FinanceDashboardPage from '@/pages/finance/FinanceDashboardPage';
import InvoicePage from '@/pages/finance/InvoicePage';
import TransactionPage from '@/pages/finance/TransactionPage';
import IncomeRecordsPage from '@/pages/finance/IncomeRecordsPage';
import ExpenseRecordsPage from '@/pages/finance/ExpenseRecordsPage';
import WebsiteManagementPage from '@/pages/website/WebsiteManagementPage';
import PrivateRoute from '@/components/auth/PrivateRoute';

export const adminRoutes: RouteObject[] = [
  ...adminDashboardRoutes,
  ...adminMembershipRoutes,
  ...adminClassRoutes,
  ...adminFitnessRoutes,
  ...adminCommunicationRoutes,
  ...adminCrmRoutes,
  ...adminWebsiteRoutes,
  {
    path: '/website',
    element: (
      <PrivateRoute allowedRoles={['admin']}>
        <WebsiteManagementPage />
      </PrivateRoute>
    )
  },
  {
    path: '/website/:section',
    element: (
      <PrivateRoute allowedRoles={['admin']}>
        <WebsiteManagementPage />
      </PrivateRoute>
    )
  },
  {
    path: '/staff',
    element: (
      <PrivateRoute allowedRoles={['admin', 'staff']}>
        <StaffListPage />
      </PrivateRoute>
    )
  },
  {
    path: '/trainers',
    element: (
      <PrivateRoute allowedRoles={['admin', 'staff']}>
        <TrainerPage />
      </PrivateRoute>
    )
  },
  {
    path: '/marketing/promo',
    element: (
      <PrivateRoute allowedRoles={['admin', 'staff']}>
        <PromoPage />
      </PrivateRoute>
    )
  },
  {
    path: '/marketing/referral',
    element: (
      <PrivateRoute allowedRoles={['admin', 'staff']}>
        <ReferralPage />
      </PrivateRoute>
    )
  },
  {
    path: '/inventory',
    element: (
      <PrivateRoute allowedRoles={['admin', 'staff']}>
        <InventoryPage />
      </PrivateRoute>
    )
  },
  {
    path: '/store',
    element: (
      <PrivateRoute allowedRoles={['admin', 'staff']}>
        <StorePage />
      </PrivateRoute>
    )
  },
  {
    path: '/reports',
    element: (
      <PrivateRoute allowedRoles={['admin', 'staff']}>
        <ReportsPage />
      </PrivateRoute>
    )
  },
  {
    path: '/finance/dashboard',
    element: (
      <PrivateRoute allowedRoles={['admin', 'staff']}>
        <FinanceDashboardPage />
      </PrivateRoute>
    )
  },
  {
    path: '/finance/invoices',
    element: (
      <PrivateRoute allowedRoles={['admin', 'staff']}>
        <InvoicePage />
      </PrivateRoute>
    )
  },
  {
    path: '/finance/transactions',
    element: (
      <PrivateRoute allowedRoles={['admin', 'staff']}>
        <TransactionPage />
      </PrivateRoute>
    )
  },
  {
    path: '/finance/income',
    element: (
      <PrivateRoute allowedRoles={['admin', 'staff']}>
        <IncomeRecordsPage />
      </PrivateRoute>
    )
  },
  {
    path: '/finance/expenses',
    element: (
      <PrivateRoute allowedRoles={['admin', 'staff']}>
        <ExpenseRecordsPage />
      </PrivateRoute>
    )
  }
];
