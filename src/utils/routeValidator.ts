
import { appRoutes } from '@/router/appRoutes';

/**
 * Utility to check if a route path exists in the application routes
 * @param path The path to check
 * @returns Boolean indicating if the path exists
 */
export const isValidRoute = (path: string): boolean => {
  // Extract all possible route paths from appRoutes
  const extractPaths = (routes: any[]): string[] => {
    let paths: string[] = [];
    
    routes.forEach(route => {
      if (route.path) {
        paths.push(route.path);
      }
      
      if (route.children) {
        paths = [...paths, ...extractPaths(route.children)];
      }
    });
    
    return paths;
  };
  
  const allPaths = extractPaths(appRoutes);
  
  // Check if the provided path exists in allPaths
  return allPaths.includes(path) || path === '#' || path.startsWith('http');
};

/**
 * Gets all available routes in the application
 * @returns Array of all route paths
 */
export const getAllRoutes = (): string[] => {
  const extractPaths = (routes: any[]): string[] => {
    let paths: string[] = [];
    
    routes.forEach(route => {
      if (route.path) {
        paths.push(route.path);
      }
      
      if (route.children) {
        paths = [...paths, ...extractPaths(route.children)];
      }
    });
    
    return paths;
  };
  
  return extractPaths(appRoutes);
};
