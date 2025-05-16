
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

export function useAuthActions() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const toast = useToast();

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Mock login for now, implement real auth later
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // If login successful
      toast.success('Login successful! Redirecting...');
      navigate('/dashboard');
      return true;
    } catch (error) {
      console.error('Login failed:', error);
      toast.error('Login failed. Please check your credentials and try again.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string, name: string) => {
    setIsLoading(true);
    try {
      // Mock registration
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // If registration successful
      toast.success('Registration successful! Please check your email to verify your account.');
      return true;
    } catch (error) {
      console.error('Registration failed:', error);
      toast.error('Registration failed. Please try again.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      // Mock logout
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // If logout successful
      // Using warning instead of info since info might not exist
      toast.success('You have been logged out successfully.');
      navigate('/login');
      return true;
    } catch (error) {
      console.error('Logout failed:', error);
      toast.error('Logout failed. Please try again.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    setIsLoading(true);
    try {
      // Mock password reset
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // If password reset email sent
      toast.success('Password reset link sent to your email.');
      return true;
    } catch (error) {
      console.error('Password reset request failed:', error);
      toast.error('Failed to send password reset link. Please try again.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    login,
    register,
    logout,
    resetPassword
  };
}
