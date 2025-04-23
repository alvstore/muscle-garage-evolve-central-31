import { Home, Users, Building2, Calendar, Settings, UserPlus, BadgeCheck, BarChart, ListChecks, ClipboardList, FileText, ShieldAlert, HelpCircle, Contact2, MessageSquare, File, LayoutDashboard, UserCog, Activity, GraduationCap, Presentation, ShoppingCart, Package, LucideIcon } from "lucide-react";
import { Permission } from '@/hooks/use-permissions';

interface NavSection {
  title?: string;
  name: string; // Changed from optional to required
  items: NavItem[];
}

interface NavItem {
  href: string;
  label: string;
  icon?: LucideIcon;
  external?: boolean;
  description?: string;
  permission?: string;
}

export const adminNavSections: NavSection[] = [
  {
    name: 'Dashboard',
    items: [
      {
        href: "/dashboard",
        label: "Dashboard",
        icon: LayoutDashboard,
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
        icon: Building2,
        permission: "view_branch_data",
      },
      {
        href: "/members",
        label: "Members",
        icon: Users,
        permission: "view_member_data",
      },
      {
        href: "/trainers",
        label: "Trainers",
        icon: UserPlus,
        permission: "view_trainer_data",
      },
      {
        href: "/staff",
        label: "Staff",
        icon: UserCog,
        permission: "view_staff_data",
      },
      {
        href: "/roles",
        label: "Roles",
        icon: ShieldAlert,
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
        icon: Calendar,
        permission: "view_classes",
      },
      {
        href: "/appointments",
        label: "Appointments",
        icon: ListChecks,
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
        icon: BadgeCheck,
        permission: "view_membership_plans",
      },
      {
        href: "/marketing",
        label: "Marketing Campaigns",
        icon: Presentation,
        permission: "create_marketing_campaigns",
      },
      {
        href: "/sales-reports",
        label: "Sales Reports",
        icon: BarChart,
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
        icon: Package,
        permission: "manage_inventory",
      },
      {
        href: "/pos",
        label: "Point of Sale",
        icon: ShoppingCart,
        permission: "access_pos",
      },
      {
        href: "/attendance",
        label: "Attendance Tracking",
        icon: Activity,
        permission: "track_attendance",
      },
      {
        href: "/forms",
        label: "Forms",
        icon: FileText,
        permission: "manage_forms",
      },
      {
        href: "/resources",
        label: "Resources",
        icon: File,
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
        icon: MessageSquare,
        permission: "send_messages",
      },
      {
        href: "/support",
        label: "Support Tickets",
        icon: HelpCircle,
        permission: "handle_support_tickets",
      },
      {
        href: "/contact",
        label: "Contact Center",
        icon: Contact2,
        permission: "manage_contacts",
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
        icon: Settings,
        permission: "manage_settings",
      },
      {
        href: "/profile",
        label: "Profile",
        icon: UserCog,
        permission: "view_profile",
      },
    ],
  },
];
