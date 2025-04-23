import React from 'react';
import { RouteObject } from 'react-router-dom';
import SettingsPage from '@/pages/settings/SettingsPage';
import IntegrationsPage from '@/pages/settings/IntegrationsPage';
import AccessControlIntegrationPage from '@/pages/settings/AccessControlIntegrationPage';
import PaymentGatewaySettingsPage from '@/pages/settings/PaymentGatewaySettingsPage';
import MessagingSettingsPage from '@/pages/settings/MessagingSettingsPage';
import PushNotificationSettingsPage from '@/pages/settings/PushNotificationSettingsPage';
import BranchManagementPage from '@/pages/settings/BranchManagementPage';
import DeviceMappingPage from '@/pages/settings/DeviceMappingPage';
import AccessRulesPage from '@/pages/settings/AccessRulesPage';
import MessageTemplatesPage from '@/pages/settings/MessageTemplatesPage';
import EmailTemplatesPage from '@/pages/settings/EmailTemplatesPage';
import SmsTemplatesPage from '@/pages/settings/SmsTemplatesPage';
import WhatsAppTemplatesPage from '@/pages/settings/WhatsAppTemplatesPage';
import AutomationRulesPage from '@/pages/settings/AutomationRulesPage';
import ClassTypesPage from '@/pages/classes/ClassTypesPage';
import TaskManagerPage from '@/pages/communication/TaskManagerPage';
import SmsIntegrationPage from '@/pages/settings/SmsIntegrationPage';

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
    path: '/settings/integrations/access-control',
    element: <AccessControlIntegrationPage />
  },
  {
    path: '/settings/integrations/payment',
    element: <PaymentGatewaySettingsPage />
  },
  {
    path: '/settings/integrations/messaging',
    element: <MessagingSettingsPage />
  },
  {
    path: '/settings/integrations/sms',
    element: <SmsIntegrationPage />
  },
  {
    path: '/settings/integrations/push',
    element: <PushNotificationSettingsPage />
  },
  {
    path: '/settings/templates',
    element: <MessageTemplatesPage />
  },
  {
    path: '/settings/templates/email',
    element: <EmailTemplatesPage />
  },
  {
    path: '/settings/templates/sms',
    element: <SmsTemplatesPage />
  },
  {
    path: '/settings/templates/whatsapp',
    element: <WhatsAppTemplatesPage />
  },
  {
    path: '/settings/automation',
    element: <AutomationRulesPage />
  },
  {
    path: '/settings/branches',
    element: <BranchManagementPage />
  },
  {
    path: '/settings/attendance',
    element: <DeviceMappingPage />,
    children: [
      {
        path: 'devices',
        element: <DeviceMappingPage />
      }
    ]
  },
  {
    path: '/settings/attendance/devices',
    element: <DeviceMappingPage />
  },
  {
    path: '/settings/attendance/access-rules',
    element: <AccessRulesPage />
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
