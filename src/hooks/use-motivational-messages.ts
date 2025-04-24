
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { MotivationalMessage } from '@/types/motivation';
import { toast } from 'sonner';

export const useMotivationalMessages = () => {
  const [messages, setMessages] = useState<MotivationalMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchMessages = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('motivational_messages')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      setMessages(data || []);
    } catch (error: any) {
      console.error('Error fetching motivational messages:', error);
      toast.error('Failed to load motivational messages');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const addMessage = async (message: Omit<MotivationalMessage, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      setIsLoading(true);
      // Ensure all required fields are present
      const newMessage = {
        content: message.content,
        title: message.title,
        category: message.category,
        author: message.author || 'Unknown',
        tags: message.tags || [],
        active: message.active !== undefined ? message.active : true
      };

      const { data, error } = await supabase
        .from('motivational_messages')
        .insert([newMessage])
        .select();

      if (error) {
        throw error;
      }

      setMessages(prev => [data[0], ...prev]);
      toast.success('Message added successfully');
      return true;
    } catch (error: any) {
      console.error('Error adding motivational message:', error);
      toast.error('Failed to add message');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const updateMessage = async (id: string, updates: Partial<Omit<MotivationalMessage, 'id' | 'created_at' | 'updated_at'>>) => {
    try {
      setIsLoading(true);
      
      const { error } = await supabase
        .from('motivational_messages')
        .update(updates)
        .eq('id', id);

      if (error) {
        throw error;
      }

      setMessages(prev => prev.map(msg => msg.id === id ? { ...msg, ...updates } : msg));
      toast.success('Message updated successfully');
      return true;
    } catch (error: any) {
      console.error('Error updating motivational message:', error);
      toast.error('Failed to update message');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteMessage = async (id: string) => {
    try {
      setIsLoading(true);
      
      const { error } = await supabase
        .from('motivational_messages')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }

      setMessages(prev => prev.filter(msg => msg.id !== id));
      toast.success('Message deleted successfully');
      return true;
    } catch (error: any) {
      console.error('Error deleting motivational message:', error);
      toast.error('Failed to delete message');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const toggleActive = async (id: string, active: boolean) => {
    return updateMessage(id, { active });
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
