
import api from './api';
import { toast } from 'sonner';

interface LoginCredentials {
  email: string;
  password: string;
}

interface LoginResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    [key: string]: any;
  };
}

export const authService = {
  async login(credentials: LoginCredentials): Promise<LoginResponse | null> {
    try {
      const response = await api.post<LoginResponse>('/auth/login', credentials);
      
      if (response.data.token) {
        // Store token and user data
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        
        return response.data;
      }
      
      return null;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Login failed. Please try again.';
      toast.error(errorMessage);
      throw error;
    }
  },
  
  async logout(): Promise<void> {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout API call failed:', error);
    } finally {
      // Always clear local storage regardless of API success
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  },
  
  async forgotPassword(email: string): Promise<boolean> {
    try {
      await api.post('/auth/forgot-password', { email });
      toast.success('Password reset link sent to your email');
      return true;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to send reset link. Please try again.';
      toast.error(errorMessage);
      return false;
    }
  },
  
  async resetPassword(token: string, password: string): Promise<boolean> {
    try {
      await api.post('/auth/reset-password', { token, password });
      toast.success('Password has been reset successfully');
      return true;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to reset password. Please try again.';
      toast.error(errorMessage);
      return false;
    }
  },
  
  isAuthenticated(): boolean {
    return localStorage.getItem('token') !== null;
  },
  
  getCurrentUser(): any {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch (e) {
        return null;
      }
    }
    return null;
  }
};
