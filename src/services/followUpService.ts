
import { FollowUpHistory, FollowUpScheduled } from '@/types/crm';
import { supabase } from '@/integrations/supabase/client';

class FollowUpService {
  async getFollowUpHistory(leadId?: string) {
    try {
      let query = supabase
        .from('follow_up_history')
        .select(`
          *,
          leads(*)
        `);
      
      if (leadId) {
        query = query.eq('lead_id', leadId);
      }
      
      const { data, error } = await query.order('sent_at', { ascending: false });
      
      if (error) throw error;
      return data as FollowUpHistory[];
    } catch (error) {
      console.error('Error fetching follow-up history:', error);
      return [];
    }
  }
  
  async getScheduledFollowUps(branchId?: string) {
    try {
      let query = supabase
        .from('follow_up_history')
        .select(`
          *,
          leads(*)
        `)
        .eq('status', 'scheduled');
      
      if (branchId) {
        query = query.eq('leads.branch_id', branchId);
      }
      
      const { data, error } = await query.order('scheduled_at', { ascending: true });
      
      if (error) throw error;
      return data as FollowUpScheduled[];
    } catch (error) {
      console.error('Error fetching scheduled follow-ups:', error);
      return [];
    }
  }
  
  async deleteScheduledFollowUp(id: string) {
    try {
      const { error } = await supabase
        .from('follow_up_history')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting scheduled follow-up:', error);
      return false;
    }
  }
}

export const followUpService = new FollowUpService();
