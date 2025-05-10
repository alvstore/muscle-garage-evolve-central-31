
import React from 'react';
import { Routes, Route } from 'react-router-dom'; 
import { settingsRoutes } from './routes/admin/settingsRoutes';
import DashboardLayout from '@/components/layout/DashboardLayout';
import WebsiteLayout from '@/components/layout/WebsiteLayout';
import SettingsPage from '@/pages/settings/SettingsPage';

// Placeholder component for pages we haven't created yet
const PlaceholderPage = ({ text = "Coming Soon" }: { text?: string }) => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="text-center">
      <h1 className="text-2xl font-bold mb-4">{text}</h1>
      <p className="text-gray-500">This page is under construction</p>
    </div>
  </div>
);

const AppRouter = () => {
  return (
    <Routes>
      {/* Website routes */}
      <Route path="/" element={<WebsiteLayout />}>
        <Route index element={<PlaceholderPage text="Home Page" />} />
        <Route path="about" element={<PlaceholderPage text="About Us" />} />
        <Route path="contact" element={<PlaceholderPage text="Contact Us" />} />
      </Route>
      
      {/* Auth routes */}
      <Route path="login" element={<PlaceholderPage text="Login" />} />
      <Route path="register" element={<PlaceholderPage text="Register" />} />
      <Route path="forgot-password" element={<PlaceholderPage text="Forgot Password" />} />
      
      {/* Dashboard routes */}
      <Route path="dashboard" element={<DashboardLayout />}>
        <Route index element={<PlaceholderPage text="Dashboard" />} />
        
        {/* Only using settings routes we know exist */}
        <Route path="settings" element={<SettingsPage />} />
      </Route>
      
      {/* 404 Route */}
      <Route path="*" element={<PlaceholderPage text="404 - Page Not Found" />} />
    </Routes>
  );
};

export default AppRouter;
