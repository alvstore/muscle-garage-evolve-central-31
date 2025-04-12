
import React, { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  Dumbbell,
  ClipboardList,
  CreditCard,
  Activity,
  DollarSign,
  Receipt,
  Package,
  Bell,
  MessageSquare,
  Gift,
  LogOut,
  Circle,
  BarChart3,
  CalendarDays,
  Settings,
  Eye,
  FileText,
  Store,
  ChevronDown,
  ChevronRight,
  Globe,
  UserPlus as UserPlusIcon
} from "lucide-react";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import { usePermissions, Permission } from "@/hooks/use-permissions";
import { RoutePermissionGuard } from "@/components/auth/PermissionGuard";
import { Badge } from "@/components/ui/badge";
import Logo from "@/components/Logo";

interface DashboardSidebarProps {
  isSidebarOpen: boolean;
  closeSidebar: () => void;
}

export default function DashboardSidebar({ isSidebarOpen, closeSidebar }: DashboardSidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { user, logout } = useAuth();
  const { can } = usePermissions();
  
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

  // Define the navigation structure
  const navigation = [
    {
      name: "DASHBOARD",
      items: [
        { 
          href: "/dashboard", 
          label: "Dashboard", 
          icon: <LayoutDashboard className="h-5 w-5" />, 
          permission: "access_dashboards" as Permission
        },
        { 
          href: "/dashboard/overview", 
          label: "Analytics", 
          icon: <Eye className="h-5 w-5" />, 
          permission: "access_dashboards" as Permission
        },
      ]
    },
    {
      name: "GYM MANAGEMENT",
      items: [
        { 
          href: "/members", 
          label: "Members", 
          icon: <Users className="h-5 w-5" />,
          badge: "328",
          permission: "manage_members" as Permission,
          children: [
            { 
              href: "/members", 
              label: "All Members", 
              permission: "manage_members" as Permission
            },
            { 
              href: "/members/new", 
              label: "Add Member", 
              permission: "register_member" as Permission
            }
          ]
        },
        { 
          href: "/trainers", 
          label: "Trainers", 
          icon: <Dumbbell className="h-5 w-5" />, 
          permission: "view_all_trainers" as Permission
        },
        { 
          href: "/classes", 
          label: "Classes", 
          icon: <ClipboardList className="h-5 w-5" />, 
          permission: "trainer_view_classes" as Permission,
        },
        { 
          href: "/fitness-plans", 
          label: "Fitness Plans", 
          icon: <Activity className="h-5 w-5" />, 
          permission: "trainer_edit_fitness" as Permission,
        },
        { 
          href: "/memberships", 
          label: "Membership Plans", 
          icon: <CreditCard className="h-5 w-5" />, 
          permission: "member_view_plans" as Permission
        },
        { 
          href: "/finance", 
          label: "Finance", 
          icon: <DollarSign className="h-5 w-5" />, 
          permission: "view_invoices" as Permission,
          children: [
            { 
              href: "/finance/invoices", 
              label: "Invoices", 
              permission: "view_invoices" as Permission
            },
            { 
              href: "/finance/transactions", 
              label: "Transactions", 
              permission: "manage_payments" as Permission
            },
          ]
        },
      ]
    },
    {
      name: "INVENTORY & STORE",
      items: [
        { 
          href: "/inventory", 
          label: "Inventory", 
          icon: <Package className="h-5 w-5" />,
          permission: "access_inventory" as Permission,
        },
        { 
          href: "/store", 
          label: "Store", 
          icon: <Store className="h-5 w-5" />,
          permission: "access_store" as Permission,
        }
      ]
    },
    {
      name: "MARKETING",
      items: [
        { 
          href: "/crm/leads", 
          label: "CRM", 
          icon: <UserPlusIcon className="h-5 w-5" />, 
          permission: "access_crm" as Permission,
          children: [
            { 
              href: "/crm/leads", 
              label: "Leads", 
              permission: "access_crm" as Permission
            },
            { 
              href: "/crm/funnel", 
              label: "Sales Funnel", 
              permission: "access_crm" as Permission
            },
            { 
              href: "/crm/follow-up", 
              label: "Follow-up", 
              permission: "access_crm" as Permission
            }
          ]
        },
        { 
          href: "/marketing/promo", 
          label: "Promotions", 
          icon: <Gift className="h-5 w-5" />,
          permission: "access_marketing" as Permission,
        },
        { 
          href: "/marketing/referral", 
          label: "Referral Program", 
          icon: <Gift className="h-5 w-5" />,
          permission: "access_marketing" as Permission,
        }
      ]
    },
    {
      name: "COMMUNICATION",
      items: [
        { 
          href: "/communication/announcements", 
          label: "Announcements", 
          icon: <Bell className="h-5 w-5" />, 
          permission: "access_communication" as Permission
        },
        { 
          href: "/communication/feedback", 
          label: "Feedback", 
          icon: <MessageSquare className="h-5 w-5" />, 
          permission: "access_communication" as Permission
        },
        { 
          href: "/communication/reminders", 
          label: "Reminders", 
          icon: <Bell className="h-5 w-5" />, 
          permission: "access_communication" as Permission
        }
      ]
    },
    {
      name: "FRONT PAGES",
      items: [
        { 
          href: "/frontpages", 
          label: "Website", 
          icon: <Globe className="h-5 w-5" />, 
          permission: "full_system_access" as Permission
        }
      ]
    },
    {
      name: "REPORTS & TOOLS",
      items: [
        { 
          href: "/attendance", 
          label: "Attendance", 
          icon: <CalendarDays className="h-5 w-5" />, 
          permission: "view_all_attendance" as Permission
        },
        { 
          href: "/reports", 
          label: "Reports", 
          icon: <FileText className="h-5 w-5" />, 
          permission: "access_analytics" as Permission
        },
        { 
          href: "/settings", 
          label: "Settings", 
          icon: <Settings className="h-5 w-5" />, 
          permission: "access_own_resources" as Permission
        }
      ]
    }
  ];
  
  // Filter navigation items based on user permissions
  const filteredNavigation = navigation.map(category => {
    const filteredItems = category.items.filter(item => {
      if (item.children && item.children.length > 0) {
        const accessibleChildren = item.children.filter(child => can(child.permission));
        return accessibleChildren.length > 0 || can(item.permission);
      }
      return can(item.permission);
    });
    
    return {
      ...category,
      items: filteredItems
    };
  }).filter(category => category.items.length > 0);

  // Check if a route is active (including child routes)
  const isRouteActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  return (
    <Sheet open={isSidebarOpen} onOpenChange={closeSidebar}>
      <SheetContent side="left" className="w-64 p-0 border-none overflow-hidden">
        <div className="flex flex-col h-full bg-gradient-to-br from-indigo-950 to-blue-900 text-white">
          <div className="p-4 flex items-center gap-3 border-b border-indigo-800">
            <div className="bg-white p-1 rounded-md">
              <Logo variant="default" />
            </div>
            <h1 className="text-xl font-semibold text-white">Muscle Garage</h1>
          </div>
          
          {/* Apply max-height and overflow-y-auto to enable scrolling */}
          <div className="flex-1 overflow-y-auto py-2 max-h-[calc(100vh-200px)]">
            {filteredNavigation.map((category, categoryIndex) => (
              <div key={categoryIndex} className="mb-4">
                {category.name && (
                  <div className="px-4 py-2 text-xs font-semibold text-indigo-300 tracking-wider">
                    {category.name}
                  </div>
                )}
                
                <div className="space-y-1">
                  {category.items.map((item, itemIndex) => {
                    const hasChildren = item.children && item.children.length > 0;
                    const filteredChildren = hasChildren 
                      ? item.children!.filter(child => can(child.permission))
                      : [];
                    const showChildren = hasChildren && filteredChildren.length > 0;
                    const isExpanded = expandedSections.includes(item.label);
                    const isActive = isRouteActive(item.href);
                    
                    return (
                      <RoutePermissionGuard 
                        key={itemIndex} 
                        permission={item.permission}
                      >
                        <div className="mb-1">
                          <button
                            onClick={() => showChildren ? toggleSection(item.label) : navigate(item.href)}
                            className={cn(
                              "w-full flex items-center justify-between px-4 py-2 text-sm font-medium transition-colors",
                              isActive 
                                ? "bg-indigo-800/70 text-white before:absolute before:left-0 before:h-full before:w-1 before:bg-white" 
                                : "text-indigo-100 hover:bg-indigo-800/50 hover:text-white",
                              "relative"
                            )}
                          >
                            <div className="flex items-center gap-2">
                              {item.icon}
                              <span>{item.label}</span>
                            </div>
                            <div className="flex items-center">
                              {item.badge && (
                                <Badge variant="default" className="mr-2 bg-red-500 hover:bg-red-600">
                                  {item.badge}
                                </Badge>
                              )}
                              {showChildren && (
                                isExpanded ? (
                                  <ChevronDown className="h-4 w-4" />
                                ) : (
                                  <ChevronRight className="h-4 w-4" />
                                )
                              )}
                            </div>
                          </button>
                          
                          {showChildren && isExpanded && (
                            <div className="mt-1 py-1 bg-indigo-900/50">
                              {filteredChildren.map((child, childIndex) => (
                                <RoutePermissionGuard 
                                  key={childIndex} 
                                  permission={child.permission}
                                >
                                  <NavLink
                                    to={child.href}
                                    className={({ isActive }) => cn(
                                      "flex items-center gap-2 py-2 px-10 text-sm my-1 transition-colors",
                                      isActive 
                                        ? "text-white font-medium bg-indigo-800/30" 
                                        : "text-indigo-200 hover:text-white hover:bg-indigo-800/20"
                                    )}
                                    onClick={closeSidebar}
                                  >
                                    <Circle className="h-2 w-2" />
                                    <span>{child.label}</span>
                                  </NavLink>
                                </RoutePermissionGuard>
                              ))}
                            </div>
                          )}
                        </div>
                      </RoutePermissionGuard>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-auto p-4">
            <Separator className="my-2 bg-indigo-800" />
            <Button
              variant="ghost"
              className="w-full justify-start text-indigo-200 hover:text-white hover:bg-indigo-800/50"
              onClick={handleLogout}
              disabled={isLoggingOut}
            >
              <LogOut className="mr-2 h-5 w-5" />
              {isLoggingOut ? "Logging out..." : "Logout"}
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
