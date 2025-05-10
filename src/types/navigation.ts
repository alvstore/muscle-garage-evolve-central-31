
import { ReactNode } from 'react';
import { Permission } from '@/hooks/use-permissions';

export interface NavItem {
  href: string;
  label: string;
  icon?: ReactNode;  // Changed from string to ReactNode
  permission?: Permission;
  badge?: string;
  children?: NavItem[];
}

export interface NavSection {
  name: string;
  items: NavItem[];
}

// Re-export Permission type
export { Permission } from '@/hooks/use-permissions';
