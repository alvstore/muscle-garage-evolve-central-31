import { supabase } from '@/integrations/supabase/client';
import { Staff, CreateStaffInput, UpdateStaffInput } from '@/types/core/team/staff';

export const staffService = {
  // Get all staff members with their user information
  async getStaff(options: { 
    activeOnly?: boolean;
    branchId?: string; 
  } = { activeOnly: true }) {
    const { activeOnly = true, branchId } = options;
    let query = supabase
      .from('staff_with_users')
      .select('*')
      .order('created_at', { ascending: false });

    if (activeOnly) {
      query = query.eq('is_active', true);
    }

    if (branchId) {
      query = query.eq('branch_id', branchId);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching staff:', error);
      throw error;
    }

    // Transform the data to match the Staff interface
    const staffMembers = data.map(staff => ({
      ...staff,
      // Add computed fields from user data
      full_name: staff.full_name,
      email: staff.email,
      role: 'staff'
    }));

    return staffMembers as Staff[];
  },

  // Get a single staff member by ID with full user information
  async getStaffById(id: string) {
    const { data, error } = await supabase
      .from('staff_with_users')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching staff member:', error);
      throw error;
    }
    
    // Transform the data to match the Staff interface
    const staff = {
      ...data,
      // Add computed fields from user data
      full_name: data.full_name,
      email: data.email,
      role: 'staff'
    };

    return staff as Staff;
  },

  // Create a new staff member
  async createStaff(staffData: CreateStaffInput) {
    const { data, error } = await supabase
      .from('staff')
      .insert({
        ...staffData,
        is_active: staffData.is_active ?? true,
        emergency_contact: staffData.emergency_contact ?? null,
        bank_details: staffData.bank_details ?? null
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating staff member:', error);
      throw error;
    }
    
    // Fetch the complete staff data with user information
    return this.getStaffById(data.id);
  },

  // Update a staff member
  async updateStaff(id: string, updates: UpdateStaffInput) {
    const updateData: any = {
      ...updates,
      updated_at: new Date().toISOString()
    };
    
    const { data, error } = await supabase
      .from('staff')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating staff member:', error);
      throw error;
    }
    
    // Fetch the complete staff data with user information
    return this.getStaffById(id);
  },

  // Toggle staff active status
  async toggleActiveStatus(staffId: string, isActive: boolean) {
    const { data, error } = await supabase
      .from('staff')
      .update({ 
        is_active: isActive,
        updated_at: new Date().toISOString()
      })
      .eq('id', staffId)
      .select()
      .single();

    if (error) {
      console.error('Error toggling staff active status:', error);
      throw error;
    }

    return data as Staff;
  },

  // Delete a staff member
  async deleteStaff(staffId: string) {
    const { error } = await supabase
      .from('staff')
      .delete()
      .eq('id', staffId);

    if (error) {
      console.error('Error deleting staff member:', error);
      throw error;
    }

    return true;
  }
};

export default staffService;
