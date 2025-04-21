
import React from 'react';
import { NavSection } from '@/types/navigation';
import {
  LayoutDashboard,
  Users,
  Dumbbell,
  Calendar,
  MessageSquare,
  UserRound,
  Gift,
  ShoppingBag,
  CreditCard,
  Settings,
  FileText,
  BarChart2,
  BellRing,
  Building2,
  Globe,
  Store,
} from 'lucide-react';

export const adminNavSections: NavSection[] = [
  {
    name: 'Dashboard',
    items: [
      {
        href: '/dashboard',
        label: 'Overview',
        icon: <LayoutDashboard className="h-5 w-5" />,
        permission: 'dashboard_view',
      },
      {
        href: '/dashboard/realtime',
        label: 'Real-time',
        icon: <BellRing className="h-5 w-5" />,
        permission: 'dashboard_view',
      },
      {
        href: '/analytics',
        label: 'Analytics',
        icon: <BarChart2 className="h-5 w-5" />,
        permission: 'analytics_view',
      },
    ],
  },
  {
    name: 'Members',
    items: [
      {
        href: '/members',
        label: 'Members List',
        icon: <Users className="h-5 w-5" />,
        permission: 'members_view',
      },
      {
        href: '/members/new',
        label: 'Add New Member',
        icon: <UserRound className="h-5 w-5" />,
        permission: 'members_create',
      },
      {
        href: '/attendance',
        label: 'Attendance',
        icon: <Calendar className="h-5 w-5" />,
        permission: 'attendance_view',
      },
    ],
  },
  {
    name: 'Fitness',
    items: [
      {
        href: '/fitness-plans',
        label: 'Fitness Plans',
        icon: <Dumbbell className="h-5 w-5" />,
        permission: 'fitness_plans_view',
      },
      {
        href: '/classes',
        label: 'Classes',
        icon: <Calendar className="h-5 w-5" />,
        permission: 'classes_view',
      },
      {
        href: '/memberships',
        label: 'Memberships',
        icon: <CreditCard className="h-5 w-5" />,
        permission: 'memberships_view',
      },
    ],
  },
  {
    name: 'Staff',
    items: [
      {
        href: '/trainers',
        label: 'Trainers',
        icon: <Dumbbell className="h-5 w-5" />,
        permission: 'trainers_view',
      },
      {
        href: '/staff',
        label: 'Staff List',
        icon: <Users className="h-5 w-5" />,
        permission: 'staff_view',
      },
      {
        href: '/settings/branches',
        label: 'Branches',
        icon: <Building2 className="h-5 w-5" />,
        permission: 'branches_view',
      },
    ],
  },
  {
    name: 'Communication',
    items: [
      {
        href: '/communication/announcements',
        label: 'Announcements',
        icon: <MessageSquare className="h-5 w-5" />,
        permission: 'announcements_view',
      },
      {
        href: '/communication/tasks',
        label: 'Tasks',
        icon: <FileText className="h-5 w-5" />,
        permission: 'tasks_view',
      },
      {
        href: '/communication/feedback',
        label: 'Feedback',
        icon: <MessageSquare className="h-5 w-5" />,
        permission: 'feedback_view',
      },
    ],
  },
  {
    name: 'CRM',
    items: [
      {
        href: '/crm/leads',
        label: 'Leads',
        icon: <Users className="h-5 w-5" />,
        permission: 'leads_view',
      },
      {
        href: '/crm/funnel',
        label: 'Sales Funnel',
        icon: <Users className="h-5 w-5" />,
        permission: 'funnel_view',
      },
      {
        href: '/crm/follow-up',
        label: 'Follow-ups',
        icon: <Calendar className="h-5 w-5" />,
        permission: 'follow_up_view',
      },
    ],
  },
  {
    name: 'Marketing',
    items: [
      {
        href: '/marketing/promo',
        label: 'Promo Codes',
        icon: <Gift className="h-5 w-5" />,
        permission: 'promo_view',
      },
      {
        href: '/marketing/referral',
        label: 'Referral Program',
        icon: <Users className="h-5 w-5" />,
        permission: 'referral_view',
      },
      {
        href: '/store',
        label: 'Store',
        icon: <Store className="h-5 w-5" />,
        permission: 'store_view',
      },
    ],
  },
  {
    name: 'Finance',
    items: [
      {
        href: '/finance/invoices',
        label: 'Invoices',
        icon: <FileText className="h-5 w-5" />,
        permission: 'invoices_view',
      },
      {
        href: '/finance/transactions',
        label: 'Transactions',
        icon: <CreditCard className="h-5 w-5" />,
        permission: 'transactions_view',
      },
      {
        href: '/finance/income',
        label: 'Income',
        icon: <BarChart2 className="h-5 w-5" />,
        permission: 'income_view',
      },
      {
        href: '/finance/expenses',
        label: 'Expenses',
        icon: <ShoppingBag className="h-5 w-5" />,
        permission: 'expenses_view',
      },
      {
        href: '/finance/dashboard',
        label: 'Dashboard',
        icon: <LayoutDashboard className="h-5 w-5" />,
        permission: 'finance_dashboard_view',
      },
    ],
  },
  {
    name: 'Website',
    items: [
      {
        href: '/website',
        label: 'Manage Pages',
        icon: <Globe className="h-5 w-5" />,
        permission: 'website_view',
      },
    ],
  },
  {
    name: 'Settings',
    items: [
      {
        href: '/settings',
        label: 'General',
        icon: <Settings className="h-5 w-5" />,
        permission: 'settings_view',
      },
      {
        href: '/settings/integrations',
        label: 'Integrations',
        icon: <Settings className="h-5 w-5" />,
        permission: 'integrations_view',
      },
      {
        href: '/settings/payment-gateways',
        label: 'Payment Gateways',
        icon: <CreditCard className="h-5 w-5" />,
        permission: 'payment_gateways_view',
      },
    ],
  },
];
