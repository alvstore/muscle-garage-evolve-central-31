
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

import { AuthProvider } from './hooks/use-auth';
import { BranchProvider } from './hooks/use-branch';
import PrivateRoute from './components/auth/PrivateRoute';
import DashboardLayout from './components/layout/DashboardLayout';
import { UserRole } from './types';

// Create a client
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
              {/* Public routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/" element={<Index />} />
              <Route path="/unauthorized" element={<Unauthorized />} />
              
              {/* Protected Dashboard Routes */}
              <Route element={<PrivateRoute />}>
                <Route element={<DashboardLayout />}>
                  <Route path="/dashboard" element={<Dashboard />} />
                  
                  {/* CRM Routes */}
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
                  
                  {/* Marketing Routes */}
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
                  
                  {/* Inventory Route */}
                  <Route path="/inventory" element={
                    <PrivateRoute allowedRoles={['admin', 'staff']}>
                      <InventoryPage />
                    </PrivateRoute>
                  } />
                  
                  {/* Store Route */}
                  <Route path="/store" element={
                    <PrivateRoute allowedRoles={['admin', 'staff', 'member']}>
                      <StorePage />
                    </PrivateRoute>
                  } />
                  
                  {/* Class Route */}
                  <Route path="/classes" element={
                    <PrivateRoute>
                      <ClassPage />
                    </PrivateRoute>
                  } />
                  
                  {/* Membership Route */}
                  <Route path="/membership" element={
                    <PrivateRoute>
                      <MembershipPage />
                    </PrivateRoute>
                  } />
                  
                  {/* Communication Routes */}
                  <Route path="/communication/feedback" element={
                    <PrivateRoute>
                      <FeedbackPage />
                    </PrivateRoute>
                  } />
                  <Route path="/communication/announcements" element={
                    <PrivateRoute allowedRoles={['admin', 'staff']}>
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
                  
                  {/* Branch Management Route */}
                  <Route path="/branches" element={
                    <PrivateRoute allowedRoles={['admin']}>
                      <BranchesPage />
                    </PrivateRoute>
                  } />
                  
                  {/* Finance Routes */}
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
                  
                  {/* Settings & Integrations Routes */}
                  <Route path="/settings/integrations" element={
                    <PrivateRoute allowedRoles={['admin']}>
                      <IntegrationsPage />
                    </PrivateRoute>
                  } />
                  <Route path="/settings/integrations/hikvision" element={
                    <PrivateRoute allowedRoles={['admin']}>
                      <HikvisionIntegrationPage />
                    </PrivateRoute>
                  } />
                  <Route path="/settings/integrations/hikvision-partner" element={
                    <PrivateRoute allowedRoles={['admin']} requiredPermission="manage_integrations">
                      <HikvisionPartnerPage />
                    </PrivateRoute>
                  } />
                </Route>
              </Route>
              
              {/* Catch all route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BranchProvider>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
