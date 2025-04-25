
import { createContext, useContext, ReactNode } from 'react';
import { User, UserRole } from '@/types';
import { AuthStateProvider, useAuthState } from './auth/use-auth-state';
import { useAuthActions } from './auth/use-auth-actions';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string, branchId?: string) => Promise<void>;
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
  login: async () => {},
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
  
  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        login,
        logout,
        register,
        updateUserBranch,
        changePassword,
        userRole: user?.role,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
