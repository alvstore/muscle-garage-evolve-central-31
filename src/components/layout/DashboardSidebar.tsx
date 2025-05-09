import React from 'react';
import { cn } from "@/lib/utils";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import NavigationSection from "@/components/navigation/NavigationSection";
import NavigationManager from "@/components/navigation/NavigationManager";

interface DashboardSidebarProps {
  className?: string;
}

export function DashboardSidebar({ className }: DashboardSidebarProps) {
  return (
    <div className={cn("pb-12 w-full", className)}>
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <div className="mb-5">
            <Link to="/" className="flex items-center">
              <h2 className="text-lg font-semibold">Muscle Garage</h2>
            </Link>
          </div>
          <div className="space-y-1">
            <NavigationManager>
              {({ sections, activePath, expandedSections, toggleSection }) => (
                <ScrollArea className="h-[calc(100vh-10rem)]">
                  <div className="space-y-1">
                    {sections.map((section) => (
                      <NavigationSection 
                        key={section.name}
                        section={section}
                        activePath={activePath}
                        isExpanded={expandedSections.includes(section.name)}
                        onToggle={() => toggleSection(section.name)}
                      />
                    ))}
                  </div>
                </ScrollArea>
              )}
            </NavigationManager>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardSidebar;
