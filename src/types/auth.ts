
export interface User {
  id: string;
  email: string;
  full_name?: string;
  name?: string;
  avatar?: string;
  role?: string;
}

export interface AuthHook {
  user: User | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error: any }>;
  logout: () => Promise<void>;
  register: (email: string, password: string, userData: any) => Promise<{ success: boolean; error: any }>;
  forgotPassword: (email: string) => Promise<{ success: boolean; error: any }>;
  resetPassword: (email: string) => Promise<{ success: boolean; error: any }>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<{ success: boolean; error: any }>;
  isLoading: boolean;
  isAuthenticated: boolean;
}
