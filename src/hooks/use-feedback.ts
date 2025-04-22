import { useState, useEffect } from 'react';
import { Feedback, FeedbackType } from '@/types/notification';

const mockFeedback: Feedback[] = [
  {
    id: '1',
    title: 'Great trainer experience',
    content: 'I had an excellent session with the trainer. Very knowledgeable!',
    type: 'trainer',
    memberId: 'user123',
    memberName: 'John Doe',
    createdAt: '2023-04-15T10:30:00.000Z',
    status: 'resolved',
    rating: 5,
    comments: 'Thank you for your feedback!',
    relatedId: 'trainer456'
  },
  {
    id: '2',
    title: 'Need more evening classes',
    content: 'Would love to see more yoga classes in the evening after work hours.',
    type: 'suggestion',
    memberId: 'user456',
    memberName: 'Jane Smith',
    createdAt: '2023-04-14T15:45:00.000Z',
    status: 'pending',
    relatedId: null
  },
  {
    id: '3',
    title: 'Equipment issue',
    content: 'The treadmill #3 has been making strange noises when used at high speeds.',
    type: 'complaint',
    memberId: 'user789',
    memberName: 'Robert Johnson',
    createdAt: '2023-04-13T09:15:00.000Z',
    status: 'in-progress',
    comments: 'Maintenance team notified, will check tomorrow.',
    relatedId: 'equipment123'
  },
  {
    id: '4',
    title: 'General feedback about gym',
    content: 'Overall very satisfied with the facilities and staff.',
    type: 'general',
    memberId: 'user321',
    memberName: 'Sarah Williams',
    createdAt: '2023-04-12T11:30:00.000Z',
    status: 'resolved',
    rating: 5,
    comments: 'Thank you for your feedback!'
  },
  {
    id: '5',
    title: 'Diet plan suggestions',
    content: 'The high protein diet plan works well, but I think we could adjust the carbs intake for post-workout days.',
    type: 'diet-plan',
    memberId: 'user654',
    memberName: 'Michael Brown',
    createdAt: '2023-04-11T14:20:00.000Z',
    status: 'pending',
    relatedId: 'diet789'
  }
];

interface UseFeedbackProps {
  type?: FeedbackType;
  memberId?: string;
}

const useFeedback = ({ type, memberId }: UseFeedbackProps = {}) => {
  const [feedbackList, setFeedbackList] = useState<Feedback[]>(mockFeedback);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setIsLoading(true);
    setError(null);

    // Simulate fetching data from an API
    setTimeout(() => {
      try {
        let filteredFeedback = [...mockFeedback];

        if (type) {
          filteredFeedback = filteredFeedback.filter(feedback => feedback.type === type);
        }

        if (memberId) {
          filteredFeedback = filteredFeedback.filter(feedback => feedback.memberId === memberId);
        }

        setFeedbackList(filteredFeedback);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setIsLoading(false);
      }
    }, 500);
  }, [type, memberId]);

  const addFeedback = (newFeedback: Feedback) => {
    setFeedbackList(prevFeedback => [...prevFeedback, newFeedback]);
  };

  const updateFeedback = (id: string, updatedFeedback: Partial<Feedback>) => {
    setFeedbackList(prevFeedback =>
      prevFeedback.map(feedback =>
        feedback.id === id ? { ...feedback, ...updatedFeedback } : feedback
      )
    );
  };

  const deleteFeedback = (id: string) => {
    setFeedbackList(prevFeedback => prevFeedback.filter(feedback => feedback.id !== id));
  };

  return {
    feedbackList,
    isLoading,
    error,
    addFeedback,
    updateFeedback,
    deleteFeedback,
  };
};

export default useFeedback;
