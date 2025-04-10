
import { useState } from "react";
import { Container } from "@/components/ui/container";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FeedbackList from "@/components/communication/FeedbackList";
import FeedbackForm from "@/components/communication/FeedbackForm";

const FeedbackPage = () => {
  const [activeTab, setActiveTab] = useState("list");

  return (
    <Container>
      <div className="py-6">
        <h1 className="text-2xl font-bold mb-6">Feedback Management</h1>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="list">Feedback Responses</TabsTrigger>
            <TabsTrigger value="form">Feedback Form</TabsTrigger>
          </TabsList>
          
          <TabsContent value="list" className="space-y-4">
            <FeedbackList />
          </TabsContent>
          
          <TabsContent value="form" className="space-y-4">
            <FeedbackForm 
              onComplete={() => setActiveTab("list")} 
            />
          </TabsContent>
        </Tabs>
      </div>
    </Container>
  );
};

export default FeedbackPage;
