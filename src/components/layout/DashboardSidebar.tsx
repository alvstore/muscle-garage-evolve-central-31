
import React, { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  LayoutDashboard,
  Users,
  Dumbbell,
  ClipboardList,
  CreditCard,
  Activity as ActivityIcon,
  DollarSign,
  Receipt,
  ArrowLeftRight,
  Package,
  Bell,
  MessageSquare,
  Heart,
  AlarmClock,
  Settings,
  User,
  CalendarCheck,
  UserPlus,
  Filter,
  MessageCircle,
  ShoppingBag,
  Tag,
  Gift,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import { UserRole } from "@/types";

interface DashboardSidebarProps {
  isSidebarOpen: boolean;
  closeSidebar: () => void;
}

export default function DashboardSidebar({ isSidebarOpen, closeSidebar }: DashboardSidebarProps) {
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { user, logout } = useAuth();
  const userRole = user?.role as UserRole;

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  // Check if user has permission to access a feature
  const canAccess = (allowedRoles: UserRole[]): boolean => {
    if (!userRole) return false;
    return allowedRoles.includes(userRole);
  };

  // Define navigation links grouped by sections with role-based permissions
  const navSections = [
    {
      label: "Dashboard",
      links: [
        { href: "/dashboard", label: "Overview", icon: <LayoutDashboard className="h-5 w-5" />, allowedRoles: ["admin", "staff", "trainer", "member"] },
      ],
    },
    {
      label: "Members & Trainers",
      links: [
        { href: "/members", label: "Members", icon: <Users className="h-5 w-5" />, allowedRoles: ["admin", "staff", "trainer"] },
        { href: "/trainers", label: "Trainers", icon: <Dumbbell className="h-5 w-5" />, allowedRoles: ["admin", "staff"] },
        { href: "/attendance", label: "Attendance", icon: <CalendarCheck className="h-5 w-5" />, allowedRoles: ["admin", "staff", "trainer", "member"] },
      ],
    },
    {
      label: "Programs",
      links: [
        { href: "/classes", label: "Classes", icon: <ClipboardList className="h-5 w-5" />, allowedRoles: ["admin", "staff", "trainer", "member"] },
        { href: "/memberships", label: "Memberships", icon: <CreditCard className="h-5 w-5" />, allowedRoles: ["admin", "staff", "member"] },
        { href: "/fitness-plans", label: "Fitness Plans", icon: <ActivityIcon className="h-5 w-5" />, allowedRoles: ["admin", "trainer", "member"] },
      ],
    },
    {
      label: "Finance",
      links: [
        { href: "/finance/dashboard", label: "Finance Dashboard", icon: <DollarSign className="h-5 w-5" />, allowedRoles: ["admin", "staff"] },
        { href: "/finance/invoices", label: "Invoices", icon: <Receipt className="h-5 w-5" />, allowedRoles: ["admin", "staff"] },
        { href: "/finance/transactions", label: "Transactions", icon: <ArrowLeftRight className="h-5 w-5" />, allowedRoles: ["admin", "staff"] },
      ],
    },
    {
      label: "Inventory & Store",
      links: [
        { href: "/inventory", label: "Inventory", icon: <Package className="h-5 w-5" />, allowedRoles: ["admin", "staff"] },
        { href: "/store", label: "Store", icon: <ShoppingBag className="h-5 w-5" />, allowedRoles: ["admin", "staff", "member"] },
      ],
    },
    {
      label: "CRM & Marketing",
      links: [
        { href: "/crm/leads", label: "Leads", icon: <UserPlus className="h-5 w-5" />, allowedRoles: ["admin", "staff"] },
        { href: "/crm/funnel", label: "Funnel", icon: <Filter className="h-5 w-5" />, allowedRoles: ["admin", "staff"] },
        { href: "/crm/follow-up", label: "Follow-up", icon: <MessageCircle className="h-5 w-5" />, allowedRoles: ["admin", "staff"] },
        { href: "/marketing/promo", label: "Promo Codes", icon: <Tag className="h-5 w-5" />, allowedRoles: ["admin", "staff"] },
        { href: "/marketing/referral", label: "Referrals", icon: <Gift className="h-5 w-5" />, allowedRoles: ["admin", "staff"] },
      ],
    },
    {
      label: "Communication",
      links: [
        { href: "/communication/announcements", label: "Announcements", icon: <Bell className="h-5 w-5" />, allowedRoles: ["admin", "staff"] },
        { href: "/communication/feedback", label: "Feedback", icon: <MessageSquare className="h-5 w-5" />, allowedRoles: ["admin", "staff", "trainer", "member"] },
        { href: "/communication/motivational", label: "Motivational Messages", icon: <Heart className="h-5 w-5" />, allowedRoles: ["admin", "staff", "trainer"] },
        { href: "/communication/reminders", label: "Reminders", icon: <AlarmClock className="h-5 w-5" />, allowedRoles: ["admin", "staff"] },
      ],
    },
    {
      label: "Settings",
      links: [
        { href: "/settings", label: "Settings", icon: <Settings className="h-5 w-5" />, allowedRoles: ["admin", "staff", "trainer", "member"] },
        { href: "/profile", label: "Profile", icon: <User className="h-5 w-5" />, allowedRoles: ["admin", "staff", "trainer", "member"] },
      ],
    },
  ];

  return (
    <Sheet open={isSidebarOpen} onOpenChange={closeSidebar}>
      <SheetContent side="left" className="w-64">
        <SheetHeader>
          <SheetTitle>Dashboard Menu</SheetTitle>
          <SheetDescription>
            Navigate through different sections of the dashboard.
          </SheetDescription>
        </SheetHeader>
        <Separator className="my-4" />
        <div className="flex flex-col space-y-6">
          {navSections.map((section, index) => {
            // Filter links based on user role
            const filteredLinks = section.links.filter(link => canAccess(link.allowedRoles as UserRole[]));
            
            // Only show sections that have at least one accessible link
            if (filteredLinks.length === 0) return null;
            
            return (
              <div key={index} className="flex flex-col space-y-2">
                <h4 className="text-sm font-medium text-muted-foreground px-2">
                  {section.label}
                </h4>
                <div className="flex flex-col space-y-1">
                  {filteredLinks.map((link) => (
                    <SheetClose asChild key={link.href}>
                      <Link
                        to={link.href}
                        className="flex items-center space-x-2 py-2 px-4 rounded-md hover:bg-secondary"
                      >
                        {link.icon}
                        <span>{link.label}</span>
                      </Link>
                    </SheetClose>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
        <Separator className="my-4" />
        <Button
          variant="outline"
          className="w-full justify-start"
          onClick={handleLogout}
          disabled={isLoggingOut}
        >
          {isLoggingOut ? "Logging out..." : "Logout"}
        </Button>
      </SheetContent>
    </Sheet>
  );
}
