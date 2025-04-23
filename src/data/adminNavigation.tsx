
import { Home, Users, Building2, Calendar, Settings, UserPlus, BadgeCheck, BarChart, ListChecks, ClipboardList, FileText, ShieldAlert, HelpCircle, Contact2, MessageSquare, File, LayoutDashboard, UserCog, Activity, GraduationCap, Presentation, ShoppingCart, Package, LucideIcon } from "lucide-react";
import { Permission } from '@/hooks/use-permissions';
import { NavItem, NavSection } from '@/types/navigation';

// Interface for local use, can be removed since we're importing from navigation.ts
// interface NavSection {
//   title?: string;
//   name: string;
//   items: NavItem[];
// }

// interface NavItem {
//   href: string;
//   label: string;
//   icon?: LucideIcon;
//   external?: boolean;
//   description?: string;
//   permission?: string;
// }

export const adminNavSections: NavSection[] = [
  {
    name: 'Dashboard',
    items: [
      {
        href: "/dashboard",
        label: "Dashboard",
        icon: <LayoutDashboard className="h-4 w-4" />,
        permission: "view_dashboard",
      },
    ],
  },
  {
    name: 'Management',
    title: "Management",
    items: [
      {
        href: "/branches",
        label: "Branches",
        icon: <Building2 className="h-4 w-4" />,
        permission: "view_branch_data",
      },
      {
        href: "/members",
        label: "Members",
        icon: <Users className="h-4 w-4" />,
        permission: "view_member_data",
      },
      {
        href: "/trainers",
        label: "Trainers",
        icon: <UserPlus className="h-4 w-4" />,
        permission: "view_trainer_data",
      },
      {
        href: "/staff",
        label: "Staff",
        icon: <UserCog className="h-4 w-4" />,
        permission: "view_staff_data",
      },
      {
        href: "/roles",
        label: "Roles",
        icon: <ShieldAlert className="h-4 w-4" />,
        permission: "manage_roles",
      },
    ],
  },
  {
    name: 'BookingScheduling',
    title: "Booking & Scheduling",
    items: [
      {
        href: "/classes",
        label: "Classes",
        icon: <Calendar className="h-4 w-4" />,
        permission: "view_classes",
      },
      {
        href: "/appointments",
        label: "Appointments",
        icon: <ListChecks className="h-4 w-4" />,
        permission: "view_appointments",
      },
    ],
  },
  {
    name: 'SalesMarketing',
    title: "Sales & Marketing",
    items: [
      {
        href: "/membership-plans",
        label: "Membership Plans",
        icon: <BadgeCheck className="h-4 w-4" />,
        permission: "view_membership_plans",
      },
      {
        href: "/marketing",
        label: "Marketing Campaigns",
        icon: <Presentation className="h-4 w-4" />,
        permission: "create_marketing_campaigns",
      },
      {
        href: "/sales-reports",
        label: "Sales Reports",
        icon: <BarChart className="h-4 w-4" />,
        permission: "view_sales_reports",
      },
    ],
  },
  {
    name: 'Operations',
    title: "Operations",
    items: [
      {
        href: "/inventory",
        label: "Inventory",
        icon: <Package className="h-4 w-4" />,
        permission: "manage_inventory",
      },
      {
        href: "/pos",
        label: "Point of Sale",
        icon: <ShoppingCart className="h-4 w-4" />,
        permission: "access_pos",
      },
      {
        href: "/attendance",
        label: "Attendance Tracking",
        icon: <Activity className="h-4 w-4" />,
        permission: "track_attendance",
      },
      {
        href: "/forms",
        label: "Forms",
        icon: <FileText className="h-4 w-4" />,
        permission: "manage_forms",
      },
      {
        href: "/resources",
        label: "Resources",
        icon: <File className="h-4 w-4" />,
        permission: "manage_resources",
      },
    ],
  },
  {
    name: 'Communications',
    title: "Communications",
    items: [
      {
        href: "/messaging",
        label: "Messaging",
        icon: <MessageSquare className="h-4 w-4" />,
        permission: "send_messages",
      },
      {
        href: "/support",
        label: "Support Tickets",
        icon: <HelpCircle className="h-4 w-4" />,
        permission: "handle_support_tickets",
      },
      {
        href: "/contact",
        label: "Contact Center",
        icon: <Contact2 className="h-4 w-4" />,
        permission: "handle_support_tickets",
      },
    ],
  },
  {
    name: 'Settings',
    title: "Settings",
    items: [
      {
        href: "/settings",
        label: "General Settings",
        icon: <Settings className="h-4 w-4" />,
        permission: "manage_settings",
      },
      {
        href: "/profile",
        label: "Profile",
        icon: <UserCog className="h-4 w-4" />,
        permission: "view_profile",
      },
    ],
  },
];
