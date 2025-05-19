
import React from 'react';
import { Navigate } from 'react-router-dom';
import { AppRoute } from '@/types/route';
import UnifiedSettingsPage from '@/pages/settings/core/UnifiedSettingsPage';
import InvoiceSettingsPage from '@/pages/settings/payments/InvoiceSettingsPage';
import IntegrationsPage from '@/pages/settings/integrations/IntegrationsPage';
import AccessControlPage from '@/pages/settings/access-control';
import PaymentGatewaySettingsPage from '@/pages/settings/payments/PaymentGatewaySettingsPage';
import PushNotificationSettingsPage from '@/pages/settings/core/PushNotificationSettingsPage';
import EmailSettingsPage from '@/pages/settings/communication/email/EmailSettingsPage';
import SmsIntegrationPage from '@/pages/settings/communication/sms/SmsIntegrationPage';
import MessagingSettingsPage from '@/pages/settings/communication/MessagingSettingsPage';
import MessageTemplatesPage from '@/pages/settings/communication/MessageTemplatesPage';
import EmailTemplatesPage from '@/pages/settings/communication/email/EmailTemplatesPage';
import SmsTemplatesPage from '@/pages/settings/communication/sms/SmsTemplatesPage';
import WhatsAppTemplatesPage from '@/pages/settings/communication/whatsapp/WhatsAppTemplatesPage';
import RolePermissionsPage from '@/components/settings/permissions/pages/RolePermissionsPage';
import GlobalSettingsPage from '@/pages/settings/core/GlobalSettingsPage';
import BranchManagementPage from '@/pages/settings/branches/BranchManagementPage';
import AIServicesPage from '@/pages/settings/integrations/ai-services';
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
  // Redirect old payment integration URL to new payment gateways URL
  {
    path: '/settings/integrations/payment',
    element: <Navigate to="/settings/payments/gateways" replace />
  },
  {
    path: '/settings',
    element: <UnifiedSettingsPage />,
    meta: {
      title: 'System Settings',
      breadcrumb: 'Settings',
      permission: 'view:settings',
      icon: <Settings className="h-5 w-5" />
    }
  },
  {
    path: '/settings/invoice',
    element: <InvoiceSettingsPage />,
    meta: {
      title: 'Invoice Settings',
      breadcrumb: 'Invoice Settings',
      permission: 'edit:settings',
      icon: <FileText className="h-5 w-5" />
    }
  },
  {
    path: '/settings/global',
    element: <GlobalSettingsPage />,
    meta: {
      title: 'Global Settings',
      breadcrumb: 'Global Settings',
      permission: 'edit:settings',
      hideInNav: true,
      icon: <Globe className="h-5 w-5" />
    }
  },
  {
    path: '/settings/branches',
    element: <BranchManagementPage />,
    meta: {
      title: 'Branch Management',
      breadcrumb: 'Branches',
      permission: 'edit:branches',
      icon: <Store className="h-5 w-5" />
    }
  },
  {
    path: '/settings/integrations',
    element: <IntegrationsPage />,
    meta: {
      title: 'Integrations',
      breadcrumb: 'Integrations',
      permission: 'edit:settings',
      icon: <Webhook className="h-5 w-5" />
    }
  },
  {
    path: '/settings/integrations/access-control',
    element: <AccessControlPage />,
    meta: {
      title: 'Access Control Management',
      breadcrumb: 'Access Control',
      permission: 'edit:settings',
      hideInNav: true
    }
  },
  {
    path: '/settings/ai-services',
    element: <AIServicesPage />,
    meta: {
      title: 'AI Services Configuration',
      breadcrumb: 'AI Services',
      permission: 'edit:settings',
      hideInNav: true
    }
  },
  {
    path: '/settings/payments/gateways',
    element: <PaymentGatewaySettingsPage />,
    meta: {
      title: 'Payment Gateway Settings',
      breadcrumb: 'Payment Gateways',
      permission: 'edit:settings',
      icon: <CreditCard className="h-5 w-5" />
    }
  },
  {
    path: '/settings/integrations/push',
    element: <PushNotificationSettingsPage />,
    meta: {
      title: 'Push Notification Settings',
      breadcrumb: 'Push Notifications',
      permission: 'edit:settings',
      icon: <BellRing className="h-5 w-5" />
    }
  },
  {
    path: '/settings/email',
    element: <EmailSettingsPage />,
    meta: {
      title: 'Email Integration',
      breadcrumb: 'Email Integration',
      permission: 'edit:settings',
      icon: <Mail className="h-5 w-5" />
    }
  },
  {
    path: '/settings/sms',
    element: <SmsIntegrationPage />,
    meta: {
      title: 'SMS Settings',
      breadcrumb: 'SMS Settings',
      permission: 'edit:settings',
      icon: <MessageSquare className="h-5 w-5" />
    }
  },
  {
    path: '/settings/whatsapp',
    element: <MessagingSettingsPage />,
    meta: {
      title: 'WhatsApp Settings',
      breadcrumb: 'WhatsApp Settings',
      permission: 'edit:settings',
      hideInNav: true
    }
  },
  {
    path: '/settings/templates',
    element: <MessageTemplatesPage />,
    meta: {
      title: 'Message Templates',
      breadcrumb: 'Message Templates',
      permission: 'edit:settings',
      icon: <MessageSquare className="h-5 w-5" />
    }
  },
  {
    path: '/settings/templates/email',
    element: <EmailSettingsPage />,
    meta: {
      title: 'Email Templates',
      breadcrumb: 'Email Templates',
      permission: 'edit:settings',
      hideInNav: true
    }
  },
  {
    path: '/settings/templates/sms',
    element: <SmsTemplatesPage />,
    meta: {
      title: 'SMS Templates',
      breadcrumb: 'SMS Templates',
      permission: 'edit:settings',
      hideInNav: true
    }
  },
  {
    path: '/settings/templates/whatsapp',
    element: <WhatsAppTemplatesPage />,
    meta: {
      title: 'WhatsApp Templates',
      breadcrumb: 'WhatsApp Templates',
      permission: 'edit:settings',
      hideInNav: true
    }
  },
  {
    path: '/settings/notifications',
    element: <UnifiedSettingsPage />,
    meta: {
      title: 'Notification Settings',
      breadcrumb: 'Notification Settings',
      permission: 'edit:settings',
      icon: <BellRing className="h-5 w-5" />
    }
  },
  {
    path: '/settings/roles',
    element: <RolePermissionsPage />,
    meta: {
      title: 'Access Control',
      breadcrumb: 'Access Control',
      permission: 'edit:staff',
      icon: <Lock className="h-5 w-5" />
    }
  },
];
