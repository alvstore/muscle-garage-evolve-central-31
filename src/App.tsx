
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import Index from './pages/Index';
import NotFound from './pages/NotFound';
import InventoryPage from './pages/inventory/InventoryPage';
import LeadsPage from './pages/crm/LeadsPage';
import FunnelPage from './pages/crm/FunnelPage';
import FollowUpPage from './pages/crm/FollowUpPage';
import StorePage from './pages/store/StorePage';
import PromoPage from './pages/marketing/PromoPage';
import ReferralPage from './pages/marketing/ReferralPage';
import ClassPage from './pages/classes/ClassPage';
import MembershipPage from './pages/membership/MembershipPage';
import FeedbackPage from './pages/communication/FeedbackPage';
import AnnouncementPage from './pages/communication/AnnouncementPage';
import ReminderPage from './pages/communication/ReminderPage'; 
import MotivationalPage from './pages/communication/MotivationalPage';
import Login from './pages/auth/Login';
import Dashboard from './pages/dashboard/Dashboard';
import Unauthorized from './pages/auth/Unauthorized';
import BranchesPage from './pages/branches/BranchesPage';
import IntegrationsPage from './pages/settings/IntegrationsPage';
import HikvisionIntegrationPage from './pages/settings/HikvisionIntegrationPage';
import HikvisionPartnerPage from './pages/settings/HikvisionPartnerPage';
import InvoicePage from './pages/finance/InvoicePage';
import TransactionPage from './pages/finance/TransactionPage';
import AttendancePage from './pages/attendance/AttendancePage';
import MembersListPage from './pages/members/MembersListPage';
import MemberProfilePage from './pages/members/MemberProfilePage';
import NewMemberPage from './pages/members/NewMemberPage';
import ReportsPage from './pages/reports/ReportsPage';
import SettingsPage from './pages/settings/SettingsPage';
import FrontPagesManager from './pages/frontpages/FrontPagesManager';
import FitnessPlanPage from './pages/fitness/FitnessPlanPage';
import FitnessProgressPage from './pages/fitness/FitnessProgressPage';
import DietPlanPage from './pages/fitness/DietPlanPage';
import WorkoutPlansPage from './pages/fitness/WorkoutPlansPage';
import TrainerAllocationPage from './pages/trainers/TrainerAllocationPage';
import TrainerPTPlansPage from './pages/trainers/TrainerPTPlansPage';
import TrainerAttendancePage from './pages/trainers/TrainerAttendancePage';
import TrainerProfilePage from './pages/trainers/TrainerProfilePage';
import MemberProgressPage from './pages/members/MemberProgressPage';

import { AuthProvider } from './hooks/use-auth';
import { BranchProvider } from './hooks/use-branch';
import PrivateRoute from './components/auth/PrivateRoute';
import DashboardLayout from './components/layout/DashboardLayout';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute
      retry: 1,
    },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <BranchProvider>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/" element={<Index />} />
              <Route path="/unauthorized" element={<Unauthorized />} />
              
              <Route element={<PrivateRoute />}>
                <Route element={<DashboardLayout />}>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/dashboard/overview" element={<Dashboard />} />
                  
                  <Route path="/members" element={
                    <PrivateRoute allowedRoles={['admin', 'staff', 'trainer']}>
                      <MembersListPage />
                    </PrivateRoute>
                  } />
                  <Route path="/members/new" element={
                    <PrivateRoute allowedRoles={['admin', 'staff']}>
                      <NewMemberPage />
                    </PrivateRoute>
                  } />
                  <Route path="/members/profile" element={
                    <PrivateRoute allowedRoles={['admin', 'staff', 'trainer', 'member']}>
                      <MemberProfilePage />
                    </PrivateRoute>
                  } />
                  <Route path="/members/:id" element={
                    <PrivateRoute allowedRoles={['admin', 'staff', 'trainer']}>
                      <MemberProfilePage />
                    </PrivateRoute>
                  } />
                  <Route path="/members/progress/:id" element={
                    <PrivateRoute allowedRoles={['admin', 'staff', 'trainer', 'member']}>
                      <MemberProgressPage />
                    </PrivateRoute>
                  } />
                  
                  <Route path="/fitness-plans" element={
                    <PrivateRoute allowedRoles={['admin', 'staff', 'trainer', 'member']}>
                      <FitnessPlanPage />
                    </PrivateRoute>
                  } />
                  <Route path="/fitness/progress" element={
                    <PrivateRoute allowedRoles={['admin', 'staff', 'trainer', 'member']}>
                      <FitnessProgressPage />
                    </PrivateRoute>
                  } />
                  <Route path="/fitness/diet" element={
                    <PrivateRoute allowedRoles={['admin', 'staff', 'trainer', 'member']}>
                      <DietPlanPage />
                    </PrivateRoute>
                  } />
                  <Route path="/fitness/workout-plans" element={
                    <PrivateRoute allowedRoles={['admin', 'staff', 'trainer', 'member']}>
                      <WorkoutPlansPage />
                    </PrivateRoute>
                  } />
                  <Route path="/trainers/allocation" element={
                    <PrivateRoute allowedRoles={['admin', 'staff', 'trainer']}>
                      <TrainerAllocationPage />
                    </PrivateRoute>
                  } />
                  <Route path="/trainers/pt-plans" element={
                    <PrivateRoute allowedRoles={['admin', 'staff', 'trainer']}>
                      <TrainerPTPlansPage />
                    </PrivateRoute>
                  } />
                  <Route path="/trainers/attendance" element={
                    <PrivateRoute allowedRoles={['admin', 'staff', 'trainer']}>
                      <TrainerAttendancePage />
                    </PrivateRoute>
                  } />
                  <Route path="/trainers/profile" element={
                    <PrivateRoute allowedRoles={['admin', 'staff', 'trainer']}>
                      <TrainerProfilePage />
                    </PrivateRoute>
                  } />
                  
                  <Route path="/frontpages" element={
                    <PrivateRoute allowedRoles={['admin']}>
                      <FrontPagesManager />
                    </PrivateRoute>
                  } />
                  
                  <Route path="/attendance" element={
                    <PrivateRoute>
                      <AttendancePage />
                    </PrivateRoute>
                  } />
                  
                  <Route path="/crm/leads" element={
                    <PrivateRoute allowedRoles={['admin', 'staff']}>
                      <LeadsPage />
                    </PrivateRoute>
                  } />
                  <Route path="/crm/funnel" element={
                    <PrivateRoute allowedRoles={['admin', 'staff']}>
                      <FunnelPage />
                    </PrivateRoute>
                  } />
                  <Route path="/crm/follow-up" element={
                    <PrivateRoute allowedRoles={['admin', 'staff']}>
                      <FollowUpPage />
                    </PrivateRoute>
                  } />
                  
                  <Route path="/marketing/promo" element={
                    <PrivateRoute allowedRoles={['admin', 'staff']}>
                      <PromoPage />
                    </PrivateRoute>
                  } />
                  <Route path="/marketing/referral" element={
                    <PrivateRoute allowedRoles={['admin', 'staff']}>
                      <ReferralPage />
                    </PrivateRoute>
                  } />
                  
                  <Route path="/inventory" element={
                    <PrivateRoute allowedRoles={['admin', 'staff']}>
                      <InventoryPage />
                    </PrivateRoute>
                  } />
                  
                  <Route path="/store" element={
                    <PrivateRoute allowedRoles={['admin', 'staff', 'member']}>
                      <StorePage />
                    </PrivateRoute>
                  } />
                  
                  <Route path="/classes" element={
                    <PrivateRoute>
                      <ClassPage />
                    </PrivateRoute>
                  } />
                  
                  <Route path="/membership" element={
                    <PrivateRoute>
                      <MembershipPage />
                    </PrivateRoute>
                  } />
                  
                  {/* Redirect /memberships to /membership */}
                  <Route path="/memberships" element={<Navigate to="/membership" replace />} />
                  
                  <Route path="/communication/feedback" element={
                    <PrivateRoute>
                      <FeedbackPage />
                    </PrivateRoute>
                  } />
                  <Route path="/communication/announcements" element={
                    <PrivateRoute>
                      <AnnouncementPage />
                    </PrivateRoute>
                  } />
                  <Route path="/communication/reminders" element={
                    <PrivateRoute allowedRoles={['admin', 'staff']}>
                      <ReminderPage />
                    </PrivateRoute>
                  } />
                  <Route path="/communication/motivational" element={
                    <PrivateRoute allowedRoles={['admin', 'staff', 'trainer']}>
                      <MotivationalPage />
                    </PrivateRoute>
                  } />
                  
                  <Route path="/branches" element={
                    <PrivateRoute allowedRoles={['admin']}>
                      <BranchesPage />
                    </PrivateRoute>
                  } />
                  
                  <Route path="/finance/invoices" element={
                    <PrivateRoute allowedRoles={['admin', 'staff', 'member']}>
                      <InvoicePage />
                    </PrivateRoute>
                  } />
                  <Route path="/finance/transactions" element={
                    <PrivateRoute allowedRoles={['admin', 'staff']}>
                      <TransactionPage />
                    </PrivateRoute>
                  } />
                  
                  <Route path="/reports" element={
                    <PrivateRoute allowedRoles={['admin', 'staff', 'trainer']}>
                      <ReportsPage />
                    </PrivateRoute>
                  } />
                  
                </Route>
              </Route>
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BranchProvider>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
