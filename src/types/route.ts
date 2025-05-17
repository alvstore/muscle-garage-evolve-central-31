
import { ReactNode } from 'react';
import { Permission } from '@/hooks/auth/use-permissions';
import { RouteObject } from 'react-router-dom';

export interface AppRouteMeta {
  title?: string;
  breadcrumb?: string;
  permission?: Permission;
  hideInNav?: boolean;
  icon?: ReactNode;
  children?: AppRoute[];
}

// Make sure AppRoute doesn't extend RouteObject but includes all needed properties
export interface AppRoute {
  path: string;
  element?: React.ReactNode;
  children?: AppRoute[];
  meta?: AppRouteMeta;
  loader?: any;
  action?: any;
  errorElement?: React.ReactNode;
  handle?: any;
  index?: boolean;
  id?: string;
  caseSensitive?: boolean;
}
