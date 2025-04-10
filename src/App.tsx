
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import DashboardLayout from "./components/layout/DashboardLayout";
import Dashboard from "./pages/dashboard/Dashboard";
import Login from "./pages/auth/Login";
import NotFound from "./pages/NotFound";
import MemberProfilePage from "./pages/members/MemberProfilePage";
import FitnessPlanPage from "./pages/fitness/FitnessPlanPage";
import MembershipPage from "./pages/membership/MembershipPage";
import InvoicePage from "./pages/finance/InvoicePage";
import TransactionPage from "./pages/finance/TransactionPage";
import ClassPage from "./pages/classes/ClassPage";
import TrainerPage from "./pages/trainers/TrainerPage";
import { useEffect, useState } from "react";
import { User } from "./types";

const queryClient = new QueryClient();

const App = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get user from localStorage
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="h-12 w-12 rounded-full border-4 border-t-accent mx-auto animate-spin"></div>
          <p className="mt-4 text-lg font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            
            {/* Protected routes */}
            <Route path="/" element={user ? <DashboardLayout user={user} /> : <Navigate to="/login" replace />}>
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              
              {/* Member management */}
              <Route path="members/:id" element={<MemberProfilePage />} />
              
              {/* Trainer management */}
              <Route path="trainers" element={<TrainerPage />} />
              
              {/* Class management */}
              <Route path="classes" element={<ClassPage />} />
              
              {/* Fitness plans */}
              <Route path="fitness-plans" element={<FitnessPlanPage />} />
              <Route path="fitness-plans/workout" element={<FitnessPlanPage />} />
              <Route path="fitness-plans/diet" element={<FitnessPlanPage />} />
              
              {/* Membership management */}
              <Route path="memberships" element={<MembershipPage />} />
              
              {/* Finance management */}
              <Route path="invoices" element={<InvoicePage />} />
              <Route path="transactions" element={<TransactionPage />} />
              
              {/* Add additional routes for other modules */}
            </Route>
            
            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
