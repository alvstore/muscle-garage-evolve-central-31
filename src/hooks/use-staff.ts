
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useBranch } from './use-branches';

export interface StaffMember {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: string;
  department?: string;
  branch_id?: string;
  avatar_url?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export const useStaff = () => {
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { currentBranch } = useBranch();

  const fetchStaff = useCallback(async () => {
    setIsLoading(true);
    try {
      // First, fetch staff profiles
      let query = supabase
        .from('profiles')
        .select('*')
        .in('role', ['staff', 'admin', 'trainer']); // Include trainers!
      
      if (currentBranch?.id) {
        query = query.eq('branch_id', currentBranch.id);
      }
      
      const { data: staffProfiles, error: staffError } = await query.order('full_name', { ascending: true });
      
      if (staffError) throw staffError;
      
      // Map the data to our StaffMember interface
      const formattedStaff = staffProfiles.map(member => ({
        id: member.id,
        name: member.full_name || '',
        email: member.email || '',
        phone: member.phone || '',
        role: member.role || 'staff',
        department: member.department || '',
        branch_id: member.branch_id || '',
        avatar_url: member.avatar_url || '',
        is_active: member.is_active !== undefined ? member.is_active : true,
        created_at: member.created_at || '',
        updated_at: member.updated_at || ''
      }));
      
      setStaff(formattedStaff);
    } catch (error) {
      console.error('Error fetching staff:', error);
      toast.error('Failed to fetch staff members');
    } finally {
      setIsLoading(false);
    }
  }, [currentBranch]);

  const createStaffMember = async ({ 
    email, 
    password, 
    name, 
    role 
  }: { 
    email: string; 
    password: string; 
    name: string; 
    role: string;
  }) => {
    try {
      // First create the auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
            role: role
          }
        }
      });
      
      if (authError) throw authError;
      
      return { data: authData.user, error: null };
    } catch (error: any) {
      console.error('Error creating staff member:', error);
      return { data: null, error: error.message };
    }
  };

  const updateStaffMember = async (id: string, updates: any) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: updates.name,
          email: updates.email,
          phone: updates.phone,
          role: updates.role,
          department: updates.department,
          branch_id: updates.branch_id,
          is_active: updates.is_active,
          is_branch_manager: updates.is_branch_manager,
          address: updates.address,
          city: updates.city,
          state: updates.state,
          country: updates.country,
          gender: updates.gender,
          id_type: updates.id_type,
          id_number: updates.id_number,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);
      
      if (error) throw error;
      
      toast.success('Staff member updated successfully');
      await fetchStaff();
      
      return { success: true };
    } catch (error: any) {
      console.error('Error updating staff member:', error);
      toast.error('Failed to update staff member');
      return { success: false, error: error.message };
    }
  };

  const deleteStaffMember = async (id: string) => {
    try {
      // This will cascade delete from auth.users due to references
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      toast.success('Staff member deleted successfully');
      await fetchStaff();
      
      return { success: true };
    } catch (error: any) {
      console.error('Error deleting staff member:', error);
      toast.error('Failed to delete staff member');
      return { success: false, error: error.message };
    }
  };

  return {
    staff,
    isLoading,
    fetchStaff,
    createStaffMember,
    updateStaffMember,
    deleteStaffMember
  };
};
