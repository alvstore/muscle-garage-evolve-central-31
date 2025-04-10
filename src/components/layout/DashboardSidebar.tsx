
import React, { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
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
  Home,
  FileText,
  ChevronRight,
  ChevronDown,
  ShoppingCart,
  Briefcase,
  Bookmark,
  GraduationCap,
  Truck,
  Mail,
  Calendar,
  Trello,
  Lock,
  Shield,
  Key
} from "lucide-react";
import { Link, NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import { UserRole } from "@/types";
import Logo from "@/components/Logo";

interface DashboardSidebarProps {
  isSidebarOpen: boolean;
  closeSidebar: () => void;
}

interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
  activeIcon?: React.ReactNode;
  badge?: number | string;
  children?: NavItem[];
  allowedRoles: UserRole[];
}

export default function DashboardSidebar({ isSidebarOpen, closeSidebar }: DashboardSidebarProps) {
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { user, logout } = useAuth();
  const userRole = user?.role as UserRole;
  
  // State to track expanded menu sections
  const [expandedSections, setExpandedSections] = useState<string[]>(['Dashboard']);

  const toggleSection = (sectionName: string) => {
    if (expandedSections.includes(sectionName)) {
      setExpandedSections(expandedSections.filter(name => name !== sectionName));
    } else {
      setExpandedSections([...expandedSections, sectionName]);
    }
  };

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
  const navSections: { name: string; icon: React.ReactNode; items: NavItem[] }[] = [
    {
      name: "Dashboard",
      icon: <LayoutDashboard className="h-5 w-5" />,
      items: [
        { 
          href: "/dashboard", 
          label: "Overview", 
          icon: <Home className="h-5 w-5" />, 
          allowedRoles: ["admin", "staff", "trainer", "member"],
        },
      ],
    },
    {
      name: "E-commerce",
      icon: <ShoppingCart className="h-5 w-5" />,
      items: [
        { 
          href: "/store", 
          label: "Store", 
          icon: <ShoppingBag className="h-5 w-5" />,
          allowedRoles: ["admin", "staff", "member"],
        },
        { 
          href: "/inventory", 
          label: "Inventory", 
          icon: <Package className="h-5 w-5" />,
          allowedRoles: ["admin", "staff"],
        },
        { 
          href: "/marketing/promo", 
          label: "Promotions", 
          icon: <Tag className="h-5 w-5" />,
          allowedRoles: ["admin", "staff"],
        },
        { 
          href: "/marketing/referral", 
          label: "Referral Program", 
          icon: <Gift className="h-5 w-5" />,
          allowedRoles: ["admin", "staff"],
        },
      ]
    },
    {
      name: "Members & Trainers",
      icon: <Users className="h-5 w-5" />,
      items: [
        { 
          href: "/members", 
          label: "Members", 
          icon: <Users className="h-5 w-5" />, 
          allowedRoles: ["admin", "staff", "trainer"],
        },
        { 
          href: "/trainers", 
          label: "Trainers", 
          icon: <Dumbbell className="h-5 w-5" />, 
          allowedRoles: ["admin", "staff"],
        },
        { 
          href: "/attendance", 
          label: "Attendance", 
          icon: <CalendarCheck className="h-5 w-5" />, 
          allowedRoles: ["admin", "staff", "trainer", "member"],
        },
      ],
    },
    {
      name: "Programs",
      icon: <ClipboardList className="h-5 w-5" />,
      items: [
        { 
          href: "/classes", 
          label: "Classes", 
          icon: <ClipboardList className="h-5 w-5" />, 
          allowedRoles: ["admin", "staff", "trainer", "member"],
        },
        { 
          href: "/memberships", 
          label: "Memberships", 
          icon: <CreditCard className="h-5 w-5" />, 
          allowedRoles: ["admin", "staff", "member"],
        },
        { 
          href: "/fitness-plans", 
          label: "Fitness Plans", 
          icon: <ActivityIcon className="h-5 w-5" />, 
          allowedRoles: ["admin", "trainer", "member"],
        },
      ],
    },
    {
      name: "Finance",
      icon: <DollarSign className="h-5 w-5" />,
      items: [
        { 
          href: "/finance/dashboard", 
          label: "Finance Dashboard", 
          icon: <DollarSign className="h-5 w-5" />, 
          allowedRoles: ["admin", "staff"],
        },
        { 
          href: "/finance/invoices", 
          label: "Invoices", 
          icon: <Receipt className="h-5 w-5" />, 
          allowedRoles: ["admin", "staff"],
        },
        { 
          href: "/finance/transactions", 
          label: "Transactions", 
          icon: <ArrowLeftRight className="h-5 w-5" />, 
          allowedRoles: ["admin", "staff"],
        },
      ],
    },
    {
      name: "CRM",
      icon: <Briefcase className="h-5 w-5" />,
      items: [
        { 
          href: "/crm/leads", 
          label: "Leads", 
          icon: <UserPlus className="h-5 w-5" />, 
          allowedRoles: ["admin", "staff"],
        },
        { 
          href: "/crm/funnel", 
          label: "Funnel", 
          icon: <Filter className="h-5 w-5" />, 
          allowedRoles: ["admin", "staff"],
        },
        { 
          href: "/crm/follow-up", 
          label: "Follow-up", 
          icon: <MessageCircle className="h-5 w-5" />, 
          allowedRoles: ["admin", "staff"],
        },
      ],
    },
    {
      name: "Communication",
      icon: <Bell className="h-5 w-5" />,
      items: [
        { 
          href: "/communication/announcements", 
          label: "Announcements", 
          icon: <Bell className="h-5 w-5" />, 
          allowedRoles: ["admin", "staff"],
        },
        { 
          href: "/communication/feedback", 
          label: "Feedback", 
          icon: <MessageSquare className="h-5 w-5" />, 
          allowedRoles: ["admin", "staff", "trainer", "member"],
        },
        { 
          href: "/communication/motivational", 
          label: "Motivational", 
          icon: <Heart className="h-5 w-5" />, 
          allowedRoles: ["admin", "staff", "trainer"],
        },
        { 
          href: "/communication/reminders", 
          label: "Reminders", 
          icon: <AlarmClock className="h-5 w-5" />, 
          allowedRoles: ["admin", "staff"],
        },
      ],
    },
    {
      name: "User Management",
      icon: <User className="h-5 w-5" />,
      items: [
        { 
          href: "/settings/roles", 
          label: "Roles & Permissions", 
          icon: <Shield className="h-5 w-5" />, 
          allowedRoles: ["admin"],
        },
        { 
          href: "/settings/users", 
          label: "User List", 
          icon: <Users className="h-5 w-5" />, 
          allowedRoles: ["admin"],
        },
        { 
          href: "/profile", 
          label: "My Profile", 
          icon: <User className="h-5 w-5" />, 
          allowedRoles: ["admin", "staff", "trainer", "member"],
        },
      ],
    },
    {
      name: "Settings",
      icon: <Settings className="h-5 w-5" />,
      items: [
        { 
          href: "/settings", 
          label: "General Settings", 
          icon: <Settings className="h-5 w-5" />, 
          allowedRoles: ["admin", "staff", "trainer", "member"],
        },
        { 
          href: "/settings/security", 
          label: "Security", 
          icon: <Lock className="h-5 w-5" />, 
          allowedRoles: ["admin", "staff", "trainer", "member"],
        },
        { 
          href: "/settings/api", 
          label: "API Keys", 
          icon: <Key className="h-5 w-5" />, 
          allowedRoles: ["admin"],
        },
      ],
    },
  ];

  return (
    <Sheet open={isSidebarOpen} onOpenChange={closeSidebar}>
      <SheetContent side="left" className="w-64 p-0 bg-[#2c2c44] text-white border-none">
        <div className="flex flex-col h-full">
          <div className="p-4 flex items-center gap-3">
            <Logo variant="white" />
            <h1 className="text-lg font-semibold">Muscle Garage</h1>
          </div>
          
          <div className="flex-1 overflow-y-auto py-2">
            {navSections.map((section, index) => {
              // Filter items based on user role
              const filteredItems = section.items.filter(item => canAccess(item.allowedRoles));
              
              // Only show sections that have at least one accessible item
              if (filteredItems.length === 0) return null;
              
              const isExpanded = expandedSections.includes(section.name);
              
              return (
                <div key={index} className="mb-1">
                  <button
                    onClick={() => toggleSection(section.name)}
                    className="w-full flex items-center justify-between px-4 py-2 text-sm font-medium text-white/80 hover:text-white hover:bg-white/10 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      {section.icon}
                      <span>{section.name}</span>
                    </div>
                    {isExpanded ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </button>
                  
                  {isExpanded && (
                    <div className="mt-1 pl-4">
                      {filteredItems.map((item, itemIndex) => (
                        <SheetClose asChild key={itemIndex}>
                          <NavLink
                            to={item.href}
                            className={({ isActive }) => `
                              flex items-center gap-2 py-2 px-3 text-sm rounded-md my-1 transition-colors
                              ${isActive 
                                ? 'bg-indigo-600 text-white' 
                                : 'text-white/70 hover:text-white hover:bg-white/10'}
                            `}
                          >
                            {item.icon}
                            <span>{item.label}</span>
                            {item.badge && (
                              <span className="ml-auto bg-red-500 text-white text-xs font-medium px-2 py-0.5 rounded-full">
                                {item.badge}
                              </span>
                            )}
                          </NavLink>
                        </SheetClose>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          
          <div className="mt-auto p-4">
            <Separator className="my-2 bg-white/10" />
            <Button
              variant="ghost"
              className="w-full justify-start text-white/70 hover:text-white hover:bg-white/10"
              onClick={handleLogout}
              disabled={isLoggingOut}
            >
              {isLoggingOut ? "Logging out..." : "Logout"}
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
