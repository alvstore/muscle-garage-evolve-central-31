
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from '@/hooks/use-auth';
import { useMotivationalMessages } from '@/hooks/use-motivational-messages';
import { toast } from 'sonner';
import { MotivationalMessage } from '@/types/notification';

interface MotivationalMessageFormProps {
  message?: MotivationalMessage | null;
  onComplete?: () => void;
}

const MotivationalMessageForm: React.FC<MotivationalMessageFormProps> = ({
  message = null,
  onComplete
}) => {
  const { user } = useAuth();
  const { createMessage, updateMessage } = useMotivationalMessages();
  
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<'motivation' | 'fitness' | 'nutrition' | 'wellness'>('motivation');
  const [active, setActive] = useState(true);
  const [tags, setTags] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  useEffect(() => {
    if (message) {
      setTitle(message.title);
      setContent(message.content);
      setCategory(message.category);
      setActive(message.active);
      setTags(message.tags?.join(', ') || '');
    }
  }, [message]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      toast.error('Please provide a title');
      return;
    }
    
    if (!content.trim()) {
      toast.error('Please provide content');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const tagsArray = tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0);
        
      const messageData = {
        title,
        content,
        category,
        active,
        tags: tagsArray,
        author: user?.name
      };
      
      let success;
      
      if (message) {
        success = await updateMessage(message.id, messageData);
        if (success) {
          toast.success('Message updated successfully');
        }
      } else {
        success = await createMessage(messageData);
        if (success) {
          toast.success('Message created successfully');
        }
      }
      
      if (success && onComplete) {
        onComplete();
      } else if (!success) {
        toast.error('Failed to save message');
      }
    } catch (error) {
      console.error('Error saving message:', error);
      toast.error('An error occurred while saving the message');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="message-title">Title</Label>
          <Input
            id="message-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Message title"
            required
          />
        </div>
        
        <div>
          <Label htmlFor="message-category">Category</Label>
          <Select 
            value={category} 
            onValueChange={(value: 'motivation' | 'fitness' | 'nutrition' | 'wellness') => setCategory(value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="motivation">Motivation</SelectItem>
              <SelectItem value="fitness">Fitness</SelectItem>
              <SelectItem value="nutrition">Nutrition</SelectItem>
              <SelectItem value="wellness">Wellness</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="message-content">Content</Label>
          <Textarea
            id="message-content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Message content"
            rows={6}
            required
          />
        </div>
        
        <div>
          <Label htmlFor="message-tags">Tags (comma-separated)</Label>
          <Input
            id="message-tags"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="inspiration, workout, etc."
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="message-active" 
            checked={active} 
            onCheckedChange={(checked) => setActive(checked === true)}
          />
          <Label htmlFor="message-active">Active</Label>
        </div>
      </div>
      
      <div className="flex justify-end space-x-2">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : message ? 'Update Message' : 'Create Message'}
        </Button>
      </div>
    </form>
  );
};

export default MotivationalMessageForm;
