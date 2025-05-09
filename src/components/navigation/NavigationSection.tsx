
import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { NavItem, NavSection } from '@/types/navigation';

interface NavigationSectionProps {
  section: NavSection;
  activePath: string;
  isExpanded: boolean;
  onToggle: () => void;
}

export function NavigationSection({ section, activePath, isExpanded, onToggle }: NavigationSectionProps) {
  return (
    <div className="pb-2">
      <button
        onClick={onToggle}
        className={cn(
          "flex items-center w-full justify-between rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
          isExpanded && "bg-accent/50"
        )}
      >
        <span>{section.name}</span>
        <ChevronRight
          className={cn("h-4 w-4 transition-transform", isExpanded && "rotate-90")}
        />
      </button>
      {isExpanded && (
        <div className="mt-1 pl-4 space-y-1">
          {section.items.map((item) => (
            <NavItemLink 
              key={item.href} 
              item={item} 
              isActive={activePath === item.href}
            />
          ))}
        </div>
      )}
    </div>
  );
}

interface NavItemLinkProps {
  item: NavItem;
  isActive: boolean;
}

function NavItemLink({ item, isActive }: NavItemLinkProps) {
  return (
    <Link
      to={item.href}
      className={cn(
        "flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
        isActive && "bg-accent text-accent-foreground"
      )}
    >
      {item.icon && <div className="mr-2">{item.icon}</div>}
      <span>{item.label}</span>
    </Link>
  );
}

export default NavigationSection;
