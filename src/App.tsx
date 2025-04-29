
import React, { useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './hooks/use-auth';
import { BranchProvider } from './hooks/use-branch';
import { PermissionsProvider } from './hooks/permissions/use-permissions-manager';
import AppRouter from './router/AppRouter';
import RouteChecker from './components/debug/RouteChecker';
import { createInitialAdmin } from './utils/initAdmin';
import { toast, Toaster } from 'sonner';

// Create a query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute
      retry: 1,
    },
  },
});

export default function App() {
  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Initialize admin account if needed
        await createInitialAdmin();
      } catch (error) {
        console.error("Error during app initialization:", error);
        toast.error("Error initializing application");
      }
    };
    
    initializeApp();
  }, []);
  
  return (
    <>
      <Toaster position="top-right" richColors />
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <BranchProvider>
            <PermissionsProvider>
              <AppRouter />
              <RouteChecker />
            </PermissionsProvider>
          </BranchProvider>
        </AuthProvider>
      </QueryClientProvider>
    </>
  );
}
