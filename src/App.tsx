
import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import MemberProgressPage from "./pages/members/MemberProgressPage";
import Dashboard from "./pages/dashboard/Dashboard";
import DashboardLayout from "./components/layout/DashboardLayout";
import FitnessProgressPage from "./pages/fitness/FitnessProgressPage";

function App() {
  return (
    <Router>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
      <Routes>
        <Route path="/" element={<DashboardLayout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="fitness/progress" element={<FitnessProgressPage />} />
          <Route path="members/progress" element={<MemberProgressPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/dashboard" />} />
      </Routes>
    </Router>
  );
}

export default App;
