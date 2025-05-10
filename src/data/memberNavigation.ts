
import { Permission } from "@/hooks/use-permissions";
import { createNavIcon } from "@/utils/createNavIcon";
import { NavItem, NavSection } from "@/types/navigation";

// Helper function to safely cast permission strings to Permission type
const asPermission = (p: string): Permission => p as Permission;

export const memberNavSections: NavSection[] = [
  {
    name: "Dashboard",
    items: [
      { 
        href: "/dashboard", 
        label: "Overview", 
        icon: createNavIcon("Home"),
        permission: asPermission("feature_member_dashboard")
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
        permission: asPermission("member_view_profile")
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
        permission: asPermission("member_book_classes")
      },
      { 
        href: "/attendance", 
        label: "Attendance", 
        icon: createNavIcon("Activity"),
        permission: asPermission("member_view_attendance")
      },
      { 
        href: "/fitness/progress", 
        label: "Progress Tracker", 
        icon: createNavIcon("TrendingUp"),
        permission: asPermission("member_view_profile")
      },
      { 
        href: "/fitness/workout-plans", 
        label: "Workout Plans", 
        icon: createNavIcon("Activity"),
        permission: asPermission("member_view_plans")
      },
      { 
        href: "/fitness/diet", 
        label: "Diet Plan", 
        icon: createNavIcon("Utensils"),
        permission: asPermission("member_view_plans")
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
        permission: asPermission("member_view_invoices")
      },
      { 
        href: "/membership", 
        label: "Membership", 
        icon: createNavIcon("CreditCard"),
        permission: asPermission("member_view_plans")
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
        permission: asPermission("access_store")
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
        permission: asPermission("access_communication")
      },
      { 
        href: "/communication/announcements", 
        label: "Announcements", 
        icon: createNavIcon("Bell"),
        permission: asPermission("access_communication")
      },
    ],
  },
];
