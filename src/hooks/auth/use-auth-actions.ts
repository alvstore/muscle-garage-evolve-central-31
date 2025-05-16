
import { useAuth } from '@/hooks/use-auth';
import { toast } from 'sonner';

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
