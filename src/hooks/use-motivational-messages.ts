
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/services/supabaseClient';
import { MotivationalMessage } from '@/types/notification';
import { toast } from 'sonner';

export const useMotivationalMessages = () => {
  const queryClient = useQueryClient();

  const { data: messages, isLoading } = useQuery({
    queryKey: ['motivational-messages'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('motivational_messages')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching motivational messages:', error);
        throw error;
      }

      return data as MotivationalMessage[];
    }
  });

  const createMessage = useMutation({
    mutationFn: async (newMessage: Omit<MotivationalMessage, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('motivational_messages')
        .insert([newMessage])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['motivational-messages'] });
      toast.success('Message created successfully');
    },
    onError: (error) => {
      console.error('Error creating message:', error);
      toast.error('Failed to create message');
    }
  });

  const updateMessage = useMutation({
    mutationFn: async (message: Partial<MotivationalMessage> & { id: string }) => {
      const { data, error } = await supabase
        .from('motivational_messages')
        .update(message)
        .eq('id', message.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['motivational-messages'] });
      toast.success('Message updated successfully');
    },
    onError: (error) => {
      console.error('Error updating message:', error);
      toast.error('Failed to update message');
    }
  });

  const deleteMessage = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('motivational_messages')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['motivational-messages'] });
      toast.success('Message deleted successfully');
    },
    onError: (error) => {
      console.error('Error deleting message:', error);
      toast.error('Failed to delete message');
    }
  });

  return {
    messages,
    isLoading,
    createMessage,
    updateMessage,
    deleteMessage
  };
};
