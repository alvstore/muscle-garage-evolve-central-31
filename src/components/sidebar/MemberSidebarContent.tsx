
import React, { useState } from "react";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { LogOut, LayoutDashboard, UserCircle, Calendar, FileText, CreditCard, Clock, Dumbbell, Utensils } from "lucide-react";
import Logo from "@/components/Logo";
import { useAuth } from "@/hooks/use-auth";
import { useNavigate } from "react-router-dom";
import { ScrollArea } from "@/components/ui/scroll-area";
import { NavSection } from "@/types/navigation";
import NavigationSections from "@/components/navigation/NavigationSections";

interface MemberSidebarContentProps {
  closeSidebar?: () => void;
}

// Define member navigation
const memberNavSections: NavSection[] = [
  {
    name: "Dashboard",
    icon: <LayoutDashboard className="h-4 w-4" />,
    items: [
      { 
        href: "/dashboard", 
        label: "Dashboard", 
        icon: <LayoutDashboard className="h-4 w-4" />,
        permission: "feature_member_dashboard"
      }
    ]
  },
  {
    name: "My Profile",
    icon: <UserCircle className="h-4 w-4" />,
    items: [
      { 
        href: "/profile", 
        label: "Profile", 
        icon: <UserCircle className="h-4 w-4" />,
        permission: "member_view_profile"
      }
    ]
  },
  {
    name: "Fitness",
    icon: <Dumbbell className="h-4 w-4" />,
    items: [
      { 
        href: "/my-plans", 
        label: "My Plans", 
        icon: <FileText className="h-4 w-4" />,
        permission: "member_view_plans"
      },
      { 
        href: "/my-workouts", 
        label: "Workout Plans", 
        icon: <Dumbbell className="h-4 w-4" />,
        permission: "member_view_plans"
      },
      { 
        href: "/my-diet", 
        label: "Diet Plans", 
        icon: <Utensils className="h-4 w-4" />,
        permission: "member_view_plans"
      }
    ]
  },
  {
    name: "Classes",
    icon: <Calendar className="h-4 w-4" />,
    items: [
      { 
        href: "/bookings", 
        label: "My Bookings", 
        icon: <Calendar className="h-4 w-4" />,
        permission: "member_book_classes"
      }
    ]
  },
  {
    name: "Payments",
    icon: <CreditCard className="h-4 w-4" />,
    items: [
      { 
        href: "/payments", 
        label: "Payment History", 
        icon: <CreditCard className="h-4 w-4" />,
        permission: "member_view_invoices"
      }
    ]
  },
  {
    name: "Attendance",
    icon: <Clock className="h-4 w-4" />,
    items: [
      { 
        href: "/attendance", 
        label: "My Attendance", 
        icon: <Clock className="h-4 w-4" />,
        permission: "member_view_attendance"
      }
    ]
  }
];

const MemberSidebarContent: React.FC<MemberSidebarContentProps> = ({ closeSidebar }) => {
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { logout } = useAuth();
  
  const [expandedSections, setExpandedSections] = useState<string[]>(['Dashboard', 'Fitness']);

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

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 flex items-center gap-3">
        <div className="bg-white p-1 rounded-md">
          <Logo variant="default" />
        </div>
        <h1 className="text-lg font-semibold">Muscle Garage</h1>
      </div>
      
      <ScrollArea className="flex-1 h-[calc(100vh-130px)]">
        <NavigationSections
          sections={memberNavSections}
          expandedSections={expandedSections}
          toggleSection={toggleSection}
          onLinkClick={closeSidebar}
        />
      </ScrollArea>
      
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
  );
};

export default MemberSidebarContent;
