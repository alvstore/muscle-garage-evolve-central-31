
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/services/supabaseClient';
import { MotivationalMessage, MotivationalCategory, adaptMotivationalMessageFromDB } from '@/types/notification';
import { toast } from 'sonner';

export const useMotivationalMessages = () => {
  const [messages, setMessages] = useState<MotivationalMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchMessages = useCallback(async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('motivational_messages')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      const adaptedMessages = data.map(msg => adaptMotivationalMessageFromDB(msg));
      
      setMessages(adaptedMessages);
    } catch (error) {
      console.error('Error fetching motivational messages:', error);
      toast.error('Failed to load motivational messages');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const addMessage = async (message: Omit<MotivationalMessage, 'id' | 'created_at' | 'updated_at' | 'is_active' | 'message'>) => {
    try {
      const { error } = await supabase
        .from('motivational_messages')
        .insert({
          title: message.title,
          content: message.content,
          category: message.category,
          tags: message.tags || [],
          author: message.author || 'Unknown',
          active: message.active
        });
      
      if (error) throw error;
      
      toast.success('Message created successfully');
      await fetchMessages();
      return true;
    } catch (error) {
      console.error('Error adding motivational message:', error);
      toast.error('Failed to create message');
      return false;
    }
  };

  const updateMessage = async (id: string, updates: Partial<Omit<MotivationalMessage, 'id' | 'created_at' | 'updated_at'>>) => {
    try {
      const { error } = await supabase
        .from('motivational_messages')
        .update({
          title: updates.title,
          content: updates.content,
          category: updates.category,
          tags: updates.tags,
          author: updates.author,
          active: updates.active
        })
        .eq('id', id);
      
      if (error) throw error;
      
      toast.success('Message updated successfully');
      await fetchMessages();
      return true;
    } catch (error) {
      console.error('Error updating motivational message:', error);
      toast.error('Failed to update message');
      return false;
    }
  };

  const deleteMessage = async (id: string) => {
    try {
      const { error } = await supabase
        .from('motivational_messages')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      toast.success('Message deleted successfully');
      await fetchMessages();
      return true;
    } catch (error) {
      console.error('Error deleting motivational message:', error);
      toast.error('Failed to delete message');
      return false;
    }
  };

  const toggleActive = async (id: string, isActive: boolean) => {
    return await updateMessage(id, { active: isActive });
  };

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  return {
    messages,
    isLoading,
    fetchMessages,
    addMessage,
    updateMessage,
    deleteMessage,
    toggleActive
  };
};
