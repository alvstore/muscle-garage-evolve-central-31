import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { AuthUser, UserRole } from '@/types';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

interface Profile {
  id: string;
  email?: string;
  name?: string;
  role?: UserRole;
  branch_id?: string;
  accessible_branch_ids?: string[];
}

// Extended AuthUser that includes name
interface ExtendedAuthUser extends AuthUser {
  name?: string;
  email: string;
  branch_id?: string;
}

type AuthContextType = {
  user: ExtendedAuthUser | null;
  userRole: UserRole | null;
  profile: Profile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean, message?: string }>;
  logout: () => Promise<void>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<{ success: boolean, message?: string }>;
  loadProfile: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  userRole: null,
  profile: null,
  isLoading: true,
  isAuthenticated: false,
  login: async () => ({ success: false }),
  logout: async () => {},
  changePassword: async () => ({ success: false }),
  loadProfile: async () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<ExtendedAuthUser | null>(null);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, []);

  const loadProfile = async () => {
    setIsLoading(true);
    try {
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('id, name, role, branch_id, accessible_branch_ids, email')
        .eq('id', user?.id)
        .single();

      if (profileError) {
        throw profileError;
      }

      setProfile({
        id: profileData.id,
        name: profileData.name,
        email: profileData.email,
        role: profileData.role as UserRole,
        branch_id: profileData.branch_id,
        accessible_branch_ids: profileData.accessible_branch_ids,
      });
      setUserRole(profileData.role as UserRole);
    } catch (error: any) {
      console.error("Error loading profile:", error);
      toast.error(`Failed to load profile: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      loadProfile();
    }
  }, [user]);

  const login = async (email: string, password: string): Promise<{ success: boolean, message?: string }> => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (error) {
        throw error;
      }

      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('id, name, role, branch_id, accessible_branch_ids, email')
        .eq('id', data.user?.id)
        .single();

      if (profileError) {
        throw profileError;
      }

      const extendedUser: ExtendedAuthUser = {
        id: data.user!.id,
        email: profileData.email,
        name: profileData.name,
        branch_id: profileData.branch_id,
        role: profileData.role as UserRole,
        aud: data.user!.aud,
        iss: data.user!.iss,
        app_metadata: data.user!.app_metadata,
        user_metadata: data.user!.user_metadata,
        created_at: data.user!.created_at,
        updated_at: data.user!.updated_at,
      };

      setUser(extendedUser);
      setUserRole(profileData.role as UserRole);
      setProfile({
        id: profileData.id,
        name: profileData.name,
        email: profileData.email,
        role: profileData.role as UserRole,
        branch_id: profileData.branch_id,
        accessible_branch_ids: profileData.accessible_branch_ids,
      });
      setIsAuthenticated(true);
      localStorage.setItem('user', JSON.stringify(extendedUser));
      toast.success(`Welcome, ${profileData.name}!`);
      return { success: true };
    } catch (error: any) {
      console.error("Login failed:", error);
      toast.error(`Login failed: ${error.message}`);
      return { success: false, message: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        throw error;
      }

      setUser(null);
      setUserRole(null);
      setProfile(null);
      setIsAuthenticated(false);
      localStorage.removeItem('user');
      toast.success("Logged out successfully.");
      navigate('/login');
    } catch (error: any) {
      console.error("Logout failed:", error);
      toast.error(`Logout failed: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const changePassword = async (currentPassword: string, newPassword: string): Promise<{ success: boolean, message?: string }> => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.updateUser({
        password: newPassword,
        data: {
          currentPassword: currentPassword,
        },
      });

      if (error) {
        throw error;
      }

      toast.success("Password changed successfully!");
      return { success: true };
    } catch (error: any) {
      console.error("Password change failed:", error);
      toast.error(`Password change failed: ${error.message}`);
      return { success: false, message: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  const value: AuthContextType = {
    user,
    userRole,
    profile,
    isLoading,
    isAuthenticated,
    login,
    logout,
    changePassword,
    loadProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
