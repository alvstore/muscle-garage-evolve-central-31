
import React from 'react';
import { RouteObject } from 'react-router-dom';
import SettingsPage from '@/pages/settings/SettingsPage';
import IntegrationsPage from '@/pages/settings/IntegrationsPage';
import HikvisionIntegrationPage from '@/pages/settings/HikvisionIntegrationPage';
import HikvisionPartnerPage from '@/pages/settings/HikvisionPartnerPage';

export const settingsRoutes: RouteObject[] = [
  {
    path: '/settings',
    element: <SettingsPage />
  },
  {
    path: '/settings/integrations',
    element: <IntegrationsPage />
  },
  {
    path: '/settings/integrations/hikvision',
    element: <HikvisionIntegrationPage />
  },
  {
    path: '/settings/integrations/hikvision/partner',
    element: <HikvisionPartnerPage />
  },
  // Add any missing pages here
  {
    path: '/settings/integrations/email',
    element: <IntegrationsPage type="email" />
  },
  {
    path: '/settings/integrations/sms',
    element: <IntegrationsPage type="sms" />
  },
  {
    path: '/help',
    element: <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Help Center</h1>
      <p className="mb-4">Welcome to the Muscle Garage Help Center. Here you'll find guides, tutorials, and FAQs to help you use our platform.</p>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div className="border rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-2">Getting Started</h2>
          <p className="text-sm text-gray-600">Learn the basics of using Muscle Garage.</p>
        </div>
        <div className="border rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-2">Admin Guide</h2>
          <p className="text-sm text-gray-600">Comprehensive guide for administrators.</p>
        </div>
        <div className="border rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-2">Trainer Guide</h2>
          <p className="text-sm text-gray-600">How to manage members and classes as a trainer.</p>
        </div>
      </div>
    </div>
  }
];
