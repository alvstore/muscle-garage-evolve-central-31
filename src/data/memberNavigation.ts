
import { ReactNode } from "react";
import { createNavIcon, IconName } from "@/utils/createNavIcon";

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
    icon: createNavIcon("Home"),
    items: [
      { 
        href: "/dashboard", 
        label: "Overview", 
        icon: createNavIcon("Home")
      },
    ],
  },
  {
    name: "My Profile",
    icon: createNavIcon("User"),
    items: [
      { 
        href: "/members/profile", 
        label: "Profile", 
        icon: createNavIcon("User")
      },
    ],
  },
  {
    name: "Fitness & Classes",
    icon: createNavIcon("Activity"),
    items: [
      { 
        href: "/classes", 
        label: "Book Classes", 
        icon: createNavIcon("Calendar")
      },
      { 
        href: "/attendance", 
        label: "Attendance", 
        icon: createNavIcon("Activity")
      },
      { 
        href: "/fitness/progress", 
        label: "Progress Tracker", 
        icon: createNavIcon("TrendingUp")
      },
      { 
        href: "/fitness/diet", 
        label: "Diet Plan", 
        icon: createNavIcon("Utensils")
      },
    ],
  },
  {
    name: "Finance",
    icon: createNavIcon("DollarSign"),
    items: [
      { 
        href: "/finance/invoices", 
        label: "Invoices", 
        icon: createNavIcon("FileText")
      },
      { 
        href: "/membership", 
        label: "Membership", 
        icon: createNavIcon("CreditCard")
      },
    ],
  },
  {
    name: "Store",
    icon: createNavIcon("ShoppingBag"),
    items: [
      { 
        href: "/store", 
        label: "Shop", 
        icon: createNavIcon("ShoppingBag")
      },
    ],
  },
  {
    name: "Communication",
    icon: createNavIcon("Bell"),
    items: [
      { 
        href: "/communication/feedback", 
        label: "Feedback", 
        icon: createNavIcon("Bell")
      },
      { 
        href: "/communication/announcements", 
        label: "Announcements", 
        icon: createNavIcon("Bell")
      },
    ],
  },
];
