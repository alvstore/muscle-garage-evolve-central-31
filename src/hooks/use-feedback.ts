
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/services/supabaseClient';
import { Feedback, adaptFeedbackFromDB } from '@/types/notification';
import { toast } from 'sonner';
import { useBranch } from './use-branch';

export const useFeedback = () => {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { currentBranch } = useBranch();

  const fetchFeedbacks = useCallback(async () => {
    try {
      setIsLoading(true);
      
      let query = supabase
        .from('feedback')
        .select('*')
        .order('created_at', { ascending: false });
      
      // Filter by branch if a branch is selected
      if (currentBranch?.id) {
        query = query.eq('branch_id', currentBranch.id);
      }
      
      const { data, error } = await query;
      
      if (error) {
        throw error;
      }
      
      if (data) {
        const adaptedFeedbacks = data.map(feedback => adaptFeedbackFromDB(feedback));
        setFeedbacks(adaptedFeedbacks);
      }
    } catch (error) {
      console.error('Error fetching feedback:', error);
      toast.error('Failed to load feedback');
    } finally {
      setIsLoading(false);
    }
  }, [currentBranch?.id]);

  const submitFeedback = async (feedbackData: Partial<Feedback>): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('feedback')
        .insert({
          title: feedbackData.title,
          comments: feedbackData.content,
          rating: feedbackData.rating,
          type: feedbackData.type,
          member_id: feedbackData.memberId,
          member_name: feedbackData.memberName,
          anonymous: feedbackData.anonymous,
          branch_id: feedbackData.branchId,
          related_id: feedbackData.relatedId
        });
      
      if (error) {
        throw error;
      }
      
      await fetchFeedbacks();
      return true;
    } catch (error) {
      console.error('Error submitting feedback:', error);
      toast.error('Failed to submit feedback');
      return false;
    }
  };

  const markAsRead = async (id: string): Promise<boolean> => {
    try {
      // This is a placeholder - you might want to implement this according to your requirements
      // e.g., by adding a 'read' column to your feedback table
      return true;
    } catch (error) {
      console.error('Error marking feedback as read:', error);
      return false;
    }
  };

  useEffect(() => {
    fetchFeedbacks();
  }, [fetchFeedbacks]);

  return {
    feedbacks,
    isLoading,
    fetchFeedbacks,
    submitFeedback,
    markAsRead
  };
};
