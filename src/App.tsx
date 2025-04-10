
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
import InvoicePage from './pages/finance/InvoicePage';
import TransactionPage from './pages/finance/TransactionPage';

import { AuthProvider } from './hooks/use-auth';
import { BranchProvider } from './hooks/use-branch';
import PrivateRoute from './components/auth/PrivateRoute';
import DashboardLayout from './components/layout/DashboardLayout';
import { useAuth } from './hooks/use-auth';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute
      retry: 1,
    },
  },
});

// Wrapper component to provide the user to the DashboardLayout
const DashboardLayoutWrapper = () => {
  const { user } = useAuth();
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return <DashboardLayout user={user} />;
};

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
                <Route element={<DashboardLayoutWrapper />}>
                  <Route path="/dashboard" element={<Dashboard />} />
                  
                  {/* CRM Routes */}
                  <Route path="/crm/leads" element={<LeadsPage />} />
                  <Route path="/crm/funnel" element={<FunnelPage />} />
                  <Route path="/crm/follow-up" element={<FollowUpPage />} />
                  
                  {/* Marketing Routes */}
                  <Route path="/marketing/promo" element={<PromoPage />} />
                  <Route path="/marketing/referral" element={<ReferralPage />} />
                  
                  {/* Inventory Route */}
                  <Route path="/inventory" element={<InventoryPage />} />
                  
                  {/* Store Route */}
                  <Route path="/store" element={<StorePage />} />
                  
                  {/* Class Route */}
                  <Route path="/classes" element={<ClassPage />} />
                  
                  {/* Membership Route */}
                  <Route path="/membership" element={<MembershipPage />} />
                  
                  {/* Communication Routes */}
                  <Route path="/communication/feedback" element={<FeedbackPage />} />
                  <Route path="/communication/announcements" element={<AnnouncementPage />} />
                  <Route path="/communication/reminders" element={<ReminderPage />} />
                  <Route path="/communication/motivational" element={<MotivationalPage />} />
                  
                  {/* Branch Management Route */}
                  <Route path="/branches" element={<BranchesPage />} />
                  
                  {/* Finance Routes */}
                  <Route path="/finance/invoices" element={<InvoicePage />} />
                  <Route path="/finance/transactions" element={<TransactionPage />} />
                  
                  {/* Settings & Integrations Route */}
                  <Route path="/settings/integrations" element={<IntegrationsPage />} />
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
