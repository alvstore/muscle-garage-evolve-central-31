
import { ReactNode } from "react";
import { createNavIcon } from "@/utils/createNavIcon";
import { NavItem, NavSection, Permission } from "@/types/navigation";

export const memberNavSections: NavSection[] = [
  {
    name: "Dashboard",
    items: [
      { 
        href: "/dashboard", 
        label: "Overview", 
        icon: createNavIcon("Home"),
        permission: "feature_member_dashboard" 
      },
    ],
  },
  {
    name: "My Profile",
    items: [
      { 
        href: "/members/profile", 
        label: "Profile", 
        icon: createNavIcon("User"),
        permission: "member_view_profile" 
      },
    ],
  },
  {
    name: "Fitness & Classes",
    items: [
      { 
        href: "/classes", 
        label: "Book Classes", 
        icon: createNavIcon("Calendar"),
        permission: "member_book_classes"
      },
      { 
        href: "/attendance", 
        label: "Attendance", 
        icon: createNavIcon("Activity"),
        permission: "member_view_attendance"
      },
      { 
        href: "/fitness/progress", 
        label: "Progress Tracker", 
        icon: createNavIcon("TrendingUp"),
        permission: "member_view_profile"
      },
      { 
        href: "/fitness/workout-plans", 
        label: "Workout Plans", 
        icon: createNavIcon("Activity"),
        permission: "member_view_plans"
      },
      { 
        href: "/fitness/diet", 
        label: "Diet Plan", 
        icon: createNavIcon("Utensils"),
        permission: "member_view_plans"
      },
    ],
  },
  {
    name: "Finance",
    items: [
      { 
        href: "/finance/invoices", 
        label: "Invoices", 
        icon: createNavIcon("FileText"),
        permission: "member_view_invoices"
      },
      { 
        href: "/membership", 
        label: "Membership", 
        icon: createNavIcon("CreditCard"),
        permission: "member_view_plans"
      },
    ],
  },
  {
    name: "Store",
    items: [
      { 
        href: "/store", 
        label: "Shop", 
        icon: createNavIcon("ShoppingBag"),
        permission: "access_store"
      },
    ],
  },
  {
    name: "Communication",
    items: [
      { 
        href: "/communication/feedback", 
        label: "Feedback", 
        icon: createNavIcon("MessageCircle"),
        permission: "access_communication"
      },
      { 
        href: "/communication/announcements", 
        label: "Announcements", 
        icon: createNavIcon("Bell"),
        permission: "access_communication"
      },
    ],
  },
];
