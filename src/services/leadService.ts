
import { supabase } from '@/integrations/supabase/client';
import { Lead, FollowUpScheduled } from '@/types/crm';

// Export as named export instead of default
export const leadService = {
  getLeads: async (branchId?: string) => {
    try {
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .eq('branch_id', branchId || '')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      return { data, error: null };
    } catch (error) {
      console.error('Error fetching leads:', error);
      return { data: null, error };
    }
  },
  
  createLead: async (lead: Partial<Lead>) => {
    try {
      const { data, error } = await supabase
        .from('leads')
        .insert(lead)
        .select();
      
      if (error) throw error;
      
      return { data: data[0], error: null };
    } catch (error) {
      console.error('Error creating lead:', error);
      return { data: null, error };
    }
  },
  
  updateLead: async (id: string, updates: Partial<Lead>) => {
    try {
      const { data, error } = await supabase
        .from('leads')
        .update(updates)
        .eq('id', id)
        .select();
      
      if (error) throw error;
      
      return { data: data[0], error: null };
    } catch (error) {
      console.error('Error updating lead:', error);
      return { data: null, error };
    }
  },
  
  deleteLead: async (id: string) => {
    try {
      const { error } = await supabase
        .from('leads')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      return { success: true, error: null };
    } catch (error) {
      console.error('Error deleting lead:', error);
      return { success: false, error };
    }
  },
  
  getFollowUpHistory: async (leadId: string) => {
    try {
      const { data, error } = await supabase
        .from('follow_up_history')
        .select('*')
        .eq('lead_id', leadId)
        .order('scheduled_at', { ascending: false });
      
      if (error) throw error;
      
      return { data, error: null };
    } catch (error) {
      console.error('Error fetching follow-up history:', error);
      return { data: null, error };
    }
  },
  
  scheduleFollowUp: async (followUp: FollowUpScheduled) => {
    try {
      const { data, error } = await supabase
        .from('follow_up_history')
        .insert({
          lead_id: followUp.lead_id,
          type: followUp.type,
          content: followUp.content,
          scheduled_date: followUp.scheduled_date,
          status: 'pending',
          sent_by: followUp.sent_by
        })
        .select();
      
      if (error) throw error;
      
      return { data: data[0], error: null };
    } catch (error) {
      console.error('Error scheduling follow-up:', error);
      return { data: null, error };
    }
  }
};

export default leadService;
