
import { useLocation } from 'react-router-dom';

// Check if a route exists in the application
export const isValidRoute = (path: string): boolean => {
  // List of all valid routes in the application
  // This should be updated whenever new routes are added
  const validRoutes = [
    '/',
    '/dashboard',
    '/members',
    '/trainers',
    '/classes',
    '/inventory',
    '/marketing',
    '/finance',
    '/settings',
    '/auth',
    '/referrals',
    '/profile',
    '/help'
  ];

  // Check if the path exists in our valid routes
  // Also check for dynamic routes with parameters
  const isDynamicRoute = 
    path.includes('/members/') || 
    path.includes('/trainers/') ||
    path.includes('/classes/') ||
    path.includes('/inventory/');

  return validRoutes.includes(path) || isDynamicRoute;
};

// Hook to check if the current route is valid
export const useValidRoute = () => {
  const location = useLocation();
  return isValidRoute(location.pathname);
};

// Utility to ensure we have valid links
export const ensureValidRoute = (path: string): string => {
  return isValidRoute(path) ? path : '/dashboard';
};

// Format route for display in breadcrumbs or navigation
export const formatRouteName = (path: string): string => {
  // Remove leading slash and get the last segment
  const segment = path.replace(/^\//, '').split('/').pop() || '';
  
  // Capitalize first letter and add spaces between camelCase
  return segment
    ? segment.charAt(0).toUpperCase() + segment.slice(1).replace(/([A-Z])/g, ' $1')
    : 'Home';
};
