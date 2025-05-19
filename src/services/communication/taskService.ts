import { supabase } from '@/integrations/supabase/client';

export interface StaffMember {
  id: string;
  name: string;
  email: string;
  avatar_url?: string;
  role: 'trainer' | 'staff' | 'admin';
  created_at: string;
  updated_at: string;
}

export const staffService = {
  // Fetch all staff members from the database
  async getStaffMembers(): Promise<StaffMember[]> {
    try {
      const { data, error } = await supabase
        .from('staff')
        .select('*')
        .order('name', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching staff members:', error);
      return [];
    }
  },

  // Fetch a single staff member by ID
  async getStaffMemberById(id: string): Promise<StaffMember | null> {
    try {
      const { data, error } = await supabase
        .from('staff')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error(`Error fetching staff member with ID ${id}:`, error);
      return null;
    }
  }
};
