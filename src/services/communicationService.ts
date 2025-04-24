
import { supabase } from './supabaseClient';
import { Announcement, Feedback, MotivationalMessage, ReminderRule, FeedbackType } from '@/types/notification';

// Announcement Service
export const announcementService = {
  async getAnnouncements(): Promise<Announcement[]> {
    try {
      const { data, error } = await supabase
        .from('announcements')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      return data.map(item => ({
        id: item.id,
        title: item.title,
        content: item.content,
        priority: item.priority,
        authorName: item.author_name,
        createdAt: item.created_at,
        expiresAt: item.expires_at,
        channel: item.channel,
        branchId: item.branch_id,
        targetRoles: item.target_roles || [],
        channels: item.channels || [],
        authorId: item.author_id
      }));
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

      return {
        id: data.id,
        title: data.title,
        content: data.content,
        priority: data.priority,
        authorName: data.author_name,
        createdAt: data.created_at,
        expiresAt: data.expires_at,
        channel: data.channel,
        branchId: data.branch_id,
        targetRoles: data.target_roles || [],
        channels: data.channels || [],
        authorId: data.author_id
      };
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

      return data.map(item => ({
        id: item.id,
        member_id: item.member_id,
        member_name: item.member_name,
        type: item.type,
        related_id: item.related_id,
        rating: item.rating,
        comments: item.comments,
        anonymous: item.anonymous,
        title: item.title,
        created_at: item.created_at,
        branch_id: item.branch_id,
        // For backward compatibility
        memberId: item.member_id,
        memberName: item.member_name,
        createdAt: item.created_at
      }));
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

      return {
        id: data.id,
        member_id: data.member_id,
        member_name: data.member_name,
        type: data.type,
        related_id: data.related_id,
        rating: data.rating,
        comments: data.comments,
        anonymous: data.anonymous,
        title: data.title,
        created_at: data.created_at,
        branch_id: data.branch_id
      };
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

      return data.map(item => ({
        id: item.id,
        title: item.title,
        description: item.description,
        triggerType: item.trigger_type,
        notificationChannel: item.notification_channel,
        conditions: item.conditions || {},
        isActive: item.is_active,
        createdAt: item.created_at,
        updatedAt: item.updated_at,
        name: item.title,
        triggerValue: item.trigger_value,
        message: item.message,
        sendVia: item.send_via,
        targetRoles: item.target_roles,
        active: item.is_active,
        enabled: item.is_active
      }));
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
          title: rule.title,
          description: rule.description,
          trigger_type: rule.triggerType,
          notification_channel: rule.notificationChannel,
          conditions: rule.conditions || {},
          is_active: rule.active || rule.isActive || rule.enabled || false,
          trigger_value: rule.triggerValue,
          message: rule.message,
          send_via: rule.sendVia,
          target_roles: rule.targetRoles
        })
        .select()
        .single();

      if (error) throw error;

      return {
        id: data.id,
        title: data.title,
        description: data.description,
        triggerType: data.trigger_type,
        notificationChannel: data.notification_channel,
        conditions: data.conditions,
        isActive: data.is_active,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
        name: data.title,
        triggerValue: data.trigger_value,
        message: data.message,
        sendVia: data.send_via,
        targetRoles: data.target_roles,
        active: data.is_active,
        enabled: data.is_active
      };
    } catch (error) {
      console.error('Error creating reminder rule:', error);
      return null;
    }
  },

  async updateReminderRule(id: string, rule: Partial<ReminderRule>): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('reminder_rules')
        .update({
          title: rule.title,
          description: rule.description,
          trigger_type: rule.triggerType,
          notification_channel: rule.notificationChannel,
          conditions: rule.conditions,
          is_active: rule.active || rule.isActive || rule.enabled,
          trigger_value: rule.triggerValue,
          message: rule.message,
          send_via: rule.sendVia,
          target_roles: rule.targetRoles
        })
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

      return data;
    } catch (error) {
      console.error('Error fetching motivational messages:', error);
      return [];
    }
  },

  async createMotivationalMessage(message: Omit<MotivationalMessage, 'id' | 'created_at' | 'updated_at'>): Promise<MotivationalMessage | null> {
    try {
      const { data, error } = await supabase
        .from('motivational_messages')
        .insert({
          title: message.title,
          content: message.content,
          author: message.author,
          category: message.category,
          tags: message.tags,
          active: message.active
        })
        .select()
        .single();

      if (error) throw error;

      return data;
    } catch (error) {
      console.error('Error creating motivational message:', error);
      return null;
    }
  }
};
