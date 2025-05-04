
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { MotivationalCategory, MotivationalMessage } from '@/types/notification';
import { Loader2 } from 'lucide-react';

interface MotivationalMessageFormProps {
  initialMessage?: MotivationalMessage;
  onSubmit?: (message: Partial<MotivationalMessage>) => Promise<void>;
  isSubmitting?: boolean;
  onSave?: (message: Partial<MotivationalMessage>) => Promise<void>;
  onCancel?: () => void;
}

const MotivationalMessageForm: React.FC<MotivationalMessageFormProps> = ({ 
  initialMessage, 
  onSubmit,
  onSave,
  onCancel,
  isSubmitting = false
}) => {
  const [title, setTitle] = useState(initialMessage?.title || '');
  const [content, setContent] = useState(initialMessage?.content || '');
  const [author, setAuthor] = useState(initialMessage?.author || '');
  const [category, setCategory] = useState<MotivationalCategory>(initialMessage?.category as MotivationalCategory || 'general');
  const [isActive, setIsActive] = useState(initialMessage?.active !== false);

  const handleCategoryChange = (value: string) => {
    setCategory(value as MotivationalCategory);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const messageData = {
      title,
      content,
      author,
      category,
      active: isActive,
    };
    
    if (onSubmit) {
      await onSubmit(messageData);
    } else if (onSave) {
      await onSave(messageData);
    }
  };

  return (
    <Card>
      <form onSubmit={handleSubmit}>
        <CardHeader>
          <CardTitle>
            {initialMessage ? 'Edit Motivational Message' : 'Create Motivational Message'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter message title"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="content">Message Content</Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Enter motivational message content"
              rows={5}
              required
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="author">Author (Optional)</Label>
              <Input
                id="author"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="Author name"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select value={category} onValueChange={handleCategoryChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fitness">Fitness</SelectItem>
                  <SelectItem value="nutrition">Nutrition</SelectItem>
                  <SelectItem value="mindfulness">Mindfulness</SelectItem>
                  <SelectItem value="recovery">Recovery</SelectItem>
                  <SelectItem value="general">General</SelectItem>
                  <SelectItem value="motivation">Motivation</SelectItem>
                  <SelectItem value="wellness">Wellness</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch
              id="active"
              checked={isActive}
              onCheckedChange={setIsActive}
            />
            <Label htmlFor="active">Active</Label>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end space-x-2">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : initialMessage ? 'Update Message' : 'Create Message'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default MotivationalMessageForm;
