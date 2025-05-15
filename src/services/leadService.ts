
import { supabase } from '@/integrations/supabase/client';
import { Lead, FollowUpScheduled } from '@/types/crm';

// Export as named export
export const leadService = {
  getLeads: async (branchId?: string) => {
    try {
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .eq('branch_id', branchId || '')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      return data as Lead[];
    } catch (error) {
      console.error('Error fetching leads:', error);
      return [];
    }
  },
  
  createLead: async (lead: Partial<Lead>) => {
    try {
      const { data, error } = await supabase
        .from('leads')
        .insert(lead)
        .select();
      
      if (error) throw error;
      
      return data[0] as Lead;
    } catch (error) {
      console.error('Error creating lead:', error);
      return null;
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
      
      return data[0] as Lead;
    } catch (error) {
      console.error('Error updating lead:', error);
      return null;
    }
  },
  
  deleteLead: async (id: string) => {
    try {
      const { error } = await supabase
        .from('leads')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      return true;
    } catch (error) {
      console.error('Error deleting lead:', error);
      return false;
    }
  },
  
  getFollowUpHistory: async (leadId: string) => {
    try {
      const { data, error } = await supabase
        .from('follow_up_history')
        .select('*')
        .eq('lead_id', leadId)
        .order('scheduled_date', { ascending: false });
      
      if (error) throw error;
      
      return data;
    } catch (error) {
      console.error('Error fetching follow-up history:', error);
      return [];
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
      
      return data[0];
    } catch (error) {
      console.error('Error scheduling follow-up:', error);
      return null;
    }
  }
};

// Export as default for backward compatibility
export default leadService;
