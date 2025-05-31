
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useAuthActions = () => {
  const [isLoading, setIsLoading] = useState(false);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast.error(error.message);
        return { success: false, error };
      }

      toast.success('Logged in successfully');
      return { success: true, data };
    } catch (error: any) {
      toast.error('An unexpected error occurred');
      return { success: false, error };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        toast.error(error.message);
      } else {
        toast.success('Logged out successfully');
      }
    } catch (error: any) {
      toast.error('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string, userData: any) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData
        }
      });

      if (error) {
        toast.error(error.message);
        return { success: false, error };
      }

      toast.success('Account created successfully');
      return { success: true, data };
    } catch (error: any) {
      toast.error('An unexpected error occurred');
      return { success: false, error };
    } finally {
      setIsLoading(false);
    }
  };

  const forgotPassword = async (email: string) => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      
      if (error) {
        toast.error(error.message);
        return { success: false, error };
      }

      toast.success('Password reset email sent');
      return { success: true };
    } catch (error: any) {
      toast.error('An unexpected error occurred');
      return { success: false, error };
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    return forgotPassword(email);
  };

  const changePassword = async (currentPassword: string, newPassword: string) => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) {
        toast.error(error.message);
        return { success: false, error };
      }

      toast.success('Password changed successfully');
      return { success: true };
    } catch (error: any) {
      toast.error('An unexpected error occurred');
      return { success: false, error };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    login,
    logout,
    register,
    forgotPassword,
    resetPassword,
    changePassword,
  };
};
