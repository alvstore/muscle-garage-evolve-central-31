
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
      // First, check if there are any leads with follow_up_date set
      let leadsQuery = supabase
        .from('leads')
        .select('*')
        .not('follow_up_date', 'is', null);
      
      if (branchId) {
        leadsQuery = leadsQuery.eq('branch_id', branchId);
      }
      
      const { data: leadsWithFollowUp, error: leadsError } = await leadsQuery;
      
      if (leadsError) throw leadsError;
      
      // Then get scheduled follow-ups from the follow_up_history table
      let followUpsQuery = supabase
        .from('follow_up_history')
        .select(`
          *,
          leads(*)
        `)
        .eq('status', 'scheduled');
      
      if (branchId) {
        followUpsQuery = followUpsQuery.eq('leads.branch_id', branchId);
      }
      
      const { data: scheduledFollowUps, error: followUpsError } = await followUpsQuery.order('scheduled_at', { ascending: true });
      
      if (followUpsError) throw followUpsError;
      
      // Combine both data sources
      const combinedFollowUps: FollowUpScheduled[] = [];
      
      // Add follow-ups from the follow_up_history table
      if (scheduledFollowUps) {
        scheduledFollowUps.forEach(item => {
          combinedFollowUps.push({
            id: item.id,
            lead_id: item.lead_id || "",
            type: item.type as any,
            subject: item.subject || "",
            content: item.content || "",
            status: item.status,
            scheduled_at: item.scheduled_at || new Date().toISOString(),
            leads: item.leads as any,
            created_by: item.created_by || "",
            created_at: item.created_at || new Date().toISOString(),
            template_id: item.template_id
          });
        });
      }
      
      // Add leads with follow_up_date set
      if (leadsWithFollowUp) {
        leadsWithFollowUp.forEach(lead => {
          // Check if this lead is already in the list from follow_up_history
          const existingIndex = combinedFollowUps.findIndex(item => item.lead_id === lead.id);
          
          if (existingIndex === -1 && lead.follow_up_date) {
            // Only add if not already in the list
            combinedFollowUps.push({
              id: `lead-${lead.id}`,
              lead_id: lead.id,
              type: 'call',
              subject: 'Follow-up with lead',
              content: lead.notes || 'Scheduled follow-up',
              status: 'scheduled',
              scheduled_at: lead.follow_up_date,
              leads: lead as any,
              created_by: lead.assigned_to || '',
              created_at: lead.created_at || new Date().toISOString(),
              template_id: null
            });
          }
        });
      }
      
      // Sort by scheduled date
      return combinedFollowUps.sort((a, b) => 
        new Date(a.scheduled_at).getTime() - new Date(b.scheduled_at).getTime()
      );
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
