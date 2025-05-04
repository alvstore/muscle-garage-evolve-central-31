
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { MotivationalMessage, MotivationalCategory } from '@/types/notification';
import { PlusCircle, Loader2, Check, X } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import MotivationalMessageForm from './MotivationalMessageForm';
import { motivationalMessageService } from '@/services/communicationService';
import { toast } from 'sonner';

const MotivationalMessagesList: React.FC = () => {
  const [messages, setMessages] = useState<MotivationalMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<MotivationalCategory | 'all'>('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  useEffect(() => {
    fetchMessages();
  }, []);
  
  const fetchMessages = async () => {
    setIsLoading(true);
    try {
      const fetchedMessages = await motivationalMessageService.getMotivationalMessages();
      setMessages(fetchedMessages);
    } catch (error) {
      console.error('Error fetching motivational messages:', error);
      toast.error('Failed to load motivational messages');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleCreateMessage = async (message: Partial<MotivationalMessage>) => {
    setIsSubmitting(true);
    try {
      const newMessage = await motivationalMessageService.createMotivationalMessage(message as Omit<MotivationalMessage, 'id' | 'created_at' | 'updated_at'>);
      if (newMessage) {
        setMessages(prev => [newMessage, ...prev]);
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
  
  const filteredMessages = activeCategory === 'all' 
    ? messages 
    : messages.filter(msg => msg.category === activeCategory);
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Motivational Messages</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Message
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <MotivationalMessageForm 
              onSubmit={handleCreateMessage}
              isSubmitting={isSubmitting}
            />
          </DialogContent>
        </Dialog>
      </div>
      
      <Tabs 
        defaultValue={activeCategory} 
        onValueChange={(value) => setActiveCategory(value as MotivationalCategory | 'all')}
      >
        <TabsList className="grid grid-cols-8">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="fitness">Fitness</TabsTrigger>
          <TabsTrigger value="nutrition">Nutrition</TabsTrigger>
          <TabsTrigger value="mindfulness">Mindfulness</TabsTrigger>
          <TabsTrigger value="recovery">Recovery</TabsTrigger>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="motivation">Motivation</TabsTrigger>
          <TabsTrigger value="wellness">Wellness</TabsTrigger>
        </TabsList>
        
        <TabsContent value={activeCategory} className="mt-6">
          {filteredMessages.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center p-6">
                <p className="text-gray-500 mb-4">No messages found in this category.</p>
                <Button variant="outline" onClick={() => setIsDialogOpen(true)}>
                  Create New Message
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredMessages.map((message) => (
                <Card key={message.id}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-center">
                      <CardTitle>{message.title}</CardTitle>
                      <div className="flex items-center space-x-2">
                        <span className={`text-sm ${message.active ? 'text-green-600' : 'text-red-600'}`}>
                          {message.active ? (
                            <Check className="h-4 w-4 inline-block mr-1" />
                          ) : (
                            <X className="h-4 w-4 inline-block mr-1" />
                          )}
                          {message.active ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 dark:text-gray-300 mb-4">{message.content}</p>
                    <div className="flex justify-between text-sm text-gray-500">
                      <span>By {message.author || 'Unknown'} • Category: <span className="capitalize">{message.category}</span></span>
                      <span>{message.created_at && formatDistanceToNow(new Date(message.created_at), { addSuffix: true })}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MotivationalMessagesList;
