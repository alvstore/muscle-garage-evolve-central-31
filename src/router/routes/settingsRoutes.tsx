
import React from 'react';
import { AppRoute } from '@/types/route';
import UnifiedSettingsPage from '@/pages/settings/core/UnifiedSettingsPage';
import InvoiceSettingsPage from '@/pages/settings/InvoiceSettingsPage';
import IntegrationsPage from '@/pages/settings/IntegrationsPage';
import AccessControlPage from '@/pages/settings/access-control';
import PaymentGatewaySettingsPage from '@/pages/settings/PaymentGatewaySettingsPage';
import PushNotificationSettingsPage from '@/pages/settings/core/PushNotificationSettingsPage';
import EmailSettingsPage from '@/pages/settings/EmailSettingsPage';
import SmsIntegrationPage from '@/pages/settings/SmsIntegrationPage';
import MessagingSettingsPage from '@/pages/settings/MessagingSettingsPage';
import TemplatesPage from '@/pages/settings/TemplatesPage';
import EmailTemplatesPage from '@/pages/settings/EmailTemplatesPage';
import SmsTemplatesPage from '@/pages/settings/SmsTemplatesPage';
import WhatsAppTemplatesPage from '@/pages/settings/WhatsAppTemplatesPage';
import RolePermissionsPage from '@/components/settings/permissions/pages/RolePermissionsPage';
import GlobalSettingsPage from '@/pages/settings/GlobalSettingsPage';
import BranchManagementPage from '@/pages/settings/BranchManagementPage';
import AIServicesPage from '@/pages/settings/ai-services';
import { 
  Settings, 
  Webhook, 
  Lock, 
  CreditCard, 
  BellRing, 
  Mail, 
  MessageSquare, 
  Globe, 
  FileText, 
  UserCog, 
  Store
} from 'lucide-react';

export const settingsRoutes: AppRoute[] = [
  {
    path: '/settings',
    element: <UnifiedSettingsPage />,
    meta: {
      title: 'System Settings',
      breadcrumb: 'Settings',
      permission: 'access_settings',
      icon: <Settings className="h-5 w-5" />
    }
  },
  {
    path: '/settings/invoice',
    element: <InvoiceSettingsPage />,
    meta: {
      title: 'Invoice Settings',
      breadcrumb: 'Invoice Settings',
      permission: 'manage_settings',
      icon: <FileText className="h-5 w-5" />
    }
  },
  {
    path: '/settings/global',
    element: <GlobalSettingsPage />,
    meta: {
      title: 'Global Settings',
      breadcrumb: 'Global Settings',
      permission: 'manage_settings',
      hideInNav: true,
      icon: <Globe className="h-5 w-5" />
    }
  },
  {
    path: '/settings/branches',
    element: <BranchManagementPage />,
    meta: {
      title: 'Branch Management',
      breadcrumb: 'Branch Management',
      permission: 'manage_branches',
      icon: <Store className="h-5 w-5" />
    }
  },
  {
    path: '/settings/integrations',
    element: <IntegrationsPage />,
    meta: {
      title: 'Integration Settings',
      breadcrumb: 'Integrations',
      permission: 'manage_integrations',
      icon: <Webhook className="h-5 w-5" />
    }
  },
  {
    path: '/settings/integrations/access-control',
    element: <AccessControlPage />,
    meta: {
      title: 'Access Control Management',
      breadcrumb: 'Access Control',
      permission: 'manage_integrations',
      hideInNav: true
    }
  },
  {
    path: '/settings/ai-services',
    element: <AIServicesPage />,
    meta: {
      title: 'AI Services Configuration',
      breadcrumb: 'AI Services',
      permission: 'manage_integrations',
      hideInNav: true
    }
  },
  {
    path: '/settings/integrations/payment',
    element: <PaymentGatewaySettingsPage />,
    meta: {
      title: 'Payment Gateway Settings',
      breadcrumb: 'Payment Gateway',
      permission: 'manage_integrations',
      icon: <CreditCard className="h-5 w-5" />
    }
  },
  {
    path: '/settings/integrations/push',
    element: <PushNotificationSettingsPage />,
    meta: {
      title: 'Push Notification Settings',
      breadcrumb: 'Push Notifications',
      permission: 'manage_integrations',
      icon: <BellRing className="h-5 w-5" />
    }
  },
  {
    path: '/settings/email',
    element: <EmailSettingsPage />,
    meta: {
      title: 'Email Integration',
      breadcrumb: 'Email Integration',
      permission: 'manage_integrations',
      icon: <Mail className="h-5 w-5" />
    }
  },
  {
    path: '/settings/sms',
    element: <SmsIntegrationPage />,
    meta: {
      title: 'SMS Settings',
      breadcrumb: 'SMS Settings',
      permission: 'manage_integrations',
      icon: <MessageSquare className="h-5 w-5" />
    }
  },
  {
    path: '/settings/whatsapp',
    element: <MessagingSettingsPage />,
    meta: {
      title: 'WhatsApp Settings',
      breadcrumb: 'WhatsApp Settings',
      permission: 'manage_integrations',
      icon: <MessageSquare className="h-5 w-5" />
    }
  },
  {
    path: '/settings/templates',
    element: <TemplatesPage />,
    meta: {
      title: 'Templates',
      breadcrumb: 'Templates',
      permission: 'manage_templates',
      icon: <FileText className="h-5 w-5" />
    }
  },
  {
    path: '/settings/templates/email',
    element: <EmailSettingsPage />,
    meta: {
      title: 'Email Templates',
      breadcrumb: 'Email Templates',
      permission: 'manage_templates',
      hideInNav: true
    }
  },
  {
    path: '/settings/templates/sms',
    element: <SmsTemplatesPage />,
    meta: {
      title: 'SMS Templates',
      breadcrumb: 'SMS Templates',
      permission: 'manage_templates',
      hideInNav: true
    }
  },
  {
    path: '/settings/templates/whatsapp',
    element: <WhatsAppTemplatesPage />,
    meta: {
      title: 'WhatsApp Templates',
      breadcrumb: 'WhatsApp Templates',
      permission: 'manage_templates',
      hideInNav: true
    }
  },
  {
    path: '/settings/notifications',
    element: <UnifiedSettingsPage />,
    meta: {
      title: 'Notification Settings',
      breadcrumb: 'Notification Settings',
      permission: 'manage_settings',
      icon: <BellRing className="h-5 w-5" />
    }
  },
  {
    path: '/settings/roles',
    element: <RolePermissionsPage />,
    meta: {
      title: 'Role & Permissions',
      breadcrumb: 'Role & Permissions',
      permission: 'manage_roles',
      icon: <UserCog className="h-5 w-5" />
    }
  },
];
