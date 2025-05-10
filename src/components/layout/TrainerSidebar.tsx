
import React from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { LogOut, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import { ScrollArea } from "@/components/ui/scroll-area";
import Logo from "@/components/Logo";
import NavigationSections from "@/components/navigation/NavigationSections";
import { NavSection } from "@/types/navigation";

interface TrainerSidebarProps {
  isSidebarOpen: boolean;
  closeSidebar: () => void;
}

const TrainerSidebar = ({ isSidebarOpen, closeSidebar }: TrainerSidebarProps) => {
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = React.useState(false);
  const { logout } = useAuth();
  const [expandedSections, setExpandedSections] = React.useState<string[]>(['Dashboard']);

  // Trainer navigation sections
  const sections: NavSection[] = [
    {
      name: 'Dashboard',
      items: [
        {
          label: 'Overview',
          href: '/dashboard',
          icon: 'LayoutDashboard',
          permission: 'access_dashboards'
        }
      ]
    },
    {
      name: 'Members',
      items: [
        {
          label: 'My Members',
          href: '/members',
          icon: 'Users',
          permission: 'view_members'
        }
      ]
    },
    {
      name: 'Fitness Plans',
      items: [
        {
          label: 'Workout Plans',
          href: '/fitness/workout-plans',
          icon: 'Dumbbell',
          permission: 'access_dashboards'
        },
        {
          label: 'Diet Plans',
          href: '/fitness/diet-plans',
          icon: 'Apple',
          permission: 'access_dashboards'
        }
      ]
    },
    {
      name: 'Classes',
      items: [
        {
          label: 'My Classes',
          href: '/classes',
          icon: 'Calendar',
          permission: 'view_classes'
        }
      ]
    }
  ];

  const toggleSection = (sectionName: string) => {
    setExpandedSections(prev => {
      if (prev.includes(sectionName)) {
        return prev.filter(name => name !== sectionName);
      } else {
        return [...prev, sectionName];
      }
    });
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
    <div className="fixed inset-y-0 left-0 z-40 w-64 bg-sidebar text-sidebar-foreground
                    transform transition-transform duration-300 ease-in-out md:translate-x-0
                    flex flex-col h-full">
      {/* Mobile Close Button */}
      <div className="md:hidden absolute top-4 right-4">
        <Button 
          variant="ghost" 
          size="icon" 
          className="text-sidebar-foreground hover:bg-sidebar-accent/50"
          onClick={closeSidebar}
        >
          <X className="h-5 w-5" />
        </Button>
      </div>

      <div className="p-4">
        <div className="flex flex-col gap-3">
          <div className="p-1 rounded-md px-[27px] py-[8px] mx-0 my-0 bg-slate-50 overflow-hidden">
            <div className="w-36 truncate">
              <Logo variant="default" />
            </div>
          </div>
        </div>
      </div>
      
      <ScrollArea className="flex-1 overflow-y-auto py-2 max-h-[calc(100vh-200px)]">
        <NavigationSections 
          sections={sections} 
          expandedSections={expandedSections} 
          toggleSection={toggleSection} 
          onLinkClick={closeSidebar}
        />
      </ScrollArea>
      
      <div className="mt-auto p-4">
        <Separator className="my-2 bg-sidebar-accent" />
        <Button 
          variant="ghost" 
          className="w-full justify-start text-sidebar-foreground/80 hover:text-sidebar-foreground hover:bg-sidebar-accent/50" 
          onClick={handleLogout} 
          disabled={isLoggingOut}
        >
          <LogOut className="mr-2 h-5 w-5" />
          {isLoggingOut ? "Logging out..." : "Logout"}
        </Button>
      </div>
    </div>
  );
};

export default TrainerSidebar;
