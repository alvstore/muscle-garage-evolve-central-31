import { supabase } from '@/integrations/supabase/client';
import { Member } from '@/types/member';

/**
 * Service for member-related operations
 */
export const memberService = {
  /**
   * Fetches members from a specific branch
   * @param branchId - The branch ID to filter members
   * @returns Promise with array of members
   */
  async getMembersByBranch(branchId?: string): Promise<Member[]> {
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
          status,
          branch_id,
          membership_status,
          membership_id,
          membership_start_date,
          membership_end_date
        `)
        .eq('role', 'member');
      
      // Filter by branch if provided
      if (branchId) {
        query = query.eq('branch_id', branchId);
      }
      
      // Get members with active status OR active membership status
      query = query.or('status.eq.active,membership_status.eq.active');
      
      const { data, error } = await query;
      
      if (error) {
        console.error('Error fetching members:', error);
        throw new Error(error.message);
      }
      
      // Map the database fields to the Member interface
      return (data || []).map(item => ({
        id: item.id,
        name: item.full_name, // Map full_name to name
        email: item.email,
        phone: item.phone,
        status: item.status as 'active' | 'inactive' | 'pending',
        membershipStatus: (item.membership_status || 'none') as 'active' | 'expired' | 'none',
        membershipId: item.membership_id,
        membershipStartDate: item.membership_start_date ? new Date(item.membership_start_date) : null,
        membershipEndDate: item.membership_end_date ? new Date(item.membership_end_date) : null,
        role: item.role as 'member' | 'trainer' | 'staff' | 'admin',
        branchId: item.branch_id
      }));
    } catch (error: any) {
      console.error('Error in getMembersByBranch:', error);
      return [];
    }
  },
  
  /**
   * Fetches a single member by ID
   * @param memberId - The member ID to fetch
   * @returns Promise with member data
   */
  async getMemberById(memberId: string): Promise<Member | null> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          id,
          full_name,
          email,
          phone,
          avatar_url,
          role,
          status,
          branch_id,
          membership_status,
          membership_id,
          membership_start_date,
          membership_end_date
        `)
        .eq('id', memberId)
        .single();
      
      if (error) {
        console.error('Error fetching member:', error);
        throw new Error(error.message);
      }
      
      if (!data) return null;
      
      // Map the database fields to the Member interface
      return {
        id: data.id,
        name: data.full_name, // Map full_name to name
        email: data.email,
        phone: data.phone,
        status: data.status as 'active' | 'inactive' | 'pending',
        membership_status: (data.membership_status || 'none') as 'active' | 'expired' | 'none',
        membership_id: data.membership_id,
        membership_start_date: data.membership_start_date || null,
        membership_end_date: data.membership_end_date || null,
        // role is used internally but not part of the Member interface
        branch_id: data.branch_id
      };
    } catch (error: any) {
      console.error('Error in getMemberById:', error);
      return null;
    }
  }
};
