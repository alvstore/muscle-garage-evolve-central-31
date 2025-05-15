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
  const handleFormSubmit = async (message: Omit<MotivationalMessage, "id" | "created_at" | "updated_at">) => {
    if (editMessage) {
      await updateMessage(editMessage.id, message);
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
    return await toggleActive(id, isActive);
  };
  const handleDelete = async (id: string) => {
    return await deleteMessage(id);
  };
  return <Container>
      <div className="py-6">
        
        
        {showForm ? <MotivationalMessageForm initialMessage={editMessage || undefined} onSubmit={handleFormSubmit} onCancel={cancelForm} /> : <MotivationalMessagesList messages={messages} isLoading={isLoading} onEdit={handleEdit} onDelete={handleDelete} onToggleActive={handleToggleActive} />}
      </div>
    </Container>;
}