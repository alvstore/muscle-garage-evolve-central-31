
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

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
      
      if (error) {
        console.error('Login error:', error);
        return { 
          success: false, 
          error: error.message || 'Invalid credentials' 
        };
      }
      
      if (!data.user || !data.session) {
        return { 
          success: false, 
          error: 'No user found with these credentials' 
        };
      }
      
      return { success: true };
    } catch (err: any) {
      console.error('Login failed:', err);
      return { 
        success: false, 
        error: err.message || 'Login failed. Please try again.'
      };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    setIsLoading(true);
    try {
      await supabase.auth.signOut();
      toast.success('Logged out successfully');
    } catch (error: any) {
      console.error('Logout error:', error);
      toast.error(error.message || 'Failed to logout');
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: any): Promise<void> => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
          data: {
            full_name: userData.fullName,
            role: userData.role || 'member'
          }
        }
      });

      if (error) throw error;
      
      if (!data.user) {
        throw new Error('Failed to create user account');
      }

      toast.success('Registration successful');
    } catch (error: any) {
      console.error('Registration error:', error);
      toast.error(error.message || 'Registration failed');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  
  const changePassword = async (currentPassword: string, newPassword: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) throw error;

      toast.success('Password updated successfully');
      return true;
    } catch (error: any) {
      console.error('Password change error:', error);
      toast.error(error.message || 'Failed to change password');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const forgotPassword = async (email: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;

      toast.success('Password reset instructions sent to your email');
      return true;
    } catch (error: any) {
      console.error('Forgot password error:', error);
      toast.error(error.message || 'Failed to send reset instructions');
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
