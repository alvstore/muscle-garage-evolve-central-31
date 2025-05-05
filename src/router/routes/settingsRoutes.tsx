
import React from 'react';
import { RouteObject } from 'react-router-dom';
import UnifiedSettingsPage from '@/pages/settings/UnifiedSettingsPage';
import IntegrationsPage from '@/pages/settings/IntegrationsPage';
import AccessControlIntegrationPage from '@/pages/settings/AccessControlIntegrationPage';
import PaymentGatewaySettingsPage from '@/pages/settings/PaymentGatewaySettingsPage';
import PushNotificationSettingsPage from '@/pages/settings/PushNotificationSettingsPage';
import EmailIntegrationPage from '@/pages/settings/EmailIntegrationPage';
import SmsIntegrationPage from '@/pages/settings/SmsIntegrationPage';
import MessagingSettingsPage from '@/pages/settings/MessagingSettingsPage';
import TemplatesPage from '@/pages/settings/TemplatesPage';
import EmailTemplatesPage from '@/pages/settings/EmailTemplatesPage';
import SmsTemplatesPage from '@/pages/settings/SmsTemplatesPage';
import WhatsAppTemplatesPage from '@/pages/settings/WhatsAppTemplatesPage';
import RolePermissionsPage from '@/components/settings/permissions/pages/RolePermissionsPage';

export const settingsRoutes: RouteObject[] = [
  {
    path: '/settings',
    element: <UnifiedSettingsPage />
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
    path: '/settings/integrations/push',
    element: <PushNotificationSettingsPage />
  },
  // Add email settings route
  {
    path: '/settings/email',
    element: <EmailIntegrationPage />
  },
  // Add SMS settings route
  {
    path: '/settings/sms',
    element: <SmsIntegrationPage />
  },
  // Add WhatsApp settings route
  {
    path: '/settings/whatsapp',
    element: <MessagingSettingsPage />
  },
  // Add templates parent route
  {
    path: '/settings/templates',
    element: <TemplatesPage />
  },
  // Add email templates route
  {
    path: '/settings/templates/email',
    element: <EmailTemplatesPage />
  },
  // Add SMS templates route
  {
    path: '/settings/templates/sms',
    element: <SmsTemplatesPage />
  },
  // Add WhatsApp templates route
  {
    path: '/settings/templates/whatsapp',
    element: <WhatsAppTemplatesPage />
  },
  // Add notifications settings route
  {
    path: '/settings/notifications',
    element: <UnifiedSettingsPage /> // Replace with your actual notifications page component if available
  },
  // Add role permissions route
  {
    path: '/settings/roles',
    element: <RolePermissionsPage />
  },
];
