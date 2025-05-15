
import { supabase } from '@/integrations/supabase/client';
import { FollowUpScheduled, FollowUpHistory, FollowUpType, FollowUpTemplate } from '@/types/crm';

class FollowUpService {
  async getScheduledFollowUps(branchId?: string) {
    try {
      let query = supabase
        .from('follow_up_scheduled')
        .select(`
          *,
          leads:lead_id (id, name, email, phone)
        `);

      if (branchId) {
        query = query.eq('branch_id', branchId);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching scheduled follow-ups:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Unexpected error fetching scheduled follow-ups:', error);
      return [];
    }
  }

  async createScheduledFollowUp(followUp: Partial<FollowUpScheduled>) {
    try {
      const { data, error } = await supabase
        .from('follow_up_scheduled')
        .insert([{
          lead_id: followUp.lead_id,
          scheduled_date: followUp.scheduled_date,
          type: followUp.type,
          content: followUp.content,
          subject: followUp.subject,
          status: followUp.status || 'pending',
          created_by: followUp.created_by,
          template_id: followUp.template_id,
          branch_id: followUp.branch_id,
        }])
        .select();

      if (error) {
        console.error('Error creating scheduled follow-up:', error);
        return null;
      }

      return data[0];
    } catch (error) {
      console.error('Unexpected error creating scheduled follow-up:', error);
      return null;
    }
  }

  async deleteScheduledFollowUp(id: string) {
    try {
      const { error } = await supabase
        .from('follow_up_scheduled')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting scheduled follow-up:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Unexpected error deleting scheduled follow-up:', error);
      return false;
    }
  }

  async getFollowUpHistory(leadId: string) {
    try {
      const { data, error } = await supabase
        .from('follow_up_history')
        .select('*')
        .eq('lead_id', leadId)
        .order('sent_at', { ascending: false });

      if (error) {
        console.error('Error fetching follow-up history:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Unexpected error fetching follow-up history:', error);
      return [];
    }
  }

  async getFollowUpTemplates(type?: FollowUpType) {
    try {
      let query = supabase
        .from('follow_up_templates')
        .select('*');

      if (type) {
        query = query.eq('type', type);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching follow-up templates:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Unexpected error fetching follow-up templates:', error);
      return [];
    }
  }

  async saveFollowUpTemplate(template: Partial<FollowUpTemplate>) {
    try {
      if (template.id) {
        // Update existing template
        const { data, error } = await supabase
          .from('follow_up_templates')
          .update({
            name: template.name,
            title: template.title,
            content: template.content,
            type: template.type,
            variables: template.variables,
            isDefault: template.isDefault,
          })
          .eq('id', template.id)
          .select();

        if (error) {
          console.error('Error updating follow-up template:', error);
          return null;
        }

        return data[0];
      } else {
        // Create new template
        const { data, error } = await supabase
          .from('follow_up_templates')
          .insert([{
            name: template.name,
            title: template.title,
            content: template.content,
            type: template.type,
            variables: template.variables,
            isDefault: template.isDefault,
          }])
          .select();

        if (error) {
          console.error('Error creating follow-up template:', error);
          return null;
        }

        return data[0];
      }
    } catch (error) {
      console.error('Unexpected error saving follow-up template:', error);
      return null;
    }
  }
}

export const followUpService = new FollowUpService();
