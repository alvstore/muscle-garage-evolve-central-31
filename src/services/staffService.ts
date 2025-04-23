
import { supabase } from "@/integrations/supabase/client";

export interface Staff {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  department: string;
  avatar: string;
  status: 'active' | 'inactive';
  branchId: string;
}

export const staffService = {
  async getStaff(branchId?: string): Promise<Staff[]> {
    try {
      let query = supabase
        .from('profiles')
        .select(`
          id,
          full_name,
          email,
          phone,
          avatar_url,
          role,
          branch_id
        `)
        .eq('role', 'staff');
      
      if (branchId) {
        query = query.eq('branch_id', branchId);
      }
      
      const { data, error } = await query;
      
      if (error) {
        throw error;
      }
      
      return data.map(staff => ({
        id: staff.id,
        name: staff.full_name || '',
        email: staff.email || '',
        phone: staff.phone || '',
        role: 'Staff', // Default role display
        department: 'General', // Default department
        avatar: staff.avatar_url || '',
        status: 'active', // Default status
        branchId: staff.branch_id || ''
      }));
    } catch (error) {
      console.error("Error fetching staff:", error);
      return [];
    }
  },
  
  async createStaff(staff: Partial<Staff>): Promise<Staff | null> {
    try {
      // First create the auth user
      // Note: This would typically be done through an edge function for security
      // For this example, we're just showing the data structure
      
      // Then create the profile
      const { data, error } = await supabase
        .from('profiles')
        .insert({
          full_name: staff.name,
          email: staff.email,
          phone: staff.phone,
          role: 'staff',
          branch_id: staff.branchId
        })
        .select()
        .single();
      
      if (error) {
        throw error;
      }
      
      return {
        id: data.id,
        name: data.full_name || '',
        email: data.email || '',
        phone: data.phone || '',
        role: 'Staff',
        department: 'General',
        avatar: data.avatar_url || '',
        status: 'active',
        branchId: data.branch_id || ''
      };
    } catch (error) {
      console.error("Error creating staff:", error);
      return null;
    }
  },
  
  async updateStaff(id: string, staff: Partial<Staff>): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: staff.name,
          email: staff.email,
          phone: staff.phone,
          branch_id: staff.branchId
        })
        .eq('id', id);
      
      if (error) {
        throw error;
      }
      
      return true;
    } catch (error) {
      console.error("Error updating staff:", error);
      return false;
    }
  },
  
  async deleteStaff(id: string): Promise<boolean> {
    try {
      // Note: This would typically involve deleting the auth user as well
      // For this example, we're just showing the profile deletion
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', id);
      
      if (error) {
        throw error;
      }
      
      return true;
    } catch (error) {
      console.error("Error deleting staff:", error);
      return false;
    }
  }
};
