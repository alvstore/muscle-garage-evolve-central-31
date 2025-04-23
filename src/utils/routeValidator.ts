
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
        
        // Also consider parent paths without trailing slashes as valid
        if (route.path.endsWith('/')) {
          paths.push(route.path.slice(0, -1));
        } else {
          paths.push(`${route.path}/`);
        }
        
        // Add for paths with parameters (check only the base part)
        if (route.path.includes(':')) {
          const basePath = route.path.split('/:')[0];
          if (!paths.includes(basePath)) {
            paths.push(basePath);
          }
        }
      }
      
      if (route.children) {
        paths = [...paths, ...extractPaths(route.children)];
      }
    });
    
    return paths;
  };
  
  const allPaths = extractPaths(appRoutes);
  
  // Special cases to always consider valid
  if (
    path === '#' || 
    path.startsWith('http') ||
    path === '/' ||
    path === '' ||
    path === '/dashboard'
  ) {
    return true;
  }
  
  // Check if the provided path exists in allPaths
  return allPaths.includes(path);
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
