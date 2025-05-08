
import { lazy, Suspense } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { crmRoutes } from './router/routes/crmRoutes';
import { memberRoutes } from './router/routes/memberRoutes';
import { trainerRoutes } from './router/routes/trainerRoutes';
import { websiteRoutes } from './router/routes/websiteRoutes';
import { classRoutes } from './router/routes/classRoutes';
import { financeRoutes } from './router/routes/financeRoutes';
import { miscRoutes } from './router/routes/miscRoutes';
import { communicationRoutes } from './router/routes/communicationRoutes';
import { analyticsRoutes } from './router/routes/analyticsRoutes';
import { adminRoutes } from './router/routes/adminRoutes';
import { settingsRoutes } from './router/routes/admin/settingsRoutes';
import { staffRoutes } from './router/routes/staffRoutes';
import { fitnessRoutes } from './router/routes/fitnessRoutes';
import { branchRoutes } from './router/routes/branchRoutes';
import { marketingRoutes } from './router/routes/marketingRoutes';

import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/hooks/use-auth';
import { BranchProvider } from '@/contexts/BranchContext';
import VisibilityHandler from './components/layout/VisibilityHandler';
import './App.css';

// Lazy load the layout components
const AdminLayout = lazy(() => import('./layouts/AdminLayout'));
const WebsiteLayout = lazy(() => import('./layouts/WebsiteLayout'));
const DashboardLayout = lazy(() => import('./components/layout/DashboardLayout'));

// Create a simple loading screen component
const LoadingScreen = () => (
  <div className="flex items-center justify-center h-screen">
    <div className="h-8 w-8 rounded-full border-4 border-t-primary animate-spin"></div>
  </div>
);

// Create simple page components for auth pages
const LoginPage = lazy(() => import('./pages/auth/Login'));
const RegisterPage = () => <div>Register Page</div>;
const ForgotPasswordPage = lazy(() => import('./pages/auth/Unauthorized'));
const ResetPasswordPage = () => <div>Reset Password Page</div>;

function App() {
  return (
    <BrowserRouter>
      <VisibilityHandler>
        <AuthProvider>
          <BranchProvider>
            <Suspense fallback={<LoadingScreen />}>
              <Routes>
                {/* Public auth routes */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                <Route path="/reset-password" element={<ResetPasswordPage />} />

                {/* Admin routes */}
                <Route path="/admin" element={<AdminLayout />}>
                  {adminRoutes.map((route) => (
                    <Route
                      key={route.path}
                      path={route.path.replace(/^\//, '/admin/')}
                      element={route.element}
                    />
                  ))}
                  {settingsRoutes.map((route) => (
                    <Route
                      key={route.path}
                      path={route.path.replace(/^\//, '/admin/')}
                      element={route.element}
                    />
                  ))}
                  {staffRoutes.map((route) => (
                    <Route
                      key={route.path}
                      path={route.path.replace(/^\//, '/admin/')}
                      element={route.element}
                    />
                  ))}
                </Route>

                {/* Regular dashboard routes */}
                <Route path="/" element={<DashboardLayout />}>
                  {crmRoutes.map((route) => (
                    <Route key={route.path} path={route.path} element={route.element} />
                  ))}
                  {memberRoutes.map((route) => (
                    <Route key={route.path} path={route.path} element={route.element} />
                  ))}
                  {trainerRoutes.map((route) => (
                    <Route key={route.path} path={route.path} element={route.element} />
                  ))}
                  {classRoutes.map((route) => (
                    <Route key={route.path} path={route.path} element={route.element} />
                  ))}
                  {financeRoutes.map((route) => (
                    <Route key={route.path} path={route.path} element={route.element} />
                  ))}
                  {miscRoutes.map((route) => (
                    <Route key={route.path} path={route.path} element={route.element} />
                  ))}
                  {communicationRoutes.map((route) => (
                    <Route key={route.path} path={route.path} element={route.element} />
                  ))}
                  {analyticsRoutes.map((route) => (
                    <Route key={route.path} path={route.path} element={route.element} />
                  ))}
                  {fitnessRoutes.map((route) => (
                    <Route key={route.path} path={route.path} element={route.element} />
                  ))}
                  {branchRoutes.map((route) => (
                    <Route key={route.path} path={route.path} element={route.element} />
                  ))}
                  {marketingRoutes.map((route) => (
                    <Route key={route.path} path={route.path} element={route.element} />
                  ))}
                </Route>

                {/* Website routes */}
                <Route path="/" element={<WebsiteLayout />}>
                  {websiteRoutes.map((route) => (
                    <Route key={route.path} path={route.path} element={route.element} />
                  ))}
                </Route>
              </Routes>
            </Suspense>
            <Toaster />
          </BranchProvider>
        </AuthProvider>
      </VisibilityHandler>
    </BrowserRouter>
  );
}

export default App;
