
import { Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { ThemeProvider } from './providers/ThemeProvider';
import { appRoutes } from './router/appRoutes';
import { PermissionsProvider } from './hooks/use-permissions';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 5,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <PermissionsProvider>
          <Toaster position="top-right" />
          <Routes>
            {appRoutes}
          </Routes>
        </PermissionsProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
