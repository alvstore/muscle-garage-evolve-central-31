
import {
  BarChart3,
  Users,
  CalendarDays,
  CreditCard,
  Settings,
  Dumbbell,
  UserCircle,
  Briefcase,
  Clock,
  PieChart,
  Building2,
  Contact,
  Mail,
  MessageCircle,
  Share2,
  HelpCircle,
  Radio,
  Globe,
  Bell,
} from "lucide-react";
import { NavSection } from "@/types/navigation";

export const adminNavSections: NavSection[] = [
  {
    name: "Dashboard",
    items: [
      {
        href: "/",
        label: "Analytics",
        icon: <BarChart3 className="h-5 w-5" />,
        permission: "view_dashboard",
      },
      {
        href: "/attendance",
        label: "Attendance",
        icon: <Clock className="h-5 w-5" />,
        permission: "view_attendance",
      }
    ],
  },
  {
    name: "Members",
    items: [
      {
        href: "/members",
        label: "Member List",
        icon: <Users className="h-5 w-5" />,
        permission: "view_members",
      },
      {
        href: "/members/add",
        label: "Add Member",
        icon: <UserCircle className="h-5 w-5" />,
        permission: "create_members",
      },
      {
        href: "/memberships",
        label: "Membership Plans",
        icon: <Briefcase className="h-5 w-5" />,
        permission: "view_memberships",
      },
    ],
  },
  {
    name: "Classes",
    items: [
      {
        href: "/classes",
        label: "Class Schedule",
        icon: <CalendarDays className="h-5 w-5" />,
        permission: "view_classes",
      },
      {
        href: "/classes/types",
        label: "Class Types",
        icon: <Dumbbell className="h-5 w-5" />,
        permission: "view_class_types",
      },
    ],
  },
  {
    name: "Finance",
    items: [
      {
        href: "/finance",
        label: "Overview",
        icon: <PieChart className="h-5 w-5" />,
        permission: "view_finance",
      },
      {
        href: "/finance/transactions",
        label: "Transactions",
        icon: <CreditCard className="h-5 w-5" />,
        permission: "view_transactions",
      },
      {
        href: "/finance/invoices",
        label: "Invoices",
        icon: <CreditCard className="h-5 w-5" />,
        permission: "view_invoices",
      },
    ],
  },
  {
    name: "Staff",
    items: [
      {
        href: "/staff",
        label: "Staff List",
        icon: <Users className="h-5 w-5" />,
        permission: "view_staff",
      },
      {
        href: "/trainers",
        label: "Trainers",
        icon: <Dumbbell className="h-5 w-5" />,
        permission: "view_trainers",
      },
    ],
  },
  {
    name: "Communication",
    items: [
      {
        href: "/communication/email",
        label: "Email",
        icon: <Mail className="h-5 w-5" />,
        permission: "view_communications",
      },
      {
        href: "/communication/sms",
        label: "SMS",
        icon: <MessageCircle className="h-5 w-5" />,
        permission: "view_communications",
      },
      {
        href: "/communication/notifications",
        label: "Notifications",
        icon: <Bell className="h-5 w-5" />,
        permission: "view_communications",
      },
    ],
  },
  {
    name: "Website",
    items: [
      {
        href: "/website",
        label: "Front Pages",
        icon: <Globe className="h-5 w-5" />,
        permission: "manage_website",
      },
    ],
  },
  {
    name: "Settings",
    items: [
      {
        href: "/settings",
        label: "System Settings",
        icon: <Settings className="h-5 w-5" />,
        permission: "manage_settings",
        children: [
          {
            href: "/settings/branches",
            label: "Branch Management",
            permission: "manage_branches",
          },
          {
            href: "/settings/integrations",
            label: "Integrations",
            permission: "manage_integrations",
          },
        ],
      },
      {
        href: "/help",
        label: "Help Center",
        icon: <HelpCircle className="h-5 w-5" />,
        permission: "view_help",
      },
    ],
  },
];
