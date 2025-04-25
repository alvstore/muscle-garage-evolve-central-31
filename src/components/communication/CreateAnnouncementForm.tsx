
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

interface CreateAnnouncementFormProps {
  onSuccess?: () => void;
}

const CreateAnnouncementForm: React.FC<CreateAnnouncementFormProps> = ({ onSuccess }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      toast.error('Please enter a title for the announcement');
      return;
    }
    
    if (!content.trim()) {
      toast.error('Please enter content for the announcement');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // In a real app, you'd make an API call here
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('Announcement created successfully');
      setTitle('');
      setContent('');
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Error creating announcement:', error);
      toast.error('Failed to create announcement');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create New Announcement</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Announcement title"
              required
            />
          </div>
          
          <div>
            <Label htmlFor="content">Content</Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Announcement content"
              rows={5}
              required
            />
          </div>
          
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Creating...' : 'Create Announcement'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default CreateAnnouncementForm;
