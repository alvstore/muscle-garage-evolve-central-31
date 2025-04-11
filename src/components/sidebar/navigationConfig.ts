
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
        icon: <LayoutDashboard className="h-5 w-5" />, 
        permission: "access_dashboards" as Permission
      },
      { 
        href: "/dashboard/overview", 
        label: "Analytics", 
        icon: <Eye className="h-5 w-5" />, 
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
        icon: <Users className="h-5 w-5" />,
        badge: "328",
        permission: "manage_members" as Permission,
        children: [
          { 
            href: "/members", 
            label: "All Members",
            icon: <Circle className="h-2 w-2" />,
            permission: "manage_members" as Permission
          },
          { 
            href: "/members/new", 
            label: "Add Member",
            icon: <Circle className="h-2 w-2" />,
            permission: "register_member" as Permission
          }
        ]
      },
      { 
        href: "/trainers", 
        label: "Trainers", 
        icon: <Dumbbell className="h-5 w-5" />, 
        permission: "view_all_trainers" as Permission
      },
      { 
        href: "/classes", 
        label: "Classes", 
        icon: <ClipboardList className="h-5 w-5" />, 
        permission: "trainer_view_classes" as Permission,
      },
      { 
        href: "/fitness-plans", 
        label: "Fitness Plans", 
        icon: <Activity className="h-5 w-5" />, 
        permission: "trainer_edit_fitness" as Permission,
        children: [
          { 
            href: "/fitness-plans", 
            label: "Overview",
            icon: <Circle className="h-2 w-2" />,
            permission: "trainer_edit_fitness" as Permission
          },
          { 
            href: "/fitness/workout-plans", 
            label: "Workout Plans",
            icon: <Circle className="h-2 w-2" />,
            permission: "trainer_edit_fitness" as Permission
          },
          { 
            href: "/fitness/diet-plans", 
            label: "Diet Plans",
            icon: <Circle className="h-2 w-2" />,
            permission: "trainer_edit_fitness" as Permission
          }
        ]
      },
      { 
        href: "/memberships", 
        label: "Membership Plans", 
        icon: <CreditCard className="h-5 w-5" />, 
        permission: "member_view_plans" as Permission
      },
      { 
        href: "/finance", 
        label: "Finance", 
        icon: <DollarSign className="h-5 w-5" />, 
        permission: "view_invoices" as Permission,
        children: [
          { 
            href: "/finance/invoices", 
            label: "Invoices",
            icon: <Circle className="h-2 w-2" />,
            permission: "view_invoices" as Permission
          },
          { 
            href: "/finance/transactions", 
            label: "Transactions",
            icon: <Circle className="h-2 w-2" />,
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
        icon: <CheckSquare className="h-5 w-5" />,
        permission: "access_own_resources" as Permission
      },
      { 
        href: "/attendance", 
        label: "Attendance", 
        icon: <CalendarDays className="h-5 w-5" />, 
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
        icon: <Package className="h-5 w-5" />,
        permission: "access_inventory" as Permission
      },
      { 
        href: "/store", 
        label: "Store", 
        icon: <Store className="h-5 w-5" />,
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
        icon: <UserPlus className="h-5 w-5" />, 
        permission: "access_crm" as Permission,
        children: [
          { 
            href: "/crm/leads", 
            label: "Leads",
            icon: <Circle className="h-2 w-2" />, 
            permission: "access_crm" as Permission
          },
          { 
            href: "/crm/funnel", 
            label: "Sales Funnel",
            icon: <Circle className="h-2 w-2" />,
            permission: "access_crm" as Permission
          },
          { 
            href: "/crm/follow-up", 
            label: "Follow-up",
            icon: <Circle className="h-2 w-2" />,
            permission: "access_crm" as Permission
          }
        ]
      },
      { 
        href: "/marketing/promo", 
        label: "Promotions", 
        icon: <Gift className="h-5 w-5" />,
        permission: "access_marketing" as Permission
      },
      { 
        href: "/marketing/referral", 
        label: "Referral Program", 
        icon: <Gift className="h-5 w-5" />,
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
        icon: <Bell className="h-5 w-5" />, 
        permission: "access_communication" as Permission
      },
      { 
        href: "/communication/feedback", 
        label: "Feedback", 
        icon: <MessageSquare className="h-5 w-5" />, 
        permission: "access_communication" as Permission
      },
      { 
        href: "/communication/reminders", 
        label: "Reminders", 
        icon: <Bell className="h-5 w-5" />, 
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
        icon: <Globe className="h-5 w-5" />, 
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
        icon: <FileText className="h-5 w-5" />, 
        permission: "access_analytics" as Permission
      },
      { 
        href: "/settings", 
        label: "Settings", 
        icon: <Settings className="h-5 w-5" />, 
        permission: "access_own_resources" as Permission
      }
    ]
  }
];
