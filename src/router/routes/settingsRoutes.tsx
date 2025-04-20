
import React from 'react';
import { RouteObject } from 'react-router-dom';
import SettingsPage from '@/pages/settings/SettingsPage';
import IntegrationsPage from '@/pages/settings/IntegrationsPage';
import HikvisionIntegrationPage from '@/pages/settings/HikvisionIntegrationPage';
import HikvisionPartnerPage from '@/pages/settings/HikvisionPartnerPage';
import EmailIntegrationPage from '@/pages/settings/EmailIntegrationPage';
import SmsIntegrationPage from '@/pages/settings/SmsIntegrationPage';
import BranchManagementPage from '@/pages/settings/BranchManagementPage';
import HelpCenterPage from '@/pages/help/HelpCenterPage';

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
  {
    path: '/settings/integrations/email',
    element: <EmailIntegrationPage />
  },
  {
    path: '/settings/integrations/sms',
    element: <SmsIntegrationPage />
  },
  {
    path: '/settings/branches',
    element: <BranchManagementPage />
  },
  {
    path: '/help',
    element: <HelpCenterPage />
  }
];
