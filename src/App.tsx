
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

    // Tab focus management
    const handleBlur = () => {
      // Prevent default refresh behavior
      document.body.style.display = 'none';
    };

    const handleFocus = () => {
      // Restore display
      document.body.style.display = '';
      // Prevent any pending refresh
      window.stop();
    };

    // Add event listeners
    window.addEventListener('blur', handleBlur);
    window.addEventListener('focus', handleFocus);

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
      window.removeEventListener('blur', handleBlur);
      window.removeEventListener('focus', handleFocus);
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
