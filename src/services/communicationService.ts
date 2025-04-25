
import { supabase } from './supabaseClient';
import { 
  Announcement, 
  Feedback, 
  MotivationalMessage, 
  ReminderRule, 
  FeedbackType,
  adaptAnnouncementFromDB,
  adaptFeedbackFromDB,
  adaptReminderRuleFromDB,
  adaptMotivationalMessageFromDB
} from '@/types/notification';

// Announcement Service
export const announcementService = {
  async getAnnouncements(): Promise<Announcement[]> {
    try {
      const { data, error } = await supabase
        .from('announcements')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      return data.map(adaptAnnouncementFromDB);
    } catch (error) {
      console.error('Error fetching announcements:', error);
      return [];
    }
  },

  async createAnnouncement(announcement: Omit<Announcement, 'id' | 'createdAt'>): Promise<Announcement | null> {
    try {
      const { data, error } = await supabase
        .from('announcements')
        .insert({
          title: announcement.title,
          content: announcement.content,
          priority: announcement.priority,
          author_name: announcement.authorName,
          expires_at: announcement.expiresAt,
          channel: announcement.channel,
          branch_id: announcement.branchId,
          target_roles: announcement.targetRoles,
          channels: announcement.channels,
          author_id: announcement.authorId
        })
        .select()
        .single();

      if (error) throw error;
      
      return adaptAnnouncementFromDB(data);
    } catch (error) {
      console.error('Error creating announcement:', error);
      return null;
    }
  },

  async updateAnnouncement(id: string, announcement: Partial<Announcement>): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('announcements')
        .update({
          title: announcement.title,
          content: announcement.content,
          priority: announcement.priority,
          expires_at: announcement.expiresAt,
          channel: announcement.channel,
          target_roles: announcement.targetRoles,
          channels: announcement.channels,
        })
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error updating announcement:', error);
      return false;
    }
  },

  async deleteAnnouncement(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('announcements')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting announcement:', error);
      return false;
    }
  }
};

// Feedback Service
export const feedbackService = {
  async getFeedback(type?: FeedbackType): Promise<Feedback[]> {
    try {
      let query = supabase
        .from('feedback')
        .select('*')
        .order('created_at', { ascending: false });

      if (type) {
        query = query.eq('type', type);
      }

      const { data, error } = await query;

      if (error) throw error;

      return data.map(adaptFeedbackFromDB);
    } catch (error) {
      console.error('Error fetching feedback:', error);
      return [];
    }
  },

  async createFeedback(feedback: Omit<Feedback, 'id' | 'created_at'>): Promise<Feedback | null> {
    try {
      const { data, error } = await supabase
        .from('feedback')
        .insert({
          member_id: feedback.member_id,
          member_name: feedback.member_name,
          type: feedback.type,
          related_id: feedback.related_id,
          rating: feedback.rating,
          comments: feedback.comments,
          anonymous: feedback.anonymous,
          title: feedback.title,
          branch_id: feedback.branch_id
        })
        .select()
        .single();

      if (error) throw error;

      return adaptFeedbackFromDB(data);
    } catch (error) {
      console.error('Error creating feedback:', error);
      return null;
    }
  }
};

// Reminder Rules Service
export const reminderRuleService = {
  async getReminderRules(): Promise<ReminderRule[]> {
    try {
      const { data, error } = await supabase
        .from('reminder_rules')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      return data.map(adaptReminderRuleFromDB);
    } catch (error) {
      console.error('Error fetching reminder rules:', error);
      return [];
    }
  },

  async createReminderRule(rule: Omit<ReminderRule, 'id' | 'createdAt' | 'updatedAt'>): Promise<ReminderRule | null> {
    try {
      const { data, error } = await supabase
        .from('reminder_rules')
        .insert({
          title: rule.title || rule.name,
          description: rule.description,
          trigger_type: rule.triggerType,
          notification_channel: rule.notificationChannel,
          conditions: rule.conditions || {},
          is_active: rule.active || rule.isActive || rule.enabled || false,
          trigger_value: rule.triggerValue,
          message: rule.message,
          send_via: rule.sendVia || rule.channels || [],
          target_roles: rule.targetRoles
        })
        .select()
        .single();

      if (error) throw error;

      return adaptReminderRuleFromDB(data);
    } catch (error) {
      console.error('Error creating reminder rule:', error);
      return null;
    }
  },

  async updateReminderRule(id: string, rule: Partial<ReminderRule>): Promise<boolean> {
    try {
      const updateData: any = {};

      if (rule.title) updateData.title = rule.title;
      if (rule.name) updateData.title = rule.name;
      if (rule.description !== undefined) updateData.description = rule.description;
      if (rule.triggerType) updateData.trigger_type = rule.triggerType;
      if (rule.notificationChannel) updateData.notification_channel = rule.notificationChannel;
      if (rule.conditions) updateData.conditions = rule.conditions;
      if (rule.active !== undefined) updateData.is_active = rule.active;
      if (rule.isActive !== undefined) updateData.is_active = rule.isActive;
      if (rule.enabled !== undefined) updateData.is_active = rule.enabled;
      if (rule.triggerValue !== undefined) updateData.trigger_value = rule.triggerValue;
      if (rule.message) updateData.message = rule.message;
      if (rule.sendVia) updateData.send_via = rule.sendVia;
      if (rule.channels) updateData.send_via = rule.channels;
      if (rule.targetRoles) updateData.target_roles = rule.targetRoles;
      
      const { error } = await supabase
        .from('reminder_rules')
        .update(updateData)
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error updating reminder rule:', error);
      return false;
    }
  }
};

// Motivational Messages Service
export const motivationalMessageService = {
  async getMotivationalMessages(): Promise<MotivationalMessage[]> {
    try {
      const { data, error } = await supabase
        .from('motivational_messages')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      return data.map(adaptMotivationalMessageFromDB);
    } catch (error) {
      console.error('Error fetching motivational messages:', error);
      return [];
    }
  },

  async createMotivationalMessage(
    message: Omit<MotivationalMessage, 'id' | 'created_at' | 'updated_at'>
  ): Promise<MotivationalMessage | null> {
    try {
      const { data, error } = await supabase
        .from('motivational_messages')
        .insert({
          title: message.title,
          content: message.content,
          author: message.author,
          category: message.category,
          tags: message.tags,
          active: message.active || message.isActive
        })
        .select()
        .single();

      if (error) throw error;

      return adaptMotivationalMessageFromDB(data);
    } catch (error) {
      console.error('Error creating motivational message:', error);
      return null;
    }
  }
};
