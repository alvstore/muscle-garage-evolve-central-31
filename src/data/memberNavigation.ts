
import { 
  BarChart3, 
  Calendar, 
  CreditCard, 
  FileText, 
  Home, 
  LayoutDashboard, 
  MessagesSquare, 
  Settings, 
  ShoppingCart, 
  Timer, 
  Users
} from "lucide-react";
import React from "react";

// Define the NavItem type here for export
export interface NavItem {
  title: string;
  href: string;
  icon?: React.ReactNode;
  children: NavItem[];
  label?: string;
  badge?: string;
}

export interface NavSection {
  title: string;
  items: NavItem[];
  name: string; // Made required to match component usage
}

export const memberNavSections: NavSection[] = [
  {
    title: "Overview",
    name: "Overview",
    items: [
      {
        title: "Dashboard",
        href: "/dashboard",
        icon: <LayoutDashboard className="h-4 w-4" />,
        label: "Dashboard",
        children: [],
      }
    ]
  },
  {
    title: "Fitness",
    name: "Fitness",
    items: [
      {
        title: "Fitness",
        href: "/fitness",
        icon: <Timer className="h-4 w-4" />,
        label: "Fitness",
        children: [
          {
            title: "Workout Plans",
            href: "/fitness/workout",
            label: "Workout Plans",
            children: [],
          },
          {
            title: "Diet Plans",
            href: "/fitness/diet",
            label: "Diet Plans",
            children: [],
          },
          {
            title: "Progress Tracker",
            href: "/fitness/progress",
            label: "Progress Tracker",
            children: [],
          },
        ],
      }
    ]
  },
  {
    title: "Services",
    name: "Services",
    items: [
      {
        title: "Classes",
        href: "/classes",
        icon: <Calendar className="h-4 w-4" />,
        label: "Classes",
        children: [
          {
            title: "Book a Class",
            href: "/classes/book",
            label: "Book a Class",
            children: [],
          },
          {
            title: "My Bookings",
            href: "/classes/my-bookings",
            label: "My Bookings",
            children: [],
          },
        ],
      },
      {
        title: "Payments",
        href: "/payments",
        icon: <CreditCard className="h-4 w-4" />,
        label: "Payments",
        children: [
          {
            title: "My Invoices",
            href: "/payments/invoices",
            label: "My Invoices",
            children: [],
          },
          {
            title: "Subscription",
            href: "/payments/subscription",
            label: "Subscription",
            children: [],
          },
        ],
      },
      {
        title: "Shop",
        href: "/shop",
        icon: <ShoppingCart className="h-4 w-4" />,
        label: "Shop",
        children: [
          {
            title: "Products",
            href: "/shop/products",
            label: "Products",
            children: [],
          },
          {
            title: "My Orders",
            href: "/shop/orders",
            label: "My Orders",
            children: [],
          },
        ],
      }
    ]
  },
  {
    title: "User",
    name: "User",
    items: [
      {
        title: "Feedback",
        href: "/feedback",
        icon: <MessagesSquare className="h-4 w-4" />,
        label: "Feedback",
        children: [
          {
            title: "Submit Feedback",
            href: "/feedback/submit",
            label: "Submit Feedback",
            children: [],
          },
          {
            title: "My Feedback",
            href: "/feedback/history",
            label: "My Feedback",
            children: [],
          },
        ],
      },
      {
        title: "Settings",
        href: "/settings",
        icon: <Settings className="h-4 w-4" />,
        label: "Settings",
        children: [
          {
            title: "My Profile",
            href: "/settings/profile",
            label: "My Profile",
            children: [],
          },
          {
            title: "Notifications",
            href: "/settings/notifications",
            label: "Notifications",
            children: [],
          },
        ],
      }
    ]
  }
];

export const memberNavigation: NavItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: <LayoutDashboard className="h-4 w-4" />,
    label: "Dashboard",
    children: [],
  },
  {
    title: "Fitness",
    href: "/fitness",
    icon: <Timer className="h-4 w-4" />,
    label: "Fitness",
    children: [
      {
        title: "Workout Plans",
        href: "/fitness/workout",
        label: "Workout Plans",
        children: [],
      },
      {
        title: "Diet Plans",
        href: "/fitness/diet",
        label: "Diet Plans",
        children: [],
      },
      {
        title: "Progress Tracker",
        href: "/fitness/progress",
        label: "Progress Tracker",
        children: [],
      },
    ],
  },
  {
    title: "Classes",
    href: "/classes",
    icon: <Calendar className="h-4 w-4" />,
    label: "Classes",
    children: [
      {
        title: "Book a Class",
        href: "/classes/book",
        label: "Book a Class",
        children: [],
      },
      {
        title: "My Bookings",
        href: "/classes/my-bookings",
        label: "My Bookings",
        children: [],
      },
    ],
  },
  {
    title: "Payments",
    href: "/payments",
    icon: <CreditCard className="h-4 w-4" />,
    label: "Payments",
    children: [
      {
        title: "My Invoices",
        href: "/payments/invoices",
        label: "My Invoices",
        children: [],
      },
      {
        title: "Subscription",
        href: "/payments/subscription",
        label: "Subscription",
        children: [],
      },
    ],
  },
  {
    title: "Shop",
    href: "/shop",
    icon: <ShoppingCart className="h-4 w-4" />,
    label: "Shop",
    children: [
      {
        title: "Products",
        href: "/shop/products",
        label: "Products",
        children: [],
      },
      {
        title: "My Orders",
        href: "/shop/orders",
        label: "My Orders",
        children: [],
      },
    ],
  },
  {
    title: "Feedback",
    href: "/feedback",
    icon: <MessagesSquare className="h-4 w-4" />,
    label: "Feedback",
    children: [
      {
        title: "Submit Feedback",
        href: "/feedback/submit",
        label: "Submit Feedback",
        children: [],
      },
      {
        title: "My Feedback",
        href: "/feedback/history",
        label: "My Feedback",
        children: [],
      },
    ],
  },
  {
    title: "Settings",
    href: "/settings",
    icon: <Settings className="h-4 w-4" />,
    label: "Settings",
    children: [
      {
        title: "My Profile",
        href: "/settings/profile",
        label: "My Profile",
        children: [],
      },
      {
        title: "Notifications",
        href: "/settings/notifications",
        label: "Notifications",
        children: [],
      },
    ],
  },
];
