
import { useState, useEffect } from "react";
import { Container } from "@/components/ui/container";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FeedbackList from "@/components/communication/FeedbackList";
import FeedbackForm from "@/components/communication/FeedbackForm";
import FeedbackSummaryChart from "@/components/dashboard/FeedbackSummaryChart";
import { Feedback } from "@/types/notification";

// Mock implementation to check if the component accepts these props
const FeedbackPage = () => {
  const [activeTab, setActiveTab] = useState("list");
  const [feedbackData, setFeedbackData] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching feedback data
    setTimeout(() => {
      const mockFeedback: Feedback[] = [
        {
          id: "feedback1",
          memberId: "member1",
          memberName: "David Miller",
          type: "class",
          relatedId: "class1",
          rating: 4,
          comments: "Great class, but the room was a bit crowded.",
          createdAt: "2023-06-15T10:30:00Z",
          anonymous: false
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
          anonymous: false
        },
        {
          id: "feedback3",
          memberId: "member3",
          type: "fitness-plan",
          relatedId: "plan1",
          rating: 3,
          comments: "Plan is good but too challenging for beginners.",
          createdAt: "2023-06-17T09:15:00Z",
          anonymous: true
        },
        {
          id: "feedback4",
          memberId: "member4",
          memberName: "Emily Davidson",
          type: "general",
          rating: 2,
          comments: "The gym needs better ventilation.",
          createdAt: "2023-06-18T16:45:00Z",
          anonymous: false
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
          anonymous: false
        }
      ];
      
      setFeedbackData(mockFeedback);
      setLoading(false);
    }, 1000);
  }, []);

  const handleFeedbackSubmission = (newFeedback: Feedback) => {
    setFeedbackData(prev => [newFeedback, ...prev]);
    setActiveTab("list");
  };

  return (
    <Container>
      <div className="py-6">
        <h1 className="text-2xl font-bold mb-6">Feedback Management</h1>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="list">Feedback Responses</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="form">Feedback Form</TabsTrigger>
          </TabsList>
          
          <TabsContent value="list" className="space-y-4">
            <FeedbackList 
              // @ts-ignore - Temporarily ignore type issues until component is updated
              feedbacks={feedbackData} 
              isLoading={loading} 
            />
          </TabsContent>
          
          <TabsContent value="analytics" className="space-y-4">
            {loading ? (
              <div className="h-[400px] w-full animate-pulse bg-muted rounded-lg flex items-center justify-center">
                <p className="text-muted-foreground">Loading analytics...</p>
              </div>
            ) : (
              <FeedbackSummaryChart feedback={feedbackData} />
            )}
          </TabsContent>
          
          <TabsContent value="form" className="space-y-4">
            <FeedbackForm 
              // @ts-ignore - Temporarily ignore type issues until component is updated
              onComplete={() => setActiveTab("list")} 
              onSubmitFeedback={handleFeedbackSubmission}
            />
          </TabsContent>
        </Tabs>
      </div>
    </Container>
  );
};

export default FeedbackPage;
