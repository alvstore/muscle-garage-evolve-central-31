import { supabase } from '@/integrations/supabase/client';

export interface StaffMember {
  id: string;
  name: string;
  full_name: string;
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
        .from('profiles')
        .select('*')
        .in('role', ['staff', 'admin', 'trainer'])
        .order('full_name', { ascending: true });

      if (error) throw error;
      
      // Map the data to match the StaffMember interface
      return (data || []).map((member: any) => ({
        ...member,
        name: member.full_name || '', // For backward compatibility
        full_name: member.full_name || ''
      }));
    } catch (error) {
      console.error('Error fetching staff members:', error);
      return [];
    }
  },

  // Fetch a single staff member by ID
  async getStaffMemberById(id: string): Promise<StaffMember | null> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      
      if (data) {
        return {
          ...data,
          name: data.full_name || '', // For backward compatibility
          full_name: data.full_name || ''
        };
      }
      return null;
    } catch (error) {
      console.error(`Error fetching staff member with ID ${id}:`, error);
      return null;
    }
  }
};
