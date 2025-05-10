import React from "react";
import { NavSection } from "@/types/navigation";
import { Permission } from "@/hooks/use-permissions";
import { 
  LayoutDashboard, 
  Users, 
  CalendarDays,
  UserRound,
  Store,
  Dumbbell,
  MessageSquare,
  BarChart,
  Globe,
  FileText,
  Settings,
  CircleDollarSign,
  Megaphone,
  Receipt,
  DollarSign,
  ArrowDownUp,
  Wallet,
  Calculator,
  Archive,
  Building2,
  Phone,
  UserPlus,
  ClipboardList,
  GitMerge,
  Clock
} from "lucide-react";

// Helper function to safely cast permission strings
const asPermission = (p: string): Permission => p as Permission;

export const adminNavSections: NavSection[] = [
  {
    name: "Dashboard",
    items: [
      {
        href: "/dashboard",
        label: "Analytics Dashboard",
        permission: asPermission("view_dashboard"),
        icon: <LayoutDashboard className="h-5 w-5" />
      },
      {
        href: "/dashboard/realtime",
        label: "Real-Time Dashboard",
        permission: asPermission("view_dashboard"),
        icon: <BarChart className="h-5 w-5" />
      }
    ]
  },
  {
    name: "Members",
    items: [
      {
        href: "/members",
        label: "Member List",
        permission: asPermission("manage_members"),
        icon: <Users className="h-5 w-5" />
      },
      {
        href: "/memberships",
        label: "Membership Plans",
        permission: asPermission("manage_memberships"),
        icon: <FileText className="h-5 w-5" />
      }
    ]
  },
  {
    name: "Classes",
    items: [
      {
        href: "/classes",
        label: "Class Schedule",
        permission: asPermission("manage_classes"),
        icon: <CalendarDays className="h-5 w-5" />
      },
      {
        href: "/classes/types",
        label: "Class Types",
        permission: asPermission("manage_classes"),
        icon: <FileText className="h-5 w-5" />
      }
    ]
  },
  {
    name: "Staff",
    items: [
      {
        href: "/staff",
        label: "Staff List",
        permission: asPermission("manage_staff"),
        icon: <Users className="h-5 w-5" />
      },
      {
        href: "/trainers",
        label: "Trainers",
        permission: asPermission("manage_trainers"),
        icon: <UserRound className="h-5 w-5" />
      }
    ]
  },
  {
    name: "CRM",
    items: [
      {
        href: "/crm/leads",
        label: "Lead Management",
        permission: asPermission("access_crm"),
        icon: <UserPlus className="h-5 w-5" />
      },
      {
        href: "/crm/funnel",
        label: "Sales Funnel",
        permission: asPermission("access_crm"),
        icon: <BarChart className="h-5 w-5" />
      },
      {
        href: "/crm/follow-up",
        label: "Follow-Up Management",
        permission: asPermission("access_crm"),
        icon: <Clock className="h-5 w-5" />
      }
    ]
  },
  {
    name: "Marketing",
    items: [
      {
        href: "/marketing/promo",
        label: "Promotions",
        permission: asPermission("manage_marketing"),
        icon: <Megaphone className="h-5 w-5" />
      },
      {
        href: "/marketing/referral",
        label: "Referral Programs",
        permission: asPermission("manage_marketing"),
        icon: <Users className="h-5 w-5" />
      }
    ]
  },
  {
    name: "Inventory & Shop",
    items: [
      {
        href: "/inventory",
        label: "Inventory",
        permission: asPermission("manage_inventory"),
        icon: <Store className="h-5 w-5" />
      },
      {
        href: "/store",
        label: "Store",
        permission: asPermission("manage_inventory"),
        icon: <Store className="h-5 w-5" />
      }
    ]
  },
  {
    name: "Fitness",
    items: [
      {
        href: "/fitness-plans",
        label: "Fitness Plans Management",
        permission: asPermission("trainer_edit_fitness"),
        icon: <Dumbbell className="h-5 w-5" />
      },
      {
        href: "/fitness/progress",
        label: "Member Progress",
        permission: asPermission("trainer_view_members"),
        icon: <BarChart className="h-5 w-5" />
      },
      {
        href: "/fitness/workout-plans",
        label: "Workout Plans",
        permission: asPermission("trainer_edit_fitness"),
        icon: <Dumbbell className="h-5 w-5" />
      },
      {
        href: "/fitness/diet",
        label: "Diet Plans",
        permission: asPermission("trainer_edit_fitness"),
        icon: <FileText className="h-5 w-5" />
      }
    ]
  },
  {
    name: "Communication",
    items: [
      {
        href: "/communication/announcements",
        label: "Announcements",
        permission: asPermission("access_communication"),
        icon: <Megaphone className="h-5 w-5" />
      },
      {
        href: "/communication/feedback",
        label: "Feedback Management",
        permission: asPermission("access_communication"),
        icon: <MessageSquare className="h-5 w-5" />
      },
      {
        href: "/communication/reminders",
        label: "Reminder Rules",
        permission: asPermission("access_communication"),
        icon: <Clock className="h-5 w-5" />
      },
      {
        href: "/communication/motivational",
        label: "Motivational Messages",
        permission: asPermission("access_communication"),
        icon: <Users className="h-5 w-5" />
      },
      {
        href: "/communication/notifications",
        label: "Notifications",
        permission: asPermission("access_communication"),
        icon: <PhoneCall className="h-5 w-5" />
      },
      {
        href: "/communication/tasks",
        label: "Task Manager",
        permission: asPermission("access_communication"),
        icon: <ClipboardList className="h-5 w-5" />
      }
    ]
  },
  {
    name: "Website",
    items: [
      {
        href: "/website",
        label: "Website Management",
        permission: asPermission("manage_website"),
        icon: <Globe className="h-5 w-5" />
      }
    ]
  },
  {
    name: "Reports",
    items: [
      {
        href: "/analytics",
        label: "Analytics",
        permission: asPermission("view_analytics"),
        icon: <BarChart className="h-5 w-5" />
      },
      {
        href: "/reports",
        label: "Reports",
        permission: asPermission("view_reports"),
        icon: <FileText className="h-5 w-5" />
      },
      {
        href: "/attendance",
        label: "Attendance Tracking",
        permission: asPermission("view_attendance"),
        icon: <Clock className="h-5 w-5" />
      }
    ]
  },
  {
    name: "Finance",
    items: [
      {
        href: "/finance/dashboard",
        label: "Finance Dashboard",
        permission: asPermission("view_finance_dashboard"),
        icon: <DollarSign className="h-5 w-5" />
      },
      {
        href: "/finance/invoices",
        label: "Invoices",
        permission: asPermission("manage_invoices"),
        icon: <Receipt className="h-5 w-5" />
      },
      {
        href: "/finance/transactions",
        label: "Transactions",
        permission: asPermission("manage_transactions"),
        icon: <ArrowDownUp className="h-5 w-5" />
      },
      {
        href: "/finance/income",
        label: "Income Records",
        permission: asPermission("manage_income"),
        icon: <Wallet className="h-5 w-5" />
      },
      {
        href: "/finance/expenses",
        label: "Expense Management",
        permission: asPermission("manage_expenses"),
        icon: <Calculator className="h-5 w-5" />
      }
    ]
  },
  {
    name: "Settings",
    items: [
      {
        href: "/settings",
        label: "System Settings",
        permission: asPermission("manage_settings"),
        icon: <Settings className="h-5 w-5" />
      },
      {
        href: "/settings/integrations",
        label: "Integration Settings",
        permission: asPermission("manage_settings"),
        icon: <GitMerge className="h-5 w-5" />
      },
      {
        href: "/system-backup",
        label: "System Backup & Restore",
        permission: asPermission("manage_settings"),
        icon: <Archive className="h-5 w-5" />
      },
      {
        href: "/branches",
        label: "Branch Management",
        permission: asPermission("manage_branches"),
        icon: <Building2 className="h-5 w-5" />
      }
    ]
  }
];
