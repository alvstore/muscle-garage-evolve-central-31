
import { useAuth } from './use-auth';

export function useAuthActions() {
  const { login, logout, register, forgotPassword, resetPassword, changePassword, isLoading } = useAuth();

  return {
    login,
    logout,
    register,
    forgotPassword,
    resetPassword,
    changePassword,
    isLoading
  };
}
