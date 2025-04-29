
import { createContext, useContext, ReactNode, useMemo } from 'react';
import { User } from '@supabase/supabase-js';
import { User as AppUser, UserRole } from '@/types';
import { AuthStateProvider, useAuthState } from './auth/use-auth-state';
import { useAuthActions, LoginResult } from './auth/use-auth-actions';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Profile {
  id: string;
  full_name?: string;
  role: UserRole;
  branch_id?: string;
  accessible_branch_ids?: string[];
  is_branch_manager?: boolean;
  email?: string;
  avatar_url?: string;
  phone?: string;
}

interface AuthContextType {
  user: AppUser | null;
  userRole: UserRole | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<LoginResult>;
  logout: () => Promise<void>;
  register: (userData: any) => Promise<void>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<boolean>;
  forgotPassword: (email: string) => Promise<boolean>;
  profile: Profile | null;
  updateUserBranch: (branchId: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  userRole: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => ({ success: false }),
  logout: async () => {},
  register: async () => {},
  changePassword: async () => false,
  forgotPassword: async () => false,
  profile: null,
  updateUserBranch: async () => false,
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  return (
    <AuthStateProvider>
      <AuthProviderInner>{children}</AuthProviderInner>
    </AuthStateProvider>
  );
};

const AuthProviderInner = ({ children }: { children: ReactNode }) => {
  const { user, isAuthenticated, isLoading: authStateLoading } = useAuthState();
  const { login, logout, register, changePassword, forgotPassword, isLoading: authActionsLoading } = useAuthActions();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (user) {
        setIsLoadingProfile(true);
        try {
          const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();
          
          if (error) {
            console.error('Error fetching profile:', error);
            toast.error('Failed to load user profile data');
          } else if (data) {
            setProfile(data);
            console.log('Profile loaded:', data);
          }
        } catch (err) {
          console.error('Profile fetch error:', err);
        } finally {
          setIsLoadingProfile(false);
        }
      } else {
        setProfile(null);
      }
    };
    
    fetchUserProfile();
  }, [user]);

  const updateUserBranch = async (branchId: string): Promise<boolean> => {
    if (!user) return false;
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ branch_id: branchId })
        .eq('id', user.id);
      
      if (error) throw error;
      
      // Update local profile state
      setProfile(prev => prev ? { ...prev, branch_id: branchId } : null);
      toast.success('Branch updated successfully');
      
      return true;
    } catch (err) {
      console.error('Error updating user branch:', err);
      toast.error('Failed to update branch');
      return false;
    }
  };
  
  // Map Supabase user to our User type
  const mappedUser: AppUser | null = user && profile ? {
    id: user.id,
    email: user.email ?? profile.email ?? '',
    name: profile.full_name ?? '',
    role: profile.role || 'member',
    branchId: profile.branch_id,
    avatar: profile.avatar_url,
    phone: profile.phone,
    isBranchManager: profile.is_branch_manager || false,
    branchIds: profile.accessible_branch_ids || []
  } : null;
  
  const isLoading = authStateLoading || authActionsLoading || isLoadingProfile;
  
  return (
    <AuthContext.Provider
      value={{
        user: mappedUser,
        userRole: profile?.role || null,
        isAuthenticated,
        isLoading,
        login,
        logout,
        register,
        changePassword,
        forgotPassword,
        profile,
        updateUserBranch
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
// Custom hook to get userRole from profile
export function useUserRole() {
  const { profile } = useAuth();
  return useMemo(() => {
    if (!profile) return undefined;
    if (profile.role === 'admin') return 'admin';
    return profile.role as UserRole;
  }, [profile]);
}
