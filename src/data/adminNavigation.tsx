import { NavSection } from '@/types/navigation';
import { Settings, Users, Calendar, Dumbbell, MessageSquare, 
         PieChart, FileText, Store, BarChart, Building2, 
         Download } from 'lucide-react';
import { Permission } from '@/hooks/use-permissions';

export const adminNavSections: NavSection[] = [
  {
    name: 'Dashboard',
    icon: PieChart,
    items: [
      {
        href: '/',
        label: 'Analytics',
        permission: 'dashboard.view',
      },
    ]
  },
  {
    name: 'Members',
    icon: Users,
    items: [
      {
        href: '/members',
        label: 'Members List',
        permission: 'members.view',
      },
      {
        href: '/members/new',
        label: 'Add New Member',
        permission: 'members.create',
      },
    ]
  },
  {
    name: 'Classes',
    icon: Calendar,
    items: [
      {
        href: '/classes',
        label: 'Class Schedule',
        permission: 'classes.view',
      },
      {
        href: '/classes/new',
        label: 'Create Class',
        permission: 'classes.create',
      },
    ]
  },
  {
    name: 'Fitness',
    icon: Dumbbell,
    items: [
      {
        href: '/workouts',
        label: 'Workouts',
        permission: 'workouts.view',
      },
      {
        href: '/diet-plans',
        label: 'Diet Plans',
        permission: 'dietPlans.view',
      },
    ]
  },
  {
    name: 'Communication',
    icon: MessageSquare,
    items: [
      {
        href: '/communication/email',
        label: 'Email Marketing',
        permission: 'communication.email',
      },
      {
        href: '/communication/sms',
        label: 'SMS Marketing',
        permission: 'communication.sms',
      },
    ]
  },
  {
    name: 'CRM',
    icon: FileText,
    items: [
      {
        href: '/crm/leads',
        label: 'Leads',
        permission: 'crm.leads',
      },
      {
        href: '/crm/contacts',
        label: 'Contacts',
        permission: 'crm.contacts',
      },
    ]
  },
  {
    name: 'Website',
    icon: Building2,
    items: [
      {
        href: '/website/content',
        label: 'Content',
        permission: 'website.content',
      },
      {
        href: '/website/images',
        label: 'Images',
        permission: 'website.images',
      },
    ]
  },
  {
    name: 'System',
    items: [
      {
        href: '/system-backup',
        label: 'System Backup',
        permission: 'system.backup',
      }
    ]
  },
  {
    name: 'Settings',
    icon: Settings,
    items: [
      {
        href: '/settings/branches',
        label: 'Branches',
        permission: 'settings.branches',
      },
      {
        href: '/settings/users',
        label: 'Users',
        permission: 'settings.users',
      },
    ]
  },
];
