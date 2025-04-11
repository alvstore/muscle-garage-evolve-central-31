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
  Globe,
  LucideIcon
} from "lucide-react";
import { Permission } from "@/hooks/use-permissions";
import { SidebarItem } from "./SidebarNavigation";
import { createIconFromComponent } from "@/utils/createNavIcon";
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
        icon: createIconFromComponent(LayoutDashboard), 
        permission: "access_dashboards" as Permission
      },
      { 
        href: "/dashboard/overview", 
        label: "Analytics", 
        icon: createIconFromComponent(Eye), 
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
        icon: createIconFromComponent(Users),
        badge: "328",
        permission: "manage_members" as Permission,
        children: [
          { 
            href: "/members", 
            label: "All Members",
            icon: createIconFromComponent(Circle),
            permission: "manage_members" as Permission
          },
          { 
            href: "/members/new", 
            label: "Add Member",
            icon: createIconFromComponent(Circle),
            permission: "register_member" as Permission
          }
        ]
      },
      { 
        href: "/trainers", 
        label: "Trainers", 
        icon: createIconFromComponent(Dumbbell), 
        permission: "view_all_trainers" as Permission
      },
      { 
        href: "/classes", 
        label: "Classes", 
        icon: createIconFromComponent(ClipboardList), 
        permission: "trainer_view_classes" as Permission,
      },
      { 
        href: "/fitness-plans", 
        label: "Fitness Plans", 
        icon: createIconFromComponent(Activity), 
        permission: "trainer_edit_fitness" as Permission,
        children: [
          { 
            href: "/fitness-plans", 
            label: "Overview",
            icon: createIconFromComponent(Circle),
            permission: "trainer_edit_fitness" as Permission
          },
          { 
            href: "/fitness/workout-plans", 
            label: "Workout Plans",
            icon: createIconFromComponent(Circle),
            permission: "trainer_edit_fitness" as Permission
          },
          { 
            href: "/fitness/diet-plans", 
            label: "Diet Plans",
            icon: createIconFromComponent(Circle),
            permission: "trainer_edit_fitness" as Permission
          }
        ]
      },
      { 
        href: "/memberships", 
        label: "Membership Plans", 
        icon: createIconFromComponent(CreditCard), 
        permission: "member_view_plans" as Permission
      },
      { 
        href: "/finance", 
        label: "Finance", 
        icon: createIconFromComponent(DollarSign), 
        permission: "view_invoices" as Permission,
        children: [
          { 
            href: "/finance/invoices", 
            label: "Invoices",
            icon: createIconFromComponent(Circle),
            permission: "view_invoices" as Permission
          },
          { 
            href: "/finance/transactions", 
            label: "Transactions",
            icon: createIconFromComponent(Circle),
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
        icon: createIconFromComponent(CheckSquare),
        permission: "access_own_resources" as Permission
      },
      { 
        href: "/attendance", 
        label: "Attendance", 
        icon: createIconFromComponent(CalendarDays), 
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
        icon: createIconFromComponent(Package),
        permission: "access_inventory" as Permission
      },
      { 
        href: "/store", 
        label: "Store", 
        icon: createIconFromComponent(Store),
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
        icon: createIconFromComponent(UserPlus), 
        permission: "access_crm" as Permission,
        children: [
          { 
            href: "/crm/leads", 
            label: "Leads",
            icon: createIconFromComponent(Circle), 
            permission: "access_crm" as Permission
          },
          { 
            href: "/crm/funnel", 
            label: "Sales Funnel",
            icon: createIconFromComponent(Circle),
            permission: "access_crm" as Permission
          },
          { 
            href: "/crm/follow-up", 
            label: "Follow-up",
            icon: createIconFromComponent(Circle),
            permission: "access_crm" as Permission
          }
        ]
      },
      { 
        href: "/marketing/promo", 
        label: "Promotions", 
        icon: createIconFromComponent(Gift),
        permission: "access_marketing" as Permission
      },
      { 
        href: "/marketing/referral", 
        label: "Referral Program", 
        icon: createIconFromComponent(Gift),
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
        icon: createIconFromComponent(Bell), 
        permission: "access_communication" as Permission
      },
      { 
        href: "/communication/feedback", 
        label: "Feedback", 
        icon: createIconFromComponent(MessageSquare), 
        permission: "access_communication" as Permission
      },
      { 
        href: "/communication/reminders", 
        label: "Reminders", 
        icon: createIconFromComponent(Bell), 
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
        icon: createIconFromComponent(Globe), 
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
        icon: createIconFromComponent(FileText), 
        permission: "access_analytics" as Permission
      },
      { 
        href: "/settings", 
        label: "Settings", 
        icon: createIconFromComponent(Settings), 
        permission: "access_own_resources" as Permission
      }
    ]
  }
];
