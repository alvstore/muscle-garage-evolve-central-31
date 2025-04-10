import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LayoutDashboard, Users, Dumbbell, CalendarCheck, ClipboardList, CreditCard, Activity as ActivityIcon, Bell, MessageSquare, Heart, AlarmClock, Settings, User, DollarSign, Receipt, ArrowLeftRight, Package } from 'lucide-react';

import Index from './pages/Index';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import TrainerDashboard from './pages/TrainerDashboard';
import StaffDashboard from './pages/StaffDashboard';
import MemberDashboard from './pages/MemberDashboard';
import MembersListPage from './pages/MembersListPage';
import MemberProfilePage from './pages/MemberProfilePage';
import TrainerPage from './pages/TrainerPage';
import ClassPage from './pages/ClassPage';
import MembershipPage from './pages/MembershipPage';
import AttendancePage from './pages/AttendancePage';
import FitnessPlanPage from './pages/FitnessPlanPage';
import InvoicePage from './pages/finance/InvoicePage';
import AnnouncementPage from './pages/communication/AnnouncementPage';
import FeedbackPage from './pages/communication/FeedbackPage';
import MotivationalPage from './pages/communication/MotivationalPage';
import ReminderPage from './pages/communication/ReminderPage';
import Login from './pages/Login';
import NotFound from './pages/NotFound';
import DashboardSidebar from './components/layout/DashboardSidebar';
import FinanceDashboardPage from './pages/finance/FinanceDashboardPage';
import InventoryPage from './pages/inventory/InventoryPage';
import TransactionPage from './pages/finance/TransactionPage';

export default function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/trainer-dashboard" element={<TrainerDashboard />} />
        <Route path="/staff-dashboard" element={<StaffDashboard />} />
        <Route path="/member-dashboard" element={<MemberDashboard />} />
        <Route path="/members" element={<MembersListPage />} />
        <Route path="/members/:id" element={<MemberProfilePage />} />
        <Route path="/trainers" element={<TrainerPage />} />
        <Route path="/classes" element={<ClassPage />} />
        <Route path="/memberships" element={<MembershipPage />} />
        <Route path="/attendance" element={<AttendancePage />} />
        <Route path="/fitness-plans" element={<FitnessPlanPage />} />
        <Route path="/finance/invoices" element={<InvoicePage />} />
        <Route path="/finance/transactions" element={<TransactionPage />} />
        <Route path="/finance/dashboard" element={<FinanceDashboardPage />} />
        <Route path="/inventory" element={<InventoryPage />} />
        <Route path="/communication/announcements" element={<AnnouncementPage />} />
        <Route path="/communication/feedback" element={<FeedbackPage />} />
        <Route path="/communication/motivational" element={<MotivationalPage />} />
        <Route path="/communication/reminders" element={<ReminderPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
