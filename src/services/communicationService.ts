
import { supabase } from './supabaseClient';
import { MotivationalMessage, MotivationalCategory, ReminderRule, Announcement, Feedback, adaptMotivationalMessageFromDB, adaptAnnouncementFromDB, adaptReminderRuleFromDB } from '@/types/notification';
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
  createMotivationalMessage: async (message: Omit<MotivationalMessage, 'id' | 'created_at' | 'updated_at' | 'is_active' | 'message'>): Promise<MotivationalMessage> => {
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
  updateMotivationalMessage: async (id: string, updates: Partial<Omit<MotivationalMessage, 'id' | 'created_at' | 'updated_at'>>): Promise<boolean> => {
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

// Re-export other communication services
export * from './notificationService';

// Default export for backwards compatibility
export default {
  motivationalMessageService
};
