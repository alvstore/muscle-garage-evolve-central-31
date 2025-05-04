
import { supabase } from '@/integrations/supabase/client';
import { 
  Announcement, 
  Feedback, 
  MotivationalMessage, 
  ReminderRule, 
  FeedbackType,
} from '@/types/notification';

// Add the adapter functions that are imported but missing
export const adaptAnnouncementFromDB = (dbAnnouncement: any): Announcement => {
  return {
    id: dbAnnouncement.id,
    title: dbAnnouncement.title,
    content: dbAnnouncement.content,
    priority: dbAnnouncement.priority || 'medium',
    authorName: dbAnnouncement.author_name,
    authorId: dbAnnouncement.author_id,
    createdAt: dbAnnouncement.created_at,
    expiresAt: dbAnnouncement.expires_at,
    channel: dbAnnouncement.channel,
    branchId: dbAnnouncement.branch_id,
    targetRoles: dbAnnouncement.target_roles,
    channels: dbAnnouncement.channels
  };
};

export const adaptFeedbackFromDB = (dbFeedback: any): Feedback => {
  return {
    id: dbFeedback.id,
    title: dbFeedback.title,
    rating: dbFeedback.rating,
    comments: dbFeedback.comments,
    member_id: dbFeedback.member_id,
    member_name: dbFeedback.member_name,
    branch_id: dbFeedback.branch_id,
    type: dbFeedback.type,
    anonymous: dbFeedback.anonymous || false,
    created_at: dbFeedback.created_at,
    related_id: dbFeedback.related_id
  };
};

export const adaptReminderRuleFromDB = (dbRule: any): ReminderRule => {
  return {
    id: dbRule.id,
    title: dbRule.title,
    name: dbRule.name || dbRule.title,
    description: dbRule.description,
    triggerType: dbRule.trigger_type,
    triggerValue: dbRule.trigger_value,
    message: dbRule.message,
    notificationChannel: dbRule.notification_channel,
    conditions: dbRule.conditions || {},
    isActive: dbRule.is_active,
    active: dbRule.is_active, // For backward compatibility
    targetRoles: dbRule.target_roles || [],
    sendVia: dbRule.send_via || [],
    channels: dbRule.channels || [],
    targetType: dbRule.target_type || 'all'
  };
};

export const adaptMotivationalMessageFromDB = (dbMessage: any): MotivationalMessage => {
  return {
    id: dbMessage.id,
    title: dbMessage.title,
    content: dbMessage.content,
    author: dbMessage.author,
    category: dbMessage.category,
    tags: dbMessage.tags || [],
    active: dbMessage.active,
    created_at: dbMessage.created_at,
    updated_at: dbMessage.updated_at
  };
};

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
          is_active: rule.active || rule.isActive || false,
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

  async updateReminderRule(id: string, rule: Partial<ReminderRule>): Promise<ReminderRule | null> {
    try {
      // Convert our frontend model to the database column names
      const dbRule = {
        ...(rule.id && { id: rule.id }),
        ...(rule.title && { title: rule.title }),
        ...(rule.name && { name: rule.name }),
        ...(rule.description && { description: rule.description }),
        ...(rule.triggerType && { trigger_type: rule.triggerType }),
        ...(rule.triggerValue && { trigger_value: rule.triggerValue }),
        ...(rule.message && { message: rule.message }),
        ...(rule.notificationChannel && { notification_channel: rule.notificationChannel }),
        ...(rule.conditions && { conditions: rule.conditions }),
        // Fix here: use isActive instead of enabled
        ...(rule.isActive !== undefined && { is_active: rule.isActive }),
        ...(rule.targetRoles && { target_roles: rule.targetRoles }),
        ...(rule.sendVia && { send_via: rule.sendVia }),
        ...(rule.channels && { channels: rule.channels }),
        ...(rule.targetType && { target_type: rule.targetType })
      };

      // Another fix: if we have active but not isActive, use active
      if (rule.active !== undefined && rule.isActive === undefined) {
        dbRule.is_active = rule.active;
      }

      const { data, error } = await supabase
        .from('reminder_rules')
        .update(dbRule)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return adaptReminderRuleFromDB(data);
    } catch (error) {
      console.error("Error updating reminder rule:", error);
      return null;
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
