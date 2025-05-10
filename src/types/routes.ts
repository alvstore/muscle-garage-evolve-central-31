
import { RouteObject } from 'react-router-dom';

export interface AppRoute extends Omit<RouteObject, 'children'> {
  meta?: {
    title?: string;
    description?: string;
    requiresAuth?: boolean;
    permission?: string;
  };
  children?: AppRoute[];
}
