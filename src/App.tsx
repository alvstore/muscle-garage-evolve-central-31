
import { lazy, Suspense } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { adminCrmRoutes } from './router/routes/admin/crmRoutes';
import { adminSettingsRoutes } from './router/routes/admin/settingsRoutes';
import { adminCommunicationRoutes } from './router/routes/admin/communicationRoutes';
import { adminDashboardRoutes } from './router/routes/admin/dashboardRoutes';
import { websiteRoutes } from './router/routes/websiteRoutes';

import { memberRoutes } from './router/routes/memberRoutes';
import { trainerRoutes } from './router/routes/trainerRoutes';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from './contexts/AuthContext';
import { BranchProvider } from './contexts/BranchContext';
import VisibilityHandler from './components/layout/VisibilityHandler';
import { PermissionsProvider } from '@/hooks/permissions/use-permissions-manager';
import './App.css';

// Lazy load the layout components
const AdminLayout = lazy(() => import('./layouts/AdminLayout'));
const WebsiteLayout = lazy(() => import('./layouts/WebsiteLayout'));
const MemberLayout = lazy(() => import('@/components/layout/MemberSidebar')); 
const TrainerLayout = lazy(() => import('@/components/layout/TrainerSidebar'));

// Create LoadingScreen component
const LoadingScreen = () => (
  <div className="flex items-center justify-center h-screen">
    <div className="h-10 w-10 rounded-full border-4 border-t-blue-600 border-blue-200 animate-spin"></div>
  </div>
);

// Lazy load the auth pages
const LoginPage = lazy(() => import('./pages/auth/Login'));
const RegisterPage = lazy(() => import('./pages/auth/Login').then(module => ({ default: module.default })));
const ForgotPasswordPage = lazy(() => import('./pages/auth/ForgotPassword'));
const ResetPasswordPage = lazy(() => import('./pages/auth/ResetPassword'));

// Create missing routes arrays
const adminMembersRoutes = [];
const adminTrainersRoutes = [];
const adminClassesRoutes = [];
const adminPaymentsRoutes = [];
const adminInventoryRoutes = [];
const adminReportsRoutes = [];
const publicRoutes = websiteRoutes;

function App() {
  return (
    <BrowserRouter>
      <VisibilityHandler>
        <AuthProvider>
          <BranchProvider>
            <PermissionsProvider>
              <Suspense fallback={<LoadingScreen />}>
                <Routes>
                  {/* Public auth routes */}
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                  <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                  <Route path="/reset-password" element={<ResetPasswordPage />} />

                  {/* Admin routes */}
                  <Route path="/admin" element={<AdminLayout />}>
                    {adminDashboardRoutes.map((route) => (
                      <Route
                        key={route.path}
                        path={route.path.replace(/^\//, '/admin/')}
                        element={route.element}
                      />
                    ))}
                    {adminCrmRoutes.map((route) => (
                      <Route
                        key={route.path}
                        path={route.path.replace(/^\//, '/admin/')}
                        element={route.element}
                      />
                    ))}
                    {adminMembersRoutes.map((route) => (
                      <Route
                        key={route.path}
                        path={route.path.replace(/^\//, '/admin/')}
                        element={route.element}
                      />
                    ))}
                    {adminTrainersRoutes.map((route) => (
                      <Route
                        key={route.path}
                        path={route.path.replace(/^\//, '/admin/')}
                        element={route.element}
                      />
                    ))}
                    {adminClassesRoutes.map((route) => (
                      <Route
                        key={route.path}
                        path={route.path.replace(/^\//, '/admin/')}
                        element={route.element}
                      />
                    ))}
                    {adminPaymentsRoutes.map((route) => (
                      <Route
                        key={route.path}
                        path={route.path.replace(/^\//, '/admin/')}
                        element={route.element}
                      />
                    ))}
                    {adminInventoryRoutes.map((route) => (
                      <Route
                        key={route.path}
                        path={route.path.replace(/^\//, '/admin/')}
                        element={route.element}
                      />
                    ))}
                    {adminCommunicationRoutes.map((route) => (
                      <Route
                        key={route.path}
                        path={route.path.replace(/^\//, '/admin/')}
                        element={route.element}
                      />
                    ))}
                    {adminReportsRoutes.map((route) => (
                      <Route
                        key={route.path}
                        path={route.path.replace(/^\//, '/admin/')}
                        element={route.element}
                      />
                    ))}
                    {adminSettingsRoutes.map((route) => (
                      <Route
                        key={route.path}
                        path={route.path.replace(/^\//, '/admin/')}
                        element={route.element}
                      />
                    ))}
                  </Route>

                  {/* Member routes */}
                  <Route path="/member" element={<MemberLayout />}>
                    {memberRoutes.map((route) => (
                      <Route
                        key={route.path}
                        path={route.path.replace(/^\//, '/member/')}
                        element={route.element}
                      />
                    ))}
                  </Route>

                  {/* Trainer routes */}
                  <Route path="/trainer" element={<TrainerLayout />}>
                    {trainerRoutes.map((route) => (
                      <Route
                        key={route.path}
                        path={route.path.replace(/^\//, '/trainer/')}
                        element={route.element}
                      />
                    ))}
                  </Route>

                  {/* Public website routes */}
                  <Route element={<WebsiteLayout />}>
                    {publicRoutes.map((route) => (
                      <Route key={route.path} path={route.path} element={route.element} />
                    ))}
                  </Route>
                </Routes>
              </Suspense>
              <Toaster />
            </PermissionsProvider>
          </BranchProvider>
        </AuthProvider>
      </VisibilityHandler>
    </BrowserRouter>
  );
}

export default App;
