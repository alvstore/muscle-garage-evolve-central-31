
import React, { useState, useEffect } from 'react';
import { Container } from "@/components/ui/container";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { PlusIcon } from "lucide-react";
import { useFeedback } from '@/hooks/use-feedback';
import { useAuth } from '@/hooks/use-auth';
import FeedbackList from '@/components/communication/FeedbackList';
import FeedbackForm from '@/components/communication/FeedbackForm';
import { FeedbackType } from '@/types/notification';

interface FeedbackTabsProps {
  feedbacks: any[];
  isLoading: boolean;
  isMember: boolean;
  memberFeedbackTypes: string[];
  activeTab: string;
  onTabChange: React.Dispatch<React.SetStateAction<string>>;
}

const FeedbackPage = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [showAddForm, setShowAddForm] = useState(false);
  const { feedback, isLoading, fetchFeedback } = useFeedback();
  const { user } = useAuth();
  
  const handleFeedbackSubmitted = () => {
    setShowAddForm(false);
    fetchFeedback();
  };
  
  const isMember = user?.role === 'member';
  
  const memberFeedbackTypes = ['trainer', 'class', 'facility', 'equipment', 'service'];
  
  return (
    <Container>
      <div className="py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Feedback Management</h1>
          {!showAddForm && (
            <Button onClick={() => setShowAddForm(true)}>
              <PlusIcon className="h-4 w-4 mr-2" />
              Add Feedback
            </Button>
          )}
        </div>
        
        {showAddForm ? (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Submit Feedback</CardTitle>
              <CardDescription>
                We value your feedback to improve our services
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FeedbackForm 
                onComplete={handleFeedbackSubmitted} 
                allowedFeedbackTypes={memberFeedbackTypes}
              />
            </CardContent>
          </Card>
        ) : (
          <FeedbackTabs 
            feedbacks={feedback}
            isLoading={isLoading}
            isMember={isMember}
            memberFeedbackTypes={memberFeedbackTypes}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />
        )}
      </div>
    </Container>
  );
};

const FeedbackTabs = ({ 
  feedbacks, 
  isLoading, 
  isMember, 
  memberFeedbackTypes,
  activeTab,
  onTabChange 
}: FeedbackTabsProps) => {
  const [filteredFeedbacks, setFilteredFeedbacks] = useState(feedbacks);
  
  useEffect(() => {
    if (activeTab === "all") {
      setFilteredFeedbacks(feedbacks);
    } else {
      setFilteredFeedbacks(feedbacks.filter(feedback => feedback.type === activeTab));
    }
  }, [activeTab, feedbacks]);
  
  return (
    <Tabs value={activeTab} onValueChange={onTabChange}>
      <TabsList className="mb-8">
        <TabsTrigger value="all">All Feedback</TabsTrigger>
        {memberFeedbackTypes.map(type => (
          <TabsTrigger key={type} value={type}>
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </TabsTrigger>
        ))}
      </TabsList>
      
      <TabsContent value={activeTab}>
        <FeedbackList feedbacks={filteredFeedbacks} isLoading={isLoading} />
      </TabsContent>
    </Tabs>
  );
};

export default FeedbackPage;
