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
import { useBranch } from '@/hooks/use-branch';
import { useMemberSpecificData } from '@/hooks/use-member-specific-data';

// Using the imported Feedback type from notification.ts
type FeedbackWithMember = Feedback;

const mockFeedbacks: FeedbackWithMember[] = [
  {
    id: "feedback1",
    memberId: "member1",
    memberName: "David Miller",
    type: "class" as FeedbackType,
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
    type: "trainer" as FeedbackType,
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
    type: "fitness-plan" as FeedbackType,
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
    type: "general" as FeedbackType,
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
    type: "class" as FeedbackType,
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
  const { currentBranch } = useBranch();
  const isMember = user?.role === 'member';

  const { data: feedbacks, isLoading, refetch } = useQuery({
    queryKey: ['feedbacks', currentBranch?.id, user?.id],
    queryFn: async () => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app, you would filter by branch ID and member ID if user is a member
      return mockFeedbacks;
    }
  });
  
  // Filter feedback types based on user role
  const memberFeedbackTypes = ['general', 'trainer', 'class'];
  
  // Use the hook to filter data based on user role
  const { data: filteredFeedbacks } = useMemberSpecificData<FeedbackWithMember[], FeedbackWithMember[]>(
    feedbacks || [],
    (item) => {
      // For direct filtering of feedback items with matching memberId
      if (user && user.id) {
        return (item as Feedback).memberId === user.id;
      }
      return false;
    }
  );

  const addFeedbackMutation = useMutation({
    mutationFn: async (newFeedback: Feedback) => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return { 
        ...newFeedback, 
        id: `feedback${Date.now()}`,
        branchId: currentBranch?.id,
        memberId: user?.id
      };
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

        {currentBranch && (
          <div className="mb-4 p-3 bg-blue-50 rounded-md text-blue-700">
            <p className="text-sm font-medium">
              Viewing feedback for branch: {currentBranch.name}
            </p>
          </div>
        )}

        <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="all">All Feedback</TabsTrigger>
            <TabsTrigger value="general">Gym</TabsTrigger>
            <TabsTrigger value="trainer">Trainer</TabsTrigger>
            {!isMember && (
              <>
                <TabsTrigger value="class">Class</TabsTrigger>
                <TabsTrigger value="fitness-plan">Fitness Plan</TabsTrigger>
              </>
            )}
          </TabsList>

          <TabsContent value="all">
            <FeedbackList
              feedbacks={filteredFeedbacks || []}
              isLoading={isLoading}
            />
          </TabsContent>

          {(isMember ? memberFeedbackTypes : ['general', 'trainer', 'class', 'fitness-plan']).map((type) => (
            <TabsContent key={type} value={type}>
              <FeedbackList
                feedbacks={(filteredFeedbacks || []).filter(f => f.type === type as FeedbackType)}
                isLoading={isLoading}
              />
            </TabsContent>
          ))}
        </Tabs>

        {isModalOpen && (
          <FeedbackForm
            onComplete={() => {
              setIsModalOpen(false);
            }}
            allowedFeedbackTypes={isMember ? memberFeedbackTypes as FeedbackType[] : undefined}
          />
        )}
      </div>
    </Container>
  );
};

export default FeedbackPage;
