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
  avatar_url?: string;
}

export const useStaff = () => {
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { currentBranch } = useBranch();

  const fetchStaff = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      // If no branch selected, fetch all staff for admin users
      let query = supabase
        .from('profiles')
        .select('*')
        .in('role', ['admin', 'staff', 'trainer']);
        
      // If branch is selected, filter by branch
      if (currentBranch?.id) {
        query = query.eq('branch_id', currentBranch.id);
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
          is_active: item.is_active !== false,
          user_id: item.id,
          created_at: item.created_at,
          updated_at: item.updated_at,
          is_branch_manager: item.is_branch_manager || false,
          avatar_url: item.avatar_url
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
    fetchStaff();
  }, [fetchStaff]);

  const createStaffMember = async (userData: { 
    email: string;
    password: string;
    name: string;
    role: string;
    phone?: string;
    department?: string;
  }): Promise<{ error?: string, success?: boolean }> => {
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
          branch_id: currentBranch.id,
          phone: userData.phone,
          department: userData.department,
          is_active: true
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

  const updateStaffMember = async (id: string, updates: Partial<StaffMember>): Promise<StaffMember | null> => {
    try {
      setIsLoading(true);
      
      // Prepare profile data updates
      const profileUpdates: any = {};
      if (updates.name) profileUpdates.full_name = updates.name;
      if (updates.email) profileUpdates.email = updates.email;
      if (updates.role) profileUpdates.role = updates.role;
      if (updates.phone) profileUpdates.phone = updates.phone;
      if (updates.department) profileUpdates.department = updates.department;
      if (updates.is_active !== undefined) profileUpdates.is_active = updates.is_active;
      if (updates.is_branch_manager !== undefined) profileUpdates.is_branch_manager = updates.is_branch_manager;
      
      // Ensure staff stays in their branch
      delete profileUpdates.branch_id;
      
      const { data, error } = await supabase
        .from('profiles')
        .update(profileUpdates)
        .eq('id', id)
        .select()
        .single();
        
      if (error) throw error;
      
      // Update local state
      setStaff(prev => prev.map(staff => 
        staff.id === id 
          ? {
              ...staff,
              name: data.full_name || staff.name,
              email: data.email || staff.email,
              role: data.role || staff.role,
              phone: data.phone,
              department: data.department,
              is_active: data.is_active !== false,
              is_branch_manager: data.is_branch_manager || false,
              updated_at: data.updated_at
            } 
          : staff
      ));
      
      toast.success('Staff member updated successfully');
      return data as unknown as StaffMember;
    } catch (err: any) {
      console.error('Error updating staff member:', err);
      toast.error(err.message || 'Failed to update staff member');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteStaffMember = async (id: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      // Instead of actually deleting, deactivate the staff member
      const { error } = await supabase
        .from('profiles')
        .update({ is_active: false })
        .eq('id', id);
      
      if (error) throw error;
      
      // Update local state
      setStaff(prev => prev.filter(staff => staff.id !== id));
      
      toast.success('Staff member deleted successfully');
      return true;
    } catch (err: any) {
      console.error('Error deleting staff member:', err);
      toast.error(err.message || 'Failed to delete staff member');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    staff,
    isLoading,
    error,
    fetchStaff,
    createStaffMember,
    updateStaffMember,
    deleteStaffMember
  };
};
