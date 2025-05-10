
import React, { useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import AppRouter from './router/AppRouter';
import { ThemeProvider } from './providers/ThemeProvider';
import { Toaster } from "@/components/ui/sonner";
import { ensureStorageBucketsExist } from './services/storageService';
import { supabase } from './integrations/supabase/client';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  },
});

// Dynamically import React Query Devtools (only in development)
const ReactQueryDevtoolsProduction = React.lazy(() =>
  import('@tanstack/react-query-devtools').then(d => ({
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

  useEffect(() => {
    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN') {
        console.log('User signed in', session?.user?.id);
        // Ensure storage buckets exist when user signs in
        ensureStorageBucketsExist();
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <Router>
          <AppRouter />
        </Router>
      </ThemeProvider>
      <Toaster />
      {showDevtools && (
        <React.Suspense fallback={null}>
          <ReactQueryDevtoolsProduction initialIsOpen={false} />
        </React.Suspense>
      )}
    </QueryClientProvider>
  );
}

export default App;
