
import { lazy, Suspense } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { adminCrmRoutes } from './router/routes/admin/crmRoutes';
import { adminMembersRoutes } from './router/routes/admin/membersRoutes';
import { adminSettingsRoutes } from './router/routes/admin/settingsRoutes';
import { adminTrainersRoutes } from './router/routes/admin/trainersRoutes';
import { adminClassesRoutes } from './router/routes/admin/classesRoutes';
import { adminPaymentsRoutes } from './router/routes/admin/paymentsRoutes';
import { adminInventoryRoutes } from './router/routes/admin/inventoryRoutes';
import { adminCommunicationRoutes } from './router/routes/admin/communicationRoutes';
import { adminReportsRoutes } from './router/routes/admin/reportsRoutes';
import { adminDashboardRoutes } from './router/routes/admin/dashboardRoutes';

import { memberRoutes } from './router/routes/memberRoutes';
import { trainerRoutes } from './router/routes/trainerRoutes';
import { publicRoutes } from './router/routes/publicRoutes';

import { Toaster } from '@/components/ui/toaster';
import LoadingScreen from './components/LoadingScreen';
import { AuthProvider } from './contexts/AuthContext';
import { BranchProvider } from './contexts/BranchContext';
import VisibilityHandler from './components/layout/VisibilityHandler';
import './App.css';

// Lazy load the layout components
const AdminLayout = lazy(() => import('./components/layouts/AdminLayout'));
const WebsiteLayout = lazy(() => import('./components/layouts/WebsiteLayout'));
const MemberLayout = lazy(() => import('./components/layouts/MemberLayout'));
const TrainerLayout = lazy(() => import('./components/layouts/TrainerLayout'));

// Lazy load the auth pages
const LoginPage = lazy(() => import('./pages/auth/LoginPage'));
const RegisterPage = lazy(() => import('./pages/auth/RegisterPage'));
const ForgotPasswordPage = lazy(() => import('./pages/auth/ForgotPasswordPage'));
const ResetPasswordPage = lazy(() => import('./pages/auth/ResetPasswordPage'));

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
          </BranchProvider>
        </AuthProvider>
      </VisibilityHandler>
    </BrowserRouter>
  );
}

export default App;
