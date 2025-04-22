import React from 'react';
import { Home, Users, Settings, MessageSquare, Calendar, BarChart, Lock, Shield, LayoutDashboard, Bell, Mail, CheckCircle2, XCircle, Plus, FileText, Wallet, Building2, BadgeCheck, GraduationCap, ListChecks, LucideIcon } from 'lucide-react';
import { usePermissions } from '@/hooks/use-permissions';

interface NavigationSection {
  title: string;
  items: {
    label: string;
    icon: LucideIcon;
    href: string;
    requiredPermission?: string;
    requiredRoles?: string[];
  }[];
  requiredPermission?: string;
  requiredRoles?: string[];
}

const navigationSections: NavigationSection[] = [
  {
    title: 'General',
    items: [
      { label: 'Dashboard', icon: LayoutDashboard, href: '/dashboard', requiredPermission: 'view_dashboard' },
    ],
  },
  {
    title: 'Management',
    items: [
      { label: 'Members', icon: Users, href: '/members', requiredPermission: 'manage_members' },
      { label: 'Trainers', icon: GraduationCap, href: '/trainers', requiredPermission: 'manage_trainers' },
      { label: 'Classes', icon: Calendar, href: '/classes', requiredPermission: 'manage_classes' },
      { label: 'Attendance', icon: ListChecks, href: '/attendance', requiredPermission: 'manage_attendance' },
      { label: 'Subscriptions', icon: Wallet, href: '/subscriptions', requiredPermission: 'manage_subscriptions' },
      { label: 'Branches', icon: Building2, href: '/branches', requiredPermission: 'manage_branches' },
    ],
    requiredPermission: 'access_management',
  },
  {
    title: 'Communication',
    items: [
      { label: 'Notifications', icon: Bell, href: '/communication/notifications', requiredPermission: 'manage_notifications' },
      { label: 'Motivational', icon: MessageSquare, href: '/communication/motivational', requiredPermission: 'manage_motivational' },
      { label: 'Reminders', icon: Mail, href: '/communication/reminders', requiredPermission: 'manage_reminders' },
      { label: 'Feedback', icon: CheckCircle2, href: '/communication/feedback', requiredPermission: 'manage_feedback' },
    ],
    requiredPermission: 'access_communication',
  },
  {
    title: 'Finance',
    items: [
      { label: 'Payments', icon: Wallet, href: '/finance/payments', requiredPermission: 'view_payments' },
      { label: 'Expenses', icon: XCircle, href: '/finance/expenses', requiredPermission: 'manage_expenses' },
      { label: 'Reports', icon: FileText, href: '/finance/reports', requiredPermission: 'view_reports' },
    ],
    requiredPermission: 'access_finance',
  },
  {
    title: 'Settings',
    items: [
      { label: 'General', icon: Settings, href: '/settings/general', requiredPermission: 'manage_settings' },
      { label: 'Permissions', icon: Shield, href: '/settings/permissions', requiredPermission: 'manage_permissions' },
      { label: 'Roles', icon: BadgeCheck, href: '/settings/roles', requiredPermission: 'manage_roles' },
    ],
    requiredPermission: 'access_settings',
  },
];

export const NavigationSections = () => {
  const { can, canAccess, hasRole, userRole } = usePermissions();

  // Replace hasPermission with can
  const checkAccess = (section: NavigationSection): boolean => {
    if (section.requiredPermission) {
      return can(section.requiredPermission);
    }
    if (section.requiredRoles) {
      return hasRole(section.requiredRoles);
    }
    return true;
  };

  return (
    <>
      {navigationSections.map((section, index) =>
        checkAccess(section) && (
          <div key={index} className="pb-4">
            <h4 className="mb-1 rounded-md px-2 text-sm font-semibold tracking-tight">{section.title}</h4>
            {section.items.map((item) =>
              canAccess(item.requiredPermission, item.requiredRoles) && (
                <div key={item.label} className="space-y-1">
                  <a
                    href={item.href}
                    className="group flex w-full items-center space-x-2 rounded-md px-2 py-1.5 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </a>
                </div>
              )
            )}
          </div>
        )
      )}
    </>
  );
};

export default NavigationSections;
