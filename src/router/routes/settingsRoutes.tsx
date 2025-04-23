
import React from 'react';
import { RouteObject } from 'react-router-dom';
import PrivateRoute from '@/components/auth/PrivateRoute';
import SettingsPage from '@/pages/settings/SettingsPage';
import BranchManagementPage from '@/pages/settings/BranchManagementPage';
import AutomationRulesPage from '@/pages/settings/AutomationRulesPage';
import AccessControlIntegrationPage from '@/pages/settings/AccessControlIntegrationPage';
import DeviceMappingPage from '@/pages/settings/DeviceMappingPage';
import AccessRulesPage from '@/pages/settings/AccessRulesPage';
import PaymentGatewaySettingsPage from '@/pages/settings/PaymentGatewaySettingsPage';
import EmailIntegrationPage from '@/pages/settings/EmailIntegrationPage';
import SmsIntegrationPage from '@/pages/settings/SmsIntegrationPage';
import MessagingSettingsPage from '@/pages/settings/MessagingSettingsPage';
import PushNotificationSettingsPage from '@/pages/settings/PushNotificationSettingsPage';
import TemplatesPage from '@/pages/settings/TemplatesPage';
import EmailTemplatesPage from '@/pages/settings/EmailTemplatesPage';
import SmsTemplatesPage from '@/pages/settings/SmsTemplatesPage';
import WhatsAppTemplatesPage from '@/pages/settings/WhatsAppTemplatesPage';
import HikvisionIntegrationPage from '@/pages/settings/HikvisionIntegrationPage';
import SystemBackupPage from '@/pages/settings/SystemBackupPage';

export const settingsRoutes: RouteObject[] = [
  {
    path: '/settings',
    element: (
      <PrivateRoute allowedRoles={['admin', 'staff']}>
        <SettingsPage />
      </PrivateRoute>
    )
  },
  {
    path: '/settings/branches',
    element: (
      <PrivateRoute allowedRoles={['admin']}>
        <BranchManagementPage />
      </PrivateRoute>
    )
  },
  {
    path: '/settings/automation',
    element: (
      <PrivateRoute allowedRoles={['admin']}>
        <AutomationRulesPage />
      </PrivateRoute>
    )
  },
  {
    path: '/settings/integrations/access-control',
    element: (
      <PrivateRoute allowedRoles={['admin', 'staff']}>
        <AccessControlIntegrationPage />
      </PrivateRoute>
    )
  },
  {
    path: '/settings/integrations/payment',
    element: (
      <PrivateRoute allowedRoles={['admin']}>
        <PaymentGatewaySettingsPage />
      </PrivateRoute>
    )
  },
  {
    path: '/settings/integrations/messaging',
    element: (
      <PrivateRoute allowedRoles={['admin']}>
        <MessagingSettingsPage />
      </PrivateRoute>
    )
  },
  {
    path: '/settings/integrations/sms',
    element: (
      <PrivateRoute allowedRoles={['admin']}>
        <SmsIntegrationPage />
      </PrivateRoute>
    )
  },
  {
    path: '/settings/integrations/push',
    element: (
      <PrivateRoute allowedRoles={['admin']}>
        <PushNotificationSettingsPage />
      </PrivateRoute>
    )
  },
  {
    path: '/settings/templates',
    element: (
      <PrivateRoute allowedRoles={['admin']}>
        <TemplatesPage />
      </PrivateRoute>
    )
  },
  {
    path: '/settings/templates/email',
    element: (
      <PrivateRoute allowedRoles={['admin']}>
        <EmailTemplatesPage />
      </PrivateRoute>
    )
  },
  {
    path: '/settings/templates/sms',
    element: (
      <PrivateRoute allowedRoles={['admin']}>
        <SmsTemplatesPage />
      </PrivateRoute>
    )
  },
  {
    path: '/settings/templates/whatsapp',
    element: (
      <PrivateRoute allowedRoles={['admin']}>
        <WhatsAppTemplatesPage />
      </PrivateRoute>
    )
  },
  {
    path: '/settings/attendance/devices',
    element: (
      <PrivateRoute allowedRoles={['admin']}>
        <DeviceMappingPage />
      </PrivateRoute>
    )
  },
  {
    path: '/settings/attendance/access-rules',
    element: (
      <PrivateRoute allowedRoles={['admin']}>
        <AccessRulesPage />
      </PrivateRoute>
    )
  },
  {
    path: '/settings/integrations/hikvision',
    element: (
      <PrivateRoute allowedRoles={['admin']}>
        <HikvisionIntegrationPage />
      </PrivateRoute>
    )
  },
  {
    path: '/settings/system-backup',
    element: (
      <PrivateRoute allowedRoles={['admin']}>
        <SystemBackupPage />
      </PrivateRoute>
    )
  }
];
