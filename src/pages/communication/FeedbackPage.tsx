
import React, { useState } from 'react';
import { Container } from '@/components/ui/container';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { PlusCircle } from 'lucide-react';
import { Feedback, FeedbackType } from '@/types/notification';
import FeedbackList from '@/components/communication/FeedbackList';
import FeedbackForm from '@/components/communication/FeedbackForm';
import { useAuth } from '@/hooks/use-auth';

// Define the props that match what FeedbackList requires
interface CustomFeedbackListProps {
  feedbacks: Feedback[];
  isLoading: boolean;
}

// Define the props that match what FeedbackForm requires
interface CustomFeedbackFormProps {
  onComplete: () => void;
  onSubmitFeedback: (newFeedback: Feedback) => void;
}

const mockFeedbacks: Feedback[] = [
  {
    id: "feedback1",
    memberId: "member1",
    memberName: "David Miller",
    type: "class",
    relatedId: "class1",
    rating: 4,
    comments: "Great class, but the room was a bit crowded.",
    createdAt: "2023-06-15T10:30:00Z",
    anonymous: false,
    title: "HIIT Class Review"
  },
  {
    id: "feedback2",
    memberId: "member2",
    memberName: "Sarah Parker",
    type: "trainer",
    relatedId: "trainer1",
    rating: 5,
    comments: "Excellent trainer, very motivating!",
    createdAt: "2023-06-16T14:20:00Z",
    anonymous: false,
    title: "Trainer Review"
  },
  {
    id: "feedback3",
    memberId: "member3",
    type: "fitness-plan",
    relatedId: "plan1",
    rating: 3,
    comments: "Plan is good but too challenging for beginners.",
    createdAt: "2023-06-17T09:15:00Z",
    anonymous: true,
    title: "Fitness Plan Feedback"
  },
  {
    id: "feedback4",
    memberId: "member4",
    memberName: "Emily Davidson",
    type: "general",
    rating: 2,
    comments: "The gym needs better ventilation.",
    createdAt: "2023-06-18T16:45:00Z",
    anonymous: false,
    title: "Facility Feedback"
  },
  {
    id: "feedback5",
    memberId: "member5",
    memberName: "Michael Wong",
    type: "class",
    relatedId: "class2",
    rating: 5,
    comments: "Best HIIT class I've ever taken!",
    createdAt: "2023-06-19T11:30:00Z",
    anonymous: false,
    title: "Yoga Class Review"
  }
];

const FeedbackPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const { toast } = useToast();
  const { user } = useAuth();

  const { data: feedbacks, isLoading, refetch } = useQuery({
    queryKey: ['feedbacks'],
    queryFn: async () => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      return mockFeedbacks;
    }
  });

  const addFeedbackMutation = useMutation({
    mutationFn: async (newFeedback: Feedback) => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      return { ...newFeedback, id: `feedback${Date.now()}` };
    },
    onSuccess: () => {
      toast({
        title: "Feedback submitted",
        description: "Your feedback has been submitted successfully."
      });
      refetch();
      setIsModalOpen(false);
    },
    onError: (error) => {
      toast({
        title: "Error submitting feedback",
        description: "There was an error submitting your feedback. Please try again.",
        variant: "destructive"
      });
    }
  });

  const handleSubmitFeedback = (newFeedback: Feedback) => {
    addFeedbackMutation.mutate(newFeedback);
  };

  // Custom components that match what FeedbackList and FeedbackForm expect
  const CustomFeedbackList: React.FC<CustomFeedbackListProps> = ({ feedbacks, isLoading }) => (
    <FeedbackList feedbacks={feedbacks} isLoading={isLoading} />
  );

  const CustomFeedbackForm: React.FC<CustomFeedbackFormProps> = ({ onComplete, onSubmitFeedback }) => (
    <FeedbackForm onComplete={onComplete} onSubmitFeedback={onSubmitFeedback} />
  );

  return (
    <Container>
      <div className="py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Feedback Management</h1>
          <Button onClick={() => setIsModalOpen(true)} className="bg-indigo-600 hover:bg-indigo-700">
            <PlusCircle className="h-4 w-4 mr-2" />
            Submit Feedback
          </Button>
        </div>

        <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="all">All Feedback</TabsTrigger>
            <TabsTrigger value="class">Class</TabsTrigger>
            <TabsTrigger value="trainer">Trainer</TabsTrigger>
            <TabsTrigger value="fitness-plan">Fitness Plan</TabsTrigger>
            <TabsTrigger value="general">General</TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            <CustomFeedbackList
              feedbacks={feedbacks || []}
              isLoading={isLoading}
            />
          </TabsContent>

          {['class', 'trainer', 'fitness-plan', 'general'].map((type) => (
            <TabsContent key={type} value={type}>
              <CustomFeedbackList
                feedbacks={(feedbacks || []).filter(f => f.type === type as FeedbackType)}
                isLoading={isLoading}
              />
            </TabsContent>
          ))}
        </Tabs>

        {isModalOpen && (
          <CustomFeedbackForm
            onComplete={() => setIsModalOpen(false)}
            onSubmitFeedback={handleSubmitFeedback}
          />
        )}
      </div>
    </Container>
  );
};

export default FeedbackPage;
