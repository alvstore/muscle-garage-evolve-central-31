
import { useState } from 'react';
import { supabase } from '@/services/supabaseClient';
import { toast } from 'sonner';

interface LoginResult {
  success: boolean;
  error?: string;
}

export const useAuthActions = () => {
  const [isLoading, setIsLoading] = useState(false);

  const login = async (email: string, password: string): Promise<LoginResult> => {
    try {
      setIsLoading(true);
      
      // Try to sign in with provided credentials
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
      
      // Check if we got a user and session back
      if (!data.user || !data.session) {
        return { 
          success: false, 
          error: 'No user found with these credentials' 
        };
      }
      
      try {
        // Fetch the user profile to ensure it exists and can be accessed
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single();
          
        if (profileError) {
          console.error('Error fetching user profile:', profileError);
          return { 
            success: true, // Still allow login but warn about profile issue
            error: "Login successful but profile data couldn't be loaded"
          };
        }
        
        return { success: true };
      } catch (profileErr: any) {
        console.error('Error fetching user profile:', profileErr);
        return { 
          success: true, // Still allow login but warn about profile issue
          error: "Login successful but profile data couldn't be loaded"
        };
      }
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
  
  const updateUserBranch = (branchId: string) => {
    // This would update the user's branch in the profile
    // Implementation would depend on your specific requirements
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

  return {
    login,
    logout,
    register,
    updateUserBranch,
    changePassword,
    isLoading
  };
};
