
import { supabase } from '@/integrations/supabase/client';
import { 
  FollowUpHistory, 
  ScheduledFollowUp, 
  FollowUpScheduled,
  FollowUpType
} from '@/types/crm';

export interface FollowUpHistoryCreateParams {
  lead_id: string;
  type: FollowUpType;
  content: string;
  status: string;
  subject?: string;
  scheduled_at?: string;
}

export const followUpService = {
  getFollowUpHistory: async (leadId?: string, branchId?: string) => {
    let query = supabase.from('follow_up_history').select('*');
    
    if (leadId) {
      query = query.eq('lead_id', leadId);
    }
    
    // Branch ID filtering would be applied here if implemented
    
    const { data, error } = await query.order('sent_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching follow-up history:', error);
      throw error;
    }
    
    return data || [];
  },
  
  getScheduledFollowUps: async (branchId?: string) => {
    try {
      const { data, error } = await supabase
        .from('follow_up_history')
        .select(`
          id,
          lead_id,
          type,
          content,
          status,
          scheduled_at,
          subject,
          sent_by,
          leads:lead_id (name)
        `)
        .eq('status', 'scheduled')
        .order('scheduled_at', { ascending: true });
      
      if (error) {
        throw error;
      }
      
      return data.map(item => ({
        id: item.id,
        leadId: item.lead_id,
        scheduledBy: item.sent_by || "",
        scheduledDate: item.scheduled_at || "",
        type: item.type,
        subject: item.subject || "",
        content: item.content,
        status: item.status,
        createdAt: new Date().toISOString(), // Add missing field to match interface
        lead: {
          name: item.leads?.name || "Unknown Lead",
        }
      })) || [];
    } catch (error) {
      console.error('Error fetching scheduled follow-ups:', error);
      return [];
    }
  },
  
  createFollowUpHistory: async (params: FollowUpHistoryCreateParams) => {
    const { data, error } = await supabase
      .from('follow_up_history')
      .insert([{
        lead_id: params.lead_id,
        type: params.type,
        content: params.content,
        subject: params.subject,
        status: params.status,
        scheduled_at: params.scheduled_at,
        sent_by: (await supabase.auth.getUser()).data.user?.id,
      }])
      .select()
      .single();
    
    if (error) {
      console.error('Error creating follow-up history:', error);
      throw error;
    }
    
    return data;
  },
  
  updateFollowUpHistory: async (id: string, updates: Partial<FollowUpHistory>) => {
    const { data, error } = await supabase
      .from('follow_up_history')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating follow-up history:', error);
      throw error;
    }
    
    return data;
  },
  
  deleteScheduledFollowUp: async (id: string) => {
    const { error } = await supabase
      .from('follow_up_history')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting scheduled follow-up:', error);
      throw error;
    }
    
    return true;
  }
};
