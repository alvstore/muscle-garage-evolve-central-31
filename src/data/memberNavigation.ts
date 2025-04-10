
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
import { NavItem } from "@/types/index";

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
      },
      {
        title: "Diet Plans",
        href: "/fitness/diet",
      },
      {
        title: "Progress Tracker",
        href: "/fitness/progress",
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
      },
      {
        title: "My Bookings",
        href: "/classes/my-bookings",
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
      },
      {
        title: "Subscription",
        href: "/payments/subscription",
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
      },
      {
        title: "My Orders",
        href: "/shop/orders",
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
      },
      {
        title: "My Feedback",
        href: "/feedback/history",
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
      },
      {
        title: "Notifications",
        href: "/settings/notifications",
      },
    ],
  },
];
