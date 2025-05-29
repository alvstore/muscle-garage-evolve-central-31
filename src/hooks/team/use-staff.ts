
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useBranch } from '@/hooks/settings/use-branches';

export interface StaffMember {
  id: string;
  full_name: string;
  email: string;
  phone?: string;
  role: string;
  department?: string;
  branch_id?: string;
  avatar_url?: string;
  is_active: boolean;
  id_type?: string;
  id_number?: string;
  created_at: string;
  updated_at: string;
  // For backward compatibility
  name?: string;
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
      const formattedStaff = staffProfiles.map(member => {
        const fullName = member.full_name || '';
        return {
          id: member.id,
          full_name: fullName,
          name: fullName, // For backward compatibility
          email: member.email || '',
          phone: member.phone || '',
          role: member.role || 'staff',
          department: member.department || '',
          branch_id: member.branch_id || '',
          avatar_url: member.avatar_url || '',
          is_active: member.is_active !== undefined ? member.is_active : true,
          id_type: member.id_type || '',
          id_number: member.id_number || '',
          created_at: member.created_at || '',
          updated_at: member.updated_at || ''
        };
      });
      
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
    role,
    branch_id,
    department = '',
    phone = '',
    id_type = '',
    id_number = ''
  }: { 
    email: string; 
    password: string; 
    name: string; 
    role: string;
    branch_id?: string;
    department?: string;
    phone?: string;
    id_type?: string;
    id_number?: string;
  }) => {
    try {
      // Start a transaction
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
      
      if (!authData.user) {
        throw new Error('Failed to create user account');
      }
      
      const userId = authData.user.id;
      
      // Insert into profiles table
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: userId,
          full_name: name,
          email: email,
          phone: phone,
          role: role,
          branch_id: branch_id || null,
          department: department,
          id_type: id_type || null,
          id_number: id_number || null,
          is_active: true,
          updated_at: new Date().toISOString()
        });
      
      if (profileError) throw profileError;
      
      // Insert into user_roles table
      const { error: roleError } = await supabase
        .from('user_roles')
        .upsert({
          user_id: userId,
          role: role as any, // Type assertion since user_role type is more restrictive
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id,role'
        });
      
      if (roleError) throw roleError;
      
      // Refresh staff list
      await fetchStaff();
      
      return { 
        data: { 
          ...authData.user,
          profile: {
            role,
            branch_id,
            department,
            phone
          }
        }, 
        error: null 
      };
    } catch (error: any) {
      console.error('Error creating staff member:', error);
      toast.error(error.message || 'Failed to create staff member');
      return { 
        data: null, 
        error: error.message || 'An unexpected error occurred' 
      };
    }
  };

  const updateStaffMember = async (id: string, updates: any) => {
    try {
      const updateData: any = {
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
        updated_at: new Date().toISOString()
      };

      // Include optional fields if provided
      const optionalFields = ['date_of_birth', 'id_type', 'id_number'];
      optionalFields.forEach(field => {
        if (updates[field] !== undefined) {
          updateData[field] = updates[field] || null;
        }
      });

      const { error } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('id', id);
      
      if (error) throw error;
      
      // If role was updated, update user_roles table as well
      if (updates.role) {
        const { error: roleError } = await supabase
          .from('user_roles')
          .upsert({
            user_id: id,
            role: updates.role,
            updated_at: new Date().toISOString()
          }, {
            onConflict: 'user_id,role'
          });
        
        if (roleError) throw roleError;
      }
      
      toast.success('Staff member updated successfully');
      await fetchStaff();
      
      return { success: true };
    } catch (error: any) {
      console.error('Error updating staff member:', error);
      toast.error(error.message || 'Failed to update staff member');
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
    deleteStaffMember,
    // Add a function to update user roles if needed
    updateUserRole: async (userId: string, newRole: string) => {
      try {
        // Update profiles table
        const { error: profileError } = await supabase
          .from('profiles')
          .update({ 
            role: newRole,
            updated_at: new Date().toISOString() 
          })
          .eq('id', userId);
        
        if (profileError) throw profileError;
        
        // Update or insert in user_roles table
        const { error: roleError } = await supabase
          .from('user_roles')
          .upsert({
            user_id: userId,
            role: newRole as any,
            updated_at: new Date().toISOString()
          }, {
            onConflict: 'user_id,role'
          });
        
        if (roleError) throw roleError;
        
        await fetchStaff();
        return { success: true };
      } catch (error: any) {
        console.error('Error updating user role:', error);
        toast.error('Failed to update user role');
        return { success: false, error: error.message };
      }
    }
  };
};
