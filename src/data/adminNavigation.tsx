
import React from 'react';
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
  Gift,
  BarChart3,
  CalendarDays,
  Settings,
  Eye,
  FileText,
  Store,
  Globe,
  UserPlus as UserPlusIcon
} from "lucide-react";
import { NavSection } from '@/types/navigation';
import { Permission } from '@/hooks/use-permissions';

export const adminNavSections: NavSection[] = [
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
            permission: "manage_members" as Permission
          },
          { 
            href: "/members/new", 
            label: "Add Member", 
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
            permission: "view_invoices" as Permission
          },
          { 
            href: "/finance/transactions", 
            label: "Transactions", 
            permission: "manage_payments" as Permission
          },
        ]
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
        permission: "access_inventory" as Permission,
      },
      { 
        href: "/store", 
        label: "Store", 
        icon: <Store className="h-5 w-5" />,
        permission: "access_store" as Permission,
      }
    ]
  },
  {
    name: "MARKETING",
    items: [
      { 
        href: "/crm/leads", 
        label: "CRM", 
        icon: <UserPlusIcon className="h-5 w-5" />, 
        permission: "access_crm" as Permission,
        children: [
          { 
            href: "/crm/leads", 
            label: "Leads", 
            permission: "access_crm" as Permission
          },
          { 
            href: "/crm/funnel", 
            label: "Sales Funnel", 
            permission: "access_crm" as Permission
          },
          { 
            href: "/crm/follow-up", 
            label: "Follow-up", 
            permission: "access_crm" as Permission
          }
        ]
      },
      { 
        href: "/marketing/promo", 
        label: "Promotions", 
        icon: <Gift className="h-5 w-5" />,
        permission: "access_marketing" as Permission,
      },
      { 
        href: "/marketing/referral", 
        label: "Referral Program", 
        icon: <Gift className="h-5 w-5" />,
        permission: "access_marketing" as Permission,
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
        href: "/attendance", 
        label: "Attendance", 
        icon: <CalendarDays className="h-5 w-5" />, 
        permission: "view_all_attendance" as Permission
      },
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
