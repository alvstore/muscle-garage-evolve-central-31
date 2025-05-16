
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Feedback, FeedbackType } from '@/types/notification';
import { adaptFeedbackFromDB } from '@/types/notification';
import { communicationService } from '@/services';
import { useBranch } from './use-branches';

export const useFeedback = (type?: FeedbackType) => {
  const { currentBranch } = useBranch();
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);

  const fetchFeedback = async (specificType?: FeedbackType) => {
    try {
      if (!currentBranch?.id) return [];
      
      const response = await communicationService.getFeedback(currentBranch.id);
      return response.map((item: any) => adaptFeedbackFromDB(item));
    } catch (error) {
      console.error('Error fetching feedback:', error);
      return [];
    }
  };

  const { data, isLoading, refetch, error } = useQuery({
    queryKey: ['feedback', currentBranch?.id, type],
    queryFn: () => fetchFeedback(type),
    enabled: !!currentBranch?.id,
  });

  useEffect(() => {
    if (data) {
      if (type) {
        setFeedbacks(data.filter(item => item.type === type));
      } else {
        setFeedbacks(data);
      }
    }
  }, [data, type]);

  const submitFeedback = async (feedback: Partial<Feedback>): Promise<boolean> => {
    try {
      if (!currentBranch?.id) return false;
      
      const result = await communicationService.submitFeedback({
        ...feedback,
        branch_id: currentBranch.id
      } as Feedback);
      
      if (result) {
        refetch();
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error submitting feedback:', error);
      return false;
    }
  };

  return {
    feedbacks,
    isLoading,
    submitFeedback,
    refreshFeedback: refetch,
    fetchFeedback,
    error
  };
};
