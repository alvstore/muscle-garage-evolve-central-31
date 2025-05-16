import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { AuthError, User } from '@supabase/supabase-js';

export interface LoginResult {
  success: boolean;
  error?: string;
  user?: User;
}

export interface UseAuthActionsReturn {
  login: (email: string, password: string) => Promise<LoginResult>;
  logout: () => Promise<boolean>;
  register: (email: string, password: string, name: string) => Promise<boolean>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<boolean>;
  forgotPassword: (email: string) => Promise<boolean>;
  resetPassword: (email: string) => Promise<string>;
  isLoading: boolean;
}

interface UserResponse {
  user?: User | null;
  error?: AuthError | null;
}

export const useAuthActions = (): UseAuthActionsReturn => {
  const [isLoading, setIsLoading] = useState(false);

  const login = async (email: string, password: string): Promise<LoginResult> => {
    try {
      setIsLoading(true);
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (authError) {
        toast.error(authError.message);
        return { success: false, error: authError.message };
      }

      if (authData?.user) {
        toast.success('Login successful');
        return { success: true, user: authData.user };
      }

      return { success: false, error: 'Failed to authenticate.' };
    } catch (error: any) {
      toast.error(error.message || 'Login failed');
      return { success: false, error: error.message || 'Unknown error occurred' };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<boolean> => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        toast.error(error.message);
        return false;
      }
      
      toast.success('Logged out successfully');
      return true;
    } catch (error: any) {
      toast.error(error.message || 'Logout failed');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string, name: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      // Register the user
      const { data: userData, error: registerError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: name }
        }
      });
      
      if (registerError) {
        toast.error(registerError.message);
        return false;
      }
      
      if (!userData.user) {
        toast.error('Failed to create user');
        return false;
      }
      
      toast.success('Registration successful');
      return true;
    } catch (error: any) {
      toast.error(error.message || 'Registration failed');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const changePassword = async (currentPassword: string, newPassword: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      // First verify current password by attempting to sign in
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: supabase.auth.getUser().then(({ data }) => data.user?.email || ''),
        password: currentPassword
      });
      
      if (signInError) {
        toast.error('Current password is incorrect');
        return false;
      }
      
      // Change password
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword
      });
      
      if (updateError) {
        toast.error(updateError.message);
        return false;
      }
      
      toast.success('Password updated successfully');
      return true;
    } catch (error: any) {
      toast.error(error.message || 'Password change failed');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const forgotPassword = async (email: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      });
      
      if (error) {
        toast.error(error.message);
        return false;
      }
      
      toast.success('Password reset email sent');
      return true;
    } catch (error: any) {
      toast.error(error.message || 'Password reset failed');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassword = async (email: string): Promise<string> => {
    try {
      const { data, error } = await supabase.auth.resetPasswordForEmail(email);
      
      if (error) {
        toast.error(error.message);
        throw error;
      }
      
      toast.success('Password reset link sent to your email');
      return 'Reset link sent successfully';  // Return a string directly instead of a Promise<string>
    } catch (error: any) {
      toast.error(error.message || 'Failed to send reset link');
      throw error;
    }
  };

  return {
    login,
    logout,
    register,
    changePassword,
    forgotPassword,
    resetPassword,
    isLoading
  };
};
