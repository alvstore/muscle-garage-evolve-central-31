
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
  CircleDollarSign
} from "lucide-react";

export const adminNavSections: NavSection[] = [
  {
    name: "Dashboard",
    items: [
      {
        href: "/dashboard",
        label: "Analytics Dashboard",
        permission: "view_dashboard",
        icon: <BarChart className="h-5 w-5" />
      },
      {
        href: "/dashboard/realtime",
        label: "Real-Time Dashboard",
        permission: "view_dashboard",
        icon: <LayoutDashboard className="h-5 w-5" />
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
      }
    ]
  },
  {
    name: "Staff",
    items: [
      {
        href: "/staff",
        label: "Staff List",
        permission: "manage_staff",
        icon: <Users className="h-5 w-5" />
      },
      {
        href: "/trainers",
        label: "Trainers",
        permission: "manage_trainers",
        icon: <UserRound className="h-5 w-5" />
      }
    ]
  },
  {
    name: "CRM & Leads",
    items: [
      {
        href: "/crm",
        label: "Lead Management",
        permission: "manage_members",
        icon: <Users className="h-5 w-5" />
      },
      {
        href: "/crm/funnel",
        label: "Sales Funnel",
        permission: "manage_members",
        icon: <BarChart className="h-5 w-5" />
      },
      {
        href: "/crm/follow-up",
        label: "Follow-Up",
        permission: "manage_members",
        icon: <MessageSquare className="h-5 w-5" />
      }
    ]
  },
  {
    name: "Marketing",
    items: [
      {
        href: "/marketing/promo",
        label: "Promotions",
        permission: "manage_members",
        icon: <FileText className="h-5 w-5" />
      },
      {
        href: "/marketing/referral",
        label: "Referral Programs",
        permission: "manage_members",
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
        href: "/fitness/plans",
        label: "Fitness Plans Management",
        permission: "trainer_edit_fitness",
        icon: <Dumbbell className="h-5 w-5" />
      },
      {
        href: "/fitness/progress",
        label: "Member Progress",
        permission: "trainer_view_members",
        icon: <BarChart className="h-5 w-5" />
      }
    ]
  },
  {
    name: "Communication",
    items: [
      {
        href: "/announcements",
        label: "Announcements",
        permission: "access_communication",
        icon: <MessageSquare className="h-5 w-5" />
      },
      {
        href: "/feedback",
        label: "Feedback Management",
        permission: "access_communication",
        icon: <MessageSquare className="h-5 w-5" />
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
        href: "/reports",
        label: "Reports & Analytics",
        permission: "view_dashboard",
        icon: <BarChart className="h-5 w-5" />
      }
    ]
  },
  {
    name: "Finance",
    items: [
      {
        href: "/finance/dashboard",
        label: "Finance Dashboard",
        permission: "manage_finances",
        icon: <CircleDollarSign className="h-5 w-5" />
      },
      {
        href: "/finance/transactions",
        label: "Transactions",
        permission: "manage_finances",
        icon: <FileText className="h-5 w-5" />
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
        icon: <Settings className="h-5 w-5" />
      }
    ]
  }
];
