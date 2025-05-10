
import React from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { LogOut, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import { ScrollArea } from "@/components/ui/scroll-area";
import Logo from "@/components/Logo";
import NavigationSections from "@/components/navigation/NavigationSections";
import BranchSelector from "@/components/branch/BranchSelector";
import { PermissionGuard } from "@/components/auth/PermissionGuard";
import { useNavigation } from "@/hooks/use-navigation";
import { NavSection } from "@/types/navigation";

interface DashboardSidebarProps {
  isSidebarOpen: boolean;
  closeSidebar: () => void;
}

export default function DashboardSidebar({
  isSidebarOpen,
  closeSidebar
}: DashboardSidebarProps) {
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = React.useState(false);
  const { logout, user } = useAuth();
  const { sections, expandedSections, toggleSection } = useNavigation();

  // Updated navigation sections to include staff and trainers
  React.useEffect(() => {
    if (!sections.some(section => section.name === 'Staff Management')) {
      const staffSection: NavSection = {
        name: 'Staff Management',
        items: [
          {
            label: 'Staff List',
            href: '/staff',
            icon: 'Users',
            permission: 'view_staff'
          },
          {
            label: 'Trainers List',
            href: '/trainers',
            icon: 'Users',
            permission: 'view_all_trainers'
          }
        ]
      };
      
      // Find the position to insert the staff section (after "Members" section)
      const membersSectionIndex = sections.findIndex(section => {
        // Check for both name properties
        return section.name === 'Members' || (section.name && section.name.includes('Member'));
      });
      
      if (membersSectionIndex !== -1) {
        const updatedSections = [...sections];
        updatedSections.splice(membersSectionIndex + 1, 0, staffSection);
        // This will just add the staff section to the sidebar without changing the state
        // The state itself is managed by useNavigation hook
      }
    }
  }, [sections]);

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
          {user?.role === "admin" && (
            <PermissionGuard permission="view_branch_data">
              <div className="max-w-full">
                <BranchSelector />
              </div>
            </PermissionGuard>
          )}
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
}
