import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { MotivationalMessage, MotivationalCategory } from '@/types';
import { PlusCircle, Loader2, Check, X } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import MotivationalMessageForm from './MotivationalMessageForm';
import communicationService from '@/services/communicationService';
import { toast } from 'sonner';

interface MotivationalMessagesListProps {
  messagesList?: MotivationalMessage[];
  messages?: MotivationalMessage[];
  isLoading?: boolean;
  onEdit?: (message: MotivationalMessage) => void;
  onDelete?: (id: string) => Promise<boolean>;
  onToggleActive?: (id: string, isActive: boolean) => Promise<boolean>;
}

const MotivationalMessagesList: React.FC<MotivationalMessagesListProps> = ({
  messagesList,
  messages,
  isLoading = true,
  onEdit,
  onDelete,
  onToggleActive
}) => {
  const [displayMessages, setDisplayMessages] = useState<MotivationalMessage[]>([]);
  const [activeCategory, setActiveCategory] = useState<MotivationalCategory | 'all'>('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  useEffect(() => {
    if (messagesList) {
      setDisplayMessages(messagesList);
    } else if (messages) {
      setDisplayMessages(messages);
    } else {
      fetchMessages();
    }
  }, [messagesList, messages]);
  const fetchMessages = async () => {
    try {
      const fetchedMessages = await communicationService.getMotivationalMessages();
      setDisplayMessages(fetchedMessages);
    } catch (error) {
      console.error('Error fetching motivational messages:', error);
      toast.error('Failed to load motivational messages');
    }
  };
  const handleCreateMessage = async (message: Omit<MotivationalMessage, 'id' | 'created_at' | 'updated_at'>) => {
    setIsSubmitting(true);
    try {
      const newMessage = await motivationalMessageService.createMotivationalMessage(message);
      if (newMessage) {
        setDisplayMessages(prev => [newMessage, ...prev]);
        setIsDialogOpen(false);
        toast.success('Motivational message created successfully!');
      }
    } catch (error) {
      console.error('Error creating motivational message:', error);
      toast.error('Failed to create motivational message');
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleDeleteMessage = async (id: string) => {
    if (onDelete) {
      return await onDelete(id);
    } else {
      try {
        const result = await motivationalMessageService.deleteMotivationalMessage(id);
        if (result) {
          setDisplayMessages(prev => prev.filter(msg => msg.id !== id));
          toast.success('Message deleted successfully');
        }
        return result;
      } catch (error) {
        console.error('Error deleting message:', error);
        toast.error('Failed to delete message');
        return false;
      }
    }
  };
  const handleToggleActive = async (id: string, isActive: boolean) => {
    if (onToggleActive) {
      return await onToggleActive(id, isActive);
    } else {
      try {
        const result = await motivationalMessageService.updateMotivationalMessage(id, {
          active: isActive
        });
        if (result) {
          setDisplayMessages(prev => prev.map(msg => msg.id === id ? {
            ...msg,
            active: isActive
          } : msg));
          toast.success(`Message ${isActive ? 'activated' : 'deactivated'} successfully`);
          return true;
        }
        return false;
      } catch (error) {
        console.error('Error updating message:', error);
        toast.error('Failed to update message status');
        return false;
      }
    }
  };
  const filteredMessages = activeCategory === 'all' ? displayMessages : displayMessages.filter(msg => msg.category === activeCategory);
  if (isLoading) {
    return <div className="flex justify-center items-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>;
  }
  return <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold">Motivational Messages</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="w-full sm:w-auto">
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Message
            </Button>
          </DialogTrigger>
          <DialogContent className="w-[95%] max-w-[600px] p-4 sm:p-6">
            <MotivationalMessageForm onSubmit={handleCreateMessage} isSubmitting={isSubmitting} />
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="overflow-x-auto">
        <Tabs defaultValue={activeCategory} onValueChange={value => setActiveCategory(value as MotivationalCategory | 'all')}>
          <TabsList className="w-full flex flex-wrap h-auto py-1">
            <TabsTrigger value="all" className="flex-grow">All</TabsTrigger>
            <TabsTrigger value="fitness" className="flex-grow">Fitness</TabsTrigger>
            <TabsTrigger value="nutrition" className="flex-grow">Nutrition</TabsTrigger>
            <TabsTrigger value="mindfulness" className="flex-grow">Mindful</TabsTrigger>
            <TabsTrigger value="recovery" className="flex-grow">Recovery</TabsTrigger>
            <TabsTrigger value="general" className="flex-grow">General</TabsTrigger>
            <TabsTrigger value="motivation" className="flex-grow">Motivation</TabsTrigger>
            <TabsTrigger value="wellness" className="flex-grow">Wellness</TabsTrigger>
          </TabsList>
          
          <TabsContent value={activeCategory} className="mt-6">
            {filteredMessages.length === 0 ? <Card>
                <CardContent className="flex flex-col items-center justify-center p-6">
                  <p className="text-gray-500 mb-4">No messages found in this category.</p>
                  <Button variant="outline" onClick={() => setIsDialogOpen(true)}>
                    Create New Message
                  </Button>
                </CardContent>
              </Card> : <div className="space-y-4">
                {filteredMessages.map(message => <Card key={message.id}>
                    <CardHeader className="pb-2">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                        <CardTitle className="text-base sm:text-lg">{message.title}</CardTitle>
                        <div className="flex items-center space-x-2">
                          <span className={`text-sm ${message.active ? 'text-green-600' : 'text-red-600'}`}>
                            {message.active ? <Check className="h-4 w-4 inline-block mr-1" /> : <X className="h-4 w-4 inline-block mr-1" />}
                            {message.active ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-700 dark:text-gray-300 mb-4">{message.content}</p>
                      <div className="flex flex-col sm:flex-row justify-between sm:items-center text-sm text-gray-500 gap-2">
                        <span>By {message.author || 'Unknown'} • <span className="capitalize">{message.category}</span></span>
                        <span>{message.created_at && formatDistanceToNow(new Date(message.created_at), {
                      addSuffix: true
                    })}</span>
                      </div>
                      {(onEdit || onDelete || onToggleActive) && <div className="flex flex-wrap justify-end gap-2 mt-4">
                          {onToggleActive && <Button variant="outline" size="sm" onClick={() => handleToggleActive(message.id, !message.active)}>
                              {message.active ? 'Deactivate' : 'Activate'}
                            </Button>}
                          {onEdit && <Button variant="outline" size="sm" onClick={() => onEdit(message)}>
                              Edit
                            </Button>}
                          {onDelete && <Button variant="destructive" size="sm" onClick={() => handleDeleteMessage(message.id)}>
                              Delete
                            </Button>}
                        </div>}
                    </CardContent>
                  </Card>)}
              </div>}
          </TabsContent>
        </Tabs>
      </div>
    </div>;
};
export default MotivationalMessagesList;
