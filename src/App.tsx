
import React, { useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './hooks/use-auth';
import { BranchProvider } from './hooks/use-branch';
import AppRouter from './router/AppRouter';
import RouteChecker from './components/debug/RouteChecker';
import { toast, Toaster } from 'sonner';
import { hikvisionPollingService } from './services/integrations/hikvisionPollingService';

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
    // Start Hikvision polling if enabled
    const pollingEnabled = localStorage.getItem('hikvision_polling_enabled');
    if (pollingEnabled === 'true') {
      hikvisionPollingService.startPolling();
    }

    // Tab visibility management
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        // Prevent refresh when tab is hidden
        document.body.style.display = 'none';
        // Prevent any pending refresh
        window.stop();
      } else {
        // Restore display when tab becomes visible
        document.body.style.display = '';
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
      <AuthProvider>
        <BranchProvider>
          <Toaster position="top-right" />
          <AppRouter />
          {process.env.NODE_ENV === 'development' && <RouteChecker />}
        </BranchProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
