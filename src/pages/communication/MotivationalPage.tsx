
import { useState } from "react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import MotivationalMessageForm from "@/components/communication/MotivationalMessageForm";
import MotivationalMessagesList from "@/components/communication/MotivationalMessagesList";
import { MotivationalMessage } from "@/types/communication/notification";
import { useMotivationalMessages } from "@/hooks/communication/use-motivational-messages";

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

  const handleFormSubmit = async (message: Omit<MotivationalMessage, "id" | "created_at" | "updated_at">) => {
    if (editMessage) {
      await updateMessage(editMessage.id, message);
    } else {
      await addMessage(message);
    }
    setShowForm(false);
    setEditMessage(null);
  };

  const handleAddMessage = async (message: Omit<MotivationalMessage, "id" | "created_at" | "updated_at">) => {
    await addMessage(message);
  };

  const handleUpdateMessage = async (id: string, message: Partial<MotivationalMessage>) => {
    await updateMessage(id, message);
  };

  const handleDeleteMessage = async (id: string) => {
    await deleteMessage(id);
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
          <Button onClick={() => setShowForm(!showForm)}>
            <Plus className="mr-2 h-4 w-4" />
            {showForm ? 'Cancel' : 'Add Message'}
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
            onAddMessage={handleAddMessage}
            onUpdateMessage={handleUpdateMessage}
            onDeleteMessage={handleDeleteMessage}
          />
        )}
      </div>
    </Container>
  );
}
