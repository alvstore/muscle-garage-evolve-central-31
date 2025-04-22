import { useState } from "react";
import { Container } from "@/components/ui/container";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MotivationalMessagesList from "@/components/communication/MotivationalMessagesList";
import MotivationalMessageForm from "@/components/communication/MotivationalMessageForm";
import { MotivationalMessage } from "@/types/notification";

interface MotivationalMessageFormProps {
  message?: MotivationalMessage;
  onComplete: () => void;
}

const MotivationalPage = () => {
  const [activeTab, setActiveTab] = useState("list");
  const [editMessage, setEditMessage] = useState<MotivationalMessage | null>(null);

  const handleEdit = (message: MotivationalMessage) => {
    setEditMessage(message);
    setActiveTab("create");
  };

  return (
    <Container>
      <div className="py-6">
        <h1 className="text-2xl font-bold mb-6">Motivational Messages</h1>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="list">All Messages</TabsTrigger>
            <TabsTrigger value="create">Create Message</TabsTrigger>
          </TabsList>
          
          <TabsContent value="list" className="space-y-4">
            <MotivationalMessagesList onEdit={handleEdit} />
          </TabsContent>
          
          <TabsContent value="create" className="space-y-4">
            <MotivationalMessageForm 
              open={activeTab === "create"}
              setOpen={(open) => setActiveTab(open ? "create" : "list")}
              selectedMessage={editMessage}
              onSubmit={() => {
                setActiveTab("list");
                setEditMessage(null);
              }}
            />
          </TabsContent>
        </Tabs>
      </div>
    </Container>
  );
};

export default MotivationalPage;
