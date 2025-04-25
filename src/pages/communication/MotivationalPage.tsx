
import { useState } from "react";
import { Container } from "@/components/ui/container";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import MotivationalMessageForm from "@/components/communication/MotivationalMessageForm";
import MotivationalMessagesList from "@/components/communication/MotivationalMessagesList";
import { MotivationalMessage } from "@/types/notification";
import { useMotivationalMessages } from "@/hooks/use-motivational-messages";

export default function MotivationalPage() {
  const [showForm, setShowForm] = useState(false);
  const [editMessage, setEditMessage] = useState<MotivationalMessage | null>(null);
  
  const { 
    messages, 
    isLoading, 
    createMessage, 
    updateMessage, 
    deleteMessage, 
    toggleMessageActive 
  } = useMotivationalMessages();
  
  const handleFormSubmit = async (message: MotivationalMessage) => {
    if (editMessage) {
      await updateMessage(message);
    } else {
      await createMessage(message);
    }
    
    setShowForm(false);
    setEditMessage(null);
  };
  
  const handleEdit = (message: MotivationalMessage) => {
    setEditMessage(message);
    setShowForm(true);
  };
  
  const cancelForm = () => {
    setShowForm(false);
    setEditMessage(null);
  };

  return (
    <Container>
      <div className="py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Motivational Messages</h1>
          <Button onClick={() => setShowForm(prev => !prev)} className="flex items-center gap-2">
            <Plus size={16} />
            <span>Create Message</span>
          </Button>
        </div>
        
        {showForm ? (
          <MotivationalMessageForm 
            initialMessage={editMessage}
            onSubmit={handleFormSubmit}
            onCancel={cancelForm}
          />
        ) : (
          <MotivationalMessagesList 
            messages={messages}
            isLoading={isLoading}
            onEdit={handleEdit}
            onDelete={deleteMessage}
            onToggleActive={toggleMessageActive}
          />
        )}
      </div>
    </Container>
  );
}
