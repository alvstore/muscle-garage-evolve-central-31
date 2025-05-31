
import { useAuth } from '@/hooks/auth/use-auth';

/**
 * Extracts auth actions from the auth context for easier access
 */
export const useAuthActions = () => {
  const { login, logout, register, forgotPassword, resetPassword, changePassword, isLoading } = useAuth();
  
  // Wrap the login function to ensure it returns a consistent result format
  const handleLogin = async (email: string, password: string) => {
    try {
      const result = await login(email, password);
      // If login doesn't return anything, create a default success result
      return result || { error: null, success: true };
    } catch (error: any) {
      return { error: error.message || 'Login failed', success: false };
    }
  };
  
  return {
    login: handleLogin,
    logout,
    register,
    forgotPassword,
    resetPassword,
    changePassword,
    isLoading
  };
};
