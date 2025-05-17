
import React, { useEffect, Suspense } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import AppRouter from './router/AppRouter';
import { ThemeProvider } from './providers/ThemeProvider';
import { Toaster, toast } from "@/components/ui/sonner";
import { ensureStorageBucketsExist } from './services/utils/storageService';
import { supabase } from './integrations/supabase/client';
import { AuthProvider } from './hooks/auth/use-auth';
import { BranchProvider } from './hooks/settings/use-branches';
import { PermissionsProvider } from './hooks/permissions/use-permissions-manager';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
      networkMode: 'always',
    },
  },
});

// Dynamically import React Query Devtools (only in development)
const ReactQueryDevtoolsProduction = React.lazy(() =>
  import('@tanstack/react-query-devtools/production').then(d => ({
    default: d.ReactQueryDevtools
  }))
);

function App() {
  const [showDevtools, setShowDevtools] = React.useState(false);

  React.useEffect(() => {
    // Only show devtools in development
    if (process.env.NODE_ENV === 'development') {
      setShowDevtools(true);
    }
  }, []);

  // Initialize storage buckets when app loads
  useEffect(() => {
    const initializeStorage = async () => {
      try {
        await ensureStorageBucketsExist();
      } catch (error) {
        console.error('Failed to initialize storage buckets:', error);
        toast.error('Failed to initialize storage');
      }
    };
    
    // Only initialize storage when user signs in
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN') {
        console.log('User signed in', session?.user?.id);
        initializeStorage();
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
        <AppRouter />
        <Toaster position="top-right" richColors />
        {showDevtools && (
          <Suspense fallback={null}>
            <ReactQueryDevtoolsProduction initialIsOpen={false} />
          </Suspense>
        )}
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
