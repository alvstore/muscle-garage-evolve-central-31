
import { useState } from "react";
import { Container } from "@/components/ui/container";
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
    addMessage, 
    updateMessage, 
    deleteMessage, 
    toggleActive 
  } = useMotivationalMessages();
  
  const handleFormSubmit = async (message: Partial<MotivationalMessage>) => {
    if (editMessage) {
      await updateMessage(message.id!, message);
    } else {
      await addMessage(message);
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

  const handleToggleActive = async (id: string, isActive: boolean) => {
    await toggleActive(id, isActive);
  };

  const handleDelete = async (id: string) => {
    await deleteMessage(id);
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
            initialMessage={editMessage || undefined}
            onSubmit={handleFormSubmit}
            onCancel={cancelForm}
          />
        ) : (
          <MotivationalMessagesList 
            messages={messages}
            isLoading={isLoading}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onToggleActive={handleToggleActive}
          />
        )}
      </div>
    </Container>
  );
}
