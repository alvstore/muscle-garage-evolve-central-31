import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './hooks/use-auth';
import { BranchProvider } from './hooks/use-branch';
import AppRouter from './router/AppRouter';
import RouteChecker from './components/debug/RouteChecker';

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
  return (
    <>
      <RouteChecker />
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <BranchProvider>
            <AppRouter />
          </BranchProvider>
        </AuthProvider>
      </QueryClientProvider>
    </>
  );
}
