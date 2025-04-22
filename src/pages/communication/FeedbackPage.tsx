
import React, { useState } from 'react';
import { Container } from '@/components/ui/container';
import FeedbackTabs from '@/components/communication/feedback/FeedbackTabs';
import FeedbackHeader from '@/components/communication/feedback/FeedbackHeader';
import BranchInfo from '@/components/communication/feedback/BranchInfo';
import { useFeedback } from '@/hooks/use-feedback';
import { toast } from 'sonner';

const FeedbackPage = () => {
  const { feedbackList, isLoading, error, addFeedback, updateFeedback, deleteFeedback } = useFeedback();
  const [activeTab, setActiveTab] = useState('all');

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  const handleDeleteFeedback = (id: string) => {
    try {
      deleteFeedback(id);
      toast.success('Feedback deleted successfully');
    } catch (error) {
      toast.error('Failed to delete feedback');
    }
  };

  return (
    <Container>
      <div className="py-6 space-y-6">
        <FeedbackHeader />
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="md:col-span-3">
            <FeedbackTabs 
              feedbackList={feedbackList}
              isLoading={isLoading}
              error={error} 
              activeTab={activeTab}
              onTabChange={handleTabChange}
              onDeleteFeedback={handleDeleteFeedback}
            />
          </div>
          
          <div className="md:col-span-1">
            <BranchInfo />
          </div>
        </div>
      </div>
    </Container>
  );
};

export default FeedbackPage;
