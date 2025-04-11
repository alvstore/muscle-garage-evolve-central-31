import { ReactNode } from "react";
import { createIconFromComponent } from "@/utils/createNavIcon";
import {
  Home,
  User,
  Calendar,
  Activity,
  DollarSign,
  CreditCard,
  ShoppingBag,
  Bell,
  TrendingUp,
  Utensils
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
    icon: createIconFromComponent(Home),
    items: [
      { 
        href: "/dashboard", 
        label: "Overview", 
        icon: createIconFromComponent(Home)
      },
    ],
  },
  {
    name: "My Profile",
    icon: createIconFromComponent(User),
    items: [
      { 
        href: "/members/profile", 
        label: "Profile", 
        icon: createIconFromComponent(User)
      },
    ],
  },
  {
    name: "Fitness & Classes",
    icon: createIconFromComponent(Activity),
    items: [
      { 
        href: "/classes", 
        label: "Book Classes", 
        icon: createIconFromComponent(Calendar)
      },
      { 
        href: "/attendance", 
        label: "Attendance", 
        icon: createIconFromComponent(Activity)
      },
      { 
        href: "/fitness/progress", 
        label: "Progress Tracker", 
        icon: createIconFromComponent(TrendingUp)
      },
      { 
        href: "/fitness/workout-plans", 
        label: "Workout Plans", 
        icon: createIconFromComponent(Activity)
      },
      { 
        href: "/fitness/diet-plans", 
        label: "Diet Plan", 
        icon: createIconFromComponent(Utensils)
      },
    ],
  },
  {
    name: "Finance",
    icon: createIconFromComponent(DollarSign),
    items: [
      { 
        href: "/finance/invoices", 
        label: "Invoices", 
        icon: createIconFromComponent(DollarSign)
      },
      { 
        href: "/membership", 
        label: "Membership", 
        icon: createIconFromComponent(CreditCard)
      },
    ],
  },
  {
    name: "Store",
    icon: createIconFromComponent(ShoppingBag),
    items: [
      { 
        href: "/store", 
        label: "Shop", 
        icon: createIconFromComponent(ShoppingBag)
      },
    ],
  },
  {
    name: "Communication",
    icon: createIconFromComponent(Bell),
    items: [
      { 
        href: "/communication/feedback", 
        label: "Feedback", 
        icon: createIconFromComponent(Bell)
      },
      { 
        href: "/communication/announcements", 
        label: "Announcements", 
        icon: createIconFromComponent(Bell)
      },
    ],
  },
];
