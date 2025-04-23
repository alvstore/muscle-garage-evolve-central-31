
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
  Archive,
  Settings,
  Layers,
  KeyRound,
  Repeat,
  LayoutTemplate,
  Zap,
  Smartphone,
  Database
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
    name: "Website",
    items: [
      {
        href: "/frontpages",
        label: "Website Management",
        icon: <Globe className="h-5 w-5" />,
        permission: "manage_website" as Permission,
        children: [
          {
            href: "/frontpages?tab=home",
            label: "Home Page",
            permission: "manage_website" as Permission,
          },
          {
            href: "/frontpages?tab=about",
            label: "About Us",
            permission: "manage_website" as Permission,
          },
          {
            href: "/frontpages?tab=services",
            label: "Services & Pricing",
            permission: "manage_website" as Permission,
          },
          {
            href: "/frontpages?tab=classes",
            label: "Classes & Trainers",
            permission: "manage_website" as Permission,
          },
          {
            href: "/frontpages?tab=testimonials",
            label: "Testimonials",
            permission: "manage_website" as Permission,
          },
          {
            href: "/frontpages?tab=contact",
            label: "Contact Page",
            permission: "manage_website" as Permission,
          }
        ]
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
  {
    name: "Settings",
    items: [
      {
        href: "/settings",
        label: "System Settings",
        icon: <Settings className="h-5 w-5" />,
        permission: "access_settings" as Permission,
        children: [
          {
            href: "/settings",
            label: "General Settings",
            permission: "manage_settings" as Permission,
          },
          {
            href: "/settings/branches",
            label: "Branch Management",
            permission: "manage_branches" as Permission,
          },
          {
            href: "/settings/automation",
            label: "Automation Rules",
            permission: "manage_settings" as Permission,
          },
          {
            href: "/settings/system-backup",
            label: "System Backup",
            permission: "full_system_access" as Permission,
          }
        ]
      },
      {
        href: "/settings/integrations",
        label: "Integration Settings",
        icon: <Layers className="h-5 w-5" />,
        permission: "access_settings" as Permission,
        children: [
          {
            href: "/settings/integrations/access-control",
            label: "Access Control",
            permission: "manage_integrations" as Permission,
          },
          {
            href: "/settings/integrations/payment",
            label: "Payment Gateways",
            permission: "manage_integrations" as Permission,
          },
          {
            href: "/settings/integrations/messaging",
            label: "Messaging Services",
            permission: "manage_integrations" as Permission,
          },
          {
            href: "/settings/integrations/sms",
            label: "SMS Services",
            permission: "manage_integrations" as Permission,
          },
          {
            href: "/settings/integrations/push",
            label: "Push Notifications",
            permission: "manage_integrations" as Permission,
          }
        ]
      },
      {
        href: "/settings/templates",
        label: "Message Templates",
        icon: <LayoutTemplate className="h-5 w-5" />,
        permission: "access_settings" as Permission,
        children: [
          {
            href: "/settings/templates/email",
            label: "Email Templates",
            permission: "manage_templates" as Permission,
          },
          {
            href: "/settings/templates/sms",
            label: "SMS Templates",
            permission: "manage_templates" as Permission,
          },
          {
            href: "/settings/templates/whatsapp",
            label: "WhatsApp Templates",
            permission: "manage_templates" as Permission,
          }
        ]
      },
      {
        href: "/settings/attendance",
        label: "Attendance Settings",
        icon: <Smartphone className="h-5 w-5" />,
        permission: "access_settings" as Permission,
        children: [
          {
            href: "/settings/attendance/devices",
            label: "Device Mapping",
            permission: "manage_devices" as Permission,
          },
          {
            href: "/settings/attendance/access-rules",
            label: "Access Rules",
            permission: "manage_devices" as Permission,
          }
        ]
      },
      {
        href: "/settings/system-backup",
        label: "System Backup",
        icon: <Database className="h-5 w-5" />,
        permission: "full_system_access" as Permission,
      }
    ],
  },
];

export const staffNavSections: NavSection[] = adminNavSections
  .filter(section => section.name !== "Settings" && section.name !== "Website")
  .map(section => {
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
