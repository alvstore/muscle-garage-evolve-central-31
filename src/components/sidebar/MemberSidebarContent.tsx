import React, { useState } from "react";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import Logo from "@/components/Logo";
import { memberNavSections } from "@/data/memberNavigation";
import { useAuth } from "@/hooks/use-auth";
import { useNavigate } from "react-router-dom";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SidebarHeader, SidebarContent, SidebarFooter } from "@/components/ui/sidebar";
import SidebarNavSection from "./SidebarNavSection";
interface MemberSidebarContentProps {
  onLinkClick?: () => void;
}
const MemberSidebarContent: React.FC<MemberSidebarContentProps> = ({
  onLinkClick
}) => {
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const {
    logout
  } = useAuth();
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
  return <>
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-3">
          <Logo variant="white" />
          
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <ScrollArea className="flex-1 h-[calc(100vh-130px)]">
          <div className="p-2">
            {memberNavSections.map((section, index) => <SidebarNavSection key={index} section={section} isExpanded={expandedSections.includes(section.name)} onToggle={() => toggleSection(section.name)} onLinkClick={onLinkClick} />)}
          </div>
        </ScrollArea>
      </SidebarContent>
      
      <SidebarFooter className="mt-auto p-4">
        <Separator className="my-2 bg-white/10" />
        <Button variant="ghost" className="w-full justify-start text-white/70 hover:text-white hover:bg-white/10" onClick={handleLogout} disabled={isLoggingOut}>
          <LogOut className="mr-2 h-4 w-4" />
          {isLoggingOut ? "Logging out..." : "Logout"}
        </Button>
      </SidebarFooter>
    </>;
};
export default MemberSidebarContent;