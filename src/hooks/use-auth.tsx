
import { createContext, useContext, ReactNode } from 'react';
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
  const [profileError, setProfileError] = useState<Error | null>(null);
  
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user) {
        setProfile(null);
        return;
      }
      
      try {
        setIsLoadingProfile(true);
        setProfileError(null);
        
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        
        if (error) {
          console.error('Error fetching profile:', error);
          setProfileError(new Error(error.message));
          toast.error('Failed to load user profile data');
        } else if (data) {
          setProfile(data);
        }
      } catch (err: any) {
        console.error('Profile fetch error:', err);
        setProfileError(err);
      } finally {
        setIsLoadingProfile(false);
      }
    };
    
    fetchUserProfile();
    
    // Set up real-time subscription for profile changes
    const profileSubscription = supabase
      .channel('profile-changes')
      .on('postgres_changes', { 
        event: 'UPDATE', 
        schema: 'public', 
        table: 'profiles',
        filter: user ? `id=eq.${user.id}` : undefined
      }, (payload) => {
        if (payload.new && user && payload.new.id === user.id) {
          setProfile(payload.new as Profile);
        }
      })
      .subscribe();
    
    return () => {
      profileSubscription.unsubscribe();
    };
  }, [user]);

  const updateUserBranch = async (branchId: string): Promise<boolean> => {
    if (!user) return false;
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ branch_id: branchId })
        .eq('id', user.id);
      
      if (error) throw error;

      // Update will happen automatically through subscription
      return true;
    } catch (err) {
      console.error('Error updating user branch:', err);
      return false;
    }
  };
  
  // Map Supabase user to our User type
  const mappedUser: AppUser | null = user && profile ? {
    id: user.id,
    email: user.email ?? profile.email ?? '',
    name: profile.full_name ?? '',
    role: profile.role || 'member',
    branch_id: profile.branch_id,
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
