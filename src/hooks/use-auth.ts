
import { useState, useCallback } from 'react';
import { supabase } from '@/services/supabaseClient';

export const useAuth = () => {
  const [isLoading, setIsLoading] = useState(false);
  
  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      
      return { success: true, error: null };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    setIsLoading(true);
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const register = useCallback(async (email: string, password: string, userData: any) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData
        }
      });
      
      if (error) throw error;
      
      return { success: true, data, error: null };
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, data: null, error };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const forgotPassword = useCallback(async (email: string) => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      
      if (error) throw error;
      
      return { success: true, error: null };
    } catch (error) {
      console.error('Password reset error:', error);
      return { success: false, error };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const resetPassword = useCallback(async (newPassword: string) => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });
      
      if (error) throw error;
      
      return { success: true, error: null };
    } catch (error) {
      console.error('Password update error:', error);
      return { success: false, error };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const changePassword = useCallback(async (currentPassword: string, newPassword: string) => {
    setIsLoading(true);
    try {
      // First verify current password by trying to sign in
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: (await supabase.auth.getUser()).data.user?.email as string,
        password: currentPassword,
      });
      
      if (signInError) throw new Error('Current password is incorrect');
      
      // Then update to new password
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });
      
      if (error) throw error;
      
      return { success: true, error: null };
    } catch (error) {
      console.error('Password change error:', error);
      return { success: false, error };
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    isLoading,
    login,
    logout,
    register,
    forgotPassword,
    resetPassword,
    changePassword
  };
};

export default useAuth;
