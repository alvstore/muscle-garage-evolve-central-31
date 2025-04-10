
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
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
import Login from './pages/auth/Login';
import Dashboard from './pages/dashboard/Dashboard';
import Unauthorized from './pages/auth/Unauthorized';

import { AuthProvider } from './hooks/use-auth';
import PrivateRoute from './components/auth/PrivateRoute';

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
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Index />} />
            <Route path="/unauthorized" element={<Unauthorized />} />
            
            {/* Dashboard - Role-specific dashboards are handled inside the Dashboard component */}
            <Route element={<PrivateRoute />}>
              <Route path="/dashboard" element={<Dashboard />} />
            </Route>
            
            {/* Admin only routes */}
            <Route element={<PrivateRoute allowedRoles={['admin']} />}>
              {/* Routes that only admin can access */}
              {/* Add admin-only features here */}
            </Route>
            
            {/* Admin/Staff only routes */}
            <Route element={<PrivateRoute allowedRoles={['admin', 'staff']} />}>
              <Route path="/inventory" element={<InventoryPage />} />
              <Route path="/crm/leads" element={<LeadsPage />} />
              <Route path="/crm/funnel" element={<FunnelPage />} />
              <Route path="/crm/follow-up" element={<FollowUpPage />} />
              <Route path="/store" element={<StorePage />} />
              <Route path="/marketing/promo" element={<PromoPage />} />
              <Route path="/marketing/referral" element={<ReferralPage />} />
            </Route>
            
            {/* Admin/Staff/Trainer routes */}
            <Route element={<PrivateRoute allowedRoles={['admin', 'staff', 'trainer']} />}>
              {/* Routes for trainers and above */}
              {/* Add trainer features here */}
            </Route>
            
            {/* All authenticated users routes */}
            <Route element={<PrivateRoute />}>
              <Route path="/classes" element={<ClassPage />} />
              <Route path="/membership" element={<MembershipPage />} />
            </Route>
            
            {/* Catch all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
