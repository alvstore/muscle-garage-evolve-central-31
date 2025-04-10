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
  User,
  Calendar,
  CreditCard,
  Activity,
  DollarSign,
  ShoppingBag,
  FileText,
  Bell,
  Settings,
  LogOut,
  ChevronRight,
  ChevronDown,
  Home,
} from "lucide-react";
import { Link, NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import Logo from "@/components/Logo";
import { RoutePermissionGuard } from "@/components/auth/PermissionGuard";

interface MemberSidebarProps {
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
}

export default function MemberSidebar({ isSidebarOpen, closeSidebar }: MemberSidebarProps) {
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { user, logout } = useAuth();
  
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

  const navSections: { name: string; icon: React.ReactNode; items: NavItem[] }[] = [
    {
      name: "Dashboard",
      icon: <Home className="h-5 w-5" />,
      items: [
        { 
          href: "/dashboard", 
          label: "Overview", 
          icon: <Home className="h-5 w-5" />
        },
      ],
    },
    {
      name: "My Profile",
      icon: <User className="h-5 w-5" />,
      items: [
        { 
          href: "/members/profile", 
          label: "Profile", 
          icon: <User className="h-5 w-5" />
        },
      ],
    },
    {
      name: "Fitness & Classes",
      icon: <Activity className="h-5 w-5" />,
      items: [
        { 
          href: "/classes", 
          label: "Book Classes", 
          icon: <Calendar className="h-5 w-5" />
        },
        { 
          href: "/attendance", 
          label: "Attendance", 
          icon: <Activity className="h-5 w-5" />
        },
      ],
    },
    {
      name: "Finance",
      icon: <DollarSign className="h-5 w-5" />,
      items: [
        { 
          href: "/finance/invoices", 
          label: "Invoices", 
          icon: <FileText className="h-5 w-5" />
        },
        { 
          href: "/membership", 
          label: "Membership", 
          icon: <CreditCard className="h-5 w-5" />
        },
      ],
    },
    {
      name: "Store",
      icon: <ShoppingBag className="h-5 w-5" />,
      items: [
        { 
          href: "/store", 
          label: "Shop", 
          icon: <ShoppingBag className="h-5 w-5" />
        },
      ],
    },
    {
      name: "Communication",
      icon: <Bell className="h-5 w-5" />,
      items: [
        { 
          href: "/communication/feedback", 
          label: "Feedback", 
          icon: <Bell className="h-5 w-5" />
        },
        { 
          href: "/communication/announcements", 
          label: "Announcements", 
          icon: <Bell className="h-5 w-5" />
        },
      ],
    },
    {
      name: "Settings",
      icon: <Settings className="h-5 w-5" />,
      items: [
        { 
          href: "/settings", 
          label: "Account Settings", 
          icon: <Settings className="h-5 w-5" />
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
          
          <div className="flex-1 overflow-y-auto py-2 max-h-[calc(100vh-200px)]">
            {navSections.map((section, index) => {
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
                      {section.items.map((item, itemIndex) => (
                        <SheetClose key={itemIndex} asChild>
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
              <LogOut className="mr-2 h-4 w-4" />
              {isLoggingOut ? "Logging out..." : "Logout"}
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
