
import React, { useState } from "react";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { ChevronLeft, LogOut } from "lucide-react";
import Logo from "@/components/Logo";
import { trainerNavSections } from "@/data/trainerNavigation";
import SidebarNavSection from "./SidebarNavSection";
import { useAuth } from "@/hooks/use-auth";
import { useNavigate } from "react-router-dom";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface TrainerSidebarContentProps {
  isCollapsed?: boolean;
  toggleCollapse?: () => void;
}

const TrainerSidebarContent: React.FC<TrainerSidebarContentProps> = ({ 
  isCollapsed = false,
  toggleCollapse 
}) => {
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { logout } = useAuth();
  
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

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 flex items-center gap-3 justify-between border-b border-white/10">
        <div className={`flex items-center gap-3 ${isCollapsed ? 'justify-center w-full' : ''}`}>
          <Logo variant="white" />
          {!isCollapsed && <h1 className="text-lg font-semibold">Muscle Garage</h1>}
        </div>
        {toggleCollapse && (
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleCollapse}
            className="text-white/70 hover:text-white hover:bg-white/10"
          >
            <ChevronLeft className={`h-5 w-5 transition-transform duration-300 ${isCollapsed ? 'rotate-180' : ''}`} />
          </Button>
        )}
      </div>
      
      <ScrollArea className="flex-1 h-[calc(100vh-130px)]">
        <div className="py-2 px-2">
          {trainerNavSections.map((section, index) => (
            <div key={index}>
              {isCollapsed ? (
                <TooltipProvider delayDuration={200}>
                  <div className="flex flex-col items-center py-2">
                    {section.items.map((item, idx) => (
                      <Tooltip key={idx}>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="w-10 h-10 mb-1 rounded-full text-white/70 hover:text-white hover:bg-white/10"
                            onClick={() => navigate(item.href)}
                          >
                            {item.icon}
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent side="right">
                          <p>{item.label}</p>
                        </TooltipContent>
                      </Tooltip>
                    ))}
                  </div>
                </TooltipProvider>
              ) : (
                <SidebarNavSection
                  section={section}
                  isExpanded={expandedSections.includes(section.name)}
                  onToggle={() => toggleSection(section.name)}
                />
              )}
            </div>
          ))}
        </div>
      </ScrollArea>
      
      <div className="mt-auto p-4">
        <Separator className="my-2 bg-white/10" />
        <Button
          variant="ghost"
          className={`w-full justify-${isCollapsed ? 'center' : 'start'} text-white/70 hover:text-white hover:bg-white/10`}
          onClick={handleLogout}
          disabled={isLoggingOut}
        >
          <LogOut className={`${isCollapsed ? '' : 'mr-2'} h-4 w-4`} />
          {!isCollapsed && (isLoggingOut ? "Logging out..." : "Logout")}
        </Button>
      </div>
    </div>
  );
};

export default TrainerSidebarContent;
