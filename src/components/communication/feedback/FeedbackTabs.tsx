
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import FeedbackList from '../FeedbackList';
import { FeedbackType } from '@/types/notification';

interface FeedbackTabsProps {
  showTabs?: boolean;
}

const FeedbackTabs = ({ showTabs = true }: FeedbackTabsProps) => {
  const [activeTab, setActiveTab] = useState<FeedbackType | 'all'>('all');

  return (
    <div className="space-y-4">
      {showTabs && (
        <Tabs defaultValue="all" value={activeTab} onValueChange={(value) => setActiveTab(value as FeedbackType | 'all')}>
          <TabsList>
            <TabsTrigger value="all">All Feedback</TabsTrigger>
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="trainer">Trainers</TabsTrigger>
            <TabsTrigger value="class">Classes</TabsTrigger>
            <TabsTrigger value="fitness-plan">Fitness Plans</TabsTrigger>
          </TabsList>
        </Tabs>
      )}

      <FeedbackList hideHeader={showTabs} />
    </div>
  );
};

export default FeedbackTabs;
