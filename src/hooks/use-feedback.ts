
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Feedback, FeedbackType } from '@/types/notification';
import { toast } from 'sonner';
import { adaptFeedbackFromDB } from '@/services/communicationService';
import { useBranch } from './use-branch';

export const useFeedback = () => {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { currentBranch } = useBranch();
  
  useEffect(() => {
    fetchFeedback();
  }, [currentBranch?.id]);
  
  const fetchFeedback = async (type?: FeedbackType) => {
    setIsLoading(true);
    setError(null);
    try {
      let query = supabase
        .from('feedback')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (currentBranch?.id) {
        query = query.eq('branch_id', currentBranch.id);
      }
      
      if (type) {
        query = query.eq('type', type);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      setFeedbacks(data.map(adaptFeedbackFromDB));
    } catch (err) {
      const error = err instanceof Error ? err : new Error('An unknown error occurred');
      setError(error);
      toast.error(`Failed to fetch feedback: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };
  
  const submitFeedback = async (feedback: Partial<Feedback>) => {
    setIsLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('feedback')
        .insert({
          title: feedback.title,
          comments: feedback.comments,
          rating: feedback.rating,
          member_id: feedback.member_id,
          member_name: feedback.member_name,
          type: feedback.type,
          branch_id: feedback.branch_id,
          related_id: feedback.related_id,
          anonymous: feedback.anonymous
        })
        .select()
        .single();
      
      if (error) throw error;
      
      const newFeedback = adaptFeedbackFromDB(data);
      setFeedbacks(prev => [newFeedback, ...prev]);
      toast.success('Feedback submitted successfully!');
      return newFeedback;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('An unknown error occurred');
      setError(error);
      toast.error(`Failed to submit feedback: ${error.message}`);
      return null;
    } finally {
      setIsLoading(false);
    }
  };
  
  return {
    feedbacks,
    isLoading,
    error,
    fetchFeedback,
    submitFeedback
  };
};
