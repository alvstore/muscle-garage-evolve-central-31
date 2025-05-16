
import { useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { toast } from 'sonner';

export const useAuthActions = () => {
  const { login, logout, register, forgotPassword, resetPassword, changePassword, isLoading } = useAuth();
  const [isRegistering, setIsRegistering] = useState(false);
  
  const handleLogin = async (email: string, password: string) => {
    try {
      const result = await login(email, password);
      if (result.success) {
        toast.success('Logged in successfully');
      }
      return result;
    } catch (error) {
      console.error('Login failed:', error);
      toast.error('Login failed');
      return { error, success: false };
    }
  };
  
  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully');
      return { success: true };
    } catch (error) {
      console.error('Logout failed:', error);
      toast.error('Logout failed');
      return { error, success: false };
    }
  };
  
  const handleRegister = async (email: string, password: string, userData: any) => {
    setIsRegistering(true);
    try {
      const result = await register(email, password, userData);
      if (result.success) {
        toast.success('Registered successfully');
      }
      return result;
    } catch (error) {
      console.error('Registration failed:', error);
      toast.error('Registration failed');
      return { error, success: false, data: null };
    } finally {
      setIsRegistering(false);
    }
  };
  
  const handleForgotPassword = async (email: string) => {
    try {
      const result = await forgotPassword(email);
      if (result.success) {
        toast.success('Password reset email sent');
      }
      return result;
    } catch (error) {
      console.error('Password reset failed:', error);
      toast.error('Password reset failed');
      return { error, success: false };
    }
  };
  
  const handleResetPassword = async (newPassword: string) => {
    try {
      const result = await resetPassword(newPassword);
      if (result.success) {
        toast.success('Password reset successfully');
      }
      return result;
    } catch (error) {
      console.error('Password reset failed:', error);
      toast.error('Password reset failed');
      return { error, success: false };
    }
  };
  
  const handleChangePassword = async (currentPassword: string, newPassword: string) => {
    try {
      const result = await changePassword(currentPassword, newPassword);
      if (result.success) {
        toast.success('Password changed successfully');
      }
      return result;
    } catch (error) {
      console.error('Password change failed:', error);
      toast.error('Password change failed');
      return { error, success: false };
    }
  };
  
  return {
    login: handleLogin,
    logout: handleLogout,
    register: handleRegister,
    forgotPassword: handleForgotPassword,
    resetPassword: handleResetPassword,
    changePassword: handleChangePassword,
    isLoading,
    isRegistering
  };
};
