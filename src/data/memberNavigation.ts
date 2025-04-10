
import { ReactNode } from "react";
import {
  User,
  Calendar,
  CreditCard,
  Activity,
  DollarSign,
  ShoppingBag,
  FileText,
  Bell,
  Settings,
  Home
} from "lucide-react";

export interface NavItem {
  href: string;
  label: string;
  icon: ReactNode;
  activeIcon?: ReactNode;
  badge?: number | string;
  children?: NavItem[];
}

export interface NavSection {
  name: string;
  icon: ReactNode;
  items: NavItem[];
}

export const memberNavSections: NavSection[] = [
  {
    name: "Dashboard",
    icon: <Home className="h-5 w-5" />,
    items: [
      { 
        href: "/dashboard", 
        label: "Overview", 
        icon: <Home className="h-5 w-5" />
      },
    ],
  },
  {
    name: "My Profile",
    icon: <User className="h-5 w-5" />,
    items: [
      { 
        href: "/members/profile", 
        label: "Profile", 
        icon: <User className="h-5 w-5" />
      },
    ],
  },
  {
    name: "Fitness & Classes",
    icon: <Activity className="h-5 w-5" />,
    items: [
      { 
        href: "/classes", 
        label: "Book Classes", 
        icon: <Calendar className="h-5 w-5" />
      },
      { 
        href: "/attendance", 
        label: "Attendance", 
        icon: <Activity className="h-5 w-5" />
      },
    ],
  },
  {
    name: "Finance",
    icon: <DollarSign className="h-5 w-5" />,
    items: [
      { 
        href: "/finance/invoices", 
        label: "Invoices", 
        icon: <FileText className="h-5 w-5" />
      },
      { 
        href: "/membership", 
        label: "Membership", 
        icon: <CreditCard className="h-5 w-5" />
      },
    ],
  },
  {
    name: "Store",
    icon: <ShoppingBag className="h-5 w-5" />,
    items: [
      { 
        href: "/store", 
        label: "Shop", 
        icon: <ShoppingBag className="h-5 w-5" />
      },
    ],
  },
  {
    name: "Communication",
    icon: <Bell className="h-5 w-5" />,
    items: [
      { 
        href: "/communication/feedback", 
        label: "Feedback", 
        icon: <Bell className="h-5 w-5" />
      },
      { 
        href: "/communication/announcements", 
        label: "Announcements", 
        icon: <Bell className="h-5 w-5" />
      },
    ],
  },
  {
    name: "Settings",
    icon: <Settings className="h-5 w-5" />,
    items: [
      { 
        href: "/settings", 
        label: "Account Settings", 
        icon: <Settings className="h-5 w-5" />
      },
    ],
  },
];
