
import React from 'react';
import {
  BarChart3,
  Users,
  CalendarDays,
  CreditCard,
  Settings,
  Dumbbell,
  UserCircle,
  Briefcase,
  Clock,
  PieChart,
  Building2,
  Contact,
  Mail,
  MessageCircle,
  Share2,
  HelpCircle,
  Radio,
  Globe,
  Bell,
  Activity,
  Cpu,
} from "lucide-react";
import { NavSection } from "@/types/navigation";
import { Permission } from "@/hooks/use-permissions";

export const adminNavSections: NavSection[] = [
  {
    name: "Dashboard",
    items: [
      {
        href: "/",
        label: "Analytics",
        icon: <BarChart3 className="h-5 w-5" />,
        permission: "access_dashboards" as Permission,
      },
      {
        href: "/dashboard/realtime",
        label: "Real-Time Dashboard",
        icon: <Activity className="h-5 w-5" />,
        permission: "view_all_attendance" as Permission,
      }
    ],
  },
  {
    name: "Members",
    items: [
      {
        href: "/members",
        label: "Member List",
        icon: <Users className="h-5 w-5" />,
        permission: "manage_members" as Permission,
      },
      {
        href: "/members/new",
        label: "Add Member",
        icon: <UserCircle className="h-5 w-5" />,
        permission: "register_member" as Permission,
      },
      {
        href: "/memberships",
        label: "Membership Plans",
        icon: <Briefcase className="h-5 w-5" />,
        permission: "member_view_plans" as Permission,
      },
    ],
  },
  {
    name: "Classes",
    items: [
      {
        href: "/classes",
        label: "Class Schedule",
        icon: <CalendarDays className="h-5 w-5" />,
        permission: "view_classes" as Permission,
      },
      {
        href: "/classes/types",
        label: "Class Types",
        icon: <Dumbbell className="h-5 w-5" />,
        permission: "trainer_view_classes" as Permission,
      },
    ],
  },
  {
    name: "Finance",
    items: [
      {
        href: "/finance",
        label: "Overview",
        icon: <PieChart className="h-5 w-5" />,
        permission: "view_invoices" as Permission,
      },
      {
        href: "/finance/transactions",
        label: "Transactions",
        icon: <CreditCard className="h-5 w-5" />,
        permission: "manage_payments" as Permission,
      },
      {
        href: "/finance/invoices",
        label: "Invoices",
        icon: <CreditCard className="h-5 w-5" />,
        permission: "view_invoices" as Permission,
      },
    ],
  },
  {
    name: "Staff",
    items: [
      {
        href: "/staff",
        label: "Staff List",
        icon: <Users className="h-5 w-5" />,
        permission: "view_staff" as Permission,
      },
      {
        href: "/trainers",
        label: "Trainers",
        icon: <Dumbbell className="h-5 w-5" />,
        permission: "view_all_trainers" as Permission,
      },
    ],
  },
  {
    name: "Communication",
    items: [
      {
        href: "/communication/email",
        label: "Email",
        icon: <Mail className="h-5 w-5" />,
        permission: "access_communication" as Permission,
      },
      {
        href: "/communication/sms",
        label: "SMS",
        icon: <MessageCircle className="h-5 w-5" />,
        permission: "access_communication" as Permission,
      },
      {
        href: "/communication/notifications",
        label: "Notifications",
        icon: <Bell className="h-5 w-5" />,
        permission: "access_communication" as Permission,
      },
      {
        href: "/communication/feedback",
        label: "Feedback",
        icon: <MessageCircle className="h-5 w-5" />,
        permission: "access_communication" as Permission,
      },
      {
        href: "/communication/announcements",
        label: "Announcements",
        icon: <Bell className="h-5 w-5" />,
        permission: "access_communication" as Permission,
      },
    ],
  },
  {
    name: "Website",
    items: [
      {
        href: "/website",
        label: "Front Pages",
        icon: <Globe className="h-5 w-5" />,
        permission: "full_system_access" as Permission,
      },
    ],
  },
  {
    name: "Settings",
    items: [
      {
        href: "/settings",
        label: "System Settings",
        icon: <Settings className="h-5 w-5" />,
        permission: "manage_settings" as Permission,
        children: [
          {
            href: "/settings/branches",
            label: "Branch Management",
            permission: "manage_branches" as Permission,
          },
          {
            href: "/settings/branches/devices",
            label: "Device Mapping",
            permission: "manage_integrations" as Permission,
          },
          {
            href: "/settings/integrations",
            label: "Integrations",
            permission: "manage_integrations" as Permission,
          },
        ],
      },
      {
        href: "/help",
        label: "Help Center",
        icon: <HelpCircle className="h-5 w-5" />,
        permission: "access_own_resources" as Permission,
      },
    ],
  },
];
