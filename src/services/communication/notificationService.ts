import { supabase } from '@/integrations/supabase/client';
import { followUpService } from '../crm/followUpService';
import { format, isToday, isTomorrow, parseISO } from 'date-fns';
import { toast } from 'sonner';

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type?: string;
  read: boolean;
  created_at: string;
  link?: string;
  source?: 'system' | 'follow-up';
  related_id?: string;
  category?: 'announcement' | 'feedback' | 'system' | 'gym' | 'member' | 'staff' | 'trainer' | 'motivation' | 'fitness' | 'nutrition' | 'wellness' | string;
  author?: string;
  tags?: string[];
  branch_id?: string; // Add branch_id to make notifications branch-specific
}

export const notificationService = {
  async getNotifications(userId: string, includeFallowUps: boolean = true): Promise<Notification[]> {
    // Validate user ID
    if (!userId || userId === '0' || userId === 'undefined') {
      console.warn('Invalid user ID provided to getNotifications:', userId);
      return [];
    }

    // Get user profile to get role and branch_id
    const { data: userProfile, error: profileError } = await supabase
      .from('profiles')
      .select('role, branch_id')
      .eq('id', userId)
      .single();

    if (profileError) {
      console.error('Error fetching user profile for notifications:', profileError);
      throw profileError;
    }
    const userRole = userProfile?.role || 'member';
    const userBranchId = userProfile?.branch_id;
    try {
      // Get system notifications
      let notificationsQuery = supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
        
      // Filter by branch_id if available
      if (userBranchId) {
        notificationsQuery = notificationsQuery.or(`branch_id.eq.${userBranchId},branch_id.is.null`);
      }
      
      const { data: systemData, error: systemError } = await notificationsQuery;

      if (systemError) throw systemError;

      // Get announcements - fetch all that match either the user's role or branch
      // Using separate queries and combining results to avoid complex filter issues
      
      // Get the current time to filter out expired announcements
      const now = new Date().toISOString();
      
      // First query: Get announcements for this user's branch
      let branchQuery = supabase
        .from('announcements')
        .select('*, announcement_reads(user_id, read_at)')
        .order('created_at', { ascending: false })
        .limit(10); // Limit to 10 most recent messages
      
      if (userBranchId) {
        branchQuery = branchQuery.eq('branch_id', userBranchId);
      }
      
      // Add expiration filter using .or() with proper syntax
      branchQuery = branchQuery.or(`and(expires_at.gt.${now},expires_at.is.null)`);
      
      const { data: branchAnnouncements, error: branchError } = await branchQuery;
      
      if (branchError) throw branchError;
      
      // Second query: Get global announcements (branch_id is null)
      const { data: globalAnnouncements, error: globalError } = await supabase
        .from('announcements')
        .select('*, announcement_reads(user_id, read_at)')
        .is('branch_id', null)
        .order('created_at', { ascending: false })
        .limit(10)
        .or(`and(expires_at.gt.${now},expires_at.is.null)`);
      
      if (globalError) throw globalError;
      
      // Combine results and remove duplicates
      const announcements = [...(branchAnnouncements || []), ...(globalAnnouncements || [])];
      const uniqueAnnouncements = announcements.filter((announcement, index, self) =>
        index === self.findIndex((a) => a.id === announcement.id)
      );

      // Get feedback
      const { data: feedback, error: feedbackError } = await supabase
        .from('feedback')
        .select('*')
        .eq('member_id', userId) // feedback table uses member_id instead of user_id
        .order('created_at', { ascending: false });

      if (feedbackError) throw feedbackError;



      // Convert announcements to notifications format
      const announcementNotifications = (uniqueAnnouncements || []).map(announcement => {
        // Check if this announcement has been read by the user
        const readRecord = announcement.announcement_reads?.find(
          (record: any) => record.user_id === userId && record.read_at
        );
        
        return {
          id: `announcement-${announcement.id}`,
          user_id: userId,
          title: announcement.title,
          message: announcement.content,
          type: 'announcement',
          read: !!readRecord, // Mark as read if there's a read record
          created_at: announcement.created_at,
          category: 'announcement',
          priority: announcement.priority,
          branch_id: announcement.branch_id,
          link: '/announcements'
        };
      });

      // Convert feedback to notifications format
      const feedbackNotifications = (feedback || []).map(item => ({
        id: `feedback-${item.id}`,
        user_id: userId,
        title: item.subject || 'New Feedback',
        message: item.message || item.description || '',
        type: 'feedback',
        read: false,
        created_at: item.created_at,
        category: 'feedback',
        branch_id: item.branch_id,
        source: 'feedback'
      }));

      // Get motivational messages - limit to recent ones to improve performance
      const { data: motivationalMessages, error: motivationalError } = await supabase
        .from('motivational_messages')
        .select('id, title, content, author, category, tags, created_at')
        .eq('active', true)
        .order('created_at', { ascending: false })
        .limit(5); // Limit to 5 most recent messages to reduce payload size

      if (motivationalError) throw motivationalError;

      // Convert motivational messages to notifications format
      const motivationalNotifications = (motivationalMessages || []).map(message => ({
        id: `motivational-${message.id}`,
        user_id: userId,
        title: message.title,
        message: message.content,
        type: 'motivational',
        read: false,
        created_at: message.created_at,
        category: message.category,
        source: 'motivational',
        author: message.author,
        tags: message.tags
      }));

      // Combine all notifications
      const allNotifications = [
        ...(systemData || []),
        ...announcementNotifications,
        ...feedbackNotifications,
        ...motivationalNotifications
      ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

      // Assign categories to system notifications if they don't have one
      let notifications = allNotifications.map(notification => {
        if (notification.category) return notification;
        
        // Determine category based on notification type and content
        let category = 'gym'; // Default category
        const type = notification.type || '';
        const title = (notification.title || '').toLowerCase();
        const message = (notification.message || '').toLowerCase();
        
        // Check for member-related notifications
        if (
          type === 'member' || 
          title.includes('member') || 
          message.includes('member') ||
          title.includes('payment') ||
          message.includes('payment') ||
          title.includes('check-in') ||
          message.includes('check-in') ||
          title.includes('attendance') ||
          message.includes('attendance')
        ) {
          category = 'member';
        }
        // Check for staff-related notifications
        else if (
          type === 'staff' || 
          title.includes('staff') || 
          message.includes('staff') ||
          title.includes('task') ||
          message.includes('task') ||
          title.includes('assignment') ||
          message.includes('assignment')
        ) {
          category = 'staff';
        }
        // Check for trainer-related notifications
        else if (
          type === 'trainer' || 
          title.includes('trainer') || 
          message.includes('trainer') ||
          title.includes('session') ||
          message.includes('session') ||
          title.includes('program') ||
          message.includes('program')
        ) {
          category = 'trainer';
        }
        
        return {
          ...notification,
          category
        };
      }) as Notification[];
      
      // If requested, also include follow-up reminders as notifications
      if (includeFallowUps && userId) {
        try {
          const followUps = await this.getFollowUpNotifications(userId);
          notifications = [...notifications, ...followUps];
          
          // Sort by created_at/scheduled_for date
          notifications.sort((a, b) => {
            return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
          });
        } catch (followUpError) {
          console.error('Error fetching follow-up notifications:', followUpError);
        }
      }
      
      return notifications;
    } catch (error: any) {
      console.error('Error fetching notifications:', error);
      toast.error('Failed to load notifications');
      return [];
    }
  },
  
  /**
   * Get follow-up reminders as notifications
   */
  async getFollowUpNotifications(userId: string): Promise<Notification[]> {
    try {
      // Get current branch ID for the user
      const { data: userData, error: userError } = await supabase
        .from('profiles')
        .select('branch_id')
        .eq('id', userId)
        .single();
        
      if (userError) throw userError;
      
      const branchId = userData?.branch_id;
      if (!branchId) return [];
      
      // Get scheduled follow-ups
      const allScheduled = await followUpService.getScheduledFollowUps(branchId);
      
      // Filter to today and tomorrow follow-ups assigned to this user
      const relevantFollowUps = allScheduled.filter(followUp => {
        const scheduledDate = parseISO(followUp.scheduled_for || followUp.scheduled_at || '');
        return (isToday(scheduledDate) || isTomorrow(scheduledDate)) && 
               (!followUp.sent_by || followUp.sent_by === userId);
      });
      
      // Convert to notification format
      return relevantFollowUps.map(followUp => {
        const scheduledDate = parseISO(followUp.scheduled_for || followUp.scheduled_at || '');
        const formattedDate = isToday(scheduledDate) 
          ? `Today at ${format(scheduledDate, 'h:mm a')}` 
          : `Tomorrow at ${format(scheduledDate, 'h:mm a')}`;
        
        // Determine the category based on the follow-up type and content
        let category = 'member';
        
        // Check content for staff-related keywords
        const content = (followUp.content || '').toLowerCase();
        if (content.includes('staff') || content.includes('assignment') || content.includes('task')) {
          category = 'staff';
        } 
        // Check content for trainer-related keywords
        else if (content.includes('trainer') || content.includes('session') || content.includes('program')) {
          category = 'trainer';
        }
        
        // Email and meeting follow-ups are often staff-related
        if (followUp.type === 'email' || followUp.type === 'meeting') {
          category = 'staff';
        }
        // Call follow-ups are often member-related
        else if (followUp.type === 'call') {
          category = 'member';
        }
        
        return {
          id: `follow-up-${followUp.id}`,
          user_id: userId,
          title: followUp.subject || `Follow-up: ${followUp.type.toUpperCase()}`,
          message: `${followUp.content || 'Scheduled follow-up'} (${formattedDate})`,
          type: 'follow-up',
          read: false,
          created_at: followUp.scheduled_for || followUp.scheduled_at || new Date().toISOString(),
          link: followUp.lead_id ? `/crm/leads/${followUp.lead_id}` : '/crm/follow-up',
          source: 'follow-up',
          related_id: followUp.id,
          category: category
        };
      });
    } catch (error: any) {
      console.error('Error getting follow-up notifications:', error);
      return [];
    }
  },
  
  async markAsRead(id: string, userId?: string): Promise<boolean> {
    try {
      // Check if this is an announcement notification (they have a special format: announcement-{id})
      if (id.startsWith('announcement-') && userId) {
        const announcementId = id.replace('announcement-', '');
        
        // Create or update an announcement read record
        const { error: announcementError } = await supabase
          .from('announcement_reads')
          .upsert({
            announcement_id: announcementId,
            user_id: userId,
            read_at: new Date().toISOString()
          }, { onConflict: 'announcement_id,user_id' });
          
        if (announcementError) throw announcementError;
      } else {
        // Regular notification
        const { error } = await supabase
          .from('notifications')
          .update({ read: true })
          .eq('id', id);

        if (error) throw error;
      }
      
      return true;
    } catch (error: any) {
      console.error('Error marking notification as read:', error);
      return false;
    }
  },
  
  async clearAll(userId: string): Promise<boolean> {
    try {
      // Delete all notifications for this user
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('user_id', userId);

      if (error) throw error;
      toast.success('All notifications cleared');
      return true;
    } catch (error: any) {
      console.error('Error clearing notifications:', error);
      toast.error('Failed to clear notifications');
      return false;
    }
  },

  async markAllAsRead(userId: string): Promise<boolean> {
    try {
      // First, mark system notifications as read
      const { error: systemError } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('user_id', userId)
        .eq('read', false);

      if (systemError) throw systemError;
      
      // Then, get all unread announcements
      const { data: unreadAnnouncements, error: fetchError } = await supabase
        .from('announcements')
        .select('id');
        
      if (fetchError) throw fetchError;
      
      if (unreadAnnouncements && unreadAnnouncements.length > 0) {
        // Create read records for all announcements
        const readRecords = unreadAnnouncements.map(announcement => ({
          announcement_id: announcement.id,
          user_id: userId,
          read_at: new Date().toISOString()
        }));
        
        // Insert or update announcement read records
        const { error: announcementError } = await supabase
          .from('announcement_reads')
          .upsert(readRecords, { onConflict: 'announcement_id,user_id' });
          
        if (announcementError) throw announcementError;
      }
      
      toast.success('All notifications marked as read');
      return true;
    } catch (error: any) {
      console.error('Error marking all notifications as read:', error);
      toast.error('Failed to mark notifications as read');
      return false;
    }
  },
  
  async createNotification(notification: Partial<Notification>): Promise<Notification | null> {
    try {
      // Determine category if not provided
      let category = notification.category;
      
      if (!category) {
        const type = notification.type || '';
        const title = (notification.title || '').toLowerCase();
        const message = (notification.message || '').toLowerCase();
        
        // Default to gym category
        category = 'gym';
        
        // Check for member-related content
        if (
          type === 'member' || 
          title.includes('member') || 
          message.includes('member') ||
          title.includes('membership') || 
          message.includes('membership')
        ) {
          category = 'member';
        }
        // Check for trainer-related content
        else if (
          type === 'trainer' || 
          title.includes('trainer') || 
          message.includes('trainer') ||
          title.includes('session') ||
          message.includes('session')
        ) {
          category = 'trainer';
        }
        // Check for staff-related content
        else if (
          type === 'staff' || 
          title.includes('staff') || 
          message.includes('staff')
        ) {
          category = 'staff';
        }
      }
      
      // If branch_id is not provided but user_id is, get the user's branch_id
      if (!notification.branch_id && notification.user_id) {
        const { data: userProfile } = await supabase
          .from('profiles')
          .select('branch_id')
          .eq('id', notification.user_id)
          .single();
          
        if (userProfile?.branch_id) {
          notification.branch_id = userProfile.branch_id;
        }
      }
      
      const { data, error } = await supabase
        .from('notifications')
        .insert({
          title: notification.title || 'New Notification',
          message: notification.message || '',
          user_id: notification.user_id,
          type: notification.type || 'system',
          read: false,
          created_at: new Date().toISOString(),
          link: notification.link,
          source: notification.source || 'system',
          related_id: notification.related_id,
          branch_id: notification.branch_id,
          category: category
        })
        .select()
        .single();

      if (error) throw error;
      return data as Notification;
    } catch (error: any) {
      console.error('Error creating notification:', error);
      return null;
    }
  },
  
  /**
   * Clear all notifications for a user
   * Note: This only clears system notifications, not follow-up notifications
   */
  async clearAllNotifications(userId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('user_id', userId);

      if (error) throw error;
      return true;
    } catch (error: any) {
      console.error('Error clearing notifications:', error);
      toast.error('Failed to clear notifications');
      return false;
    }
  }
};

export default notificationService;
