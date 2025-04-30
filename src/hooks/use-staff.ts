
import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useBranch } from './use-branch';
import { toast } from 'sonner';

export interface StaffMember {
  id: string;
  name: string;
  email: string;
  role: string;
  branch_id?: string;
  phone?: string;
  department?: string;
  is_active?: boolean;
  user_id?: string;
  created_at?: string;
  updated_at?: string;
  is_branch_manager?: boolean;
}

export const useStaff = () => {
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { currentBranch } = useBranch();

  const fetchStaff = useCallback(async () => {
    if (!currentBranch?.id) {
      console.log('No branch selected, cannot fetch staff');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    try {
      // Get the current user to determine role
      const { data: { user } } = await supabase.auth.getUser();
      
      // Get user profile to check if admin
      const { data: userProfile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user?.id)
        .single();
        
      if (profileError) {
        console.error('Error fetching user profile:', profileError);
      }
      
      const isAdmin = userProfile?.role === 'admin';
      
      let query = supabase
        .from('profiles')
        .select('*')
        .in('role', ['staff', 'trainer'])
        .eq('branch_id', currentBranch.id);
      
      // Only admins can see other admins
      if (isAdmin) {
        query = supabase
          .from('profiles')
          .select('*')
          .in('role', ['admin', 'staff', 'trainer'])
          .eq('branch_id', currentBranch.id);
      }
        
      const { data, error } = await query;
      
      if (error) {
        throw error;
      }
      
      if (data) {
        const formattedStaff: StaffMember[] = data.map(item => ({
          id: item.id,
          name: item.full_name || '',
          email: item.email || '',
          role: item.role,
          branch_id: item.branch_id,
          phone: item.phone,
          department: item.department,
          is_active: true,
          user_id: item.id,
          created_at: item.created_at,
          updated_at: item.updated_at,
          is_branch_manager: item.is_branch_manager || false
        }));
        
        setStaff(formattedStaff);
      }
    } catch (err: any) {
      console.error('Error fetching staff:', err);
      setError(err);
      toast.error('Failed to fetch staff members');
    } finally {
      setIsLoading(false);
    }
  }, [currentBranch?.id]);

  useEffect(() => {
    if (currentBranch?.id) {
      fetchStaff();
    }
  }, [fetchStaff, currentBranch?.id]);

  const createStaffMember = async (userData: { email: string, password: string, name: string, role: string }): Promise<{ error?: string, success?: boolean }> => {
    try {
      setIsLoading(true);
      
      if (!currentBranch?.id) {
        throw new Error('No branch selected, cannot create staff member');
      }
      
      // Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
          data: {
            full_name: userData.name,
            role: userData.role
          }
        }
      });
      
      if (authError) {
        throw authError;
      }
      
      if (!authData.user) {
        throw new Error('Failed to create user');
      }
      
      // Update profile with additional information
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          full_name: userData.name,
          role: userData.role,
          branch_id: currentBranch.id
        })
        .eq('id', authData.user.id);
      
      if (profileError) {
        throw profileError;
      }
      
      await fetchStaff();
      toast.success('Staff member created successfully');
      
      return { success: true };
    } catch (err: any) {
      console.error('Error creating staff member:', err);
      toast.error('Failed to create staff member');
      return { error: err.message || 'An error occurred' };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    staff,
    isLoading,
    error,
    fetchStaff,
    createStaffMember
  };
};
