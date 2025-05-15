
import { supabase } from './supabaseClient';
import { MotivationalMessage, ReminderRule, Announcement, Feedback } from '@/types/notification';
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
      
      return data.map(msg => ({
        id: msg.id,
        title: msg.title,
        content: msg.content,
        category: msg.category,
        tags: msg.tags || [],
        author: msg.author || 'Unknown',
        active: msg.active,
        created_at: msg.created_at,
        updated_at: msg.updated_at
      }));
    } catch (error) {
      console.error('Error fetching motivational messages:', error);
      throw error;
    }
  },

  // Create a new motivational message
  createMotivationalMessage: async (message: Omit<MotivationalMessage, 'id' | 'created_at' | 'updated_at'>): Promise<MotivationalMessage> => {
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
      
      return {
        id: data.id,
        title: data.title,
        content: data.content,
        category: data.category,
        tags: data.tags || [],
        author: data.author || 'Unknown',
        active: data.active,
        created_at: data.created_at,
        updated_at: data.updated_at
      };
    } catch (error) {
      console.error('Error creating motivational message:', error);
      throw error;
    }
  },

  // Update a motivational message
  updateMotivationalMessage: async (id: string, updates: Partial<Omit<MotivationalMessage, 'id' | 'created_at' | 'updated_at'>>): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('motivational_messages')
        .update(updates)
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

// Export required adapter functions that many components are importing
export const adaptAnnouncementFromDB = (dbAnnouncement: any): Announcement => {
  return {
    id: dbAnnouncement.id,
    title: dbAnnouncement.title,
    content: dbAnnouncement.content,
    priority: dbAnnouncement.priority,
    authorName: dbAnnouncement.author_name || dbAnnouncement.author,
    authorId: dbAnnouncement.author_id,
    createdAt: dbAnnouncement.created_at,
    expiresAt: dbAnnouncement.expires_at,
    channel: dbAnnouncement.channel,
    branchId: dbAnnouncement.branch_id,
    targetRoles: dbAnnouncement.target_roles || [],
    channels: dbAnnouncement.channels || [dbAnnouncement.channel].filter(Boolean),
  };
};

export const adaptFeedbackFromDB = (dbFeedback: any): Feedback => {
  return {
    id: dbFeedback.id,
    title: dbFeedback.title,
    comments: dbFeedback.comments,
    rating: dbFeedback.rating,
    type: dbFeedback.type,
    member_id: dbFeedback.member_id,
    member_name: dbFeedback.member_name,
    created_at: dbFeedback.created_at,
    branch_id: dbFeedback.branch_id,
    anonymous: dbFeedback.anonymous || false,
    related_id: dbFeedback.related_id
  };
};

// Re-export other communication services
export * from './notificationService';

// Default export for backwards compatibility
export default {
  motivationalMessageService
};
