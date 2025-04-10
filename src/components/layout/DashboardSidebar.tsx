import React, { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
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
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

interface DashboardSidebarProps {
  isSidebarOpen: boolean;
  closeSidebar: () => void;
}

export default function DashboardSidebar({ isSidebarOpen, closeSidebar }: DashboardSidebarProps) {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

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

  // Define navigation links grouped by sections
  const navSections = [
    {
      label: "Dashboard",
      links: [
        { href: "/dashboard", label: "Overview", icon: <LayoutDashboard className="h-5 w-5" /> },
      ],
    },
    {
      label: "Members & Trainers",
      links: [
        { href: "/members", label: "Members", icon: <Users className="h-5 w-5" /> },
        { href: "/trainers", label: "Trainers", icon: <Dumbbell className="h-5 w-5" /> },
        { href: "/attendance", label: "Attendance", icon: <CalendarCheck className="h-5 w-5" /> },
      ],
    },
    {
      label: "Programs",
      links: [
        { href: "/classes", label: "Classes", icon: <ClipboardList className="h-5 w-5" /> },
        { href: "/memberships", label: "Memberships", icon: <CreditCard className="h-5 w-5" /> },
        { href: "/fitness-plans", label: "Fitness Plans", icon: <ActivityIcon className="h-5 w-5" /> },
      ],
    },
    {
      label: "Finance",
      links: [
        { href: "/finance/dashboard", label: "Finance Dashboard", icon: <DollarSign className="h-5 w-5" /> },
        { href: "/finance/invoices", label: "Invoices", icon: <Receipt className="h-5 w-5" /> },
        { href: "/finance/transactions", label: "Transactions", icon: <ArrowLeftRight className="h-5 w-5" /> },
      ],
    },
    {
      label: "Inventory",
      links: [
        { href: "/inventory", label: "Inventory", icon: <Package className="h-5 w-5" /> },
      ],
    },
    {
      label: "Communication",
      links: [
        { href: "/communication/announcements", label: "Announcements", icon: <Bell className="h-5 w-5" /> },
        { href: "/communication/feedback", label: "Feedback", icon: <MessageSquare className="h-5 w-5" /> },
        { href: "/communication/motivational", label: "Motivational Messages", icon: <Heart className="h-5 w-5" /> },
        { href: "/communication/reminders", label: "Reminders", icon: <AlarmClock className="h-5 w-5" /> },
      ],
    },
    {
      label: "Settings",
      links: [
        { href: "/settings", label: "Settings", icon: <Settings className="h-5 w-5" /> },
        { href: "/profile", label: "Profile", icon: <User className="h-5 w-5" /> },
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
          {navSections.map((section, index) => (
            <div key={index} className="flex flex-col space-y-2">
              <h4 className="text-sm font-medium text-muted-foreground px-2">
                {section.label}
              </h4>
              <div className="flex flex-col space-y-1">
                {section.links.map((link) => (
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
          ))}
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
