
import { FollowUpHistory } from '@/types/crm';
import { supabase } from './supabaseClient';

class FollowUpService {
  async getFollowUpHistory(branchId?: string) {
    try {
      let query = supabase
        .from('follow_up_history')
        .select(`
          *,
          leads(*)
        `);
      
      if (branchId) {
        query = query.eq('leads.branch_id', branchId);
      }
      
      const { data, error } = await query.order('scheduled_at', { ascending: false });
      
      if (error) throw error;
      return data as FollowUpHistory[];
    } catch (error) {
      console.error('Error fetching follow-up history:', error);
      return [];
    }
  }
}

export const followUpService = new FollowUpService();
