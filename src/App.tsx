
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

// Creating a minimal app for development that only shows the member progress page
function App() {
  return (
    <Router>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
      <Routes>
        <Route
          path="/fitness/progress"
          element={<MemberProgressPage />}
        />
        <Route path="*" element={<Navigate to="/fitness/progress" />} />
      </Routes>
    </Router>
  );
}

export default App;
