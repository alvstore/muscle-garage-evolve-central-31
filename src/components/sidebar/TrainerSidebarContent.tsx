
import React, { useState } from "react";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import Logo from "@/components/Logo";
import { trainerNavSections } from "@/data/trainerNavigation";
import { useAuth } from "@/hooks/use-auth";
import { useNavigate } from "react-router-dom";
import { ScrollArea } from "@/components/ui/scroll-area";
import NavigationSections from "@/components/navigation/NavigationSections";
import { NavSection } from "@/types/navigation";

interface TrainerSidebarContentProps {
  closeSidebar?: () => void;
}

const TrainerSidebarContent: React.FC<TrainerSidebarContentProps> = ({ closeSidebar }) => {
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { logout } = useAuth();
  
  const [expandedSections, setExpandedSections] = useState<string[]>(['Dashboard']);

  // Convert trainerNavSections to match NavSection interface
  const navSections: NavSection[] = trainerNavSections.map(section => ({
    name: section.name,
    items: section.links.map(link => ({
      href: link.href,
      label: link.title,
      icon: link.icon,
      permission: 'read' // Default permission
    }))
  }));

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
          sections={navSections}
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

export default TrainerSidebarContent;
