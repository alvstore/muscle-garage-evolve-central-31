
import { supabase } from '@/services/supabaseClient';
import { toast } from 'sonner';

export interface Notification {
  id: string;
  title: string;
  message: string;
  user_id: string;
  read: boolean;
  created_at: string;
  type: string;
}

export const notificationService = {
  async getNotifications(userId: string): Promise<Notification[]> {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Notification[];
    } catch (error: any) {
      console.error('Error fetching notifications:', error);
      toast.error('Failed to load notifications');
      return [];
    }
  },
  
  async markAsRead(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (error: any) {
      console.error('Error marking notification as read:', error);
      return false;
    }
  },
  
  async markAllAsRead(userId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('user_id', userId)
        .eq('read', false);

      if (error) throw error;
      toast.success('All notifications marked as read');
      return true;
    } catch (error: any) {
      console.error('Error marking all notifications as read:', error);
      toast.error('Failed to mark notifications as read');
      return false;
    }
  },
  
  async createNotification(notification: Omit<Notification, 'id' | 'created_at'>): Promise<Notification | null> {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .insert([notification])
        .select()
        .single();

      if (error) throw error;
      return data as Notification;
    } catch (error: any) {
      console.error('Error creating notification:', error);
      return null;
    }
  }
};

export default notificationService;
