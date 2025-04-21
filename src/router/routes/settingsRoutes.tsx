
import React from 'react';
import { RouteObject } from 'react-router-dom';
import SettingsPage from '@/pages/settings/SettingsPage';
import IntegrationsPage from '@/pages/settings/IntegrationsPage';
import HikvisionIntegrationPage from '@/pages/settings/HikvisionIntegrationPage';
import HikvisionPartnerPage from '@/pages/settings/HikvisionPartnerPage';
import EmailIntegrationPage from '@/pages/settings/EmailIntegrationPage';
import SmsIntegrationPage from '@/pages/settings/SmsIntegrationPage';
import BranchManagementPage from '@/pages/settings/BranchManagementPage';
import BranchIntegrationSettings from '@/pages/settings/BranchIntegrationSettings';
import DeviceMappingPage from '@/pages/settings/DeviceMappingPage';
import PaymentGatewaySettingsPage from '@/pages/settings/PaymentGatewaySettingsPage';
import ClassTypesPage from '@/pages/classes/ClassTypesPage';
import TaskManagerPage from '@/pages/communication/TaskManagerPage';

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
    path: '/settings/branches/integration',
    element: <BranchIntegrationSettings />
  },
  {
    path: '/settings/branches/devices',
    element: <DeviceMappingPage />
  },
  {
    path: '/settings/payment-gateways',
    element: <PaymentGatewaySettingsPage />
  },
  {
    path: '/classes/types',
    element: <ClassTypesPage />
  },
  {
    path: '/communication/tasks',
    element: <TaskManagerPage />
  }
];
