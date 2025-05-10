
import { ReactNode } from 'react';

export interface NavItem {
  href: string;
  label: string;
  icon?: ReactNode;
  permission?: string;
  badge?: string;
  children?: NavItem[];
}

export interface NavSection {
  name: string;
  items: NavItem[];
  icon?: ReactNode;
}

// Re-export Permission type with proper syntax for 'isolatedModules'
export type { Permission } from '@/hooks/use-permissions';
