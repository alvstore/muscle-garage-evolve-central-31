import { createBrowserRouter } from 'react-router-dom';
import { RouterProvider } from 'react-router-dom';
import { appRoutes } from './appRoutes';

// Create a custom router with all future flags enabled
const router = createBrowserRouter(appRoutes, {
  future: {
    v7_startTransition: true,
    v7_relativeSplatPath: true,
    v7_fetcherPersist: true,
    v7_normalizeFormMethod: true,
  } as any, // Use type assertion to bypass TypeScript errors
});

// Export the router
export { router };

// This ensures the router is only created once
let routerCreated = false;

export function createAppRouter() {
  if (routerCreated) {
    throw new Error('Router was already created');
  }
  
  routerCreated = true;
  
  // Log the router configuration in development
  if (process.env.NODE_ENV === 'development') {
    console.log('React Router configured with future flags');
  }
  
  return router;
}

// Export a custom RouterProvider with proper typing
export function CustomRouterProvider({
  router,
  ...props
}: {
  router: ReturnType<typeof createBrowserRouter>;
} & Omit<React.ComponentProps<typeof RouterProvider>, 'router'>) {
  return <RouterProvider router={router} {...props} />;
}
