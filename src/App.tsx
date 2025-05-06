
import React, { useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './hooks/use-auth';
import { BranchProvider } from './contexts/BranchContext';
import AppRouter from './router/AppRouter';
import RouteChecker from './components/debug/RouteChecker';
// Remove this import: import { createInitialAdmin } from './utils/initAdmin';
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
    
    // Move initialization here
    const initializeApp = async () => {
      try {
        // Remove this line: await createInitialAdmin();
      } catch (error) {
        console.error("Error during app initialization:", error);
        toast.error("Error initializing application");
      }
    };
    
    initializeApp(); // This is called on every render!
    
    // Cleanup on unmount
    return () => {
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
