
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './use-auth';

export const useAuthActions = () => {
  const navigate = useNavigate();
  const { refreshSession } = useAuth();

  const login = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast.error(error.message);
        return { success: false, error: error.message };
      }

      toast.success('Logged in successfully!');
      await refreshSession();
      navigate('/dashboard');
      return { success: true };
    } catch (error: any) {
      toast.error(error.message || 'An error occurred during login');
      return { success: false, error: error.message };
    }
  };

  const signup = async (email: string, password: string, fullName: string, role: string = 'member') => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            role,
          },
        },
      });

      if (error) {
        toast.error(error.message);
        return { success: false, error: error.message };
      }

      toast.success('Account created successfully! Please check your email for verification.');
      return { success: true };
    } catch (error: any) {
      toast.error(error.message || 'An error occurred during signup');
      return { success: false, error: error.message };
    }
  };

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        toast.error(error.message);
        return;
      }
      toast.success('Logged out successfully!');
      navigate('/');
    } catch (error: any) {
      toast.error(error.message || 'An error occurred during logout');
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        toast.error(error.message);
        return { success: false, error: error.message };
      }

      toast.success('Password reset instructions sent to your email');
      return { success: true };
    } catch (error: any) {
      toast.error(error.message || 'An error occurred');
      return { success: false, error: error.message };
    }
  };

  const updatePassword = async (password: string) => {
    try {
      const { error } = await supabase.auth.updateUser({
        password,
      });

      if (error) {
        toast.error(error.message);
        return false;
      }

      toast.success('Password updated successfully!');
      return true;
    } catch (error: any) {
      toast.error(error.message || 'An error occurred');
      return false;
    }
  };

  const getUserRole = async (): Promise<string | null> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) return null;

      const { data, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Error fetching user role:', error);
        return null;
      }

      return data?.role || null;
    } catch (error) {
      console.error('Error in getUserRole:', error);
      return null;
    }
  };

  return {
    login,
    signup,
    logout,
    resetPassword,
    updatePassword,
    getUserRole,
  };
};
