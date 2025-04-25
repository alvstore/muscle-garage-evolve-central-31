
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Feedback, adaptFeedbackFromDB } from '@/types/notification';
import { useBranch } from './use-branch';
import { toast } from 'sonner';

export const useFeedback = () => {
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { currentBranch } = useBranch();

  const fetchFeedback = useCallback(async () => {
    setIsLoading(true);
    try {
      let query = supabase.from('feedback').select('*');
      
      if (currentBranch?.id) {
        query = query.eq('branch_id', currentBranch.id);
      }
      
      const { data, error } = await query;
      
      if (error) {
        throw error;
      }

      if (data) {
        // Transform the data to correctly match the Feedback type
        const transformedFeedback = data.map(item => adaptFeedbackFromDB(item));
        setFeedback(transformedFeedback);
      }
    } catch (error: any) {
      console.error('Error fetching feedback:', error);
      toast.error('Failed to load feedback');
    } finally {
      setIsLoading(false);
    }
  }, [currentBranch?.id]);

  const submitFeedback = async (feedbackData: Partial<Feedback>): Promise<boolean> => {
    try {
      // Convert from camelCase to snake_case for database insertion
      const dbFeedbackData = {
        title: feedbackData.title,
        type: feedbackData.type,
        rating: feedbackData.rating,
        comments: feedbackData.comments,
        member_id: feedbackData.memberId || feedbackData.member_id,
        member_name: feedbackData.memberName || feedbackData.member_name,
        branch_id: feedbackData.branchId || feedbackData.branch_id || currentBranch?.id,
        related_id: feedbackData.relatedId || feedbackData.related_id,
        anonymous: feedbackData.anonymous || false,
        created_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('feedback')
        .insert(dbFeedbackData)
        .select()
        .single();
      
      if (error) {
        throw error;
      }
      
      const newFeedback = adaptFeedbackFromDB(data);
      setFeedback(prev => [newFeedback, ...prev]);
      
      toast.success('Feedback submitted successfully');
      return true;
    } catch (error: any) {
      console.error('Error submitting feedback:', error);
      toast.error('Failed to submit feedback');
      return false;
    }
  };

  const deleteFeedback = async (id: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('feedback')
        .delete()
        .eq('id', id);
      
      if (error) {
        throw error;
      }
      
      setFeedback(prev => prev.filter(item => item.id !== id));
      toast.success('Feedback deleted successfully');
      return true;
    } catch (error: any) {
      console.error('Error deleting feedback:', error);
      toast.error('Failed to delete feedback');
      return false;
    }
  };

  useEffect(() => {
    fetchFeedback();
  }, [fetchFeedback]);

  return {
    feedback,
    isLoading,
    fetchFeedback,
    submitFeedback,
    deleteFeedback
  };
};
