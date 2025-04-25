
import { createContext, useContext, ReactNode } from 'react';
import { User as SupabaseUser } from '@supabase/supabase-js';
import { User, UserRole } from '@/types';
import { AuthStateProvider, useAuthState } from './auth/use-auth-state';
import { useAuthActions, LoginResult } from './auth/use-auth-actions';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string, branchId?: string) => Promise<LoginResult>;
  logout: () => Promise<void>;
  register: (userData: any) => Promise<void>;
  updateUserBranch: (branchId: string) => void;
  changePassword: (currentPassword: string, newPassword: string) => Promise<boolean>;
  userRole?: UserRole;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => ({ success: false }),
  logout: async () => {},
  register: async () => {},
  updateUserBranch: () => {},
  changePassword: async () => false,
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  return (
    <AuthStateProvider>
      <AuthProviderInner>{children}</AuthProviderInner>
    </AuthStateProvider>
  );
};

// Inner provider that uses both state and actions
const AuthProviderInner = ({ children }: { children: ReactNode }) => {
  const { user, isAuthenticated, isLoading } = useAuthState();
  const { login, logout, register, updateUserBranch, changePassword } = useAuthActions();
  
  // Map Supabase user to our User type
  const mappedUser: User | null = user ? {
    id: user.id,
    email: user.email ?? '',
    name: user.user_metadata?.full_name ?? '',
    role: (user.user_metadata?.role as UserRole) || 'member',
    branchId: user.user_metadata?.branch_id,
  } : null;
  
  return (
    <AuthContext.Provider
      value={{
        user: mappedUser,
        isAuthenticated,
        isLoading,
        login,
        logout,
        register,
        updateUserBranch,
        changePassword,
        userRole: mappedUser?.role,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
