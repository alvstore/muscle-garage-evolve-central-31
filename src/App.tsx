import React, { useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './hooks/use-auth';
import { BranchProvider } from './hooks/use-branch';
import AppRouter from './router/AppRouter';
import RouteChecker from './components/debug/RouteChecker';
import { toast, Toaster } from 'sonner';
import { hikvisionPollingService } from './services/integrations/hikvisionPollingService';
import { ThemeProvider } from './providers/ThemeProvider';
import ThemeCustomizer from './components/theme/ThemeCustomizer';
import { ensureStorageBucketsExist } from './services/storageService';

// Create a query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute
      retry: 1,
    },
  },
});

function App() {
  useEffect(() => {
    // Ensure storage buckets exist
    ensureStorageBucketsExist();
    
    // Start Hikvision polling if enabled
    const pollingEnabled = localStorage.getItem('hikvision_polling_enabled');
    if (pollingEnabled === 'true') {
      hikvisionPollingService.startPolling();
    }

    // Tab visibility management
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        // You can add code here to pause certain activities when tab is hidden
        // For example, pause animations, timers, or non-critical background tasks
        console.log('Tab hidden, pausing non-critical operations');
      } else {
        // Resume activities when tab becomes visible
        console.log('Tab visible, resuming operations');
      }
    };

    // Add event listener
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Move initialization here
    const initializeApp = async () => {
      try {
        // Removed the createInitialAdmin call
      } catch (error) {
        console.error("Error during app initialization:", error);
        toast.error("Error initializing application");
      }
    };
    
    initializeApp();
    
    // Cleanup on unmount
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      hikvisionPollingService.stopPolling();
    };
  }, []);
  
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <BranchProvider>
            <Toaster position="top-right" />
            <AppRouter />
            {process.env.NODE_ENV === 'development' && <RouteChecker />}
          </BranchProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
