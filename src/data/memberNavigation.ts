
import { ReactNode } from "react";
import {
  LayoutDashboard,
  Dumbbell,
  FileText,
  ClipboardList,
  CreditCard,
  ShoppingBag,
  Calendar,
  MessageSquare,
  BookOpen,
  BarChart3,
  Settings,
  HelpCircle,
  Activity,
  User,
} from "lucide-react";

export interface NavItem {
  href: string;
  label: string;
  icon?: ReactNode;
  badge?: string;
}

export interface NavSection {
  name: string;
  items: NavItem[];
}

export const memberNavSections: NavSection[] = [
  {
    name: "Overview",
    items: [
      {
        href: "/dashboard",
        label: "Dashboard",
        icon: <LayoutDashboard className="h-5 w-5" />,
      },
      {
        href: "/fitness/progress",
        label: "My Progress",
        icon: <Activity className="h-5 w-5" />,
      },
      {
        href: "/profile",
        label: "My Profile",
        icon: <User className="h-5 w-5" />,
      },
    ],
  },
  {
    name: "Fitness",
    items: [
      {
        href: "/workouts",
        label: "My Workouts",
        icon: <Dumbbell className="h-5 w-5" />,
      },
      {
        href: "/diet-plans",
        label: "Diet Plans",
        icon: <FileText className="h-5 w-5" />,
      },
    ],
  },
  {
    name: "Classes",
    items: [
      {
        href: "/classes",
        label: "Browse Classes",
        icon: <ClipboardList className="h-5 w-5" />,
      },
      {
        href: "/classes/my-bookings",
        label: "My Bookings",
        icon: <Calendar className="h-5 w-5" />,
      },
    ],
  },
  {
    name: "Membership",
    items: [
      {
        href: "/membership",
        label: "Membership Details",
        icon: <CreditCard className="h-5 w-5" />,
      },
      {
        href: "/invoices",
        label: "Invoices & Payments",
        icon: <FileText className="h-5 w-5" />,
      },
    ],
  },
  {
    name: "Shop",
    items: [
      {
        href: "/store",
        label: "Shop Products",
        icon: <ShoppingBag className="h-5 w-5" />,
      },
      {
        href: "/store/orders",
        label: "My Orders",
        icon: <FileText className="h-5 w-5" />,
      },
    ],
  },
  {
    name: "Support",
    items: [
      {
        href: "/feedback",
        label: "Provide Feedback",
        icon: <MessageSquare className="h-5 w-5" />,
      },
      {
        href: "/help",
        label: "Help & Support",
        icon: <HelpCircle className="h-5 w-5" />,
      },
    ],
  },
  {
    name: "Account",
    items: [
      {
        href: "/settings",
        label: "Account Settings",
        icon: <Settings className="h-5 w-5" />,
      },
    ],
  },
];
