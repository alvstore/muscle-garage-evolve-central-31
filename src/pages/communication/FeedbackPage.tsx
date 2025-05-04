
import React, { useState, useEffect } from 'react';
import { Container } from "@/components/ui/container";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import FeedbackTabs from "@/components/communication/feedback/FeedbackTabs";
import FeedbackForm from "@/components/communication/FeedbackForm";
import { useFeedback } from "@/hooks/use-feedback";
import { useAuth } from "@/hooks/use-auth";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Feedback, FeedbackType } from '@/types/notification';

const FeedbackPage = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [openFeedbackForm, setOpenFeedbackForm] = useState(false);
  const { feedbacks, isLoading, fetchFeedback } = useFeedback();
  const { user } = useAuth();
  
  const isMember = user?.role === 'member';
  const allowedFeedbackTypes = isMember 
    ? ['general', 'trainer', 'class', 'facility', 'equipment'] 
    : ['general', 'trainer', 'class', 'facility', 'service', 'equipment'];

  useEffect(() => {
    fetchFeedback();
  }, [fetchFeedback]);

  const handleCompleted = () => {
    setOpenFeedbackForm(false);
    fetchFeedback();
  };

  return (
    <Container>
      <div className="py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Feedback</h1>
            <p className="text-muted-foreground">
              View and manage member feedback
            </p>
          </div>
          <Button 
            onClick={() => setOpenFeedbackForm(true)}
            className="ml-auto"
          >
            <PlusIcon className="mr-2 h-4 w-4" />
            Add Feedback
          </Button>
        </div>

        <Tabs defaultValue="feedback-list">
          <TabsList>
            <TabsTrigger value="feedback-list">Feedback List</TabsTrigger>
            <TabsTrigger value="feedback-summary">Feedback Summary</TabsTrigger>
          </TabsList>
          
          <TabsContent value="feedback-list" className="space-y-4 mt-6">
            <div className="space-y-4">
              <FeedbackTabs showTabs />
            </div>
          </TabsContent>
          
          <TabsContent value="feedback-summary" className="mt-6">
            <div className="space-y-4">
              {/* Feedback summary content */}
              <div className="text-center py-10 text-muted-foreground">
                Feedback analytics and summary coming soon...
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
      <Dialog open={openFeedbackForm} onOpenChange={setOpenFeedbackForm}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Submit Feedback</DialogTitle>
          </DialogHeader>
          <FeedbackForm 
            onSubmitSuccess={handleCompleted}
          />
        </DialogContent>
      </Dialog>
    </Container>
  );
};

export default FeedbackPage;
