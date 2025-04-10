import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { useAuth } from "./hooks/use-auth";
import { Roles } from "./utils/Constants";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import ForgotPasswordPage from "./pages/auth/ForgotPasswordPage";
import ResetPasswordPage from "./pages/auth/ResetPasswordPage";
import DashboardPage from "./pages/DashboardPage";
import ClassesPage from "./pages/classes/ClassesPage";
import ClassDetailPage from "./pages/classes/ClassDetailPage";
import BookClassPage from "./pages/classes/BookClassPage";
import WorkoutPlansPage from "./pages/fitness/WorkoutPlansPage";
import DietPlansPage from "./pages/fitness/DietPlansPage";
import MembersPage from "./pages/members/MembersPage";
import MemberProfilePage from "./pages/members/MemberProfilePage";
import TrainersPage from "./pages/trainers/TrainersPage";
import StaffPage from "./pages/staff/StaffPage";
import AnalyticsPage from "./pages/analytics/AnalyticsPage";
import SettingsPage from "./pages/settings/SettingsPage";
import BranchManagementPage from "./pages/branches/BranchManagementPage";
import PrivateRoute from "./components/routes/PrivateRoute";
import AdminRoute from "./components/routes/AdminRoute";
import TrainerRoute from "./components/routes/TrainerRoute";
import MemberRoute from "./components/routes/MemberRoute";
import AccessDeniedPage from "./pages/auth/AccessDeniedPage";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import BookingManagementPage from "./pages/bookings/BookingManagementPage";
import MemberProgressPage from "./pages/members/MemberProgressPage";

function App() {
  const { user, loading } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isTrainer, setIsTrainer] = useState(false);
  const [isMember, setIsMember] = useState(false);

  useEffect(() => {
    if (user) {
      setIsAdmin(user.role === Roles.Admin);
      setIsTrainer(user.role === Roles.Trainer);
      setIsMember(user.role === Roles.Member);
    } else {
      setIsAdmin(false);
      setIsTrainer(false);
      setIsMember(false);
    }
  }, [user]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
      <Routes>
        <Route path="/login" element={user ? <Navigate to="/" /> : <LoginPage />} />
        <Route path="/register" element={user ? <Navigate to="/" /> : <RegisterPage />} />
        <Route
          path="/forgot-password"
          element={user ? <Navigate to="/" /> : <ForgotPasswordPage />}
        />
        <Route
          path="/reset-password/:token"
          element={user ? <Navigate to="/" /> : <ResetPasswordPage />}
        />
        <Route path="/access-denied" element={<AccessDeniedPage />} />

        <Route
          path="/"
          element={
            <PrivateRoute>
              <DashboardPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/classes"
          element={
            <PrivateRoute>
              <ClassesPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/classes/:id"
          element={
            <PrivateRoute>
              <ClassDetailPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/classes/:id/book"
          element={
            <PrivateRoute>
              <BookClassPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/fitness/workout-plans"
          element={
            <PrivateRoute>
              <WorkoutPlansPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/fitness/diet-plans"
          element={
            <PrivateRoute>
              <DietPlansPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/members"
          element={
            <PrivateRoute>
              <MembersPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/members/:id"
          element={
            <PrivateRoute>
              <MemberProfilePage />
            </PrivateRoute>
          }
        />
        <Route
          path="/trainers"
          element={
            <PrivateRoute>
              <TrainersPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/staff"
          element={
            <AdminRoute>
              <StaffPage />
            </AdminRoute>
          }
        />
        <Route
          path="/analytics"
          element={
            <AdminRoute>
              <AnalyticsPage />
            </AdminRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <PrivateRoute>
              <SettingsPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/branches"
          element={
            <AdminRoute>
              <BranchManagementPage />
            </AdminRoute>
          }
        />
        <Route
          path="/bookings"
          element={
            <PrivateRoute>
              <BookingManagementPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/fitness/progress"
          element={
            <PrivateRoute>
              <MemberProgressPage />
            </PrivateRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
