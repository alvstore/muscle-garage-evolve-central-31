
import { useAuth } from '@/hooks/use-auth';

/**
 * Extracts auth actions from the auth context for easier access
 */
export const useAuthActions = () => {
  const { login, logout, register, forgotPassword, resetPassword, changePassword } = useAuth();
  
  return {
    login,
    logout,
    register,
    forgotPassword,
    resetPassword,
    changePassword
  };
};
