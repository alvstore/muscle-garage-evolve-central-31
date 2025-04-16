
import React, { useState } from 'react';
import { Container } from '@/components/ui/container';
import { useToast } from '@/hooks/use-toast';
import { useMutation } from '@tanstack/react-query';
import { Feedback } from '@/types/notification';
import { useAuth } from '@/hooks/use-auth';
import { useBranch } from '@/hooks/use-branch';
import { useMemberSpecificData } from '@/hooks/use-member-specific-data';
import FeedbackForm from '@/components/communication/FeedbackForm';
import FeedbackHeader from '@/components/communication/feedback/FeedbackHeader';
import BranchInfo from '@/components/communication/feedback/BranchInfo';
import FeedbackTabs from '@/components/communication/feedback/FeedbackTabs';
import { useFeedback } from '@/hooks/use-feedback';

const FeedbackPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const { toast } = useToast();
  const { user } = useAuth();
  const { currentBranch } = useBranch();
  const isMember = user?.role === 'member';

  const { data: feedbacks, isLoading, refetch } = useFeedback(currentBranch?.id, user?.id);

  // Filter feedback types based on user role
  const memberFeedbackTypes = ['general', 'trainer', 'class'];
  
  // Fixed: Corrected the return type and filter function to match the hook's expectation
  const { data: filteredFeedbacks } = useMemberSpecificData<Feedback[], Feedback[]>(
    feedbacks || [],
    (feedbackArray: Feedback[], userId: string): Feedback[] => {
      // When a member is logged in, only return their feedbacks
      if (userId) {
        return feedbackArray.filter(item => item.memberId === userId);
      }
      // For non-members, return all feedbacks
      return feedbackArray;
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
    onError: () => {
      toast({
        title: "Error submitting feedback",
        description: "There was an error submitting your feedback. Please try again.",
        variant: "destructive"
      });
    }
  });

  return (
    <Container>
      <div className="py-6">
        <FeedbackHeader onNewFeedback={() => setIsModalOpen(true)} />
        <BranchInfo branch={currentBranch} />

        <FeedbackTabs
          activeTab={activeTab}
          onTabChange={setActiveTab}
          feedbacks={filteredFeedbacks as Feedback[]}
          isLoading={isLoading}
          isMember={isMember}
          memberFeedbackTypes={memberFeedbackTypes}
        />

        {isModalOpen && (
          <FeedbackForm
            onComplete={() => {
              setIsModalOpen(false);
            }}
            allowedFeedbackTypes={isMember ? memberFeedbackTypes as any[] : undefined}
          />
        )}
      </div>
    </Container>
  );
};

export default FeedbackPage;
