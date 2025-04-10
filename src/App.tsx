
import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LayoutDashboard, Users, Dumbbell, CalendarCheck, ClipboardList, CreditCard, Activity as ActivityIcon, Bell, MessageSquare, Heart, AlarmClock, Settings, User, DollarSign, Receipt, ArrowLeftRight, Package, UserPlus, Filter, MessageCircle, ShoppingBag, Tag } from 'lucide-react';

import Index from './pages/Index';
import NotFound from './pages/NotFound';
import InventoryPage from './pages/inventory/InventoryPage';
import LeadsPage from './pages/crm/LeadsPage';
import FunnelPage from './pages/crm/FunnelPage';
import FollowUpPage from './pages/crm/FollowUpPage';
import StorePage from './pages/store/StorePage';
import PromoPage from './pages/marketing/PromoPage';
import ReferralPage from './pages/marketing/ReferralPage';

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
        <Route path="/inventory" element={<InventoryPage />} />
        <Route path="/crm/leads" element={<LeadsPage />} />
        <Route path="/crm/funnel" element={<FunnelPage />} />
        <Route path="/crm/follow-up" element={<FollowUpPage />} />
        <Route path="/store" element={<StorePage />} />
        <Route path="/marketing/promo" element={<PromoPage />} />
        <Route path="/marketing/referral" element={<ReferralPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
