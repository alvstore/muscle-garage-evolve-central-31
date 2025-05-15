import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { FollowUpHistory } from '@/types/crm';

export const followUpService = {
  async getFollowUpHistory(branchId?: string): Promise<FollowUpHistory[]> {
    try {
      let query = supabase
        .from('follow_up_history')
        .select('*')
        .order('scheduled_at', { ascending: false });
        
      if (branchId) {
        // If we have lead information with branch IDs, we would join or filter here
        // This is a simplified version without branch filtering
      }

      const { data, error } = await query;

      if (error) {
        throw error;
      }
      
      return data as FollowUpHistory[];
    } catch (error: any) {
      console.error('Error fetching follow-up history:', error);
      toast.error('Failed to load follow-ups');
      return [];
    }
  },

  async scheduleFollowUp(followUp: Partial<FollowUpHistory>): Promise<FollowUpHistory | null> {
    try {
      const { data, error } = await supabase
        .from('follow_up_history')
        .insert([followUp])
        .select()
        .single();

      if (error) throw error;
      
      toast.success('Follow-up scheduled successfully');
      return data as FollowUpHistory;
    } catch (error: any) {
      console.error('Error scheduling follow-up:', error);
      toast.error(`Failed to schedule follow-up: ${error.message}`);
      return null;
    }
  },

  async updateFollowUpStatus(id: string, status: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('follow_up_history')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;
      
      toast.success('Follow-up status updated');
      return true;
    } catch (error: any) {
      console.error('Error updating follow-up status:', error);
      toast.error(`Failed to update follow-up: ${error.message}`);
      return false;
    }
  }
};

export default followUpService;
