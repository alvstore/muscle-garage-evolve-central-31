
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import Logo from "@/components/Logo";
import { memberNavSections } from "@/data/memberNavigation";
import { useAuth } from "@/hooks/use-auth";
import { ScrollArea } from "@/components/ui/scroll-area";
import NavigationSections from "@/components/navigation/NavigationSections";

export interface MemberSidebarContentProps {
  closeSidebar?: () => void;
  onLinkClick?: () => void;
}

const MemberSidebarContent: React.FC<MemberSidebarContentProps> = ({
  closeSidebar,
  onLinkClick
}) => {
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
