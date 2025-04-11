
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
  CalendarCheck,
  UserPlus,
  ShoppingBag,
  Gift,
  Circle,
  BarChart3,
  CalendarDays,
  Settings,
  Eye,
  FileText,
  Store,
  MessageCircle,
  CheckSquare,
  Globe
} from "lucide-react";
import { Permission } from "@/hooks/use-permissions";
import { SidebarItem } from "./SidebarNavigation";
import { createNavIcon } from "@/utils/createNavIcon";
import { ReactNode } from "react";

export const navigation: {
  name: string;
  items: SidebarItem[];
}[] = [
  {
    name: "DASHBOARD",
    items: [
      { 
        href: "/dashboard", 
        label: "Dashboard", 
        icon: createNavIcon(LayoutDashboard), 
        permission: "access_dashboards" as Permission
      },
      { 
        href: "/dashboard/overview", 
        label: "Analytics", 
        icon: createNavIcon(Eye), 
        permission: "access_dashboards" as Permission
      },
    ]
  },
  {
    name: "GYM MANAGEMENT",
    items: [
      { 
        href: "/members", 
        label: "Members", 
        icon: createNavIcon(Users),
        badge: "328",
        permission: "manage_members" as Permission,
        children: [
          { 
            href: "/members", 
            label: "All Members",
            icon: createNavIcon(Circle),
            permission: "manage_members" as Permission
          },
          { 
            href: "/members/new", 
            label: "Add Member",
            icon: createNavIcon(Circle),
            permission: "register_member" as Permission
          }
        ]
      },
      { 
        href: "/trainers", 
        label: "Trainers", 
        icon: createNavIcon(Dumbbell), 
        permission: "view_all_trainers" as Permission
      },
      { 
        href: "/classes", 
        label: "Classes", 
        icon: createNavIcon(ClipboardList), 
        permission: "trainer_view_classes" as Permission,
      },
      { 
        href: "/fitness-plans", 
        label: "Fitness Plans", 
        icon: createNavIcon(Activity), 
        permission: "trainer_edit_fitness" as Permission,
        children: [
          { 
            href: "/fitness-plans", 
            label: "Overview",
            icon: createNavIcon(Circle),
            permission: "trainer_edit_fitness" as Permission
          },
          { 
            href: "/fitness/workout-plans", 
            label: "Workout Plans",
            icon: createNavIcon(Circle),
            permission: "trainer_edit_fitness" as Permission
          },
          { 
            href: "/fitness/diet-plans", 
            label: "Diet Plans",
            icon: createNavIcon(Circle),
            permission: "trainer_edit_fitness" as Permission
          }
        ]
      },
      { 
        href: "/memberships", 
        label: "Membership Plans", 
        icon: createNavIcon(CreditCard), 
        permission: "member_view_plans" as Permission
      },
      { 
        href: "/finance", 
        label: "Finance", 
        icon: createNavIcon(DollarSign), 
        permission: "view_invoices" as Permission,
        children: [
          { 
            href: "/finance/invoices", 
            label: "Invoices",
            icon: createNavIcon(Circle),
            permission: "view_invoices" as Permission
          },
          { 
            href: "/finance/transactions", 
            label: "Transactions",
            icon: createNavIcon(Circle),
            permission: "manage_payments" as Permission
          }
        ]
      }
    ]
  },
  {
    name: "TASKS & OPERATIONS",
    items: [
      { 
        href: "/trainers/tasks", 
        label: "Task Management", 
        icon: createNavIcon(CheckSquare),
        permission: "access_own_resources" as Permission
      },
      { 
        href: "/attendance", 
        label: "Attendance", 
        icon: createNavIcon(CalendarDays), 
        permission: "view_all_attendance" as Permission
      }
    ]
  },
  {
    name: "INVENTORY & STORE",
    items: [
      { 
        href: "/inventory", 
        label: "Inventory", 
        icon: createNavIcon(Package),
        permission: "access_inventory" as Permission
      },
      { 
        href: "/store", 
        label: "Store", 
        icon: createNavIcon(Store),
        permission: "access_store" as Permission
      }
    ]
  },
  {
    name: "MARKETING",
    items: [
      { 
        href: "/crm/leads", 
        label: "CRM", 
        icon: createNavIcon(UserPlus), 
        permission: "access_crm" as Permission,
        children: [
          { 
            href: "/crm/leads", 
            label: "Leads",
            icon: createNavIcon(Circle), 
            permission: "access_crm" as Permission
          },
          { 
            href: "/crm/funnel", 
            label: "Sales Funnel",
            icon: createNavIcon(Circle),
            permission: "access_crm" as Permission
          },
          { 
            href: "/crm/follow-up", 
            label: "Follow-up",
            icon: createNavIcon(Circle),
            permission: "access_crm" as Permission
          }
        ]
      },
      { 
        href: "/marketing/promo", 
        label: "Promotions", 
        icon: createNavIcon(Gift),
        permission: "access_marketing" as Permission
      },
      { 
        href: "/marketing/referral", 
        label: "Referral Program", 
        icon: createNavIcon(Gift),
        permission: "access_marketing" as Permission
      }
    ]
  },
  {
    name: "COMMUNICATION",
    items: [
      { 
        href: "/communication/announcements", 
        label: "Announcements", 
        icon: createNavIcon(Bell), 
        permission: "access_communication" as Permission
      },
      { 
        href: "/communication/feedback", 
        label: "Feedback", 
        icon: createNavIcon(MessageSquare), 
        permission: "access_communication" as Permission
      },
      { 
        href: "/communication/reminders", 
        label: "Reminders", 
        icon: createNavIcon(Bell), 
        permission: "access_communication" as Permission
      }
    ]
  },
  {
    name: "FRONT PAGES",
    items: [
      { 
        href: "/frontpages", 
        label: "Website", 
        icon: createNavIcon(Globe), 
        permission: "full_system_access" as Permission
      }
    ]
  },
  {
    name: "REPORTS & TOOLS",
    items: [
      { 
        href: "/reports", 
        label: "Reports", 
        icon: createNavIcon(FileText), 
        permission: "access_analytics" as Permission
      },
      { 
        href: "/settings", 
        label: "Settings", 
        icon: createNavIcon(Settings), 
        permission: "access_own_resources" as Permission
      }
    ]
  }
];
