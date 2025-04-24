
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/services/supabaseClient';
import { Feedback } from '@/types/notification';
import { toast } from 'sonner';

export const useFeedback = (branchId?: string, memberId?: string) => {
  const queryClient = useQueryClient();

  const { data: feedback, isLoading } = useQuery({
    queryKey: ['feedback', branchId, memberId],
    queryFn: async () => {
      let query = supabase
        .from('feedback')
        .select('*')
        .order('created_at', { ascending: false });

      if (branchId) {
        query = query.eq('branch_id', branchId);
      }

      if (memberId) {
        query = query.eq('member_id', memberId);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching feedback:', error);
        throw error;
      }

      return data as Feedback[];
    }
  });

  const createFeedback = useMutation({
    mutationFn: async (newFeedback: Omit<Feedback, 'id' | 'created_at'>) => {
      const { data, error } = await supabase
        .from('feedback')
        .insert([newFeedback])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feedback'] });
      toast.success('Feedback submitted successfully');
    },
    onError: (error) => {
      console.error('Error submitting feedback:', error);
      toast.error('Failed to submit feedback');
    }
  });

  return {
    feedback,
    isLoading,
    createFeedback
  };
};
