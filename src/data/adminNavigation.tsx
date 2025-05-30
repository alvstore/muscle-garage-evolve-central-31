
import React from "react";
import { NavSection } from "@/types/navigation";
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
  PhoneCall,
  Clock
} from "lucide-react";

export const adminNavSections: NavSection[] = [
  {
    name: "Dashboard",
    items: [
      {
        href: "/dashboard",
        label: "Analytics Dashboard",
        permission: "view_dashboard",
        icon: <LayoutDashboard className="h-5 w-5" />
      },
      {
        href: "/dashboard/realtime",
        label: "Real-Time Dashboard",
        permission: "view_dashboard",
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
        permission: "manage_members",
        icon: <Users className="h-5 w-5" />
      },
      {
        href: "/memberships",
        label: "Membership Plans",
        permission: "manage_memberships",
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
        permission: "manage_classes",
        icon: <CalendarDays className="h-5 w-5" />
      },
      {
        href: "/classes/types",
        label: "Class Types",
        permission: "manage_classes",
        icon: <FileText className="h-5 w-5" />
      }
    ]
  },
  {
    name: "Team Management",
    items: [
      {
        href: "/staff",
        label: "Team Members",
        permission: "manage_staff",
        icon: <Users className="h-5 w-5" />
      }
    ]
  },
  {
    name: "CRM",
    items: [
      {
        href: "/crm/leads",
        label: "Lead Management",
        permission: "access_crm",
        icon: <UserPlus className="h-5 w-5" />
      },
      {
        href: "/crm/funnel",
        label: "Sales Funnel",
        permission: "access_crm",
        icon: <BarChart className="h-5 w-5" />
      },
      {
        href: "/crm/follow-up",
        label: "Follow-Up Management",
        permission: "access_crm",
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
        permission: "manage_marketing",
        icon: <Megaphone className="h-5 w-5" />
      },
      {
        href: "/marketing/referral",
        label: "Referral Programs",
        permission: "manage_marketing",
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
        permission: "manage_inventory",
        icon: <Store className="h-5 w-5" />
      },
      {
        href: "/store",
        label: "Store",
        permission: "manage_inventory",
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
        permission: "trainer_edit_fitness",
        icon: <Dumbbell className="h-5 w-5" />
      },
      {
        href: "/fitness/progress",
        label: "Member Progress",
        permission: "trainer_view_members",
        icon: <BarChart className="h-5 w-5" />
      },
      {
        href: "/fitness/workout-plans",
        label: "Workout Plans",
        permission: "trainer_edit_fitness",
        icon: <Dumbbell className="h-5 w-5" />
      },
      {
        href: "/fitness/diet",
        label: "Diet Plans",
        permission: "trainer_edit_fitness",
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
        permission: "access_communication",
        icon: <Megaphone className="h-5 w-5" />
      },
      {
        href: "/communication/feedback",
        label: "Feedback Management",
        permission: "access_communication",
        icon: <MessageSquare className="h-5 w-5" />
      },
      {
        href: "/communication/reminders",
        label: "Reminder Rules",
        permission: "access_communication",
        icon: <Clock className="h-5 w-5" />
      },
      {
        href: "/communication/motivational",
        label: "Motivational Messages",
        permission: "access_communication",
        icon: <Users className="h-5 w-5" />
      },
      {
        href: "/communication/notifications",
        label: "Notifications",
        permission: "access_communication",
        icon: <PhoneCall className="h-5 w-5" />
      },
      {
        href: "/communication/tasks",
        label: "Task Manager",
        permission: "access_communication",
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
        permission: "manage_website",
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
        permission: "view_analytics",
        icon: <BarChart className="h-5 w-5" />
      },
      {
        href: "/reports",
        label: "Reports",
        permission: "view_reports",
        icon: <FileText className="h-5 w-5" />
      },
      {
        href: "/attendance",
        label: "Attendance Tracking",
        permission: "view_attendance",
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
        permission: "view_finance_dashboard",
        icon: <DollarSign className="h-5 w-5" />
      },
      {
        href: "/finance/invoices",
        label: "Invoices",
        permission: "manage_invoices",
        icon: <Receipt className="h-5 w-5" />
      },
      {
        href: "/finance/transactions",
        label: "Transactions",
        permission: "manage_transactions",
        icon: <ArrowDownUp className="h-5 w-5" />
      },
      {
        href: "/finance/income",
        label: "Income Records",
        permission: "manage_income",
        icon: <Wallet className="h-5 w-5" />
      },
      {
        href: "/finance/expenses",
        label: "Expense Management",
        permission: "manage_expenses",
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
        permission: "manage_settings",
        icon: <Settings className="h-5 w-5" />
      },
      {
        href: "/settings/integrations",
        label: "Integration Settings",
        permission: "manage_settings",
        icon: <GitMerge className="h-5 w-5" />
      },
      {
        href: "/system-backup",
        label: "System Backup & Restore",
        permission: "manage_settings",
        icon: <Archive className="h-5 w-5" />
      },
      {
        href: "/branches",
        label: "Branch Management",
        permission: "manage_branches",
        icon: <Building2 className="h-5 w-5" />
      }
    ]
  }
];
