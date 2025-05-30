
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Lead } from '@/types/crm';
import notificationService from '../communication/notificationService';

export const crmService = {
  async getLeads(branchId: string | undefined): Promise<Lead[]> {
    try {
      if (!branchId) {
        console.warn('No branch ID provided for getLeads');
        return [];
      }
      
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .eq('branch_id', branchId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Supabase error fetching leads:', error);
        throw error;
      }
      
      return data as Lead[];
    } catch (error: any) {
      console.error('Error fetching leads:', error);
      toast.error('Failed to load leads');
      return [];
    }
  },

  async createLead(lead: Omit<Lead, 'id' | 'created_at' | 'updated_at'>): Promise<Lead | null> {
    try {
      if (!lead.branch_id) {
        toast.error('Branch ID is required to create a lead');
        return null;
      }
      
      const leadWithTimestamps = {
        ...lead,
        updated_at: new Date().toISOString()
      };
      
      const { data, error } = await supabase
        .from('leads')
        .insert([leadWithTimestamps])
        .select()
        .single();

      if (error) throw error;
      
      // Create notification for admins and staff about the new lead
      try {
        // Get staff users who should receive notifications
        const { data: staffUsers } = await supabase
          .from('profiles')
          .select('id')
          .in('role', ['admin', 'manager'])
          .eq('branch_id', lead.branch_id);
        
        if (staffUsers && staffUsers.length > 0) {
          // Create notifications for each staff member
          for (const user of staffUsers) {
            await notificationService.createNotification({
              user_id: user.id,
              title: 'New Lead Created',
              message: `A new lead (${lead.name}) has been created from ${lead.source}.`,
              type: 'lead',
              category: 'crm',
              link: '/crm/leads',
              source: 'system',
              related_id: data.id
            });
          }
        }
      } catch (notificationError) {
        console.error('Error creating lead notification:', notificationError);
        // Don't fail the lead creation if notification fails
      }
      
      toast.success('Lead created successfully');
      return data as Lead;
    } catch (error: any) {
      console.error('Error creating lead:', error);
      toast.error(`Failed to create lead: ${error.message}`);
      return null;
    }
  },

  async updateLead(id: string, updates: Partial<Lead>): Promise<Lead | null> {
    try {
      // First, get the current lead data to compare changes
      const { data: currentLead, error: fetchError } = await supabase
        .from('leads')
        .select('*')
        .eq('id', id)
        .single();
      
      if (fetchError) throw fetchError;
      
      // Update the lead
      const { data, error } = await supabase
        .from('leads')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      // Check if assigned_to has changed
      if (updates.assigned_to && updates.assigned_to !== currentLead.assigned_to) {
        // Get the staff member's name
        const { data: staffMember } = await supabase
          .from('profiles')
          .select('full_name')
          .eq('id', updates.assigned_to)
          .single();
        
        const staffName = staffMember?.full_name || 'A staff member';
        
        // Create a notification for the assigned staff member
        await notificationService.createNotification({
          user_id: updates.assigned_to,
          title: 'Lead Assigned to You',
          message: `Lead "${currentLead.name}" has been assigned to you for follow-up.`,
          type: 'lead_assignment',
          category: 'crm',
          link: `/crm/leads?id=${id}`,
          source: 'system',
          related_id: id,
          branch_id: currentLead.branch_id
        });
        
        // Create a notification for admin users about the assignment
        const { data: adminUsers } = await supabase
          .from('profiles')
          .select('id')
          .in('role', ['admin', 'manager'])
          .eq('branch_id', currentLead.branch_id);
          
        if (adminUsers && adminUsers.length > 0) {
          for (const admin of adminUsers) {
            // Don't send to the assigned staff if they're also an admin
            if (admin.id !== updates.assigned_to) {
              await notificationService.createNotification({
                user_id: admin.id,
                title: 'Lead Assignment Update',
                message: `Lead "${currentLead.name}" has been assigned to ${staffName}.`,
                type: 'lead_assignment',
                category: 'crm',
                link: `/crm/leads?id=${id}`,
                source: 'system',
                related_id: id,
                branch_id: currentLead.branch_id
              });
            }
          }
        }
        
        // If a follow_up_date is set, create a follow-up entry
        if (updates.follow_up_date) {
          try {
            await supabase
              .from('follow_up_history')
              .insert({
                lead_id: id,
                type: 'call',
                subject: 'Scheduled follow-up',
                content: updates.notes || 'Follow up with lead',
                status: 'scheduled',
                scheduled_at: updates.follow_up_date,
                created_by: updates.assigned_to,
                created_at: new Date().toISOString()
              });
          } catch (followUpError) {
            console.error('Error creating follow-up entry:', followUpError);
            // Don't fail the lead update if follow-up creation fails
          }
        }
      } else if (updates.follow_up_date && updates.follow_up_date !== currentLead.follow_up_date) {
        // If only the follow_up_date changed, create/update a follow-up entry
        try {
          // Check if there's an existing follow-up for this lead
          const { data: existingFollowUp } = await supabase
            .from('follow_up_history')
            .select('id')
            .eq('lead_id', id)
            .eq('status', 'scheduled')
            .order('created_at', { ascending: false })
            .limit(1);
          
          if (existingFollowUp && existingFollowUp.length > 0) {
            // Update existing follow-up
            await supabase
              .from('follow_up_history')
              .update({
                scheduled_at: updates.follow_up_date,
                content: updates.notes || 'Follow up with lead'
              })
              .eq('id', existingFollowUp[0].id);
          } else {
            // Create new follow-up
            await supabase
              .from('follow_up_history')
              .insert({
                lead_id: id,
                type: 'call',
                subject: 'Scheduled follow-up',
                content: updates.notes || 'Follow up with lead',
                status: 'scheduled',
                scheduled_at: updates.follow_up_date,
                created_by: currentLead.assigned_to || updates.assigned_to,
                created_at: new Date().toISOString()
              });
          }
          
          // Notify the assigned staff member about the follow-up
          const staffId = currentLead.assigned_to || updates.assigned_to;
          if (staffId) {
            await notificationService.createNotification({
              user_id: staffId,
              title: 'Follow-up Scheduled',
              message: `A follow-up has been scheduled for lead "${currentLead.name}" on ${new Date(updates.follow_up_date).toLocaleDateString()}.`,
              type: 'follow_up',
              category: 'crm',
              link: `/crm/follow-up-management`,
              source: 'system',
              related_id: id,
              branch_id: currentLead.branch_id
            });
          }
        } catch (followUpError) {
          console.error('Error creating/updating follow-up entry:', followUpError);
          // Don't fail the lead update if follow-up creation fails
        }
      }
      
      toast.success('Lead updated successfully');
      return data as Lead;
    } catch (error: any) {
      console.error('Error updating lead:', error);
      toast.error(`Failed to update lead: ${error.message}`);
      return null;
    }
  },

  async deleteLead(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('leads')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast.success('Lead deleted successfully');
      return true;
    } catch (error: any) {
      console.error('Error deleting lead:', error);
      toast.error(`Failed to delete lead: ${error.message}`);
      return false;
    }
  }
};

export default crmService;
