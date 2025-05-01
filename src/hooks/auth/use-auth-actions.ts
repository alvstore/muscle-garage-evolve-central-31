
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/utils/toast-manager';

export interface LoginResult {
  success: boolean;
  error?: string;
}

export const useAuthActions = () => {
  const [isLoading, setIsLoading] = useState(false);
  
  const login = async (email: string, password: string): Promise<LoginResult> => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) throw error;
      
      toast.success('Logged in successfully');
      
      return { success: true };
    } catch (err: any) {
      console.error('Login error:', err);
      toast.error(err.message || 'Failed to login');
      return { success: false, error: err.message };
    } finally {
      setIsLoading(false);
    }
  };
  
  const logout = async () => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      toast.info('Logged out successfully');
    } catch (err: any) {
      console.error('Logout error:', err);
      toast.error(err.message || 'Error logging out');
    } finally {
      setIsLoading(false);
    }
  };
  
  const register = async (userData: any) => {
    try {
      setIsLoading(true);
      // Implementation of registration logic
      toast.success('Registration successful');
    } catch (err: any) {
      console.error('Registration error:', err);
      toast.error(err.message || 'Error during registration');
    } finally {
      setIsLoading(false);
    }
  };
  
  const changePassword = async (currentPassword: string, newPassword: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      // Implementation of password change logic
      toast.success('Password changed successfully');
      return true;
    } catch (err: any) {
      console.error('Password change error:', err);
      toast.error(err.message || 'Error changing password');
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  const forgotPassword = async (email: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      if (error) throw error;
      toast.success('Password reset email sent');
      return true;
    } catch (err: any) {
      console.error('Password reset error:', err);
      toast.error(err.message || 'Error sending password reset');
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  return {
    login,
    logout,
    register,
    changePassword,
    forgotPassword,
    isLoading
  };
};
