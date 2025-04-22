import React from 'react';
import { RouteObject } from 'react-router-dom';
import PrivateRoute from '@/components/auth/PrivateRoute';
import AdminDashboard from '@/pages/dashboard/AdminDashboard';
import MembersPage from '@/pages/members/MembersPage';
import MembershipsPage from '@/pages/memberships/MembershipsPage';
import ClassesPage from '@/pages/classes/ClassesPage';
import StaffListPage from '@/pages/staff/StaffListPage';
import TrainersPage from '@/pages/trainers/TrainerPage';
import CRMLeadsPage from '@/pages/crm/CRMLeadsPage';
import CRMFunnelPage from '@/pages/crm/CRMFunnelPage';
import CRMFollowUpPage from '@/pages/crm/CRMFollowUpPage';
import MarketingPromoPage from '@/pages/marketing/MarketingPromoPage';
import MarketingReferralPage from '@/pages/marketing/MarketingReferralPage';
import InventoryPage from '@/pages/inventory/InventoryPage';
import StorePage from '@/pages/store/StorePage';
import FitnessPlansPage from '@/pages/fitness/FitnessPlanPage';
import MemberProgressPage from '@/pages/fitness/MemberProgressPage';
import WorkoutPlansPage from '@/pages/fitness/WorkoutPlansPage';
import CommunicationAnnouncementsPage from '@/pages/communication/CommunicationAnnouncementsPage';
import CommunicationFeedbackPage from '@/pages/communication/CommunicationFeedbackPage';
import CommunicationNotificationsPage from '@/pages/communication/CommunicationNotificationsPage';
import ReportsPage from '@/pages/reports/ReportsPage';
import FinanceDashboardPage from '@/pages/finance/FinanceDashboardPage';
import FinanceInvoicesPage from '@/pages/finance/FinanceInvoicesPage';
import FinanceTransactionsPage from '@/pages/finance/FinanceTransactionsPage';
import FinanceIncomePage from '@/pages/finance/FinanceIncomePage';
import FinanceExpensesPage from '@/pages/finance/FinanceExpensesPage';
import ClassTypesPage from '@/pages/classes/ClassTypesPage';
import TaskManagerPage from '@/pages/communication/TaskManagerPage';
import AdminDietPlansPage from '@/pages/admin/AdminDietPlansPage';

export const adminRoutes: RouteObject[] = [
  {
    path: '/',
    element: (
      <PrivateRoute allowedRoles={['admin', 'staff']}>
        <AdminDashboard />
      </PrivateRoute>
    )
  },
  {
    path: '/members',
    element: (
      <PrivateRoute allowedRoles={['admin', 'staff']}>
        <MembersPage />
      </PrivateRoute>
    )
  },
  {
    path: '/memberships',
    element: (
      <PrivateRoute allowedRoles={['admin', 'staff']}>
        <MembershipsPage />
      </PrivateRoute>
    )
  },
  {
    path: '/classes',
    element: (
      <PrivateRoute allowedRoles={['admin', 'staff']}>
        <ClassesPage />
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
        <TrainersPage />
      </PrivateRoute>
    )
  },
  {
    path: '/crm/leads',
    element: (
      <PrivateRoute allowedRoles={['admin', 'staff']}>
        <CRMLeadsPage />
      </PrivateRoute>
    )
  },
  {
    path: '/crm/funnel',
    element: (
      <PrivateRoute allowedRoles={['admin', 'staff']}>
        <CRMFunnelPage />
      </PrivateRoute>
    )
  },
  {
    path: '/crm/follow-up',
    element: (
      <PrivateRoute allowedRoles={['admin', 'staff']}>
        <CRMFollowUpPage />
      </PrivateRoute>
    )
  },
  {
    path: '/marketing/promo',
    element: (
      <PrivateRoute allowedRoles={['admin', 'staff']}>
        <MarketingPromoPage />
      </PrivateRoute>
    )
  },
  {
    path: '/marketing/referral',
    element: (
      <PrivateRoute allowedRoles={['admin', 'staff']}>
        <MarketingReferralPage />
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
    path: '/fitness-plans',
    element: (
      <PrivateRoute allowedRoles={['admin', 'staff']}>
        <FitnessPlansPage />
      </PrivateRoute>
    )
  },
  {
    path: '/fitness/progress',
    element: (
      <PrivateRoute allowedRoles={['admin', 'staff']}>
        <MemberProgressPage />
      </PrivateRoute>
    )
  },
  {
    path: '/fitness/workout-plans',
    element: (
      <PrivateRoute allowedRoles={['admin', 'staff']}>
        <WorkoutPlansPage />
      </PrivateRoute>
    )
  },
  {
    path: '/communication/announcements',
    element: (
      <PrivateRoute allowedRoles={['admin', 'staff']}>
        <CommunicationAnnouncementsPage />
      </PrivateRoute>
    )
  },
  {
    path: '/communication/feedback',
    element: (
      <PrivateRoute allowedRoles={['admin', 'staff']}>
        <CommunicationFeedbackPage />
      </PrivateRoute>
    )
  },
  {
    path: '/communication/notifications',
    element: (
      <PrivateRoute allowedRoles={['admin', 'staff']}>
        <CommunicationNotificationsPage />
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
        <FinanceInvoicesPage />
      </PrivateRoute>
    )
  },
  {
    path: '/finance/transactions',
    element: (
      <PrivateRoute allowedRoles={['admin', 'staff']}>
        <FinanceTransactionsPage />
      </PrivateRoute>
    )
  },
  {
    path: '/finance/income',
    element: (
      <PrivateRoute allowedRoles={['admin', 'staff']}>
        <FinanceIncomePage />
      </PrivateRoute>
    )
  },
  {
    path: '/finance/expenses',
    element: (
      <PrivateRoute allowedRoles={['admin', 'staff']}>
        <FinanceExpensesPage />
      </PrivateRoute>
    )
  },
  {
    path: '/classes/types',
    element: (
      <PrivateRoute allowedRoles={['admin', 'staff']}>
        <ClassTypesPage />
      </PrivateRoute>
    )
  },
  {
    path: '/communication/tasks',
    element: (
      <PrivateRoute allowedRoles={['admin', 'staff']}>
        <TaskManagerPage />
      </PrivateRoute>
    )
  },
  {
    path: '/admin/diet-plans',
    element: (
      <PrivateRoute allowedRoles={['admin']}>
        <AdminDietPlansPage />
      </PrivateRoute>
    )
  },
];
