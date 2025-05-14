import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { FollowUpHistory, FollowUpTemplate, FollowUpScheduled } from '@/types/crm';
import { format } from 'date-fns';

export const followUpService = {
  /**
   * Get follow-up history for a specific lead or all leads
   */
  async getFollowUpHistory(leadId?: string, branchId?: string): Promise<FollowUpHistory[]> {
    try {
      let query = supabase
        .from('follow_up_history')
        .select(`
          *,
          leads!follow_up_history_lead_id_fkey(id, name, email, phone, branch_id),
          profiles!follow_up_history_sent_by_fkey(id, full_name, avatar_url)
        `)
        .not('status', 'eq', 'scheduled') // Exclude scheduled follow-ups
        .order('sent_at', { ascending: false });
      
      // Filter by lead if provided
      if (leadId) {
        query = query.eq('lead_id', leadId);
      }
      
      // Filter by branch if provided (via the leads table)
      if (branchId) {
        query = query.eq('leads.branch_id', branchId);
      }
      
      const { data, error } = await query;
      
      if (error) {
        console.error('Error fetching follow-up history:', error);
        throw error;
      }
      
      return data as FollowUpHistory[];
    } catch (error: any) {
      console.error('Error in getFollowUpHistory:', error);
      toast.error('Failed to load follow-up history');
      return [];
    }
  },
  
  /**
   * Create a new follow-up history entry
   */
  async createFollowUpHistory(followUp: Omit<FollowUpHistory, 'id' | 'sent_at'>): Promise<FollowUpHistory | null> {
    try {
      const { data, error } = await supabase
        .from('follow_up_history')
        .insert([followUp])
        .select()
        .single();
      
      if (error) {
        console.error('Error creating follow-up history:', error);
        throw error;
      }
      
      return data as FollowUpHistory;
    } catch (error: any) {
      console.error('Error in createFollowUpHistory:', error);
      toast.error('Failed to create follow-up history');
      return null;
    }
  },
  
  /**
   * Update a follow-up history entry
   */
  async updateFollowUpHistory(id: string, updates: Partial<FollowUpHistory>): Promise<FollowUpHistory | null> {
    try {
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
      
      return data as FollowUpHistory;
    } catch (error: any) {
      console.error('Error in updateFollowUpHistory:', error);
      toast.error('Failed to update follow-up history');
      return null;
    }
  },
  
  /**
   * Get all follow-up templates
   */
  async getFollowUpTemplates(): Promise<FollowUpTemplate[]> {
    try {
      const { data, error } = await supabase
        .from('follow_up_templates')
        .select(`
          *,
          profiles!follow_up_templates_created_by_fkey(id, full_name)
        `)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching follow-up templates:', error);
        throw error;
      }
      
      return data as FollowUpTemplate[];
    } catch (error: any) {
      console.error('Error in getFollowUpTemplates:', error);
      toast.error('Failed to load follow-up templates');
      return [];
    }
  },
  
  /**
   * Create a new follow-up template
   */
  async createFollowUpTemplate(template: Omit<FollowUpTemplate, 'id' | 'created_at'>): Promise<FollowUpTemplate | null> {
    try {
      const { data, error } = await supabase
        .from('follow_up_templates')
        .insert([template])
        .select()
        .single();
      
      if (error) {
        console.error('Error creating follow-up template:', error);
        throw error;
      }
      
      return data as FollowUpTemplate;
    } catch (error: any) {
      console.error('Error in createFollowUpTemplate:', error);
      toast.error('Failed to create follow-up template');
      return null;
    }
  },
  
  /**
   * Update a follow-up template
   */
  async updateFollowUpTemplate(id: string, updates: Partial<FollowUpTemplate>): Promise<FollowUpTemplate | null> {
    try {
      const { data, error } = await supabase
        .from('follow_up_templates')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        console.error('Error updating follow-up template:', error);
        throw error;
      }
      
      return data as FollowUpTemplate;
    } catch (error: any) {
      console.error('Error in updateFollowUpTemplate:', error);
      toast.error('Failed to update follow-up template');
      return null;
    }
  },
  
  /**
   * Delete a follow-up template
   */
  async deleteFollowUpTemplate(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('follow_up_templates')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error('Error deleting follow-up template:', error);
        throw error;
      }
      
      return true;
    } catch (error: any) {
      console.error('Error in deleteFollowUpTemplate:', error);
      toast.error('Failed to delete follow-up template');
      return false;
    }
  },
  
  /**
   * Get scheduled follow-ups
   */
  async getScheduledFollowUps(branchId?: string): Promise<FollowUpScheduled[]> {
    try {
      let query = supabase
        .from('follow_up_history')
        .select(`
          *,
          leads!follow_up_history_lead_id_fkey(id, name, email, phone, branch_id)
        `)
        .eq('status', 'scheduled')
        .order('scheduled_at', { ascending: true });
      
      // Filter by branch if provided (via the leads table)
      if (branchId) {
        query = query.eq('leads.branch_id', branchId);
      }
      
      const { data, error } = await query;
      
      if (error) {
        console.error('Error fetching scheduled follow-ups:', error);
        throw error;
      }
      
      // Map the data to the FollowUpScheduled interface
      const scheduledFollowUps = (data || []).map(item => ({
        id: item.id,
        lead_id: item.lead_id,
        lead_name: item.leads?.name || '',
        type: item.type,
        scheduled_for: item.scheduled_at,
        subject: item.subject || '',
        content: item.content,
        status: item.status
      }));
      
      return scheduledFollowUps as FollowUpScheduled[];
    } catch (error: any) {
      console.error('Error in getScheduledFollowUps:', error);
      toast.error('Failed to load scheduled follow-ups');
      return [];
    }
  },
  
  /**
   * Create a new scheduled follow-up
   */
  async createScheduledFollowUp(followUp: Omit<FollowUpScheduled, 'id'>): Promise<FollowUpScheduled | null> {
    try {
      // Convert to follow_up_history format
      const historyEntry = {
        lead_id: followUp.lead_id,
        type: followUp.type,
        content: followUp.content,
        subject: followUp.subject,
        status: 'scheduled',
        scheduled_at: followUp.scheduled_for,
        sent_by: null, // Will be filled when actually sent
        sent_at: null  // Will be filled when actually sent
      };
      
      const { data, error } = await supabase
        .from('follow_up_history')
        .insert([historyEntry])
        .select()
        .single();
      
      if (error) {
        console.error('Error creating scheduled follow-up:', error);
        throw error;
      }
      
      // Map back to FollowUpScheduled format
      const scheduledFollowUp: FollowUpScheduled = {
        id: data.id,
        lead_id: data.lead_id,
        lead_name: '',  // This will be filled by the component using the lead data
        type: data.type,
        scheduled_for: data.scheduled_at,
        subject: data.subject || '',
        content: data.content,
        status: data.status
      };
      
      return scheduledFollowUp;
    } catch (error: any) {
      console.error('Error in createScheduledFollowUp:', error);
      toast.error('Failed to schedule follow-up');
      return null;
    }
  },
  
  /**
   * Update a scheduled follow-up
   */
  async updateScheduledFollowUp(id: string, updates: Partial<FollowUpScheduled>): Promise<FollowUpScheduled | null> {
    try {
      // Convert to follow_up_history format
      const historyUpdates: any = {};
      
      if (updates.type) historyUpdates.type = updates.type;
      if (updates.content) historyUpdates.content = updates.content;
      if (updates.subject) historyUpdates.subject = updates.subject;
      if (updates.scheduled_for) historyUpdates.scheduled_at = updates.scheduled_for;
      if (updates.status) historyUpdates.status = updates.status;
      
      const { data, error } = await supabase
        .from('follow_up_history')
        .update(historyUpdates)
        .eq('id', id)
        .eq('status', 'scheduled') // Make sure we're only updating scheduled follow-ups
        .select()
        .single();
      
      if (error) {
        console.error('Error updating scheduled follow-up:', error);
        throw error;
      }
      
      // Map back to FollowUpScheduled format
      const scheduledFollowUp: FollowUpScheduled = {
        id: data.id,
        lead_id: data.lead_id,
        lead_name: '',  // This will be filled by the component
        type: data.type,
        scheduled_for: data.scheduled_at,
        subject: data.subject || '',
        content: data.content,
        status: data.status
      };
      
      return scheduledFollowUp;
    } catch (error: any) {
      console.error('Error in updateScheduledFollowUp:', error);
      toast.error('Failed to update scheduled follow-up');
      return null;
    }
  },
  
  /**
   * Delete a scheduled follow-up
   */
  async deleteScheduledFollowUp(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('follow_up_history')
        .delete()
        .eq('id', id)
        .eq('status', 'scheduled'); // Make sure we're only deleting scheduled follow-ups
      
      if (error) {
        console.error('Error deleting scheduled follow-up:', error);
        throw error;
      }
      
      toast.success('Follow-up deleted successfully');
      return true;
    } catch (error: any) {
      console.error('Error in deleteScheduledFollowUp:', error);
      toast.error('Failed to delete scheduled follow-up');
      return false;
    }
  }
};

export default followUpService;
