import { supabase } from '@/integrations/supabase/client';
import { Lead } from '@/types/crm/crm';
import { toast } from 'sonner';

/**
 * Service for scoring and prioritizing leads
 */
export const leadScoringService = {
  /**
   * Calculate a lead score based on interactions and profile
   * @param leadId - The ID of the lead to score
   * @returns Promise with the calculated score
   */
  async calculateLeadScore(leadId: string): Promise<number> {
    try {
      // Fetch lead data
      const { data: lead, error: leadError } = await supabase
        .from('leads')
        .select('*')
        .eq('id', leadId)
        .single();
      
      if (leadError || !lead) {
        console.error('Error fetching lead:', leadError);
        return 0;
      }
      
      // Fetch follow-up history
      const { data: followUps, error: followUpError } = await supabase
        .from('follow_up_history')
        .select('*')
        .eq('lead_id', leadId);
      
      if (followUpError) {
        console.error('Error fetching follow-ups:', followUpError);
        // Continue with available data
      }
      
      // Calculate score based on various factors
      let score = 0;
      
      // 1. Funnel Stage (max 30 points)
      if (lead.funnel_stage === 'hot') score += 30;
      else if (lead.funnel_stage === 'warm') score += 15;
      else if (lead.funnel_stage === 'cold') score += 5;
      
      // 2. Follow-up Engagement (max 30 points)
      if (followUps && followUps.length > 0) {
        // Points for each follow-up response (max 20 points)
        const responseCount = followUps.filter(f => f.response).length;
        score += Math.min(responseCount * 5, 20);
        
        // Points for recent follow-ups (max 10 points)
        const recentFollowUps = followUps.filter(f => {
          const followUpDate = new Date(f.sent_at);
          const thirtyDaysAgo = new Date();
          thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
          return followUpDate >= thirtyDaysAgo;
        });
        score += Math.min(recentFollowUps.length * 2, 10);
      }
      
      // 3. Profile Completeness (max 20 points)
      let profileScore = 0;
      if (lead.email) profileScore += 5;
      if (lead.phone) profileScore += 5;
      if (lead.interests && lead.interests.length > 0) profileScore += 5;
      if (lead.notes && lead.notes.length > 10) profileScore += 5;
      score += profileScore;
      
      // 4. Source Quality (max 10 points)
      if (lead.source === 'referral') score += 10;
      else if (lead.source === 'walk_in') score += 8;
      else if (lead.source === 'website') score += 6;
      else if (lead.source === 'social_media') score += 5;
      else score += 3; // Other sources
      
      // 5. Recency (max 10 points)
      if (lead.last_contact_date) {
        const lastContact = new Date(lead.last_contact_date);
        const now = new Date();
        const daysSinceLastContact = Math.floor((now.getTime() - lastContact.getTime()) / (1000 * 60 * 60 * 24));
        
        if (daysSinceLastContact <= 7) score += 10;
        else if (daysSinceLastContact <= 14) score += 7;
        else if (daysSinceLastContact <= 30) score += 5;
        else if (daysSinceLastContact <= 60) score += 3;
        else score += 1;
      }
      
      // Update the lead with the calculated score
      await supabase
        .from('leads')
        .update({ score })
        .eq('id', leadId);
      
      return score;
    } catch (error: any) {
      console.error('Error calculating lead score:', error);
      return 0;
    }
  },
  
  /**
   * Calculate scores for all leads in a branch
   * @param branchId - The branch ID
   * @returns Promise with success status
   */
  async calculateAllLeadScores(branchId: string): Promise<boolean> {
    try {
      // Fetch all leads for the branch
      const { data: leads, error } = await supabase
        .from('leads')
        .select('id')
        .eq('branch_id', branchId);
      
      if (error) {
        console.error('Error fetching leads:', error);
        toast.error('Failed to fetch leads for scoring');
        return false;
      }
      
      // Calculate score for each lead
      const scorePromises = leads.map(lead => this.calculateLeadScore(lead.id));
      await Promise.all(scorePromises);
      
      toast.success('Lead scores updated successfully');
      return true;
    } catch (error: any) {
      console.error('Error calculating all lead scores:', error);
      toast.error('Failed to update lead scores');
      return false;
    }
  },
  
  /**
   * Get high-priority leads based on score
   * @param branchId - The branch ID
   * @param limit - Maximum number of leads to return
   * @returns Promise with high-priority leads
   */
  async getHighPriorityLeads(branchId: string, limit: number = 10): Promise<Lead[]> {
    try {
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .eq('branch_id', branchId)
        .not('status', 'in', '(converted,won,lost)')
        .order('score', { ascending: false })
        .limit(limit);
      
      if (error) {
        console.error('Error fetching high-priority leads:', error);
        return [];
      }
      
      return data as Lead[];
    } catch (error: any) {
      console.error('Error in getHighPriorityLeads:', error);
      return [];
    }
  }
};

export default leadScoringService;
