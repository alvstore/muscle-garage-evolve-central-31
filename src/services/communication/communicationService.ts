import { supabase } from '@/integrations/supabase/client';
import { Feedback } from '@/types/communication/notification';

export const communicationService = {
  getAnnouncements: async (branchId?: string): Promise<any[]> => {
    try {
      let query = supabase
        .from('announcements')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (branchId) {
        query = query.eq('branch_id', branchId);
      }
      
      const { data, error } = await query;
      
      if (error) {
        console.error('Error fetching announcements:', error);
        throw error;
      }
      
      return data || [];
    } catch (err) {
      console.error('Communication service error:', err);
      return [];
    }
  },

  getReminderRules: async (branchId?: string): Promise<any[]> => {
    try {
      let query = supabase
        .from('reminder_rules')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (branchId) {
        query = query.eq('branch_id', branchId);
      }
      
      const { data, error } = await query;
      
      if (error) {
        console.error('Error fetching reminder rules:', error);
        throw error;
      }
      
      return data || [];
    } catch (err) {
      console.error('Communication service error:', err);
      return [];
    }
  },

  saveReminderRule: async (rule: any): Promise<boolean> => {
    try {
      if (rule.id) {
        // Update existing rule
        const { error } = await supabase
          .from('reminder_rules')
          .update(rule)
          .eq('id', rule.id);
          
        if (error) throw error;
      } else {
        // Create new rule
        const { error } = await supabase
          .from('reminder_rules')
          .insert([rule]);
          
        if (error) throw error;
      }
      
      return true;
    } catch (error) {
      console.error('Error saving reminder rule:', error);
      return false;
    }
  },

  deleteReminderRule: async (id: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('reminder_rules')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting reminder rule:', error);
      return false;
    }
  },

  getMotivationalMessages: async (category?: string): Promise<any[]> => {
    try {
      let query = supabase
        .from('motivational_messages')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (category) {
        query = query.eq('category', category);
      }
      
      const { data, error } = await query;
      
      if (error) {
        console.error('Error fetching motivational messages:', error);
        throw error;
      }
      
      return data || [];
    } catch (err) {
      console.error('Communication service error:', err);
      return [];
    }
  },

  saveMotivationalMessage: async (message: any): Promise<boolean> => {
    try {
      if (message.id) {
        // Update existing message
        const { error } = await supabase
          .from('motivational_messages')
          .update(message)
          .eq('id', message.id);
          
        if (error) throw error;
      } else {
        // Create new message
        const { error } = await supabase
          .from('motivational_messages')
          .insert([message]);
          
        if (error) throw error;
      }
      
      return true;
    } catch (error) {
      console.error('Error saving motivational message:', error);
      return false;
    }
  },

  deleteMotivationalMessage: async (id: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('motivational_messages')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting motivational message:', error);
      return false;
    }
  },

  getFeedback: async (branchId?: string): Promise<any[]> => {
    try {
      let query = supabase
        .from('feedback')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (branchId) {
        query = query.eq('branch_id', branchId);
      }
      
      const { data, error } = await query;
      
      if (error) {
        console.error('Error fetching feedback:', error);
        throw error;
      }
      
      return data || [];
    } catch (err) {
      console.error('Communication service error:', err);
      return [];
    }
  },
  
  submitFeedback: async (feedback: Feedback): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('feedback')
        .insert({
          title: feedback.title,
          rating: feedback.rating,
          comments: feedback.comments,
          member_id: feedback.member_id,
          member_name: feedback.member_name,
          type: feedback.type,
          related_id: feedback.related_id,
          anonymous: feedback.anonymous,
          branch_id: feedback.branch_id,
          created_at: new Date().toISOString()
        });
        
      if (error) throw error;
      return true;
    } catch (error) {
      console.error("Error submitting feedback:", error);
      return false;
    }
  },
};

export default communicationService;
