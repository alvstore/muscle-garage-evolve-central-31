
import { toast } from 'sonner';
import { User, UserRole } from '@/types';
import { useAuthState } from './use-auth-state';
import { supabase } from '@/integrations/supabase/client';

export function useAuthActions() {
  const { setUser, setIsLoading } = useAuthState();

  const login = async (email: string, password: string, branchId?: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) throw error;
      
      if (data.user) {
        // Get user profile data
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single();
          
        if (profileError && profileError.code !== 'PGRST116') {
          throw profileError;
        }
        
        // Create user object for auth context
        const userData: User = {
          id: data.user.id,
          name: profile?.full_name || data.user.email?.split('@')[0] || 'User',
          email: data.user.email || '',
          role: (profile?.role as UserRole) || 'member',
          branchId: branchId || profile?.branch_id,
          branchIds: profile?.accessible_branch_ids || [],
          isBranchManager: profile?.is_branch_manager || false,
          avatar: profile?.avatar_url,
        };
        
        // Store user data in localStorage
        localStorage.setItem('user', JSON.stringify(userData));
        
        // Update state
        setUser(userData);
        toast.success(`Welcome, ${userData.name}!`);
      }
    } catch (error: any) {
      console.error("Login failed:", error);
      toast.error(error.message || "Login failed. Please check your credentials and try again.");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateUserBranch = async (branchId: string) => {
    const userStr = localStorage.getItem('user');
    if (!userStr) return;
    
    const userData = JSON.parse(userStr) as User;
    
    const updatedUser = {
      ...userData,
      branchId
    };
    
    // Update localStorage
    localStorage.setItem('user', JSON.stringify(updatedUser));
    
    // Update state
    setUser(updatedUser);
    
    // If the user is authenticated, update their profile in Supabase
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      await supabase
        .from('profiles')
        .update({ branch_id: branchId })
        .eq('id', updatedUser.id);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      // Remove from localStorage
      localStorage.removeItem('user');
      localStorage.removeItem('currentBranchId');
      setUser(null);
      toast.success("Logged out successfully");
    } catch (error: any) {
      console.error("Logout failed:", error);
      toast.error(error.message || "Logout failed");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Fix the return type to match the interface
  const register = async (userData: any): Promise<void> => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
          data: {
            full_name: userData.name,
            role: userData.role || 'member'
          }
        }
      });
      
      if (error) throw error;
      
      toast.success("Registration successful! You can now log in.");
    } catch (error: any) {
      console.error("Registration failed:", error);
      toast.error(error.message || "Registration failed. Please try again.");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const changePassword = async (currentPassword: string, newPassword: string) => {
    setIsLoading(true);
    try {
      // First verify the current password
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");
      
      // Update the password
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });
      
      if (error) throw error;
      
      toast.success("Password updated successfully");
      return true;
    } catch (error: any) {
      console.error("Password change failed:", error);
      toast.error(error.message || "Failed to update password");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const createAdminAccount = async () => {
    try {
      const email = "Rajat.lekhari@hotmail.com";
      const password = "Rajat@3003";
      
      // Check if the admin account already exists
      const { data: existingUsers, error: checkError } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', email)
        .eq('role', 'admin');
      
      if (checkError) throw checkError;
      
      // If admin account already exists, no need to create a new one
      if (existingUsers && existingUsers.length > 0) {
        console.log("Admin account already exists");
        return;
      }
      
      // Create the admin account
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: "Rajat Lekhari",
            role: "admin"
          }
        }
      });
      
      if (error) throw error;
      
      console.log("Admin account created successfully");
      
      // Update the profile directly to ensure role is set
      if (data.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .update({ role: 'admin' })
          .eq('id', data.user.id);
          
        if (profileError) throw profileError;
      }
    } catch (error: any) {
      console.error("Failed to create admin account:", error);
      throw error;
    }
  };

  return {
    login,
    logout,
    register,
    updateUserBranch,
    changePassword,
    createAdminAccount
  };
}
