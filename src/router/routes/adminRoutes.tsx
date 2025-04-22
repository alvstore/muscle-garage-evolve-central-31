
import React from 'react';
import { RouteObject } from 'react-router-dom';
import PrivateRoute from '@/components/auth/PrivateRoute';
import AdminDashboard from '@/pages/dashboard/AdminDashboard';
import MembersListPage from '@/pages/members/MembersListPage';
import MembershipPage from '@/pages/membership/MembershipPage';
import ClassPage from '@/pages/classes/ClassPage';
import StaffListPage from '@/pages/staff/StaffListPage';
import TrainerPage from '@/pages/trainers/TrainerPage';
import LeadsPage from '@/pages/crm/LeadsPage';
import FunnelPage from '@/pages/crm/FunnelPage';
import FollowUpPage from '@/pages/crm/FollowUpPage';
import PromoPage from '@/pages/marketing/PromoPage';
import ReferralPage from '@/pages/marketing/ReferralPage';
import InventoryPage from '@/pages/inventory/InventoryPage';
import StorePage from '@/pages/store/StorePage';
import FitnessPlanPage from '@/pages/fitness/FitnessPlanPage';
import MemberProgressPage from '@/pages/members/MemberProgressPage';
import WorkoutPlansPage from '@/pages/fitness/WorkoutPlansPage';
import AnnouncementPage from '@/pages/communication/AnnouncementPage';
import FeedbackPage from '@/pages/communication/FeedbackPage';
import CommunicationNotificationsPage from '@/pages/communication/ReminderPage';
import ReportsPage from '@/pages/reports/ReportsPage';
import FinanceDashboardPage from '@/pages/finance/FinanceDashboardPage';
import InvoicePage from '@/pages/finance/InvoicePage';
import TransactionPage from '@/pages/finance/TransactionPage';
import IncomeRecordsPage from '@/pages/finance/IncomeRecordsPage';
import ExpenseRecordsPage from '@/pages/finance/ExpenseRecordsPage';
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
        <MembersListPage />
      </PrivateRoute>
    )
  },
  {
    path: '/memberships',
    element: (
      <PrivateRoute allowedRoles={['admin', 'staff']}>
        <MembershipPage />
      </PrivateRoute>
    )
  },
  {
    path: '/classes',
    element: (
      <PrivateRoute allowedRoles={['admin', 'staff']}>
        <ClassPage />
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
    path: '/crm/leads',
    element: (
      <PrivateRoute allowedRoles={['admin', 'staff']}>
        <LeadsPage />
      </PrivateRoute>
    )
  },
  {
    path: '/crm/funnel',
    element: (
      <PrivateRoute allowedRoles={['admin', 'staff']}>
        <FunnelPage />
      </PrivateRoute>
    )
  },
  {
    path: '/crm/follow-up',
    element: (
      <PrivateRoute allowedRoles={['admin', 'staff']}>
        <FollowUpPage />
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
    path: '/fitness-plans',
    element: (
      <PrivateRoute allowedRoles={['admin', 'staff']}>
        <FitnessPlanPage />
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
        <AnnouncementPage />
      </PrivateRoute>
    )
  },
  {
    path: '/communication/feedback',
    element: (
      <PrivateRoute allowedRoles={['admin', 'staff']}>
        <FeedbackPage />
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
