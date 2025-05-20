
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useFeedback } from '@/hooks/communication/use-feedback';
import { useAuth } from '@/hooks/auth/use-auth';
import { toast } from 'sonner';
import { FeedbackType } from '@/types/communication/notification';

export interface FeedbackFormProps {
  onSubmitSuccess?: () => void;
  allowedTypes?: string[];
}

const FeedbackForm: React.FC<FeedbackFormProps> = ({ onSubmitSuccess, allowedTypes = ['general', 'trainer', 'class', 'facility', 'equipment'] }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [feedbackType, setFeedbackType] = useState<FeedbackType>('general');
  const [rating, setRating] = useState(5);
  const [anonymous, setAnonymous] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { submitFeedback } = useFeedback();
  const { user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      toast.error('Please provide a title for your feedback');
      return;
    }
    
    if (!content.trim()) {
      toast.error('Please provide your feedback content');
      return;
    }
    
    setIsSubmitting(true);
    
    const feedbackData = {
      title,
      content,
      type: feedbackType,
      comment: content,
      rating,
      anonymous,
      member_id: user?.id,
      member_name: anonymous ? undefined : user?.name,
      branch_id: user?.branch_id || null
    };
    
    try {
      const success = await submitFeedback(feedbackData);
      
      if (success) {
        toast.success('Thank you for your feedback!');
        setTitle('');
        setContent('');
        setRating(5);
        setAnonymous(false);
        
        if (onSubmitSuccess) {
          onSubmitSuccess();
        }
      } else {
        toast.error('Failed to submit feedback. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting feedback:', error);
      toast.error('An error occurred while submitting your feedback');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="feedback-title">Title</Label>
        <Input
          id="feedback-title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Feedback title"
          required
        />
      </div>
      
      <div>
        <Label htmlFor="feedback-type">Feedback Type</Label>
        <Select 
          value={feedbackType} 
          onValueChange={(value) => setFeedbackType(value as FeedbackType)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select feedback type" />
          </SelectTrigger>
          <SelectContent>
            {allowedTypes.includes('general') && <SelectItem value="general">General</SelectItem>}
            {allowedTypes.includes('facility') && <SelectItem value="facility">Facility</SelectItem>}
            {allowedTypes.includes('trainer') && <SelectItem value="trainer">Trainer</SelectItem>}
            {allowedTypes.includes('class') && <SelectItem value="class">Class</SelectItem>}
            {allowedTypes.includes('equipment') && <SelectItem value="equipment">Equipment</SelectItem>}
            {allowedTypes.includes('service') && <SelectItem value="service">Service</SelectItem>}
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <Label htmlFor="feedback-content">Your Feedback</Label>
        <Textarea
          id="feedback-content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Please share your feedback..."
          rows={4}
          required
        />
      </div>
      
      <div>
        <Label>Rating</Label>
        <div className="flex items-center space-x-2 mt-1">
          {[1, 2, 3, 4, 5].map((value) => (
            <Button
              key={value}
              type="button"
              variant={rating === value ? "default" : "outline"}
              className="px-3 py-1 h-8 min-w-[2.5rem]"
              onClick={() => setRating(value)}
            >
              {value}
            </Button>
          ))}
        </div>
      </div>
      
      <div className="flex items-center space-x-2">
        <Checkbox 
          id="anonymous" 
          checked={anonymous} 
          onCheckedChange={(checked) => setAnonymous(checked === true)}
        />
        <Label htmlFor="anonymous">Submit anonymously</Label>
      </div>
      
      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
      </Button>
    </form>
  );
};

export default FeedbackForm;
