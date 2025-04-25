
import React, { useState } from 'react';
import { Container } from '@/components/ui/container';
import { Heading } from '@/components/ui/heading';
import { Button } from '@/components/ui/button';
import { PlusIcon } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useMotivationalMessages } from '@/hooks/use-motivational-messages';
import { MotivationalMessagesList } from '@/components/communication/MotivationalMessagesList';
import MotivationalMessageForm from '@/components/communication/MotivationalMessageForm';
import { MotivationalMessage } from '@/types/notification';

const MotivationalPage = () => {
  const [showForm, setShowForm] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<MotivationalMessage | null>(null);
  const { messages, isLoading, fetchMessages, toggleActive, deleteMessage } = useMotivationalMessages();

  const handleFormComplete = () => {
    setShowForm(false);
    setSelectedMessage(null);
    fetchMessages();
  };

  const handleEditMessage = (message: MotivationalMessage) => {
    setSelectedMessage(message);
    setShowForm(true);
  };

  const handleDeleteMessage = async (id: string) => {
    await deleteMessage(id);
  };

  const handleToggleActive = async (id: string, isActive: boolean) => {
    await toggleActive(id, isActive);
  };

  return (
    <Container>
      <div className="flex justify-between items-center mb-6">
        <Heading title="Motivational Messages" description="Create and manage motivational messages for members" />
        <Button onClick={() => { setSelectedMessage(null); setShowForm(true); }}>
          <PlusIcon className="mr-2 h-4 w-4" /> Add Message
        </Button>
      </div>

      <MotivationalMessagesList 
        messages={messages}
        isLoading={isLoading}
        onEdit={handleEditMessage}
        onDelete={handleDeleteMessage}
        onToggleActive={handleToggleActive}
      />

      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{selectedMessage ? 'Edit Message' : 'Create Message'}</DialogTitle>
          </DialogHeader>
          <MotivationalMessageForm 
            message={selectedMessage}
            onComplete={handleFormComplete} 
          />
        </DialogContent>
      </Dialog>
    </Container>
  );
};

export default MotivationalPage;
