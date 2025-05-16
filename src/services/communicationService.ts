
import { supabase } from '@/integrations/supabase/client';
import { Announcement, Feedback, MotivationalMessage, ReminderRule, adaptAnnouncementFromDB, adaptFeedbackFromDB, adaptMotivationalMessageFromDB, adaptReminderRuleFromDB } from '@/types/notification';
import { toast } from 'sonner';

// Motivational Message Service
export const motivationalMessageService = {
  // Get all motivational messages
  getMotivationalMessages: async (): Promise<MotivationalMessage[]> => {
    try {
      const { data, error } = await supabase
        .from('motivational_messages')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      return data.map(msg => adaptMotivationalMessageFromDB(msg));
    } catch (error) {
      console.error('Error fetching motivational messages:', error);
      throw error;
    }
  },

  // Create a new motivational message
  createMotivationalMessage: async (message: Partial<MotivationalMessage>): Promise<MotivationalMessage> => {
    try {
      const { data, error } = await supabase
        .from('motivational_messages')
        .insert({
          title: message.title,
          content: message.content,
          category: message.category,
          tags: message.tags || [],
          author: message.author || 'Unknown',
          active: message.active
        })
        .select()
        .single();
      
      if (error) throw error;
      
      return adaptMotivationalMessageFromDB(data);
    } catch (error) {
      console.error('Error creating motivational message:', error);
      throw error;
    }
  },

  // Update a motivational message
  updateMotivationalMessage: async (id: string, updates: Partial<MotivationalMessage>): Promise<boolean> => {
    try {
      const dbUpdates: any = {};
      
      if (updates.title !== undefined) dbUpdates.title = updates.title;
      if (updates.content !== undefined) dbUpdates.content = updates.content;
      if (updates.category !== undefined) dbUpdates.category = updates.category;
      if (updates.tags !== undefined) dbUpdates.tags = updates.tags;
      if (updates.author !== undefined) dbUpdates.author = updates.author;
      if (updates.active !== undefined) dbUpdates.active = updates.active;
      
      const { error } = await supabase
        .from('motivational_messages')
        .update(dbUpdates)
        .eq('id', id);
      
      if (error) throw error;
      
      return true;
    } catch (error) {
      console.error('Error updating motivational message:', error);
      throw error;
    }
  },

  // Delete a motivational message
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
      throw error;
    }
  }
};

export const communicationService = {
  // Announcements
  getAnnouncements: async (branchId?: string): Promise<Announcement[]> => {
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
      
      return (data || []).map(adaptAnnouncementFromDB);
    } catch (err) {
      console.error('Communication service error:', err);
      toast.error('Failed to load announcements');
      return [];
    }
  },
  
  createAnnouncement: async (announcement: Partial<Announcement>): Promise<Announcement | null> => {
    try {
      const { data, error } = await supabase
        .from('announcements')
        .insert([announcement])
        .select()
        .single();
      
      if (error) {
        console.error('Error creating announcement:', error);
        throw error;
      }
      
      toast.success('Announcement created successfully');
      return adaptAnnouncementFromDB(data);
    } catch (err) {
      console.error('Communication service error:', err);
      toast.error('Failed to create announcement');
      return null;
    }
  },
  
  // Feedback
  getFeedback: async (branchId?: string): Promise<Feedback[]> => {
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
      
      return (data || []).map(adaptFeedbackFromDB);
    } catch (err) {
      console.error('Communication service error:', err);
      toast.error('Failed to load feedback');
      return [];
    }
  },
  
  // Reminder Rules
  getReminderRules: async (): Promise<ReminderRule[]> => {
    try {
      const { data, error } = await supabase
        .from('reminder_rules')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching reminder rules:', error);
        throw error;
      }
      
      return (data || []).map(adaptReminderRuleFromDB);
    } catch (err) {
      console.error('Communication service error:', err);
      toast.error('Failed to load reminder rules');
      return [];
    }
  },
  
  createReminderRule: async (rule: Partial<ReminderRule>): Promise<ReminderRule | null> => {
    try {
      const { data, error } = await supabase
        .from('reminder_rules')
        .insert([rule])
        .select()
        .single();
      
      if (error) {
        console.error('Error creating reminder rule:', error);
        throw error;
      }
      
      toast.success('Reminder rule created successfully');
      return adaptReminderRuleFromDB(data);
    } catch (err) {
      console.error('Communication service error:', err);
      toast.error('Failed to create reminder rule');
      return null;
    }
  }
};
