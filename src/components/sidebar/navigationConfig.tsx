
import React from "react";
import {
  LayoutDashboard,
  Users,
  Dumbbell,
  ClipboardList,
  CreditCard,
  Activity,
  DollarSign,
  Receipt,
  Package,
  Bell,
  MessageSquare,
  UserPlus,
  Gift,
  CalendarDays,
  BarChart3,
  Settings,
  Eye,
  FileText,
  Store,
  Globe,
  CheckSquare
} from "lucide-react";
import { Permission } from "@/hooks/use-permissions";

export interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
  badge?: string;
  permission: Permission;
  children?: {
    href: string;
    label: string;
    permission: Permission;
  }[];
}

export interface NavCategory {
  name: string;
  items: NavItem[];
}

export const sidebarNavigation: NavCategory[] = [
  {
    name: "DASHBOARD",
    items: [
      { 
        href: "/dashboard", 
        label: "Dashboard", 
        icon: <LayoutDashboard className="h-5 w-5" />, 
        permission: "access_dashboards"
      },
      { 
        href: "/dashboard/overview", 
        label: "Analytics", 
        icon: <Eye className="h-5 w-5" />, 
        permission: "access_dashboards"
      },
    ]
  },
  {
    name: "GYM MANAGEMENT",
    items: [
      { 
        href: "/members", 
        label: "Members", 
        icon: <Users className="h-5 w-5" />,
        badge: "328",
        permission: "manage_members",
        children: [
          { 
            href: "/members", 
            label: "All Members", 
            permission: "manage_members"
          },
          { 
            href: "/members/new", 
            label: "Add Member", 
            permission: "register_member"
          }
        ]
      },
      { 
        href: "/trainers", 
        label: "Trainers", 
        icon: <Dumbbell className="h-5 w-5" />, 
        permission: "view_all_trainers"
      },
      { 
        href: "/classes", 
        label: "Classes", 
        icon: <ClipboardList className="h-5 w-5" />, 
        permission: "trainer_view_classes"
      },
      { 
        href: "/fitness-plans", 
        label: "Fitness Plans", 
        icon: <Activity className="h-5 w-5" />, 
        permission: "trainer_edit_fitness",
        children: [
          { 
            href: "/fitness-plans", 
            label: "Overview", 
            permission: "trainer_edit_fitness"
          },
          { 
            href: "/fitness/workout-plans", 
            label: "Workout Plans", 
            permission: "trainer_edit_fitness"
          },
          { 
            href: "/fitness/diet-plans", 
            label: "Diet Plans", 
            permission: "trainer_edit_fitness"
          }
        ]
      },
      { 
        href: "/memberships", 
        label: "Membership Plans", 
        icon: <CreditCard className="h-5 w-5" />, 
        permission: "member_view_plans"
      },
      { 
        href: "/finance", 
        label: "Finance", 
        icon: <DollarSign className="h-5 w-5" />, 
        permission: "view_invoices",
        children: [
          { 
            href: "/finance/invoices", 
            label: "Invoices", 
            permission: "view_invoices"
          },
          { 
            href: "/finance/transactions", 
            label: "Transactions", 
            permission: "manage_payments"
          },
        ]
      },
    ]
  },
  {
    name: "TASKS & OPERATIONS",
    items: [
      { 
        href: "/trainers/tasks", 
        label: "Task Management", 
        icon: <CheckSquare className="h-5 w-5" />,
        permission: "access_own_resources"
      },
      { 
        href: "/attendance", 
        label: "Attendance", 
        icon: <CalendarDays className="h-5 w-5" />, 
        permission: "view_all_attendance"
      },
    ]
  },
  {
    name: "INVENTORY & STORE",
    items: [
      { 
        href: "/inventory", 
        label: "Inventory", 
        icon: <Package className="h-5 w-5" />,
        permission: "access_inventory"
      },
      { 
        href: "/store", 
        label: "Store", 
        icon: <Store className="h-5 w-5" />,
        permission: "access_store"
      }
    ]
  },
  {
    name: "MARKETING",
    items: [
      { 
        href: "/crm/leads", 
        label: "CRM", 
        icon: <UserPlus className="h-5 w-5" />, 
        permission: "access_crm",
        children: [
          { 
            href: "/crm/leads", 
            label: "Leads", 
            permission: "access_crm"
          },
          { 
            href: "/crm/funnel", 
            label: "Sales Funnel", 
            permission: "access_crm"
          },
          { 
            href: "/crm/follow-up", 
            label: "Follow-up", 
            permission: "access_crm"
          }
        ]
      },
      { 
        href: "/marketing/promo", 
        label: "Promotions", 
        icon: <Gift className="h-5 w-5" />,
        permission: "access_marketing"
      },
      { 
        href: "/marketing/referral", 
        label: "Referral Program", 
        icon: <Gift className="h-5 w-5" />,
        permission: "access_marketing"
      }
    ]
  },
  {
    name: "COMMUNICATION",
    items: [
      { 
        href: "/communication/announcements", 
        label: "Announcements", 
        icon: <Bell className="h-5 w-5" />, 
        permission: "access_communication"
      },
      { 
        href: "/communication/feedback", 
        label: "Feedback", 
        icon: <MessageSquare className="h-5 w-5" />, 
        permission: "access_communication"
      },
      { 
        href: "/communication/reminders", 
        label: "Reminders", 
        icon: <Bell className="h-5 w-5" />, 
        permission: "access_communication"
      }
    ]
  },
  {
    name: "FRONT PAGES",
    items: [
      { 
        href: "/frontpages", 
        label: "Website", 
        icon: <Globe className="h-5 w-5" />, 
        permission: "full_system_access"
      }
    ]
  },
  {
    name: "REPORTS & TOOLS",
    items: [
      { 
        href: "/reports", 
        label: "Reports", 
        icon: <FileText className="h-5 w-5" />, 
        permission: "access_analytics"
      },
      { 
        href: "/settings", 
        label: "Settings", 
        icon: <Settings className="h-5 w-5" />, 
        permission: "access_own_resources"
      }
    ]
  }
];
