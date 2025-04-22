
import React from 'react';
import {
  BarChart3,
  Users,
  CalendarDays,
  CreditCard,
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
  Package,
  Store,
  FileText,
  Megaphone,
  RefreshCcw,
  TrendingUp,
  UserPlus,
  FolderHeart,
  Gift,
  Wallet,
  Archive
} from "lucide-react";
import { NavSection } from "@/types/navigation";
import { Permission } from "@/hooks/use-permissions";

export const adminNavSections: NavSection[] = [
  {
    name: "Dashboard",
    items: [
      {
        href: "/",
        label: "Analytics Dashboard",
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
    name: "CRM & Leads",
    items: [
      {
        href: "/crm/leads",
        label: "Lead Management",
        icon: <UserPlus className="h-5 w-5" />,
        permission: "access_crm" as Permission,
      },
      {
        href: "/crm/funnel",
        label: "Sales Funnel",
        icon: <TrendingUp className="h-5 w-5" />,
        permission: "access_crm" as Permission,
      },
      {
        href: "/crm/follow-up",
        label: "Follow-Up",
        icon: <RefreshCcw className="h-5 w-5" />,
        permission: "access_crm" as Permission,
      },
    ],
  },
  {
    name: "Marketing",
    items: [
      {
        href: "/marketing/promo",
        label: "Promotions",
        icon: <Gift className="h-5 w-5" />,
        permission: "access_marketing" as Permission,
      },
      {
        href: "/marketing/referral",
        label: "Referral Programs",
        icon: <Share2 className="h-5 w-5" />,
        permission: "access_marketing" as Permission,
      },
    ],
  },
  {
    name: "Inventory & Shop",
    items: [
      {
        href: "/inventory",
        label: "Inventory",
        icon: <Package className="h-5 w-5" />,
        permission: "access_inventory" as Permission,
      },
      {
        href: "/store",
        label: "Store",
        icon: <Store className="h-5 w-5" />,
        permission: "access_store" as Permission,
      },
    ],
  },
  {
    name: "Fitness",
    items: [
      {
        href: "/fitness-plans",
        label: "Fitness Plans Management",
        icon: <FolderHeart className="h-5 w-5" />,
        permission: "manage_fitness_data" as Permission,
      },
      {
        href: "/fitness/progress",
        label: "Member Progress",
        icon: <Activity className="h-5 w-5" />,
        permission: "manage_fitness_data" as Permission,
      },
      {
        href: "/fitness/workout-plans",
        label: "Workout Plans",
        icon: <Dumbbell className="h-5 w-5" />,
        permission: "manage_fitness_data" as Permission,
      },
      {
        href: "/fitness/diet-plans",
        label: "Diet Plans",
        icon: <FileText className="h-5 w-5" />,
        permission: "manage_fitness_data" as Permission,
      },
    ],
  },
  {
    name: "Communication",
    items: [
      {
        href: "/communication/announcements",
        label: "Announcements",
        icon: <Megaphone className="h-5 w-5" />,
        permission: "access_communication" as Permission,
      },
      {
        href: "/communication/feedback",
        label: "Feedback Management",
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
        href: "/communication/tasks",
        label: "Task Manager",
        icon: <Briefcase className="h-5 w-5" />,
        permission: "access_communication" as Permission,
      },
    ],
  },
  {
    name: "Reports",
    items: [
      {
        href: "/reports",
        label: "Reports & Analytics",
        icon: <FileText className="h-5 w-5" />,
        permission: "access_reports" as Permission,
      },
    ],
  },
  {
    name: "Finance",
    items: [
      {
        href: "/finance/dashboard",
        label: "Finance Dashboard",
        icon: <PieChart className="h-5 w-5" />,
        permission: "access_finance" as Permission,
        children: [
          {
            href: "/finance/invoices",
            label: "Invoices",
            permission: "manage_invoices" as Permission,
          },
          {
            href: "/finance/transactions",
            label: "Transactions",
            permission: "manage_transactions" as Permission,
          },
          {
            href: "/finance/income",
            label: "Income Records",
            permission: "manage_income" as Permission,
          },
          {
            href: "/finance/expenses",
            label: "Expense Management",
            permission: "manage_expenses" as Permission,
          }
        ]
      },
    ],
  },
];

export const staffNavSections: NavSection[] = adminNavSections.map(section => {
  if (section.name === "Communication") {
    return {
      ...section,
      items: section.items.filter(item => 
        item.href !== "/communication/reminder-rules" &&
        item.href !== "/communication/email" &&
        item.href !== "/communication/sms"
      )
    };
  }
  return section;
});
