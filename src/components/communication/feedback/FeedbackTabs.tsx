
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Feedback, FeedbackType } from '@/types/notification';
import FeedbackList from '@/components/communication/FeedbackList';

interface FeedbackTabsProps {
  activeTab: string;
  onTabChange: (value: string) => void;
  feedbacks: Feedback[];
  isLoading: boolean;
  isMember: boolean;
  memberFeedbackTypes: string[];
}

const FeedbackTabs = ({ 
  activeTab, 
  onTabChange, 
  feedbacks, 
  isLoading, 
  isMember,
  memberFeedbackTypes 
}: FeedbackTabsProps) => {
  return (
    <Tabs defaultValue={activeTab} onValueChange={onTabChange}>
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
          feedbacks={feedbacks}
          isLoading={isLoading}
        />
      </TabsContent>

      {(isMember ? memberFeedbackTypes : ['general', 'trainer', 'class', 'fitness-plan']).map((type) => (
        <TabsContent key={type} value={type}>
          <FeedbackList
            feedbacks={feedbacks.filter(f => f.type === type as FeedbackType)}
            isLoading={isLoading}
          />
        </TabsContent>
      ))}
    </Tabs>
  );
};

export default FeedbackTabs;
