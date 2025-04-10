
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LoginForm from "@/components/auth/LoginForm";

const Login = () => {
  const navigate = useNavigate();

  // Check if user is already logged in
  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      navigate("/dashboard");
    }
  }, [navigate]);

  return (
    <div className="min-h-screen gym-gradient flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <LoginForm />
      </div>
    </div>
  );
};

export default Login;
