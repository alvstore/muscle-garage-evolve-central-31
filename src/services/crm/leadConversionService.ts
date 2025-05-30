import { supabase } from '@/integrations/supabase/client';
import { Lead } from '@/types/crm/crm';
import { Member } from '@/types/members/member';
import { toast } from 'sonner';
import { taskService } from '../communication/taskService';
import { format } from 'date-fns';

/**
 * Service for converting leads to members and managing the sales funnel
 */
export const leadConversionService = {
  /**
   * Convert a lead to a member
   * @param leadId - The ID of the lead to convert
   * @param memberData - The member data to create
   * @returns Promise with the created member
   */
  async convertLeadToMember(
    leadId: string, 
    memberData: {
      email: string;
      full_name: string;
      phone?: string;
      branch_id: string;
      membership_id: string;
      membership_start_date: string;
      membership_end_date?: string;
      membership_status: string;
      address?: string;
      emergency_contact?: string;
      notes?: string;
      password?: string;
    }
  ): Promise<Member | null> {
    try {
      // Start a transaction
      const { data: lead, error: leadError } = await supabase
        .from('leads')
        .select('*')
        .eq('id', leadId)
        .single();

      if (leadError || !lead) {
        console.error('Error fetching lead:', leadError);
        toast.error('Lead not found');
        return null;
      }

      // Create a new user account in auth.users
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: memberData.email,
        password: memberData.password || Math.random().toString(36).slice(-8), // Generate random password if not provided
        email_confirm: true,
        user_metadata: {
          full_name: memberData.full_name,
          role: 'member',
          branch_id: memberData.branch_id
        }
      });

      if (authError || !authData.user) {
        console.error('Error creating user:', authError);
        toast.error('Failed to create user account');
        return null;
      }

      // Update the profiles table with member details
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .update({
          full_name: memberData.full_name,
          phone: memberData.phone || lead.phone,
          role: 'member',
          branch_id: memberData.branch_id,
          membership_id: memberData.membership_id,
          membership_start_date: memberData.membership_start_date,
          membership_end_date: memberData.membership_end_date,
          membership_status: memberData.membership_status,
          address: memberData.address,
          emergency_contact: memberData.emergency_contact,
          notes: memberData.notes || lead.notes,
          status: 'active'
        })
        .eq('id', authData.user.id)
        .select()
        .single();

      if (profileError) {
        console.error('Error updating profile:', profileError);
        toast.error('Failed to update member profile');
        return null;
      }

      // Update the lead status to 'converted'
      const { error: updateLeadError } = await supabase
        .from('leads')
        .update({
          status: 'converted',
          conversion_date: new Date().toISOString(),
          conversion_value: memberData.membership_id, // Store membership ID as conversion value
          notes: `${lead.notes ? lead.notes + '\\n' : ''}Converted to member on ${new Date().toLocaleDateString()}`
        })
        .eq('id', leadId);

      if (updateLeadError) {
        console.error('Error updating lead status:', updateLeadError);
        toast.error('Failed to update lead status');
        // Continue anyway since the member was created
      }

      // Create a follow-up history entry for the conversion
      const { error: followUpError } = await supabase
        .from('follow_up_history')
        .insert([{
          lead_id: leadId,
          type: 'meeting',
          content: `Lead converted to member. Membership ID: ${memberData.membership_id}`,
          sent_by: authData.user.id, // The current user who performed the conversion
          sent_at: new Date().toISOString(),
          status: 'sent',
          response: 'Membership activated'
        }]);

      if (followUpError) {
        console.error('Error creating follow-up history:', followUpError);
        // Continue anyway since this is just a record
      }

      // Map the profile data to the Member interface
      const member: Member = {
        id: profileData.id,
        name: profileData.full_name,
        email: memberData.email,
        phone: profileData.phone || '',
        avatar: profileData.avatar_url || '',
        status: profileData.status,
        membershipStatus: profileData.membership_status,
        membershipId: profileData.membership_id,
        membershipStartDate: profileData.membership_start_date,
        membershipEndDate: profileData.membership_end_date,
        branchId: profileData.branch_id,
        address: profileData.address,
        emergencyContact: profileData.emergency_contact,
        notes: profileData.notes,
        role: 'member' // Default role for converted leads
      };

      toast.success('Lead successfully converted to member');
      return member;
    } catch (error: any) {
      console.error('Error in convertLeadToMember:', error);
      toast.error('Failed to convert lead to member');
      return null;
    }
  },

  /**
   * Schedule a follow-up for a lead
   * @param leadId - The ID of the lead
   * @param followUpData - The follow-up data
   * @returns Promise with success status
   */
  async scheduleFollowUp(
    leadId: string,
    followUpData: {
      type: 'email' | 'sms' | 'call' | 'meeting' | 'whatsapp';
      scheduledFor: string;
      subject: string;
      content: string;
      assignedTo?: string;
      branchId?: string;
    }
  ): Promise<boolean> {
    try {
      // Get lead details to include in the follow-up
      const { data: leadData, error: leadError } = await supabase
        .from('leads')
        .select('*')
        .eq('id', leadId)
        .single();
      
      if (leadError) throw leadError;
      
      const lead = leadData as Lead;
      
      // Create the follow-up entry
      const { data, error } = await supabase
        .from('follow_up_history')
        .insert([
          {
            lead_id: leadId,
            type: followUpData.type,
            content: followUpData.content,
            sent_by: followUpData.assignedTo,
            status: 'scheduled',
            scheduled_for: followUpData.scheduledFor,
            subject: followUpData.subject
          }
        ])
        .select()
        .single();

      if (error) throw error;
      
      // Create a task for the follow-up
      if (followUpData.branchId) {
        const scheduledDate = new Date(followUpData.scheduledFor);
        const formattedDate = format(scheduledDate, 'MMM dd, yyyy');
        
        // Create a task in the task management system
        await taskService.createTask({
          title: `${followUpData.type.toUpperCase()} Follow-up: ${lead.name}`,
          description: `${followUpData.subject}\n\nScheduled for: ${formattedDate}\n\n${followUpData.content}`,
          status: 'pending',
          priority: 'medium',
          due_date: followUpData.scheduledFor,
          assigned_to: followUpData.assignedTo,
          branch_id: followUpData.branchId,
          related_to: 'lead',
          related_id: leadId
        });
      }
      
      // Update the lead's follow_up_date
      const { error: updateError } = await supabase
        .from('leads')
        .update({
          follow_up_date: followUpData.scheduledFor,
          last_contact_date: new Date().toISOString()
        })
        .eq('id', leadId);

      if (updateError) {
        console.error('Error updating lead follow-up date:', updateError);
        // Continue anyway since the follow-up was scheduled
      }

      toast.success('Follow-up scheduled successfully');
      return true;
    } catch (error: any) {
      console.error('Error in scheduleFollowUp:', error);
      toast.error('Failed to schedule follow-up');
      return false;
    }
  },

  /**
   * Update a lead's funnel stage
   * @param leadId - The ID of the lead
   * @param stage - The new funnel stage
   * @param notes - Optional notes about the stage change
   * @returns Promise with success status
   */
  async updateLeadStage(
    leadId: string,
    stage: 'cold' | 'warm' | 'hot' | 'won' | 'lost',
    notes?: string
  ): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('leads')
        .update({
          funnel_stage: stage,
          status: stage === 'won' ? 'won' : stage === 'lost' ? 'lost' : 'contacted',
          updated_at: new Date().toISOString(),
          notes: notes ? `${notes}\\n(Stage updated to ${stage})` : `Stage updated to ${stage}`
        })
        .eq('id', leadId);

      if (error) {
        console.error('Error updating lead stage:', error);
        toast.error('Failed to update lead stage');
        return false;
      }

      toast.success(`Lead moved to ${stage} stage`);
      return true;
    } catch (error: any) {
      console.error('Error in updateLeadStage:', error);
      toast.error('Failed to update lead stage');
      return false;
    }
  }
};

export default leadConversionService;
