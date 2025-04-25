import React from "react";
import { useNavigate } from "react-router-dom";
import ForgotPasswordForm from "@/components/auth/ForgotPasswordForm";

const ForgotPassword = () => {
  const navigate = useNavigate();

  return <ForgotPasswordForm />;
};

export default ForgotPassword;
