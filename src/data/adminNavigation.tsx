
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
        title: 'Overview',
        href: '/dashboard',
        icon: <LayoutDashboard className="h-5 w-5" />,
      },
      {
        title: 'Real-time',
        href: '/dashboard/realtime',
        icon: <BellRing className="h-5 w-5" />,
      },
      {
        title: 'Analytics',
        href: '/analytics',
        icon: <BarChart2 className="h-5 w-5" />,
      },
    ],
  },
  {
    name: 'Members',
    items: [
      {
        title: 'Members List',
        href: '/members',
        icon: <Users className="h-5 w-5" />,
      },
      {
        title: 'Add New Member',
        href: '/members/new',
        icon: <UserRound className="h-5 w-5" />,
      },
      {
        title: 'Attendance',
        href: '/attendance',
        icon: <Calendar className="h-5 w-5" />,
      },
    ],
  },
  {
    name: 'Fitness',
    items: [
      {
        title: 'Fitness Plans',
        href: '/fitness-plans',
        icon: <Dumbbell className="h-5 w-5" />,
      },
      {
        title: 'Classes',
        href: '/classes',
        icon: <Calendar className="h-5 w-5" />,
      },
      {
        title: 'Memberships',
        href: '/memberships',
        icon: <CreditCard className="h-5 w-5" />,
      },
    ],
  },
  {
    name: 'Staff',
    items: [
      {
        title: 'Trainers',
        href: '/trainers',
        icon: <Dumbbell className="h-5 w-5" />,
      },
      {
        title: 'Staff List',
        href: '/staff',
        icon: <Users className="h-5 w-5" />,
      },
      {
        title: 'Branches',
        href: '/settings/branches',
        icon: <Building2 className="h-5 w-5" />,
      },
    ],
  },
  {
    name: 'Communication',
    items: [
      {
        title: 'Announcements',
        href: '/communication/announcements',
        icon: <MessageSquare className="h-5 w-5" />,
      },
      {
        title: 'Tasks',
        href: '/communication/tasks',
        icon: <FileText className="h-5 w-5" />,
      },
      {
        title: 'Feedback',
        href: '/communication/feedback',
        icon: <MessageSquare className="h-5 w-5" />,
      },
    ],
  },
  {
    name: 'CRM',
    items: [
      {
        title: 'Leads',
        href: '/crm/leads',
        icon: <Users className="h-5 w-5" />,
      },
      {
        title: 'Sales Funnel',
        href: '/crm/funnel',
        icon: <Users className="h-5 w-5" />,
      },
      {
        title: 'Follow-ups',
        href: '/crm/follow-up',
        icon: <Calendar className="h-5 w-5" />,
      },
    ],
  },
  {
    name: 'Marketing',
    items: [
      {
        title: 'Promo Codes',
        href: '/marketing/promo',
        icon: <Gift className="h-5 w-5" />,
      },
      {
        title: 'Referral Program',
        href: '/marketing/referral',
        icon: <Users className="h-5 w-5" />,
      },
      {
        title: 'Store',
        href: '/store',
        icon: <Store className="h-5 w-5" />,
      },
    ],
  },
  {
    name: 'Finance',
    items: [
      {
        title: 'Invoices',
        href: '/finance/invoices',
        icon: <FileText className="h-5 w-5" />,
      },
      {
        title: 'Transactions',
        href: '/finance/transactions',
        icon: <CreditCard className="h-5 w-5" />,
      },
      {
        title: 'Income',
        href: '/finance/income',
        icon: <BarChart2 className="h-5 w-5" />,
      },
      {
        title: 'Expenses',
        href: '/finance/expenses',
        icon: <ShoppingBag className="h-5 w-5" />,
      },
      {
        title: 'Dashboard',
        href: '/finance/dashboard',
        icon: <LayoutDashboard className="h-5 w-5" />,
      },
    ],
  },
  {
    name: 'Website',
    items: [
      {
        title: 'Manage Pages',
        href: '/website',
        icon: <Globe className="h-5 w-5" />,
      },
    ],
  },
  {
    name: 'Settings',
    items: [
      {
        title: 'General',
        href: '/settings',
        icon: <Settings className="h-5 w-5" />,
      },
      {
        title: 'Integrations',
        href: '/settings/integrations',
        icon: <Settings className="h-5 w-5" />,
      },
      {
        title: 'Payment Gateways',
        href: '/settings/payment-gateways',
        icon: <CreditCard className="h-5 w-5" />,
      },
    ],
  },
];
