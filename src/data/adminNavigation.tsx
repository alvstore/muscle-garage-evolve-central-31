import { Permission } from '@/hooks/use-permissions';

export const adminNavigation = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    children: [
      {
        href: '/dashboard',
        label: 'Analytics Dashboard',
        permission: 'access_dashboards'
      },
      {
        href: '/dashboard/crm',
        label: 'CRM Dashboard',
        permission: 'access_crm'
      },
      {
        href: '/dashboard/marketing',
        label: 'Marketing Dashboard',
        permission: 'access_marketing'
      },
      {
        href: '/dashboard/finance',
        label: 'Finance Dashboard',
        permission: 'access_finance'
      },
      {
        href: '/dashboard/trainer',
        label: 'Trainer Dashboard',
        permission: 'feature_trainer_dashboard'
      }
    ],
  },
  {
    name: 'Management',
    href: '/management',
    children: [
      {
        href: '/branches',
        label: 'Branches',
        permission: 'manage_branches'
      },
      {
        href: '/members',
        label: 'Members',
        permission: 'manage_members'
      },
      {
        href: '/trainers',
        label: 'Trainers',
        permission: 'view_all_trainers'
      },
      {
        href: '/staff',
        label: 'Staff',
        permission: 'manage_staff'
      },
      {
        href: '/roles',
        label: 'Roles & Permissions',
        permission: 'manage_roles'
      },
      {
        href: '/attendance',
        label: 'Attendance',
        permission: 'view_all_attendance'
      },
      {
        href: '/classes',
        label: 'Classes',
        permission: 'view_classes'
      },
      {
        href: '/fitness/plans',
        label: 'Fitness Plans',
        permission: 'assign_plan'
      },
      {
        href: '/fitness/progress',
        label: 'Fitness Progress',
        permission: 'manage_fitness_data'
      },
      {
        href: '/inventory',
        label: 'Inventory',
        permission: 'access_inventory'
      },
      {
        href: '/store',
        label: 'Store',
        permission: 'access_store'
      },
    ],
  },
  {
    name: 'Communication',
    href: '/communication',
    children: [
      {
        href: '/communication/announcements',
        label: 'Announcements',
        permission: 'access_communication'
      },
      {
        href: '/communication/email-campaigns',
        label: 'Email Campaigns',
        permission: 'feature_email_campaigns'
      },
      {
        href: '/communication/sms',
        label: 'SMS Campaigns',
        permission: 'access_communication'
      },
    ],
  },
  {
    name: 'Finance',
    href: '/finance',
    children: [
      {
        href: '/finance/invoices',
        label: 'Invoices',
        permission: 'manage_invoices'
      },
      {
        href: '/finance/transactions',
        label: 'Transactions',
        permission: 'manage_transactions'
      },
      {
        href: '/finance/income',
        label: 'Income',
        permission: 'manage_income'
      },
      {
        href: '/finance/expenses',
        label: 'Expenses',
        permission: 'manage_expenses'
      },
      {
        href: '/finance/reports',
        label: 'Reports',
        permission: 'access_reports'
      },
    ],
  },
  {
    name: 'Settings',
    href: '/settings',
    children: [
      {
        href: '/settings/general',
        label: 'General Settings',
        permission: 'manage_settings'
      },
      {
        href: '/settings/email',
        label: 'Email Settings',
        permission: 'manage_settings'
      },
      {
        href: '/settings/sms',
        label: 'SMS Settings',
        permission: 'manage_settings'
      },
      {
        href: '/settings/integrations',
        label: 'Integrations',
        permission: 'manage_integrations'
      },
      {
        href: '/settings/templates',
        label: 'Templates',
        permission: 'manage_templates'
      },
      {
        href: '/settings/devices',
        label: 'Devices',
        permission: 'manage_devices'
      },
    ],
  },
  {
    name: 'Website',
    href: '/website',
    children: [],
  },
  {
    href: "/website",
    label: "Website Management",
    permission: "manage_website"
  }, 
];
