
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
import { usePermissions } from '@/hooks/use-permissions';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Info } from 'lucide-react';

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
  const { currentBranch } = useBranch();
  const { userRole, can } = usePermissions();
  
  // Check if user is a member
  const isMember = userRole === 'member';

  const { data: feedbacks, isLoading, refetch } = useQuery({
    queryKey: ['feedbacks', currentBranch?.id, user?.id],
    queryFn: async () => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For members, only return their own feedback
      if (isMember) {
        return mockFeedbacks.filter(feedback => feedback.memberId === user?.id);
      }
      
      // For staff/admin/trainers, return all feedback
      return mockFeedbacks;
    }
  });

  const addFeedbackMutation = useMutation({
    mutationFn: async (newFeedback: Feedback) => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return { 
        ...newFeedback, 
        id: `feedback${Date.now()}`,
        memberId: user?.id || '',
        branchId: currentBranch?.id,
        memberName: user?.name
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
          <h1 className="text-2xl font-bold">
            {isMember ? "Submit Your Feedback" : "Feedback Management"}
          </h1>
          <Button onClick={() => setIsModalOpen(true)} className="bg-indigo-600 hover:bg-indigo-700">
            <PlusCircle className="h-4 w-4 mr-2" />
            Submit Feedback
          </Button>
        </div>

        {currentBranch && (
          <div className="mb-4 p-3 bg-blue-50 rounded-md text-blue-700">
            <p className="text-sm font-medium">
              {isMember 
                ? "You can provide feedback about classes, trainers, or the gym management"
                : `Viewing feedback for branch: ${currentBranch.name}`
              }
            </p>
          </div>
        )}

        {isMember && (
          <Alert className="mb-4">
            <Info className="h-4 w-4" />
            <AlertTitle>Your Feedback Matters</AlertTitle>
            <AlertDescription>
              You can provide feedback about classes you've attended, trainers you've worked with,
              or general suggestions for improving the gym. Your feedback helps us provide better service.
            </AlertDescription>
          </Alert>
        )}

        <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="all">
              {isMember ? "Your Feedback" : "All Feedback"}
            </TabsTrigger>
            <TabsTrigger value="class">Class</TabsTrigger>
            <TabsTrigger value="trainer">Trainer</TabsTrigger>
            <TabsTrigger value="fitness-plan">Fitness Plan</TabsTrigger>
            <TabsTrigger value="general">General</TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            <FeedbackList
              feedbacks={feedbacks || []}
              isLoading={isLoading}
              isMemberView={isMember}
            />
          </TabsContent>

          {['class', 'trainer', 'fitness-plan', 'general'].map((type) => (
            <TabsContent key={type} value={type}>
              <FeedbackList
                feedbacks={(feedbacks || []).filter(f => f.type === type as FeedbackType)}
                isLoading={isLoading}
                isMemberView={isMember}
              />
            </TabsContent>
          ))}
        </Tabs>

        {isModalOpen && (
          <FeedbackForm
            onComplete={() => {
              setIsModalOpen(false);
            }}
            memberId={user?.id}
            memberName={user?.name}
          />
        )}
      </div>
    </Container>
  );
};

export default FeedbackPage;
