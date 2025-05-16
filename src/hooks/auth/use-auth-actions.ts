
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface LoginResult {
  success: boolean;
  message?: string;
  user?: any;
}

export interface UseAuthActionsReturn {
  isLoading: boolean;
  login: (email: string, password: string) => Promise<LoginResult>;
  logout: () => Promise<void>;
  register: (userData: any) => Promise<void>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<boolean>;
  forgotPassword: (email: string) => Promise<boolean>;
}

export const useAuthActions = (): UseAuthActionsReturn => {
  const [isLoading, setIsLoading] = useState(false);

  const login = async (email: string, password: string): Promise<LoginResult> => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast.error(error.message);
        return { success: false, message: error.message };
      }

      toast.success('Logged in successfully');
      return { success: true, user: data.user };
    } catch (err: any) {
      console.error('Login error:', err);
      toast.error(err.message || 'Login failed');
      return { success: false, message: err.message };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        toast.error(error.message);
        return;
      }
      
      toast.success('Logged out successfully');
    } catch (err: any) {
      console.error('Logout error:', err);
      toast.error(err.message || 'Logout failed');
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: any): Promise<void> => {
    setIsLoading(true);
    try {
      // Extract email and password from userData
      const { email, password, ...profileData } = userData;
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            // Optional additional data to store with the user
            ...profileData
          }
        }
      });

      if (error) {
        toast.error(error.message);
        return;
      }

      toast.success('Registration successful! Please check your email to verify your account.');
    } catch (err: any) {
      console.error('Registration error:', err);
      toast.error(err.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  const changePassword = async (currentPassword: string, newPassword: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      // First verify current password by trying to sign in
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: supabase.auth.getUser().data.user?.email || '',
        password: currentPassword,
      });

      if (signInError) {
        toast.error('Current password is incorrect');
        return false;
      }
      
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        toast.error(error.message);
        return false;
      }

      toast.success('Password updated successfully');
      return true;
    } catch (err: any) {
      console.error('Password change error:', err);
      toast.error(err.message || 'Password change failed');
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  const forgotPassword = async (email: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + '/reset-password',
      });

      if (error) {
        toast.error(error.message);
        return false;
      }

      toast.success('Password reset instructions sent to your email');
      return true;
    } catch (err: any) {
      console.error('Forgot password error:', err);
      toast.error(err.message || 'Reset password request failed');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    login,
    logout,
    register,
    changePassword,
    forgotPassword,
  };
};
