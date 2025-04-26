
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from '@/pages/dashboard/Dashboard';
import Login from '@/pages/auth/Login';
import ForgotPassword from '@/pages/auth/ForgotPassword';
import ResetPassword from '@/pages/auth/ResetPassword';
import { useAuth } from '@/hooks/use-auth';
import { createInitialAdmin } from '@/utils/initAdmin';
import PrivateRoute from '@/components/auth/PrivateRoute';
import { PermissionsProvider } from '@/hooks/use-permissions';
import Unauthorized from '@/pages/auth/Unauthorized';

function App() {
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    // Create the initial admin account on app startup
    const initializeAdmin = async () => {
      await createInitialAdmin();
    };
    
    initializeAdmin();
  }, []);

  return (
    <Router>
      <PermissionsProvider>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/unauthorized" element={<Unauthorized />} />
          
          {/* Private routes */}
          <Route
            path="/*"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
        </Routes>
      </PermissionsProvider>
    </Router>
  );
}

export default App;
