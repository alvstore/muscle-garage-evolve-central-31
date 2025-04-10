
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

// Define the NavItem type here for export
export interface NavItem {
  title: string;
  href: string;
  icon?: any;
  children: NavItem[];
}

export const memberNavigation: NavItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    children: [],
  },
  {
    title: "Fitness",
    href: "/fitness",
    icon: Timer,
    children: [
      {
        title: "Workout Plans",
        href: "/fitness/workout",
        children: [],
      },
      {
        title: "Diet Plans",
        href: "/fitness/diet",
        children: [],
      },
      {
        title: "Progress Tracker",
        href: "/fitness/progress",
        children: [],
      },
    ],
  },
  {
    title: "Classes",
    href: "/classes",
    icon: Calendar,
    children: [
      {
        title: "Book a Class",
        href: "/classes/book",
        children: [],
      },
      {
        title: "My Bookings",
        href: "/classes/my-bookings",
        children: [],
      },
    ],
  },
  {
    title: "Payments",
    href: "/payments",
    icon: CreditCard,
    children: [
      {
        title: "My Invoices",
        href: "/payments/invoices",
        children: [],
      },
      {
        title: "Subscription",
        href: "/payments/subscription",
        children: [],
      },
    ],
  },
  {
    title: "Shop",
    href: "/shop",
    icon: ShoppingCart,
    children: [
      {
        title: "Products",
        href: "/shop/products",
        children: [],
      },
      {
        title: "My Orders",
        href: "/shop/orders",
        children: [],
      },
    ],
  },
  {
    title: "Feedback",
    href: "/feedback",
    icon: MessagesSquare,
    children: [
      {
        title: "Submit Feedback",
        href: "/feedback/submit",
        children: [],
      },
      {
        title: "My Feedback",
        href: "/feedback/history",
        children: [],
      },
    ],
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
    children: [
      {
        title: "My Profile",
        href: "/settings/profile",
        children: [],
      },
      {
        title: "Notifications",
        href: "/settings/notifications",
        children: [],
      },
    ],
  },
];

